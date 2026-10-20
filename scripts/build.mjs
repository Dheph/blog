#!/usr/bin/env node
/* Gera posts.json a partir dos .md em posts/.
   Frontmatter YAML simples suportado: title, date, tags, description, draft.
   Sem dependências. */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const POSTS_DIR = join(ROOT, "posts");

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

function plain(md) {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~>\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  let files;
  try {
    files = (await readdir(POSTS_DIR)).filter((f) => f.toLowerCase().endsWith(".md"));
  } catch {
    files = [];
  }
  const posts = [];
  const seen = new Set();

  for (const file of files) {
    const raw = await readFile(join(POSTS_DIR, file), "utf8");
    const { data, body } = parseFrontmatter(raw);
    if (String(data.draft).toLowerCase() === "true") continue;

    const base = file.replace(/\.md$/i, "");
    let slug = slugify(data.slug || base);
    if (seen.has(slug)) slug = `${slug}-${posts.length}`;
    seen.add(slug);

    const title = data.title || base.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const text = plain(body);
    const words = text ? text.split(/\s+/).length : 0;
    const reading = Math.max(1, Math.round(words / 200));
    const description = data.description ||
      (text.length > 160 ? text.slice(0, 157).replace(/\s+\S*$/, "") + "…" : text);

    let date = data.date;
    if (!date) {
      const d = new Date();
      date = d.toISOString().slice(0, 10);
    }

    posts.push({
      slug, file, title, date,
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
      description, reading, text: text.slice(0, 4000),
    });
  }

  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));
  await writeFile(join(ROOT, "posts.json"), JSON.stringify(posts, null, 2) + "\n", "utf8");
  console.log(`✓ posts.json gerado — ${posts.length} post(s).`);
}

main().catch((e) => { console.error(e); process.exit(1); });
