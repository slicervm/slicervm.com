---
title: "Getting to sub-300ms microVM sandboxes for automation and AI agents"
date: "2026-01-14T10:00:00Z"
excerpt: "With Slicer's new optimised images, you can boot the Linux Kernel and systemd in less than 300ms for automation and AI agents."
author: "Alex Ellis"
tags:
  - "linux"
  - "slicer"
  - "sandboxes"
  - "automation"
---

Modern automation increasingly relies on short-lived workloads: CI jobs, preview environments, AI agents, data- and media- transformations.

How fast can you get a fully isolated Linux server that's safe for untrusted code?

* Containers were designed for long-running services. Virtual machines were designed to live for hours or days.
* AWS EC2 instances can often take 15-20s to provision depending on the OS and instance type, whilst other cloud providers like DigitalOcean or GCP can be between 30-60 seconds. Typically, we've seen AWS EKS customers report autoscaled EKS instances appear in a Ready state within 1-2 minutes.
* Kubernetes is designed for long-lived stateless workloads, and isn't optimised for immediate execution of dynamic code.

When your workload runs for seconds or minutes, traditional cloud VMs, Kubernetes, and containers all start to work against you.

Even simple Pods can take 1-2 seconds before they are ready to serve traffic, and that assumes the image is already cached on a host, that has capacity to run the Pod.

Kubernetes is the industry standard for stateless containers, web services, APIs, and other long-lived workloads. It's even made sufficient improvements to run some stateful workloads like databases and message queues.

But for short-lived, ephemeral code, its eventually consistent, distributed, services-oriented design works against you.

What we need is to think about executions, not services. That's where Slicer comes in.

With recent optimization efforts on our Slicer microVM images, we've been able to fully boot the Linux Kernel and systemd in 280-299ms consistently on modern hardware.

## Conceptual Workflow for Automated Workloads

If you're looking to sandbox untrusted code, create preview environments, run your own CI/CD pipelines, AI agents, or other background jobs, Slicer's API is much more flexible than the options above.

Consider this workflow:

1. Create a microVM with the "min" image via [REST API](https://docs.slicervm.com/reference/api/)
2. Use the REST API, CLI and bash, or the Go SDK to copy code or data into the microVM
3. Run the code using the exec API and retrieve the results via stdout or copying a file/folder out

If you need to install additional packages or tools, you can do so over exec, or derive your own custom image from ours, with the extra packages built-in such as: Python, Node.js, opencode, headless browsers, claude, etc.

At that point, you have a warm VM and could do more work for the same tenant, i.e. if this were a serverless function for transforming JSON payloads, you could run many exec calls over the lifetime of the VM.

Or you could destroy it, and use each VM for one workload or execution.

```
┌─────────────┐
│ User/Client │
└──────┬──────┘
       │ 1. Create VM
       ▼
┌──────────────────┐      Boot microVM      ┌──────────────┐
│ Slicer REST API  │ ────────────────────►  │  MicroVM     │
│                  │                        │  ~300ms boot │
└──────┬───────────┘                        └──────────────┘
       │
       │ 2. Copy main.py
       │
┌──────┴───────────┐      "cp" file         ┌──────────────┐
│ Slicer REST API  │ ────────────────────►  │  MicroVM     │
│                  │                        │  (main.py)   │
└──────┬───────────┘                        └──────────────┘
       │
       │ 3. Execute
       │
┌──────┴───────────┐      "exec" python     ┌──────────────┐
│ Slicer REST API  │ ────────────────────►  │  MicroVM     │
│                  │ ◄────────────────────  │  (stdout)    │
└──────┬───────────┘      Return results    └──────────────┘
       │
       │ 4. Destroy
       │
┌──────┴───────────┐      Terminate VM      ┌──────────────┐
│ Slicer REST API  │ ────────────────────►  │  MicroVM     │
└──────────────────┘                        └──────────────┘
```

Here are some other examples of what you might be looking to do:

* Copy a git repo in and run `opencode` or `claude` to implement a feature or fix a bug. Copy out the folder at the end.
* Copy in an image, and have `ffmpeg` transform it or transcode it, then copy out the transformed image.
* Copy in a YouTube video, run `whisper` against it to transcode it, a small local model with Ollama to generate bookmarks, then copy out the generated bookmarks for the video.
* Create ephemeral preview environments for customers or team Pull Requests/builds.
* Run a CI/CD pipeline with Jenkins, GitLab, GitHub Actions, or Azure DevOps, where each job gets its own short-lived VM.
* Browse, test, or scrape websites with a headless browser.

## Faster images, with full systemd support

Going forward, you'll have three choices for images for x86_64:

1. Firecracker (FC) based images - fully compatible with Docker/containers, Kubernetes, eBPF and systemd.
2. Firecracker (FC) "min" images - similar to the full images, but with eBPF, Kubernetes and container features turned off, no additional Kernel modules.
3. Cloud Hypervisor (CH) based images - required for PCI support for GPUS, NICs, TPUs, and passing other hardware devices into the microVM.

Most people should focus on the default "full" images, which will feel like a regular cloud VM, but with a faster boot time. Ideal for homelabs, long-lived production services, databases, Kubernetes clusters on bare-metal, etc. See: [Autoscaling HA K3s cluster](https://docs.slicervm.com/examples/autoscaling-k3s/)

For those of us that need to sandbox workloads such as customer code/scripts, AI coding agents (Claude, opencode, etc), the "min" images will boot as quick as reasonably possible whilst not giving up on the convenience of systemd. See: [Execute Commands in VM via SDK](https://docs.slicervm.com/tasks/execute-commands-with-sdk/) or [Run Jenkins build slaves in microVMs](https://docs.slicervm.com/examples/jenkins/)

Finally, for those of us that need to pass through hardware devices into the microVM, the CH images are the only option. These are generally around the same speed to boot as the full FC images. Ideal for running a [router/firewall](/blog/lightweight-linux-router-firewall/), or a GPU-accelerated workload like [Ollama](https://docs.slicervm.com/examples/gpu-ollama/) or [Whisper](https://openai.com/index/whisper/).

Arm hosts have their own sets of images and Kernels, which have also been optimised for speed. The "min" image for Arm64 is under testing, and is available upon request.

## Initial benchmarks

We set up a minimal configuration using a CoW snapshot storage backend, either ZFS or devmapper (backed by an NVMe partition or whole disk).

Test machines:

* AMD Ryzen 9 9950X3D 16-Core Processor with 128GB of DDR5 RAM
* Beelink SER9 - AMD Ryzen 7 255 w/ Radeon 780M Graphics with 32GB of DDR5 RAM
* Intel(R) N100 with 32 GB of DDR5 RAM

Test image: Ubuntu LTS 22.04

YAML configurations are available in the appendix.

Timings are taken from the `systemd-analyze` command, such as:

```bash
Startup finished in 76ms (kernel) + 223ms (userspace) = 299ms 
multi-user.target reached after 220ms in userspace
```

| Machine                                    | Image | Total start-up | Kernel | Userspace | multi-user.target |
| ------------------------------------------ | ----- | -------------- | ------ | --------- | ----------------- |
| AMD Ryzen 9 9950X3D 16-Core Processor     | min   | 299ms          | 76ms   | 223ms     | 220ms             |
| AMD Ryzen 9 9950X3D 16-Core Processor     | full  | 364ms          | 104ms  | 259ms     | 237ms             |
| Beelink SER9                              | min   | 551ms          | 157ms  | 393ms     | 380ms             |
| Beelink SER9                              | full  | 720ms          | 211ms  | 508ms     | 483ms             |
| Intel N100                                | min   | 692ms          | 115ms  | 576ms     | 545ms             |
| Intel N100                                | full  | 856ms          | 162ms  | 693ms     | 667ms             |

Once booted, you can run the command over SSH, via the Serial Over SSH (SOS) feature, or via the CLI:

```bash
sudo -E slicer vm exec --uid 1000 min-1 -- systemd-analyze
```

To view the complete boot up time, including when any individual service started, you can use the journal:

```bash
sudo -E slicer vm exec --uid 1000 min-1 -- sudo journalctl -o short-monotonic
```

This can confirm things such as the exact moment the built-in Slicer guest agent started:

```bash
[    0.235413] min-1 slicer-agent[453]: slicer-agent (version: 0.1.49 (commit: 3d4a9e2e741c8ee155ac90bbe54b68be2661a114))
```

In this instance, we see that at ~ 235ms your workload could already be executing or being copied into in the microVM via `slicer vm exec`.

Watch a demo of the test case being run on the AMD Ryzen 9:

<iframe width="560" height="315" src="https://www.youtube.com/embed/FO3M55FkIJg?si=RQqhR6vXq43XMEO3" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Wrapping up 

### Why does Firecracker advertise a 125ms boot time?

Firecracker's homepage says that it can "initiate userspace" in as little as ~125ms. In our example, on the fastest hardware, it was actually much faster at 76ms before running our init system. What it is not saying, is that a complete Linux system with an OS can boot in 125ms. 

We've kept systemd in all the images for Slicer because it's become a de facto standard for Linux-based cloud-native applications. It's not a perfect fit for all use-cases, and does introduce some overhead, but it's a good fit for most.

If we were to remove systemd and write our own init system, the figures are showing that we could be running your workloads at around the 100ms mark on the AMD Ryzen 9 9950X3D 16-Core Processor. That is getting close to unikernel or WASM speeds, but with a Linux Kernel and a full root filesystem.

What about Firecracker's snapshotting feature? Firecracker can go faster, even with a heavier system by bearing all the up front cost of the boot ahead of time. Resuming a snapshot can be as fast as 10ms, however it is much more brittle, and requires [additional security work](https://github.com/firecracker-microvm/firecracker/blob/main/docs/snapshotting/snapshot-support.md#snapshot-security-and-uniqueness) if more than one environment is resumed from the same snapshot.

### Should you be considering Slicer?

Slicer started out as a way to run long-lived services and Kubernetes clusters on bare-metal, but it quickly evolved into something different. By optimising for startup time and automation rather than service orchestration, Slicer now focuses on what cloud VMs and Kubernetes struggle with: fast, isolated execution driven by an opinionated guest agent.

* You're running CI, preview environments, or automation jobs that don’t need to live forever
* You want strong isolation per run or per tenant
* You're sandboxing user-supplied or AI-generated code
* You care about predictable startup more than long-term orchestration
* You've outgrown containers as a safe execution boundary
* Kubernetes is working against you for short-lived workloads

If this resonates, Slicer is available today for local machines, homelabs, and production environments. Check out the [various examples in the documentation](https://docs.slicervm.com/) to see if it's for you.

Want to dig into Firecracker itself? You'll find three educational videos at the bottom of the [SlicerVM homepage](https://slicervm.com/).

### Appendix

Test configurations:

*full.yaml*:

```yaml
config:
  graceful_shutdown: false
  host_groups:
    - name: full
      dns_servers: ["9.9.9.9", "149.112.112.112"]
      storage: devmapper
      count: 1
      vcpu: 1
      ram_gb: 2
      network:
        bridge: brfull0
        tap_prefix: full
        gateway: 192.168.131.1/24
  image: "ghcr.io/openfaasltd/slicer-systemd:6.1.90-x86_64-latest"
  hypervisor: firecracker
  api:
    port: 8081
    bind_address: "127.0.0.1"
    auth:
      enabled: true
```

*min.yaml*:

```yaml
config:
  graceful_shutdown: false
  host_groups:
    - name: min
      dns_servers: ["9.9.9.9", "149.112.112.112"]
      storage: devmapper
      count: 1
      vcpu: 1
      ram_gb: 2
      network:
        bridge: brmin0
        tap_prefix: min
        gateway: 192.168.130.1/24
  image: "ghcr.io/openfaasltd/slicer-systemd-min:6.1.90-x86_64-latest"
  hypervisor: firecracker
  api:
    port: 8080
    bind_address: "127.0.0.1"
    auth:
      enabled: true
```

