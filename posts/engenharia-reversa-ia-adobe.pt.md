---
title: "Engenharia reversa com IA: a Adobe morreu?"
date: 2026-10-20
tags: [ia, opiniao, engenharia-reversa]
description: "A IA barateou muito a engenharia reversa, mas não é botão de clonar. O valor da Adobe mora onde o binário não alcança."
---

> Esse texto nasceu de uma análise do Fabio Akita sobre o tema — [AI Reverse Engineering: Is Adobe Dead?](https://akitaonrails.github.io/en/2026/10/13/ai-reverse-engineering-is-adobe-dead/). A tese é a mesma; as palavras e os exemplos abaixo são a minha leitura, de dev que vive de entregar software.

Nas últimas semanas a timeline explodiu de novo com o mesmo refrão de sempre: "programação acabou". Dessa vez o estopim foram clones open-source de produtos da Adobe escritos em Rust e montados com ajuda de IA — um tal de "PhotoCraft" parecido com Photoshop, projetos que entregam a agentes acesso direto a disassemblers e decompiladores, e uma onda de ports de jogos retrô. A conclusão apressada veio no automático: se dá pra reconstruir qualquer binário com um agente, então todo software é reutilizável e a Adobe está morta.

Eu queria que fosse tão simples. Mas quem já abriu um binário na unha sabe que a história é mais chata — e mais interessante — do que o tweet promete.

## A IA acelerou o braçal, não aboliu o difícil

Vou começar concordando com metade do hype: a IA **barateou muito** a engenharia reversa. Isso é real e importante. O que antes era semana de trabalho mecânico — ler montanha de assembly, batizar função por função, inferir estruturas de dados — hoje um modelo faz em horas, com uma qualidade que teria me assustado há três anos.

Só que "barateou o braçal" não é o mesmo que "resolveu o problema". E é aí que a leitura apressada tropeça. Engenharia reversa tem etapas bem distintas, e a IA só brilha em algumas:

- **Desmontar** (binário → assembly): mecânico, determinístico. A máquina sempre fez bem, agora faz instantâneo.
- **Decompilar** (assembly → pseudocódigo): ruidoso. Sai um C que compila, mas horroroso, cheio de `sub_401A20` e variáveis sem nome.
- **Recuperar nomes e tipos**: aqui mora o trabalho humano de verdade. Nomes não estão no binário. Eles foram jogados fora pelo compilador. Reconstruir o *significado* é inferência, não decodificação.
- **Refatorar**: transformar aquilo em código que um time mantém. Difícil com ou sem IA.

Os decompiladores neurais de hoje chegam a algo como 60–65% de correção funcional em funções isoladas. É muito para um rascunho; é pouco para confiar cego. E tem uma armadilha silenciosa: quando você passa a saída crua de um decompilador por um LLM pra "limpar", vulnerabilidades podem simplesmente *sumir* no meio do caminho — o modelo "arruma" um comportamento que, na verdade, era o bug. Você acha que entendeu o programa; entendeu uma paráfrase dele.

## Isto não é novo — e esse detalhe importa

Outra coisa que o hype apaga: engenharia reversa é uma disciplina **madura**, não uma invenção dos agentes. A BIOS do IBM PC foi reimplementada de forma limpa lá em 1982. O Samba leu o protocolo da Microsoft na marra. O Wine roda executável de Windows até hoje. Emuladores existem há décadas. O Ghidra, a ferramenta que destravou boa parte dessa onda, foi aberto pela NSA em 2019. A febre de decompilação e recompilação começou **antes** dos agentes de IA — a IA pegou um trem que já estava andando e só acelerou o vagão.

Isso muda o enquadramento. A pergunta certa não é "a IA tornou possível o impossível?", e sim "quanto a IA baixou o custo do que já era possível?". A resposta honesta: baixou bastante no fácil, pouco no caro.

## As ferramentas são caixa de ferramenta, não botão de clonar

Os projetos que viralizaram — tipo um "REA" que dá ao agente acesso a disassembler — são caixas de ferramentas poderosas, não um botão de "clonar produto". Eles ainda exigem o binário rodando na *sua* máquina, ferramentas pagas na cadeia, e um orçamento de tokens que faria qualquer gerente de produto suar. Automatizam o tedioso; não substituem o engenheiro que decide o que importa.

E os clones da Adobe? São alphas iniciais, e dá pra ver. Lista de issues aberta do tamanho de um braço, gestão de memória que engasga em imagem grande, gestão de cor fraca, compatibilidade de PSD capenga. É carroceria de Ferrari com motor de Fusca: a tela se parece, a demo impressiona, mas abra um arquivo de produção de verdade e a diferença aparece na primeira camada de ajuste.

## O valor da Adobe mora onde o binário não alcança

Aqui está o ponto que o "a Adobe morreu" ignora: a parte valiosa do produto **não está no binário**. Você pode decompilar o executável inteiro e ainda não ter nada do que realmente segura o cliente:

- Os recursos **generativos** rodam na **nuvem** da Adobe, em modelos e pesos que ninguém vai desmontar do seu desktop.
- Os perfis de lente e de cor do **Camera RAW** são ~20 anos de calibração medida no mundo real, câmera por câmera.
- **Ciência de cor para impressão** — CMYK, perfis ICC — é décadas de trabalho; o GIMP persegue isso há anos e ainda não terminou.
- As bibliotecas **Pantone** são proprietárias e licenciadas. Não se "engenharia-reversa" um contrato.
- As transformações de cor usadas em cinema dependem de SDKs e de acordos com fabricantes. Isso é relação comercial, não bytes.

Nada disso vaza no disassembly. É conhecimento, dado licenciado e relacionamento — exatamente o que um decompilador não vê.

## Alvo em movimento, e às vezes nem há binário

Tem ainda o problema do **alvo em movimento**. O formato `.doc` antigo da Microsoft levou mais de uma década para ser documentado por engenharia reversa — e quando documentaram, o mercado já tinha virado para outros formatos. Você venceu uma guerra que ninguém mais estava lutando.

E o software moderno comercial costuma ser **SaaS**. Muitas vezes não existe binário para analisar: a lógica que importa roda num servidor que você nunca toca. Não dá pra desmontar o que você não tem.

<svg viewBox="0 0 720 236" style="width:100%;height:auto;max-width:720px;display:block;margin:1.5rem auto;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pipeline de engenharia reversa parando numa barreira de nuvem, dados licenciados e ciência de cor">
  <defs>
    <marker id="arw-pt" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="var(--text-faint)"/>
    </marker>
  </defs>
  <text x="263" y="28" text-anchor="middle" font-size="13" fill="var(--text-soft)">Pipeline de engenharia reversa</text>

  <rect x="12" y="84" width="112" height="56" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
  <text x="68" y="116" text-anchor="middle" font-size="13" fill="var(--text)">binário</text>

  <rect x="142" y="84" width="112" height="56" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
  <text x="198" y="116" text-anchor="middle" font-size="13" fill="var(--text)">desmontar</text>

  <rect x="272" y="84" width="112" height="56" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
  <text x="328" y="116" text-anchor="middle" font-size="13" fill="var(--text)">decompilar</text>

  <rect x="402" y="84" width="112" height="56" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
  <text x="458" y="108" text-anchor="middle" font-size="12" fill="var(--text)">recuperar nomes</text>
  <text x="458" y="124" text-anchor="middle" font-size="12" fill="var(--text)">e tipos</text>

  <line x1="124" y1="112" x2="140" y2="112" stroke="var(--text-faint)" stroke-width="2" marker-end="url(#arw-pt)"/>
  <line x1="254" y1="112" x2="270" y2="112" stroke="var(--text-faint)" stroke-width="2" marker-end="url(#arw-pt)"/>
  <line x1="384" y1="112" x2="400" y2="112" stroke="var(--text-faint)" stroke-width="2" marker-end="url(#arw-pt)"/>
  <line x1="514" y1="112" x2="544" y2="112" stroke="var(--text-faint)" stroke-width="2" marker-end="url(#arw-pt)"/>

  <rect x="548" y="44" width="160" height="140" rx="12" fill="var(--bg-card)" stroke="var(--accent)" stroke-width="2"/>
  <rect x="548" y="44" width="160" height="140" rx="12" fill="var(--accent)" opacity="0">
    <animate attributeName="opacity" dur="4.5s" repeatCount="indefinite" values="0;0;0.35;0;0" keyTimes="0;0.52;0.57;0.66;1"/>
  </rect>
  <path d="M619,74 v-6 a9,9 0 0 1 18,0 v6" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
  <rect x="615" y="74" width="26" height="20" rx="3" fill="var(--accent)"/>
  <text x="628" y="122" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">NUVEM</text>
  <text x="628" y="142" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">DADOS LICENCIADOS</text>
  <text x="628" y="162" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">CIÊNCIA DE COR</text>

  <g>
    <circle r="12" fill="var(--accent)"/>
    <text y="4" text-anchor="middle" font-size="10" font-weight="700" fill="var(--bg-card)">IA</text>
    <animateMotion dur="4.5s" repeatCount="indefinite" calcMode="linear" keyPoints="0;1;0.9;0.9" keyTimes="0;0.55;0.66;1" path="M 68,112 L 534,112"/>
  </g>

  <text x="360" y="214" text-anchor="middle" font-size="13" fill="var(--text-soft)">A IA chega até aqui — não além.</text>
</svg>

## O caso Bun mostra o preço real

Se quer uma régua do custo de reescrever software sério, olhe o Bun migrando de Zig para Rust: foi algo como **US$ 165 mil em chamadas de API**, 64 agentes rodando em paralelo, o código-fonte completo de referência em mãos, uma suíte de testes com mais de um milhão de asserções, e — detalhe que ninguém cita — o autor original dirigindo o processo o tempo todo. Esse é o cenário *mais fácil possível*: você tem o fonte, você tem os testes, você conhece o domínio. Mesmo assim, custou uma fortuna.

Agora imagine clonar o Photoshop sem fonte, sem testes, sem o autor, e com tudo que importa escondido na nuvem. O luxo do Bun simplesmente não existe aí.

## Por que os ports retrô funcionam (e isso não generaliza)

Então por que os ports de jogos antigos deram certo? Porque é o cenário dos sonhos para engenharia reversa:

- **Binários minúsculos.** Super Mario 64 tem uns 8 MB. Baldur's Gate 3 passa de 150 GB. Escala muda tudo.
- **Hardware antigo e documentado.** O alvo está parado há décadas; a comunidade já mapeou quase tudo.
- **Alvo que não muda.** O cartucho não recebe update. Você não está mirando um rio.
- **Precedentes legais já resolvidos.** O terreno jurídico desses casos antigos está relativamente firme.

E os consoles modernos já são x86 ou ARM — não precisa nem emular CPU. Mas repare: as arquiteturas difíceis continuam difíceis. O Cell do PS3 e o PowerPC do Xbox 360 seguem sendo um inferno. **Arquitetura importa**, e nenhum agente apaga isso.

## Sobre o "crescimento exponencial"

Vale um puxão de orelha no gráfico mental de "cai pela metade todo mês". O preço de fronteira caiu de forma modesta. O custo por **qualidade fixa** caiu mais — você paga menos hoje pelo mesmo nível de resultado. Mas a conta de um clone grande **começa alta**, e dividir uma conta alta por dois várias vezes ainda dá uma conta alta por um bom tempo. Exponencial no slide, linear no boleto.

## Minha conclusão, como dev

Junto tudo e chego num lugar bem menos dramático que a timeline. A IA **reduziu o custo** da engenharia reversa, de verdade — sobretudo no retrô, onde o binário é pequeno, o hardware é documentado e o alvo está congelado. Para produtos comerciais vivos, o que vale está na nuvem, em dados licenciados, em relações com fabricantes e em décadas de conhecimento especializado que nenhum disassembler enxerga.

Engenharia reversa continua sendo **trabalho de engenharia**. "Programação morreu" não se sustenta — a cada ciclo de hype ela ressuscita e a cada ciclo ela erra pela mesma razão: confunde o passo barato com o problema inteiro.

E, sinceramente, isso me deixa otimista. Se a parte braçal ficou barata, sobra mais tempo pro trabalho que sempre foi o nosso: decidir o que importa, modelar o domínio, cuidar da qualidade. Como dev, vejo muito caminho pela frente pra engenharia de software com IA — só não é o caminho de apertar um botão e clonar a Adobe.
