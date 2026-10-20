---
title: "How to use this blog"
date: 2026-10-20
tags: [meta, guide]
description: "Posting, editing and removing is just touching .md files and pushing. No admin panel, no database."
---

This blog is **managed by git itself**. There is no admin panel and no database: each post is a `.md` file in the `posts/` folder. Posting means creating a file and running `push`.

## Add a post

```bash
npm run new -- "Meu título" tag1,tag2
# cria posts/meu-titulo.md com o frontmatter pronto
```

Or create the `.md` by hand. The top of the file (frontmatter) defines the metadata:

```markdown
---
title: "Meu título"
date: 2026-10-20
tags: [react-native, dicas]
description: "Resumo curto que aparece na lista e na busca."
---

Conteúdo em **Markdown** normal.
```

Then:

```bash
npm run build   # regenera posts.json (o índice)
git add . && git commit -m "post: meu título" && git push
```

The GitHub Action regenerates the index and publishes on its own. It's live in about 1 minute.

## Edit

Open the `.md`, change it, `npm run build`, commit, push. The edit history lives in git itself.

## Remove

```bash
git rm posts/meu-titulo.md
npm run build && git commit -am "remove: meu título" && git push
```

## Local preview

```bash
npm run dev     # sobe http://localhost:5173 já com o build
```

## What you can use in Markdown

- Headings, **bold**, *italic*, lists
- `inline code` and blocks with syntax highlighting
- Tables, quotes, images, links

> Tip: search (shortcut `/`) scans the title, description, tags and the post text. The tags at the top filter the list.

That's it. Simple on purpose.
