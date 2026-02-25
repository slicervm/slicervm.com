"use client";

import { useState } from "react";
import CheckoutModal from "../../components/CheckoutModal";
import IndividualModal from "../../components/IndividualModal";
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
import {
  Check,
  ArrowRight,
  Info,
  X,
  Sparkles,
  Zap,
  Shield,
  Cpu,
} from "lucide-react";
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
            Linux that runs like localhost — because it is.
          </h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Make development feel like production - for AI sandboxes, native
            Linux applications, and Kubernetes.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Zap className="h-4 w-4 text-primary shrink-0" />
              Sub-second boot, local-first I/O
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Shield className="h-4 w-4 text-primary shrink-0" />
              VM &amp; network isolation
              <span className="relative group inline-flex items-center">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2 text-xs text-muted-foreground bg-popover border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-normal">
                  Powered by KVM on Linux and Apple Virtualization on Mac.
                  <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover"></span>
                </span>
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Cpu className="h-4 w-4 text-primary shrink-0" />
              REST API, Go SDK, and CLI
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <Card className="border-border/50 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge variant="secondary" className="font-mono">
                Just for you
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
              <p className="text-sm text-muted-foreground text-center">
                For a solo developer or single-person evaluation: core Slicer
                features on your own device(s).
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    <span className="font-medium text-primary">
                      14-day free trial, then $25/mo
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm flex items-center gap-1">
                    <span>
                      Run on Linux, WSL2, and Mac: 2x concurrent Slicer daemons
                    </span>
                    <span className="relative group inline-flex items-center">
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-2 text-xs text-muted-foreground bg-popover border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        Run 2x Slicer daemons at any one time on any mix of
                        Slicer for Mac, Slicer for Linux, or WSL2.
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover"></span>
                      </span>
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Personal and commercial use as part of your day job
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Automate via{" "}
                    <Link
                      href="https://docs.slicervm.com/reference/api/"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      REST API
                    </Link>
                    ,{" "}
                    <Link
                      href="https://docs.slicervm.com/tasks/execute-commands-with-sdk/"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      Go SDK
                    </Link>
                    , and CLI
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm flex items-center gap-1">
                    <span>
                      Includes{" "}
                      <Link
                        href="https://github.com/alexellis/k3sup?tab=readme-ov-file#k3sup-pro"
                        className="underline underline-offset-2 hover:text-primary"
                      >
                        K3sup Pro
                      </Link>{" "}
                      for HA Kubernetes clusters over SSH
                    </span>
                    <span className="relative group inline-flex items-center">
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 p-2 text-xs text-muted-foreground bg-popover border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        K3sup Pro is a terraform-like tool for building and
                        maintaining Kubernetes clusters over SSH.
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover"></span>
                      </span>
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Community support via Discord</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm flex items-center gap-1">
                    <span>Paid via GitHub Sponsors</span>
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
                  <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <span>Not for shared deployments/infrastructure</span>
                    <span className="relative group inline-flex items-center">
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
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
                Get Slicer
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/50 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground font-mono">
                For your team
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
              <p className="text-sm text-muted-foreground text-center">
                Designed for teams using Slicer on their own laptops and
                desktops.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    5 seat baseline (starter team), plus $25/mo per extra seat
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm flex items-center gap-1">
                    <span>
                      2x Slicer daemons per seat (Linux, WSL2, and Mac)
                    </span>
                    <span className="relative group inline-flex items-center">
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-2 text-xs text-muted-foreground bg-popover border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        Each developer can run 2x Slicer daemons at any one time
                        on any mix of Slicer for Mac, Slicer for Linux, or WSL2.
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover"></span>
                      </span>
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    One seat per named developer, used on their own device(s)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Automate via{" "}
                    <Link
                      href="https://docs.slicervm.com/reference/api/"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      REST API
                    </Link>
                    ,{" "}
                    <Link
                      href="https://docs.slicervm.com/tasks/execute-commands-with-sdk/"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      Go SDK
                    </Link>
                    , and CLI
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Every seat includes 2 concurrent daemons on Linux, WSL2, or
                    Mac
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Community support via Discord</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Self-service billing with debit/credit card
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <span>Not for shared deployments/infrastructure</span>
                    <span className="relative group inline-flex items-center">
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
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
              <Badge
                variant="secondary"
                className="text-primary border-primary/30 font-mono"
              >
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
              <p className="text-sm text-muted-foreground text-center">
                For shared infrastructure, internal systems, and customer-facing
                products with Slicer for Linux.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Slicer for Linux on shared or remote servers
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Build internal developer platforms and automation
                    infrastructure
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Embed microVM sandboxes in customer-facing SaaS products
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Automate via{" "}
                    <Link
                      href="https://docs.slicervm.com/reference/api/"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      REST API
                    </Link>
                    ,{" "}
                    <Link
                      href="https://docs.slicervm.com/tasks/execute-commands-with-sdk/"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      Go SDK
                    </Link>
                    , and CLI
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Licensed per running daemon -- add capacity as you scale
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Private Discord channel and email support
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Self-service billing with debit/credit card
                  </span>
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
                Every Plan Includes
              </CardTitle>
              <CardDescription className="text-center">
                Core capabilities across Individual, Team, and Platform -- no
                feature gating.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Two Ways to Run MicroVMs
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">
                        <span className="font-medium">Services</span> --
                        long-lived systemd-based microVMs for servers,
                        containers, and{" "}
                        <Link
                          href="https://docs.slicervm.com/examples/autoscaling-k3s/"
                          className="underline underline-offset-2 hover:text-primary"
                        >
                          autoscaling Kubernetes
                        </Link>
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">
                        <span className="font-medium">Sandboxes</span> --
                        ephemeral microVMs for AI agents, automated tasks, and
                        code execution via{" "}
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
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Built-in VM Management
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">
                        Guest agent with{" "}
                        <Link
                          href="https://docs.slicervm.com/tasks/execute-commands/"
                          className="underline underline-offset-2 hover:text-primary"
                        >
                          cp, exec, shell, metrics, and port-forwarding
                        </Link>
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">
                        Customise microVMs via userdata or custom Docker/OCI
                        images
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">
                        Ubuntu LTS (x86_64/arm64) and Rocky 9 (x86_64)
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-primary" />
                    Run Anywhere
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">
                        <Link
                          href="https://docs.slicervm.com/reference/vfio/"
                          className="underline underline-offset-2 hover:text-primary"
                        >
                          Mount GPUs
                        </Link>{" "}
                        into microVMs for AI and LLM workloads
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">
                        Laptops, homelabs, bare-metal servers, and cloud VMs --{" "}
                        <Link
                          href="/microvms"
                          className="underline underline-offset-2 hover:text-primary"
                        >
                          see where Slicer runs
                        </Link>
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">
                        Explore more in the{" "}
                        <Link
                          href="https://docs.slicervm.com/examples/"
                          className="underline underline-offset-2 hover:text-primary"
                        >
                          Slicer docs and examples
                        </Link>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enterprise / Custom CTA */}
      <section className="border-t border-border/50 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              Need a custom plan?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              For larger deployments, volume licensing, or specific
              requirements, we offer custom terms on top of the Team and
              Platform plans.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
            <div className="flex items-start gap-2.5">
              <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">
                Optional: SLA for fast response times
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">Dedicated Slack channel</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">Invoicing via SWIFT or ACH</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">
                Volume discounts and annual billing
              </span>
            </div>
          </div>
          <div className="text-center">
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
      <IndividualModal
        isOpen={isIndividualModalOpen}
        onClose={() => setIsIndividualModalOpen(false)}
      />
    </div>
  );
}
