"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Monitor, Server, Laptop, Infinity, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DaemonExplainerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DaemonExplainer({
  isOpen,
  onClose,
}: DaemonExplainerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-5">
        <DialogHeader className="text-center space-y-1">
          <DialogTitle className="font-mono text-lg sm:text-xl">
            What is a Slicer daemon?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            A Slicer daemon is a running{" "}
            <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs">
              slicer
            </code>{" "}
            server process. Each daemon can launch{" "}
            <span className="font-semibold text-foreground">unlimited VMs</span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          {/* Key concept */}
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-sm">
                <Infinity className="h-4 w-4 text-primary shrink-0" />
                <span>
                  <span className="font-medium text-foreground">
                    No VM limit.
                  </span>{" "}
                  <span className="text-muted-foreground">
                    Your plan limits how many Slicer daemons you can run at once
                    -- not how many VMs each one creates.
                  </span>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Example A: Two different machines */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Example A — Two different machines
            </p>
            <Card className="border-border/50">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 space-y-1.5 text-center">
                    <Laptop className="h-6 w-6 mx-auto text-primary" />
                    <p className="text-xs font-medium">Mac laptop</p>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      1x daemon
                    </p>
                  </div>
                  <span className="text-muted-foreground text-lg">+</span>
                  <div className="flex-1 space-y-1.5 text-center">
                    <Server className="h-6 w-6 mx-auto text-primary" />
                    <p className="text-xs font-medium">Linux server</p>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      1x daemon
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 text-center">
                    <p className="text-sm font-semibold font-mono text-primary">
                      2x daemons
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      unlimited VMs on each
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Example B: Same machine, two daemons */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Example B — One machine, two daemons
            </p>
            <Card className="border-border/50">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 space-y-1.5 text-center">
                    <Monitor className="h-6 w-6 mx-auto text-primary" />
                    <p className="text-xs font-medium">Linux server</p>
                    <div className="space-y-0.5">
                      <p className="text-[11px] text-muted-foreground font-mono">
                        daemon 1: AI agents
                      </p>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        daemon 2: K3s cluster
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 text-center">
                    <p className="text-sm font-semibold font-mono text-primary">
                      2x daemons
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      unlimited VMs on each
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Example C: Flexible */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Example C — Mix and match
            </p>
            <Card className="border-border/50">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 space-y-1.5 text-center">
                    <Laptop className="h-6 w-6 mx-auto text-primary" />
                    <p className="text-xs font-medium">Mac Mini</p>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      1x daemon
                    </p>
                  </div>
                  <span className="text-muted-foreground text-lg">+</span>
                  <div className="flex-1 space-y-1.5 text-center">
                    <Monitor className="h-6 w-6 mx-auto text-primary" />
                    <p className="text-xs font-medium">Homelab server</p>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      1x daemon
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 text-center">
                    <p className="text-sm font-semibold font-mono text-primary">
                      2x daemons
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      unlimited VMs on each
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upgrade note */}
          <p className="text-xs text-muted-foreground text-center">
            Need more daemons? Upgrade your plan or talk to our team.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
