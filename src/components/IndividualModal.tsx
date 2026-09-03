"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Info, Infinity } from "lucide-react";
import Link from "next/link";
import DaemonExplainer from "./DaemonExplainer";

interface IndividualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHECKOUT_URL =
  "https://buy.polar.sh/polar_cl_b3bvlhv3WVYOgUbzk0XN7Su3taGaOmCijLpSa0RqDn0";
const TRIAL_CHECKOUT_URL =
  "https://buy.polar.sh/polar_cl_zAoOTL4dlQOqMVjJbzBpDMljT28MtjkbiTbke3XfOQc";
const INSTALL_URL = "https://docs.slicervm.com/getting-started/install/";

export default function IndividualModal({
  isOpen,
  onClose,
}: IndividualModalProps) {
  const [isDaemonExplainerOpen, setIsDaemonExplainerOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-5">
          <DialogHeader className="text-center space-y-1">
            <DialogTitle className="font-mono text-lg sm:text-xl">
              <span className="text-black">Slicer</span>{" "}
              <span className="text-primary">Individual</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Everything you need to run microVMs on your own hardware.
            </DialogDescription>
          </DialogHeader>

          {/* Paid plan — the primary offer */}
          <div className="mt-2 rounded-xl border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-primary">
                Full support from day one
              </span>
              <span className="font-mono text-sm">
                <span className="text-2xl font-bold text-primary">$25</span>
                <span className="text-muted-foreground"> / mo</span>
              </span>
            </div>

            <ul className="mt-3 space-y-1.5 text-sm">
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="flex items-center gap-1">
                  <span>
                    <span className="font-medium">2x</span> concurrent Slicer
                    daemons on Linux, WSL2, or Mac
                  </span>
                  <button
                    type="button"
                    aria-label="What counts as a daemon?"
                    className="relative inline-flex items-center"
                    onClick={() => setIsDaemonExplainerOpen(true)}
                  >
                    <Info className="h-3.5 w-3.5 text-primary cursor-pointer" />
                  </button>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Infinity className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <span className="font-medium">Unlimited VMs</span> &mdash; no
                  vCPU, RAM, or host-group limits
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Custom images, ZFS, and devmapper support</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <Link
                    href="/egress"
                    className="underline underline-offset-2 hover:text-primary"
                  >
                    Egress filtering &amp; secret injection
                  </Link>{" "}
                  via slicer proxy
                </span>
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
                <span>Personal and commercial use on your own device(s)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="font-medium">Full support in our Discord</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Cancel anytime</span>
              </li>
            </ul>

            <Button className="w-full font-mono mt-4" size="lg" asChild>
              <Link href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
                Subscribe &mdash; $25/mo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Trial — the route for first-time users */}
          <div className="mt-3 rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                New to Slicer?
              </span>
              <span className="font-mono text-sm text-muted-foreground">
                $0 for 14 days
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Prove it out on your own hardware first. The same full product,
              with limited support. Card required &mdash; billing starts on day
              15 unless you cancel.
            </p>
            <Button
              variant="outline"
              className="w-full font-mono mt-3"
              asChild
            >
              <Link
                href={TRIAL_CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Start 14-day free trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Takes minutes to{" "}
              <Link
                href={INSTALL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-primary"
              >
                install Slicer
              </Link>{" "}
              &mdash; the trial unlocks it.
            </p>
          </div>
        </DialogContent>
      </Dialog>
      <DaemonExplainer
        isOpen={isDaemonExplainerOpen}
        onClose={() => setIsDaemonExplainerOpen(false)}
      />
    </>
  );
}
