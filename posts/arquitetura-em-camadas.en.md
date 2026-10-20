---
title: "Layered architecture: divide to build better"
date: 2021-01-26
tags: [architecture, fundamentals]
description: "Why splitting a system into layers that provide and consume services — from the OSI model to three-tier physical architecture — makes software easier to maintain."
---

Big systems are built better by a team. But teamwork only works if the work can be divided — and dividing it well means defining an architecture: who does what, what role each part plays and how they talk to one another. Without that, everyone pulls the code in a different direction and you end up with a tangle nobody understands.

One of the oldest and most useful ways to organize that split is to think in **layers**.

<svg viewBox="0 0 720 380" style="width:100%;height:auto;max-width:720px;display:block;margin:1.5rem auto;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram of a request going down through the layers and a response coming back up">
  <!-- Layer: Presentation -->
  <rect x="140" y="40" width="440" height="72" rx="10" stroke="var(--border)" fill="var(--bg-soft)">
    <animate attributeName="fill" values="var(--bg-soft);var(--bg-card);var(--bg-soft)" keyTimes="0;0.08;0.2" dur="8s" repeatCount="indefinite"/>
  </rect>
  <text x="360" y="72" text-anchor="middle" font-size="15" fill="var(--text)">Presentation</text>
  <text x="360" y="92" text-anchor="middle" font-size="12" fill="var(--text-soft)">client of the layer below</text>

  <!-- Layer: Application / Logic -->
  <rect x="140" y="154" width="440" height="72" rx="10" stroke="var(--border)" fill="var(--bg-soft)">
    <animate attributeName="fill" values="var(--bg-soft);var(--bg-card);var(--bg-soft)" keyTimes="0;0.22;0.34" dur="8s" repeatCount="indefinite"/>
  </rect>
  <text x="360" y="186" text-anchor="middle" font-size="15" fill="var(--text)">Application / Logic</text>
  <text x="360" y="206" text-anchor="middle" font-size="12" fill="var(--text-soft)">serves above, consumes below</text>

  <!-- Layer: Data -->
  <rect x="140" y="268" width="440" height="72" rx="10" stroke="var(--border)" fill="var(--bg-soft)">
    <animate attributeName="fill" values="var(--bg-soft);var(--bg-card);var(--bg-soft)" keyTimes="0;0.36;0.48" dur="8s" repeatCount="indefinite"/>
  </rect>
  <text x="360" y="300" text-anchor="middle" font-size="15" fill="var(--text)">Data</text>
  <text x="360" y="320" text-anchor="middle" font-size="12" fill="var(--text-soft)">server of the layer above</text>

  <!-- Flow labels -->
  <text x="628" y="150" text-anchor="middle" font-size="12" fill="var(--text-faint)">request</text>
  <text x="628" y="166" text-anchor="middle" font-size="12" fill="var(--text-faint)">↓</text>
  <text x="92" y="150" text-anchor="middle" font-size="12" fill="var(--text-faint)">response</text>
  <text x="92" y="166" text-anchor="middle" font-size="12" fill="var(--text-faint)">↑</text>

  <!-- Animated packet: goes down (request) and up (response) in a loop -->
  <circle r="9" fill="var(--accent)">
    <animate attributeName="cx" values="600;600;120;120" keyTimes="0;0.5;0.5;1" dur="8s" repeatCount="indefinite"/>
    <animate attributeName="cy"
      values="76;76;190;190;304;304;304;190;190;76;76"
      keyTimes="0;0.04;0.2;0.28;0.44;0.5;0.56;0.72;0.8;0.96;1"
      dur="8s" repeatCount="indefinite"/>
  </circle>
</svg>

## What a layer is

The idea is simple: **each layer provides services to the layer above it and consumes services from the layer below it**. In that relationship, whoever provides acts as a *server* and whoever consumes acts as a *client*. The upper layer doesn't need to know *how* the lower one solves the problem — it only needs to know what to ask for and what to expect back.

This communication can happen in two ways: directly, between classes and components of neighboring layers, or through a **predefined interface**. The interface is the one worth reaching for: it hides the internal details and makes the contract between the parts explicit.

## Classic examples

This isn't a new idea — it shows up in almost everything that is well built.

**Operating systems.** In a *monolithic* system, modules are compiled separately and then linked into a single executable. In a *microkernel*, the OS tasks are split into server modules orbiting a small central kernel; each module handles one responsibility and talks to the core.

**Networks.** The most didactic example of all. The **OSI** model describes seven layers — Application, Presentation, Session, Transport, Network, Data Link and Physical. **TCP/IP**, leaner and the one that actually runs the internet, uses four: Application, Transport, Network and Link. In both, your message travels down layer by layer until it becomes a signal on the wire, and climbs back up on the other side — exactly the flow in the diagram above.

## Logical architecture

When we design a system's architecture, the first cut is the **logical architecture**: a block model of the main elements — packages, interfaces, classes, subsystems — and the relationships between them.

The goal here is for the subsystems to be **independent** of one another. The less one depends on the internal details of another, the better. And this is where well-defined interfaces shine again: if the contract is clear, you can **swap an entire subsystem for another** without breaking the rest. It's the difference between remodeling one room and having to tear the whole house down.

## Physical architecture

The logical architecture says *what* exists; the **physical architecture** says *where* each part runs — how the logical elements are distributed across machines and servers, cloud included.

The most common layout is the **three-tier** one:

- **Presentation tier** — hosts the presentation, the interface with whoever uses the system.
- **Middle tier** — carries the application logic, often spread across several servers to scale.
- **Data tier** — holds the application's data, usually through a DBMS.

Notice that the same logical architecture can take on several different physical distributions depending on the needs around scale, cost and availability.

## Why it matters

In the end, splitting the system into parts does three things for you: it **clarifies roles** (each part has a clear responsibility), it **improves the control and organization** of teamwork, and it makes the software **easier to understand and maintain**. A well-made layer is one you can open years later and still understand.

I wrote this back in 2021, but the idea has only grown more relevant. When we talk today about *clean architecture* or separating domain, data and UI in a mobile app, we're applying exactly the same principle: each layer serves the one above, consumes the one below and hides its details behind a contract. The screen doesn't know whether the data came from a local cache or an API — and it's that well-organized ignorance that keeps the code alive for a long time.

> Dividing isn't complicating. It's giving each part a clear role so the whole makes sense.
