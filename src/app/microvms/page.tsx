"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import {
  Video,
  HelpCircle,
} from "lucide-react";

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
                      title="What&apos;s Firecracker or a microVM?"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-lg">What&apos;s Firecracker or a microVM?</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Learn about Firecracker microVMs and how they differ from traditional VMs and containers.
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
                      <h3 className="font-semibold text-lg">Face-off: microVMs vs. containers</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      A detailed comparison between microVMs and containers to help you choose the right technology.
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
                      <h3 className="font-semibold text-lg">Quicker customer support & low-cost test environments</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      See how we use Slicer to slice up bare-metal for customer support and development workflows.
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
                You&apos;re not just buying software – you&apos;re skipping months of painful low-level integration work
                </h3>
                <p className="text-base sm:text-sm leading-relaxed text-muted-foreground mb-4">
                  Slicer turns <a href="https://firecracker-microvm.github.io/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary">the very raw Firecracker technology</a> into a production-ready product that&apos;s as easy to use as containers or AWS EC2.
                </p>
                  <p className="text-base sm:text-sm leading-relaxed text-muted-foreground mb-4">
                  Included in the package: supported Kernels and base images, a REST API, powerful guest agent, Go SDK, and built-in firewall support.
                </p>

                <div className="mt-3 pt-3 border-t border-border/50">
                  <h3 className="font-semibold mb-2 text-foreground">
                    Slicer microVMs: Battle-tested in production
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    <p className="text-base sm:text-sm leading-relaxed text-muted-foreground mb-4">
                      Slicer&apos;s code has been used to run <a className="underline underline-offset-2 hover:text-primary" href="https://actuated.com/blog/millions-of-cncf-minutes">millions of GitHub Actions CI jobs for CNCF and various other LinuxFoundation projects</a>.</p>
                    <p className="text-base sm:text-sm leading-relaxed text-muted-foreground mb-4">
                      Since 2022 our team at OpenFaaS Ltd has used Slicer every day to set up labs for product development, <a href="https://www.openfaas.com/blog/large-scale-functions/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary">load-testing</a>, and for delivering fast customer support. 
                      </p>
                      <p className="text-base sm:text-sm leading-relaxed text-muted-foreground mb-4">
                      Our own long-term production workloads from Kubernetes clusters, to <a className="underline underline-offset-2 hover:text-primary" href="https://blog.alexellis.io/ai-code-review-bot/">our crucial code review bot</a>, to APIs all run on bare-metal powered by Slicer.
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
