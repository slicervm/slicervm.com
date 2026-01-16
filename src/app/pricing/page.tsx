"use client";

import { useState } from "react";
import CheckoutModal from "../../components/CheckoutModal";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="border-b border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-balance mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Run Slicer at home, for commercial hosting, or find out about our enterprise solutions.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Home Edition Tier */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Home Edition</CardTitle>
              <CardDescription className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">$25</div>
                <div className="text-muted-foreground">per month</div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Unlimited Slicer installations for personal use only
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Fastest and best supported way to experiment with microVMs
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Deploy almost anywhere i.e. WSL, RPi 4/5, NUCs, <a href="https://blog.alexellis.io/slicer-bare-metal-preview/" className="underline underline-offset-2 hover:text-primary">N100</a>, mini PCs,
                    racked servers, <a href="https://www.hetzner.com/dedicated-rootserver/matrix-ax/" className="underline underline-offset-2 hover:text-primary">Hetzner bare-metal</a>, etc
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Run lightweight appliances: <a href="https://docs.slicervm.com/examples/router-firewall/" className="underline underline-offset-2 hover:text-primary">Linux firewall/router</a> that you can actually understand and customise, or an <a href="https://docs.slicervm.com/examples/pihole-adblock/" className="underline underline-offset-2 hover:text-primary">ad blocker</a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Learn Kubernetes at your own pace or shortcut the process with <a href="https://github.com/alexellis/k3sup?tab=readme-ov-file#k3sup-pro" className="underline underline-offset-2 hover:text-primary">K3sup Pro</a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Build your own serverless functions and cron triggers with <a href="https://github.com/openfaas/faasd?tab=readme-ov-file" className="underline underline-offset-2 hover:text-primary">OpenFaaS Edge</a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Run <span className="font-mono">slicer activate</span> to join our Discord server to talk to like-minded self-hosters, experimenters, and home-labbers
                  </span>
                </li>
              </ul>

              <Button className="w-full font-mono" size="lg" asChild>
                <Link
                  href="https://github.com/sponsors/alexellis"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pay via GitHub Sponsors
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Pro Tier */}
          <Card className="border-primary/50 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground font-mono">
                Use Slicer for work
              </Badge>
            </div>

            <CardHeader>
              <CardTitle className="text-center text-2xl">Pro Tier</CardTitle>
              <CardDescription className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">$250</div>
                <div className="text-muted-foreground">per month per seat</div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Services: Run systemd-based Linux microVMs for: servers, containers, and <a href="https://docs.slicervm.com/examples/autoscaling-k3s/" className="underline underline-offset-2 hover:text-primary">autoscaling Kubernetes</a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Sandboxes: Run ephemeral jobs in microVMs via <a href="https://docs.slicervm.com/reference/api/" className="underline underline-offset-2 hover:text-primary">REST API</a> or <a className="underline underline-offset-2 hover:text-primary" href="https://docs.slicervm.com/tasks/execute-commands-with-sdk/">Go SDK</a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Built-in guest agent for native: <a href="https://docs.slicervm.com/tasks/execute-commands/" className="underline underline-offset-2 hover:text-primary">cp, exec, shell, metrics, and port-forwarding</a>.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Customise microVMs via userdata or a custom Docker image
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Supported Operating Systems: Ubuntu LTS (x86_64 and arm64) and Rocky 9 (x86_64)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    <a href="https://docs.slicervm.com/reference/vfio/" className="underline underline-offset-2 hover:text-primary">Mount GPUs</a> into microVMs for AI/LLMs
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    <Link
                      href="https://actuated.com/blog/bringing-firecracker-to-jenkins"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      Jenkins plugin
                    </Link>{" "}
                    for ephemeral build slaves
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Support via email - business hours
                  </span>
                </li>
              </ul>

              <Button
                className="w-full font-mono cursor-pointer"
                size="lg"
                onClick={() => setIsModalOpen(true)}
              >
                Purchase Seats
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Tier */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Enterprise</CardTitle>
              <CardDescription className="text-center">
                <div className="text-4xl font-bold text-muted-foreground mb-2">
                  Custom
                </div>
                <div className="text-muted-foreground">&nbsp;</div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Pricing that scales with your needs
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Pay annually by invoice - USD ACH or SWIFT in GBP
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Operating Systems: Ubuntu LTS, RHEL-like (Rocky Linux), and other custom images as required.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Private Slack channel</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Priority support within 1 business day
                  </span>
                </li>
              </ul>

              <Button
                variant="outline"
                className="w-full font-mono"
                size="lg"
                asChild
              >
                <Link
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdDdWbzoRFjGmLTuMI7h-OBhybzXewaNL-hoKTnbU8Wbz7bRA/viewform?usp=sharing&ouid=108694999418382910484"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact Us
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
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

      {/* Footer */}
      <Footer />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
