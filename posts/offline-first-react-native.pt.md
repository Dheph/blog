---
title: "Offline-first em React Native: o que aprendi em produção"
date: 2026-10-18
tags: [react-native, offline-first, arquitetura]
description: "Fila de sincronização, resolução de conflitos e as armadilhas de assumir que o app sempre tem rede."
---

Boa parte dos apps que entreguei roda em cenários com rede instável — campo, galpão, interior. "Offline-first" deixou de ser enfeite e virou requisito. Aqui vão as decisões que se pagaram.

<svg viewBox="0 0 720 300" role="img" aria-label="Fila de sincronização: sem rede, as operações ficam enfileiradas; quando a conexão volta, são enviadas uma a uma ao servidor" style="width:100%;height:auto;max-width:720px;display:block;margin:1.5rem auto;">
<rect x="20" y="70" width="200" height="160" rx="16" fill="var(--bg-card)" stroke="var(--border)" stroke-width="2"/>
<text x="120" y="98" text-anchor="middle" font-size="13" fill="var(--text-soft)">Fila local</text>
<rect x="36" y="122" width="168" height="56" rx="10" fill="var(--bg-soft)" stroke="var(--border)"/>
<text x="120" y="208" text-anchor="middle" font-size="13" fill="var(--text-faint)">Dispositivo</text>
<rect x="500" y="70" width="200" height="160" rx="16" fill="var(--bg-card)" stroke="var(--border)" stroke-width="2"/>
<text x="600" y="98" text-anchor="middle" font-size="13" fill="var(--text-soft)">Servidor</text>
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
<text x="360" y="184" text-anchor="middle" font-size="13" fill="var(--text-faint)">Sem rede</text>
</g>
<g opacity="0">
<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.29;0.32;0.95;0.98;1" dur="10s" repeatCount="indefinite"/>
<path d="M340 108 Q360 90 380 108 M348 117 Q360 106 372 117" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" fill="none"/>
<circle cx="360" cy="127" r="3.5" fill="var(--accent)"/>
<text x="360" y="184" text-anchor="middle" font-size="13" fill="var(--accent)">Online: drenando</text>
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
<text x="360" y="272" text-anchor="middle" font-size="12" fill="var(--text-faint)">As operações esperam na fila e saem em ordem quando a rede volta</text>
</svg>


## O estado local é a fonte da verdade

A tela lê sempre do banco local (SQLite, SmartStore ou Redux Persist). A rede é um detalhe de sincronização em segundo plano, nunca um bloqueio de UI. Isso muda o jeito de pensar: você não "busca e mostra", você "mostra e reconcilia".

## Fila de sincronização

Toda mutação vira um item numa fila persistida:

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

Um worker drena a fila quando há conexão, com *backoff* exponencial. Se o app fecha no meio, a fila continua de onde parou.

## Conflitos

A regra que menos dói na maioria dos casos: **last-write-wins por campo**, com `updatedAt` do servidor como árbitro. Para dados críticos, vale um merge manual com tela de revisão — mas não comece por aí, só adicione quando o negócio pedir.

## Armadilhas

1. **`NetInfo` mente.** "Conectado" não é "a API responde". Confie no resultado da request, não no status da rede.
2. **IDs do servidor.** Gere um `uuid` no cliente e mapeie para o id do servidor depois. Nunca espere o round-trip para deixar o usuário seguir.
3. **Migrações de schema local.** Versione o banco local desde o dia 1.

> Offline-first é mais sobre disciplina de estado do que sobre uma biblioteca mágica.
