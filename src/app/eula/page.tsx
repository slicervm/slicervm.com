import fs from "node:fs/promises";
import path from "node:path";

import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "End User License Agreement",
};

export default async function EulaPage() {
  const eulaPath = path.join(process.cwd(), "EULA.txt");
  const eulaText = await fs.readFile(eulaPath, "utf8");

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
          End User License Agreement (EULA)
        </h1>
        <pre className="mt-8 overflow-x-auto rounded-lg border border-border/50 bg-muted/40 p-6 text-sm leading-7 whitespace-pre-wrap break-words">
          {eulaText}
        </pre>
      </main>
      <Footer />
    </div>
  );
}
