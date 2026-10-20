---
title: "Como usar este blog"
date: 2026-10-20
tags: [meta, guia]
description: "Postar, editar e remover é só mexer em arquivos .md e dar push. Zero painel, zero banco de dados."
---

Este blog é **gerenciado pelo próprio git**. Não existe painel admin nem banco de dados: cada post é um arquivo `.md` na pasta `posts/`. Postar é criar um arquivo e dar `push`.

## Adicionar um post

```bash
npm run new -- "Meu título" tag1,tag2
# cria posts/meu-titulo.md com o frontmatter pronto
```

Ou crie o `.md` na mão. O começo do arquivo (frontmatter) define os metadados:

```markdown
---
title: "Meu título"
date: 2026-10-20
tags: [react-native, dicas]
description: "Resumo curto que aparece na lista e na busca."
---

Conteúdo em **Markdown** normal.
```

Depois:

```bash
npm run build   # regenera posts.json (o índice)
git add . && git commit -m "post: meu título" && git push
```

O GitHub Action regenera o índice e publica sozinho. Em ~1 min está no ar.

## Editar

Abra o `.md`, altere, `npm run build`, commit, push. O histórico de edições fica no próprio git.

## Remover

```bash
git rm posts/meu-titulo.md
npm run build && git commit -am "remove: meu título" && git push
```

## Preview local

```bash
npm run dev     # sobe http://localhost:5173 já com o build
```

## O que dá pra usar no Markdown

- Títulos, **negrito**, *itálico*, listas
- `código inline` e blocos com destaque de sintaxe
- Tabelas, citações, imagens, links

> Dica: a busca (atalho `/`) varre título, descrição, tags e o texto do post. As tags no topo filtram a lista.

É isso. Simples de propósito.
