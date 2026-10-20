---
title: "Ponytail: fazendo a IA escrever menos código (e melhor)"
date: 2026-10-20
tags: [ia, ferramentas, produtividade]
description: "Uma skill que faz o agente reaproveitar antes de criar. O melhor código é o que você não escreve — sem cortar validação, erro e segurança."
---

Tem uma coisa que todo mundo que usa agente de IA pra codar já percebeu: eles **adoram escrever código**. Você pede um seletor de data e o agente te entrega um calendário de 335 linhas, quando bastava reusar o input que já existe no projeto. Multiplique isso por um dia inteiro de trabalho e você tem uma base de código inchada, cheia de coisa pra manter e pra dar bug.

O [ponytail](https://github.com/dietrichgebert/ponytail) ataca exatamente isso. É uma skill (um prompt, basicamente) que muda como o agente pensa antes de escrever. O lema do projeto diz tudo: *o melhor código é o que você nunca escreveu.*

## O que é o ponytail

É um prompt open-source (licença MIT, site em ponytail.dev) que você instala no seu agente de IA. Ele fica **sempre ligado** e, antes de o agente sair digitando, obriga ele a fazer uma pergunta simples: *isso realmente precisa de código novo?*

O ponto importante — e que diferencia o ponytail de "só economizar token" — é que a meta **nunca foi escrever o mínimo de caracteres**. A regra é escrever só o que a tarefa precisa, mas **sem nunca cortar** validação, tratamento de erro, segurança e acessibilidade. Isso é o que separa "código enxuto" de "código capenga".

## Como funciona: a escada

Antes de escrever, o agente lê e entende o código que a mudança vai tocar. Aí ele sobe uma "escada" de perguntas e **para no primeiro degrau que resolve**:

<svg viewBox="0 0 720 440" style="width:100%;height:auto;max-width:720px;display:block;margin:1.5rem auto;" role="img" aria-label="Escada de decisão do ponytail: o agente para no primeiro degrau que resolve, aqui 'Já existe no projeto?'">
  <text x="360" y="26" text-anchor="middle" font-family="inherit" font-size="15" font-weight="600" fill="var(--text-soft)">A escada: pare no primeiro degrau que resolve</text>
  <g font-family="inherit" font-size="13">
    <g>
      <rect x="150" y="60" width="520" height="42" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
      <circle cx="128" cy="81" r="14" fill="var(--bg-card)" stroke="var(--border)"/>
      <text x="128" y="86" text-anchor="middle" fill="var(--text-soft)">1</text>
      <text x="172" y="86" fill="var(--text)">Precisa existir?</text>
    </g>
    <g>
      <rect x="150" y="110" width="520" height="42" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
      <circle cx="128" cy="131" r="14" fill="var(--bg-card)" stroke="var(--border)"/>
      <text x="128" y="136" text-anchor="middle" fill="var(--text-soft)">2</text>
      <text x="172" y="136" fill="var(--text)">Já existe no projeto?</text>
    </g>
    <g>
      <rect x="150" y="160" width="520" height="42" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
      <circle cx="128" cy="181" r="14" fill="var(--bg-card)" stroke="var(--border)"/>
      <text x="128" y="186" text-anchor="middle" fill="var(--text-soft)">3</text>
      <text x="172" y="186" fill="var(--text)">A biblioteca padrão resolve?</text>
    </g>
    <g>
      <rect x="150" y="210" width="520" height="42" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
      <circle cx="128" cy="231" r="14" fill="var(--bg-card)" stroke="var(--border)"/>
      <text x="128" y="236" text-anchor="middle" fill="var(--text-soft)">4</text>
      <text x="172" y="236" fill="var(--text)">Tem recurso nativo da plataforma?</text>
    </g>
    <g>
      <rect x="150" y="260" width="520" height="42" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
      <circle cx="128" cy="281" r="14" fill="var(--bg-card)" stroke="var(--border)"/>
      <text x="128" y="286" text-anchor="middle" fill="var(--text-soft)">5</text>
      <text x="172" y="286" fill="var(--text)">Alguma dependência já instalada?</text>
    </g>
    <g>
      <rect x="150" y="310" width="520" height="42" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
      <circle cx="128" cy="331" r="14" fill="var(--bg-card)" stroke="var(--border)"/>
      <text x="128" y="336" text-anchor="middle" fill="var(--text-soft)">6</text>
      <text x="172" y="336" fill="var(--text)">Dá pra ser uma linha?</text>
    </g>
    <g>
      <rect x="150" y="360" width="520" height="42" rx="9" fill="var(--bg-soft)" stroke="var(--border)"/>
      <circle cx="128" cy="381" r="14" fill="var(--bg-card)" stroke="var(--border)"/>
      <text x="128" y="386" text-anchor="middle" fill="var(--text-soft)">7</text>
      <text x="172" y="386" fill="var(--text)">O mínimo que funciona (+ teste)</text>
    </g>
    <rect x="150" y="110" width="520" height="42" rx="9" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2" opacity="0">
      <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.3;0.4;0.85;1" dur="6s" repeatCount="indefinite"/>
    </rect>
    <text x="650" y="135" text-anchor="end" fill="var(--accent)" font-weight="600" opacity="0">resolve aqui ✓
      <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.3;0.4;0.85;1" dur="6s" repeatCount="indefinite"/>
    </text>
    <g fill="var(--accent)">
      <polygon points="96,73 116,81 96,89"/>
      <animateTransform attributeName="transform" type="translate" values="0 0;0 50;0 50;0 0" keyTimes="0;0.3;0.85;1" dur="6s" repeatCount="indefinite"/>
    </g>
  </g>
</svg>

A escada completa, em ordem: **(1)** isso precisa existir? **(2)** já está no projeto? **(3)** a biblioteca padrão faz? **(4)** tem recurso nativo da plataforma? **(5)** alguma dependência instalada já resolve? **(6)** dá pra ser uma linha? **(7)** se nada disso, o mínimo que funciona — mais um teste pequeno quando a lógica tem condição, laço, parsing, dinheiro ou segurança.

No exemplo do seletor de data: em vez do calendário de 335 linhas, o agente para no degrau 2, reusa o `Input` do projeto com `type="date"` e entrega **10 linhas**. Mesmo resultado, uma fração do código.

E no fim de cada resposta o agente diz **o que deixou de fazer ou não checou** — você fica sabendo dos atalhos em vez de descobrir depois.

## Níveis de intensidade

Você regula o quanto ele aperta:

- **`lite`** — leve, só o essencial.
- **`full`** — o padrão.
- **`ultra`** — agressivo ao máximo em reaproveitar e cortar.
- **`off`** — desliga na sessão.

## Comandos

Além de ficar sempre ligado, ele traz comandos úteis:

| Comando | Pra quê |
|---|---|
| `/ponytail [lite \| full \| ultra \| off]` | Troca o nível ou desliga |
| `/ponytail-review` | Revisa o diff atual: bugs, segurança, carga, testes faltando, atalhos |
| `/ponytail-audit` | Revisa o repositório inteiro, priorizando o que importa |
| `/ponytail-debt` | Junta os comentários `shortcut:` num "livro-caixa" de dívida técnica |
| `/ponytail-gain` | Mostra o placar de impacto (código, tempo, custo economizados) |
| `/ponytail-help` | Referência rápida |
| `/ponytail band [on \| off \| import]` | Só no Claude Code: barra de status acima do prompt |

## Como instalar e usar

### No Claude Code

Dois comandos:

```bash
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail
```

É o host com suporte **completo**: todos os comandos, mais o **band** — uma barra acima do prompt mostrando custo, tokens, tempo do agente, reaproveitamento de código e status dos testes em tempo real. O band pede Claude Code **2.1.290+** e não aparece no painel de chat do VS Code, em sessões na nuvem nem no `claude -p`.

### No Codex

```bash
codex plugin marketplace add DietrichGebert/ponytail
codex plugin add ponytail@ponytail
```

Depois abra `/hooks`, **confie nos dois hooks de ciclo de vida** e comece uma thread nova. No Codex os comandos são chamados como skills, no formato `$ponytail:ponytail-review`.

### No Antigravity

O Antigravity funciona de dois jeitos:

- **Antigravity CLI** — é um host "skill-capable", então você instala a skill e ganha o conjunto completo de comandos.
- **No restante (fallback)** — você copia o arquivo **`AGENTS.md`** do repositório pra dentro do seu projeto. Aí o ruleset fica sempre ligado (o agente reaproveita antes de criar), mas **sem os comandos** (`/ponytail-review` etc.).

### Em qualquer outro agente

Copie o `AGENTS.md` pro seu projeto, ou peça pro agente instalar o `skills/ponytail/SKILL.md`. O `INSTALL.md` do repo tem o passo a passo pra Copilot, Cursor, OpenCode, Gemini e vários outros — são uns 20 agentes no total. Instale **só** do repositório oficial no GitHub ou do pacote npm `@dietrichgebert/ponytail`.

## Configuração

Não precisa configurar nada — funciona na instalação. Se quiser, dá pra fixar o nível padrão num `~/.config/ponytail/config.json` ou na variável de ambiente `PONYTAIL_DEFAULT_MODE`.

## Os números (com uma pitada de ceticismo)

O autor publicou um benchmark da versão 5, rodado no Claude Code com Opus 5.5, em 39 tarefas (incluindo um repo real de FastAPI + React), 5 execuções cada. Comparando o mesmo agente com e sem a skill:

- **−53%** de código, **−41%** de tempo, **−26%** de custo, **−45%** de tokens.
- **98%** da lógica arriscada saiu com teste (contra 68% sem o ponytail).
- Os testes do próprio agente pegaram **66%** dos bugs injetados (contra 46%).
- Nas 6 tarefas de segurança, passou nas 30 execuções.

São números do próprio projeto, então encare como indicativo, não como lei — o seu caso pode variar bastante. Ainda assim, a direção faz sentido: menos código quase sempre significa menos bug e menos manutenção.

## Vantagens

- **Menos código pra manter e pra dar errado.** É o benefício que se paga sozinho com o tempo.
- **Reaproveita o que já existe** — stdlib, recurso nativo, componente do projeto, dependência instalada — em vez de reinventar.
- **Não corta o que importa.** Validação, erro, segurança e acessibilidade ficam de fora da tesoura, de propósito.
- **Mais teste onde é arriscado** e um review/audit embutido pra pegar o que escapou.
- **Transparência:** ele te diz o que deixou de fazer no fim de cada resposta.
- **Portátil e grátis:** MIT, roda em ~20 agentes, instalação de dois comandos.

## Desvantagens e limites

- **Os benchmarks são do autor.** Resultado honesto, mas sem auditoria independente — ajuste a expectativa.
- **O band é só do Claude Code** (e ainda exige 2.1.290+). Em outros hosts você perde essa visão em tempo real.
- **Hosts "instruction-only"** (regras do Cursor, Windsurf, Cline, Copilot, Kiro e o fallback `AGENTS.md` do Antigravity) só ganham a regra sempre-ligada, **sem os comandos**.
- **No Codex** você precisa confiar nos hooks na mão — um passo a mais.
- **É uma heurística, não mágica.** Depende de o agente seguir o prompt. Às vezes ele reusa algo que não encaixa bem, ou fica conservador demais no `ultra`. Revisar continua sendo seu trabalho.
- **Adiciona uma camada de decisão** a cada tarefa. Na prática é barato, mas existe.

## Vale a pena?

Pra mim, sim — e o custo de experimentar é quase zero. Instala, deixa no `full`, e nas primeiras tarefas você já sente o agente **perguntar antes de inventar**. Se achar que ele está tímido demais, sobe pra `ultra`; se quiser ele mais solto num protótipo, `lite` ou `off`. A filosofia por trás (YAGNI, reaproveitar, não cortar o essencial) é a mesma que todo dev sênior carrega — o ponytail só faz o agente lembrar dela em toda tarefa.

Repositório: [github.com/dietrichgebert/ponytail](https://github.com/dietrichgebert/ponytail).
