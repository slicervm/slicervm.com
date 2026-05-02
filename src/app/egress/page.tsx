import { codeToHtml } from "shiki";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  ShieldOff,
  KeyRound,
  Layers,
  Lock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { CodeTabs } from "./CodeTabs";

const BASH_EXAMPLE = `# 1. start the proxy on the host
slicer proxy up --hostgroup lab --bind 192.168.222.1

# 2. mint a client + adopt a credential
TOKEN=$(slicer proxy client create bot)
slicer proxy secret create llama \\
    --host api.example \\
    --value-file ~/llama.txt

# 3. grant narrow access (host + method + path + secret)
slicer proxy allow bot \\
    --host api.example \\
    --secret llama \\
    --method POST \\
    --path /v1/chat/completions

# 4. workload uses HTTPS_PROXY; never sees the real bearer
slicer vm exec my-vm \\
    --env HTTPS_PROXY=http://:$TOKEN@192.168.222.1:3128 \\
    -- curl https://api.example/v1/chat/completions ...`;

const GO_EXAMPLE = `package main

import (
    "context"
    "log"
    "os"
    "strings"

    sdk "github.com/slicervm/sdk"
)

func main() {
    ctx := context.Background()
    c := sdk.NewSlicerClient("./slicer.sock", "", "demo/1.0", nil)

    // 1. mint a client (token returned once)
    created, _ := c.CreateProxyClient(ctx, "bot", "")

    // 2. adopt the upstream credential
    bearer, _ := os.ReadFile(os.Getenv("HOME") + "/llama.txt")
    c.CreateProxySecret(ctx, sdk.CreateProxySecretRequest{
        Name:  "llama",
        Host:  "api.example",
        Value: strings.TrimSpace(string(bearer)),
    })

    // 3. allow rule pinned to method + path + secret
    c.AddProxyAllow(ctx, sdk.AddProxyAllowRequest{
        Client:  "bot",
        Host:    "api.example",
        Secret:  "llama",
        Methods: []string{"POST"},
        Paths:   []string{"/v1/chat/completions"},
    })

    // 4. run the workload through the proxy
    cmd := c.CommandContext(ctx, "my-vm", "curl", "-sS",
        "https://api.example/v1/chat/completions",
        "-d", \`{"model":"local","messages":[...]}\`,
    )
    cmd.Env = []string{
        "HTTPS_PROXY=http://:" + created.Token + "@192.168.222.1:3128",
    }
    out, _ := cmd.CombinedOutput()
    log.Println(string(out))
}`;

const TS_EXAMPLE = `import { SlicerClient } from "@slicervm/sdk";
import { readFileSync } from "node:fs";

const c = SlicerClient.fromEnv();

// 1. mint a client (token returned once)
const created = await c.proxy.clients.create("bot");

// 2. adopt the upstream credential
const bearer = readFileSync(\`\${process.env.HOME}/llama.txt\`, "utf8").trim();
await c.proxy.secrets.create({
  name: "llama",
  host: "api.example",
  type: "bearer",
  value: bearer,
});

// 3. allow rule pinned to method + path + secret
await c.proxy.allows.add({
  client: "bot",
  host: "api.example",
  secret: "llama",
  methods: ["POST"],
  paths: ["/v1/chat/completions"],
});

// 4. run the workload through the proxy
await c.vm.exec("my-vm", {
  command: ["curl", "-sS", "https://api.example/v1/chat/completions"],
  env: {
    HTTPS_PROXY: \`http://:\${created.token}@192.168.222.1:3128\`,
  },
});`;

const LOG_LINES: Array<{ verdict: "allow" | "deny"; text: string }> = [
  {
    verdict: "allow",
    text: "msg=allow client=bot method=POST host=api.example path=/v1/chat/completions inject=llama status=200",
  },
  {
    verdict: "allow",
    text: "msg=allow client=bot method=GET  host=archive.ubuntu.com path=/ubuntu/dists/jammy/InRelease status=200",
  },
  {
    verdict: "deny",
    text: "msg=deny  client=bot method=POST host=api.example path=/v1/admin/users reason=path-not-allowed",
  },
  {
    verdict: "deny",
    text: "msg=deny  client=bot method=GET  host=evil.example path=/exfil reason=host-not-allowed",
  },
  {
    verdict: "allow",
    text: "msg=allow client=bot method=POST host=cloudflare-dns.com path=/dns-query status=200",
  },
];

export default async function EgressPage() {
  const theme = "github-light-high-contrast";
  const [bashHtml, goHtml, tsHtml] = await Promise.all([
    codeToHtml(BASH_EXAMPLE, { lang: "bash", theme }),
    codeToHtml(GO_EXAMPLE, { lang: "go", theme }),
    codeToHtml(TS_EXAMPLE, { lang: "ts", theme }),
  ]);

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero — centered, single column; audit-log strip below replaces the
          two-column-with-terminal pattern used elsewhere on the site. */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-mono font-medium text-primary mb-5">
            <Lock className="h-4 w-4" />
            Slicer Proxy
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl mb-5">
            Inspect every request leaving your VM.
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground text-pretty mb-8 max-w-3xl mx-auto">
            Default-deny egress. Per-host allow rules with method + path
            filters. Bearer, Basic, and OAuth secrets injected on the wire —
            never inside the workload.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="font-mono" asChild>
              <Link href="/blog/programmable-microvm-egress">
                Read the announcement
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Live audit-log strip — full-width, demonstrates the product */}
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-10">
          <div className="rounded-lg border border-primary/20 bg-card/80 backdrop-blur shadow-lg shadow-primary/5">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border/50">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono text-muted-foreground">
                slicer proxy · audit log
              </span>
            </div>
            <div className="px-4 py-3 space-y-1.5 font-mono text-xs sm:text-sm">
              {LOG_LINES.map((line, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 overflow-x-auto"
                >
                  {line.verdict === "allow" ? (
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  )}
                  <span
                    className={
                      line.verdict === "allow"
                        ? "whitespace-pre"
                        : "whitespace-pre text-muted-foreground line-through decoration-muted-foreground/40"
                    }
                  >
                    {line.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Three pillars */}
      <section className="border-b border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-balance mb-3">
              Three guarantees, default on
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Designed for AI agents, code-review bots, and anything running
              code you didn&apos;t write.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="border-primary/20 bg-card">
              <CardContent className="p-6">
                <div className="rounded-lg bg-primary/10 p-2 border border-primary/20 w-fit mb-4">
                  <ShieldOff className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Default-deny, narrow allow
                </h3>
                <p className="text-sm text-muted-foreground">
                  No traffic leaves a VM unless an explicit rule matches host,
                  method, and path. POST-with-body APIs (GraphQL, ElasticSearch)
                  filtered at the right layer — not just by HTTP verb.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card">
              <CardContent className="p-6">
                <div className="rounded-lg bg-primary/10 p-2 border border-primary/20 w-fit mb-4">
                  <KeyRound className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Secrets that stay on the host
                </h3>
                <p className="text-sm text-muted-foreground">
                  Register a Bearer, Basic, or OAuth credential once. The proxy
                  injects it on matching requests and strips the
                  workload&apos;s placeholder. Your AWS keys, LLM tokens, and
                  GitHub PATs never touch the VM.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card">
              <CardContent className="p-6">
                <div className="rounded-lg bg-primary/10 p-2 border border-primary/20 w-fit mb-4">
                  <Layers className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Stage-by-stage policy
                </h3>
                <p className="text-sm text-muted-foreground">
                  Open egress wide while{" "}
                  <code className="font-mono text-xs">arkade get</code> pulls
                  dependencies, then tighten to one upstream before the agent
                  runs. Rules reload live — no VM restart, no daemon bounce.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bash + Go + TypeScript example via tabs */}
      <section className="border-b border-border/50">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-balance mb-3">
              Same model from CLI or code
            </h2>
            <p className="text-base text-muted-foreground text-pretty max-w-2xl mx-auto">
              Three nouns:{" "}
              <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                client
              </span>
              ,{" "}
              <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                secret
              </span>
              , and{" "}
              <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                allow rule
              </span>
              . CLI, REST, Go and TypeScript SDKs all expose the same surface.
            </p>
          </div>

          <CodeTabs bashHtml={bashHtml} goHtml={goHtml} tsHtml={tsHtml} />
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-border/50 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-balance mb-3">
            Ship agents that don&apos;t leak.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto mb-6">
            Available on every paid plan. Run an agent against an LLM, clone a
            repo from a stranger, or sandbox a bot — knowing exactly what it
            can and can&apos;t reach.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="font-mono" asChild>
              <Link href="/pricing">
                See plans
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/blog/programmable-microvm-egress">
                Read the deep-dive
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
