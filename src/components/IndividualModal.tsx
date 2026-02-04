"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, Github } from "lucide-react";
import Link from "next/link";

interface IndividualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IndividualModal({ isOpen, onClose }: IndividualModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="font-mono text-2xl">
            <span className="text-primary">Individual</span> License
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground">
            Commercial use for solo developers. Not for teams.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* OK Column - Green */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20">
                <Check className="h-4 w-4 text-primary" />
              </span>
              This license is for
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Solo developers building micro-SaaS products</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Vibe-coded apps and MVPs</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Commercial side projects</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Indie hackers and solopreneurs</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Freelancers on client projects (single developer)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Personal revenue-generating projects</span>
              </li>
            </ul>
          </div>

          {/* Not OK Column - Grey */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-muted-foreground">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted">
                <X className="h-4 w-4 text-muted-foreground" />
              </span>
              This license is NOT for
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <X className="h-5 w-5 shrink-0 mt-0.5" />
                <span>Teams or companies with multiple developers</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="h-5 w-5 shrink-0 mt-0.5" />
                <span>Sharing access with colleagues or contractors</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="h-5 w-5 shrink-0 mt-0.5" />
                <span>Enterprise or corporate use</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="h-5 w-5 shrink-0 mt-0.5" />
                <span>Agencies with multiple team members</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="h-5 w-5 shrink-0 mt-0.5" />
                <span>Reselling or sublicensing</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="h-5 w-5 shrink-0 mt-0.5" />
                <span>Multi-seat deployments</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-6 pt-6">
          <div className="text-center space-y-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">$100/month</span> via GitHub Sponsors · Support via Discord
            </div>
            <Button className="font-mono" size="lg" asChild>
              <Link
                href="https://github.com/sponsors/alexellis"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                Sponsor on GitHub
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
