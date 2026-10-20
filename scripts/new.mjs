#!/usr/bin/env node
/* Cria um novo post .md com frontmatter pronto.
   Uso: npm run new -- "Título do post"  [tag1,tag2] */
import { writeFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const title = process.argv[2];
if (!title) {
  console.error('Uso: npm run new -- "Título do post" [tag1,tag2]');
  process.exit(1);
}
const tags = (process.argv[3] || "").split(",").map((s) => s.trim()).filter(Boolean);

const slug = title.normalize("NFD").replace(/[̀-ͯ]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const date = new Date().toISOString().slice(0, 10);
const file = join(ROOT, "posts", `${slug}.md`);

try { await access(file); console.error(`✗ Já existe: posts/${slug}.md`); process.exit(1); } catch {}

const fm = `---
title: "${title.replace(/"/g, '\\"')}"
date: ${date}
tags: [${tags.join(", ")}]
description: ""
---

Escreva aqui. Suporta **Markdown** completo (GFM): listas, código, tabelas, imagens.

## Seção

Conteúdo…
`;

await writeFile(file, fm, "utf8");
console.log(`✓ Criado: posts/${slug}.md`);
console.log(`  Edite, rode "npm run build" e faça commit/push.`);
