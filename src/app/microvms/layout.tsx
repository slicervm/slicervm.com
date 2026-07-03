import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/config";

const title = `MicroVMs for AI Sandboxes and Services | ${SITE_NAME}`;
const description =
  "Run full Linux microVMs with systemd, dedicated kernels, and API-driven lifecycle management on Mac, Linux, cloud VMs, and bare-metal.";
const url = new URL("/microvms/", SITE_URL).toString();

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

export default function MicroVMsLayout({ children }: { children: ReactNode }) {
  return children;
}
