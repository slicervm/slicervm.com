import { Metadata } from "next";
import type { ReactNode } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Sparkles,
  Boxes,
  FolderSync,
  Wrench,
  Calendar,
  User,
  Cpu,
  Shield,
  Monitor,
} from "lucide-react";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/config";

const title = `Slicer for Mac - Real Linux on your MacBook | ${SITE_NAME}`;
const description =
  "Full Linux VMs with systemd on your Mac. Built on Apple's Virtualization framework. No cloud, no VPN, no IT ticket. Edit on Mac, run on Linux.";
const url = new URL("/mac/", SITE_URL).toString();

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description,
    url,
    siteName: SITE_NAME,
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/twitter-image"],
  },
};

const videos: Array<{ id: string; title: string; description: string }> = [
  {
    id: "Z3jtu5QT-Nk",
    title: "Slicer for Mac - tour",
    description:
      "A walk-through of the native Mac tray app, booting microVMs, and the developer workflow.",
  },
  {
    id: "haVGXjtSkgE",
    title: "Put your AI agent into a sandbox",
    description:
      "Run Claude Code, Codex, or OpenCode inside an isolated microVM on your MacBook.",
  },
];

type UseCase = {
  icon: typeof Sparkles;
  title: string;
  body: ReactNode;
};

const useCases: UseCase[] = [
  {
    icon: Sparkles,
    title: "Goodbye approval fatigue",
    body: (
      <>
        Run{" "}
        <a
          href="https://docs.slicervm.com/mac/coding-agents/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-primary"
        >
          Claude, Codex, and OpenCode
        </a>{" "}
        in their own VM with root access. Copy out the results when they&apos;re
        done. No more clicking through permissions for every shell command.
      </>
    ),
  },
  {
    icon: Boxes,
    title: "Kubernetes on your laptop",
    body: "Spin up K3s inside a Slicer VM. Test Helm charts, validate RBAC, iterate on controllers, on your own machine, matching production.",
  },
  {
    icon: Shield,
    title: "Slicer Proxy: egress + credentials",
    body: (
      <>
        Enforce default-deny network access on any VM with{" "}
        <Link
          href="/egress"
          className="underline underline-offset-2 hover:text-primary"
        >
          Slicer Proxy
        </Link>
        . Bearer, Basic, and OAuth credentials inject on the wire, so agents and
        untrusted workloads never see your secrets. Every request audited.
      </>
    ),
  },
  {
    icon: Wrench,
    title: "Replace Docker Desktop, Colima, Lima, UTM, Multipass, VirtualBox",
    body: (
      <>
        Ephemeral sandboxes and long-lived VMs in one tool. Responsive, and easy
        to automate with bash,{" "}
        <a
          href="https://github.com/slicervm/agent-skills"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-primary"
        >
          agent skills
        </a>
        , and the{" "}
        <a
          href="https://docs.slicervm.com/platform/go-sdk/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-primary"
        >
          Go
        </a>{" "}
        and{" "}
        <a
          href="https://docs.slicervm.com/platform/typescript-sdk/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-primary"
        >
          TypeScript
        </a>{" "}
        SDKs.
      </>
    ),
  },
];

const deepDives: Array<{
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
}> = [
  {
    slug: "slicer-for-mac-preview",
    title: "Slicer for Mac: Preview",
    excerpt:
      "How the native macOS port uses Apple's Virtualization framework, the tray app, and folder mounting.",
    date: "2026-02-11",
    author: "Alex Ellis",
  },
  {
    slug: "one-tool-for-agents-clusters-and-tests",
    title: "One tool for agents, clusters, and e2e tests",
    excerpt:
      "Coding agents on Mac via Slicer microVMs, plus production clustering on Linux with a consistent sandbox layer.",
    date: "2026-02-19",
    author: "Alex Ellis",
  },
];

export default function MacPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl mb-5">
            Real Linux. On your Mac.
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground text-pretty mb-6 max-w-3xl mx-auto">
            macOS only gives you POSIX compliance. Slicer runs containers,
            Kubernetes, and Firecracker, all on your MacBook.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <Button size="lg" className="font-mono" asChild>
              <Link href="/pricing">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="font-mono" asChild>
              <Link href="https://docs.slicervm.com/mac/overview/">
                Documentation
              </Link>
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link
              href="/egress"
              className="inline-flex items-center gap-1.5 whitespace-nowrap hover:text-foreground transition-colors"
            >
              <Shield className="h-4 w-4 text-primary shrink-0" />
              Egress + credential proxy
            </Link>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Cpu className="h-4 w-4 text-primary shrink-0" />
              Nested virtualization
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <FolderSync className="h-4 w-4 text-primary shrink-0" />
              VirtioFS folder mounts
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Monitor className="h-4 w-4 text-primary shrink-0" />
              Native tray app
            </span>
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="border-b border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {videos.map((v) => (
              <Card
                key={v.id}
                className="border-primary/20 bg-card overflow-hidden shadow-lg shadow-primary/5"
              >
                <div className="relative aspect-video bg-muted">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-1.5">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {v.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* One tool, the whole stack */}
      <section className="border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">
              One fast and lightweight tool for all your Linux development.
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Built and supported by the team behind OpenFaaS, Inlets, and
              Actuated.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {useCases.map(({ icon: Icon, title, body }) => (
              <Card key={title} className="border-border/50 bg-card">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 border border-primary/20 shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1.5">{title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {body}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Deep dives */}
      <section className="border-b border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Read more
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 max-w-5xl mx-auto">
            {deepDives.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block group"
              >
                <Card className="border-border/50 bg-card hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all h-full">
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold tracking-tight mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="ml-auto flex items-center gap-1.5 text-primary font-medium font-mono">
                        <span>Read</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/50 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold tracking-tight mb-2">
            Start with a 14-day free trial of{" "}
            <span className="text-primary font-mono">Slicer for Mac</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Runs on Apple Silicon. Nothing leaves your machine.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button className="font-mono" asChild>
              <Link href="/pricing">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="font-mono" asChild>
              <Link href="https://docs.slicervm.com/mac/overview/">
                Documentation
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
