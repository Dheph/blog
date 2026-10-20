---
title: "Offline-first em React Native: o que aprendi em produção"
date: 2026-10-18
tags: [react-native, offline-first, arquitetura]
description: "Fila de sincronização, resolução de conflitos e as armadilhas de assumir que o app sempre tem rede."
---

Boa parte dos apps que entreguei roda em cenários com rede instável — campo, galpão, interior. "Offline-first" deixou de ser enfeite e virou requisito. Aqui vão as decisões que se pagaram.

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
