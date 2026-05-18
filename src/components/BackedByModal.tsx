"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

interface BackedByModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BackedByModal({ isOpen, onClose }: BackedByModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-5">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <Image
              src="/images/openfaas-icon.png"
              alt=""
              width={20}
              height={20}
              className="h-5 w-5"
            />
            <DialogTitle className="font-mono text-base sm:text-lg">
              Backed by OpenFaaS Ltd
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            The first version of SlicerVM was created in 2022 and shares the same core as{" "}
            <a
              href="https://actuated.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-2 hover:text-primary transition-colors"
            >
              actuated.com
            </a>
            . Its development is funded by OpenFaaS Ltd, the team behind
            OpenFaaS, Inlets, and Actuated.
          </DialogDescription>
        </DialogHeader>

        <a
          href="https://openfaas.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-mono text-primary hover:text-foreground transition-colors w-fit"
        >
          openfaas.com
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </DialogContent>
    </Dialog>
  );
}
