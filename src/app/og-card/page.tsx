"use client";

import Image from "next/image";

/**
 * Dedicated OG card page — rendered at exactly 1200×630 by Puppeteer
 * to produce a pixel-perfect social sharing image using the real site
 * fonts, colors, and components.
 */
export default function OgCardPage() {
  return (
    <div
      className="relative overflow-hidden bg-background"
      style={{ width: 1200, height: 630 }}
    >
      {/* Background — matches hero radial gradient + grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-400/[0.05] bg-[size:32px_32px]" />

      <div className="relative flex flex-col items-center justify-center h-full px-20 py-16">
        {/* Logo + brand — matches navigation.tsx */}
        <div className="flex items-center gap-5 mb-12">
          <div className="relative">
            <div className="absolute -inset-1 bg-primary/20 rounded-lg blur" />
            <Image
              src="/images/logo-slicer-20-281-29.png"
              alt="SlicerVM"
              width={56}
              height={56}
              className="h-14 w-14 relative"
            />
          </div>
          <span className="text-[40px] font-bold font-mono tracking-tight text-foreground">
            SlicerVM
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-[80px] font-bold tracking-tight text-foreground text-center leading-[1.05] mb-6">
          Real Linux, in milliseconds.
        </h1>

        {/* Subtext */}
        <p className="text-[28px] text-muted-foreground text-center max-w-[920px] mb-10 leading-relaxed">
          Full VMs with systemd and a real kernel — on your Mac, your servers, or your cloud.
        </p>

        {/* Pills — matches hero badges */}
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-3 rounded-md border border-primary/30 bg-primary/5 px-5 py-3">
            <span className="text-lg font-mono font-semibold text-primary">
              Sandboxes
            </span>
            <span className="text-base text-muted-foreground">
              Linux machines via API
            </span>
          </div>
          <span className="text-xl text-muted-foreground">+</span>
          <div className="inline-flex items-center gap-3 rounded-md border border-primary/30 bg-primary/5 px-5 py-3">
            <span className="text-lg font-mono font-semibold text-primary">
              Services
            </span>
            <span className="text-base text-muted-foreground">
              Datacenter on a diet
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
