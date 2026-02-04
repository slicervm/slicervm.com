"use client";

import { useState } from "react";
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
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const checkoutURL = `https://subscribe.openfaas.com/buy/cbf41f9b-9ab3-4c04-b64a-2c00c5d725ac?quantity=${quantity}`;
    window.location.href = checkoutURL;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono">
            SlicerVM <span className="text-primary">Team</span>
          </DialogTitle>
          <DialogDescription>
            Deploy SlicerVM for commercial hosting, business, and internal use.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          <div className="space-y-3 text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Each developer that runs Slicer requires a seat.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  Each deployment to a company server requires a seat
                  (production and non-production).
                </span>
              </li>
            </ul>

            <Card className="bg-muted/50 border-border/50">
              <CardContent className="p-3">
                <p className="text-xs font-medium text-foreground mb-2">Example breakdown:</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono">
                  <span>2× developers</span>
                  <span className="text-right">2 seats</span>
                  <span>1× production</span>
                  <span className="text-right">1 seat</span>
                  <span>1× staging</span>
                  <span className="text-right">1 seat</span>
                  <div className="col-span-2 border-t border-border/50 my-1"></div>
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-right font-semibold text-foreground">4 seats</span>
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
              <Label htmlFor="quantity">Number of seats</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                min="1"
                className="w-20 font-mono"
              />
            </div>

            <Card className="bg-muted/30 py-1">
              <CardContent className="p-3">
                <div className="text-sm">
                  <p className="font-medium text-foreground font-mono">
                    Total: ${(quantity * 250).toLocaleString()}/month
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    $250 per seat per month
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
