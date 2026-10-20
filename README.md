# Blog

Blog pessoal **estático, gerenciado pelo próprio git**. Posts são arquivos `.md` em [`posts/`](posts/) — sem painel, sem banco de dados. SPA em JavaScript puro, deploy automático no GitHub Pages.

- ✍️ Postagem rápida: criar um `.md` e dar `push`
- 🔍 Busca client-side (título, descrição, tags e texto) + filtro por tags
- ⚡ Navegação instantânea (hash routing, zero recarregamento)
- 🎨 Design clean, responsivo, tema claro/escuro
- 🔗 Links para portfólio e redes (em [`config.json`](config.json))

## Fluxo diário

```bash
npm run new -- "Título do post" tag1,tag2   # cria o .md com frontmatter
# edite posts/titulo-do-post.md
npm run dev                                  # preview em http://localhost:5173
npm run build                                # regenera posts.json
git add . && git commit -m "post: título" && git push
```

O GitHub Action ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) regenera o índice e publica sozinho a cada push na `main`.

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
index.html          shell da SPA
assets/style.css    tema + layout
assets/app.js       roteamento, busca, render de markdown
posts/*.md          seus posts
posts.json          índice gerado (não editar à mão)
config.json         título, subtítulo e links
scripts/build.mjs   gera posts.json
scripts/new.mjs     cria novo post
```

## Configuração (uma vez)

1. No repositório: **Settings → Pages → Source: GitHub Actions**.
2. Ajuste `config.json` (título, links).
3. `git push` → publica em `https://<user>.github.io/blog/`.

Markdown renderizado com [marked](https://marked.js.org) e destaque de sintaxe com [highlight.js](https://highlightjs.org) (via CDN).
