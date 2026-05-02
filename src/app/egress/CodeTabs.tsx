"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Tab = "bash" | "go" | "ts";

export interface CodeTabsProps {
  bashHtml: string;
  goHtml: string;
  tsHtml: string;
}

export function CodeTabs({ bashHtml, goHtml, tsHtml }: CodeTabsProps) {
  const [tab, setTab] = useState<Tab>("bash");
  const html = tab === "bash" ? bashHtml : tab === "go" ? goHtml : tsHtml;

  return (
    <>
      <div className="flex justify-center gap-2 mb-4">
        <Button
          size="sm"
          variant={tab === "bash" ? "default" : "outline"}
          className="font-mono"
          onClick={() => setTab("bash")}
        >
          bash
        </Button>
        <Button
          size="sm"
          variant={tab === "go" ? "default" : "outline"}
          className="font-mono"
          onClick={() => setTab("go")}
        >
          Go
        </Button>
        <Button
          size="sm"
          variant={tab === "ts" ? "default" : "outline"}
          className="font-mono"
          onClick={() => setTab("ts")}
        >
          TypeScript
        </Button>
      </div>
      <Card className="border-primary/20 overflow-hidden">
        <CardContent className="p-0">
          <div
            className="text-sm font-mono leading-relaxed [&_pre]:p-6 [&_pre]:overflow-x-auto [&_pre]:rounded-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </CardContent>
      </Card>
    </>
  );
}
