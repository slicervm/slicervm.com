"use client";

import { useEffect, useState, useRef } from "react";
import { RotateCcw } from "lucide-react";

interface SlicerTerminalProps {
  className?: string;
}

// Prompt rendering constants
const userPrompt = (
  <>
    <span className="text-green-700 font-bold">alex@n100</span>
    <span className="text-slate-900">:</span>
    <span className="text-blue-700 font-bold">~</span>
    <span className="text-slate-900">$</span>
  </>
);

const rootPrompt = (
  <>
    <span className="text-green-700 font-bold">ubuntu@agents-1</span>
    <span className="text-slate-900">:</span>
    <span className="text-primary font-bold">~</span>
    <span className="text-slate-900">$</span>
  </>
);

const terminalSequence = [
  {
    type: "command",
    prompt: userPrompt,
    text: "slicer new agents > agents.yaml",
    delay: 200,
  },
  {
    type: "command",
    prompt: userPrompt,
    text: "sudo -E slicer up ./agents.yaml",
    delay: 300,
  },
  {
    type: "output",
    text: `
Slicer licensed to: Alex Ellis (Individual) expires: 365 days       Version: 0.1.31-0e117e15fba4672388c50b58013eee5d87cfea5d

2025/12/23 09:31:40 Creating network pool for host group agents with gateway 192.168.137.1/24 (192.168.137.0 192.168.137.0/24)

Add a route to VMs:

  # Linux
  sudo ip route delete 192.168.137.0/24 &> /dev/null
  sudo ip route add 192.168.137.0/24 via 192.168.1.125

  # MacOS
  sudo route delete 192.168.137.0/24 &> /dev/null
  sudo route -n add -net 192.168.137.0/24 192.168.1.125

`,
    delay: 100,
  },
  {
    type: "output",
    text: `2025/12/23 09:31:55 Launching: agents-1  4GB     2 vCPU
2025/12/23 09:31:55 Creating tap device: agent1
2025/12/23 09:31:55 Preparing disk image: agents-1.img
`,
    delay: 300,
  },
  {
    type: "output",
    text: `2025/12/23 09:32:02 [agents-1] Launched
2025/12/23 09:32:02 SSH bridge listening on 0.0.0.0:2222
API listening on: 127.0.0.1:8080
2025/12/23 09:32:02 Starting VM health monitor
`,
    delay: 80,
  },
  {
    type: "output",
    text: `2025/12/23 09:32:02 [agents-1] Launching with: 4.295GB RAM 2 CPUs, import keys:
2025/12/23 09:32:02 Serial Over SSH (SOS): loaded 1 key(s)
`,
    delay: 80,
  },
  {
    type: "output",
    text: `2025/12/23 09:32:02 🔐 API authentication ENABLED
   Auth token location: /var/lib/slicer/auth/token
   Authorization: Bearer <token>
   curl -sLSf -H "Authorization: Bearer $(sudo cat /var/lib/slicer/auth/token)" http://127.0.0.1:8080/nodes
2025/12/23 09:32:02 Serial Over SSH (SOS): 0.0.0.0:2222
`,
    delay: 100,
  },
  {
    type: "output",
    text: `2025/12/23 09:32:02 [agents-1] Using disk image: agents-1.img
2025/12/23 09:32:02 [agents-1] RAM MB: 4096, CPUs: 2
2025/12/23 09:32:02 [agents-1] Logging to: /var/log/slicer/agents-1.txt
2025/12/23 09:32:02 [agents-1] Started
2025/12/23 09:32:02 [agents-1] IP: 192.168.137.2

`,
    delay: 300,
  },
  {
    type: "command",
    prompt: userPrompt,
    text: "sudo -E slicer vm list",
    delay: 250,
  },
  {
    type: "output",
    text: `
HOSTNAME         IP              CREATED              TAGS
--------         --              -------              -----
agents-1          192.168.137.2   2025-12-23 09:32:02
`,
    delay: 300,
  },
  {
    type: "command",
    prompt: userPrompt,
    text: "sudo -E slicer vm shell",
    delay: 250,
  },
  {
    type: "output",
    text: `
Connecting to VM: agents-1
Connected! Press Ctrl+] to exit.
Welcome to Ubuntu 22.04.5 LTS (GNU/Linux 6.1.90 x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

* Image built by SlicerVM (2026)
* Website: https://slicervm.com
* Docs: https://docs.slicervm.com

To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.
`,
    delay: 400,
  },
  {
    type: "command",
    prompt: rootPrompt,
    text: "curl google.com",
    delay: 150,
  },
  {
    type: "output",
    text: `<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>301 Moved</TITLE></HEAD><BODY>
<H1>301 Moved</H1>
The document has moved
<A HREF="http://www.google.com/">here</A>.
</BODY></HTML>
`,
    delay: 0,
  },
  {
    type: "command",
    prompt: rootPrompt,
    text: "",
    delay: -1, // Don't advance to next step
  },
];

export function SlicerTerminal({ className = "" }: SlicerTerminalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentStep >= terminalSequence.length) return;

    const step = terminalSequence[currentStep];
    let timeout: NodeJS.Timeout;

    if (step.type === "command") {
      setCurrentText("");

      // Type out the command character by character
      const fullText = step.text;
      let charIndex = 0;

      const typeChar = () => {
        if (charIndex < fullText.length) {
          setCurrentText(fullText.slice(0, charIndex + 1));
          charIndex++;
          timeout = setTimeout(typeChar, 15 + Math.random() * 15); // Variable typing speed
        } else {
          // If delay is -1, pause indefinitely (don't advance to next step)
          if (step.delay !== -1) {
            timeout = setTimeout(() => {
              setCurrentStep((prev) => prev + 1);
            }, step.delay);
          }
        }
      };

      timeout = setTimeout(typeChar, 200);
    } else {
      // Output appears immediately
      // If delay is -1, pause indefinitely (don't advance to next step)
      if (step.delay !== -1) {
        timeout = setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
        }, step.delay);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentStep]);

  // Auto-scroll to bottom when content changes (only if user hasn't scrolled up)
  useEffect(() => {
    if (terminalRef.current && !userScrolledUp) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [currentStep, currentText, userScrolledUp]);

  // Handle scroll events to detect manual scrolling
  const handleScroll = () => {
    if (terminalRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = terminalRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 5; // 5px threshold
      setUserScrolledUp(!isAtBottom);
    }
  };

  const handleReplay = () => {
    setCurrentStep(0);
    setCurrentText("");
    setUserScrolledUp(false);
  };

  const renderTerminalContent = () => {
    const content = [];

    for (let i = 0; i <= currentStep && i < terminalSequence.length; i++) {
      const step = terminalSequence[i];

      if (step.type === "command" && step.prompt) {
        const isCurrentlyTyping = i === currentStep;
        const textToShow = isCurrentlyTyping ? currentText : step.text;

        content.push(
          <div key={i} className="flex flex-wrap items-start">
            <span className="whitespace-nowrap">{step.prompt}</span>
            <span className="text-slate-900 break-all">&nbsp;{textToShow}</span>
            {isCurrentlyTyping && (
              <span className="animate-pulse bg-slate-700 ml-1 w-2 h-4 inline-block"></span>
            )}
          </div>
        );
      } else if (step.type === "output" && i < currentStep) {
        content.push(
          <pre
            key={i}
            className="text-slate-700 whitespace-pre-wrap break-words text-xs sm:text-sm leading-relaxed"
          >
            {step.text}
          </pre>
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
          <div className="ml-auto w-8 h-8 flex items-center justify-center">
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
            {renderTerminalContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
