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

Slicer is a fast and convenient way to sandbox and isolate workloads like coding agents — and while compute isolation matters, networking is where most of the interesting attack surface lives. Before this release, wiring a MITM proxy in front of a sandboxed VM meant generating a CA by hand, getting its public cert into the image or a config drive, running `update-ca-certificates`, and keeping all of that in sync across host groups. Most people didn't bother.

## Prior work: Isolated Networking mode

In December 2025 we launched [isolated network](/isolated-network-mode/) mode which meant a microVM could have its network egress controlled at the TCP level. The main use-cases we saw were: blocking all traffic (i.e. an airgap), blocking selective network ranges (like your home or office LAN) and allowing traffic to certain IP addresses like a proxy or an internal database server.

The following policy blocks all egress, and allows access to a single internal-only machine, where we could run something like an intercepting HTTP proxy.

```yaml
network:
  drop: [0.0.0.0/0]
  allow: [192.168.137.1]
```

## Intercepting or Man In the Middle (MITM) proxies

Many SaaS-based solutions from Fly, to Vercel, to Cloudflare, and various others have implemented their own Man In the Middle (MITM) proxies, in order to inspect and mutate HTTP requests. These rely on a custom Certificate Authority being set up on the host, and then having its public key injected into the trust bundle of any VM you launch.

One of the oldest HTTP proxies is [Squid](https://www.squid-cache.org/), which also works well as a cache. The chances are that if you've ever used WiFi at a hospital, government building, school, or large enterprise company, that your traffic was being routed through Squid or a very similar product.

Rather than being presented with the real certificate for let's say `wikipedia.org`, the proxy will generate and sign a certificate with its private key and present that instead. Once the client accepts it, the proxy dials upstream to the real site and sends bytes back and forth.

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

In order for this to work, the public key of the CA must be installed into the trust bundle of the VM. This usually means placing the cert at ` /usr/local/share/ca-certificates/` (or equivalent for the OS), and running `update-ca-certificates`.

Production CA private keys are typically read from an Hardware Security Module (HSM) rather than stored on disk. They typically use a hierarchy with intermediary certificates to limit exposure — the root key is never exposed or used directly.

For the purposes of sandboxing agents on our own infrastructure, we can take a less involved route.

Slicer can now inject the public certificate for a CA into a VM at boot time to avoid boilerplate code.

There are two modes:

1. Slicer generates a CA key pair (signing key + public certificate) which it owns and renews.
2. Slicer references an existing CA key pair that you or an external program will secure, maintain, and rotate.

With either mode, you can intercept outgoing HTTP or TLS traffic, and inspect or mutate it with any freely available proxy or your own.

## Example with Squid: blocking known sites

It's common to see network tunneling products like Ngrok, social media (X.com, Facebook, etc), and file upload sites (Google Drive, Pastebin, etc) blocked by corporate policies.

Let's wire up Squid to block a number of domains so that you can see it working end to end.

### Host setup

Squid will live directly on the Slicer host, listening on a dummy adapter at `192.168.137.1`. A dedicated adapter gives the proxy a stable IP that is independent of whichever physical NIC the host happens to have, matches the gateway the isolated network policy expects, and lets Squid bind to `192.168.137.1:3129` instead of `0.0.0.0:3129` — so it is not reachable from the rest of your LAN.

```sh
sudo ip link add squid0 type dummy
sudo ip addr add 192.168.137.1/24 dev squid0
sudo ip link set squid0 up
```

Install Squid with TLS support. On Debian/Ubuntu the package is `squid-openssl` — the plain `squid` package is compiled without SSL-bump and won't work.

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
  --dns 127.0.0.1 \
  > agents.yaml
```

`--count 0` starts the host group with no VMs running — we'll add one after the proxy is wired up.

`--dns 127.0.0.1` points the VM at a resolver that doesn't exist, so any lookup the guest tries directly fails. Every name resolution now has to go via Squid's CONNECT handling, which means you get a log line for it — and it's defence-in-depth against DNS-over-53 exfiltration, where a compromised process inside the VM tries to tunnel data out through DNS queries even though HTTP egress is clamped down.

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

Slicer injects the CA cert into `/runner/ca.crt` at boot, and the guest agent wires it into the system trust store — so the VM already trusts every leaf Squid mints.

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

No `-k`, no `--cacert` — the proxy's leaf for `en.wikipedia.org` is signed by a CA the VM was born trusting. The banned site gets a clean `403` from Squid rather than a TLS error, so agents see a normal HTTP response they can reason about.

The corresponding entries in `/var/log/squid/access.log` (real output — not re-formatted):

```
1777041138.685  46 169.254.60.2 NONE_NONE/200 0 CONNECT example.com:443 - HIER_DIRECT/172.66.147.243 -
1777041138.701  16 169.254.60.2 TCP_MISS/200 902 GET https://example.com/ - HIER_DIRECT/172.66.147.243 text/html
1777041139.188 455 169.254.60.2 NONE_NONE/200 0 CONNECT news.ycombinator.com:443 - HIER_DIRECT/2606:7100:1:67::26 -
1777041139.465 277 169.254.60.2 TCP_MISS/200 35883 GET https://news.ycombinator.com/ - HIER_DIRECT/2606:7100:1:67::26 text/html
1777041138.728  20 169.254.60.2 TCP_DENIED/200 0 CONNECT en.wikipedia.org:443 - HIER_NONE/- -
1777041138.728   0 169.254.60.2 NONE_NONE/403 3369 GET https://en.wikipedia.org/wiki/Main_Page - HIER_NONE/- text/html
```

Because Squid bumped the tunnel, it logs the full URL — not just the host. That is the audit trail you were after, and it's the same hook you'd use for category-level filtering, per-path rules, or request mutation.

## What this buys you

Before this release, getting a MITM proxy in front of a Slicer VM meant wiring a CA yourself: generating it, shipping the public cert into the image or a config drive, running `update-ca-certificates`, and keeping all of that in sync across host groups. Most people didn't bother — which is why so many sandboxing products either don't offer egress inspection at all, or only offer it as a hosted SaaS feature.

With `ca: { generate: true }` on the host group, every VM in that group boots with the CA cert already installed system-wide. You run one `slicer up`, point your proxy of choice at `./.slicer/ca/<host-group>/`, and you have URL-level visibility on every outbound TLS connection from every VM in the group.

## Primitives now, policy later

A deliberate choice in this release: we've shipped the CA primitive rather than a turnkey egress-policy product. If you already run Squid, mitmproxy, a WAF, or an internal agent gateway — plug it in today, with your existing rules and your existing audit pipeline. No vendor-specific policy DSL to learn, no SaaS to route traffic through, no lock-in.

We're also watching how customers wire this up in the real world — which rules matter, which patterns repeat, where the sharp edges are — and that feeds directly into the turnkey egress controls shipping in a future release. The CA layer is the foundation both of those futures share.

## Where to go next

- **Allow-list mode** — flip the Squid ACL from deny-list to allow-list and you have an air-tight egress policy for coding agents (`acl allowed dstdomain .github.com .anthropic.com .npmjs.org`, `http_access allow allowed`, `http_access deny all`).
- **Header injection** — Squid's [external ACL helpers](https://wiki.squid-cache.org/Features/AddonHelpers) can rewrite `Authorization` headers, letting you inject secrets at the proxy and keep the real tokens off the VM entirely. This is the same pattern as Fly's tokenizer or Cloudflare's AI Gateway.
- **Bring your own CA** — if you already run PKI (Smallstep, Vault, an internal CA), use `ca: { files: [/path/to/ca.crt] }` instead of `generate: true` and Slicer will inject your existing cert instead. See the [Trusted CAs reference](https://docs.slicervm.com/reference/ca-trust/) for the schema and rotation notes.
- **Any proxy you like** — Squid is the easy on-ramp, but the CA mechanism is proxy-agnostic. mitmproxy, a commercial agent-gateway product, or something of your own will all work the same way.
- **Roll your own** — a small HTTP CONNECT proxy in Go or Python is an approachable weekend project, and gives you total control over policy, logging, and how secrets are injected. Start from the Squid access-log format as the contract; move the ACL logic into code when you need something Squid can't express.
