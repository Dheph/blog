---
title: "Offline-first en React Native: lo que aprendí en producción"
date: 2026-10-18
tags: [react-native, offline-first, arquitectura]
description: "Cola de sincronización, resolución de conflictos y las trampas de asumir que la app siempre tiene red."
---

Buena parte de las apps que entregué funcionan en escenarios con red inestable — campo, galpón, interior. "Offline-first" dejó de ser adorno y pasó a ser requisito. Aquí van las decisiones que valieron la pena.

<svg viewBox="0 0 720 300" role="img" aria-label="Cola de sincronización: sin red, las operaciones quedan en cola; al volver la conexión se envían una a una al servidor" style="width:100%;height:auto;max-width:720px;display:block;margin:1.5rem auto;">
<rect x="20" y="70" width="200" height="160" rx="16" fill="var(--bg-card)" stroke="var(--border)" stroke-width="2"/>
<text x="120" y="98" text-anchor="middle" font-size="13" fill="var(--text-soft)">Cola local</text>
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
<text x="360" y="184" text-anchor="middle" font-size="13" fill="var(--text-faint)">Sin red</text>
</g>
<g opacity="0">
<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.29;0.32;0.95;0.98;1" dur="10s" repeatCount="indefinite"/>
<path d="M340 108 Q360 90 380 108 M348 117 Q360 106 372 117" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" fill="none"/>
<circle cx="360" cy="127" r="3.5" fill="var(--accent)"/>
<text x="360" y="184" text-anchor="middle" font-size="13" fill="var(--accent)">En línea: drenando</text>
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
<text x="360" y="272" text-anchor="middle" font-size="12" fill="var(--text-faint)">Las operaciones esperan en la cola y salen en orden cuando vuelve la red</text>
</svg>

## El estado local es la fuente de la verdad

La pantalla siempre lee de la base de datos local (SQLite, SmartStore o Redux Persist). La red es un detalle de sincronización en segundo plano, nunca un bloqueo de la UI. Esto cambia la forma de pensar: no "buscas y muestras", sino "muestras y reconcilias".

## Cola de sincronización

Toda mutación se convierte en un ítem de una cola persistida:

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

Un worker drena la cola cuando hay conexión, con *backoff* exponencial. Si la app se cierra a la mitad, la cola continúa desde donde quedó.

## Conflictos

La regla que menos duele en la mayoría de los casos: **last-write-wins por campo**, con el `updatedAt` del servidor como árbitro. Para datos críticos, vale un merge manual con pantalla de revisión — pero no empieces por ahí, añádelo solo cuando el negocio lo pida.

## Trampas

1. **`NetInfo` miente.** "Conectado" no es "la API responde". Confía en el resultado de la request, no en el estado de la red.
2. **IDs del servidor.** Genera un `uuid` en el cliente y mapéalo al id del servidor después. Nunca esperes el round-trip para dejar seguir al usuario.
3. **Migraciones de esquema local.** Versiona la base local desde el día 1.

> Offline-first trata más de disciplina de estado que de una librería mágica.
