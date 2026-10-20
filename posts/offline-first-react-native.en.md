---
title: "Offline-first in React Native: what I learned in production"
date: 2026-10-18
tags: [react-native, offline-first, architecture]
description: "Sync queue, conflict resolution and the pitfalls of assuming the app always has network."
---

A good share of the apps I shipped run in unstable-network scenarios — field work, warehouses, rural areas. "Offline-first" stopped being decoration and became a requirement. Here are the decisions that paid off.

<svg viewBox="0 0 720 300" role="img" aria-label="Sync queue: offline, operations stay queued; when the connection returns they are sent one by one to the server" style="width:100%;height:auto;max-width:720px;display:block;margin:1.5rem auto;">
<rect x="20" y="70" width="200" height="160" rx="16" fill="var(--bg-card)" stroke="var(--border)" stroke-width="2"/>
<text x="120" y="98" text-anchor="middle" font-size="13" fill="var(--text-soft)">Local queue</text>
<rect x="36" y="122" width="168" height="56" rx="10" fill="var(--bg-soft)" stroke="var(--border)"/>
<text x="120" y="208" text-anchor="middle" font-size="13" fill="var(--text-faint)">Device</text>
<rect x="500" y="70" width="200" height="160" rx="16" fill="var(--bg-card)" stroke="var(--border)" stroke-width="2"/>
<text x="600" y="98" text-anchor="middle" font-size="13" fill="var(--text-soft)">Server</text>
<rect x="540" y="116" width="120" height="16" rx="5" fill="var(--bg-soft)" stroke="var(--border)"/>
<rect x="540" y="142" width="120" height="16" rx="5" fill="var(--bg-soft)" stroke="var(--border)"/>
<rect x="540" y="168" width="120" height="16" rx="5" fill="var(--bg-soft)" stroke="var(--border)"/>
<rect x="540" y="116" width="120" height="16" rx="5" fill="var(--accent)" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.52;0.53;0.95;0.98;1" dur="10s" repeatCount="indefinite"/></rect>
<rect x="540" y="142" width="120" height="16" rx="5" fill="var(--accent)" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.62;0.63;0.95;0.98;1" dur="10s" repeatCount="indefinite"/></rect>
<rect x="540" y="168" width="120" height="16" rx="5" fill="var(--accent)" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.72;0.73;0.95;0.98;1" dur="10s" repeatCount="indefinite"/></rect>
<line x1="226" y1="150" x2="494" y2="150" stroke="var(--border)" stroke-width="2" stroke-dasharray="6 6"/>
<line x1="226" y1="150" x2="494" y2="150" stroke="var(--accent)" stroke-width="2" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.29;0.32;0.95;0.98;1" dur="10s" repeatCount="indefinite"/></line>
<g opacity="1">
<animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.28;0.31;0.97;1" dur="10s" repeatCount="indefinite"/>
<path d="M348 100 L372 124 M372 100 L348 124" stroke="var(--text-faint)" stroke-width="3" stroke-linecap="round" fill="none"/>
<text x="360" y="184" text-anchor="middle" font-size="13" fill="var(--text-faint)">Offline</text>
</g>
<g opacity="0">
<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.29;0.32;0.95;0.98;1" dur="10s" repeatCount="indefinite"/>
<path d="M340 108 Q360 90 380 108 M348 117 Q360 106 372 117" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" fill="none"/>
<circle cx="360" cy="127" r="3.5" fill="var(--accent)"/>
<text x="360" y="184" text-anchor="middle" font-size="13" fill="var(--accent)">Online: draining</text>
</g>
<rect x="52" y="136" width="28" height="28" rx="6" fill="var(--text)" stroke="var(--accent)" stroke-width="2">
<animateTransform attributeName="transform" type="translate" values="0 0;0 0;534 0;534 0;0 0" keyTimes="0;0.56;0.72;0.95;1" dur="10s" repeatCount="indefinite"/>
<animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.72;0.73;0.99;1" dur="10s" repeatCount="indefinite"/>
</rect>
<rect x="92" y="136" width="28" height="28" rx="6" fill="var(--text)" stroke="var(--accent)" stroke-width="2">
<animateTransform attributeName="transform" type="translate" values="0 0;0 0;494 0;494 0;0 0" keyTimes="0;0.46;0.62;0.95;1" dur="10s" repeatCount="indefinite"/>
<animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.62;0.63;0.99;1" dur="10s" repeatCount="indefinite"/>
</rect>
<rect x="132" y="136" width="28" height="28" rx="6" fill="var(--text)" stroke="var(--accent)" stroke-width="2">
<animateTransform attributeName="transform" type="translate" values="0 0;0 0;454 0;454 0;0 0" keyTimes="0;0.36;0.52;0.95;1" dur="10s" repeatCount="indefinite"/>
<animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.52;0.53;0.99;1" dur="10s" repeatCount="indefinite"/>
</rect>
<text x="360" y="272" text-anchor="middle" font-size="12" fill="var(--text-faint)">Operations wait in the queue and leave in order when the network returns</text>
</svg>

## Local state is the source of truth

The screen always reads from the local database (SQLite, SmartStore or Redux Persist). The network is a background sync detail, never a UI blocker. This changes how you think: you don't "fetch and show", you "show and reconcile".

## Sync queue

Every mutation becomes an item in a persisted queue:

```ts
type SyncOp = {
  id: string;
  entity: "order" | "visit";
  op: "create" | "update" | "delete";
  payload: unknown;
  createdAt: number;
  tries: number;
};
```

A worker drains the queue when there is a connection, with exponential *backoff*. If the app closes midway, the queue resumes where it stopped.

## Conflicts

The rule that hurts least in most cases: **last-write-wins per field**, with the server's `updatedAt` as the arbiter. For critical data, a manual merge with a review screen is worth it — but don't start there, only add it when the business asks for it.

## Pitfalls

1. **`NetInfo` lies.** "Connected" is not "the API responds". Trust the request result, not the network status.
2. **Server IDs.** Generate a `uuid` on the client and map it to the server id later. Never wait for the round-trip to let the user move on.
3. **Local schema migrations.** Version the local database from day 1.

> Offline-first is more about state discipline than about a magic library.
