"use client";

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="font-mono text-2xl">
            Get Started with <span className="text-primary">Slicer Home Edition</span>
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground">
            <span className="hidden md:inline">Demo mode, or ready to roll? Pick your path below.</span>
            <span className="md:hidden">Get full access to Slicer with GitHub Sponsors.</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {/* Free Trial Option - Hidden on mobile */}
          <Card className="border-border/50 relative hidden md:block">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
              <Badge variant="secondary" className="font-mono">
                Limited Access Trial
              </Badge>
            </div>
            <CardContent className="p-6 pt-5 space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-secondary mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">14-Day Free Trial</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  $0
                </p>
              </div>

              <ul className="space-y-2 text-sm">
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
                  <span className="text-muted-foreground">No PCI/GPU passthrough</span>
                </li>


                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">No custom images, no ZFS support</span>
                </li>

                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Default CIDR and bridge networking only</span>
                </li>

                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">No Discord, K3sup-Pro, OpenFaaS Edge </span>
                </li>

              </ul>

              <p className="text-xs text-muted-foreground text-center">
                After installing slicer, claim your trial via <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs">slicer activate</code>
              </p>
              <div className="pt-2 space-y-3">
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
          <Card className="border-primary/50 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
              <Badge className="bg-primary text-primary-foreground font-mono">
                Full Access
              </Badge>
            </div>
            <CardContent className="p-6 pt-5 space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-2">
                  <Github className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">GitHub Sponsors</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  $25/month
                </p>
              </div>

              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Unlimited Slicer installations for personal use on Linux hosts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Slicer for Mac Preview: commercial use allowed on your own device</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="flex items-center gap-1">
                    <span>
                      <span className="font-medium text-primary">Bonus:</span> 1x free{" "}
                      <Link
                        href="https://box.slicervm.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-primary"
                      >
                        Slicer Box
                      </Link>
                    </span>
                    <span className="relative group inline-flex items-center">
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2 text-xs text-muted-foreground bg-popover border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        Slicer Box is a free cloud-hosted slicer instance just for you.
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover"></span>
                      </span>
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="flex items-center gap-1">
                    <span>
                      <span className="font-medium text-primary">Bonus:</span> Slicer For Mac (preview)
                    </span>
                    <span className="relative group inline-flex items-center">
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 text-xs text-muted-foreground bg-popover border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        Linux for your Mac that feels native, with folder sharing and Rosetta. Commercial use on your own Mac is allowed on any tier, including Home Edition.
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover"></span>
                      </span>
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="flex items-center gap-1">
                    <span>Support via Discord</span>
                    <span className="relative group inline-flex items-center">
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-2 text-xs text-muted-foreground bg-popover border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        Run <span className="font-mono">slicer activate</span> to join our Discord server to talk to like-minded self-hosters, experimenters, and home-labbers.
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover"></span>
                      </span>
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Everything included as per Pricing page</span>
                </li>
              </ul>

              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                  <Button className="flex-1 font-mono" asChild>
                    <Link
                      href="https://github.com/sponsors/alexellis"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Sponsor on GitHub
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-bold">2</span>
                  <Button variant="outline" className="flex-1 font-mono" asChild>
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
              </div>

            </CardContent>
          </Card>
        </div>

      </DialogContent>
    </Dialog>
  );
}
