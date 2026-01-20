---
title: "Trying out Claude Code with Ollama"
date: "2026-01-20T10:00:00Z"
excerpt: "Trying out Claude Code with Ollama to see if it can automate basic tasks."
author: "Alex Ellis"
tags:
  - "claude"
  - "ollama"
  - "code"
  - "localllm"
---

In this post I'll connect [Claude Code](https://code.claude.com/docs/en/overview) to [Ollama](https://ollama.com/), and try to get it to produce a useful program in Go. We'll try to obtain a quote for some SlicerVM licenses based upon the HTML on the website.

I've always been interested in running LLMs locally, for various use-cases like code reviews, spam detection in confidential work emails, and more recently for coding, and automation tasks through agents. We use agents with cloud-hosted models in various ways across our products - OpenFaaS, inlets, Actuated, and Slicer.

So I was curious when the Ollama team [announced their new support](https://ollama.com/blog/claude) as a backend API for Claude Code. To drive Claude Code daily for real-world use-cases, the minimum viable plan is 100 USD per month at time of writing. I currently run a bunch of other LLM/agent subscriptions, so this also gave me a way to play with Claude without wasting money.

SlicerVM is a product we developed to make running microVMs as [fast and easy as running containers](/blog/microvms-sandboxes-in-300ms/). You can pick between long-lived microVMs aka "services" and short-lived, ephemeral "sandboxes".

Over in the docs, there is a detailed [guide on driving opencode](https://docs.slicervm.com/examples/opencode-agent/) for one-shotting tasks via userdata or bash with Slicer sandboxes, so it is familiar territory. Our [code review bot](https://blog.alexellis.io/ai-code-review-bot/) takes a very similar approach - launching a microVM, then running opencode through the `cp` and `exec` APIs and the [Go SDK](https://docs.slicervm.com/tasks/execute-commands-with-sdk/).

<blockquote className="twitter-tweet" data-media-max-width="560"><p lang="in" dir="ltr">GPUs go brrr <a href="https://t.co/pgT7sItK6E">pic.twitter.com/pgT7sItK6E</a></p>&mdash; Alex Ellis (@alexellisuk) <a href="https://twitter.com/alexellisuk/status/2013641406355493314?ref_src=twsrc%5Etfw">January 20, 2026</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

On one machine, loaded up with 2x Nvidia Founders Edition 3090 GPUs, I ran slicer and installed the latest version of Ollama using [these instructions](https://docs.slicervm.com/examples/gpu-ollama/), including making Ollama listen on `0.0.0.0` so it would be accessible outside the microVM.

I edited `/etc/systemd/system/ollama.service` once more to extend the default context window to 64k tokens, it may have been possible to push this higher.

```
[Service]
Environment="OLLAMA_CONTEXT_SIZE=64000"
Environment="OLLAMA_HOST=0.0.0.0:11434"
```

If you are trying these steps, and the model really seems brain-dead, it's probably because you're using the default context window of about 2048 tokens.

A context window of 2048 tokens (or thereabouts) does not provide enough space for the base prompt from Claude, any tool definitions provided, your prompt, and the context of the conversation. Bear in mind that increasing the context window will increase the amount of memory required to run the model, and there's a chance it won't improve performance at all beyond a certain point. Qwen3 Coder 30B supports a massive context window of up to 256k tokens.

[![The extended context window in Ollama](/content/images/2026-01-claude-ollama/context-dual-cards.jpeg)](/content/images/2026-01-claude-ollama/context-dual-cards.jpeg)

In this case, we can see that the model is being balanced and run across both GPUs simultaneously.

Since I'd heard positive things about [Qwen3-Coder 30B](https://ollama.com/library/qwen3-coder) as a local coding model, I decided to give it a try.

I then ran `ollama pull qwen3-coder:30b` which seemed to fit fine taking up about half of each of the 3090's 24GB of VRAM.

Then on my workstation, I created a Slicer VM as a safe temporary sandbox, where Claude can do whatever it likes without wrecking or polluting my workstation.

```bash
slicer new claude > claude.yaml
sudo -E slicer up ./claude.yaml
```

I got a shell into the VM with `sudo -E slicer vm shell`, then installed Claude, you can do that via their bash utility, or via arkade:

```bash
arkade get claude

export ANTHROPIC_AUTH_TOKEN=ollama
export ANTHROPIC_BASE_URL=http://192.168.139.2:11434
```

I'm not familiar with all the options for Claude, but I wanted it to do what it needed without any additional prompting:

```bash
claude --dangerously-skip-permissions \
--allow-dangerously-skip-permissions \
--model qwen3-coder:30b
```

> This is obviously not something I'd do on a workstation, but inside a throwaway microVM it's acceptable and improves our workflow.

From there, I prompted it to tell me the costs of Slicer Home Edition and Commercial seats. It performed a number of Internet searches then gave completely bogus results.

To my surprise, it didn't edit a single main.go file, but wrote many different files `slicer_pricing.go`, `slicer_pricing_final.go`, `slicer_pricing_clean.go`, `slicer_pricing_additional.go` and various others. That's definitely not been my experience of using agents with opencode or GitHub Copilot.

Perhaps it's something off with the model, I doubt Claude itself is this dumb.

I could see that everything it tried was wrong, to the point that I had to explain like it was five, with a concrete implementation.

```
We're buying licenses from slicervm.com for their microVM product.

Find out the pricing for 2x home edition licenses and 5x commercial ones the page
is https://slicervm.com/pricing

Parse the HTML by looking between HTML tags only, where you see $ and some numbers
after, strictly such as "$100" but not "$FA" and do not consider javascript.

If you can't work out which is which, home edition is cheaper. There should
only be two prices on the page.

Print the results as monthly and annual costs, with a full breakdown.

Write a Go program to produce the output live so we can detect changes.

Under no circumstance guess, do not fall back to values you come up with on your own.
You have no reason to conduct a web search for slicer pricing, it's directly in the HTML.

If I were you, I'd use a HTML parsing library, then iterate every tag, look 
at its innerHTML/text and run your regex against each.
```

This is where it got the results almost right, but had assumed the value it parsed was already multiplied by the amounts of seats required. It wasn't.

One follow-up nailed it:

```
That's close, however those prices are for 1x license, and you were asked to multiply them.
Update the values.
```

Final output:

```
ubuntu@lab-1:~$ go run slicervm_pricing.go 
SlicerVM Pricing Information
============================

Home Edition License (2x):
Monthly: $50
Annual:  $600

Commercial License (5x):
Monthly: $1250
Annual:  $15000

Breakdown:
- Home Edition: $25/month ($300/year) for 2 licenses
- Commercial:   $250/month ($3000/year) for 5 licenses
```

The Go code is rather hacky, and brittle, but it did produce the results we wanted.

```go
package main

import (
	"fmt"
	"io"
	"net/http"
	"regexp"
)

func main() {
	// Fetch the pricing page
	resp, err := http.Get("https://slicervm.com/pricing")
	if err != nil {
		fmt.Printf("Error fetching page: %v\n", err)
		return
	}
	defer resp.Body.Close()

	// Read the entire body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading body: %v\n", err)
		return
	}

	// Convert to string
	content := string(body)

	// Extract price values from the specific HTML structure
	// Looking for patterns like <div class="text-4xl font-bold text-primary mb-2">$25
	re := regexp.MustCompile(`<div[^>]*>\$([0-9]+)`)
	matches := re.FindAllStringSubmatch(content, -1)

	// Extract unique prices and sort them
	var prices []int
	seen := make(map[int]bool)

	for _, match := range matches {
		if len(match) > 1 {
			price := 0
			_, err := fmt.Sscanf(match[1], "%d", &price)
			if err == nil && price > 0 {
				if !seen[price] {
					prices = append(prices, price)
					seen[price] = true
				}
			}
		}
	}

	// Sort prices in ascending order
	for i := 0; i < len(prices)-1; i++ {
		for j := i + 1; j < len(prices); j++ {
			if prices[i] > prices[j] {
				prices[i], prices[j] = prices[j], prices[i]
			}
		}
	}

	// Print results
	fmt.Println("SlicerVM Pricing Information")
	fmt.Println("============================")

	if len(prices) >= 2 {
		// Assuming the cheaper one is home edition and the more expensive is commercial
		homePrice := prices[0]
		commercialPrice := prices[1]

		fmt.Printf("\nHome Edition License (2x):\n")
		fmt.Printf("Monthly: $%d\n", homePrice * 2)
		fmt.Printf("Annual:  $%d\n", homePrice*2*12)

		fmt.Printf("\nCommercial License (5x):\n")
		fmt.Printf("Monthly: $%d\n", commercialPrice * 5)
		fmt.Printf("Annual:  $%d\n", commercialPrice*5*12)

		fmt.Printf("\nBreakdown:\n")
		fmt.Printf("- Home Edition: $%d/month ($%d/year) for 2 licenses\n", homePrice, homePrice*12)
		fmt.Printf("- Commercial:   $%d/month ($%d/year) for 5 licenses\n", commercialPrice, commercialPrice*12)
	} else {
		fmt.Println("Could not extract two distinct prices from the page.")
		fmt.Println("Found prices:", prices)
	}
}
```

## Wrapping up

Here's what Claude Code looks like, with the final results of the Go program on the right hand side.

[![Final results from Claude Code](/content/images/2026-01-claude-ollama/G_HnsK0X0AcprS9.jpeg)](/content/images/2026-01-claude-ollama/G_HnsK0X0AcprS9.jpeg)

See [more screenshots](https://x.com/alexellisuk/status/2013639243579425198?s=20) on Twitter/X.

Overall, it was an interesting experiment. I set out with very low expectations, on the positive side, Claude Code talked to Ollama, and Qwen3-Coder produced some code. It was clumsy, slow, and required detailed prompting including implementation to make something work, even then it couldn't be one-shotted. I have to caveat this by saying that both opencode, and Claude Code work really well with cloud-hosted State Of the Art (SOTA) models like Claude Sonnet/Opus and similar.

I've seen individuals post on Reddit about how they drive Qwen3-Coder daily for all their needs. It makes me wonder what their needs are, and what kinds of results they are actually getting. This, and past experiments with opencode make me wonder whether these models can be used agentically for anything of value. Cloud-hosted models, even ones which are less popular like Grok Coder Fast 1 set the bar extremely high in comparison.

So whilst these models may be tenuous for agentic use-cases, they may be better suited to simple one-shotted tasks without much external context. Consider tasks such as: text generation, summarisation, and classification. These kinds of workflows would be valuable when called from a web application, a backend API, or serverless functions with [OpenFaaS](https://www.openfaas.com/).

One particular low-hanging fruit for us, is to run our company emails through a one-shotted task to classify them as cold outreach or a genuine customer support requests. These may contain information under NDA, which we do not want to to be sending to any third-parties for retention. LLMs are not the only option for spam classification, BERT models are much simpler but my experiments with them were not successful, or perhaps maybe cold outreach has simply upped its game. I have experimented with local models with prompts that include examples of spam and non-spam emails, the results were reasonable, but at a certain point it's hard to tune one prompt to work for all the different types of spam and genuine customer emails we get. We wrote up a robust version of that workflow (using publicly hosted models) over on the OpenFaaS blog: [Eradicate Cold Emails From Gmail for Good With OpenAI and OpenFaaS](https://www.openfaas.com/blog/filter-emails-with-openai/).


What about other local models? GLM 4.7 Flash was announced today, and it hit 59.2% SWE-bench (vs 22% Qwen), but this must be caveated - those results depend on specific quantization options and context window. I spent about 4 hours trying to get the model to work on the same kit, and went down a rabbit hole of installing gigabytes of pip modules, and compiling llama.cpp from source. It burnt a lot of time and didn't really work beyond a simple prompt (for me). Since then, [Ollama has released an RC](https://github.com/ggml-org/llama.cpp/pull/18936) which may be worth trying for a repeat experiment.

I would really like local models to work both for simple workflows driven from bots, cron jobs, and functions, and for more complex workflows driven by coding agents.

Your mileage may vary, but for me, and my investment in hardware, I'm struggling to get useful results at this stage.

I should also caveat this as saying, an NVidia DGX Spark, or a top-spec Mac Mini (both significant investments) may generate better results with a larger model, or a bigger context window. That's one of the reasons I've included all the detailed I used, so you can test these steps out for yourself, and report back.

### Update on GLM-4.7 Flash

I did actually get GLM-4.7 Flash to work with Ollama, and it was much simpler (as expected) than using dev versions of vllm, or llama.cpp, and building it from source.

A 64k context window was calling for 82GB of VRAM, 32k called for 50GB of VRAM (still too much to fit in 2x 24GB), then finally a 24k context window just about loaded with only a couple of GB of VRAM left over per card.

The model did perform seem smarter, and quicker, however the small context window may have meant that Claude didn't hear me say "Write a Go program", or didn't understand that it was as task for it to perform. Instead it worked out the basic pricing and printed it in an ASCII table, and forgot about the quantities in the prompt.

Even when prompted and reminded, it claimed to have no prior knowledge. So this is perhaps where a DGX Spark or top-spec Mac Mini would shine. It'd generate code slower, but could at least have a reasonable context window.

```
● Let me read the full HTML and then create a Go program to parse it for prices.                        
                                                                                                        
● Read(.claude/projects/-home-ubuntu/00a9af67-39a3-4c12-ba10-897c5426cfa5/tool-results/call_0d0r8ebc.txt
      )                                                                                                 
  ⎿  Read 1 line                                                                                        
                                                                                                        
● This is a screenshot of the SlicerVM pricing page. Here's a summary of what I see:                    
                                                                                                        
  Pricing Tiers:                                                                                        
  ┌──────────────┬─────────────────────┬───────────────────────────────────────┐                        
  │     Tier     │        Price        │              Target Use               │                        
  ├──────────────┼─────────────────────┼───────────────────────────────────────┤                        
  │ Home Edition │ $25/month           │ Personal use, homelab experimentation │                        
  ├──────────────┼─────────────────────┼───────────────────────────────────────┤                        
  │ Pro Tier     │ $250/month per seat │ Commercial workloads, production      │                        
  ├──────────────┼─────────────────────┼───────────────────────────────────────┤                        
  │ Enterprise   │ Custom              │ Scalable pricing for enterprises      │                        
  └──────────────┴─────────────────────┴───────────────────────────────────────┘                        
  Key Features Highlighted:                                                                             
                                                                                                        
  - Home Edition ($25): Unlimited personal installations, runs on WSL, RPi, N100, mini PCs, servers,    
  Hetzner bare-metal, etc. Includes features like Linux firewalls, ad blockers, K3sup Pro, and OpenFaaS 
  Edge.                                                                                                 
  - Pro Tier ($250/seat): Includes systemd-based Linux microVMs, REST API/Go SDK for sandboxes, built-in
   guest agent (cp, exec, shell, metrics, port-forwarding), GPU support, Jenkins plugin, and email      
  support.                                                                                              
  - Enterprise: Custom pricing, annual invoicing (USD ACH/SWIFT), support for custom OS images, private 
  Slack channel, and priority support (1 business day).                                                 
                                                                                                        
  The page also has options to talk to their team for enterprise inquiries.                             
                                                                                                        
✻ Crunched for 5m 37s                                                                                   
                                                                                                        
❯ Pricing looks right. I asked you to write a Go program, where is it?                                  
                                                                                                        
● I don't see any prior context in our conversation where you asked me to write a Go program. In this   
  current session, I only responded to your screenshot of the SlicerVM pricing page.                    
                                                                                                        
  Could you clarify what Go program you're referring to? If it's in the current directory, I can help   
  locate it.                                                                                                      
```

I followed up with:

```
You need to write a Go program now, to obtain the data live. We're buying licenses from               
  slicervm.com for their microVM product.                                                               
                                                                                                        
  Find out the pricing for 2x home edition licenses and 5x commercial ones the page                     
  is https://slicervm.com/pricing
```

The code it generated wasn't able to provide the pricing, or the correct quantities. I am going to give it the benefit of the doubt and say that it's not suitable for agentic use-cases with only 48GB of VRAM owing to the context window limitations. When I eventually gave up, it'd really overcomplicated the task and program by adding a dependency on a library to drive headless Chrome (github.com/chromedp/chromedp), but didn't know how to use it.

Then, to add insult to injury it wrote a Go program to print hard-coded data it'd already worked out:

```go
package main

import "fmt"

func main() {
	// Known prices from SlicerVM pricing page
	homePrice := 25
	commercialPrice := 250

	fmt.Println("=== SlicerVM Pricing ===")
	fmt.Printf("Home Edition: $%d/month\n", homePrice)
	fmt.Printf("Commercial (Pro) Tier: $%d/month per seat\n", commercialPrice)
	fmt.Println()

	// Calculate totals
	homeTotal := homePrice * 2
	commercialTotal := commercialPrice * 5
	total := homeTotal + commercialTotal

	fmt.Println("=== Your Order Summary ===")
	fmt.Printf("2x Home Edition licenses: $%d/month\n", homeTotal)
	fmt.Printf("5x Commercial licenses: $%d/month\n", commercialTotal)
	fmt.Println()
	fmt.Printf("TOTAL: $%d/month\n", total)
	fmt.Println()
	fmt.Println("Note: Enterprise pricing is custom - please contact SlicerVM directly")
}
```