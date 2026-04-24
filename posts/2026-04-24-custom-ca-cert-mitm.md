---
title: "Introducing Certificate Authorities (CAs) For Egress Filtering"
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

Slicer is a fast and convenient way to sandbox and isolate workloads like coding agents. But compute is only part of the story, networking is just as important for potentially hostile workloads. In this post we'll show you how to set up Slicer for use with an intercepting/mutating proxy for deep control and auditing an agent's network activity.

## Prior work Isolated Networking mode

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

We would suggest you build your own from scratch, because it's a trivial task to do with a coding agent and your favourite programming language.

## Example with Squid: blocking known sites

It's common to see network tunneling products like Ngrok, social media (X.com, Facebook, etc), and file upload sites (Google Drive, Pastebin, ect) blocked by corporate policies.

Let's wire up Squid to block a number of domains so that you can see it working end to end.
