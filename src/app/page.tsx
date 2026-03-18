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
                Full VMs with systemd and a dedicated kernel — on your Mac, your
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
                    Bare-metal performance
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
                Isolated compute, ready to ship
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground mb-6">
                Isolated Linux VMs with the ease of containers — a real kernel, systemd, and full OS. Launch from code, tear down when done.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Code className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Skip the Firecracker boilerplate</h3>
                    <p className="text-sm text-muted-foreground">
                      Real VM isolation powered by Firecracker and cloud-hypervisor — without managing the stack. Embed sandboxes in your product via{" "}
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
                      Self-hosted. Zero metering.
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      E2B, Modal, and Daytona meter by the second. Slicer runs on your hardware — flat rate, data never leaves your network.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Cold boot in under a second
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      ZFS snapshots make every launch instant. Test, throw away, repeat — no waiting for images or provisioning.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Code className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Automate VMs like API calls
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Copy files in, run commands, pull results out. No SSH, no Ansible — just Slicer&apos;s{" "}
                      <a
                        href="https://docs.slicervm.com/getting-started/install/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        CLI
                      </a>
                      ,{" "}
                      <a
                        href="https://docs.slicervm.com/reference/api/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        REST API
                      </a>
                      , or{" "}
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
$ slicer vm cp vm-1:/tmp/REVIEW.md ./REVIEW.md
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
            cron. Run Kubernetes clusters, long-lived servers, or replace your
            entire dev VM stack — one platform.
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
                Real Linux on your Mac
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground mb-6">
                No cloud access, no VPN, no AWS account. Real Linux with systemd on your laptop — matching production.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Goodbye approval fatigue</h3>
                    <p className="text-sm text-muted-foreground">
                      Run{" "}
                      <a
                        href="https://docs.slicervm.com/mac/coding-agents/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        Claude, Codex, and OpenCode
                      </a>{" "}
                      in its own VM with root access. Copy out the results when it&apos;s done.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Kubernetes on your laptop</h3>
                    <p className="text-sm text-muted-foreground">
                      Spin up{" "}
                      <a
                        href="https://docs.slicervm.com/mac/kubernetes/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        K3s inside a Slicer VM
                      </a>
                      . Test Helm charts, validate RBAC, iterate on controllers — on your own machine.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Server className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Edit on Mac, run on Linux
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      <a
                        href="https://docs.slicervm.com/mac/folder-sharing/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        VirtioFS
                      </a>{" "}
                      mounts your Mac directory into the VM. Agents, builds, and tests see the same files — no copying, no syncing.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Layers className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Replace Docker Desktop, Colima, Lima, and UTM
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Ephemeral sandboxes and long-lived servers in one tool. Faster boot, real systemd, and a workflow that just works.
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
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0 mt-2" />
                        <span>
                          &ldquo;I need real Linux but I&apos;m stuck on a
                          Mac&rdquo;
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0 mt-2" />
                        <span>
                          &ldquo;We don&apos;t have our own cloud
                          accounts&rdquo;
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0 mt-2" />
                        <span>
                          &ldquo;I wish Claude Code could run
                          uninterrupted&rdquo;
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0 mt-2" />
                        <span>
                          &ldquo;Wanted a VM, got a helpdesk ticket from
                          IT&rdquo;
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
                Persistent workloads on bare-metal instead of expensive cloud instances. Kubernetes, dev environments, homelabs — full OS with systemd.
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
                      One of the fastest ways to spin up{" "}
                      <a
                        href="https://docs.slicervm.com/examples/ha-k3s/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        HA Kubernetes clusters
                      </a>{" "}
                      with{" "}
                      <a
                        href="https://docs.slicervm.com/examples/autoscaling-k3s/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        node autoscaling
                      </a>{" "}
                      for development, testing, and demos.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Gpu className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Accelerate AI Workloads with GPUs
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Attach GPUs to microVMs for inference, fine-tuning,
                      transcription, and more.
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
                      Run on{" "}
                      <a
                        href="https://www.hetzner.com/dedicated-rootserver"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        bare-metal
                      </a>{" "}
                      at a fraction of cloud costs. No more unhinged cloud spend for dev and test.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Server className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Ubuntu & Rocky Linux
                    </h3>
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
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border/50 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Real Linux, on your hardware, in milliseconds.
          </h2>
          <p className="text-muted-foreground mb-4 max-w-xl mx-auto">
            Start with a 14-day free trial. Runs on your own hardware — nothing leaves your machine.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            <span className="font-semibold text-foreground">$25/mo</span>
            {" · "}Team{" "}
            <span className="font-semibold text-foreground">$25/mo</span>
            /seat{" · "}Platform{" "}
            <span className="font-semibold text-foreground">$250/mo</span>
            /server
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
