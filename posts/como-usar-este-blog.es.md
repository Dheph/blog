---
title: "Cómo usar este blog"
date: 2026-10-20
tags: [meta, guía]
description: "Publicar, editar y eliminar es solo tocar archivos .md y hacer push. Cero panel, cero base de datos."
---

Este blog está **gestionado por el propio git**. No existe panel de administración ni base de datos: cada post es un archivo `.md` en la carpeta `posts/`. Publicar es crear un archivo y hacer `push`.

## Añadir un post

```bash
npm run new -- "Meu título" tag1,tag2
# cria posts/meu-titulo.md com o frontmatter pronto
```

O crea el `.md` a mano. El inicio del archivo (frontmatter) define los metadatos:

```markdown
---
title: "Meu título"
date: 2026-10-20
tags: [react-native, dicas]
description: "Resumo curto que aparece na lista e na busca."
---

Conteúdo em **Markdown** normal.
```

Después:

```bash
npm run build   # regenera posts.json (o índice)
git add . && git commit -m "post: meu título" && git push
```

El GitHub Action regenera el índice y publica solo. En ~1 min está en línea.

## Editar

Abre el `.md`, cámbialo, `npm run build`, commit, push. El historial de ediciones queda en el propio git.

## Eliminar

```bash
git rm posts/meu-titulo.md
npm run build && git commit -am "remove: meu título" && git push
```

## Vista previa local

```bash
npm run dev     # sobe http://localhost:5173 já com o build
```

## Qué se puede usar en el Markdown

- Títulos, **negrita**, *cursiva*, listas
- `código en línea` y bloques con resaltado de sintaxis
- Tablas, citas, imágenes, enlaces

> Consejo: la búsqueda (atajo `/`) recorre el título, la descripción, las etiquetas y el texto del post. Las etiquetas de arriba filtran la lista.

Eso es todo. Simple a propósito.
