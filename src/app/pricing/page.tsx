"use client";

import { useState } from "react";
import CheckoutModal from "../../components/CheckoutModal";
import HomeEditionModal from "../../components/HomeEditionModal";
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
import { Check, ArrowRight, Info, X, Sparkles } from "lucide-react";
import Link from "next/link";

const SALES_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdDdWbzoRFjGmLTuMI7h-OBhybzXewaNL-hoKTnbU8Wbz7bRA/viewform?usp=sharing&ouid=108694999418382910484";
const TEAM_CHECKOUT_URL =
  "https://subscribe.openfaas.com/checkout/buy/cbf41f9b-9ab3-4c04-b64a-2c00c5d725ac";
const PLATFORM_CHECKOUT_URL =
  "https://subscribe.openfaas.com/checkout/buy/3c45d053-f618-4212-845b-f7938824ad22";

export default function Pricing() {
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
  const [isIndividualModalOpen, setIsIndividualModalOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="border-b border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-balance mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Individual and Team are per-developer seats for use on your own
            devices. Platform is for shared deployments and infrastructure.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <Card className="border-border/50 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge variant="secondary" className="font-mono">
                Solo developer seat
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-center text-2xl">Individual</CardTitle>
              <CardDescription className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">$25</div>
                <div className="text-muted-foreground">USD per month</div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    <span className="font-medium text-primary">
                      Free trial available
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm flex items-center gap-1">
                    <span>Personal and commercial use as part of your day job</span>
                    <span className="relative group inline-flex items-center">
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-2 text-xs text-muted-foreground bg-popover border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        The Individual tier is intended to be paid for by the
                        user.
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover"></span>
                      </span>
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Best for a single developer running Slicer locally
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm flex items-center gap-1">
                    <span>Ideal for home-labs and self-hosting</span>
                    <span className="relative group inline-flex items-center">
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-2 text-xs text-muted-foreground bg-popover border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        May use Slicer to self-host non-commercial websites,
                        services, APIs, etc.
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover"></span>
                      </span>
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm flex items-center gap-1">
                    <span>2x Slicer daemons</span>
                    <span className="relative group inline-flex items-center">
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-2 text-xs text-muted-foreground bg-popover border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        Run 2x Slicer daemons at any one time on any mix of
                        Slicer for Mac or Slicer for Linux.
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover"></span>
                      </span>
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-sm flex items-center gap-1">
                    <span>Optional: Upgrade to 5x Slicer daemons</span>
                    <span className="relative group inline-flex items-center">
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-2 text-xs text-muted-foreground bg-popover border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        Select 50 USD / mo tier on GitHub Sponsors to run an
                        additional 3x Slicer daemons.
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover"></span>
                      </span>
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    One seat is one named developer on that developer&apos;s own
                    device(s)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Includes{" "}
                    <Link
                      href="https://github.com/alexellis/k3sup?tab=readme-ov-file#k3sup-pro"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      K3sup Pro
                    </Link>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Support via Discord</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Paid via GitHub Sponsors
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <span>
                      Not for shared deployments/infrastructure
                    </span>
                    <span className="relative group inline-flex items-center">
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-2 text-xs text-muted-foreground bg-popover border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        Choose Platform for any shared server, internal system,
                        customer-facing product, or SaaS backend.
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover"></span>
                      </span>
                    </span>
                  </span>
                </li>
              </ul>

              <Button
                className="w-full font-mono cursor-pointer"
                size="lg"
                onClick={() => setIsIndividualModalOpen(true)}
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/50 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground font-mono">
                Developer team seats
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-center text-2xl">Team</CardTitle>
              <CardDescription className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">$125</div>
                <div className="text-muted-foreground">USD per month</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Includes 5x seats
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Best for teams where each developer runs Slicer locally
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    One seat is one named developer on that developer&apos;s own
                    device(s)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm flex items-center gap-1">
                    <span>2x Slicer daemons</span>
                    <span className="relative group inline-flex items-center">
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-2 text-xs text-muted-foreground bg-popover border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        Run 2x Slicer daemons at any one time on any mix of
                        Slicer for Mac or Slicer for Linux.
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover"></span>
                      </span>
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Additional seats 25 USD / mo per seat
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Support via Discord</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Self-service with debit/credit-card
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <span>
                      Not for shared deployments/infrastructure
                    </span>
                    <span className="relative group inline-flex items-center">
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-2 text-xs text-muted-foreground bg-popover border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        Choose Platform for any shared server, internal system,
                        customer-facing product, or SaaS backend.
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover"></span>
                      </span>
                    </span>
                  </span>
                </li>
              </ul>

              <Button
                className="w-full font-mono cursor-pointer"
                size="lg"
                onClick={() => setIsTeamModalOpen(true)}
              >
                Purchase Seats
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/50 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground font-mono">
                Shared infrastructure
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-center text-2xl">Platform</CardTitle>
              <CardDescription className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">$250</div>
                <div className="text-muted-foreground">
                  USD per installation/daemon per month
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Required for any deployment beyond an individual
                    developer&apos;s own devices
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Shared or remote server deployments
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Internal tools, internal platforms, and internal use
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Product integrations and customer-facing SaaS
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Licensed per installation/daemon
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Private Discord channel</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Email support</span>
                </li>
              </ul>

              <Button
                variant="outline"
                className="w-full font-mono cursor-pointer"
                size="lg"
                onClick={() => setIsPlatformModalOpen(true)}
              >
                Purchase Platform
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 max-w-5xl mx-auto">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Core Slicer Capabilities
              </CardTitle>
              <CardDescription className="text-center">
                Included across Individual, Team, and Platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Services: run systemd-based Linux microVMs for servers,
                    containers, and{" "}
                    <Link
                      href="https://docs.slicervm.com/examples/autoscaling-k3s/"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      autoscaling Kubernetes
                    </Link>
                    .
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Sandboxes: run ephemeral jobs in microVMs via{" "}
                    <Link
                      href="https://docs.slicervm.com/reference/api/"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      REST API
                    </Link>{" "}
                    or{" "}
                    <Link
                      href="https://docs.slicervm.com/tasks/execute-commands-with-sdk/"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      Go SDK
                    </Link>
                    .
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Built-in guest agent with{" "}
                    <Link
                      href="https://docs.slicervm.com/tasks/execute-commands/"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      cp, exec, shell, metrics, and port-forwarding
                    </Link>
                    .
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Customise microVMs via userdata or custom Docker images.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Supported operating systems: Ubuntu LTS (x86_64/arm64) and
                    Rocky 9 (x86_64).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    <Link
                      href="https://docs.slicervm.com/reference/vfio/"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      Mount GPUs
                    </Link>{" "}
                    into microVMs for AI/LLM workloads.
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
                    for ephemeral build workers.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Deploy almost anywhere: WSL, RPi 4/5, NUCs,{" "}
                    <Link
                      href="https://blog.alexellis.io/slicer-bare-metal-preview/"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      N100
                    </Link>
                    , mini PCs, racked servers, and{" "}
                    <Link
                      href="https://www.hetzner.com/dedicated-rootserver/matrix-ax/"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      Hetzner bare-metal
                    </Link>
                    .
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Run lightweight appliances like a{" "}
                    <Link
                      href="https://docs.slicervm.com/examples/router-firewall/"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      Linux firewall/router
                    </Link>{" "}
                    or{" "}
                    <Link
                      href="https://docs.slicervm.com/examples/pihole-adblock/"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      ad blocker
                    </Link>
                    .
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Learn Kubernetes with included{" "}
                    <Link
                      href="https://github.com/alexellis/k3sup?tab=readme-ov-file#k3sup-pro"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      K3sup Pro
                    </Link>
                    .
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Additional Information */}
      <section className="border-t border-border/50 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Got questions about{" "}
            <span className="text-primary font-mono">Slicer</span>?
          </h2>
          <p className="text-muted-foreground mb-8">
            Book a call with our team to get your questions answered.
          </p>
          <Button size="lg" variant="outline" className="font-mono" asChild>
            <Link
              href={SALES_FORM_URL}
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

      {/* Modals */}
      <CheckoutModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        plan="team"
        checkoutUrl={TEAM_CHECKOUT_URL}
      />
      <CheckoutModal
        isOpen={isPlatformModalOpen}
        onClose={() => setIsPlatformModalOpen(false)}
        plan="platform"
        checkoutUrl={PLATFORM_CHECKOUT_URL}
      />
      <HomeEditionModal
        isOpen={isIndividualModalOpen}
        onClose={() => setIsIndividualModalOpen(false)}
      />
    </div>
  );
}
