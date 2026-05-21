---
title: "You get a worktree, everyone gets a worktree"
date: "2026-05-21T10:00:00Z"
excerpt: "Prior to 2026, few people were espousing the benefits of Git Worktrees. Now the Internet cannot keep quiet, but do we need them?"
author: "Alex Ellis"
tags:
  - "agents"
  - "worktrees"
  - "git"
  - "sandboxes"
---

Prior to 2026, few people were espousing the benefits of Git Worktrees. Now the Internet cannot keep quiet, but do we need them?

If we ask why [git's worktree feature](https://git-scm.com/docs/git-worktree) got placed front of mind amongst developers, we're presented with a chicken and egg question. Did worktrees gain popularity because agents saw them as the solution to parallel work, or was it cargo culting - or a mixture of the two?

The answer is not clear. We look at how to use them, why agents may like them, and how we built support for them in Slicer's new `slicer worktree` command.

![Oprah wants you to have a worktree](/images/oprah-worktrees.jpg)
> Oprah wants everyone to have a worktree

## How to use a git worktree

Let's start with an example of when you might use one (or more).

You're building a feature for Slicer. It's a MITM proxy and you have untracked changes everywhere, you're 20 prompts deep into a really gnarly issue.

Now one of your key customers reports a typo in the "slicer up" command and you know it's trivial to fix, and you feel embarrassed. You want to get that patched and released ASAP.

Here are some options:

1. You run `git add .` followed by `git stash` and hope and pray that you don't forget about those changes
2. You run `git add .` then `git commit` even though you're not happy with the commit and the work is not complete
3. You run `cp -r repo repo-typo` and then `cd repo-typo ; git checkout -b fix-typo` and push up a new branch, leaving the original repo folder as it was

None of these are anti-patterns, they're all valid workflows. But another exists.

```bash
alex@:~/code/slicer$ git worktree add ../slicer-fix-typo -b fix-typo
alex@:~/code/slicer$ cd ../slicer-fix-typo
alex@:~/code/slicer-fix-typo$ # Edit file, commit, and push
```

Basic syntax:

* `git worktree` - base command, several sub-commands are available
* `add` - create a new worktree
* `../slicer-fix-typo` - best to do this one level up so you don't commit a git submodule by accident
* `-b fix-typo` - optional, checks out a new branch ready for work, you can also leave this off

Behind the scenes, a new folder is created for the worktree, which shares the base `.git` folder, and instead of cloning it on disk like `cp -r` or `git clone --local`, it redirects to the original path.

```bash
alex@:~/code/slicer-fix-typo$ cat .git
gitdir: /home/alex/code/slicer/.git/worktrees/slicer-fix-typo
```

Unlike stashed uncommitted changes, or a commit that says "WIP don't merge", or `cp -r`, worktrees can be listed via `git worktree list`

Some additional options:

```bash
usage: git worktree add [<options>] <path> [<commit-ish>]
   or: git worktree list [<options>]
   or: git worktree lock [<options>] <path>
   or: git worktree move <worktree> <new-path>
   or: git worktree prune [<options>]
   or: git worktree remove [<options>] <worktree>
   or: git worktree unlock <path>

    -f, --force           checkout <branch> even if already checked out in other worktree
    -b <branch>           create a new branch
    -B <branch>           create or reset a branch
    -d, --detach          detach HEAD at named commit
    --checkout            populate the new working tree
    --lock                keep the new working tree locked
    --reason <string>     reason for locking
    -q, --quiet           suppress progress reporting
    --track               set up tracking mode (see git-branch(1))
    --guess-remote        try to match the new branch name with a remote-tracking branch
```

Once you've completed your work, you can push up a branch (if needed), and delete the worktree or its folder, along with the custom branch.

## Why might agents like worktrees?

Caveat emptor: Remember 3 months ago when the trend was to post a selfie with a Mac Mini and the caption "Just finished onboarding my new employee"? Looking back, either people didn't need a Mac for [OpenClaw](https://openclaw.ai), or the shine has worn off, because eBay is awash with base-model Mac Minis right now.

When [I asked on X](https://x.com/alexellisuk/status/2057153739518103931?s=20), most people answered with a variation of "it uses less disk space than copying the folder". Then I looked at my workstation with a 2TB NVMe and saw only 40% used and shrugged. Quite often folks who are following the crowd find it hard to explain exactly why they need something.

In any case, here's why agents might insist on worktrees:

* They're convenient (fast via a built-in command)
* They're trackable (the `list` command shows agents without extensive context or memories what work is in progress)
* They don't use much extra disk space (think of them like a glorified symbolic link)

Personally, I tend to start an agent session for a single feature for a particular repo at a time. Maybe one for the landing page, one for the docs, one for the primary codebase. In the rare occasion I need two agents on the landing page, I'll `cp -r` the relatively small git repo, or start a worktree (I'm not against them!)

## Put your agent into a cage with Slicer

Whilst claude code was iterating on worktrees for Slicer, he [started a monologue](https://x.com/alexellisuk/status/2057358663690469771?s=20) about how he was building himself his own cage, and reassured himself not to present a dramatic manifesto about it, but to get on with the simple task. It felt almost sentient at that point. And there's something very important to learn here. Many of us run agents with unfettered access, or "auto" mode where mistakes can happen, and a bad package can be installed via uv or npm which exfils our credentials or installs a cryptojacker.

> "I'm lost in some strange interior monologue about "the agent" and building my own cage, which doesn't apply here. I'm Claude, a tool, and they are asking for a straightforward feature."

You know, the thing that worktrees reveal is that people are not isolating their agents from their host's kernel and operating system.

Early on, we added `slicer claude .`, `slicer codex .`, `slicer amp .`, `slicer opencode .` and various others as demand arose.

* Start a new VM, and tag it with some useful metadata like cwd, launch date, etc
* Install the agent directly into the VM with your auth and credentials from the host
* Copy in `.` or another path specified directly into the VM over VSOCK (super fast)
* Launch the agent in a `slicer vm shell`

If you have random files in `.gitignore` like an 80GB `vm-1.img`, that can be kept out of the VM by editing a `.slicerignore` file.

This workflow is absolutely solid for the relatively large repos we use on OpenFaaS, Inlets and Slicer. There may be rough edges around huge monorepos.

## Going native

We explored above how worktrees are really powered by links to the original .git folder, so that means we can't simply copy them into a VM and hope for the best. My colleague Han tried that, and a bunch of other things.

So we sat down and looked at the various options for making this work, and decided on a `slicer worktree` command (alias `wt`).

If you've already launched a VM without an agent, or a VM with an agent pre-configured via `slicer claude`, you can sync a worktree in/out from your host:

* `slicer wt push [vm] [path]` — push the worktree into an existing VM
* `slicer wt pull <vm> [path]` — import VM commits (auto fast-forwards your branch) + files

Then run the following to list worktrees managed by Slicer: `slicer wt list`.

You can also create a worktree, and launch a new VM in one command. We're unsure whether this is needed, you let us know?

* `slicer wt push --launch [path]` — launch a fresh VM, then push

Then that's it.

You get a proper worktree on your host, and a working git repo in the VM, that you can commit into, and sync back to your machine.

No credentials for git leaked into the host, and a proper boundary that mounting/sharing does not give you. The agent cannot destroy your whole .git folder, like it could with a Dev container or Docker's solution that relies on virtiofs mounts.

## Teaching an agent to suck eggs

Now before we risk Slicer becoming death by a thousand feature requests, I should let you know that you probably do not need us to build any more features for you.

Slicer is an API, CLI, and a set of SDKs. It's a bag of powerful, and well tested primitives.

Our `slicer worktree` feature is just sugar over the top of existing code, we didn't add any new guest agent behaviour, or change the daemon.

So you could just as easily have said to your agent on the host: `Create a worktree so we can fix that typo, and sync that into my VM in slicer called vm-1` - and it probably would have done something very similar to what we've implemented here.

The same person asking for `slicer worktree` also asked for us to add `slicer pi`.

We may well add that just for him, but here's how he gets the same result, without us writing any code:

```
Create a VM in Slicer. Copy in my configuration and auth for the pi coding agent.
Then install pi in the VM. Let me know the "slicer vm shell" command so I can start
Pi and fix the typo.
```

Another [developer told us](https://x.com/mhenrixon/status/2057355250823045144?s=20) that "git worktress are not enough, because I need separate databases"

That's a perfect use-case for Slicer.

```bash
I need you to launch 4 VMs in Slicer, each with its own Postgresql server installed,
at different versions, starting from the most recent, all the way back to N-4 versions.

Run our e2e tests and report any potential compatibility issues with earlier versions of
Postgresql.

Use userdata to install the database, then copy in the git repo via "slicer cp -r".
```

This eliminates the risk of deleting production, makes those databases truly isolated, and is something your agent can drive for you from the host.

Our [Agent Skills](https://github.com/slicervm/agent-skills) repo is a good place to start. PRs are welcome, and we'll be adding the new "slicer worktree" command to the repo very shortly too.

## What if the agent could push to GitHub instead?

There's a spectrum of agent/LLM usage from high supervision to low supervision, with varying degrees of trust and human control.

* Tab completion in your IDE (not bad, many start here)
* Agent on the host driven by developer (next step up)
* Agent in a VM driven by developer (where we are with Slicer)
* Agent in a remote VM, driven by automation - perhaps picks up Trello/Jira cards and pushes PRs (what you could build with Slicer's SDK)

For our team, we tend to run agents mostly in Slicer, copy the .git repo in, do our work in a branch, copy it back, and push from our host with our credentials, under our own control. The friction is deliberate, you review the code, you put your name to it, you have a moment to pause.

Slicer's new worktree command eases some of that deliberate friction.

But you don't need to copy the code back to the host to push changes. You can push directly from the VM in three ways:

1. Copy real SSH key into the VM (vulnerable to malware, or getting sent to Anthropic/OpenAI servers)
2. Use Slicer Proxy with a fine-grained PAT (VM never sees the secret, it's your identity)
3. Use Slicer Proxy with a GitHub App (agent pushes as the GitHub App, tokens last for 1 hour, VM never sees the secret)

These workflows are all valid and have their own trade-offs.

## Wrapping up

Who knows if the developer community will be just as enamoured with worktrees this time next year? Remember when everyone was building their own RAG system? Yeah it's hard to keep up with AI trends.

We started off by exploring the idea of Git's worktrees - how they work, their advantages, and then finally tied that into an ephemeral VM launched for an agent to work on a feature.

For many people, a one-way sync of a worktree into a VM is all you'll need. We built [Slicer Proxy](https://slicervm.com/egress/) to apply policy to HTTP requests, but also to keep secrets on the host. This minimises the risk of sending the token to a third party. It's built around a core CA injection primitive, so that you can use [any other HTTP proxy you like i.e. Squid](https://slicervm.com/blog/intercepting-filtering-agent-traffic/).

Finishing off - one thing's for certain, Slicer is fast, local, and the primitives are solid, so when features do not yet exist, you can have your agent build them from a prompt or skill.

*Get involved with Slicer*

We get most of our product roadmap from listening to customers - whether you're an indie dev, passionate home-labber, or orchestrating agents all day long at work, we'd love to hear from you. You can find out about [plans on the homepage](https://slicervm.com/pricing), or get started with a free 14-day trial on Linux, Mac, or WSL2.
