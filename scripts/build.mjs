#!/usr/bin/env node
/* Gera posts.json a partir dos .md em posts/.
   Esquema multilíngue: cada post é um arquivo por idioma, <slug>.<lang>.md
   com lang ∈ {pt, en, es}. Arquivo sem sufixo de idioma vira o idioma padrão.
   Frontmatter YAML simples: title, date, tags, description, draft.
   Sem dependências. */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const POSTS_DIR = join(ROOT, "posts");
const LANGS = ["pt", "en", "es"];
const DEFAULT_LANG = "pt";

function parseFrontmatter(raw) {
  const m = raw.replace(/^﻿/, "").match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/);
  const data = {};
  let body = raw;
  if (m) {
    body = raw.slice(m[0].length);
    for (const line of m[1].split(/\r?\n/)) {
      const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (!kv) continue;
      const key = kv[1].trim();
      let val = kv[2].trim();
      if (/^\[.*\]$/.test(val)) {
        val = val.slice(1, -1).split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
      } else {
        val = val.replace(/^["']|["']$/g, "");
      }
      data[key] = val;
    }
  }
  return { data, body };
}

function slugify(s) {
  return s.toString().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/* texto puro p/ busca: remove código, html/svg, imagens, marcação */
function plain(md) {
  return md
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~>\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseName(file) {
  const m = file.match(/^(.+?)\.([a-z]{2})\.md$/i);
  if (m && LANGS.includes(m[2].toLowerCase())) {
    return { base: m[1], lang: m[2].toLowerCase() };
  }
  return { base: file.replace(/\.md$/i, ""), lang: DEFAULT_LANG };
}

async function main() {
  let files;
  try {
    files = (await readdir(POSTS_DIR)).filter((f) => f.toLowerCase().endsWith(".md"));
  } catch {
    files = [];
  }

  const bySlug = new Map();

  for (const file of files) {
    const { base, lang } = parseName(file);
    const slug = slugify(base);
    const raw = await readFile(join(POSTS_DIR, file), "utf8");
    const { data, body } = parseFrontmatter(raw);
    if (String(data.draft).toLowerCase() === "true") continue;

    const title = data.title || base.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const text = plain(body);
    const words = text ? text.split(/\s+/).length : 0;
    const reading = Math.max(1, Math.round(words / 200));
    const description = data.description ||
      (text.length > 160 ? text.slice(0, 157).replace(/\s+\S*$/, "") + "…" : text);

    const entry = {
      title, description, reading, file,
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
      text: text.slice(0, 4000),
      _date: data.date || null,
    };

    if (!bySlug.has(slug)) bySlug.set(slug, { slug, i18n: {} });
    bySlug.get(slug).i18n[lang] = entry;
  }

  const posts = [];
  for (const post of bySlug.values()) {
    const langs = LANGS.filter((l) => post.i18n[l]);
    if (!langs.length) continue;
    // data: prefere o idioma padrão, senão o primeiro disponível
    const dateSrc = post.i18n[DEFAULT_LANG] || post.i18n[langs[0]];
    const date = dateSrc._date || new Date().toISOString().slice(0, 10);
    for (const l of langs) delete post.i18n[l]._date;
    posts.push({ slug: post.slug, date, langs, i18n: post.i18n });
  }

  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
  await writeFile(join(ROOT, "posts.json"), JSON.stringify(posts, null, 2) + "\n", "utf8");

  const total = posts.length;
  const translations = posts.reduce((n, p) => n + p.langs.length, 0);
  console.log(`✓ posts.json gerado — ${total} post(s), ${translations} versão(ões) de idioma.`);
  for (const p of posts) {
    const missing = LANGS.filter((l) => !p.langs.includes(l));
    if (missing.length) console.log(`  · ${p.slug}: faltam [${missing.join(", ")}]`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
