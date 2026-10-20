---
title: "Network transmission technologies: broadcast and point-to-point"
date: 2021-01-26
tags: [networks, fundamentals]
description: "I classify networks by transmission technology and by scale — and show, with an animated diagram, the difference between broadcast and point-to-point."
---

When we talk about a "network", we usually jump straight to cables, Wi-Fi or the cloud. But before all that there's a more basic question: **how do the bits leave one machine and reach another?** There are two classic ways to look at this problem, and understanding both has helped me make better decisions day to day. I'll classify networks two ways: by **transmission technology** and by **scale**.

## By transmission technology

Here the split is between two kinds of link.

### Broadcast links

In a broadcast link, **all the machines share a single communication channel**. When one machine puts a packet on that channel, the packet reaches every other machine. For this to work, each packet carries an **address field** saying who it's for. Every machine that receives the packet checks that address: if it's for them, they process it; if not, they simply ignore it and discard it.

The analogy I use is someone shouting a name across a crowded room: the voice reaches everyone, but only the person being called answers. The others hear it and move on.

This model also allows two useful tricks:

- **Broadcasting**: there's a special address code that, when used, makes the packet be delivered to and processed by **all** machines on the channel at once.
- **Multicasting**: some systems can address the packet to a **subset** of the machines — not just one, not all, but a group.

### Point-to-point links

At the other extreme are point-to-point links. Here machines are connected in **pairs**. For a packet to leave the source and reach its destination, it may need to **pass through one or more intermediate machines** along the way. And since there's almost always more than one possible path, **route selection** starts to matter a lot: picking a good path is an essential part of how it works.

A rule of thumb: **smaller**, localized networks tend to use broadcast — it's simple and cheap to throw everything on the same channel. **Larger** networks tend to be point-to-point, with **unicast** transmission (one sender, one well-defined receiver). There are exceptions on both sides, but that's the general trend.

<svg viewBox="0 0 720 330" style="width:100%;height:auto;max-width:720px;display:block;margin:1.5rem auto;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram comparing broadcast and point-to-point">
  <text x="190" y="30" text-anchor="middle" font-size="15" font-weight="600" fill="var(--text)">Broadcast</text>
  <text x="540" y="30" text-anchor="middle" font-size="15" font-weight="600" fill="var(--text)">Point-to-point</text>
  <line x1="360" y1="48" x2="360" y2="288" stroke="var(--border)" stroke-width="1.5" stroke-dasharray="5 6"/>

  <!-- BROADCAST PANEL -->
  <line x1="70" y1="180" x2="310" y2="180" stroke="var(--border)" stroke-width="2"/>
  <circle cx="70" cy="180" r="18" fill="none" stroke="var(--accent)" stroke-width="2">
    <animate attributeName="r" values="18;95" dur="2s" begin="0s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.5;0" dur="2s" begin="0s" repeatCount="indefinite"/>
  </circle>
  <circle cx="70" cy="180" r="18" fill="none" stroke="var(--accent)" stroke-width="2">
    <animate attributeName="r" values="18;95" dur="2s" begin="0.66s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.5;0" dur="2s" begin="0.66s" repeatCount="indefinite"/>
  </circle>
  <circle cx="70" cy="180" r="18" fill="none" stroke="var(--accent)" stroke-width="2">
    <animate attributeName="r" values="18;95" dur="2s" begin="1.33s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.5;0" dur="2s" begin="1.33s" repeatCount="indefinite"/>
  </circle>

  <circle cx="160" cy="180" r="18" fill="var(--bg-card)" stroke="var(--border)" stroke-width="2"/>
  <circle cx="310" cy="180" r="18" fill="var(--bg-card)" stroke="var(--border)" stroke-width="2"/>
  <circle cx="235" cy="180" r="18" fill="var(--bg-soft)" stroke="var(--accent)" stroke-width="2.5">
    <animate attributeName="stroke-width" values="2.5;4;2.5" dur="2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="70" cy="180" r="18" fill="var(--bg-card)" stroke="var(--border)" stroke-width="2"/>

  <circle r="5" fill="var(--accent)">
    <animateMotion path="M70,180 L160,180" dur="2s" repeatCount="indefinite"/>
  </circle>
  <circle r="5" fill="var(--accent)">
    <animateMotion path="M70,180 L235,180" dur="2s" repeatCount="indefinite"/>
  </circle>
  <circle r="5" fill="var(--accent)">
    <animateMotion path="M70,180 L310,180" dur="2s" repeatCount="indefinite"/>
  </circle>

  <text x="70" y="218" text-anchor="middle" font-size="12" fill="var(--text-soft)">sender</text>
  <text x="235" y="218" text-anchor="middle" font-size="12" fill="var(--accent)">target</text>
  <text x="190" y="305" text-anchor="middle" font-size="12" fill="var(--text-soft)">One shared channel — everyone receives, only the target replies</text>

  <!-- POINT-TO-POINT PANEL -->
  <polyline points="410,120 500,210 590,110 680,200" fill="none" stroke="var(--border)" stroke-width="2"/>
  <circle cx="410" cy="120" r="18" fill="var(--bg-card)" stroke="var(--border)" stroke-width="2"/>
  <circle cx="500" cy="210" r="18" fill="var(--bg-card)" stroke="var(--border)" stroke-width="2"/>
  <circle cx="590" cy="110" r="18" fill="var(--bg-card)" stroke="var(--border)" stroke-width="2"/>
  <circle cx="680" cy="200" r="18" fill="var(--bg-soft)" stroke="var(--accent)" stroke-width="2.5">
    <animate attributeName="stroke-width" values="2.5;4;2.5" dur="3.5s" repeatCount="indefinite"/>
  </circle>

  <circle r="5" fill="var(--accent)">
    <animateMotion path="M410,120 L500,210 L590,110 L680,200" dur="3.5s" repeatCount="indefinite"/>
  </circle>

  <text x="410" y="158" text-anchor="middle" font-size="12" fill="var(--text-soft)">sender</text>
  <text x="680" y="238" text-anchor="middle" font-size="12" fill="var(--accent)">destination</text>
  <text x="540" y="305" text-anchor="middle" font-size="12" fill="var(--text-soft)">The packet hops from node to node to the destination</text>
</svg>

## By scale

The second way to classify is by the **physical size** of the network — the distance it covers. This matters because different techniques suit different scales: what works inside a room doesn't work between cities.

- **PAN** (Personal Area Network): the smallest of them, on the scale of a single person. The classic example is the wireless mouse talking to the computer.
- **LAN** (Local Area Network): a local network, covering a room, floor or building.
- **MAN** (Metropolitan Area Network): metropolitan scale, covering a city.
- **WAN** (Wide Area Network): geographically distributed, covering regions, countries or continents.

When you connect two or more networks, you get an **internetwork**. The largest and best-known example of an internetwork in the world is the **Internet**.

## Why this matters in practice

It may sound like distant theory, but I use these concepts all the time. When one of my apps relies on discovering devices on the local network, I'm counting on **broadcast** (broadcast/multicast) to find who's nearby. When it talks to an API on the other side of the world, that's **point-to-point**, with the packet hopping through several routers to get there — and the route can change, latency varies, and the code had better be ready for that.

Understanding whether traffic is shared or dedicated, and at what scale it happens, changes how you design timeouts, retries and caching. In the end, a network isn't magic: it's bits travelling through a channel, and knowing **which** channel makes all the difference.
