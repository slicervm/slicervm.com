"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  HelpCircle,
  Monitor,
  Server,
  Cloud,
  Cpu,
  Info,
} from "lucide-react";
import Link from "next/link";

function EducationalVideosSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="relative border-b border-border/50 bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <div className="absolute inset-0 bg-grid-slate-900/[0.02] dark:bg-grid-slate-400/[0.03] bg-[size:32px_32px]" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-primary/30 bg-primary/10 px-6 py-2 text-sm font-semibold text-primary mb-4">
            <HelpCircle className="h-4 w-4" />
            New to microVMs?
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-balance mb-3">
            microVMs explained in 3 videos
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-border">
            <button
              onClick={() => setActiveTab(0)}
              className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                activeTab === 0
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              1/3 Firecracker Fundamentals
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                activeTab === 1
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              2/3 Face-off: containers vs. microVMs
            </button>
            <button
              onClick={() => setActiveTab(2)}
              className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                activeTab === 2
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              3/3 Customer support & test environments
            </button>
          </div>

          {/* Tab Content */}
          <Card className="overflow-hidden border-2 border-primary/20 bg-card shadow-lg shadow-primary/5">
            <CardContent className="p-0">
              {activeTab === 0 && (
                <>
                  <div className="relative aspect-video bg-muted">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src="https://www.youtube.com/embed/CYCsa5e2vqg?start=38"
                      title="What's Firecracker or a microVM?"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-lg">
                        What&apos;s Firecracker or a microVM?
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Learn about Firecracker microVMs and how they differ from
                      traditional VMs and containers.
                    </p>
                  </div>
                </>
              )}
              {activeTab === 1 && (
                <>
                  <div className="relative aspect-video bg-muted">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src="https://www.youtube.com/embed/pTQ_jVYhAoc?start=2"
                      title="Face-off: microVMs vs. containers"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-lg">
                        Face-off: microVMs vs. containers
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      A detailed comparison between microVMs and containers to
                      help you choose the right technology.
                    </p>
                  </div>
                </>
              )}
              {activeTab === 2 && (
                <>
                  <div className="relative aspect-video bg-muted">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src="https://www.youtube.com/embed/XCBJ0XNqpWE"
                      title="Quicker customer support & low-cost test environments"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-lg">
                        Quicker customer support & low-cost test environments
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      See how we use Slicer to slice up bare-metal for customer
                      support and development workflows.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default function MicroVMsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Educational Videos Section */}
      <EducationalVideosSection />

      {/* Where can you run Slicer? */}
      <section className="border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-balance mb-3">
              Where can you run Slicer?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Slicer for Linux uses KVM. Slicer for Mac uses Apple
              Virtualization. Run on your own hardware, in the cloud, or both.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {/* Desktop / Laptop */}
            <Card className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Monitor className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-sm">
                    Desktop &amp; Laptop
                  </h3>
                </div>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li>Linux (bare-metal KVM)</li>
                  <li>Mac (Apple Virtualization)</li>
                  <li>Windows via WSL2</li>
                </ul>
              </CardContent>
            </Card>

            {/* Homelab / Edge */}
            <Card className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-sm">Homelab &amp; Edge</h3>
                </div>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li>Any x86_64 or arm64 Linux host with KVM support</li>
                  <li>Mini PCs like: Beelink, Geekom, Intel NUC, N100</li>
                  <li>Raspberry Pi 4 / 5</li>
                </ul>
              </CardContent>
            </Card>

            {/* Bare-metal */}
            <Card className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Server className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-sm">Bare-metal Servers</h3>
                </div>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="https://www.hetzner.com/dedicated-rootserver/matrix-ax/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      Hetzner dedicated
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://aws.amazon.com/ec2/instance-types/#Bare_Metal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      AWS Metal instances
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://phoenixnap.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      PhoenixNAP
                    </Link>
                    {", "}
                    <Link
                      href="https://www.vultr.com/products/bare-metal/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      Vultr
                    </Link>
                    {", "}
                    <Link
                      href="https://www.scaleway.com/en/dedibox/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      Scaleway
                    </Link>
                    {", "}
                    <Link
                      href="https://www.ovhcloud.com/en/bare-metal/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      OVHCloud
                    </Link>
                  </li>
                  <li>Any racked or colo server</li>
                </ul>
              </CardContent>
            </Card>

            {/* Nested Virtualization */}
            <Card className="border-primary/30">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Cloud className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-sm">
                    Nested Virtualization
                  </h3>
                </div>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="https://cloud.google.com/compute/docs/instances/nested-virtualization/overview"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      Google Cloud (GCE)
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://learn.microsoft.com/en-us/azure/virtual-machines/av2-series"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      Microsoft Azure
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://docs.oracle.com/en-us/iaas/Content/Compute/Tasks/nested-virtualization-enabling.htm"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      Oracle Cloud (OCI)
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://docs.digitalocean.com/products/droplets/concepts/droplet-concepts/#nested-virtualization"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      DigitalOcean
                    </Link>
                  </li>
                  <li className="flex items-center gap-1">
                    <span>
                      <Link
                        href="https://aws.amazon.com/about-aws/whats-new/2026/02/amazon-ec2-nested-virtualization-on-virtual/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-primary"
                      >
                        AWS EC2
                      </Link>
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0"
                    >
                      New
                    </Badge>
                    <span className="relative group inline-flex items-center">
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 text-xs text-muted-foreground bg-popover border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        Available on C8i, M8i, and R8i instances (Intel Xeon 6)
                        in all commercial regions. KVM supported as L1
                        hypervisor.
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover"></span>
                      </span>
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6 max-w-2xl mx-auto">
            Slicer for Linux requires a host with KVM support.{" "}
            <Link
              href="https://docs.slicervm.com/reference/vfio/"
              className="underline underline-offset-2 hover:text-primary"
            >
              GPU passthrough (VFIO)
            </Link>{" "}
            is available on bare-metal hosts for AI and LLM workloads.
          </p>
        </div>
      </section>

      {/* Value Prop Section */}
      <section className="border-b border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-balance mb-3">
                End-to-End Firecracker in your own product within a few hours
              </h2>
            </div>
            <Card className="border-primary/20 bg-card shadow-lg shadow-primary/5">
              <CardContent className="p-3 sm:p-6">
                <h3 className="font-semibold mb-4 text-foreground">
                  You&apos;re not just buying software – you&apos;re skipping
                  months of painful low-level integration work
                </h3>
                <p className="text-base sm:text-sm leading-relaxed text-muted-foreground mb-4">
                  Slicer turns{" "}
                  <a
                    href="https://firecracker-microvm.github.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-primary"
                  >
                    the very raw Firecracker technology
                  </a>{" "}
                  into a production-ready product that&apos;s as easy to use as
                  containers or AWS EC2.
                </p>
                <p className="text-base sm:text-sm leading-relaxed text-muted-foreground mb-4">
                  Included in the package: supported Kernels and base images, a
                  REST API, powerful guest agent, Go SDK, and built-in firewall
                  support.
                </p>

                <div className="mt-3 pt-3 border-t border-border/50">
                  <h3 className="font-semibold mb-2 text-foreground">
                    Slicer microVMs: Battle-tested in production
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    <p className="text-base sm:text-sm leading-relaxed text-muted-foreground mb-4">
                      Slicer&apos;s code has been used to run{" "}
                      <a
                        className="underline underline-offset-2 hover:text-primary"
                        href="https://actuated.com/blog/millions-of-cncf-minutes"
                      >
                        millions of GitHub Actions CI jobs for CNCF and various
                        other LinuxFoundation projects
                      </a>
                      .
                    </p>
                    <p className="text-base sm:text-sm leading-relaxed text-muted-foreground mb-4">
                      Since 2022 our team at OpenFaaS Ltd has used Slicer every
                      day to set up labs for product development,{" "}
                      <a
                        href="https://www.openfaas.com/blog/large-scale-functions/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-primary"
                      >
                        load-testing
                      </a>
                      , and for delivering fast customer support.
                    </p>
                    <p className="text-base sm:text-sm leading-relaxed text-muted-foreground mb-4">
                      Our own long-term production workloads from Kubernetes
                      clusters, to{" "}
                      <a
                        className="underline underline-offset-2 hover:text-primary"
                        href="https://blog.alexellis.io/ai-code-review-bot/"
                      >
                        our crucial code review bot
                      </a>
                      , to APIs all run on bare-metal powered by Slicer.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
