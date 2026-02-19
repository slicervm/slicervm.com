"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import Link from "next/link";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: "team" | "platform";
  checkoutUrl: string;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  plan,
  checkoutUrl,
}: CheckoutModalProps) {
  const isTeam = plan === "team";
  const minQuantity = isTeam ? 5 : 1;
  const unitPrice = isTeam ? 25 : 250;
  const [quantity, setQuantity] = useState(minQuantity);

  useEffect(() => {
    if (isOpen) {
      setQuantity(minQuantity);
    }
  }, [isOpen, minQuantity]);

  const checkoutURL = useMemo(() => {
    try {
      const url = new URL(checkoutUrl);
      url.searchParams.set("quantity", String(quantity));
      return url.toString();
    } catch {
      const sep = checkoutUrl.includes("?") ? "&" : "?";
      return `${checkoutUrl}${sep}quantity=${quantity}`;
    }
  }, [checkoutUrl, quantity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = checkoutURL;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono">
            Slicer{" "}
            <span className="text-primary">{isTeam ? "Team" : "Platform"}</span>
          </DialogTitle>
          <DialogDescription>
            {isTeam
              ? "Team seats for developers using Slicer on their own devices."
              : "Platform licensing for shared deployments and infrastructure."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          <div className="space-y-3 text-sm text-muted-foreground">
            <ul className="space-y-2">
              {isTeam ? (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Each developer that runs Slicer requires a seat.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      Each seat includes 2x Slicer daemons on the developer&apos;s
                      own device(s).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      Not for shared deployments/infrastructure. Use Platform for
                      those workloads.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Support via Discord.</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      Required for shared deployments/infrastructure and remote
                      servers.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      Use for product integration, internal tools, and SaaS
                      workloads.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      Quantity is the number of running Platform installations
                      (daemons).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Includes private Discord channel and email support.</span>
                  </li>
                </>
              )}
            </ul>

            <Card className="bg-muted/50 border-border/50">
              <CardContent className="p-3">
                <p className="text-xs font-medium text-foreground mb-2">
                  {isTeam
                    ? "Example breakdown:"
                    : "Example breakdown for production and staging:"}
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono">
                  {isTeam ? (
                    <>
                      <span>5x developers</span>
                      <span className="text-right">5x seats</span>
                    </>
                  ) : (
                    <>
                      <span>1x Prod</span>
                      <span className="text-right">1x seat</span>
                      <span>1x Non-Prod</span>
                      <span className="text-right">1x seat</span>
                    </>
                  )}
                  <div className="col-span-2 border-t border-border/50 my-1"></div>
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-right font-semibold text-foreground">
                    {isTeam ? "5x seats" : "2x seats"}
                  </span>
                </div>
              </CardContent>
            </Card>
            <p>
              Contact us via the{" "}
              <Link
                href="https://docs.google.com/forms/d/e/1FAIpQLSdDdWbzoRFjGmLTuMI7h-OBhybzXewaNL-hoKTnbU8Wbz7bRA/viewform"
                className="underline underline-offset-2 hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                form
              </Link>{" "}
              to order via invoice or to ask questions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <Label htmlFor="quantity">
                {isTeam ? "Number of seats" : "Number of seats/installations"}
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.max(minQuantity, parseInt(e.target.value, 10) || minQuantity)
                  )
                }
                min={String(minQuantity)}
                className="w-20 font-mono"
              />
            </div>

            <Card className="bg-muted/30 py-1">
              <CardContent className="p-3">
                <div className="text-sm">
                  <p className="font-medium text-foreground font-mono">
                    Total: ${(quantity * unitPrice).toLocaleString()}/month
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isTeam
                      ? "$25 per seat per month"
                      : "$250 per installation/daemon per month"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm" className="font-mono" asChild>
                <Link
                  href="https://subscribe.openfaas.com/billing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Update subscription
                </Link>
              </Button>
              <Button type="submit" size="sm" className="font-mono">
                Checkout Now
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
