---
title: "Ponytail: hacer que la IA escriba menos código (y mejor)"
date: 2026-10-20
tags: [ia, herramientas, productividad]
description: "Una skill que hace que el agente reutilice antes de crear. El mejor código es el que nunca escribiste — sin recortar validación, manejo de errores ni seguridad."
---

Cualquiera que programe con un agente de IA ya lo notó: **les encanta escribir código**. Pides un selector de fecha y el agente te entrega un calendario de 335 líneas, cuando bastaba con reutilizar el input que ya existe en el proyecto. Multiplica eso por un día entero de trabajo y tienes una base de código inflada: más para mantener, más para romperse.

[Ponytail](https://github.com/dietrichgebert/ponytail) ataca justo esto. Es una skill (básicamente un prompt) que cambia cómo piensa el agente antes de escribir. El lema del proyecto lo dice todo: *el mejor código es el que nunca escribiste.*

## Qué es ponytail

Es un prompt open-source (licencia MIT, sitio en ponytail.dev) que instalas en tu agente de IA. Queda **siempre activo** y, antes de que el agente empiece a teclear, lo obliga a hacerse una pregunta simple: *¿esto de verdad necesita código nuevo?*

Lo importante —y lo que distingue a ponytail de "solo ahorrar tokens"— es que la meta **nunca fue la menor cantidad de caracteres**. La regla es escribir solo lo que la tarea necesita, pero **sin nunca recortar** validación, manejo de errores, seguridad y accesibilidad. Esa es la línea entre "código magro" y "código endeble".

## Cómo funciona: la escalera

Antes de escribir, el agente lee y rastrea el código que el cambio va a tocar. Luego sube una "escalera" de preguntas y **se detiene en el primer peldaño que resuelve**:

<svg viewBox="0 0 720 440" style="width:100%;height:auto;max-width:720px;display:block;margin:1.5rem auto;" role="img" aria-label="Escalera de decisión de ponytail: el agente se detiene en el primer peldaño que resuelve, aquí '¿Ya está en el código?'">
  <text x="360" y="26" text-anchor="middle" font-family="inherit" font-size="15" font-weight="600" fill="var(--text-soft)">La escalera: párate en el primer peldaño que resuelve</text>
  <g font-family="inherit" font-size="13">
    <g>
      <rect x="150" y="60" width="520" height="42" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
      <circle cx="128" cy="81" r="14" fill="var(--bg-card)" stroke="var(--border)"/>
      <text x="128" y="86" text-anchor="middle" fill="var(--text-soft)">1</text>
      <text x="172" y="86" fill="var(--text)">¿Necesita existir?</text>
    </g>
    <g>
      <rect x="150" y="110" width="520" height="42" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
      <circle cx="128" cy="131" r="14" fill="var(--bg-card)" stroke="var(--border)"/>
      <text x="128" y="136" text-anchor="middle" fill="var(--text-soft)">2</text>
      <text x="172" y="136" fill="var(--text)">¿Ya está en el código?</text>
    </g>
    <g>
      <rect x="150" y="160" width="520" height="42" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
      <circle cx="128" cy="181" r="14" fill="var(--bg-card)" stroke="var(--border)"/>
      <text x="128" y="186" text-anchor="middle" fill="var(--text-soft)">3</text>
      <text x="172" y="186" fill="var(--text)">¿La librería estándar lo hace?</text>
    </g>
    <g>
      <rect x="150" y="210" width="520" height="42" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
      <circle cx="128" cy="231" r="14" fill="var(--bg-card)" stroke="var(--border)"/>
      <text x="128" y="236" text-anchor="middle" fill="var(--text-soft)">4</text>
      <text x="172" y="236" fill="var(--text)">¿Hay una función nativa de la plataforma?</text>
    </g>
    <g>
      <rect x="150" y="260" width="520" height="42" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
      <circle cx="128" cy="281" r="14" fill="var(--bg-card)" stroke="var(--border)"/>
      <text x="128" y="286" text-anchor="middle" fill="var(--text-soft)">5</text>
      <text x="172" y="286" fill="var(--text)">¿Alguna dependencia ya instalada?</text>
    </g>
    <g>
      <rect x="150" y="310" width="520" height="42" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
      <circle cx="128" cy="331" r="14" fill="var(--bg-card)" stroke="var(--border)"/>
      <text x="128" y="336" text-anchor="middle" fill="var(--text-soft)">6</text>
      <text x="172" y="336" fill="var(--text)">¿Puede ser una línea?</text>
    </g>
    <g>
      <rect x="150" y="360" width="520" height="42" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
      <circle cx="128" cy="381" r="14" fill="var(--bg-card)" stroke="var(--border)"/>
      <text x="128" y="386" text-anchor="middle" fill="var(--text-soft)">7</text>
      <text x="172" y="386" fill="var(--text)">Lo mínimo que funciona (+ test)</text>
    </g>
    <rect x="150" y="110" width="520" height="42" rx="9" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2" opacity="0">
      <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.3;0.4;0.85;1" dur="6s" repeatCount="indefinite"/>
    </rect>
    <text x="650" y="135" text-anchor="end" fill="var(--accent)" font-weight="600" opacity="0">resuelto aquí ✓
      <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.3;0.4;0.85;1" dur="6s" repeatCount="indefinite"/>
    </text>
    <g fill="var(--accent)">
      <polygon points="96,73 116,81 96,89"/>
      <animateTransform attributeName="transform" type="translate" values="0 0;0 50;0 50;0 0" keyTimes="0;0.3;0.85;1" dur="6s" repeatCount="indefinite"/>
    </g>
  </g>
</svg>

La escalera completa, en orden: **(1)** ¿esto necesita existir? **(2)** ¿ya está en el código? **(3)** ¿la librería estándar lo hace? **(4)** ¿hay una función nativa de la plataforma? **(5)** ¿alguna dependencia instalada ya lo cubre? **(6)** ¿puede ser una línea? **(7)** si nada de eso, lo mínimo que funciona — más un test pequeño cuando la lógica tiene condiciones, bucles, parsing, dinero o seguridad.

En el ejemplo del selector de fecha: en vez del calendario de 335 líneas, el agente se detiene en el peldaño 2, reutiliza el `Input` del proyecto con `type="date"` y entrega **10 líneas**. Mismo resultado, una fracción del código.

Y al final de cada respuesta el agente dice **qué dejó de hacer o qué no revisó** — te enteras de los atajos en vez de descubrirlos después.

## Niveles de intensidad

Regulas cuánto aprieta:

- **`lite`** — ligero, solo lo esencial.
- **`full`** — el valor por defecto.
- **`ultra`** — lo más agresivo posible en reutilizar y recortar.
- **`off`** — lo apaga en la sesión.

## Comandos

Además de estar siempre activo, trae comandos útiles:

| Comando | Para qué |
|---|---|
| `/ponytail [lite \| full \| ultra \| off]` | Cambia el nivel o lo apaga |
| `/ponytail-review` | Revisa el diff actual: bugs, seguridad, carga, tests faltantes, atajos |
| `/ponytail-audit` | Revisa todo el repo, priorizando lo que importa |
| `/ponytail-debt` | Junta los comentarios `shortcut:` en un libro de deuda técnica |
| `/ponytail-gain` | Muestra el marcador de impacto (código, tiempo, costo ahorrados) |
| `/ponytail-help` | Referencia rápida |
| `/ponytail band [on \| off \| import]` | Solo en Claude Code: barra de estado sobre el prompt |

## Cómo instalar y usar

### En Claude Code

Dos comandos:

```bash
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail
```

Es el host con soporte **completo**: todos los comandos, más el **band** — una barra sobre el prompt que muestra costo, tokens, tiempo del agente, reutilización de código y estado de los tests en tiempo real. El band requiere Claude Code **2.1.290+** y no aparece en el panel de chat de VS Code, en sesiones en la nube ni en `claude -p`.

### En Codex

```bash
codex plugin marketplace add DietrichGebert/ponytail
codex plugin add ponytail@ponytail
```

Luego abre `/hooks`, **confía en los dos hooks de ciclo de vida** y empieza un hilo nuevo. En Codex los comandos se invocan como skills, con el formato `$ponytail:ponytail-review`.

### En Antigravity

Antigravity funciona de dos maneras:

- **Antigravity CLI** — es un host "skill-capable", así que instalas la skill y obtienes el conjunto completo de comandos.
- **En el resto (fallback)** — copias el archivo **`AGENTS.md`** del repo dentro de tu proyecto. El ruleset queda siempre activo (el agente reutiliza antes de crear), pero **sin los comandos** (`/ponytail-review` y demás).

### En cualquier otro agente

Copia `AGENTS.md` en tu proyecto, o pídele al agente que instale `skills/ponytail/SKILL.md`. El `INSTALL.md` del repo tiene el paso a paso para Copilot, Cursor, OpenCode, Gemini y muchos más — unos 20 agentes en total. Instala **solo** desde el repo oficial en GitHub o el paquete npm `@dietrichgebert/ponytail`.

## Configuración

Nada que configurar — funciona al instalar. Si quieres, fija el nivel por defecto en `~/.config/ponytail/config.json` o con la variable de entorno `PONYTAIL_DEFAULT_MODE`.

## Los números (con una pizca de escepticismo)

El autor publicó un benchmark de la versión 5, corrido en Claude Code con Opus 5.5, sobre 39 tareas (incluido un repo real de FastAPI + React), 5 ejecuciones cada una. Comparando el mismo agente con y sin la skill:

- **−53%** de código, **−41%** de tiempo, **−26%** de costo, **−45%** de tokens.
- **98%** de la lógica riesgosa salió con test (contra 68% sin ponytail).
- Los tests del propio agente atraparon **66%** de los bugs inyectados (contra 46%).
- En 6 tareas de seguridad, pasó las 30 ejecuciones.

Son cifras del propio proyecto, así que tómalas como una señal, no como ley — tu caso puede variar bastante. Aun así, la dirección tiene sentido: menos código casi siempre significa menos bugs y menos mantenimiento.

## Ventajas

- **Menos código que mantener y que se rompa.** El beneficio que se paga solo con el tiempo.
- **Reutiliza lo que ya existe** — stdlib, función nativa, componente del proyecto, dependencia instalada — en vez de reinventar.
- **No recorta lo que importa.** Validación, errores, seguridad y accesibilidad quedan fuera de la tijera, a propósito.
- **Más tests donde es riesgoso,** más un review/audit integrado para atrapar lo que se escapó.
- **Transparencia:** te dice qué dejó de hacer al final de cada respuesta.
- **Portátil y gratis:** MIT, corre en ~20 agentes, instalación de dos comandos.

## Desventajas y límites

- **Los benchmarks son del autor.** Trabajo honesto, pero sin auditoría independiente — ajusta la expectativa.
- **El band es solo de Claude Code** (y requiere 2.1.290+). En otros hosts pierdes esa vista en tiempo real.
- **Hosts "solo instrucción"** (reglas de Cursor, Windsurf, Cline, Copilot, Kiro y el fallback `AGENTS.md` de Antigravity) solo reciben la regla siempre-activa, **sin los comandos**.
- **En Codex** tienes que confiar en los hooks a mano — un paso extra.
- **Es una heurística, no magia.** Depende de que el agente siga el prompt. A veces reutiliza algo que no encaja bien, o se pone demasiado conservador en `ultra`. Revisar sigue siendo tu trabajo.
- **Agrega una capa de decisión** a cada tarea. Barata en la práctica, pero está ahí.

## ¿Vale la pena?

Para mí, sí — y el costo de probar es casi cero. Instálalo, déjalo en `full`, y en las primeras tareas ya sentirás al agente **preguntar antes de inventar**. Si lo ves demasiado tímido, súbelo a `ultra`; si lo quieres más suelto en un prototipo, usa `lite` u `off`. La filosofía detrás (YAGNI, reutilizar, no recortar lo esencial) es la misma que todo dev senior lleva consigo — ponytail solo hace que el agente la recuerde en cada tarea.

Repositorio: [github.com/dietrichgebert/ponytail](https://github.com/dietrichgebert/ponytail).
