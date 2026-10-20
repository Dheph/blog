---
title: "Arquitetura em camadas: dividir para construir melhor"
date: 2021-01-26
tags: [arquitetura, fundamentos]
description: "Por que separar o sistema em camadas que fornecem e consomem serviços — do modelo OSI à arquitetura em três camadas físicas — e como isso deixa o software mais fácil de manter."
---

Sistemas grandes se constroem melhor em equipe. Mas trabalhar em equipe só funciona se o trabalho puder ser dividido — e dividir bem exige definir uma arquitetura: quem faz o quê, qual o papel de cada parte e como elas conversam. Sem isso, cada pessoa puxa o código para um lado e o resultado vira um emaranhado que ninguém entende.

Uma das formas mais antigas e mais úteis de organizar essa divisão é pensar em **camadas**.

<svg viewBox="0 0 720 380" style="width:100%;height:auto;max-width:720px;display:block;margin:1.5rem auto;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagrama de requisição descendo pelas camadas e resposta subindo">
  <!-- Camada: Apresentação -->
  <rect x="140" y="40" width="440" height="72" rx="10" stroke="var(--border)" fill="var(--bg-soft)">
    <animate attributeName="fill" values="var(--bg-soft);var(--bg-card);var(--bg-soft)" keyTimes="0;0.08;0.2" dur="8s" repeatCount="indefinite"/>
  </rect>
  <text x="360" y="72" text-anchor="middle" font-size="15" fill="var(--text)">Apresentação</text>
  <text x="360" y="92" text-anchor="middle" font-size="12" fill="var(--text-soft)">cliente da camada abaixo</text>

  <!-- Camada: Aplicação / Lógica -->
  <rect x="140" y="154" width="440" height="72" rx="10" stroke="var(--border)" fill="var(--bg-soft)">
    <animate attributeName="fill" values="var(--bg-soft);var(--bg-card);var(--bg-soft)" keyTimes="0;0.22;0.34" dur="8s" repeatCount="indefinite"/>
  </rect>
  <text x="360" y="186" text-anchor="middle" font-size="15" fill="var(--text)">Aplicação / Lógica</text>
  <text x="360" y="206" text-anchor="middle" font-size="12" fill="var(--text-soft)">serve acima, consome abaixo</text>

  <!-- Camada: Dados -->
  <rect x="140" y="268" width="440" height="72" rx="10" stroke="var(--border)" fill="var(--bg-soft)">
    <animate attributeName="fill" values="var(--bg-soft);var(--bg-card);var(--bg-soft)" keyTimes="0;0.36;0.48" dur="8s" repeatCount="indefinite"/>
  </rect>
  <text x="360" y="300" text-anchor="middle" font-size="15" fill="var(--text)">Dados</text>
  <text x="360" y="320" text-anchor="middle" font-size="12" fill="var(--text-soft)">servidor da camada acima</text>

  <!-- Rótulos de fluxo -->
  <text x="628" y="150" text-anchor="middle" font-size="12" fill="var(--text-faint)">requisição</text>
  <text x="628" y="166" text-anchor="middle" font-size="12" fill="var(--text-faint)">↓</text>
  <text x="92" y="150" text-anchor="middle" font-size="12" fill="var(--text-faint)">resposta</text>
  <text x="92" y="166" text-anchor="middle" font-size="12" fill="var(--text-faint)">↑</text>

  <!-- Pacote animado: desce (requisição) e sobe (resposta) em loop -->
  <circle r="9" fill="var(--accent)">
    <animate attributeName="cx" values="600;600;120;120" keyTimes="0;0.5;0.5;1" dur="8s" repeatCount="indefinite"/>
    <animate attributeName="cy"
      values="76;76;190;190;304;304;304;190;190;76;76"
      keyTimes="0;0.04;0.2;0.28;0.44;0.5;0.56;0.72;0.8;0.96;1"
      dur="8s" repeatCount="indefinite"/>
  </circle>
</svg>

## O que é uma camada

A ideia é simples: **cada camada fornece serviços para a camada acima e consome serviços da camada abaixo**. Nessa relação, quem fornece age como um *servidor* e quem consome age como um *cliente*. A camada de cima não precisa saber *como* a de baixo resolve o problema — só precisa saber o que pedir e o que esperar de volta.

Essa comunicação pode acontecer de duas formas: diretamente, entre classes e componentes de camadas vizinhas, ou através de uma **interface predefinida**. A interface é o que mais vale a pena: ela esconde os detalhes internos e deixa claro o contrato entre as partes.

## Exemplos clássicos

Essa não é uma ideia nova — ela aparece em quase tudo que é bem construído.

**Sistemas operacionais.** Num sistema *monolítico*, os módulos são compilados separadamente e depois ligados num único executável. Já num *microkernel*, as tarefas do SO são divididas em módulos servidores que giram em torno de um kernel central pequeno; cada módulo cuida de uma responsabilidade e conversa com o núcleo.

**Redes.** O exemplo mais didático de todos. O modelo **OSI** descreve sete camadas — Aplicação, Apresentação, Sessão, Transporte, Rede, Enlace e Física. O **TCP/IP**, mais enxuto e que roda na internet de verdade, usa quatro: Aplicação, Transporte, Rede e Enlace. Em ambos, sua mensagem desce camada por camada até virar sinal no fio e sobe de novo do outro lado — exatamente o fluxo do diagrama acima.

## Arquitetura lógica

Quando a gente desenha a arquitetura de um sistema, o primeiro recorte é a **arquitetura lógica**: um modelo de blocos dos elementos principais — pacotes, interfaces, classes, subsistemas — e as relações entre eles.

A meta aqui é que os subsistemas sejam **independentes** entre si. Quanto menos um depende dos detalhes internos do outro, melhor. E é aí que as interfaces bem definidas brilham de novo: se o contrato está claro, você consegue **trocar um subsistema inteiro por outro** sem quebrar o resto. É a diferença entre reformar um cômodo e precisar derrubar a casa.

## Arquitetura física

A arquitetura lógica diz *o que* existe; a **arquitetura física** diz *onde* cada parte roda — como os elementos lógicos são distribuídos nas máquinas e servidores, incluindo a nuvem.

O desenho mais comum é o de **três camadas físicas**:

- **Camada de apresentação** — hospeda a apresentação, a interface com quem usa o sistema.
- **Camada intermediária** — carrega a lógica da aplicação, muitas vezes espalhada por vários servidores para escalar.
- **Camada de dados** — guarda os dados da aplicação, normalmente através de um SGBD.

Repare que uma mesma arquitetura lógica pode ganhar várias distribuições físicas diferentes conforme a necessidade de escala, custo e disponibilidade.

## Por que isso importa

No fim, dividir o sistema em partes faz três coisas por você: **esclarece papéis** (cada parte tem uma responsabilidade clara), **melhora o controle e a organização** do trabalho em equipe, e torna o software **mais fácil de entender e manter**. Camada bem feita é camada que você consegue abrir anos depois e ainda entender.

Escrevi isto em 2021, mas a ideia só ficou mais atual. Quando falamos hoje de *clean architecture* ou de separar domínio, dados e UI num app mobile, estamos aplicando exatamente o mesmo princípio: cada camada serve a de cima, consome a de baixo e esconde seus detalhes atrás de um contrato. A tela não sabe se o dado veio de um cache local ou de uma API — e é essa ignorância, bem organizada, que deixa o código vivo por muito tempo.

> Dividir não é complicar. É dar a cada parte um papel claro para que o todo faça sentido.
