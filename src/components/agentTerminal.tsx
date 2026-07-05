"use client";

import { useEffect, useState, useRef } from "react";
import { RotateCcw } from "lucide-react";

interface AgentTerminalProps {
  className?: string;
}

// A mocked agent session: one prompt, then the agent drives Slicer end to end
// via the agent skills. Commands, hostnames, versions, and timings come from a
// real run on the s9 mini PC (2026-07-05); the launch time shows the min-image
// figure (~450ms) rather than that run's cold-start on the full image.
type AgentStep =
  | { type: "user"; text: string; delay: number }
  | { type: "tool"; text: string; delay: number }
  | { type: "result"; lines: string[]; delay: number }
  | { type: "agent"; text: string; delay: number }
  | { type: "done"; text: string; delay: number };

const sequence: AgentStep[] = [
  {
    type: "user",
    text: "Test this Helm chart on the mini PC. Install K3s, deploy it, and make sure it starts clean.",
    delay: 420,
  },
  { type: "tool", text: "Skill(use-slicer)", delay: 180 },
  {
    type: "result",
    lines: ["Slicer daemon found on s9 · v0.1.179"],
    delay: 240,
  },
  { type: "tool", text: "Bash(slicer vm add e2e --wait)", delay: 270 },
  {
    type: "result",
    lines: ["e2e-1 ready in 450ms · 192.168.132.2 · 4GB / 2 vCPU"],
    delay: 330,
  },
  {
    type: "tool",
    text: "Bash(slicer vm exec e2e-1 -- arkade get k3sup kubectl helm)",
    delay: 270,
  },
  {
    type: "result",
    lines: ["3 tools installed in 1.3s"],
    delay: 300,
  },
  {
    type: "tool",
    text: "Bash(slicer vm exec e2e-1 -- k3sup install --local)",
    delay: 420,
  },
  {
    type: "result",
    lines: ["K3s v1.36.2+k3s1 up in 10s · node Ready", "kubeconfig written"],
    delay: 330,
  },
  { type: "tool", text: "Bash(helm upgrade --install app ./chart)", delay: 360 },
  {
    type: "result",
    lines: ['Release "app" installed · revision 1'],
    delay: 300,
  },
  { type: "tool", text: "Bash(kubectl rollout status deploy/app)", delay: 330 },
  {
    type: "result",
    lines: [
      'deployment "app" successfully rolled out',
      "app-78868c 1/1 Running · 0 restarts",
    ],
    delay: 420,
  },
  {
    type: "agent",
    text: "Chart deploys clean on K3s. The app came up first try with no restarts, and your kubectl points at the cluster.",
    delay: 540,
  },
  { type: "tool", text: "Bash(slicer vm delete e2e-1)", delay: 240 },
  {
    type: "result",
    lines: ["e2e-1 deleted · disk removed · 0.5s"],
    delay: 300,
  },
  { type: "done", text: "✓ Prompt to pods and back: 13s of machine time. No SSH, no clicking.", delay: 15000 },
];

export function AgentTerminal({ className = "" }: AgentTerminalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentStep >= sequence.length) return;

    const step = sequence[currentStep];
    let timeout: NodeJS.Timeout;

    const advance = () => {
      // Wrap after the final (done) step so the demo loops.
      setCurrentStep((prev) => (prev + 1) % sequence.length);
    };

    if (step.type === "user") {
      setCurrentText("");
      const fullText = step.text;
      let charIndex = 0;

      const typeChar = () => {
        if (charIndex < fullText.length) {
          setCurrentText(fullText.slice(0, charIndex + 1));
          charIndex++;
          timeout = setTimeout(typeChar, 8 + Math.random() * 9);
        } else {
          timeout = setTimeout(advance, step.delay);
        }
      };

      timeout = setTimeout(typeChar, 250);
    } else {
      timeout = setTimeout(advance, step.delay);
    }

    return () => clearTimeout(timeout);
  }, [currentStep]);

  useEffect(() => {
    if (terminalRef.current && !userScrolledUp) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [currentStep, currentText, userScrolledUp]);

  const handleScroll = () => {
    if (terminalRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = terminalRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 5;
      setUserScrolledUp(!isAtBottom);
    }
  };

  const handleReplay = () => {
    setCurrentStep(0);
    setCurrentText("");
    setUserScrolledUp(false);
  };

  const renderToolLine = (text: string, key: number) => {
    const paren = text.indexOf("(");
    const name = paren > 0 ? text.slice(0, paren) : text;
    const args = paren > 0 ? text.slice(paren) : "";
    return (
      <div key={key} className="flex items-start gap-2 pt-1.5">
        <span className="text-primary leading-relaxed">●</span>
        <span className="break-all leading-relaxed">
          <span className="font-semibold text-slate-900">{name}</span>
          <span className="text-slate-700">{args}</span>
        </span>
      </div>
    );
  };

  const renderContent = () => {
    const content = [];

    for (let i = 0; i <= currentStep && i < sequence.length; i++) {
      const step = sequence[i];
      const isCurrent = i === currentStep;

      if (step.type === "user") {
        const textToShow = isCurrent ? currentText : step.text;
        content.push(
          <div key={i} className="flex items-start gap-2">
            <span className="text-primary font-bold">&gt;</span>
            <span className="text-slate-900 break-words leading-relaxed">
              {textToShow}
              {isCurrent && (
                <span className="animate-pulse bg-slate-700 ml-1 w-2 h-4 inline-block align-middle"></span>
              )}
            </span>
          </div>
        );
      } else if (step.type === "tool" && !isCurrent) {
        content.push(renderToolLine(step.text, i));
      } else if (step.type === "tool" && isCurrent) {
        content.push(renderToolLine(step.text, i));
      } else if (step.type === "result" && i < currentStep) {
        content.push(
          <div key={i} className="pl-4">
            {step.lines.map((line, j) => (
              <div key={j} className="flex items-start gap-1.5">
                <span className="text-slate-400">⎿</span>
                <span className="text-slate-500 break-all leading-relaxed">
                  {line}
                </span>
              </div>
            ))}
          </div>
        );
      } else if (step.type === "agent" && i <= currentStep) {
        content.push(
          <p key={i} className="text-slate-800 leading-relaxed pt-2 break-words">
            {step.text}
          </p>
        );
      } else if (step.type === "done" && i <= currentStep) {
        content.push(
          <p key={i} className="text-green-700 font-medium leading-relaxed pt-2">
            {step.text}
          </p>
        );
      }
    }

    return content;
  };

  return (
    <div
      className={`relative ${className} w-full max-w-full hidden sm:block`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-card rounded-lg overflow-hidden shadow-lg border border-border/20 w-full max-w-full">
        <div className="bg-gradient-to-r from-slate-100 to-slate-200 px-4 py-2 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 text-center text-xs font-mono text-slate-500">
            claude · ~/charts/app
          </div>
          <div className="w-8 h-8 flex items-center justify-center">
            {isHovered && (
              <button
                onClick={handleReplay}
                className="p-1.5 rounded-md hover:bg-slate-200 active:bg-slate-300 transition-all duration-200 border border-slate-300 bg-slate-50 shadow-sm"
                title="Replay animation"
              >
                <RotateCcw className="w-4 h-4 text-slate-700" />
              </button>
            )}
          </div>
        </div>
        <div
          ref={terminalRef}
          className="h-64 sm:h-80 w-full overflow-y-auto overflow-x-hidden p-3 sm:p-4 terminal-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-slate-400"
          onScroll={handleScroll}
          style={{
            background: "hsl(var(--card))",
            minWidth: 0,
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          <div className="font-mono text-xs sm:text-sm space-y-1 min-h-full">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
