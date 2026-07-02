import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/config";

const title = `Pricing - ${SITE_NAME}`;
const description =
  "Choose a SlicerVM plan for local Linux microVMs, AI sandboxes, Kubernetes, and production-style development on your own hardware.";
const url = new URL("/pricing/", SITE_URL).toString();

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

export default function PricingLayout({ children }: { children: ReactNode }) {
  return children;
}
