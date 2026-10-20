---
title: "Arquitectura en capas: dividir para construir mejor"
date: 2021-01-26
tags: [arquitectura, fundamentos]
description: "Por qué separar el sistema en capas que proveen y consumen servicios — del modelo OSI a la arquitectura física en tres capas — hace el software más fácil de mantener."
---

Los sistemas grandes se construyen mejor en equipo. Pero el trabajo en equipo solo funciona si el trabajo se puede dividir — y dividirlo bien exige definir una arquitectura: quién hace qué, qué papel juega cada parte y cómo se comunican entre sí. Sin eso, cada quien tira del código hacia un lado y el resultado es un enredo que nadie entiende.

Una de las formas más antiguas y más útiles de organizar esa división es pensar en **capas**.

<svg viewBox="0 0 720 380" style="width:100%;height:auto;max-width:720px;display:block;margin:1.5rem auto;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagrama de una petición bajando por las capas y una respuesta subiendo de vuelta">
  <!-- Capa: Presentación -->
  <rect x="140" y="40" width="440" height="72" rx="10" stroke="var(--border)" fill="var(--bg-soft)">
    <animate attributeName="fill" values="var(--bg-soft);var(--bg-card);var(--bg-soft)" keyTimes="0;0.08;0.2" dur="8s" repeatCount="indefinite"/>
  </rect>
  <text x="360" y="72" text-anchor="middle" font-size="15" fill="var(--text)">Presentación</text>
  <text x="360" y="92" text-anchor="middle" font-size="12" fill="var(--text-soft)">cliente de la capa de abajo</text>

  <!-- Capa: Aplicación / Lógica -->
  <rect x="140" y="154" width="440" height="72" rx="10" stroke="var(--border)" fill="var(--bg-soft)">
    <animate attributeName="fill" values="var(--bg-soft);var(--bg-card);var(--bg-soft)" keyTimes="0;0.22;0.34" dur="8s" repeatCount="indefinite"/>
  </rect>
  <text x="360" y="186" text-anchor="middle" font-size="15" fill="var(--text)">Aplicación / Lógica</text>
  <text x="360" y="206" text-anchor="middle" font-size="12" fill="var(--text-soft)">sirve arriba, consume abajo</text>

  <!-- Capa: Datos -->
  <rect x="140" y="268" width="440" height="72" rx="10" stroke="var(--border)" fill="var(--bg-soft)">
    <animate attributeName="fill" values="var(--bg-soft);var(--bg-card);var(--bg-soft)" keyTimes="0;0.36;0.48" dur="8s" repeatCount="indefinite"/>
  </rect>
  <text x="360" y="300" text-anchor="middle" font-size="15" fill="var(--text)">Datos</text>
  <text x="360" y="320" text-anchor="middle" font-size="12" fill="var(--text-soft)">servidor de la capa de arriba</text>

  <!-- Etiquetas de flujo -->
  <text x="628" y="150" text-anchor="middle" font-size="12" fill="var(--text-faint)">petición</text>
  <text x="628" y="166" text-anchor="middle" font-size="12" fill="var(--text-faint)">↓</text>
  <text x="92" y="150" text-anchor="middle" font-size="12" fill="var(--text-faint)">respuesta</text>
  <text x="92" y="166" text-anchor="middle" font-size="12" fill="var(--text-faint)">↑</text>

  <!-- Paquete animado: baja (petición) y sube (respuesta) en bucle -->
  <circle r="9" fill="var(--accent)">
    <animate attributeName="cx" values="600;600;120;120" keyTimes="0;0.5;0.5;1" dur="8s" repeatCount="indefinite"/>
    <animate attributeName="cy"
      values="76;76;190;190;304;304;304;190;190;76;76"
      keyTimes="0;0.04;0.2;0.28;0.44;0.5;0.56;0.72;0.8;0.96;1"
      dur="8s" repeatCount="indefinite"/>
  </circle>
</svg>

## Qué es una capa

La idea es simple: **cada capa provee servicios a la capa de arriba y consume servicios de la capa de abajo**. En esa relación, quien provee actúa como un *servidor* y quien consume actúa como un *cliente*. La capa de arriba no necesita saber *cómo* la de abajo resuelve el problema — solo necesita saber qué pedir y qué esperar de vuelta.

Esa comunicación puede darse de dos maneras: directamente, entre clases y componentes de capas vecinas, o a través de una **interfaz predefinida**. La interfaz es la que más conviene: oculta los detalles internos y deja claro el contrato entre las partes.

## Ejemplos clásicos

No es una idea nueva — aparece en casi todo lo que está bien construido.

**Sistemas operativos.** En un sistema *monolítico*, los módulos se compilan por separado y luego se enlazan en un único ejecutable. En un *microkernel*, las tareas del SO se dividen en módulos servidores que giran en torno a un kernel central pequeño; cada módulo atiende una responsabilidad y habla con el núcleo.

**Redes.** El ejemplo más didáctico de todos. El modelo **OSI** describe siete capas — Aplicación, Presentación, Sesión, Transporte, Red, Enlace y Física. **TCP/IP**, más escueto y el que realmente corre en internet, usa cuatro: Aplicación, Transporte, Red y Enlace. En ambos, tu mensaje baja capa por capa hasta volverse señal en el cable y sube de nuevo del otro lado — exactamente el flujo del diagrama de arriba.

## Arquitectura lógica

Cuando diseñamos la arquitectura de un sistema, el primer corte es la **arquitectura lógica**: un modelo de bloques de los elementos principales — paquetes, interfaces, clases, subsistemas — y las relaciones entre ellos.

La meta aquí es que los subsistemas sean **independientes** entre sí. Cuanto menos dependa uno de los detalles internos del otro, mejor. Y es aquí donde las interfaces bien definidas vuelven a brillar: si el contrato está claro, puedes **cambiar un subsistema entero por otro** sin romper el resto. Es la diferencia entre reformar una habitación y tener que tirar la casa abajo.

## Arquitectura física

La arquitectura lógica dice *qué* existe; la **arquitectura física** dice *dónde* corre cada parte — cómo se distribuyen los elementos lógicos en las máquinas y servidores, la nube incluida.

El diseño más común es el de **tres capas físicas**:

- **Capa de presentación** — aloja la presentación, la interfaz con quien usa el sistema.
- **Capa intermedia** — lleva la lógica de la aplicación, muchas veces repartida en varios servidores para escalar.
- **Capa de datos** — guarda los datos de la aplicación, normalmente a través de un SGBD.

Observa que una misma arquitectura lógica puede tomar varias distribuciones físicas distintas según las necesidades de escala, costo y disponibilidad.

## Por qué importa

Al final, dividir el sistema en partes hace tres cosas por ti: **aclara los papeles** (cada parte tiene una responsabilidad clara), **mejora el control y la organización** del trabajo en equipo, y hace el software **más fácil de entender y mantener**. Una capa bien hecha es la que puedes abrir años después y todavía entender.

Escribí esto en 2021, pero la idea solo se volvió más vigente. Cuando hoy hablamos de *clean architecture* o de separar dominio, datos e interfaz en una app móvil, estamos aplicando exactamente el mismo principio: cada capa sirve a la de arriba, consume la de abajo y esconde sus detalles detrás de un contrato. La pantalla no sabe si el dato vino de una caché local o de una API — y es esa ignorancia, bien organizada, la que mantiene el código vivo por mucho tiempo.

> Dividir no es complicar. Es darle a cada parte un papel claro para que el todo tenga sentido.
