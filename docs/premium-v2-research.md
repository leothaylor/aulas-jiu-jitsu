# Premium V2 — pesquisa e decisões

Resumo das escolhas open-source e de design para a versão `premium-v2.html`.
Nada aqui altera o site principal (`index.*`) nem a prévia anterior (`premium.*`).

## Objetivo
Elevar a prévia `premium.html` (limpa, porém convencional: IntersectionObserver + grid
estático) para um nível editorial/premium — hero cinematográfico, tipografia oversized,
scroll-storytelling e galeria horizontal com parallax — mantendo a paleta e o tom.

## Bibliotecas avaliadas

| Lib | Decisão | Motivo |
|-----|---------|--------|
| **GSAP 3.12 + ScrollTrigger** (CDN) | **Usado** | Padrão de mercado para animação premium; `pin` + `scrub` para a galeria horizontal e parallax; roda em GitHub Pages sem build. |
| **Lenis** (smooth scroll) | **Descartado** | No histórico deste projeto o Lenis causou lentidão de rolagem no PC do usuário e foi removido do site principal. Mantemos **scroll nativo** (compositor) — fluido e sem risco. |
| **AOS** | Descartado | Reveals simples demais; o GSAP já cobre com mais controle. |
| **Motion One** | Descartado | Bom, porém sem o ecossistema de scroll (pin/scrub) do ScrollTrigger. |
| **Barba.js** | Descartado | Serve transições entre páginas; o site é one-page/estático. |

**Regra herdada:** scroll nativo + GSAP scrub. Sem Lenis.

## Técnicas de CSS/JS aplicadas
- **Tipografia editorial:** display **Fraunces** (serif variável, com caráter — não "luxo genérico") para títulos grandes, mantendo **Nunito** para corpo/UI (continuidade de marca). Títulos grandes na sálvia `#8a9e7e` (exigência do usuário).
- **Hero cinematográfico:** retrato em máscara arqueada (`border-radius`) + parallax (`scrub`), headline oversized com reveal por máscara de linha.
- **Scroll-storytelling (Método):** coluna sticky + passos com estado ativo destacado em teal conforme a rolagem.
- **Galeria horizontal pinada (Momentos):** `ScrollTrigger.pin` + translação X por `scrub`. Em touch/telas pequenas cai para **swipe horizontal nativo** (`overflow-x:auto` + scroll-snap).
- **Presença:** quote cinematográfico sobre foto escurecida (filtro + gradiente) com parallax.
- **Microinterações:** cursor customizado (desktop), botões magnéticos, preenchimento de botão no hover, underline animado na nav, textura de grão sutil (SVG noise).
- **Resiliência:** loader com failsafe por timer; tudo degrada com `prefers-reduced-motion` e sem GSAP (conteúdo nunca fica em branco).

## Paleta usada
`--paper #E2DFC8` · `--paper-2 #D9D6BD` · `--paper-3 #CFCCAE` · `--ink #2A2818` ·
`--ink-2 #5C5944` · `--sage #8a9e7e` (títulos) · `--teal #0A8F6F` · `--dark #171512`
(hero cinematográfico/contato) · `--red #C23B2E` (ponta da faixa no footer).

## Entregável
`premium-v2.html` publicado em GitHub Pages, paralelo — sem promover a `index.html`.
