---
title: "Intercepting and Filtering Agent Traffic with Slicer"
date: "2026-04-24T10:00:00Z"
excerpt: "We've now built in custom CA generation, and injection into Slicer as a native feature. So you can filter egress traffic and inject secrets."
author: "Alex Ellis"
tags:
  - "ai"
  - "agents"
  - "sandbox"
  - "egress"
  - "policy"
---

You can now boot a Slicer VM that trusts a Certificate Authority you control, which means you can put any MITM proxy in front of it and get URL-level visibility and policy over every outbound TLS connection. This post walks through it end to end with Squid as the example, but the mechanism is proxy-agnostic.

Slicer is a fast and convenient way to sandbox and isolate workloads like coding agents - and while compute isolation matters, networking is where most of the interesting attack surface lives. Before this release, wiring a MITM proxy in front of a sandboxed VM meant generating a CA by hand, getting its public cert into the image or a config drive, running `update-ca-certificates`, and keeping all of that in sync across host groups. Most people didn't bother.

## Prior work: Isolated Networking mode

In December 2025 we launched [isolated network](/isolated-network-mode/) mode which meant a microVM could have its network egress controlled at the IP address level (iptables FORWARD rules matching on destination CIDR). The main use-cases we saw were: blocking all traffic (i.e. an airgap), blocking selective network ranges (like your home or office LAN) and allowing traffic to certain IP addresses like a proxy or an internal database server.

The following policy blocks all egress, and allows access to a single internal-only machine, where we could run something like an intercepting HTTP proxy.

```yaml
network:
  drop: [0.0.0.0/0]
  allow: [192.168.137.1]
```

## Intercepting or Man In the Middle (MITM) proxies

Many SaaS-based solutions from Fly, to Vercel, to Cloudflare, and various others have implemented their own Man In the Middle (MITM) proxies, in order to inspect and mutate HTTP requests. These rely on a custom Certificate Authority being set up on the host, and then having its public key injected into the trust bundle of any VM you launch.

[Squid](https://www.squid-cache.org/) has been doing this since 1996. A lot of what's being marketed as groundbreaking in the current wave of agent-sandboxing products is, under the hood, the same pattern Squid has run in hospitals, schools, and corporate offices for three decades: TLS interception, URL logging, category blocking. That's not a criticism; reliable old patterns are good, and most of the hard work was done by someone else thirty years ago.

The interesting question in 2026 isn't how to intercept TLS. It's how to make per-VM CA injection and strong isolation boring enough that every agent task can run in its own sandbox without a runbook. That's the plumbing Slicer focuses on. The proxy is whatever you want it to be.

The proxy substitutes its own certificate for the real one, terminates TLS, and re-originates the connection upstream - hence Man-In-The-Middle.

```
┌──────────┐    ┌───────────┐    ┌──────────────┐
│ Client   │    │  Proxy    │    │ wikipedia.org│
│          │    │ (MITM)    │    │   (Real)     │
│ https:// │───▶│           │───▶│              │
│ wikipedia│    │ Generates │    │              │
│   .org   │    │ fake cert │    │              │
│          │◀───│           │◀───│              │
└──────────┘    └───────────┘    └──────────────┘
```

In order for this to work, the public key of the CA must be installed into the trust bundle of the VM. This usually means placing the cert at `/usr/local/share/ca-certificates/` (or equivalent for the OS), and running `update-ca-certificates`.

For sandboxing agents on your own infrastructure, you don't need the HSM-and-intermediates complexity that production PKI requires - Slicer handles the CA lifecycle for you, injecting the public certificate into each VM at boot time.

There are two modes:

1. Slicer generates a CA key pair (signing key + public certificate) which it owns and renews.
2. Slicer references an existing CA key pair that you or an external program will secure, maintain, and rotate.

With either mode, you can intercept outgoing HTTP or TLS traffic, and inspect or mutate it with any freely available proxy or your own.

## Example with Squid: blocking known sites

It's common to see network tunneling products like Ngrok, social media (X.com, Facebook, etc), and file upload sites (Google Drive, Pastebin, etc) blocked by corporate policies.

Let's wire up Squid to block a number of domains so that you can see it working end to end.

### Host setup

Squid will live directly on the Slicer host, listening on a dummy adapter at `192.168.137.1`. A dedicated adapter gives the proxy a stable IP that is independent of whichever physical NIC the host happens to have, matches the gateway the isolated network policy expects, and lets Squid bind to `192.168.137.1:3129` instead of `0.0.0.0:3129` - so it is not reachable from the rest of your LAN.

```sh
sudo ip link add squid0 type dummy
sudo ip addr add 192.168.137.1/24 dev squid0
sudo ip link set squid0 up
```

Install Squid with TLS support. On Debian/Ubuntu the package is `squid-openssl` - the plain `squid` package is compiled without SSL-bump and won't work.

```sh
sudo apt update -qy && sudo apt install -y squid-openssl
```

### A host group with a managed CA

Generate a host group config that has Slicer mint its own CA, is in isolated mode, and has the only egress route going to the proxy. `slicer new` accepts all of this via flags, so no hand-editing of the YAML is needed:

```sh
slicer new agents \
  --cidr 192.168.137.0/24 \
  --count 0 \
  --ca \
  --net isolated \
  --drop 0.0.0.0/0 \
  --allow 192.168.137.1/32 \
  --dns 127.0.0.1 --dns 127.0.0.1 \
  > agents.yaml
```

`--count 0` starts the host group with no VMs running - we'll add one after the proxy is wired up.

`--dns 127.0.0.1` points the VM at a resolver that doesn't exist, so guest-side lookups fail. Every name now has to resolve via Squid's CONNECT handling - you get a log line for it, and it shuts down DNS-over-53 as an exfil channel. The flag is passed twice because slicer accepts a primary and a fallback DNS server; if you only set one, the fallback slot is left blank and some resolvers will fall back to whatever they find on the host. Pinning both to `127.0.0.1` closes that gap.

Start the daemon:

```sh
sudo -E slicer up ./agents.yaml
```

On the first run, Slicer logs:

```
[CA] host group "agents" generated CA: /home/alex/blog-demo/.slicer/ca/agents/ca.crt (expires 2029-04-23)
```

The CA key pair is reused on subsequent runs until it is within 7 days of expiry.

### Point Squid at the Slicer CA

Squid needs to read both the cert and the signing key so it can mint leaves on the fly. Give the `proxy` service account read access:

```sh
sudo install -m 0644 ./.slicer/ca/agents/ca.crt /etc/squid/slicer-ca.crt
sudo install -m 0640 ./.slicer/ca/agents/ca.key /etc/squid/slicer-ca.key
sudo chown proxy:proxy /etc/squid/slicer-ca.*
```

Initialise Squid's leaf-certificate cache (a one-off):

```sh
sudo rm -rf /var/spool/squid/ssl_db
sudo /usr/lib/squid/security_file_certgen -c -s /var/spool/squid/ssl_db -M 4MB
sudo chown -R proxy:proxy /var/spool/squid/ssl_db
```

Drop this into `/etc/squid/squid.conf`:

```squid
http_port 192.168.137.1:3129 \
    ssl-bump \
    cert=/etc/squid/slicer-ca.crt \
    key=/etc/squid/slicer-ca.key \
    generate-host-certificates=on \
    dynamic_cert_mem_cache_size=4MB

sslcrtd_program /usr/lib/squid/security_file_certgen -s /var/spool/squid/ssl_db -M 4MB
sslcrtd_children 5

# Peek at the TLS client hello, then bump all connections so we
# terminate TLS and can see the plaintext URL.
acl step1 at_step SslBump1
ssl_bump peek step1
ssl_bump bump all

# --- Block list ---------------------------------------------
# Matches wikipedia.org and every subdomain.
acl banned dstdomain .wikipedia.org

http_access deny banned
http_access allow all

access_log /var/log/squid/access.log squid
```

Reload:

```sh
sudo systemctl restart squid
sudo ss -tln | grep 3129    # confirm Squid is listening
```

### Launch a VM and test

```sh
slicer vm add agents --wait
```

Slicer injects the CA cert into `/runner/ca.crt` at boot, and the guest agent wires it into the system trust store - so the VM already trusts every leaf Squid mints.

```sh
slicer vm exec agents-1 --uid 1000 -- \
  bash -c 'export http_proxy=http://192.168.137.1:3129
           export https_proxy=http://192.168.137.1:3129
           curl -sS -o /dev/null -w "example.com           -> %{http_code}\n" https://example.com/
           curl -sS -o /dev/null -w "news.ycombinator.com  -> %{http_code}\n" https://news.ycombinator.com/
           curl -sS -o /dev/null -w "en.wikipedia.org      -> %{http_code}\n" https://en.wikipedia.org/wiki/Main_Page'
```

```
example.com           -> 200
news.ycombinator.com  -> 200
en.wikipedia.org      -> 403
```

No `-k`, no `--cacert` - the proxy's leaf for `en.wikipedia.org` is signed by a CA the VM was born trusting. The banned site gets a clean `403` from Squid rather than a TLS error, so agents see a normal HTTP response they can reason about.

The corresponding entries in `/var/log/squid/access.log` (real output - not re-formatted):

```
1777041138.685  46 169.254.60.2 NONE_NONE/200 0 CONNECT example.com:443 - HIER_DIRECT/172.66.147.243 -
1777041138.701  16 169.254.60.2 TCP_MISS/200 902 GET https://example.com/ - HIER_DIRECT/172.66.147.243 text/html
1777041139.188 455 169.254.60.2 NONE_NONE/200 0 CONNECT news.ycombinator.com:443 - HIER_DIRECT/2606:7100:1:67::26 -
1777041139.465 277 169.254.60.2 TCP_MISS/200 35883 GET https://news.ycombinator.com/ - HIER_DIRECT/2606:7100:1:67::26 text/html
1777041138.728  20 169.254.60.2 TCP_DENIED/200 0 CONNECT en.wikipedia.org:443 - HIER_NONE/- -
1777041138.728   0 169.254.60.2 NONE_NONE/403 3369 GET https://en.wikipedia.org/wiki/Main_Page - HIER_NONE/- text/html
```

Because Squid bumped the tunnel, it logs the full URL - not just the host. That is the audit trail you were after, and it's the same hook you'd use for category-level filtering, per-path rules, or request mutation.

## What this buys you

Before this release, getting a MITM proxy in front of a Slicer VM meant wiring a CA yourself: generating it, shipping the public cert into the image or a config drive, running `update-ca-certificates`, and keeping all of that in sync across host groups. Most people didn't bother - which is why so many sandboxing products either don't offer egress inspection at all, or only offer it as a hosted SaaS feature.

With `ca: { generate: true }` on the host group, every VM in that group boots with the CA cert already installed system-wide. You run one `slicer up`, point your proxy of choice at `./.slicer/ca/<host-group>/`, and you have URL-level visibility on every outbound TLS connection from every VM in the group.

## Secrets substitution: keep tokens off the VM

Once you control the proxy, you control what leaves the VM - and what gets added to requests on their way out. The same CONNECT-then-bump mechanism that lets Squid log the full URL lets it rewrite headers. Which means your agent never has to see the real `GITHUB_TOKEN`, LLM API key, or any other credential.

The pattern is: the VM uses a placeholder token (or no token at all). Squid matches the destination, strips whatever the VM sent, and adds an `Authorization` header with the real secret. The upstream sees a valid token; the VM never did.

Here's a working example against a private `llama.cpp` endpoint. Squid's config parser doesn't do shell-style substitution, so you can't inline `$(cat token.txt)` - but the `include` directive lets you split the secret into a separate, tightly-permissioned file that the main config pulls in at load time.

`/etc/squid/squid.conf`:

```squid
acl llama_upstream dstdomain llm.internal.example.com

# Pulled in from a file readable only by the proxy user.
include /etc/squid/secrets/llama.conf
```

`/etc/squid/secrets/llama.conf` (chmod 0400, chown proxy:proxy - generated at deploy time from your secrets manager):

```squid
request_header_access Authorization deny llama_upstream
request_header_add Authorization "Bearer REAL_LLAMA_CPP_API_KEY_HERE" llama_upstream
```

Squid reloads pick up changes to the included file without editing the main config, which makes token rotation a one-file swap. Scope the ACL tightly to the exact upstream - a loose `dstdomain` match is how you accidentally send your GitHub token to `api.github.com.evil.com`.

From the VM, a deliberately bogus bearer sails through because Squid swaps it on the way out:

```sh
# VM sends a fake token; upstream receives the real one.
$ http_proxy=http://192.168.137.1:3129 \
  https_proxy=http://192.168.137.1:3129 \
  curl -sS -H "Authorization: Bearer FAKE-TOKEN-FROM-VM-NEVER-VALID" \
    https://llm.internal.example.com/v1/models
{"models":[{"name":"unsloth/Qwen3.6-35B-A3B-GGUF:UD-Q5_K_XL",...}]}

# The same request straight to the upstream (no proxy) gets 401.
$ curl -sS -o /dev/null -w 'HTTP=%{http_code}\n' \
    -H "Authorization: Bearer FAKE-TOKEN-FROM-VM-NEVER-VALID" \
    https://llm.internal.example.com/v1/models
HTTP=401
```

Same pattern as Fly's tokenizer, Cloudflare Sandboxes, or Vercel Sandboxes, except it runs on your own infrastructure with tokens that never leave your host. A compromised agent process can still use the upstream API (it has a working connection through the proxy), but it can't exfiltrate the credential - because it never had the credential to exfiltrate.

> A production setup wouldn't hand the VM a constant placeholder like `FAKE-TOKEN-FROM-VM-NEVER-VALID`. It'd issue a sentinel value that's stateful, short-lived, and tied to the individual VM: the proxy looks up the sentinel, verifies the calling VM matches, checks it hasn't expired, then swaps in the real upstream token. That way a sentinel lifted from one VM's memory is useless to a different VM or five minutes later.

Worth flagging: this is defence-in-depth, not a silver bullet. An agent with a working connection through the proxy can still abuse the API within whatever scope the real token grants. Secrets substitution limits blast radius if the VM is compromised or the token leaks via a log; it doesn't stop a malicious agent from doing bad things with the API the token is for. Scope your tokens narrowly (read-only where possible, per-repo where possible) and treat the proxy as one layer in a stack.

## What this doesn't cover

MITM is incompatible with certificate-pinned clients (mobile app SDKs, some update mechanisms, a few CLI tools that embed their own root store) and with workloads that do mutual TLS outbound. If your agent needs either, add a bypass list to Squid's `ssl_bump` rules to let those connections pass through untouched:

```squid
acl pinned dstdomain .apple.com .googleapis.com
ssl_bump splice pinned
ssl_bump peek step1
ssl_bump bump all
```

`splice` tells Squid to forward the raw TLS bytes without terminating - no header rewriting, no URL logging, but the connection still goes through the proxy and remains subject to the egress policy. The CA injection is still useful for everything else.

## Primitives now, policy later

A deliberate choice in this release: we've shipped the CA primitive rather than a turnkey egress-policy product. If you already run Squid, mitmproxy, a WAF, or an internal agent gateway - plug it in today, with your existing rules and your existing audit pipeline. No vendor-specific policy DSL to learn, no SaaS to route traffic through, no lock-in.

Most SaaS agent-sandboxing solutions have taken the easy route on egress: HTTP(S) only, via their own hosted proxy. That's a fine start for a web-scraping agent, but it falls short the moment you have a real enterprise workload. Databases (Postgres, MySQL, MongoDB), message brokers, SSH for ops work, internal gRPC - none of that is HTTP, and none of it is covered by an HTTP-only MITM layer. Slicer's isolated-network policy works at the IP level for any protocol, and you can run whatever L4/L7 inspection makes sense on the host side of that boundary. The CA injection gives you the HTTP half for free; the rest is a design space that hasn't been carved up yet.

We're also watching how customers wire this up in the real world - which rules matter, which patterns repeat, where the sharp edges are - and that feeds directly into the turnkey egress controls shipping in a future release. The CA layer is the foundation both of those futures share.

## Where to go next

- **Allow-list mode** - flip the Squid ACL from deny-list to allow-list and you have an air-tight egress policy for coding agents (`acl allowed dstdomain .github.com .anthropic.com .npmjs.org`, `http_access allow allowed`, `http_access deny all`).
- **Header injection** - Squid's [external ACL helpers](https://wiki.squid-cache.org/Features/AddonHelpers) can rewrite `Authorization` headers, letting you inject secrets at the proxy and keep the real tokens off the VM entirely. This is the same pattern as Fly's tokenizer, Cloudflare Sandboxes, or Vercel Sandboxes.
- **Bring your own CA** - if you already run PKI (Smallstep, Vault, an internal CA), use `ca: { files: [/path/to/ca.crt] }` instead of `generate: true` and Slicer will inject your existing cert instead.
- **Any proxy you like** - Squid is the easy on-ramp, but the CA mechanism is proxy-agnostic. mitmproxy, a commercial agent-gateway product, or something of your own will all work the same way.

Our recommendation is to roll your own: a small HTTP CONNECT proxy is an approachable weekend project, and gives you total control over policy, logging, and how secrets are injected. Write it in Go or Python or whatever you're most comfortable with. You keep the plumbing you understand end to end, and you avoid pushing sensitive traffic through a third party that was never on your threat model.
