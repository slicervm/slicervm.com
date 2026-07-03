import fs from "node:fs/promises";
import path from "node:path";

import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { SITE_NAME, SITE_URL } from "@/lib/config";
import type { Metadata } from "next";

const title = "SlicerVM End User License Agreement";
const description =
  "End User License Agreement for SlicerVM software, subscriptions, trials, support, and platform usage from OpenFaaS Ltd.";
const url = new URL("/eula/", SITE_URL).toString();

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
