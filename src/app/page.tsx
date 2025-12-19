import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SlicerTerminal } from "@/components/slicerTerminal";
import {
  ArrowRight,
  Zap,
  Server,
  Globe,
  Home,
  Play,
  Shield,
  Package,
  DollarSign,
  Code,
  Layers,
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
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="text-center lg:text-left lg:order-1">
              <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl mb-4">
                Firecracker for humans.
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty mb-6 max-w-2xl mx-auto lg:mr-auto lg:mx-0">
                Boot microVMs in 1-2s - for homelabs, API-driven tasks, and
                production workloads.
              </p>
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

      {/* At Home Section */}
      <section className="border-b border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-mono font-medium text-primary mb-6">
                <Home className="h-4 w-4" />
                At Home
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-balance mb-4">
                The fastest way to learn & experiment with Firecracker
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground mb-8">
                Transform your N100, Raspberry Pi, or home server into a
                powerful lab. Experiment with microVMs, Kubernetes, and AI
                agents in an isolated environment that just works.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Lightning Fast</h3>
                    <p className="text-sm text-muted-foreground">
                      Slicer makes VMs as easy to use as containers and
                      you&apos;ll be up and running in no time.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Play className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Playgrounds on-demand
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Learn and experiment with new software whilst keeping your
                      own machine immaculate.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      All-inclusive package
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Get access to Slicer,{" "}
                      <a
                        href="https://github.com/alexellis/k3sup?tab=readme-ov-file#k3sup-pro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        K3sup Pro
                      </a>{" "}
                      &{" "}
                      <a
                        href="https://github.com/openfaas/faasd?tab=readme-ov-file"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        OpenFaaS Edge
                      </a>{" "}
                      in a single affordable package.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Home lab or bare-metal cloud
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Run on your{" "}
                      <a
                        href="https://blog.alexellis.io/n100-mini-computer/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        own hardware
                      </a>{" "}
                      or{" "}
                      <a
                        href="https://www.hetzner.com/dedicated-rootserver"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        bare-metal cloud
                      </a>{" "}
                      at a fraction of the cost of AWS.
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

      {/* At Work Section */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-mono font-medium text-primary mb-6">
                <Globe className="h-4 w-4" />
                At Work
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-balance mb-4">
                Deploy Firecracker microVMs via{" "}
                <span className="font-mono">YAML</span> or{" "}
                <span className="font-mono">API</span>
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground mb-8">
                Production-ready infrastructure for modern workloads.
                Declarative configs, powerful APIs, and instant scaling for
                everything from AI agents to Kubernetes clusters.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Code className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">API Automation</h3>
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
                      . Share{" "}
                      <a
                        href="https://docs.slicervm.com/reference/secrets/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        secrets
                      </a>{" "}
                      securely from the host.
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
                      for customer support and product testing.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Kernel-level isolation
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      microVMs with the ease of containers, but a full guest
                      Kernel, OS and systemd. Run untrusted code, customer
                      workloads, or AI agents safely.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                    <Layers className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Simulate real-world K8s
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Reliably reproduce{" "}
                      <a
                        href="https://docs.slicervm.com/examples/autoscaling-k3s/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground underline underline-offset-2 font-medium transition-colors"
                      >
                        node scaling and termination
                      </a>{" "}
                      with cluster autoscaler. Build and test large scale
                      Kubernetes clusters quickly.
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
                        # Run headless tasks and workloads <br /># like
                        containers
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
    >> REVIEW.md
`}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
