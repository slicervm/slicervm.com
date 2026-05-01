---
title: "Inspect and filter every HTTP request leaving your microVM"
date: "2026-05-01T10:00:00Z"
excerpt: "Slicer's new proxy lets you inspect and filter HTTP requests egressing your microVM, and keep secrets away from workloads."
author: "Alex Ellis"
tags:
  - "ai"
  - "agents"
  - "sandbox"
  - "egress"
  - "policy"
---

Last week we introduced [Slicer's Certificate Authority (CA) support](/blog/intercepting-filtering-agent-traffic/) - the foundation for inspecting and mutating egress traffic via a host-side proxy. This week: how to define fine-grained egress rules per-VM, including secret injection, path and method allow-listing, and request rewriting.

Slicer can be used in multiple ways from hosting core infrastructure like web servers, Kubernetes, OpenFaaS, or CI runners in isolated microVMs, to running AI agents on your local Mac, to sandboxing automated tasks like agent-driven code reviews.

Before we get into the concepts and design decisions, let's see how it works with a real example. LLM inference from a microVM, where we don't want to leak the real token into the VM.

## Secret injection in four commands

Start up `slicer proxy` (built-in), but optional, it'll listen on 3128 (HTTP), 3129 (HTTPS).

```bash
slicer proxy up \
  --hostgroup lab \
  --bind 192.168.222.1 \
  --deny-cidr 192.168.1.0/24
```

Define a client, and receive their token for the proxy:

```bash
TOKEN="$(slicer proxy client create codereview-1 --url ./slicer.sock)"
```

Define a secret - this can be granted or removed from any client via the API:

```bash
slicer proxy secret create llama \
  --host qwen36.cambs1.tryinlets.dev \
  --from-file "$HOME/llama-bearer.txt" \
  --url ./slicer.sock
```

Grant the client access to the inference endpoint, and the secret, but limit it to just the POST verb and completions path.

```bash
slicer proxy allow codereview-1 \
    --host qwen36.cambs1.tryinlets.dev \
    --secret llama \
    --method POST \
    --path /v1/chat/completions \
    --url ./slicer.sock
```

Then you can use that within anything - from your local machine, from a Docker container, from a Kubernetes Pod, from an OpenFaaS function, or of course, within a microVM:

```bash
# Launch a VM and get its name
VM_NAME="$(slicer vm launch lab --wait --json \
  --tag task=review \
  --tag owner=alex \
  | jq -r '.hostname')"

# Access inference via the built-in exec command:
slicer vm exec $VM_NAME --env HTTPS_PROXY="http://proxy:${TOKEN}@192.168.222.1:3128" \
  -- \
  curl -sS https://qwen36.cambs1.tryinlets.dev/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"local","messages":[{"role":"user","content":"Reply OK"}],"max_tokens":4}'
```

All of the above, including the slicer proxy can be automated through the Go SDK or TypeScript SDK.

So, that's the core shape of "slicer proxy" - the rest of this post is why it looks the way it does.

## The war of the clones

It's a new era of AI generated code: many people are building HTTP CONNECT proxies for the first time, and coding agents like Claude and Codex are doing all the heavy lifting for them. That has meant that most new egress filtering solutions look very similar. As [we noted](/blog/intercepting-filtering-agent-traffic/) last week, Squid has done this for 30 years and is battle-tested.

So we held back, and when we were ready built upon our past experience:

* [OpenFaaS](https://openfaas.com) - at its core, is a reverse proxy and load-balancer for functions serving HTTP
* [Inlets](https://inlets.dev) - TCP L4 and HTTP L7 tunneling solution over websockets
* [Reviewfn](https://slicervm.com/blog/evolving-our-code-review-bot-with-slicer-sandboxes/) - our internal code review bot which runs in Slicer with a tight firewall, credential injection and OAuth support
* [actuated-egress](https://actuated.com/blog/egress-filtering) - full CA MITM solution to run a fast local cache server replacement for GitHub Actions, along with SNI-level filtering/blocking

And there's been a bit of everything in between over the past 10 years. None of these use-cases are new, novel, or unsolved problems. We've actually built this properly because we've built (and had to use) every component before.

## What we need from a proxy

The market was telling us a proxy needed the following:

**Secrets injection**

An AI agent accessing an LLM should not know its secret, but have it magically inserted one level up. Why?

What happens when AWS keys get leaked? Crypto miners get on the case, and suddenly you have a 4-6 figure bill land in your account. The same applies with LLMs, they're a highly sought after resource.

Typically developers maintain a number of secrets in their environments to publish npm packages, pull or push container images, SSH into a remote server, you name it. Yes secrets managers do exist, but typically require an interactive desktop environment with keychain support.

If you keep the secret out of the microVM, the agent cannot leak the token, neither can a supply chain attack steal that token.

But there's one part that every vendor leaves out - this does not magically enforce any policy or authorization. The workload in the VM still has access to the privileged resource.

**OAuth - conspicuously absent**

We generally see OAuth missing from most SaaS and OSS egress filtering solutions.

However, just about every coding plan from Claude, to ChatGPT Pro, to GitHub Copilot uses OAuth credentials for personal and individual plans, some use it for business/enterprise plans too. These are the equivalent of Personal Access tokens and do not belong in a sandbox with claude running `--dangerously-skip-permissions`, even if you are using it yourself.

Proxying OAuth is not trivial, and for what is supposed to be a "standard", you'll find each of these LLM providers has differing required headers, user-agents and authentication rules. [Drew Gregory at Formal.ai](https://www.formal.ai/blog/using-proxies-claude-code/) walked through the gory details earlier this year — different headers, different user-agents, different auth rules per provider, all proxied through [MITMProxy](https://github.com/mitmproxy/mitmproxy) add-ons.

**Default deny**

Some workloads are just too risky to run, even with a hand-picked, heavily-curated list of allowed hostnames. Cloning a repo from a stranger before reading it. Running a one-shot agent against an unfamiliar API. Anything where you want to see the egress before you trust it.

Slicer's proxy needed to be able to deny all traffic, but also to be reprogrammed mid-flight for things like code-review, vulnerability probing, and exploring untrusted code.


**HTTP Paths, and Methods**

There's a common place where filtering only on a request's HTTP method breaks down.

Elastic Search uses a HTTP body for a `GET` request.

GraphQL sends all its queries and mutations in an HTTP POST with body. You have to parse the graphQL query itself to understand whether it's a mutation or query. On [X recently](https://x.com/lifeof_jer/status/2048103471019434248?s=20), a user shared how Claude Code made a POST request to a vendor's GraphQL endpoint, and it ended up deleting his production volume for a database backup.

It is not enough to simply say "we block HTTP DELETE methods".

## How Slicer Proxy works

Slicer's proxy ships with Slicer as standard, but it's not built-in the way Cloudflare or Vercel's is. It's the default we support - you can just as easily use Squid, something off GitHub, or something Claude cooked up overnight.

The obvious design is to mint a sentinel per secret and ship it into the VM. The trade-off shows up fast: each sentinel is single-use (compromised the moment the workload sees it), so twelve secrets means twelve arbitrary strings to provision, expire and rotate.

Slicer separates the nouns. Register a client, register secrets, then bind them for a period and let them expire. Clients are identified by the auth header they send to the proxy — no fake secrets, no source-IP heuristics.


```
┌─ client ──────────┐         ┌─ secret ─────────────┐
│  name             │         │  name                │
│  token            │         │  type    bearer |    │
└─────────┬─────────┘         │          basic-auth |│
          │                   │          oauth       │
          │ owns              │  value               │
          │                   └──────────┬───────────┘
          │                              │
          │                              │ optional
          │                              │
┌─────────▼──────────────────────────────▼───────────┐
│  allow rule                                        │
│                                                    │
│  host                                              │
│  paths                                             │
│  methods                                           │
│  ports                                             │
│  ttl                                               │
└────────────────────────────────────────────────────┘
```

* A client owns zero or more allow rules - no rules means default deny
* An allow rule may be bare for access to a domain for a given TTL (automatic expiry)
* Or an allow rule may also reference a secret — when it does, the proxy injects the credential into matching requests.

In the diagram below, we see a microVM that has been booted up, and given a `HTTPS_PROXY` value with a specific authentication token for the proxy. This is how we identify the microVM and client.

```
┌─ Host ──────────────────────────────────────────────────────────────┐
│                                                                     │
│   ┌─ Slicer + API ─────┐    ┌─ Slicer Proxy ─────────────────────┐  │
│   │  Control plane     │    │  Dummy adapter  192.168.222.1      │  │
│   │                    │    │                                    │  │
│   │                    │    │   :3128   HTTP_PROXY               │  │
│   │                    │    │   :3129   HTTPS_PROXY              │  │
│   └────────────────────┘    └────────────────────────────────────┘  │
│                                            ▲                        │
└────────────────────────────────────────────┼────────────────────────┘
                                             │ egress
┌─ Network namespace · isolated mode ────────┼────────────────────────┐
│                                            │                        │
│   ┌─ microVM ──────────────────────────────┴─────────────────────┐  │
│   │                                                              │  │
│   │   Drop   0.0.0.0/0                                           │  │
│   │   Allow  192.168.222.1:3128, 192.168.222.1:3129              │  │
│   │                                                              │  │
│   │   HTTPS_PROXY=https://proxy:spi_REDACTED@192.168.222.1:3129  │  │
│   │                                                              │  │
│   └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

This gives us the following workflow when we want to launch a microVM with filtered egress policy:

1. Define a client and keep track of its token
2. Define any secrets it may need i.e. an LLM token
3. Grant the client access to specific websites, and optionally reference the secret

Then boot up the VM, and pass in the proxy reference such as `HTTPS_PROXY=https://proxy:spi_REDACTED@192.168.222.1:3129`.

For more dynamic workloads, the grants can be made during execution and are effective immediately.

## Stage-by-stage policy

When I used OpenAI's web-based sandbox, I observed it operate with full Internet access whilst it was cloning code from GitHub, running `go get` and then switch to a default deny policy whilst it ran `go build` and iterated on the code.

You can do the same with Slicer, and to us it made complete sense that Internet access should be granular and controlled by policy throughout the lifecycle of the VM itself.

This works best when your workload is driven by code. I'll repeat the CLI example we started with, but written with Slicer's Go SDK:

```go
package main

import (
	"context"
	"log"
	"os"
	"strings"

	sdk "github.com/slicervm/sdk"
)

func main() {
	ctx, host, client, secret := context.Background(), "qwen36.cambs1.tryinlets.dev", "codereview-1", "llama"
	c := sdk.NewSlicerClient("./slicer.sock", "", "proxy-llama-demo/1.0", nil)

	created, err := c.CreateProxyClient(ctx, client, "")
	must(err)
	defer c.DeleteProxyClient(ctx, client)

	bearer, err := os.ReadFile(os.ExpandEnv("$HOME/llama-bearer.txt"))
	must(err)
	must(c.CreateProxySecret(ctx, sdk.CreateProxySecretRequest{
		Name:  secret,
		Host:  host,
		Value: strings.TrimSpace(string(bearer)),
	}))
	defer c.DeleteProxySecret(ctx, secret)

	must(c.AddProxyAllow(ctx, sdk.AddProxyAllowRequest{
		Client:  client,
		Host:    host,
		Secret:  secret,
		Methods: []string{"POST"},
		Paths:   []string{"/v1/chat/completions"},
	}))

	node, err := c.CreateVMWithOptions(ctx, "lab",
		sdk.SlicerCreateNodeRequest{Tags: []string{"task=review", "owner=alex"}},
		sdk.SlicerCreateNodeOptions{Wait: sdk.SlicerCreateNodeWaitAgent},
	)
	must(err)

	cmd := c.CommandContext(ctx, node.Hostname, "curl", "-sS",
		"https://"+host+"/v1/chat/completions",
		"-H", "Content-Type: application/json",
		"-d", `{"model":"local","messages":[{"role":"user","content":"Reply OK"}],"max_tokens":4}`,
	)
	cmd.Env = []string{"HTTPS_PROXY=http://proxy:" + created.Token + "@192.168.222.1:3128"}

	out, err := cmd.CombinedOutput()
	must(err)
	log.Printf("upstream said: %s", strings.TrimSpace(string(out)))
}
```

## Careful what you wish for

A strict allow-list is like an end-to-end test suite: useful when it's green, brittle when it isn't. We learned this with [Actuated](https://actuated.com/blog/egress-filtering) — customers asked for SNI filtering, used it, then quietly drifted off after the third broken build from a CDN nobody had on the list. Agents are kinder to allow-lists than CI is, but the pattern still bites: the wider the list, the more maintenance; the narrower the list, the more breakage.

From my time at ADP I interacted with an HTTP proxy every day, and the friction was real, and containers amplified it. We're doing what we can to minimise that — including a transparent helper that runs inside the microVM so applications don't have to be configured at all:

```bash
export HTTPS_PROXY="http://proxy:${TOKEN}@192.168.222.1:3128"
slicer-agent proxy install
```

Run that in userdata and DNS, HTTP, and HTTPS get routed through the proxy without per-application config.
The one caveat — present in every inspecting proxy — is that Docker and BuildKit need explicit configuration and some base images will need the custom CA installed. It's an industry-wide problem, and most SaaS sandboxes solve it by simply not supporting containers.

## Wrapping up and next steps

**Try it**

Our team - including GPT, Opus, and Qwen - have had far too much fun playing with `slicer proxy` already. It's now over to you - just run `sudo slicer update` on your Linux machine, and you can start experimenting today. As usual, we're ready and waiting on Discord to answer questions, and lend a hand.

Next up will be: a write-up of the harder cases - more on Docker/BuildKit, pinned TLS certs, websocket tunnels, and how Slicer handles agents that need to talk to multiple OAuth providers in the same session. We'll also be showing you how to get "slicer proxy" working directly on your Mac for Slicer For Mac.
