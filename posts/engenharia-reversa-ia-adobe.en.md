---
title: "Reverse engineering with AI: is Adobe dead?"
date: 2026-10-20
tags: [ai, opinion, reverse-engineering]
description: "AI made reverse engineering far cheaper, but it's no clone button. Adobe's real value lives where the binary can't reach."
---

> This piece grew out of an analysis by Fabio Akita on the topic — [AI Reverse Engineering: Is Adobe Dead?](https://akitaonrails.github.io/en/2026/10/13/ai-reverse-engineering-is-adobe-dead/). The thesis is the same; the words and examples below are my own reading, as a dev who makes a living shipping software.

Over the last few weeks my timeline blew up again with the same old chorus: "programming is over." This time the spark was a batch of open-source clones of Adobe products, written in Rust and assembled with AI help — some "PhotoCraft" that looks like Photoshop, projects that hand agents direct access to disassemblers and decompilers, and a wave of retro game ports. The snap conclusion came on autopilot: if you can rebuild any binary with an agent, then all software is reusable and Adobe is dead.

I wish it were that simple. But anyone who has ever opened a binary by hand knows the story is duller — and more interesting — than the tweet promises.

## AI sped up the grunt work, not the hard part

Let me start by agreeing with half the hype: AI made reverse engineering **much cheaper**. That's real and it matters. What used to be a week of mechanical labor — reading mountains of assembly, naming function after function, inferring data structures — a model now does in hours, with a quality that would have scared me three years ago.

But "cheaper grunt work" is not the same as "solved the problem." That's where the hasty reading trips. Reverse engineering has distinct stages, and AI only shines in some of them:

- **Disassemble** (binary → assembly): mechanical, deterministic. Machines always did this well; now it's instant.
- **Decompile** (assembly → pseudocode): noisy. You get C that compiles but is hideous, full of `sub_401A20` and nameless variables.
- **Recover names and types**: here lives the actual human work. Names aren't in the binary. The compiler threw them away. Reconstructing *meaning* is inference, not decoding.
- **Refactor**: turn that into code a team can maintain. Hard with or without AI.

Today's neural decompilers reach something like 60–65% functional correctness on isolated functions. That's a lot for a draft; it's not enough to trust blindly. And there's a silent trap: when you pass a decompiler's raw output through an LLM to "clean it up," vulnerabilities can simply *vanish* along the way — the model "fixes" a behavior that was, in fact, the bug. You think you understood the program; you understood a paraphrase of it.

## This isn't new — and that detail matters

Another thing the hype erases: reverse engineering is a **mature** discipline, not an invention of the agents. The IBM PC BIOS was cleanly reimplemented back in 1982. Samba read Microsoft's protocol the hard way. Wine still runs Windows executables today. Emulators have existed for decades. Ghidra, the tool that unlocked much of this wave, was open-sourced by the NSA in 2019. The decompilation-and-recompilation craze started **before** the AI agents — AI jumped onto a train that was already moving and just sped up the car.

That reframes everything. The right question isn't "did AI make the impossible possible?" but "how much did AI lower the cost of what was already possible?" The honest answer: a lot on the easy part, little on the expensive part.

## The tools are a toolbox, not a clone button

The projects that went viral — like a "REA" that gives an agent access to a disassembler — are powerful toolboxes, not a "clone this product" button. They still require the binary running on *your* machine, paid tools in the chain, and a token budget that would make any product manager sweat. They automate the tedious; they don't replace the engineer who decides what matters.

And the Adobe clones? They're early alphas, and it shows. An open-issues list as long as your arm, memory management that chokes on large images, weak color management, flaky PSD compatibility. It's a Ferrari body with a Beetle engine: the UI looks right, the demo impresses, but open a real production file and the gap shows up on the first adjustment layer.

## Adobe's value lives where the binary can't reach

Here's the point "Adobe is dead" ignores: the valuable part of the product **isn't in the binary**. You can decompile the entire executable and still have nothing of what actually keeps the customer around:

- The **generative** features run in Adobe's **cloud**, in models and weights nobody is going to disassemble off your desktop.
- The lens and color profiles in **Camera RAW** are ~20 years of calibration measured in the real world, camera by camera.
- **Print color science** — CMYK, ICC profiles — is decades of work; GIMP has been chasing it for years and still isn't done.
- The **Pantone** libraries are proprietary and licensed. You don't reverse-engineer a contract.
- The color transforms used in cinema depend on SDKs and deals with manufacturers. That's a business relationship, not bytes.

None of that leaks into the disassembly. It's knowledge, licensed data and relationships — exactly what a decompiler can't see.

## A moving target, and sometimes no binary at all

There's also the **moving target** problem. Microsoft's old `.doc` format took more than a decade to document through reverse engineering — and by the time it was documented, the market had already moved to other formats. You won a war nobody was fighting anymore.

And modern commercial software tends to be **SaaS**. Often there's no binary to analyze at all: the logic that matters runs on a server you never touch. You can't disassemble what you don't have.

<svg viewBox="0 0 720 236" style="width:100%;height:auto;max-width:720px;display:block;margin:1.5rem auto;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A reverse-engineering pipeline stopping at a barrier of cloud, licensed data and color science">
  <defs>
    <marker id="arw-en" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="var(--text-faint)"/>
    </marker>
  </defs>
  <text x="263" y="28" text-anchor="middle" font-size="13" fill="var(--text-soft)">Reverse-engineering pipeline</text>

  <rect x="12" y="84" width="112" height="56" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
  <text x="68" y="116" text-anchor="middle" font-size="13" fill="var(--text)">binary</text>

  <rect x="142" y="84" width="112" height="56" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
  <text x="198" y="116" text-anchor="middle" font-size="13" fill="var(--text)">disassemble</text>

  <rect x="272" y="84" width="112" height="56" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
  <text x="328" y="116" text-anchor="middle" font-size="13" fill="var(--text)">decompile</text>

  <rect x="402" y="84" width="112" height="56" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
  <text x="458" y="108" text-anchor="middle" font-size="12" fill="var(--text)">recover names</text>
  <text x="458" y="124" text-anchor="middle" font-size="12" fill="var(--text)">&amp; types</text>

  <line x1="124" y1="112" x2="140" y2="112" stroke="var(--text-faint)" stroke-width="2" marker-end="url(#arw-en)"/>
  <line x1="254" y1="112" x2="270" y2="112" stroke="var(--text-faint)" stroke-width="2" marker-end="url(#arw-en)"/>
  <line x1="384" y1="112" x2="400" y2="112" stroke="var(--text-faint)" stroke-width="2" marker-end="url(#arw-en)"/>
  <line x1="514" y1="112" x2="544" y2="112" stroke="var(--text-faint)" stroke-width="2" marker-end="url(#arw-en)"/>

  <rect x="548" y="44" width="160" height="140" rx="12" fill="var(--bg-card)" stroke="var(--accent)" stroke-width="2"/>
  <rect x="548" y="44" width="160" height="140" rx="12" fill="var(--accent)" opacity="0">
    <animate attributeName="opacity" dur="4.5s" repeatCount="indefinite" values="0;0;0.35;0;0" keyTimes="0;0.52;0.57;0.66;1"/>
  </rect>
  <path d="M619,74 v-6 a9,9 0 0 1 18,0 v6" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
  <rect x="615" y="74" width="26" height="20" rx="3" fill="var(--accent)"/>
  <text x="628" y="122" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">CLOUD</text>
  <text x="628" y="142" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">LICENSED DATA</text>
  <text x="628" y="162" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">COLOR SCIENCE</text>

  <g>
    <circle r="12" fill="var(--accent)"/>
    <text y="4" text-anchor="middle" font-size="10" font-weight="700" fill="var(--bg-card)">AI</text>
    <animateMotion dur="4.5s" repeatCount="indefinite" calcMode="linear" keyPoints="0;1;0.9;0.9" keyTimes="0;0.55;0.66;1" path="M 68,112 L 534,112"/>
  </g>

  <text x="360" y="214" text-anchor="middle" font-size="13" fill="var(--text-soft)">AI gets this far — no further.</text>
</svg>

## The Bun case shows the real price

If you want a yardstick for the cost of rewriting serious software, look at Bun migrating from Zig to Rust: it was something like **US$165k in API calls**, 64 agents running in parallel, the complete reference source in hand, a test suite with more than a million assertions, and — the detail nobody cites — the original author driving the whole process. That's the *easiest possible* scenario: you have the source, you have the tests, you know the domain. Even so, it cost a fortune.

Now imagine cloning Photoshop with no source, no tests, no author, and everything that matters hidden in the cloud. Bun's luxury simply doesn't exist there.

## Why retro ports work (and why it doesn't generalize)

So why did the old game ports succeed? Because it's the dream scenario for reverse engineering:

- **Tiny binaries.** Super Mario 64 is about 8 MB. Baldur's Gate 3 is north of 150 GB. Scale changes everything.
- **Old, documented hardware.** The target has been frozen for decades; the community has mapped almost all of it.
- **A target that doesn't move.** The cartridge gets no updates. You're not aiming at a river.
- **Settled legal precedent.** The legal ground for these old cases is relatively firm.

And modern consoles are already x86 or ARM — you don't even need to emulate the CPU. But notice: the hard architectures stay hard. The PS3's Cell and the Xbox 360's PowerPC remain a nightmare. **Architecture matters**, and no agent erases that.

## On "exponential growth"

A word of caution about the mental "halves every month" chart. The frontier price dropped modestly. The cost per **fixed quality** dropped more — you pay less today for the same level of result. But the bill for a big clone **starts high**, and halving a high bill several times still leaves a high bill for a good while. Exponential on the slide, linear on the invoice.

## My conclusion, as a dev

Put it all together and I land somewhere far less dramatic than the timeline. AI **lowered the cost** of reverse engineering, genuinely — especially in retro, where the binary is small, the hardware is documented and the target is frozen. For live commercial products, what matters lives in the cloud, in licensed data, in relationships with manufacturers and in decades of specialized knowledge no disassembler can see.

Reverse engineering is still **engineering work**. "Programming is dead" doesn't hold — it resurrects every hype cycle and fails every cycle for the same reason: it mistakes the cheap step for the whole problem.

And honestly, that leaves me optimistic. If the grunt work got cheap, there's more time for the work that was always ours: deciding what matters, modeling the domain, caring about quality. As a dev, I see a long road ahead for AI software engineering — it's just not the road where you press a button and clone Adobe.
