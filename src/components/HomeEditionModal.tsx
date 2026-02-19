"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, Info } from "lucide-react";
import Link from "next/link";

interface HomeEditionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tier = 25 | 50 | "trial";

const SPONSOR_URL = "https://github.com/sponsors/alexellis";
const INSTALL_URL = "https://docs.slicervm.com/getting-started/install/";

export default function HomeEditionModal({
  isOpen,
  onClose,
}: HomeEditionModalProps) {
  const [tier, setTier] = useState<Tier>(25);
  const [flash, setFlash] = useState(false);
  const prevTier = useRef<Tier>(25);

  useEffect(() => {
    if (isOpen) {
      setTier(25);
      prevTier.current = 25;
    }
  }, [isOpen]);

  const handleTierChange = (next: Tier) => {
    if (next === tier) return;
    // Flash the daemon row when switching between paid tiers
    if (next !== "trial" && tier !== "trial") {
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    }
    prevTier.current = tier;
    setTier(next);
  };

  const isTrial = tier === "trial";
  const daemons = tier === 50 ? 5 : tier === 25 ? 2 : 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-5">
        <DialogHeader className="text-center space-y-1">
          <DialogTitle className="font-mono text-lg sm:text-xl">
            <span className="text-primary">Slicer Individual</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Everything you need to run microVMs on your own hardware.
          </DialogDescription>
        </DialogHeader>

        {/* 3-way toggle */}
        <div className="mt-2 inline-flex items-center gap-1 rounded-lg border border-border/60 bg-background p-1 w-full">
          <Button
            type="button"
            size="sm"
            variant={tier === 25 ? "default" : "ghost"}
            className="font-mono flex-1 text-sm h-8"
            onClick={() => handleTierChange(25)}
          >
            $25/mo
          </Button>
          <Button
            type="button"
            size="sm"
            variant={tier === 50 ? "default" : "ghost"}
            className="font-mono flex-1 text-sm h-8"
            onClick={() => handleTierChange(50)}
          >
            $50/mo
          </Button>
          <Button
            type="button"
            size="sm"
            variant={tier === "trial" ? "secondary" : "ghost"}
            className="font-mono flex-1 text-sm h-8"
            onClick={() => handleTierChange("trial")}
          >
            Free Trial
          </Button>
        </div>

        {/* Paid view */}
        {!isTrial && (
          <>
            <ul className="mt-3 space-y-2 text-sm">
              <li
                className={`flex items-start gap-2.5 rounded-md px-2 py-1 -mx-2 transition-colors duration-500 ${
                  flash ? "bg-primary/20" : "bg-primary/10"
                }`}
              >
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="flex items-center gap-1">
                  <span>
                    <span className="font-medium">{daemons}x</span> Slicer
                    daemons on Linux, WSL2, or Mac
                  </span>
                  <span className="relative group inline-flex items-center">
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-2 text-xs text-muted-foreground bg-popover border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      Run {daemons}x Slicer daemons at any one time on any mix
                      of Slicer for Mac, Slicer for Linux, or WSL2.
                      <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover"></span>
                    </span>
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>No limits on vCPU, RAM, VMs, or host groups</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Custom images, ZFS, and devmapper support</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Personal and commercial use on your own device(s)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Includes{" "}
                  <Link
                    href="https://github.com/alexellis/k3sup?tab=readme-ov-file#k3sup-pro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-primary"
                  >
                    K3sup Pro
                  </Link>{" "}
                  for HA Kubernetes over SSH
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Community support via Discord</span>
              </li>
            </ul>

            <div className="mt-4 grid sm:grid-cols-2 gap-2">
              <Button className="font-mono" asChild>
                <Link
                  href={SPONSOR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sponsor on GitHub
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="font-mono" asChild>
                <Link
                  href={INSTALL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Install &amp; activate
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        )}

        {/* Trial view */}
        {isTrial && (
          <>
            <div className="mt-3 space-y-3">
              <p className="text-sm text-center font-medium">
                14-day free trial
              </p>

              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>1x Slicer daemon only</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Limited to 2 vCPU / 4 GB RAM, 3 VMs, 1 host group
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    No custom images, no ZFS support
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    No Discord, no K3sup Pro
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Requires a high-quality, verified GitHub account
                  </span>
                </li>
              </ul>

              <p className="text-xs text-muted-foreground text-center">
                Install Slicer, then claim your trial via{" "}
                <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs">
                  slicer activate
                </code>
              </p>

              <Button className="w-full font-mono" variant="outline" asChild>
                <Link
                  href={INSTALL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Install Slicer
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Want the full experience?{" "}
                <button
                  type="button"
                  className="underline underline-offset-2 hover:text-primary"
                  onClick={() => handleTierChange(25)}
                >
                  See the $25/mo plan
                </button>
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
