/* Blog SPA — vanilla JS, hash routing, busca client-side, i18n (pt/en/es).
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

  const UI = {
    pt: {
      locale: "pt-BR", search: "Pesquisar posts…  (pressione /)", read: "min de leitura",
      back: "← voltar", empty: "Nenhum post encontrado.", loading: "Carregando…",
      notfound: "Post não encontrado.", notfoundBack: "Voltar ao início",
      error: "Erro ao carregar o blog. Rode `npm run build` e confira config.json / posts.json.",
      langFull: { pt: "Português", en: "Inglês", es: "Espanhol" },
      note: (l) => `Este post ainda não foi traduzido — exibindo em ${UI.pt.langFull[l]}.`,
    },
    en: {
      locale: "en-US", search: "Search posts…  (press /)", read: "min read",
      back: "← back", empty: "No posts found.", loading: "Loading…",
      notfound: "Post not found.", notfoundBack: "Back to home",
      error: "Failed to load the blog. Run `npm run build` and check config.json / posts.json.",
      langFull: { pt: "Portuguese", en: "English", es: "Spanish" },
      note: (l) => `This post isn't translated yet — showing the ${UI.en.langFull[l]} version.`,
    },
    es: {
      locale: "es-ES", search: "Buscar posts…  (pulsa /)", read: "min de lectura",
      back: "← volver", empty: "No se encontraron posts.", loading: "Cargando…",
      notfound: "Post no encontrado.", notfoundBack: "Volver al inicio",
      error: "Error al cargar el blog. Ejecuta `npm run build` y revisa config.json / posts.json.",
      langFull: { pt: "Portugués", en: "Inglés", es: "Español" },
      note: (l) => `Este post aún no está traducido — mostrando la versión en ${UI.es.langFull[l]}.`,
    },
  };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const views = { list: $('[data-view="list"]'), post: $('[data-view="post"]') };
  const el = {
    loading: $('[data-loading]'), notfound: $('[data-notfound]'),
    list: $('[data-post-list]'), empty: $('[data-empty]'),
    tags: $('[data-tags]'), search: $('#search'),
    langSwitch: $('[data-lang-switch]'), langNote: $('[data-lang-note]'),
  };

  let CONFIG = {};
  let POSTS = [];
  let LANGS = ["pt"];
  let DEFAULT_LANG = "pt";
  let lang = "pt";
  let activeTag = null;

  const t = () => UI[lang] || UI.pt;
  const fmtDate = (iso) => {
    try {
      return new Date(iso + "T00:00:00").toLocaleDateString(t().locale, { day: "2-digit", month: "long", year: "numeric" });
    } catch { return iso; }
  };
  const esc = (s) => (s || "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // escolhe o texto do post no idioma atual, com fallback
  const pick = (post) => {
    const used = post.i18n[lang] ? lang : (post.i18n[DEFAULT_LANG] ? DEFAULT_LANG : post.langs[0]);
    return { data: post.i18n[used], usedLang: used, translated: used === lang };
  };
  // escolhe string/objeto multilíngue (ex.: subtitle)
  const pickStr = (v) => (v && typeof v === "object" ? (v[lang] ?? v[DEFAULT_LANG] ?? Object.values(v)[0] ?? "") : (v || ""));

  /* ---------- idioma ---------- */
  function detectLang() {
    let saved = null;
    try { saved = localStorage.getItem("blog-lang"); } catch {}
    if (saved && LANGS.includes(saved)) return saved;
    for (const nav of (navigator.languages || [navigator.language || ""])) {
      const code = nav.slice(0, 2).toLowerCase();
      if (LANGS.includes(code)) return code;
    }
    return DEFAULT_LANG;
  }
  function setLang(next) {
    if (!LANGS.includes(next) || next === lang) return;
    lang = next;
    try { localStorage.setItem("blog-lang", lang); } catch {}
    document.documentElement.lang = lang;
    renderLangSwitch();
    applyConfig();
    activeTag = null;
    renderTags();
    renderList();
    route(); // re-renderiza o post aberto, se houver
  }
  function renderLangSwitch() {
    el.langSwitch.innerHTML = LANGS.map((l) =>
      `<button class="lang-btn" data-lang="${l}" aria-pressed="${l === lang}" title="${esc(t().langFull[l] || l)}">${l.toUpperCase()}</button>`
    ).join("");
    $$("[data-lang]", el.langSwitch).forEach((b) =>
      b.addEventListener("click", () => setLang(b.dataset.lang)));
  }

  /* ---------- config / links ---------- */
  function applyConfig() {
    document.title = CONFIG.title || "Blog";
    $$("[data-site-title]").forEach((n) => (n.textContent = CONFIG.title || "Blog"));
    $$("[data-site-subtitle]").forEach((n) => (n.textContent = pickStr(CONFIG.subtitle)));
    $$("[data-site-author]").forEach((n) => (n.textContent = CONFIG.author || CONFIG.title || ""));
    $("[data-year]").textContent = new Date().getFullYear();
    el.search.placeholder = t().search;
    $$('[data-i18n="back"]').forEach((n) => (n.textContent = t().back));
    el.empty.textContent = t().empty;
    const linkHTML = (l, withIcon) =>
      `<a href="${esc(l.url)}" ${l.url.startsWith("mailto:") ? "" : 'target="_blank" rel="noopener"'} title="${esc(l.label)}" aria-label="${esc(l.label)}">${withIcon ? (ICONS[l.icon] || esc(l.label)) : esc(l.label)}</a>`;
    $("[data-social]").innerHTML = (CONFIG.links || []).map((l) => linkHTML(l, true)).join("");
    $("[data-social-footer]").innerHTML = (CONFIG.links || []).map((l) => linkHTML(l, false)).join("");
  }

  /* ---------- lista ---------- */
  function renderTags() {
    const counts = {};
    POSTS.forEach((p) => pick(p).data.tags.forEach((tg) => (counts[tg] = (counts[tg] || 0) + 1)));
    const tags = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    el.tags.innerHTML = tags.map((tg) =>
      `<button class="tag-chip" data-tag="${esc(tg)}" aria-pressed="${activeTag === tg}">${esc(tg)} · ${counts[tg]}</button>`
    ).join("");
    $$("[data-tag]", el.tags).forEach((b) =>
      b.addEventListener("click", () => {
        activeTag = activeTag === b.dataset.tag ? null : b.dataset.tag;
        renderTags(); renderList();
      }));
  }

  function renderList() {
    const q = el.search.value.trim().toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);
    let items = POSTS.map((p) => ({ post: p, ...pick(p) }));
    if (activeTag) items = items.filter((x) => x.data.tags.includes(activeTag));
    if (terms.length) {
      items = items.filter((x) => {
        const d = x.data;
        const hay = `${d.title} ${d.description} ${d.tags.join(" ")} ${d.text || ""}`.toLowerCase();
        return terms.every((term) => hay.includes(term));
      });
    }
    el.empty.hidden = items.length > 0;
    el.list.innerHTML = items.map(({ post, data, translated, usedLang }) => `
      <a class="post-card" href="#/post/${esc(post.slug)}">
        <h2 class="post-card-title">${esc(data.title)}</h2>
        ${data.description ? `<p class="post-card-desc">${esc(data.description)}</p>` : ""}
        <div class="post-card-meta">
          <time datetime="${esc(post.date)}">${fmtDate(post.date)}</time>
          <span class="dot"></span><span>${data.reading} ${t().read}</span>
          ${!translated ? `<span class="chip-lang" title="${esc(t().langFull[usedLang])}">${usedLang.toUpperCase()}</span>` : ""}
          ${data.tags.map((tg) => `<span class="chip-mini">${esc(tg)}</span>`).join("")}
        </div>
      </a>`).join("");
  }

  /* ---------- post ---------- */
  async function renderPost(slug) {
    const post = POSTS.find((p) => p.slug === slug);
    if (!post) return showNotFound();
    const { data, usedLang, translated } = pick(post);
    let md;
    try {
      const res = await fetch(`posts/${data.file}`, { cache: "no-cache" });
      if (!res.ok) throw new Error(res.status);
      md = await res.text();
    } catch { return showNotFound(); }
    md = stripFrontmatter(md);
    document.title = `${data.title} — ${CONFIG.title || "Blog"}`;
    $("[data-post-title]").textContent = data.title;
    $("[data-post-date]").textContent = fmtDate(post.date);
    $("[data-post-date]").setAttribute("datetime", post.date);
    $("[data-post-reading]").textContent = `${data.reading} ${t().read}`;
    $("[data-post-tags]").innerHTML = data.tags.map((tg) =>
      `<a class="chip-mini" href="#/" data-tagjump="${esc(tg)}">${esc(tg)}</a>`).join("");
    el.langNote.hidden = translated;
    if (!translated) el.langNote.textContent = t().note(usedLang);
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
    el.loading.hidden = true; el.notfound.hidden = true;
    views.list.hidden = view !== "list";
    views.post.hidden = view !== "post";
  }
  function showNotFound() {
    el.loading.hidden = true; views.list.hidden = true; views.post.hidden = true;
    el.notfound.hidden = false;
    el.notfound.innerHTML = `${esc(t().notfound)} <a href="#/">${esc(t().notfoundBack)}</a>.`;
  }
  function route() {
    const hash = location.hash.replace(/^#/, "") || "/";
    const m = hash.match(/^\/post\/(.+)$/);
    if (m) renderPost(decodeURIComponent(m[1]));
    else show("list");
  }

  /* ---------- tema ---------- */
  function initTheme() {
    let saved = null; try { saved = localStorage.getItem("blog-theme"); } catch {}
    if (saved === "light" || saved === "dark") document.documentElement.setAttribute("data-theme", saved);
    $('[data-theme-toggle]')?.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme");
      const isDark = cur ? cur === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
      const next = isDark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("blog-theme", next); } catch {}
    });
  }

  /* ---------- atalhos ---------- */
  function initShortcuts() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement !== el.search && !views.list.hidden) {
        e.preventDefault(); el.search.focus();
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
      LANGS = Array.isArray(cfg.languages) && cfg.languages.length ? cfg.languages : ["pt"];
      DEFAULT_LANG = cfg.defaultLang && LANGS.includes(cfg.defaultLang) ? cfg.defaultLang : LANGS[0];
      POSTS = (posts || []).sort((a, b) => (a.date < b.date ? 1 : -1));
    } catch (e) {
      el.loading.textContent = t().error;
      console.error(e);
      return;
    }
    lang = detectLang();
    document.documentElement.lang = lang;
    renderLangSwitch();
    applyConfig();
    renderTags();
    renderList();
    window.addEventListener("hashchange", route);
    route();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
