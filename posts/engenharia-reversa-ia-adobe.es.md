---
title: "Ingeniería inversa con IA: ¿murió Adobe?"
date: 2026-10-20
tags: [ia, opinion, ingenieria-inversa]
description: "La IA abarató muchísimo la ingeniería inversa, pero no es un botón de clonar. El valor de Adobe vive donde el binario no llega."
---

> Este texto nació de un análisis de Fabio Akita sobre el tema — [AI Reverse Engineering: Is Adobe Dead?](https://akitaonrails.github.io/en/2026/10/13/ai-reverse-engineering-is-adobe-dead/). La tesis es la misma; las palabras y los ejemplos de abajo son mi propia lectura, como dev que vive de entregar software.

En las últimas semanas mi timeline volvió a explotar con el mismo estribillo de siempre: "la programación se acabó". Esta vez la chispa fueron clones open-source de productos de Adobe escritos en Rust y armados con ayuda de IA — un tal "PhotoCraft" parecido a Photoshop, proyectos que dan a los agentes acceso directo a desensambladores y decompiladores, y una ola de ports de juegos retro. La conclusión apresurada llegó en automático: si se puede reconstruir cualquier binario con un agente, entonces todo el software es reutilizable y Adobe está muerta.

Ojalá fuera tan simple. Pero quien ya abrió un binario a mano sabe que la historia es más aburrida — y más interesante — de lo que promete el tuit.

## La IA aceleró lo mecánico, no abolió lo difícil

Empiezo coincidiendo con la mitad del hype: la IA **abarató muchísimo** la ingeniería inversa. Es real y es importante. Lo que antes era una semana de trabajo mecánico — leer montañas de ensamblador, bautizar función por función, inferir estructuras de datos — hoy un modelo lo hace en horas, con una calidad que me habría asustado hace tres años.

Pero "abaratar lo mecánico" no es lo mismo que "resolver el problema". Ahí tropieza la lectura apresurada. La ingeniería inversa tiene etapas bien distintas, y la IA solo brilla en algunas:

- **Desensamblar** (binario → ensamblador): mecánico, determinista. La máquina siempre lo hizo bien; ahora es instantáneo.
- **Decompilar** (ensamblador → pseudocódigo): ruidoso. Sale un C que compila, pero horrible, lleno de `sub_401A20` y variables sin nombre.
- **Recuperar nombres y tipos**: aquí vive el trabajo humano de verdad. Los nombres no están en el binario. El compilador los tiró. Reconstruir el *significado* es inferencia, no decodificación.
- **Refactorizar**: convertir eso en código que un equipo mantenga. Difícil con o sin IA.

Los decompiladores neuronales de hoy llegan a algo así como 60–65% de corrección funcional en funciones aisladas. Es mucho para un borrador; es poco para confiar a ciegas. Y hay una trampa silenciosa: cuando pasas la salida cruda de un decompilador por un LLM para "limpiarla", las vulnerabilidades pueden simplemente *desaparecer* en el camino — el modelo "arregla" un comportamiento que, en realidad, era el bug. Crees que entendiste el programa; entendiste una paráfrasis de él.

## Esto no es nuevo — y ese detalle importa

Otra cosa que el hype borra: la ingeniería inversa es una disciplina **madura**, no un invento de los agentes. La BIOS del IBM PC se reimplementó de forma limpia allá por 1982. Samba leyó el protocolo de Microsoft a pulso. Wine corre ejecutables de Windows hasta hoy. Los emuladores existen hace décadas. Ghidra, la herramienta que destrabó buena parte de esta ola, la liberó la NSA en 2019. La fiebre de decompilación y recompilación empezó **antes** de los agentes de IA — la IA se subió a un tren que ya estaba en marcha y solo aceleró el vagón.

Eso cambia el encuadre. La pregunta correcta no es "¿la IA hizo posible lo imposible?", sino "¿cuánto bajó la IA el costo de lo que ya era posible?". La respuesta honesta: bastante en lo fácil, poco en lo caro.

## Las herramientas son una caja de herramientas, no un botón de clonar

Los proyectos que se viralizaron — como un "REA" que da al agente acceso a un desensamblador — son cajas de herramientas potentes, no un botón de "clonar producto". Siguen exigiendo el binario corriendo en *tu* máquina, herramientas de pago en la cadena, y un presupuesto de tokens que haría sudar a cualquier product manager. Automatizan lo tedioso; no reemplazan al ingeniero que decide qué importa.

¿Y los clones de Adobe? Son alfas tempranas, y se nota. Una lista de issues abierta del largo de un brazo, gestión de memoria que se atraganta con imágenes grandes, gestión de color débil, compatibilidad PSD floja. Es carrocería de Ferrari con motor de Escarabajo: la interfaz se parece, la demo impresiona, pero abre un archivo de producción de verdad y la diferencia aparece en la primera capa de ajuste.

## El valor de Adobe vive donde el binario no llega

Aquí está el punto que ignora el "Adobe murió": la parte valiosa del producto **no está en el binario**. Puedes decompilar el ejecutable entero y seguir sin tener nada de lo que de verdad retiene al cliente:

- Las funciones **generativas** corren en la **nube** de Adobe, en modelos y pesos que nadie va a desensamblar desde tu escritorio.
- Los perfiles de lente y de color de **Camera RAW** son ~20 años de calibración medida en el mundo real, cámara por cámara.
- La **ciencia del color para impresión** — CMYK, perfiles ICC — son décadas de trabajo; GIMP lo persigue hace años y todavía no termina.
- Las bibliotecas **Pantone** son propietarias y licenciadas. No se "hace ingeniería inversa" a un contrato.
- Las transformaciones de color usadas en el cine dependen de SDKs y de acuerdos con fabricantes. Eso es relación comercial, no bytes.

Nada de eso se filtra al desensamblado. Es conocimiento, datos licenciados y relaciones — justo lo que un decompilador no ve.

## Objetivo en movimiento, y a veces ni siquiera hay binario

También está el problema del **objetivo en movimiento**. El viejo formato `.doc` de Microsoft tardó más de una década en documentarse por ingeniería inversa — y cuando lo documentaron, el mercado ya se había movido a otros formatos. Ganaste una guerra que ya nadie peleaba.

Y el software comercial moderno suele ser **SaaS**. Muchas veces no existe binario que analizar: la lógica que importa corre en un servidor que nunca tocas. No puedes desensamblar lo que no tienes.

<svg viewBox="0 0 720 236" style="width:100%;height:auto;max-width:720px;display:block;margin:1.5rem auto;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Un pipeline de ingeniería inversa que se detiene en una barrera de nube, datos licenciados y ciencia del color">
  <defs>
    <marker id="arw-es" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="var(--text-faint)"/>
    </marker>
  </defs>
  <text x="263" y="28" text-anchor="middle" font-size="13" fill="var(--text-soft)">Pipeline de ingeniería inversa</text>

  <rect x="12" y="84" width="112" height="56" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
  <text x="68" y="116" text-anchor="middle" font-size="13" fill="var(--text)">binario</text>

  <rect x="142" y="84" width="112" height="56" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
  <text x="198" y="116" text-anchor="middle" font-size="13" fill="var(--text)">desensamblar</text>

  <rect x="272" y="84" width="112" height="56" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
  <text x="328" y="116" text-anchor="middle" font-size="13" fill="var(--text)">decompilar</text>

  <rect x="402" y="84" width="112" height="56" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
  <text x="458" y="108" text-anchor="middle" font-size="12" fill="var(--text)">recuperar nombres</text>
  <text x="458" y="124" text-anchor="middle" font-size="12" fill="var(--text)">y tipos</text>

  <line x1="124" y1="112" x2="140" y2="112" stroke="var(--text-faint)" stroke-width="2" marker-end="url(#arw-es)"/>
  <line x1="254" y1="112" x2="270" y2="112" stroke="var(--text-faint)" stroke-width="2" marker-end="url(#arw-es)"/>
  <line x1="384" y1="112" x2="400" y2="112" stroke="var(--text-faint)" stroke-width="2" marker-end="url(#arw-es)"/>
  <line x1="514" y1="112" x2="544" y2="112" stroke="var(--text-faint)" stroke-width="2" marker-end="url(#arw-es)"/>

  <rect x="548" y="44" width="160" height="140" rx="12" fill="var(--bg-card)" stroke="var(--accent)" stroke-width="2"/>
  <rect x="548" y="44" width="160" height="140" rx="12" fill="var(--accent)" opacity="0">
    <animate attributeName="opacity" dur="4.5s" repeatCount="indefinite" values="0;0;0.35;0;0" keyTimes="0;0.52;0.57;0.66;1"/>
  </rect>
  <path d="M619,74 v-6 a9,9 0 0 1 18,0 v6" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
  <rect x="615" y="74" width="26" height="20" rx="3" fill="var(--accent)"/>
  <text x="628" y="122" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">NUBE</text>
  <text x="628" y="142" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">DATOS LICENCIADOS</text>
  <text x="628" y="162" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">CIENCIA DEL COLOR</text>

  <g>
    <circle r="12" fill="var(--accent)"/>
    <text y="4" text-anchor="middle" font-size="10" font-weight="700" fill="var(--bg-card)">IA</text>
    <animateMotion dur="4.5s" repeatCount="indefinite" calcMode="linear" keyPoints="0;1;0.9;0.9" keyTimes="0;0.55;0.66;1" path="M 68,112 L 534,112"/>
  </g>

  <text x="360" y="214" text-anchor="middle" font-size="13" fill="var(--text-soft)">La IA llega hasta aquí — no más allá.</text>
</svg>

## El caso Bun muestra el precio real

Si quieres una vara para medir el costo de reescribir software serio, mira a Bun migrando de Zig a Rust: fueron algo así como **US$165 mil en llamadas de API**, 64 agentes corriendo en paralelo, el código fuente completo de referencia en la mano, una suite de pruebas con más de un millón de aserciones, y — el detalle que nadie cita — el autor original dirigiendo todo el proceso. Ese es el escenario *más fácil posible*: tienes el fuente, tienes las pruebas, conoces el dominio. Aun así, costó una fortuna.

Ahora imagina clonar Photoshop sin fuente, sin pruebas, sin autor, y con todo lo que importa escondido en la nube. El lujo de Bun simplemente no existe ahí.

## Por qué funcionan los ports retro (y por qué no se generaliza)

¿Entonces por qué salieron bien los ports de juegos antiguos? Porque es el escenario soñado para la ingeniería inversa:

- **Binarios minúsculos.** Super Mario 64 pesa unos 8 MB. Baldur's Gate 3 pasa de 150 GB. La escala lo cambia todo.
- **Hardware antiguo y documentado.** El objetivo lleva décadas quieto; la comunidad ya mapeó casi todo.
- **Un objetivo que no se mueve.** El cartucho no recibe actualizaciones. No le estás apuntando a un río.
- **Precedentes legales ya resueltos.** El terreno jurídico de esos casos antiguos está relativamente firme.

Y las consolas modernas ya son x86 o ARM — ni siquiera hace falta emular la CPU. Pero ojo: las arquitecturas difíciles siguen siendo difíciles. El Cell del PS3 y el PowerPC del Xbox 360 siguen siendo una pesadilla. **La arquitectura importa**, y ningún agente borra eso.

## Sobre el "crecimiento exponencial"

Un tirón de orejas al gráfico mental de "cae a la mitad cada mes". El precio de frontera bajó de forma modesta. El costo por **calidad fija** bajó más — pagas menos hoy por el mismo nivel de resultado. Pero la cuenta de un clon grande **empieza alta**, y dividir una cuenta alta entre dos varias veces todavía deja una cuenta alta por un buen rato. Exponencial en la diapositiva, lineal en la factura.

## Mi conclusión, como dev

Junto todo y aterrizo en un lugar mucho menos dramático que la timeline. La IA **bajó el costo** de la ingeniería inversa, de verdad — sobre todo en lo retro, donde el binario es pequeño, el hardware está documentado y el objetivo está congelado. Para productos comerciales vivos, lo que vale está en la nube, en datos licenciados, en relaciones con fabricantes y en décadas de conocimiento especializado que ningún desensamblador ve.

La ingeniería inversa sigue siendo **trabajo de ingeniería**. "La programación murió" no se sostiene — resucita en cada ciclo de hype y falla en cada ciclo por la misma razón: confunde el paso barato con el problema entero.

Y, sinceramente, eso me deja optimista. Si la parte mecánica se abarató, sobra más tiempo para el trabajo que siempre fue el nuestro: decidir qué importa, modelar el dominio, cuidar la calidad. Como dev, veo mucho camino por delante para la ingeniería de software con IA — solo que no es el camino de apretar un botón y clonar Adobe.
