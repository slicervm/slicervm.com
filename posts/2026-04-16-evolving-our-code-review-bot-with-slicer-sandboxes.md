---
title: "Evolving Our Code Review Bot with Slicer Sandboxes"
date: "2026-04-16T10:00:00Z"
excerpt: "We shipped our first code review bot in 2025 - we've since tightened up network egress, moved from SSH to native primitives, and ran local models for IP reasons."
author: "Alex Ellis"
tags:
  - "ai"
  - "agents"
  - "sandboxes"
  - "code-review"
  - "linux"
---

Back in November 2025, I [wrote about our code review bot](https://blog.alexellis.io/ai-code-review-bot/) that used Slicer microVMs to review pull requests. At the time, GitHub was pushing their built-in code review bot, but we found it lacked depth and was hard to customise.

The workflow has remained the same: the code is cloned using a short-lived JWT, then a microVM boots, the [opencode](https://opencode.ai/) agent queries an LLM, writes REVIEW.md, comments on the PR, and the VM is terminated.

In the past our developers would send up a PR and walk away from it, waiting for a human to review it. Since November 2025, the bot has reviewed every one of our team's PRs. Now, we open a PR and see it's already had 2-3 revisions, and we can focus on architecture and intent instead of whether someone forgot a nil check.

Slicer has evolved alongside the bot, adding first-class sandbox operations that make the workflow shorter and safer:

- **Blocking launch** - `CreateVMWithOptions` with `WaitReady` blocks until the VM is ready, no polling loops
- **Filesystem watch** - watch the review output with real-time notifications via `WatchFS`
- **Direct filesystem operations** - `CpToVM`, `ReadFile`, `ReadDir` with binary-safe file transfer, replacing SSH
- **Streaming execution** - `Exec` with real-time stdout/stderr channels
- **Egress filtering** - `--net=isolated` airgap, only the proxy can reach out, secrets stay on the host

## The old workflow

Here's what the original bot looked like:

```
┌──────────────┐     Webhook      ┌────────────────────────────────────────────────┐
│   GitHub     │ ───────────────► │  Your Server                                   │
│              │                  │                                                │
│  PR opened   │                  │  1. Clone repo (short-lived token from App key)│
│  PR updated  │                  │  2. Spawn microVM                              │
│  PR closed   │                  │  3. Poll for readiness                         │
│              │                  │  4. Copy tar via SSH                           │
│              │                  │  5. Exec agent via SSH                         │
│              │                  │  6. Copy out via SSH                           │
│              │                  │  7. Delete VM                                  │
│              │                  │                                                │
│              │                  │  Proxy: dummy key in VM, real creds on host    │
│              │                  │  Network: full internet access                 │
└──────────────┘                  └────────────────────────────────────────────────┘
```

The original approach already used microVMs and the proxy model - a dummy key in the VM with real credentials injected during egress, at the host boundary. We never let secrets enter the VM, but if someone had managed to inject a prompt, it had full access to our office's LAN and the Internet.

Here's what we set out to make better:

1. **Polling for readiness** - the old workflow repeatedly checked if the VM was up and the guest agent was ready. Each poll was a round-trip HTTP request adding latency.
2. **SSH overhead** - SSH was a stand-in for authentication, exec, and file copying. Slicer now has a mature API for direct filesystem manipulation and streaming exec, so SSH is no longer needed. Key generation added latency too.
3. **Boot time** - the boot time was already quick, but we knew our minimal image could make it faster whilst reducing the surface area in the VM.
4. **Secrets management** - the dummy token + proxy model kept real API keys out of the VM. In time we'll add built-in egress filtering as a convenience, but the proxy we have now functions exactly as designed and handles tricky OAuth flows.
5. **Timeout** - we implemented a "transaction-level" timeout that covers the Git clone, boot, and the agent's operations.

## The new primitives

### Blocking launch: `WaitReady`

The simplest improvement: instead of launching a VM and then polling `vm list` or `vm ready` in a loop, the Go SDK now supports blocking launch:

```go
node, err := slicerClient.CreateVMWithOptions(ctx, hostGroup.Name,
    sdk.SlicerCreateNodeRequest{
        Userdata: userdata,
    }, sdk.SlicerCreateNodeOptions{
        Wait: sdk.SlicerCreateNodeWaitAgent,
    })
```

This blocks until the VM is fully booted and the guest agent is ready to accept commands. One call, one return. No polling, no retries, no race conditions.

For the code review bot, this means the workflow goes from:

```go
// Old: poll until ready
vm, _ := client.CreateVM(ctx, "review-sbox")
for i := 0; i < 30; i++ {
    if ready, _ := client.IsReady(ctx, vm.Name); ready {
        break
    }
    time.Sleep(time.Second)
}

// New: one call
node, _ := slicerClient.CreateVMWithOptions(ctx, hostGroup.Name,
    sdk.SlicerCreateNodeRequest{Userdata: userdata},
    sdk.SlicerCreateNodeOptions{Wait: sdk.SlicerCreateNodeWaitAgent})
```

Or with the CLI, the old pattern was:

```bash
# Old: poll until ready
slicer vm launch review-sbox
for i in {1..30}; do
  if slicer vm ready review-sbox; then break; fi
  sleep 1
done
```

Which is now simply:

```bash
slicer vm launch review-sbox --wait
```

That's not just cleaner - it's faster. Each poll was a round-trip to the API. The blocking call eliminates all of that.

### Filesystem watch with SSE

When the review agent writes its output file, the old workflow had to poll to detect it. Now, the Go SDK can watch the filesystem and push events via Server-Sent Events:

```go
watchEvents, watchErrs := slicerClient.WatchFS(ctx, node.Hostname,
    sdk.SlicerFSWatchRequest{
        Paths:    []string{"/home/ubuntu/workdir"},
        Patterns: []string{"REVIEW.md"},
        Events:   []string{"create", "write"},
        OneShot:  true,
        Debounce: "2s",
    })

select {
case evt, ok := <-watchEvents:
    if ok {
        log.Printf("FS watch detected REVIEW.md: type=%s", evt.Type)
    }
case watchErr, ok := <-watchErrs:
    if ok && watchErr != nil {
        return watchErr
    }
case <-ctx.Done():
    return ctx.Err()
}
```

Or with the CLI:

```bash
slicer fs watch sbox-1 /home/ubuntu/repo --stream
```

This streams filesystem events (create, modify, delete) in real-time. When the agent writes `REVIEW.md`, you get the event instantly, without polling.

Behind the scenes, this uses inotify on the host side and the guest agent to bridge events from inside the VM.

### Direct filesystem operations

The `slicer cp` command and Go SDK methods are built from scratch to be binary-safe, support streaming, and work without SSH - replacing the old SSH-based approach with a cleaner, faster path:

```go
// Copy a tar archive into the VM
slicerClient.CpToVM(ctx, node.Hostname, "pr.tar.gz",
    "/home/ubuntu/pr.tar.gz", 1000, 1000, "0700", "binary")

// Read the review output
reviewData, _, err := slicerClient.ReadFile(ctx, node.Hostname,
    "/home/ubuntu/workdir/REVIEW.md")

// List directories, stat files, create dirs - all through the guest agent
entries, _ := slicerClient.ReadDir(ctx, "sbox-1", "/home/ubuntu/repo")
```

Or with the CLI:

```bash
# Copy a file into the VM
slicer vm cp ./pr.tar.gz sbox-1:/home/ubuntu/pr.tar.gz

# Copy a single file out
slicer vm cp sbox-1:/home/ubuntu/REVIEW.md ./REVIEW.md
```

Copying a directory streams a tar archive through the guest agent - binary-safe, no intermediate files, no SSH keys. This handles binary files, symlinks, permissions, and large directories.

### Egress filtering and isolated networking

The old bot had the proxy and dummy key, but the VM had full internet access - it could reach any service on the network. `--net=isolated` was added to solve this, creating an airgap:

```
┌──────────────────────────────────────────────────────┐
│                    Host (you)                        │
│                                                      │
│  ┌──────────┐    API key    ┌──────────┐             │
│  │  Secrets │ ◄──────────── │  Proxy   │             │
│  │  (host)  │               │  (host)  │             │
│  └──────────┘               └────┬─────┘             │
│                                  │  proxied LLM      │
├──────────────────────────────────┼───────────────────┤
│                                  │                   │
│  ┌──────────────────────────────┐▼───────────────┐   │
│  │         MicroVM              │   Airgap       │   │
│  │                              │   (allow       │   │
│  │  Agent runs here             │    proxy only) │   │
│  │  Dummy key, no real secrets  │                │   │
│  └───────────────────────────────────────────────┘   │
│                                                      │
│  Proxy injects real credentials on behalf of agent   │
└──────────────────────────────────────────────────────┘
```

The VM uses a dummy API key - it never sees real credentials. `--net=isolated` creates an airgap: the only way out is through the proxy on the host, which injects the real credentials and forwards requests to the LLM.

The agent can do whatever it wants inside the VM - it can't exfiltrate credentials, it can't call external APIs, it can't reach your infrastructure. The airgap ensures it, and you control what goes through the proxy.

### Streaming exec

For long-running review tasks, the Go SDK supports streaming exec - commands run inside the VM and you receive stdout/stderr in real-time via a channel. This is new since the first version of the bot, which used SSH-based exec:

```go
resChan, err := slicerClient.Exec(ctx, node.Hostname, sdk.SlicerExecRequest{
    Command: "opencode",
    Args:    []string{"run", "./PROMPT.md", "-m", model},
    UID:     1000,
    GID:     1000,
    Shell:   "/bin/bash",
    Cwd:     "/home/ubuntu",
})

for res := range resChan {
    if len(res.Error) > 0 {
        return errors.New(res.Error)
    }
    fmt.Print(res.Stdout)
}
```

Or with the CLI:

```bash
slicer vm exec sbox-1 -- \
  opencode run ./PROMPT.md -m opencode/grok-code
```

The command runs and you get output as it arrives. You can check its exit code, stream to the terminal, or let it run independently. Combined with filesystem watch, the whole review loop reads top to bottom: launch the review, watch for the output file, copy it out when it appears.

## The new workflow

Here's what the updated architecture looks like:

```
┌────────┐     Webhook      ┌──────────────────────────────┐    ┌──────────┐
│ GitHub │ ──────────────►  │  Host (you)                  │    │ LLM      │
│        │                  │                              │───►│ (public) │
│ PR     │                  │  ┌───────────┐   ┌─────────┐ │    └──────────┘
│ events │                  │  │  Secrets  │   │  Proxy  │ │
│        │                  │  │  (host)   │   │  :3129  │ │
└────────┘                  │  └───────────┘   └────┬────┘ │
                            │                       │      │
                            │  ┌────────────────────▼────┐ │
                            │  │  reviewfn (Go SDK)      │ │
                            │  │  [vm-1 - vm-N]          │ │
                            │  └─────────────────────────┘ │
                            │                              │
                            │  --net=isolated              │
                            └──────────────────────────────┘
```

All LLM calls go through the proxy on the host, which is the only allowed egress destination via `--net=isolated`.

The opencode binary is copied directly from the host into the guest. We update the Slicer base image daily and overlay the binary from the host - stable base, fresh tooling, no custom Docker image to maintain.

The min image boots in 200-300ms on modern hardware and its guest agent is ready for calls immediately. [Learn more about the 300ms boot](/blog/microvms-sandboxes-in-300ms/).

We also considered local models. In an ideal world, we'd rather keep ownership of our source code unambiguous - who owns the IP, and whether inputs or outputs end up as training data. We opt out of those arrangements where we can, but most providers still keep a 30 day retention window on inputs and outputs. A locally-hosted model removes that ambiguity.

Smaller models flagged too many false positives in Go - hallucinating race conditions and misreading context usage. [Qwopus3.5-27B-v3](https://huggingface.co/Jackrong/Qwopus3.5-27B-v3-GGUF) from Jackrong - a fine-tune of [Qwen 3.5 27B by Alibaba Cloud](https://huggingface.co/Qwen/Qwen3.5-27B) - handled idiomatic Go better and quieted most of that noise. It's a community project, and one we're happy to support.

The updated steps:

1. **Clone repo** - Short lived token minted using GitHub App's private key, no credentials in the VM
2. **Launch and wait** - no polling, one SDK call, agent ready immediately
3. **Copy in** - binary-safe tar stream via `CpToVM`
4. **Run with streaming output** - `Exec` with real-time stdout/stderr via channels
5. **Watch for results** - event stream, instant notification
6. **Read file directly** - `ReadFile` from the VM
7. **Comment on PR** - post the review, then tear down the VM

In short, the workflow is more event-driven, and the SDK does the orchestration, instead of SSH.

## Wrapping up

We've been running this updated workflow on every PR across the company for months now. A fast, economic model reviews the diff before a human teammate gets to it - catching issues early so the human reviewer can focus on the harder judgement calls.

These primitives are all available now in Slicer. The sandbox stops being an SSH target and becomes something you talk to through files and events. You launch it, stream output, react to files as they're written, and tear it down when done. No SSH, no polling, no secrets on the VM.

We are preparing reviewfn as an open source solution in response to user demand. The project has been red-teamed using Codex CLI and Claude Code. Malicious prompt injection remains a hard problem to solve, however we think its impact is low in this use-case. There is nothing of value inside the VM to exfiltrate and no meaningful compute or network access an agent could exploit. We plan to release reviewfn to the community shortly, both as a working code review bot and as a reference for sandboxing untrusted workloads.

## Get started with Slicer

If you're interested, you can try Slicer with a [free trial](https://slicervm.com/pricing) and see the [Go SDK](https://docs.slicervm.com/platform/go-sdk/) or [TypeScript SDK](https://docs.slicervm.com/platform/typescript-sdk/) for building your own agent workflows.

See also:

- [One tool for agents, clusters, and e2e tests](/blog/one-tool-for-agents-clusters-and-tests)
- [Getting to sub-300ms microVM sandboxes](/blog/microvms-sandboxes-in-300ms/)
- [Slicer platform: overview](https://docs.slicervm.com/platform/overview/)
