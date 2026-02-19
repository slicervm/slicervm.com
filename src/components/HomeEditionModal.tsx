"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, ArrowRight, Sparkles, Github, Info } from "lucide-react";
import Link from "next/link";

interface HomeEditionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HomeEditionModal({ isOpen, onClose }: HomeEditionModalProps) {
  const [mobileView, setMobileView] = useState<"full" | "trial">("full");

  useEffect(() => {
    if (isOpen) {
      setMobileView("full");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[88vh] overflow-y-auto p-4">
        <DialogHeader className="text-center space-y-1">
          <DialogTitle className="font-mono text-lg sm:text-xl">
            Get Started with <span className="text-primary">Slicer Individual</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Trial is limited. Full Access unlocks the full Individual tier.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-1 inline-flex items-center gap-1 rounded-lg border border-border/60 bg-background p-1 w-full">
          <Button
            type="button"
            size="sm"
            variant={mobileView === "full" ? "default" : "ghost"}
            className="font-mono flex-1"
            onClick={() => setMobileView("full")}
          >
            Full Access
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mobileView === "trial" ? "default" : "ghost"}
            className="font-mono flex-1"
            onClick={() => setMobileView("trial")}
          >
            Trial
          </Button>
        </div>

        <div className="mt-3">
          {/* Free Trial Option */}
          <Card
            className={`border-border/50 relative max-w-lg mx-auto ${
              mobileView === "trial" ? "block" : "hidden"
            }`}
          >
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
              <Badge variant="secondary" className="font-mono">
                Limited Access Trial
              </Badge>
            </div>
            <CardContent className="p-4 pt-4 space-y-2.5">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary mb-1.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold text-base">14-Day Free Trial</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  $0
                </p>
              </div>

              <ul className="space-y-1 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>1x Slicer daemon only</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="flex items-center gap-1">
                    Claim via verified GitHub account*
                    <span className="relative group inline-flex items-center">
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 text-xs text-muted-foreground bg-popover border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        For established GitHub accounts only. We reserve the right to revoke trial access at any time, including mid-trial, for any reason.
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover"></span>
                      </span>
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Limited to 2x vCPU / 4GB RAM</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">3x VM limit, 1x host group</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">No custom images, no ZFS support</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">No Discord, no K3sup Pro</span>
                </li>
              </ul>

              <p className="text-xs text-muted-foreground text-center leading-tight">
                After installing slicer, claim your trial via <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs">slicer activate</code>
              </p>
              <div className="pt-1 space-y-2">
                <Button className="w-full font-mono" asChild>
                  <Link
                    href="https://docs.slicervm.com/getting-started/install/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Install Slicer
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* GitHub Sponsors Option */}
          <Card
            className={`border-primary/50 relative max-w-lg mx-auto ${
              mobileView === "full" ? "block" : "hidden"
            }`}
          >
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
              <Badge className="bg-primary text-primary-foreground font-mono">
                Individual Plan
              </Badge>
            </div>
            <CardContent className="p-4 pt-4 space-y-2.5">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 mb-1.5">
                  <Github className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold text-base">GitHub Sponsors</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  $25/month
                </p>
              </div>

              <ul className="space-y-1 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    No trial limits
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="flex items-center gap-1">
                    <span>2x Slicer daemons</span>
                    <span className="relative group inline-flex items-center">
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-2 text-xs text-muted-foreground bg-popover border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        Run 2x Slicer daemons at any one time on any mix of
                        Slicer for Mac or Slicer for Linux.
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover"></span>
                      </span>
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="flex items-center gap-1">
                    <span>Optional: Upgrade to 5x Slicer daemons</span>
                    <span className="relative group inline-flex items-center">
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-2 text-xs text-muted-foreground bg-popover border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        Select 50 USD / mo tier on GitHub Sponsors to run an
                        additional 3x Slicer daemons.
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover"></span>
                      </span>
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Use on your own device(s)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="flex items-center gap-1 flex-wrap">
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
                      and Discord support
                    </span>
                    <span className="relative group inline-flex items-center">
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 p-2 text-xs text-muted-foreground bg-popover border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        K3sup Pro is a terraform-like tool for building and
                        maintaining Kubernetes clusters over SSH.
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover"></span>
                      </span>
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="flex items-center gap-1">
                    <span>
                      Not for shared deployments/infrastructure
                    </span>
                    <span className="relative group inline-flex items-center">
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-2 text-xs text-muted-foreground bg-popover border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        Platform is required for remote servers, internal tools,
                        SaaS backends, or any shared multi-user deployment.
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover"></span>
                      </span>
                    </span>
                  </span>
                </li>
              </ul>

              <div className="pt-1 grid sm:grid-cols-2 gap-2">
                <Button className="font-mono" asChild>
                  <Link
                    href="https://github.com/sponsors/alexellis"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Sponsor on GitHub
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="font-mono" asChild>
                  <Link
                    href="https://docs.slicervm.com/getting-started/install/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Install &amp; activate
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>

      </DialogContent>
    </Dialog>
  );
}
