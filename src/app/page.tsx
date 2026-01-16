"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SlicerTerminal } from "@/components/slicerTerminal";
import {
  ArrowRight,
  Zap,
  Server,
  Play,
  Shield,
  DollarSign,
  Code,
  Layers,
  Package,
  Gpu,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-4 sm:py-12 lg:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="text-center lg:text-left lg:order-1">
              <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl mb-4">
                Firecracker for humans.
              </h1>
              <p className="text-base sm:text-xl text-muted-foreground text-pretty mb-4 max-w-2xl mx-auto lg:mr-auto lg:mx-0">
                Boot Linux microVMs in <span className="font-mono">&lt;1s</span> - for sandboxes and services.
              </p>
              <div className="flex flex-row items-center gap-2 sm:gap-4 mb-6 max-w-2xl mx-auto lg:mr-auto lg:mx-0 flex-wrap justify-center lg:justify-start">
                <div className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-2 sm:px-3 py-1.5 sm:py-2">
                  <span className="text-xs font-mono font-medium text-primary">Sandboxes</span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">Linux machines via API</span>
                </div>
                <span className="text-muted-foreground text-sm">+</span>
                <div className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-2 sm:px-3 py-1.5 sm:py-2">
                  <span className="text-xs font-mono font-medium text-primary">Services</span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">Datacenter on a diet</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Button size="lg" className="font-mono" asChild>
                  <Link href="/blog/slicer-2025-wrapup/">
                    Read 2025 wrap-up
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="https://docs.slicervm.com">Documentation</Link>
                </Button>
              </div>
            </div>
            <div className="lg:order-2">
              <SlicerTerminal className="w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Slicer Sandboxes Section */}
      <section className="border-b border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-2 lg:gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-1.5 text-lg font-mono font-medium text-primary mb-4">
                <Code className="h-4 w-4" />
                Slicer Sandboxes
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-balance mb-3">
                API-driven microVMs for automation in{" "}
                <span className="font-mono">~300ms</span>
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground mb-6">
                Build and run untrusted code, background jobs, preview environments, autoscaling infrastructure, and sandboxes.<br />
                Run untrusted code with the ease of containers, but a full guest Kernel, OS and systemd.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Code className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Linux on demand</h3>
                    <p className="text-sm text-muted-foreground">
                      Run background jobs, code workspaces, bots, and AI agents
                      via{" "}
                      <a
                        href="https://docs.slicervm.com/reference/api/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        REST API
                      </a>{" "}
                      or{" "}
                      <a
                        href="https://docs.slicervm.com/tasks/execute-commands-with-sdk/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        Go SDK
                      </a>
                      .
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Share secrets securely from the host</h3>
                    <p className="text-sm text-muted-foreground">
                      Securely inject{" "}
                      <a
                        href="https://docs.slicervm.com/reference/secrets/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        secrets and credentials
                      </a>{" "}
                      into microVMs from the host.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Code className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Slicer Agent - API for Linux</h3>
                    <p className="text-sm text-muted-foreground">
                      Program Linux systems with slicer&apos;s guest agent for{" "}
                      <a
                        href="https://docs.slicervm.com/reference/api/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        cp, exec, shell, metrics, and port-forwarding.
                      </a>
                      .
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Gpu className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      PCI passthrough for GPUs, TPUs, and NICs
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      <a href="https://docs.slicervm.com/reference/vfio/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors">Mount PCI devices</a>{" "}
                       like GPUs, TPUs, and NICs into microVMs for hardware acceleration.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border/50">
                <h3 className="text-lg font-semibold mb-4">Examples of code sandboxes:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                      <Code className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">
                        AI Agents and code sandboxes
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Run automated bots for code reviews, notifications, and integrations. See our{" "}
                        <a
                          href="https://blog.alexellis.io/ai-code-review-bot/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                        >
                         code review bot built with opencode
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                      <Code className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">
                        Convert videos with ffmpeg
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        microVMs are better suited for processing large media files.{" "}
                        <a
                          href="https://docs.slicervm.com/tasks/execute-commands-with-sdk/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                        >
                          See example
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                      <Code className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">
                        Ephemeral Jenkins CI runners
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Spins up isolated CI/CD runners on-demand with a fully isolated guest Kernel.{" "}
                        <a
                          href="https://docs.slicervm.com/examples/jenkins/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                        >
                          Learn more
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                      <Layers className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">
                        Self-hosted Kubernetes with node autoscaling
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Launch Kubernetes nodes via API with{" "}
                        <a
                          href="https://docs.slicervm.com/examples/autoscaling-k3s/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                        >
                          node scaling and termination
                        </a>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative hidden sm:block">
              <Card className="py-0 border-primary/20 bg-card shadow-lg shadow-primary/5">
                <CardContent className="p-6">
                  <pre className="overflow-x-auto text-sm font-mono">
                    <code>
                      <span className="text-muted-foreground">
                        # Run headless workloads just like containers<br />
                        # - from the CLI, or from code.
                      </span>
                      <br />
                      {`
$ slicer vm new \\
    --userdata-file setup_opencode.sh
$ slicer vm cp ./pr.tgz vm-1:/home/ubuntu/
$ slicer vm exec vm-1 \\
    -- tar -xcf /home/ubuntu/pr.tgz
$ slicer vm exec vm-1 opencode \\
    -m "Review this code and quit when done" \\
    >> /tmp/REVIEW.md
$ slicer vm vm-1:/tmp/REVIEW.md ./REVIEW.md
`}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Slicer Services Section */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-1.5 text-lg font-mono font-medium text-primary mb-4">
                <Server className="h-4 w-4" />
                  Slicer Services
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-balance mb-3">
                Customer support for AI & cloud native products
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground mb-6">
                Reproduce customer issues in seconds, not hours. Spin up test environments on cost-effective bare-metal instead of expensive cloud instances.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Fast issue reproductions</h3>
                    <p className="text-sm text-muted-foreground">
                      Boot up a fresh environment to reproduce bugs and ship fixes in minutes, not hours.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Server className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Ubuntu & Rocky Linux</h3>
                    <p className="text-sm text-muted-foreground">
                      Boot a{" "}
                      <a
                        href="https://docs.slicervm.com/reference/images/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        Debian- or RHEL-like OS
                      </a>{" "}
                      that matches your customer&apos;s production environment.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Cost-effective bare-metal
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Run on your own{" "}
                      <a
                        href="https://www.hetzner.com/dedicated-rootserver"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        bare-metal hardware
                      </a>{" "}
                      at a fraction of cloud costs. No more unhinged cloud spend for test environments.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Layers className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Disposable Kubernetes clusters
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      One of the fastest ways to{" "}
                      <a
                        href="https://docs.slicervm.com/examples/ha-k3s/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        spin up HA Kubernetes clusters
                      </a>{" "}
                      for customer support and testing environments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative hidden sm:block">
              <Card className="py-0 border-primary/20 bg-card shadow-lg shadow-primary/5">
                <CardContent className="p-6">
                  <pre className="overflow-x-auto text-sm font-mono">
                    <code>
                      <span className="text-muted-foreground">
                        # Kubernetes in seconds, not 30 minutes.
                        <br /># Tear down in a few seconds.
                      </span>
                      <br />
                      <span>{`
$ slicer new k3s --count=3 > k3s.yaml
$ slicer vm list --json > devices.json
`}</span>
                      <span>{`
$ k3sup-pro plan --user ubuntu
$ k3sup-pro get-config --merge \\
    --local-path ~/.kube/config \\
    --context slicer
`}</span>
                      <span>{`
$ kubectx slicer
$ kubectl get node
`}</span>
                      <span className="text-muted-foreground">{`NAME    STATUS    AGE   VERSION
k3s-1   Ready     53s   v1.33.6+k3s1
k3s-2   Ready     56s   v1.33.6+k3s1
k3s-3   Ready     59s   v1.33.6+k3s1`}</span>
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why microVMs over datacenter solutions */}
      <section className="border-b border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-balance mb-3">
                Why microVMs over datacenter-style solutions?
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground mb-6">
                Lightning fast, easy to use, and built for modern workloads — without the datacenter overhead of Proxmox, kubevirt, or ESXi.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Quicker to set up and maintain</h3>
                    <p className="text-sm text-muted-foreground">
                      No ISO, just install to Ubuntu LTS. Run your first a VM in single-digit minutes.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Play className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">API-first automation</h3>
                    <p className="text-sm text-muted-foreground">
                      Deploy via declarative YAML configs, {" "}
                      <a
                        href="https://docs.slicervm.com/reference/api/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        REST API
                      </a>{" "}
                      , or{" "}
                      <a
                        href="https://docs.slicervm.com/tasks/execute-commands-with-sdk/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        Go SDK
                      </a>

                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Code className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Container-like simplicity</h3>
                    <p className="text-sm text-muted-foreground">
                      Instant disk cloning, fast boot, full OS, and systemd. Customise the OS with Docker or a userdata script.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Layers className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">No expensive SANs needed</h3>
                    <p className="text-sm text-muted-foreground">
                      Fast, local{" "}
                      <a
                        href="https://docs.slicervm.com/reference/storage/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        ZFS support
                      </a>{" "}
                      with snapshots and clones. Run on local NVMe or SSDs — no network storage required.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Server className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Portable - from edge, to cloud</h3>
                    <p className="text-sm text-muted-foreground">
                      Runs anywhere you can install Linux. From on-premises servers, to edge devices, to bare-metal cloud, to a homelab.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Code className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Better utilization</h3>
                    <p className="text-sm text-muted-foreground">
                      Lightweight microVMs use fewer resources than traditional VMs. Run more workloads on the same hardware with better performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative hidden sm:block">
              <Card className="py-0 border-primary/20 bg-card shadow-lg shadow-primary/5">
                <CardContent className="p-6">
                  <pre className="overflow-x-auto text-sm font-mono">
                    <code>
                      <span className="text-muted-foreground">
                        # Simple, fast, automated setup<br />
                        # Install directly to existing Ubuntu LTS installations
                        </span>
                      <br />
                      {`
$ curl -SLs https://get.slicervm.com | sudo -E bash
$ slicer --help
`}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Lightweight hosting and customer appliances */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-balance mb-3">
                Lightweight hosting and customer appliances
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground mb-6">
                Run appliances and multi-tenant hosting for customers, without the additional overhead of Kubernetes or traditional hypervisors. Use your own hardware, or ship a VM to your customers to run with Slicer.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Layers className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Native ZFS snapshots</h3>
                    <p className="text-sm text-muted-foreground">
                      Built-in backup support with{" "}
                      <a
                        href="https://docs.slicervm.com/reference/storage/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        ZFS snapshots
                      </a>
                      . Instant backups and restores without additional backup infrastructure.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Server className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Managed services</h3>
                    <p className="text-sm text-muted-foreground">
                      Host Prometheus, Postgres, or other services for customers. Create a full system with a hard boundary that&apos;s easier to secure than Kubernetes or containers.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Appliances</h3>
                    <p className="text-sm text-muted-foreground">
                      Package apps and appliances as OCI images, or supply custom userdata scripts to run on boot.
                      Slicer is self-contained, easy to deploy, and maintain.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Multi-tenant hosting</h3>
                    <p className="text-sm text-muted-foreground">
                      Build and host untrusted code for customers with network and compute isolation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative hidden sm:block">
              <Card className="py-0 border-primary/20 bg-card shadow-lg shadow-primary/5">
                <CardContent className="p-6">
                  <pre className="overflow-x-auto text-sm font-mono">
                    <code>
                      <span className="text-muted-foreground">
                        # As simple as delivering a userdata-script or a <br />
                        prebuilt image to your customer.
                      </span>
                      <br />
                      {`
$ slicer new monitoring --count=1 \\
   --userdata-file ./install-prometheus.sh \\
   > appliance.yaml
$ slicer up ./appliance.yaml

$ slicer new --image \\
  123456789012.dkr.ecr.us-east-1.amazonaws.com/app:v1.0.0 \\
  > appliance.yaml
$ slicer up ./appliance.yaml
`}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="border-t border-border/50 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Got questions about{" "}
            <span className="text-primary font-mono">Slicer</span>?
          </h2>
          <p className="text-muted-foreground mb-8">
            Book a call with our team to get your questions answered.
          </p>
          <Button size="lg" variant="outline" className="font-mono" asChild>
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSdDdWbzoRFjGmLTuMI7h-OBhybzXewaNL-hoKTnbU8Wbz7bRA/viewform?usp=sharing&ouid=108694999418382910484"
              target="_blank"
              rel="noopener noreferrer"
            >
              Talk to Our Team
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
