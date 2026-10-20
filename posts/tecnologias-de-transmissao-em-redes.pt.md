---
title: "Tecnologias de transmissão em redes: difusão e ponto a ponto"
date: 2021-01-26
tags: [redes, fundamentos]
description: "Classifico redes por tecnologia de transmissão e por escala — e mostro, com um diagrama animado, a diferença entre difusão e ponto a ponto."
---

Quando a gente fala de "rede", costuma pensar logo em cabo, Wi-Fi ou na nuvem. Mas antes de tudo isso existe uma pergunta mais básica: **como os bits saem de uma máquina e chegam na outra?** Tem duas formas clássicas de olhar para esse problema, e entender as duas me ajudou muito a tomar decisões melhores no dia a dia. Vou classificar redes de dois jeitos: pela **tecnologia de transmissão** e pela **escala**.

## Pela tecnologia de transmissão

Aqui a divisão é entre dois tipos de enlace.

### Enlaces de difusão (broadcast)

Num enlace de difusão, **todas as máquinas compartilham um único canal de comunicação**. Quando uma máquina coloca um pacote nesse canal, o pacote chega a todas as outras. Para isso funcionar, cada pacote carrega um **campo de endereço** dizendo para quem ele é. Toda máquina que recebe o pacote olha esse endereço: se for para ela, processa; se não for, simplesmente ignora e descarta.

A analogia que uso é a de alguém gritando um nome numa sala cheia: a voz chega a todo mundo, mas só a pessoa chamada responde. Os outros ouvem e seguem a vida.

Esse modelo também permite dois truques úteis:

- **Broadcasting**: existe um código de endereço especial que, quando usado, faz o pacote ser entregue e processado por **todas** as máquinas do canal de uma vez.
- **Multicasting**: alguns sistemas conseguem endereçar o pacote a um **subconjunto** das máquinas — nem uma só, nem todas, mas um grupo.

### Enlaces ponto a ponto

No outro extremo estão os enlaces ponto a ponto. Aqui as máquinas são conectadas em **pares**. Para um pacote sair da origem e chegar ao destino, ele pode precisar **passar por uma ou mais máquinas intermediárias** no caminho. E, como quase sempre existe mais de um caminho possível, a **seleção de rota** passa a importar muito: escolher bem o trajeto é parte essencial do funcionamento.

Uma regra prática: redes **menores**, localizadas, tendem a usar difusão — é simples e barato jogar tudo no mesmo canal. Já redes **maiores** costumam ser ponto a ponto, com transmissão **unicast** (um emissor, um receptor bem definido). Existem exceções nos dois lados, mas essa é a tendência geral.

<svg viewBox="0 0 720 330" style="width:100%;height:auto;max-width:720px;display:block;margin:1.5rem auto;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagrama comparando difusão e ponto a ponto">
  <text x="190" y="30" text-anchor="middle" font-size="15" font-weight="600" fill="var(--text)">Difusão (broadcast)</text>
  <text x="540" y="30" text-anchor="middle" font-size="15" font-weight="600" fill="var(--text)">Ponto a ponto</text>
  <line x1="360" y1="48" x2="360" y2="288" stroke="var(--border)" stroke-width="1.5" stroke-dasharray="5 6"/>

  <!-- PAINEL DIFUSÃO -->
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

  <text x="70" y="218" text-anchor="middle" font-size="12" fill="var(--text-soft)">emissor</text>
  <text x="235" y="218" text-anchor="middle" font-size="12" fill="var(--accent)">alvo</text>
  <text x="190" y="305" text-anchor="middle" font-size="12" fill="var(--text-soft)">Um canal compartilhado — todos recebem, só o alvo responde</text>

  <!-- PAINEL PONTO A PONTO -->
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

  <text x="410" y="158" text-anchor="middle" font-size="12" fill="var(--text-soft)">emissor</text>
  <text x="680" y="238" text-anchor="middle" font-size="12" fill="var(--accent)">destino</text>
  <text x="540" y="305" text-anchor="middle" font-size="12" fill="var(--text-soft)">O pacote salta de nó em nó até o destino</text>
</svg>

## Pela escala

A segunda forma de classificar é pelo **tamanho físico** da rede — a distância que ela cobre. Isso importa porque técnicas diferentes servem a escalas diferentes: o que funciona dentro de uma sala não funciona entre cidades.

- **PAN** (*Personal Area Network*): a menor delas, na escala de uma pessoa. O exemplo clássico é o mouse sem fio conversando com o computador.
- **LAN** (*Local Area Network*): rede local, de um cômodo, andar ou prédio.
- **MAN** (*Metropolitan Area Network*): escala metropolitana, cobrindo uma cidade.
- **WAN** (*Wide Area Network*): geograficamente distribuída, cobrindo regiões, países ou continentes.

Quando você conecta duas ou mais redes, surge uma **inter-rede**. O maior e mais conhecido exemplo de inter-rede do mundo é a **Internet**.

## Por que isso importa na prática

Pode parecer teoria distante, mas eu uso esses conceitos direto. Quando um app meu depende de descoberta de dispositivos na rede local, estou contando com **difusão** (broadcast/multicast) para achar quem está por perto. Quando ele fala com uma API do outro lado do mundo, é **ponto a ponto**, com o pacote saltando por vários roteadores até chegar lá — e a rota pode mudar, a latência varia, e é bom o código estar preparado para isso.

Entender se o tráfego é compartilhado ou dedicado, e em que escala ele acontece, muda o jeito de desenhar timeout, retry e cache. No fim, rede não é mágica: é bit viajando por um canal, e saber **qual** canal faz toda a diferença.
