/* Blog SPA — vanilla JS, hash routing, client-side search.
   Lê config.json + posts.json (gerado por scripts/build.mjs) e renderiza os .md de posts/. */
(() => {
  "use strict";

  const ICONS = {
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.47c.53.1.72-.23.72-.5v-1.76c-2.92.63-3.54-1.4-3.54-1.4-.48-1.22-1.17-1.54-1.17-1.54-.95-.65.08-.64.08-.64 1.05.08 1.6 1.08 1.6 1.08.94 1.6 2.46 1.14 3.06.87.1-.68.37-1.14.67-1.4-2.33-.27-4.78-1.17-4.78-5.2 0-1.15.4-2.09 1.08-2.83-.1-.27-.47-1.34.1-2.8 0 0 .88-.28 2.88 1.08a9.9 9.9 0 0 1 5.24 0c2-1.36 2.88-1.08 2.88-1.08.57 1.46.2 2.53.1 2.8.68.74 1.08 1.68 1.08 2.83 0 4.04-2.46 4.93-4.8 5.19.38.33.72.97.72 1.96v2.9c0 .28.19.61.73.5A10.5 10.5 0 0 0 12 1.5z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.82-2.05 3.75-2.05 4 0 4.75 2.64 4.75 6.07V21h-4v-5.5c0-1.3-.02-3-1.82-3-1.82 0-2.1 1.42-2.1 2.9V21H9z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.3 8.3L23 22h-6.6l-5.2-6.8L5.3 22H2l7.8-8.9L1.5 2h6.8l4.7 6.2zm-1.2 18h1.8L7.4 3.9H5.5z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 4.9 12 4.9 12 4.9s-7 0-8.9.5A3 3 0 0 0 1 7.5 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23.5 12 31 31 0 0 0 23 7.5zM9.75 15.5v-7l6 3.5z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
  };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const views = {
    list: $('[data-view="list"]'),
    post: $('[data-view="post"]'),
  };
  const el = {
    loading: $('[data-loading]'),
    notfound: $('[data-notfound]'),
    list: $('[data-post-list]'),
    empty: $('[data-empty]'),
    tags: $('[data-tags]'),
    search: $('#search'),
  };

  let CONFIG = {};
  let POSTS = [];
  let activeTag = null;

  const fmtDate = (iso) => {
    try {
      return new Date(iso + "T00:00:00").toLocaleDateString(CONFIG.lang || "pt-BR", {
        day: "2-digit", month: "long", year: "numeric",
      });
    } catch { return iso; }
  };
  const esc = (s) => (s || "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- tema ---------- */
  function initTheme() {
    const saved = (() => { try { return localStorage.getItem("blog-theme"); } catch { return null; } })();
    if (saved === "light" || saved === "dark") document.documentElement.setAttribute("data-theme", saved);
    $('[data-theme-toggle]')?.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme");
      const isDark = cur ? cur === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
      const next = isDark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("blog-theme", next); } catch {}
    });
  }

  /* ---------- config / links ---------- */
  function applyConfig() {
    document.title = CONFIG.title || "Blog";
    if (CONFIG.lang) document.documentElement.lang = CONFIG.lang;
    $$("[data-site-title]").forEach((n) => (n.textContent = CONFIG.title || "Blog"));
    $$("[data-site-subtitle]").forEach((n) => (n.textContent = CONFIG.subtitle || ""));
    $$("[data-site-author]").forEach((n) => (n.textContent = CONFIG.author || CONFIG.title || ""));
    $("[data-year]").textContent = new Date().getFullYear();
    const linksHTML = (CONFIG.links || []).map((l) =>
      `<a href="${esc(l.url)}" ${l.url.startsWith("mailto:") ? "" : 'target="_blank" rel="noopener"'} title="${esc(l.label)}" aria-label="${esc(l.label)}">${ICONS[l.icon] || esc(l.label)}</a>`
    ).join("");
    $("[data-social]").innerHTML = linksHTML;
    $("[data-social-footer]").innerHTML = (CONFIG.links || []).map((l) =>
      `<a href="${esc(l.url)}" ${l.url.startsWith("mailto:") ? "" : 'target="_blank" rel="noopener"'}>${esc(l.label)}</a>`
    ).join("");
  }

  /* ---------- lista ---------- */
  function renderTags() {
    const counts = {};
    POSTS.forEach((p) => (p.tags || []).forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
    const tags = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    el.tags.innerHTML = tags.map((t) =>
      `<button class="tag-chip" data-tag="${esc(t)}" aria-pressed="${activeTag === t}">${esc(t)} · ${counts[t]}</button>`
    ).join("");
    $$("[data-tag]", el.tags).forEach((b) =>
      b.addEventListener("click", () => {
        activeTag = activeTag === b.dataset.tag ? null : b.dataset.tag;
        renderTags();
        renderList();
      })
    );
  }

  function renderList() {
    const q = el.search.value.trim().toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);
    let items = POSTS.slice();
    if (activeTag) items = items.filter((p) => (p.tags || []).includes(activeTag));
    if (terms.length) {
      items = items.filter((p) => {
        const hay = `${p.title} ${p.description} ${(p.tags || []).join(" ")} ${p.text || ""}`.toLowerCase();
        return terms.every((t) => hay.includes(t));
      });
    }
    el.empty.hidden = items.length > 0;
    el.list.innerHTML = items.map((p) => `
      <a class="post-card" href="#/post/${esc(p.slug)}">
        <h2 class="post-card-title">${esc(p.title)}</h2>
        ${p.description ? `<p class="post-card-desc">${esc(p.description)}</p>` : ""}
        <div class="post-card-meta">
          <time datetime="${esc(p.date)}">${fmtDate(p.date)}</time>
          <span class="dot"></span><span>${p.reading} min de leitura</span>
          ${(p.tags || []).map((t) => `<span class="chip-mini">${esc(t)}</span>`).join("")}
        </div>
      </a>`).join("");
  }

  /* ---------- post ---------- */
  async function renderPost(slug) {
    const meta = POSTS.find((p) => p.slug === slug);
    if (!meta) return showNotFound();
    let md;
    try {
      const res = await fetch(`posts/${meta.file}`, { cache: "no-cache" });
      if (!res.ok) throw new Error(res.status);
      md = await res.text();
    } catch {
      return showNotFound();
    }
    md = stripFrontmatter(md);
    document.title = `${meta.title} — ${CONFIG.title || "Blog"}`;
    $("[data-post-title]").textContent = meta.title;
    $("[data-post-date]").textContent = fmtDate(meta.date);
    $("[data-post-date]").setAttribute("datetime", meta.date);
    $("[data-post-reading]").textContent = `${meta.reading} min de leitura`;
    $("[data-post-tags]").innerHTML = (meta.tags || []).map((t) =>
      `<a class="chip-mini" href="#/" data-tagjump="${esc(t)}">${esc(t)}</a>`).join("");
    if (window.marked) {
      marked.setOptions({ breaks: false, gfm: true });
      $("[data-post-body]").innerHTML = marked.parse(md);
    } else {
      $("[data-post-body]").textContent = md;
    }
    if (window.hljs) $$("pre code", $("[data-post-body]")).forEach((b) => hljs.highlightElement(b));
    $$("[data-tagjump]").forEach((a) => a.addEventListener("click", () => {
      activeTag = a.dataset.tagjump; renderTags(); renderList();
    }));
    show("post");
    window.scrollTo(0, 0);
  }

  function stripFrontmatter(md) {
    return md.replace(/^﻿?---\s*[\r\n]([\s\S]*?)[\r\n]---\s*[\r\n]/, "");
  }

  /* ---------- roteamento ---------- */
  function show(view) {
    el.loading.hidden = true;
    el.notfound.hidden = true;
    views.list.hidden = view !== "list";
    views.post.hidden = view !== "post";
  }
  function showNotFound() {
    el.loading.hidden = true;
    views.list.hidden = true;
    views.post.hidden = true;
    el.notfound.hidden = false;
  }

  function route() {
    const hash = location.hash.replace(/^#/, "") || "/";
    const m = hash.match(/^\/post\/(.+)$/);
    if (m) renderPost(decodeURIComponent(m[1]));
    else { show("list"); }
  }

  /* ---------- atalhos ---------- */
  function initShortcuts() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement !== el.search) {
        if (!views.list.hidden) { e.preventDefault(); el.search.focus(); }
      } else if (e.key === "Escape" && document.activeElement === el.search) {
        el.search.value = ""; renderList(); el.search.blur();
      }
    });
    el.search.addEventListener("input", renderList);
  }

  /* ---------- boot ---------- */
  async function boot() {
    initTheme();
    initShortcuts();
    try {
      const [cfg, posts] = await Promise.all([
        fetch("config.json", { cache: "no-cache" }).then((r) => r.json()),
        fetch("posts.json", { cache: "no-cache" }).then((r) => r.json()),
      ]);
      CONFIG = cfg;
      POSTS = (posts || []).sort((a, b) => (a.date < b.date ? 1 : -1));
    } catch (e) {
      el.loading.textContent = "Erro ao carregar o blog. Rode `npm run build` e confira config.json / posts.json.";
      console.error(e);
      return;
    }
    applyConfig();
    renderTags();
    renderList();
    window.addEventListener("hashchange", route);
    route();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
