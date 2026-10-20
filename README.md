# Blog

Blog pessoal **estático, gerenciado pelo próprio git**. Posts são arquivos `.md` em [`posts/`](posts/) — sem painel, sem banco de dados. SPA em JavaScript puro, deploy automático no GitHub Pages.

- ✍️ Postagem rápida: criar um `.md` e dar `push`
- 🌐 Multilíngue: **pt / en / es** — um arquivo por idioma, com seletor no topo e detecção automática pelo navegador
- 🔍 Busca client-side (título, descrição, tags e texto) + filtro por tags
- ⚡ Navegação instantânea (hash routing, zero recarregamento)
- 🎨 Design clean, responsivo, tema claro/escuro
- 🔗 Links para portfólio e redes (em [`config.json`](config.json))

## Fluxo diário

```bash
npm run new -- "Título do post" tag1,tag2        # cria posts/titulo-do-post.pt.md
# (opcional) outros idiomas:
npm run new -- "Post title" tag1,tag2 en         # cria posts/post-title.en.md
# edite os .md
npm run dev                                      # preview em http://localhost:5173
npm run build                                    # regenera posts.json
git add . && git commit -m "post: título" && git push
```

O GitHub Action ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) regenera o índice e publica sozinho a cada push na `main`.

## Múltiplos idiomas (pt / en / es)

Cada post é **um arquivo por idioma**, nomeado `posts/<slug>.<lang>.md` com `lang ∈ {pt, en, es}`:

```
posts/
  offline-first-react-native.pt.md
  offline-first-react-native.en.md
  offline-first-react-native.es.md
```

- O blog agrupa as versões pelo `<slug>` e mostra a do idioma escolhido (seletor **PT · EN · ES** no topo). O idioma inicial vem do navegador; cai no padrão (`defaultLang` no [`config.json`](config.json)) se não houver match.
- Post sem tradução no idioma ativo aparece na versão disponível, com um selo discreto indicando o idioma.
- Não precisa traduzir tudo: um post só em `pt` funciona normalmente.
- Idiomas e padrão são configuráveis em [`config.json`](config.json) (`languages`, `defaultLang`). Textos da interface ficam no objeto `UI` de [`assets/app.js`](assets/app.js).

### Imagens demonstrativas animadas

Os posts técnicos trazem diagramas **SVG inline animados** (SMIL). Como o SVG é inline, herda as variáveis CSS do tema — use sempre `var(--accent)`, `var(--text)`, `var(--border)`, etc. (nunca cores fixas) para ficar legível em tema claro e escuro.

### Editar / remover

```bash
# editar: altere o .md, depois
npm run build && git commit -am "edit: título" && git push

# remover:
git rm posts/titulo.md && npm run build && git commit -am "remove: título" && git push
```

## Frontmatter suportado

```markdown
---
title: "Título"
date: 2026-10-20
tags: [tag1, tag2]
description: "Resumo curto (opcional; gerado do texto se vazio)."
draft: false
---
```

`draft: true` esconde o post do build.

## Estrutura

```
index.html             shell da SPA
assets/style.css       tema + layout
assets/app.js          roteamento, busca, i18n, render de markdown
assets/jeffersom.jpg   logo/avatar e favicon
posts/<slug>.<lang>.md seus posts (um arquivo por idioma)
posts.json             índice gerado (não editar à mão)
config.json            título, subtítulo (por idioma), idiomas e links
scripts/build.mjs      gera posts.json agrupando por slug/idioma
scripts/new.mjs        cria novo post
```

## Configuração (uma vez)

1. No repositório: **Settings → Pages → Source: GitHub Actions**.
2. Ajuste `config.json` (título, links).
3. `git push` → publica em `https://<user>.github.io/blog/`.

Markdown renderizado com [marked](https://marked.js.org) e destaque de sintaxe com [highlight.js](https://highlightjs.org) (via CDN).
