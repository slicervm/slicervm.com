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
  Gpu,
  Monitor,
  Check,
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
                Real Linux, in milliseconds.
              </h1>
              <p className="text-base sm:text-xl text-muted-foreground text-pretty mb-4 max-w-2xl mx-auto lg:mr-auto lg:mx-0">
                Full VMs with systemd and a real kernel — on your Mac, your
                servers, or your cloud.
              </p>
              <div className="flex flex-row items-center gap-2 sm:gap-4 mb-6 max-w-2xl mx-auto lg:mr-auto lg:mx-0 flex-wrap justify-center lg:justify-start">
                <div className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-2 sm:px-3 py-1.5 sm:py-2">
                  <span className="text-xs font-mono font-medium text-primary">
                    Sandboxes
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    Linux machines via API
                  </span>
                </div>
                <span className="text-muted-foreground text-sm">+</span>
                <div className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-2 sm:px-3 py-1.5 sm:py-2">
                  <span className="text-xs font-mono font-medium text-primary">
                    Services
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    Datacenter on a diet
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Button size="lg" className="font-mono" asChild>
                  <Link href="/pricing">
                    Get Started
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
                <span className="font-mono">&lt;1s</span>
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground mb-6">
                Build and run untrusted code, background jobs, preview
                environments, autoscaling infrastructure, and sandboxes.
                <br />
                Run untrusted code with the ease of containers, but a full guest
                Kernel, OS and systemd.
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
                    <h3 className="font-semibold mb-1">
                      Share secrets securely from the host
                    </h3>
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
                    <h3 className="font-semibold mb-1">
                      Slicer Agent - API for Linux
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Program Linux systems with slicer&apos;s guest agent for{" "}
                      <a
                        href="https://docs.slicervm.com/reference/api/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        cp, exec, shell, metrics, and port-forwarding
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
                      <a
                        href="https://docs.slicervm.com/reference/vfio/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        Mount PCI devices
                      </a>{" "}
                      like GPUs, TPUs, and NICs into microVMs for hardware
                      acceleration.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border/50">
                <h3 className="text-lg font-semibold mb-4">
                  Examples of code sandboxes:
                </h3>
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
                        Run automated bots for code reviews, notifications, and
                        integrations. See our{" "}
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
                        microVMs are better suited for processing large media
                        files.{" "}
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
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">
                        Local-first — the fastest possible I/O
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Files are shared directly via VSOCK — no network
                        round-trips to a remote API. Your data never leaves your
                        machine.
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
                        </a>
                        .
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
                        # Run headless workloads just like containers
                        <br /># - from the CLI, or from code.
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

      {/* Transition */}
      <section className="border-b border-border/50">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-balance mb-3">
            But it&apos;s not just a sandbox — it&apos;s a full OS.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Every microVM runs a real kernel with systemd, package managers, and
            cron. Run Kubernetes clusters, pass through GPUs, or replace your
            entire dev VM stack — on the same platform.
          </p>
        </div>
      </section>

      {/* Slicer for Mac — Enterprise Dev Teams */}
      <section className="border-b border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-1.5 text-lg font-mono font-medium text-primary mb-4">
                <Monitor className="h-4 w-4" />
                Slicer for Mac
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-balance mb-3">
                Your team develops on Mac. They deploy to Linux.
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground mb-6">
                Stop waiting for cloud access, VPN approvals, or AWS accounts.
                Every developer gets real Linux with systemd on their laptop —
                same packages, same tooling, same workflows as production.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">No cloud spend</h3>
                    <p className="text-sm text-muted-foreground">
                      No AWS accounts, no EKS clusters, no cloud VMs. Real Linux
                      runs locally on the hardware your team already has.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">No procurement</h3>
                    <p className="text-sm text-muted-foreground">
                      A developer expenses $25/mo. No security review, no vendor
                      assessment, no data leaving the building.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Server className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Match your deployment target
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Ubuntu LTS and Rocky Linux with systemd — the same OS you
                      run in production. Not a macOS approximation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Layers className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Replace your VM stack
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      One tool instead of Docker Desktop, Colima, Lima, or UTM.
                      Sandboxes and services from the same product.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative hidden sm:block">
              <Card className="py-0 border-primary/20 bg-card shadow-lg shadow-primary/5">
                <CardContent className="p-6 space-y-5">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                      For developers
                    </h3>
                    <ul className="space-y-2.5 text-sm">
                      <li className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>
                          &ldquo;I need real Linux but I&apos;m stuck on a
                          Mac&rdquo;
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>
                          &ldquo;I can&apos;t get an AWS account&rdquo;
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>
                          &ldquo;Docker Desktop isn&apos;t real Linux&rdquo;
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>
                          &ldquo;My tests pass locally but break in prod&rdquo;
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="border-t border-border/50 pt-5">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                      For engineering managers
                    </h3>
                    <ul className="space-y-2.5 text-sm">
                      <li className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>
                          &ldquo;My team keeps asking for cloud access&rdquo;
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>
                          &ldquo;We&apos;re paying for EKS just for
                          dev/test&rdquo;
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>
                          &ldquo;Every VM means a ServiceNow ticket and days of
                          waiting&rdquo;
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>
                          5 seats for $125/mo — cheaper than one month of EKS
                        </span>
                      </li>
                    </ul>
                  </div>
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
                Long-lived microVMs for servers, clusters, and labs
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground mb-6">
                Run persistent workloads on cost-effective bare-metal instead of
                expensive cloud instances. Homelabs, Kubernetes, dev
                environments, and customer support — all with systemd and a full
                OS.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4 mb-6">
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
                      for development, testing, and demos.
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
                      at a fraction of cloud costs. No more unhinged cloud spend
                      for dev and test environments.
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
                      with systemd, matching your production environment.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Code className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      OCI images — extend with Docker
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Slicer&apos;s base images are OCI images. Extend them with
                      a Dockerfile — add packages, tooling, or your own software
                      in a single build step.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative hidden sm:block">
              <Card className="py-0 border-primary/20 bg-card shadow-lg shadow-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-xs font-mono text-muted-foreground">
                      Dockerfile
                    </span>
                  </div>
                  <pre className="overflow-x-auto text-sm font-mono">
                    <code>
                      <span className="text-muted-foreground">{`# Extend a Slicer OS image with Docker/BuildKit`}</span>
                      {`

FROM ghcr.io/openfaasltd/\\
  slicer-systemd-ubuntu24.04:\\
  6.1.90-x86_64-latest

RUN apt-get update -qy \\
  && apt-get install -qy \\
    python3 python3-pip

RUN curl -sLS \\
  https://get.docker.com | bash
RUN systemctl enable --now docker
RUN usermod -aG docker ubuntu`}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What teams use Slicer for */}
      <section className="border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-balance mb-3">
                How teams use Slicer every day
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground mb-6">
                From customer support to product testing to full Kubernetes
                clusters — real workflows on real Linux, not cloud simulations.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Customer support in seconds
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Reproduce a customer&apos;s issue on their exact OS. Boot
                      a fresh Ubuntu or Rocky environment, debug, ship the fix —
                      all in minutes.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Play className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Fast local iteration</h3>
                    <p className="text-sm text-muted-foreground">
                      Build, test, and iterate locally with VSOCK I/O — no
                      pushing to a remote server. Tear down and rebuild in under
                      a second.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Layers className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      HA Kubernetes clusters
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Spin up{" "}
                      <a
                        href="https://docs.slicervm.com/examples/ha-k3s/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        multi-node clusters
                      </a>{" "}
                      with real networking and{" "}
                      <a
                        href="https://docs.slicervm.com/examples/autoscaling-k3s/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        autoscaling nodes
                      </a>
                      . Simulate real cloud infrastructure on a single
                      bare-metal host.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Enterprise &amp; airgap OS coverage
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Test against{" "}
                      <a
                        href="https://docs.slicervm.com/reference/images/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        Ubuntu LTS and Rocky Linux
                      </a>{" "}
                      (RHEL-compatible) on x86_64 and arm64. Ship with
                      confidence to enterprise and airgapped environments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative hidden sm:block">
              <Card className="py-0 border-primary/20 bg-card shadow-lg shadow-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-xs font-mono text-muted-foreground">
                      Ask your AI Agent to reproduce support tickets
                    </span>
                  </div>
                  <pre className="overflow-x-auto text-sm font-mono whitespace-pre-wrap">
                    <code>
                      <span className="text-muted-foreground">{`## AGENTS.md

# Customer support environment

## Setup`}</span>
                      {`
$ slicer new support \\
    --image ghcr.io/openfaasltd/\\
    slicer-systemd-rocky9:\\
    5.10.240-x86_64-latest \\
    > support.yaml
$ slicer up ./support.yaml
$ slicer vm exec support-1 -- \\
    bash -c "curl -sLS \\
    https://get.docker.com | bash"
$ slicer vm exec support-1 -- \\
    usermod -aG docker slicer
$ slicer vm exec support-1 -- \\
    bash -c "curl -sLSf \\
    https://cli.openfaas.com | bash"`}
                      <span className="text-muted-foreground">{`

## Prompt`}</span>
                      {`
Use AGENTS.md to investigate case #4821.
Customer says Python template fails to
build on OpenFaaS CE with Rocky 9.`}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-b border-border/50">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-balance mb-3">
            Battle-tested in production
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Slicer&apos;s code has run{" "}
            <a
              href="https://actuated.com/blog/millions-of-cncf-minutes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
            >
              3M+ CI minutes on Arm runners for CNCF
            </a>{" "}
            — securing the ecosystem before it hit GitHub&apos;s roadmap.
          </p>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto mt-6">
            Alex Ellis, founder of OpenFaaS: We&apos;ve run Slicer internally
            since 2022 which has kept our cloud costs really low and given us
            the fastest response times we&apos;ve seen yet on customer support
            tickets.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border/50 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Real Linux, on your hardware, in milliseconds.
          </h2>
          <p className="text-muted-foreground mb-4 max-w-xl mx-auto">
            Start with a 14-day free trial. No security review needed — it runs
            on your machine.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Individual from{" "}
            <span className="font-semibold text-foreground">$25/mo</span>
            {" · "}Team{" "}
            <span className="font-semibold text-foreground">$125/mo</span>
            {" · "}Platform{" "}
            <span className="font-semibold text-foreground">$250/mo</span>
            /daemon
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="font-mono" asChild>
              <Link href="/pricing">
                See Plans &amp; Pricing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="font-mono" asChild>
              <Link
                href="https://docs.google.com/forms/d/e/1FAIpQLSdDdWbzoRFjGmLTuMI7h-OBhybzXewaNL-hoKTnbU8Wbz7bRA/viewform?usp=sharing&ouid=108694999418382910484"
                target="_blank"
                rel="noopener noreferrer"
              >
                Talk to Our Team
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
