---
title: "Tecnologías de transmisión en redes: difusión y punto a punto"
date: 2021-01-26
tags: [redes, fundamentos]
description: "Clasifico las redes por tecnología de transmisión y por escala — y muestro, con un diagrama animado, la diferencia entre difusión y punto a punto."
---

Cuando hablamos de "red", solemos pensar enseguida en el cable, el Wi-Fi o la nube. Pero antes de todo eso hay una pregunta más básica: **¿cómo salen los bits de una máquina y llegan a otra?** Hay dos formas clásicas de mirar este problema, y entender las dos me ayudó mucho a tomar mejores decisiones en el día a día. Voy a clasificar las redes de dos maneras: por **tecnología de transmisión** y por **escala**.

## Por tecnología de transmisión

Aquí la división es entre dos tipos de enlace.

### Enlaces de difusión (broadcast)

En un enlace de difusión, **todas las máquinas comparten un único canal de comunicación**. Cuando una máquina pone un paquete en ese canal, el paquete llega a todas las demás. Para que esto funcione, cada paquete lleva un **campo de dirección** que dice para quién es. Cada máquina que recibe el paquete mira esa dirección: si es para ella, lo procesa; si no, simplemente lo ignora y lo descarta.

La analogía que uso es la de alguien gritando un nombre en una sala llena: la voz llega a todos, pero solo la persona llamada responde. Los demás lo oyen y siguen con lo suyo.

Este modelo también permite dos trucos útiles:

- **Broadcasting**: existe un código de dirección especial que, al usarse, hace que el paquete se entregue y sea procesado por **todas** las máquinas del canal a la vez.
- **Multicasting**: algunos sistemas pueden dirigir el paquete a un **subconjunto** de las máquinas — ni una sola, ni todas, sino un grupo.

### Enlaces punto a punto

En el otro extremo están los enlaces punto a punto. Aquí las máquinas se conectan en **pares**. Para que un paquete salga del origen y llegue al destino, puede necesitar **pasar por una o más máquinas intermedias** en el camino. Y como casi siempre hay más de una ruta posible, la **selección de ruta** pasa a importar mucho: elegir bien el trayecto es parte esencial de su funcionamiento.

Una regla práctica: las redes **más pequeñas**, localizadas, suelen usar difusión — es simple y barato tirar todo en el mismo canal. Las redes **más grandes** suelen ser punto a punto, con transmisión **unicast** (un emisor, un receptor bien definido). Hay excepciones en ambos lados, pero esa es la tendencia general.

<svg viewBox="0 0 720 330" style="width:100%;height:auto;max-width:720px;display:block;margin:1.5rem auto;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagrama comparando difusión y punto a punto">
  <text x="190" y="30" text-anchor="middle" font-size="15" font-weight="600" fill="var(--text)">Difusión (broadcast)</text>
  <text x="540" y="30" text-anchor="middle" font-size="15" font-weight="600" fill="var(--text)">Punto a punto</text>
  <line x1="360" y1="48" x2="360" y2="288" stroke="var(--border)" stroke-width="1.5" stroke-dasharray="5 6"/>

  <!-- PANEL DIFUSIÓN -->
  <line x1="70" y1="180" x2="310" y2="180" stroke="var(--border)" stroke-width="2"/>
  <circle cx="70" cy="180" r="18" fill="none" stroke="var(--accent)" stroke-width="2">
    <animate attributeName="r" values="18;95" dur="2s" begin="0s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.5;0" dur="2s" begin="0s" repeatCount="indefinite"/>
  </circle>
  <circle cx="70" cy="180" r="18" fill="none" stroke="var(--accent)" stroke-width="2">
    <animate attributeName="r" values="18;95" dur="2s" begin="0.66s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.5;0" dur="2s" begin="0.66s" repeatCount="indefinite"/>
  </circle>
  <circle cx="70" cy="180" r="18" fill="none" stroke="var(--accent)" stroke-width="2">
    <animate attributeName="r" values="18;95" dur="2s" begin="1.33s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.5;0" dur="2s" begin="1.33s" repeatCount="indefinite"/>
  </circle>

  <circle cx="160" cy="180" r="18" fill="var(--bg-card)" stroke="var(--border)" stroke-width="2"/>
  <circle cx="310" cy="180" r="18" fill="var(--bg-card)" stroke="var(--border)" stroke-width="2"/>
  <circle cx="235" cy="180" r="18" fill="var(--bg-soft)" stroke="var(--accent)" stroke-width="2.5">
    <animate attributeName="stroke-width" values="2.5;4;2.5" dur="2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="70" cy="180" r="18" fill="var(--bg-card)" stroke="var(--border)" stroke-width="2"/>

  <circle r="5" fill="var(--accent)">
    <animateMotion path="M70,180 L160,180" dur="2s" repeatCount="indefinite"/>
  </circle>
  <circle r="5" fill="var(--accent)">
    <animateMotion path="M70,180 L235,180" dur="2s" repeatCount="indefinite"/>
  </circle>
  <circle r="5" fill="var(--accent)">
    <animateMotion path="M70,180 L310,180" dur="2s" repeatCount="indefinite"/>
  </circle>

  <text x="70" y="218" text-anchor="middle" font-size="12" fill="var(--text-soft)">emisor</text>
  <text x="235" y="218" text-anchor="middle" font-size="12" fill="var(--accent)">destinatario</text>
  <text x="190" y="305" text-anchor="middle" font-size="12" fill="var(--text-soft)">Un canal compartido — todos reciben, solo el destinatario responde</text>

  <!-- PANEL PUNTO A PUNTO -->
  <polyline points="410,120 500,210 590,110 680,200" fill="none" stroke="var(--border)" stroke-width="2"/>
  <circle cx="410" cy="120" r="18" fill="var(--bg-card)" stroke="var(--border)" stroke-width="2"/>
  <circle cx="500" cy="210" r="18" fill="var(--bg-card)" stroke="var(--border)" stroke-width="2"/>
  <circle cx="590" cy="110" r="18" fill="var(--bg-card)" stroke="var(--border)" stroke-width="2"/>
  <circle cx="680" cy="200" r="18" fill="var(--bg-soft)" stroke="var(--accent)" stroke-width="2.5">
    <animate attributeName="stroke-width" values="2.5;4;2.5" dur="3.5s" repeatCount="indefinite"/>
  </circle>

  <circle r="5" fill="var(--accent)">
    <animateMotion path="M410,120 L500,210 L590,110 L680,200" dur="3.5s" repeatCount="indefinite"/>
  </circle>

  <text x="410" y="158" text-anchor="middle" font-size="12" fill="var(--text-soft)">emisor</text>
  <text x="680" y="238" text-anchor="middle" font-size="12" fill="var(--accent)">destino</text>
  <text x="540" y="305" text-anchor="middle" font-size="12" fill="var(--text-soft)">El paquete salta de nodo en nodo hasta el destino</text>
</svg>

## Por escala

La segunda forma de clasificar es por el **tamaño físico** de la red — la distancia que cubre. Esto importa porque técnicas diferentes sirven a escalas diferentes: lo que funciona dentro de una sala no funciona entre ciudades.

- **PAN** (Personal Area Network): la más pequeña de todas, a la escala de una persona. El ejemplo clásico es el ratón inalámbrico hablando con la computadora.
- **LAN** (Local Area Network): red local, de una habitación, piso o edificio.
- **MAN** (Metropolitan Area Network): escala metropolitana, cubriendo una ciudad.
- **WAN** (Wide Area Network): geográficamente distribuida, cubriendo regiones, países o continentes.

Cuando conectas dos o más redes, surge una **interred**. El ejemplo de interred más grande y conocido del mundo es la **Internet**.

## Por qué esto importa en la práctica

Puede sonar a teoría lejana, pero uso estos conceptos todo el tiempo. Cuando una app mía depende de descubrir dispositivos en la red local, cuento con la **difusión** (broadcast/multicast) para encontrar quién está cerca. Cuando habla con una API del otro lado del mundo, eso es **punto a punto**, con el paquete saltando por varios routers hasta llegar — y la ruta puede cambiar, la latencia varía, y conviene que el código esté preparado para eso.

Entender si el tráfico es compartido o dedicado, y a qué escala ocurre, cambia la forma de diseñar los timeouts, los reintentos y la caché. Al final, una red no es magia: son bits viajando por un canal, y saber **cuál** canal marca toda la diferencia.
