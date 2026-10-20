---
title: "Ponytail: making AI write less code (and better code)"
date: 2026-10-20
tags: [ai, tools, productivity]
description: "A skill that makes the agent reuse before it creates. The best code is the code you never wrote — without cutting validation, error handling or security."
---

Anyone who codes with an AI agent has noticed one thing: they **love writing code**. You ask for a date picker and the agent hands you a 335-line calendar, when reusing the input that already exists in the project would have done it. Multiply that across a full day of work and you get a bloated codebase — more to maintain, more to break.

[Ponytail](https://github.com/dietrichgebert/ponytail) goes straight at this. It's a skill (basically a prompt) that changes how the agent thinks before it writes. The project's motto says it all: *the best code is the code you never wrote.*

## What ponytail is

It's an open-source prompt (MIT license, site at ponytail.dev) that you install into your AI agent. It stays **always on** and, before the agent starts typing, forces it to ask one simple question: *does this really need new code?*

The important part — and what sets ponytail apart from "just save tokens" — is that the goal **was never fewest characters**. The rule is to write only what the task needs, but to **never cut** validation, error handling, security or accessibility. That's the line between "lean code" and "flimsy code."

## How it works: the ladder

Before writing, the agent reads and traces the code the change will touch. Then it climbs a "ladder" of questions and **stops at the first rung that works**:

<svg viewBox="0 0 720 440" style="width:100%;height:auto;max-width:720px;display:block;margin:1.5rem auto;" role="img" aria-label="Ponytail's decision ladder: the agent stops at the first rung that works, here 'Already in the codebase?'">
  <text x="360" y="26" text-anchor="middle" font-family="inherit" font-size="15" font-weight="600" fill="var(--text-soft)">The ladder: stop at the first rung that works</text>
  <g font-family="inherit" font-size="13">
    <g>
      <rect x="150" y="60" width="520" height="42" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
      <circle cx="128" cy="81" r="14" fill="var(--bg-card)" stroke="var(--border)"/>
      <text x="128" y="86" text-anchor="middle" fill="var(--text-soft)">1</text>
      <text x="172" y="86" fill="var(--text)">Does it need to exist?</text>
    </g>
    <g>
      <rect x="150" y="110" width="520" height="42" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
      <circle cx="128" cy="131" r="14" fill="var(--bg-card)" stroke="var(--border)"/>
      <text x="128" y="136" text-anchor="middle" fill="var(--text-soft)">2</text>
      <text x="172" y="136" fill="var(--text)">Already in the codebase?</text>
    </g>
    <g>
      <rect x="150" y="160" width="520" height="42" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
      <circle cx="128" cy="181" r="14" fill="var(--bg-card)" stroke="var(--border)"/>
      <text x="128" y="186" text-anchor="middle" fill="var(--text-soft)">3</text>
      <text x="172" y="186" fill="var(--text)">Does the standard library do it?</text>
    </g>
    <g>
      <rect x="150" y="210" width="520" height="42" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
      <circle cx="128" cy="231" r="14" fill="var(--bg-card)" stroke="var(--border)"/>
      <text x="128" y="236" text-anchor="middle" fill="var(--text-soft)">4</text>
      <text x="172" y="236" fill="var(--text)">Is there a native platform feature?</text>
    </g>
    <g>
      <rect x="150" y="260" width="520" height="42" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
      <circle cx="128" cy="281" r="14" fill="var(--bg-card)" stroke="var(--border)"/>
      <text x="128" y="286" text-anchor="middle" fill="var(--text-soft)">5</text>
      <text x="172" y="286" fill="var(--text)">Is a dependency already installed?</text>
    </g>
    <g>
      <rect x="150" y="310" width="520" height="42" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
      <circle cx="128" cy="331" r="14" fill="var(--bg-card)" stroke="var(--border)"/>
      <text x="128" y="336" text-anchor="middle" fill="var(--text-soft)">6</text>
      <text x="172" y="336" fill="var(--text)">Can it be one line?</text>
    </g>
    <g>
      <rect x="150" y="360" width="520" height="42" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
      <circle cx="128" cy="381" r="14" fill="var(--bg-card)" stroke="var(--border)"/>
      <text x="128" y="386" text-anchor="middle" fill="var(--text-soft)">7</text>
      <text x="172" y="386" fill="var(--text)">The minimum that works (+ test)</text>
    </g>
    <rect x="150" y="110" width="520" height="42" rx="9" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2" opacity="0">
      <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.3;0.4;0.85;1" dur="6s" repeatCount="indefinite"/>
    </rect>
    <text x="650" y="135" text-anchor="end" fill="var(--accent)" font-weight="600" opacity="0">solved here ✓
      <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.3;0.4;0.85;1" dur="6s" repeatCount="indefinite"/>
    </text>
    <g fill="var(--accent)">
      <polygon points="96,73 116,81 96,89"/>
      <animateTransform attributeName="transform" type="translate" values="0 0;0 50;0 50;0 0" keyTimes="0;0.3;0.85;1" dur="6s" repeatCount="indefinite"/>
    </g>
  </g>
</svg>

The full ladder, in order: **(1)** does this need to exist? **(2)** is it already in the codebase? **(3)** does the standard library do it? **(4)** is there a native platform feature? **(5)** does an installed dependency already cover it? **(6)** can it be one line? **(7)** if none of that, the minimum that works — plus a small test when the logic has branches, loops, parsing, money or security.

In the date-picker example: instead of the 335-line calendar, the agent stops at rung 2, reuses the project's `Input` with `type="date"` and ships **10 lines**. Same result, a fraction of the code.

And at the end of every reply the agent states **what it skipped or didn't check** — you learn about the shortcuts instead of finding them later.

## Intensity levels

You tune how hard it pushes:

- **`lite`** — light, essentials only.
- **`full`** — the default.
- **`ultra`** — as aggressive as possible about reuse and cuts.
- **`off`** — turn it off for the session.

## Commands

Beyond being always on, it ships useful commands:

| Command | What it does |
|---|---|
| `/ponytail [lite \| full \| ultra \| off]` | Switch level or turn off |
| `/ponytail-review` | Reviews the current diff: bugs, security, load, missing tests, cuts |
| `/ponytail-audit` | Reviews the whole repo, ranked by priority |
| `/ponytail-debt` | Collects `shortcut:` comments into a tech-debt ledger |
| `/ponytail-gain` | Shows the impact scoreboard (code, time, cost saved) |
| `/ponytail-help` | Quick reference |
| `/ponytail band [on \| off \| import]` | Claude Code only: status band above the prompt |

## How to install and use

### In Claude Code

Two commands:

```bash
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail
```

This is the host with **full** support: every command, plus the **band** — a bar above the prompt showing cost, tokens, agent time, code reuse and test status in real time. The band needs Claude Code **2.1.290+** and doesn't show up in the VS Code chat panel, cloud sessions, or `claude -p`.

### In Codex

```bash
codex plugin marketplace add DietrichGebert/ponytail
codex plugin add ponytail@ponytail
```

Then open `/hooks`, **trust the two lifecycle hooks** and start a new thread. In Codex the commands are invoked as skills, in the form `$ponytail:ponytail-review`.

### In Antigravity

Antigravity works two ways:

- **Antigravity CLI** — it's a "skill-capable" host, so you install the skill and get the full command set.
- **Everything else (fallback)** — copy the repo's **`AGENTS.md`** into your project. The ruleset stays always on (the agent reuses before it creates), but **without the commands** (`/ponytail-review` and friends).

### In any other agent

Copy `AGENTS.md` into your project, or ask the agent to install `skills/ponytail/SKILL.md`. The repo's `INSTALL.md` has step-by-step guides for Copilot, Cursor, OpenCode, Gemini and many more — about 20 agents in total. Install **only** from the official GitHub repo or the npm package `@dietrichgebert/ponytail`.

## Configuration

Nothing to configure — it works on install. If you want, pin the default level in `~/.config/ponytail/config.json` or via the `PONYTAIL_DEFAULT_MODE` environment variable.

## The numbers (with a pinch of skepticism)

The author published a benchmark for version 5, run in Claude Code with Opus 5.5, across 39 tasks (including a real FastAPI + React repo), 5 runs each. Comparing the same agent with and without the skill:

- **−53%** code, **−41%** time, **−26%** cost, **−45%** tokens.
- **98%** of risky logic shipped with a test (vs 68% without ponytail).
- The agent's own tests caught **66%** of injected bugs (vs 46%).
- On 6 security tasks, it passed all 30 runs.

These are the project's own figures, so treat them as a signal, not law — your mileage may vary. Still, the direction makes sense: less code almost always means fewer bugs and less maintenance.

## Pros

- **Less code to maintain and to break.** The benefit that pays for itself over time.
- **Reuses what already exists** — stdlib, native feature, project component, installed dependency — instead of reinventing.
- **Doesn't cut what matters.** Validation, error handling, security and accessibility are kept off the chopping block on purpose.
- **More tests where it's risky,** plus a built-in review/audit to catch what slipped through.
- **Transparency:** it tells you what it skipped at the end of each reply.
- **Portable and free:** MIT, runs on ~20 agents, two-command install.

## Cons and limits

- **The benchmarks are the author's.** Honest work, but no independent audit — set expectations accordingly.
- **The band is Claude Code only** (and needs 2.1.290+). On other hosts you lose that real-time view.
- **"Instruction-only" hosts** (Cursor rules, Windsurf, Cline, Copilot, Kiro, and Antigravity's `AGENTS.md` fallback) only get the always-on rule, **without the commands**.
- **In Codex** you have to trust the hooks by hand — one extra step.
- **It's a heuristic, not magic.** It depends on the agent following the prompt. Sometimes it reuses something that doesn't quite fit, or gets too conservative on `ultra`. Reviewing is still your job.
- **It adds a decision layer** to every task. Cheap in practice, but it's there.

## Is it worth it?

For me, yes — and the cost of trying is nearly zero. Install it, leave it on `full`, and within the first few tasks you'll feel the agent **ask before inventing**. If it's too timid, bump it to `ultra`; if you want it looser in a prototype, use `lite` or `off`. The philosophy behind it (YAGNI, reuse, never cut the essentials) is the same one every senior dev carries — ponytail just makes the agent remember it on every task.

Repository: [github.com/dietrichgebert/ponytail](https://github.com/dietrichgebert/ponytail).
