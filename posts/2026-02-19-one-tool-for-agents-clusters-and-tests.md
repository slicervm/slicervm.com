---
title: "One tool for agents, clusters, and e2e tests — locally and in production"
date: "2026-02-19T10:00:00Z
excerpt: "Every AI agent is building its own sandbox. That's the same fragmentation we saw with FaaS in 2016. Slicer gives you one consistent microVM layer for agents, K8s, databases, and anything else that needs real Linux."
author: "Alex Ellis"
tags:
  - "mac"
  - "linux"
  - "sandboxes"
  - "ai"
  - "agents"
  - "kubernetes"
---

Claude Code has its own sandbox. Codex has its own. Cursor is adding one, Amp will have one, and whatever ships next quarter will have yet another.

We'll look at why this fragmentation matters, how to run agents (and much more) in Slicer microVMs on Mac and Linux, and how to close the loop with AGENTS.md so your coding agent tests its own work end-to-end.

**In this post:**

- [The agent sandbox problem](#the-agent-sandbox-problem)
- [Part 1: Local on Mac](#part-1-local-on-mac)
- [Part 2: Production on Linux](#part-2-production-on-linux)
- [Agents are the future, but we still have a job to do today](#agents-are-the-future-but-we-still-have-a-job-to-do-today)
- [The fragmentation problem that Slicer solves](#the-fragmentation-problem-that-slicer-solves)
- [Closing the loop](#closing-the-loop)
- [Appendix: tmux cheat-sheet](#appendix-tmux-cheat-sheet)

Each coding agent has its own interface, acceptable usage, rate limits and integration points. Many are now adding a sandboxing technology to restrict filesystem, compute or network access. Sometimes that's a first-party feature based upon OS primitives, other times, like with Claude Code on Linux, it's bubblewrap, an OSS project.

It creates fragmentation, and we've seen this before.

In 2016, every cloud provider had its own FaaS implementation — Lambda, Cloud Functions, Azure Functions — each with different runtime languages, different limits, different deployment interfaces. If you invested in one, you were locked in. If you switched, you started over. OpenFaaS gave developers a consistent experience that worked across all of them. Learn one tool, run it anywhere.

The AI agent sandbox market is in a similar phase right now. Every tool rolling its own approach means fragmentation for you: different APIs, different security models, different ways to get code in and results out. And it's not just inconvenient — it means your automation, your integrations, your muscle memory all break when you switch agents.

Slicer is the consistent layer. One set of primitives — `vm launch`, `vm cp`, `vm exec`, `vm delete` — that works the same whether you're running Claude Code, Codex, opencode, or Amp. On your Mac or on your own Linux servers. Today and when the next agent ships.

But here's the thing that gets lost in the sandbox conversation: **the same VM that isolates your coding agent also runs a K3s cluster, a real PostgreSQL for e2e tests, or anything else you'd do on a cloud VM.** Why have a single-purposed sandbox tool, when you can get programmable Linux that boots in under a second too?

## The agent sandbox problem

Here is where some of the current solutions fall short:

- **On your host** — you either approve every permission one at a time, or you pass `--dangerously-skip-permissions` and hope for the best. Neither is a workflow, it's a compromise.
- **A SaaS sandbox** — your code leaves your machine, every API call is a network round-trip, and the bill scales with execution time. You're also locked into that vendor's interface and limits.
- **DIY with Docker** — containers share the host kernel and were never designed as a security boundary. One escape and the agent has your SSH keys, your cloud credentials, your browser sessions. Running Docker inside of Docker can be done with hacks, and it's slow. But now compile a Kernel module, and actually load and test it. Good luck with that.
- **The agent's built-in sandbox** — great until you switch agents. Or until you need to run the same isolation for something that isn't an agent at all. Every sandbox (including Slicer) makes tradeoffs, with each change of tool, you have to understand those fully.

We built Slicer microVMs give you hypervisor-level isolation with sub-second boot times. Inside a VM, `--dangerously-skip-permissions` is much less dangerous. The agent gets its own kernel and filesystem. It can't touch your SSH keys, cloud credentials, or browser sessions, because they don't exist inside the VM, unless you explicitly add them.

## Part 1: Local on Mac

macOS is POSIX-compliant, which gives it surprising compatibility with Linux programs — enough that many developers rarely consider the differences. But that compatibility is deceptive. The moment you need Docker, OpenFaaS, iptables, systemd, or any real Linux-specific tooling, macOS falls short and you reach for a VM. Slicer aims to bring that with near-native speed.

Slicer for Mac uses Apple's Virtualization framework to run arm64 Linux VMs natively on Apple Silicon. VMs boot in about half a second. Your home directory (or a sub-path) can be shared into the VM via VirtioFS — not copied, shared. Once mounted, changes the agent makes inside the VM are immediately visible on your Mac, and vice versa.

That last part matters more than it sounds. With a SaaS sandbox, every iteration is: upload file, wait, execute, wait, download result. With Slicer, the file is already there. The agent edits it, you see it. No upload, no download, no network. Local is king for latency.

### Set up

Install the Slicer CLI and activate your license:

```bash
curl -sLS https://get.slicervm.com | sudo bash

slicer activate
```

Download and start the Slicer for Mac daemon:

```bash
curl -sLS https://get.arkade.dev | sudo bash

arkade oci install docker.io/alexellis2/slicer-mac:latest .

./slicer-mac up
```

That's it. You now have a persistent Linux VM (`slicer-1`) running on your Mac.

You can treat it like a WSL2 - a kind of Linux twin for your Mac, for when POSIX just isn't enough.

### Mount the shared folder

The default `slicer-mac.yaml` uses `share_home` with `~/`, which exposes your Mac home directory to the VM via VirtioFS. You can disable this by setting `share_home: ""`.

Then mount it inside the VM:

```bash
export SLICER_URL=`pwd`/slicer.sock

slicer vm shell --token "" slicer-1
```

From the shell:

```bash
sudo mkdir -p /home/ubuntu/home
sudo mount -t virtiofs home /home/ubuntu/home
```

To make this persistent across reboots, add it to fstab:

```bash
echo "home /home/ubuntu/home virtiofs rw,nofail 0 0" | sudo tee -a /etc/fstab
```

Your Mac home directory is now available at `/home/ubuntu/home/` inside the VM. Changes are instant in both directions — no sync, no copy.

### Run an agent on a shared folder

Inside the VM, install your agent of choice:

```bash
arkade get claude

export ANTHROPIC_API_KEY=sk-ant-...

cd /home/ubuntu/home/code/my-project

claude --dangerously-skip-permissions
```

Changes appear instantly on your Mac because VirtioFS is a shared mount, not a sync. There's no upload step, no webhook to poll. The agent writes a file, your editor picks it up.

**Scope the filesystem sharing with a sub-path**

If sharing your entire home directory makes you uncomfortable (fair), restrict it in `slicer-mac.yaml`:

```yaml
share_home: "~/code/"
```

Restart the daemon. The agent can now only see projects under `~/code/`, not your dotfiles, credentials, or anything else.

Later, we'll explore VMs launched via API, when you do that on Slicer for Mac, you can pass a number of shares via API with a tag and a source path. Then you can share the code for a single repository, for a single task.

### Why tmux is currently better than an agent manager

Many people are building their own products to provide a way to manage agent sessions, but this locks you into a single product. [Darren Shepherd learned this the hard way](https://x.com/ibuildthecloud/status/2024493970286620767?s=20), after building a multi-agent session manager for Claude Code, then having a painful realisation that it was against the Terms of Service to do so, with Claude Max Plans.

Tmux naturally does not have that problem. You're just using a terminal multiplexer.

<iframe width="560" height="315" src="https://www.youtube.com/embed/kOWlpUiYNlg?si=A4_jfl4waZxXeDJz" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>

I personally run every agent session and every remote SSH session inside tmux. It helps with terminal rendering (some agents get confused by raw terminal state), but the real value is naming your sessions so you can context-switch between tasks:

```bash
tmux new -s code-review
tmux new -s k3s-debug
tmux new -s feature-auth
```

If you get disconnected or close the terminal, the session survives. Reattach with `tmux attach -t code-review`. For long-running agent tasks this is essential — you don't lose work because your laptop went to sleep.

I keep a split with the agent running on one side and a shell on the other, so I can inspect files or run commands without interrupting the agent's session. See the [tmux cheat-sheet](#appendix-tmux-cheat-sheet) at the end of this post for the key bindings.

### Use a disposable sandbox instead

Sandboxes as a term are overhyped, and overloaded - they can mean almost anything. For Slicer, a sandbox is a disposable VM that is launched via API, and deleted once it gets powered down.

You can also restrict or audit the network activity for a sandbox, so if you're self-hosting services, you can block out all access to your local network.

For one-off tasks where you don't want to touch your persistent VM, launch a sandbox:

```bash
slicer vm launch sbox

slicer vm cp --mode=tar ./my-project sbox-1:/home/ubuntu/my-project

slicer vm exec --cwd /home/ubuntu/my-project sbox-1 -- \
  claude --dangerously-skip-permissions -p "Write tests for main.go"

slicer vm cp --mode=tar sbox-1:/home/ubuntu/my-project ./my-project-result

slicer vm delete sbox-1
```

The sandbox has its own kernel and filesystem. If the agent does something unexpected, delete it and start fresh. The whole cycle — launch, copy in, run, copy out, delete — takes seconds because everything is local. You can also use `vm cp` to copy files in, then `vm shell` to work interactively — no SSH required, which avoids the overhead of key management and connection setup.

## Part 2: Production on Linux

Slicer started out focusing only on Linux, where KVM and Linux networking are flexible, and easy to integrate.

So the same workflow runs on your own servers. Slicer for Linux uses KVM and Firecracker, booting microVMs in under 300ms on modern hardware with a more minimal kernel, and still well under 1s for a full Kernel with Docker, eBPF, Kubernetes support, etc.

This is where it matters for teams building products that need to sandbox code execution — agent platforms, developer tools, SaaS backends.

### The API workflow

On a Linux host with Slicer running, the typical flow is:

1. Create a VM via REST API or Go SDK
2. Copy code or data in via the guest agent
3. Execute commands and retrieve results
4. Destroy the VM

```
┌──────────────┐
│ Your service │
└───────┬──────┘
        │ 1. Create VM (~300ms)
        ▼
┌──────────────────┐      Boot microVM      ┌──────────────┐
│ Slicer REST API  │ ────────────────────►  │  MicroVM     │
└──────┬───────────┘                        └──────────────┘
       │ 2. Copy files in
       │ 3. Execute commands
       │ 4. Retrieve results
       │ 5. Delete VM
       ▼
┌──────────────────┐                        ┌───────────────┐
│ Slicer REST API  │ ────────────────────►  │  (destroyed)  │
└──────────────────┘                        └───────────────┘
```

From the CLI, that looks like:

```bash
slicer new agent --cpu 2 --ram 4 --count 0 --persistent=false > agent.yaml

sudo -E slicer up ./agent.yaml
```

Then for each task:

```bash
# Launch a VM
slicer vm add agent --url http://127.0.0.1:8081

# Copy a project in
sudo -E slicer vm cp --mode=tar ./repo agent-1:/home/ubuntu/repo

# Run the agent
sudo -E slicer vm exec --cwd /home/ubuntu/repo agent-1 -- \
  opencode -p "Review this code and output a summary to /tmp/review.md"

# Copy results out
sudo -E slicer vm cp agent-1:/tmp/review.md ./review.md

# Tear down
sudo -E slicer vm delete agent-1
```

We built an [AI code review bot](https://blog.alexellis.io/ai-code-review-bot/) using this exact pattern and now run it on every PR across the company. A fast, economic model reviews the diff before a human team-mate gets to it — catching issues early so the human reviewer can focus on the trickier, more subtle problems that models still miss.

You'll notice `sudo -E` on the Linux commands. That's because the auth token lives at `/var/lib/slicer/auth/token`, which is root-owned. Running with `sudo -E` lets the CLI read it while preserving your environment variables.

If you'd rather not use sudo for every command, you can authenticate explicitly:

```bash
# Point to the API and pass the token directly
export SLICER_URL=http://127.0.0.1:8081
export SLICER_TOKEN=$(sudo cat /var/lib/slicer/auth/token)

# Or use a token file
export SLICER_TOKEN_FILE=/var/lib/slicer/auth/token

# Then run without sudo
slicer vm cp --mode=tar ./repo agent-1:/home/ubuntu/repo
slicer vm exec --cwd /home/ubuntu/repo agent-1 -- opencode -p "..."
```

You can also pass `--token` or `--token-file` flags directly. On Mac, the daemon uses a Unix socket and `--token ""` since there's no remote auth to worry about.

Slicer's REST API can also be exposed over the Internet using a HTTPS tunnel — [inlets](https://inlets.dev), Cloudflare Tunnels, ngrok, or Tailscale all work. Point `SLICER_URL` at the tunnel endpoint, set your token, and any remote machine can create, manage, and exec into microVMs as if they were local. You'll pick up some additional latency from the tunnel, but the workflow is identical. This is useful when your build server, CI runner, or laptop needs to drive VMs on a different host.

The [Go SDK](https://docs.slicervm.com/tasks/execute-commands-with-sdk/) wraps all of this in proper Go types if you're building a service around it. The [REST API](https://docs.slicervm.com/reference/api/) works if Go isn't your thing.

### Speed matters here too

On a Ryzen 9 9950X3D with the optimised "min" images, we measured 299ms from power-on to `multi-user.target`. The guest agent is ready at ~235ms. That means your code can be executing inside a fresh, isolated VM before most cloud providers have even acknowledged your API request.

For workloads where the agent runs for 30 seconds to a few minutes, that 300ms overhead is noise. For tight loops where the agent iterates many times, it's the difference between feeling interactive and feeling like a deployment pipeline.

We covered the benchmarks in detail in [Getting to sub-300ms microVM sandboxes](/blog/microvms-sandboxes-in-300ms/).

### Custom images

The default Ubuntu LTS image works for most things. If your agents need specific packages pre-installed — Python, Node.js, headless browsers, Claude — you can [build a custom image](https://docs.slicervm.com/tasks/custom-image/) from ours:

```dockerfile
FROM ghcr.io/openfaasltd/slicer-systemd:6.1.90-x86_64-latest

RUN apt-get update && apt-get install -y python3 python3-pip nodejs npm
```

That way the VM boots with everything already installed. No `apt-get` on every launch.

## Agents are the future, but we still have a job to do today

This is the part that matters if you're evaluating Slicer as more than a sandbox tool.

The same microVM that isolates your coding agent is a full Linux system with systemd, networking, and storage. That means you can do everything you'd normally do on a cloud VM — except it boots in under a second and runs on your own hardware.

### Local Kubernetes clusters

Need to test a Helm chart or validate a K3s upgrade? Spin up a cluster in seconds:

```bash
slicer new k3s --cpu 4 --ram 8 > k3s.yaml
sudo -E slicer up ./k3s.yaml

# Install K3s inside the VM
sudo -E slicer vm exec --uid 0 k3s-1 -- \
  bash -c "curl -sfL https://get.k3s.io | sh -"

# Get your kubeconfig
sudo -E slicer vm cp k3s-1:/etc/rancher/k3s/k3s.yaml ./kubeconfig
```

No more waiting 30 minutes for EKS to provision. No Service Now ticket. No cloud bill. And when you're done, `slicer vm delete k3s-1` and it's gone.

You can use kubectl directly inside the VM, or copy the kubeconfig back to your host and use the cluster as a permanent part of your workflow. To do that, forward the Kubernetes API port:

```bash
sudo -E slicer vm forward k3s-1 \
    -L 6443:127.0.0.1:6443

export KUBECONFIG=`pwd`/kubeconfig
```

Then point kubectl at `https://127.0.0.1:6443` using the copied kubeconfig.

We've been using this internally since 2022 to reproduce customer issues and test new features. Where an EKS cluster takes 30-35 minutes and costs real money, a K3s cluster on Slicer takes about 60 seconds and costs nothing beyond the hardware you already own. OpenFaaS Edge (faasd) uses containerd instead of Kubernetes, but it does need a real Linux system. We used to test it with tools like VirtualBox, Vagrant, Lima, or Multipass, but now exclusively use Slicer because it's just that much faster, easier to automate, and more polished.

We'd really miss it if we had to go back to those kinds of tools.

### End-to-end tests with real databases

Containers work fine for unit tests. But if you need to test against a real PostgreSQL, a real Redis, a real system with proper process isolation — not a shoe-horned container based upon a custom init.sh script — a microVM gives you that. Feels more like production.

```bash
slicer new db-test --cpu 2 --ram 4 --persistent=false > db-test.yaml
sudo -E slicer up ./db-test.yaml

sudo -E slicer vm add db-test

# Install and start PostgreSQL
sudo -E slicer vm exec --uid 0 db-test-1 -- \
  bash -c "apt-get update && apt-get install -y postgresql && systemctl start postgresql"

# Copy test suite in, run it
sudo -E slicer vm cp --mode=tar ./test-suite db-test-1:/home/ubuntu/test-suite
sudo -E slicer vm exec --cwd /home/ubuntu/test-suite db-test-1 -- \
  go test -v ./...

# Clean up
sudo -E slicer vm delete db-test-1
```

You can also forward ports from the VM to your host using `slicer vm forward`. If you want to connect to PostgreSQL from your local machine — to run tests from your IDE, or to inspect data with `psql` — forward port 5432:

```bash
sudo -E slicer vm forward db-test-1 \
    -L 127.0.0.1:5432:127.0.0.1:5432
```

Now `localhost:5432` on your host connects to PostgreSQL inside the VM. You can remap to a different local port too — `sudo -E slicer vm forward db-test-1 -L 127.0.0.1:15432:127.0.0.1:5432` if 5432 is already in use. This works with any TCP service: Redis, MySQL, a web server, whatever the VM is running.

Each test run gets a pristine environment. No leftover state from the previous run, no port conflicts, no "it works on my machine." The VM boots, the test runs, you get the result, the VM is destroyed.

### Full Linux for anything else

The point is: once you have programmable Linux that boots in under a second, the use-cases compound. We've seen users run:

- **Docker** - You can install Docker into your Slicer VM and access it like it was local through unix socket forwarding.
- **Headless browser testing** — Puppeteer or Playwright against a real browser in a real OS, not a Docker container pretending to be one.
- **Media processing** — FFmpeg transcoding, Whisper transcription, image manipulation. Copy in, process, copy out.
- **Network appliances** — lightweight routers, firewalls, VPN endpoints. Each in its own isolated VM.
- **Development environments** — a full Linux workspace on your Mac, with Docker, K3s, and your toolchain installed. Your `slicer-1` VM is always there when you need it.

You're not having to run different separate tools for each of these. It's one tool, one API, one CLI.

## The fragmentation problem that Slicer solves

Let me recap the parallel with early serverless more explicitly.

In 2016, if you wanted to run functions as a service, you had to choose: Lambda, Cloud Functions, or Azure Functions. Each had its own CLI, its own deployment model, its own limits on runtime, memory, and execution time. If you built automation around Lambda and then needed to run on GCP, you started over. OpenFaaS gave you one interface that worked everywhere.

Today, if you want to sandbox an AI coding agent, you have to choose: use the agent's built-in sandbox (if it has one), pick a SaaS sandbox vendor, or wire up Docker and hope for the best. Each approach has different APIs, different isolation guarantees, different ways to get files in and out.

And it's worse than the FaaS era, because you're not just choosing a sandbox — you're choosing per agent. Claude Code's sandbox works differently from Codex's, which works differently from whatever Cursor ships. If your team uses multiple agents, or if you switch agents (and you will — the market is moving fast), you're maintaining multiple integration paths.

Slicer collapses that. The same `vm launch`, `vm cp`, `vm exec`, `vm delete` primitives work regardless of which agent you're running inside the VM. Switch from Claude Code to Codex to opencode — the outer workflow doesn't change. Build integrations once, use them everywhere.

And because these are real VMs, not purpose-built sandbox wrappers, the same integration also runs your Kubernetes clusters, your database tests, and your media processing. One tool.

### What about SaaS sandboxes?

SaaS solutions are convenient for getting something up quickly. They usually charge you only for the compute time and storage you use, and have a low barrier to entry.

If you need to launch hundreds of thousands of agents per minute, a SaaS solution means you can make that **someone else's problem**.

But there are real reasons people run their own:

- **Data locality.** If you're running agents against proprietary code, a SaaS sandbox means that code leaves your infrastructure. For a number of teams, that's a non-starter.
- **Latency.** Every SaaS sandbox API call is a network round-trip. Create, copy, exec, retrieve — each adds 50-200ms of latency at minimum. On a Mac, Slicer is local IPC. On your own servers, it's loopback. The agent's feedback loop is fundamentally faster.
- **Predictable cost.** SaaS sandboxes charge per execution-minute. That's fine at low volumes. At hundreds of agent runs per day, the bill gets surprising. Slicer is a flat monthly fee — $25/mo for personal use, $250/mo per daemon for production servers. Unlimited VMs.
- **Consistency.** You pick one vendor's sandbox API, and when you switch agents or add a new workflow, you may need a different tool. With Slicer, you learn the primitives once and they apply to everything.
- **Real isolation.** Docker is not a security boundary. VMs are. Slicer gives you actual hypervisor-level isolation with sub-second boot times. To DIY that with Firecracker directly, you'd need Jailer setup, rootfs management, network configuration, guest agent communication, and storage backends. We've spent years on that so you don't have to.

## Closing the loop

Everything above shows you the primitives. But the real payoff is when your coding agent uses them autonomously.

We add an `AGENTS.md` file to every repository. It tells the agent how to build, test, and validate its own work — including spinning up a Slicer VM. Here's what that looks like in practice:

```markdown
## Testing

After implementing a change, test it end-to-end in a Slicer VM:

1. Build the binary: `go build -o ./bin/myapp .`
2. Launch a sandbox: `slicer vm launch sbox`
3. Copy the binary in: `slicer vm cp --mode=tar ./bin sbox-1:/home/ubuntu/bin`
4. Run the test suite: `slicer vm exec sbox-1 -- /home/ubuntu/bin/myapp --run-tests`
5. Copy results out: `slicer vm cp sbox-1:/tmp/results.json ./results.json`
6. Destroy the VM: `slicer vm delete sbox-1`

If tests fail, fix the issue and repeat from step 1.
```

The agent reads this, implements a feature, builds it, boots a VM, copies the binary in, runs the tests, reads the output, and if something fails — it fixes the code and tries again. By the time your terminal chimes, the feature is implemented, tested on a real Linux system, and you have proven console output.

This saves hours. Instead of reviewing an untested diff and manually verifying it works, you get a complete feedback loop. The agent doesn't just write code — it proves the code works, on a real system, with real isolation. No containers pretending to be Linux, no mocked dependencies.

Slicer has been built by hand since 2022 and shares its core with [Actuated](https://actuated.com). But for the past six months, every change a coding agent makes goes through this loop — boot a VM, run the tests, verify the result. 

We're also been working on `slicer codex` — a sub-command that wraps the agent sandbox flow into a single invocation. Point it at a directory, it launches a sandbox, runs your agent, and hands back the results. It's available now for Codex, with opencode, amp, and Claude Code support coming next.

But `AGENTS.md` is the more powerful pattern, because it works with any agent, any workflow, and it teaches the agent to test its own work. The sub-command is a shortcut. The primitives — `vm launch`, `vm cp`, `vm exec`, `vm delete` — and a well-written `AGENTS.md` are the actual interface.

See also:

- [Slicer for Mac: Preview](/blog/slicer-for-mac-preview)
- [Coding agents on Slicer for Mac](https://docs.slicervm.com/mac/coding-agents/)
- [Run a one-shot task via API](https://docs.slicervm.com/examples/run-a-task/)
- [Go SDK for Slicer](https://github.com/slicervm/sdk)
- [Getting to sub-300ms microVM sandboxes](/blog/microvms-sandboxes-in-300ms/)
- [Pricing and free trial](https://slicervm.com/pricing)
