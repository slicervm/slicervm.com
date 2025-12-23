---
title: "Introducing Isolated Network Mode for Slicer"
date: "2025-12-23T17:31:58Z"
excerpt: "Introducing Isolated Network Mode for Slicer for agents and untrusted workloads."
author: "Alex Ellis"
tags:
  - "linux"
  - "self-hosting"
  - "slicer"
---

Today we're releasing Isolated Network Mode for VMs, which tightens up network access for agents, untrusted workloads, and AI agents.

Before we dive into the details, here's a quick demo of "isolated" network mode, for a microVM, blocking local LAN access, whilst allowing Internet access.

[![asciicast](https://asciinema.org/a/DVy4L5bvbsIZUCFTbDJKueEyE.svg)](https://asciinema.org/a/DVy4L5bvbsIZUCFTbDJKueEyE)

## Where did we come from?

Slicer's initial code was spun out of actuated, where we used CNI for simple, hands-off IP allocation and routing. It is available in Slicer, but we don't tend to talk about it or use it ourselves. That's because we found a simpler way to reason about networking with Linux bridges and iptables.

Every microVM you create a TAP device, which has two ends, one for the VM and one for the host. Turn on IP forwarding, and add in some masquerading rules, and you've got Internet access. In fact you'll see exactly that in my blog post and GitHub repo ["Grab your lab coat, we're building a microVM from a container"](https://actuated.com/blog/firecracker-container-lab).

Adding these taps to a bridge, makes a lot of sense in a home lab. You want to launch a Kubernetes cluster, where each VM has direct access to one another and the rest of the network, you don't want to be routing between individual VMs over TAPs.

When running on the public cloud like with a bare-metal server from Hetzner, a Linux bridge is also a very good fit, even for untrusted workloads, and AI automation agents.

## Isolated Network Mode

The new Isolated Network Mode is much more complex, and involved than either of the other two modes. But it's more versatile, and provides better isolation, allowing us to not only sandbox workloads by a guest Kernel, and KVM, but also by a network namespace and iptables rules.

In this mode, each microVM's TAP is created in a private network namespace, then connected to the host via a veth pair. veth pairs are a Linux networking construct that allows two network namespaces to communicate with each other, and you'll probably be familiar with them if you've used Docker or Kubernetes in the past.

Pros:

* Built-in mechanism to block / drop all traffic to specific destinations
* microVMs cannot communicate with each other
* microVMs cannot communicate with the host system
* microVMs cannot communicate with the rest of the LAN

Cons:

* Newer mode, less tested than bridge or CNI modes
* Additional runtime overhead and latency due to the network namespace and veth pair
* Additional complexity in managing the network namespaces and cleaning up all resources in error conditions or crashes
* Maximum node group name including the suffix `-` and a number, can't be longer than 15 characters. I.e. `agents-1` up to `agents-1000` is fine, but `isolated-agents-1` would not fit.

On Ubuntu server hosts, the `systemd-networking` service will often break veth IP assignments, so there are a few manual steps to run before starting slicer explained in the new docs page.

What does the YAML look like?

Instead of the standard bridge configuration, you'll write something like this:

```yaml
config:
  host_groups:
    - name: agents
      network:
        mode: "isolated"
        range: "169.254.100.0/22"
        drop: ["192.168.1.0/24"]
```

The range of `169.254.100.0/22` gives 256 usable IP address blocks (each containing a `/30` subnet). The first IP is for the network, the second is for the gateway, the third is for the microVM, and the fourth is for broadcast. It's also possible to use a `/23` subnet, which gives half the amount of usable IP addresses (128 blocks).

The `drop` list contains CIDR blocks that should be blocked for all microVMs in this hostgroup. In the example above, all microVMs will have all traffic to the standard LAN network `192.168.1.0/24` dropped before it has a chance to leave the private network namespace.

If you want to run another slicer daemon on the same host, you need to use the next available range in the subnet for a `/22` i.e. `169.254.100.0/22`, `169.254.104.0/22`, `169.254.108.0/22`, etc.

So the second daemon may have the following config:

```yaml
config:
  host_groups:
    - name: review
      network:
        mode: "isolated"
        range: "169.254.104.0/22"
        drop: ["192.168.1.0/24"]
```

And so on.

Then just launch your slicer daemon with the new config file.

If you have a `count` set, then the VMs will start up with the daemon. If you have `count: 0` then you can launch them via the API, SDK, or CLI (`slicer vm new`).

You won't be able to SSH directly into the microVMs, but you can do the following:

* Copy files in and out via `slicer vm cp`
* Run commands via `slicer vm exec`
* Gain a root shell (like SSH) via `slicer vm shell`
* Use the Serial Over SSH (SOS) feature to get a shell
* Use `slicer vm port-forward NAME 2222:127.0.0.1:22` to forward the SSH port to your local machine, and run commands via `ssh -p 2222 ubuntu@localhost`

## Conclusion

The Isolated Network Mode is a new and powerful way to isolate and control network egress from microVMs, you can even block it completely by adding `drop: ["0.0.0.0/0"]` to the config. But for most users, and many uses-cases the default bridge mode is a better fit.

