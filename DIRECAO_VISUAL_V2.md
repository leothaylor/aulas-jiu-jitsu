# Direção Visual V2 — Portfólio BJJ Leo Thaylor

> Estado: **DIREÇÃO APROVADA (GATE 2)** — recalibrada em 2026-08-21. Próximo: FASE 6 (ferramenta de layout). Sem código ainda.
> **CORREÇÃO do Leo:** reinventar a ESTRUTURA GERAL do site guiada pelas referências. Fixos apenas **fotos reais + paleta**. Estrutura, seções, navegação, layout, ritmo e **tipografia** ficam LIVRES.
> Decisões (GATE 1 + 2): estrutura "Cena a cena" imersiva · **intensidade = imersivo porém escaneável** · **HERO 3D REJEITADO e REMOVIDO** (Leo achou as 2 variantes feias/sem sentido em 21/08 — hero é FOTO) · **Área do Aluno: redesenhar junto (depois da pública)** · **WhatsApp = CTA único dominante** · tipografia com display editorial expressivo (Nunito não é mais obrigatória).
> Travado: paleta (caqui #e2dfc8 / sage #8a9e7e / teal #0a8f6f / vermelho #c23b2e / tinta #2a2818 / dark #171512) + fotos reais. Regra de performance: **Perf ≥ 95 / LCP ≤ 2,5s** (abre rápido vindo do Instagram).

## Estrutura nova aprovada — "Cena a cena" (imersivo escaneável)
1. **Abertura** (Lusion+Active Theory) — nome, faixa-preta, posicionamento, foto full-bleed + objeto 3D isolado + WhatsApp.
2. **O Professor** (Alejandro Schintu) — quem é Leo, filosofia, Trion.
3. **Para quem é** (Righteous Creative) — iniciantes, retorno, crianças; tirar o medo.
4. **A primeira aula** (Iventions) — passo a passo imersivo (coração da conversão).
5. **O tatame / Momentos** (Schintu+Unseen) — galeria horizontal com fotos reais, fundo integrado.
6. **Começar** — mapa + WhatsApp dominante + entrada "já é aluno? Área do Aluno".
Nav minimalista imersiva (marca + "Agendar" fixo + menu discreto), não a navbar de 6 links.

## CONCEITO
"Dojo Editorial quente" — marca pessoal de um professor faixa-preta: acolhedor, técnico, com autoridade calma. Editorial (tipografia + foto + espaço) no espírito de **Alejandro Schintu**, com dinâmica entre seções de **Righteous Creative**, e **um** momento de profundidade 3D no hero (linguagem de **Lusion/Unseen**, reinterpretada leve — o TRIONN agradou mas é pesado). Nada de estética coach/agência/campeonato.

## REFERÊNCIAS (mecanismo, não cópia)
- **Alejandro Schintu** → estrutura de marca pessoal, galeria horizontal, microanimações, legibilidade.
- **Righteous Creative** → seções que mudam de estado, transição entre blocos.
- **Lusion** → profundidade/ilusão nas transições (contido).
- **Unseen Studio** → objeto/à profundidade integrada ao layout (só o hero).
- Descartado de propósito: WebGL pesado contínuo, shaders por toda a página (Leo reprovou por travar).

## HERO
- Foto do Leo (autoridade) grande, **otimizada** (AVIF/WebP responsivo + `preload` do LCP) — resolve o LCP 6,3s atual.
- Headline com `SplitText` (revelação por linha) + subtítulo "para quem é" (iniciantes, retorno, crianças).
- **Objeto 3D isolado** ao lado/atrás do bloco — NÃO um busto genérico de agência; motivos BJJ candidatos: **faixa-preta com ponta vermelha** (usa `--red`), forma de **tatame em relevo**, ou emblema Trion em baixo-relevo. Carregado em **idle, só desktop, WebGL disponível**; **mobile e reduced-motion recebem WebP estático** do mesmo enquadramento. Meta de orçamento (já provada no Arsenal): **Perf ≥ 95 / LCP ≤ 2,5s / TBT baixo / CLS 0**.
- CTA WhatsApp dominante já na primeira dobra.

## TIPOGRAFIA
- Base **Nunito** preservada (rounded, acolhedora). Opcional: um display expressivo só para H1/H2 grandes se ganharmos personalidade sem perder o tom — a validar no Penpot. Títulos grandes seguem em **sage** (regra atual).

## COR (preservada, evoluída)
- Papel caqui `#e2dfc8`/`#d9d6bd`/`#cfccae`; tinta `#2a2818`/`#5c5944`; **sage** `#8a9e7e` (títulos, obrigatório); **teal** `#0a8f6f`/`#076a53` (acento/CTA); **vermelho faixa** `#c23b2e` (detalhe); dark cinematográfico `#171512` (blocos de respiro/quote). Sem paleta nova imposta.

## FOTOGRAFIA
- Preto-e-lona: tatame, treino, primeira aula. Tratamento editorial quente coerente com o caqui. Reaproveitar assets atuais (primeira-aula-*, momento-01..08) re-exportados otimizados.

## MOVIMENTO
- `Lenis` (smooth scroll) **desktop**, off no mobile/reduced-motion (veredicto Arsenal). `GSAP + ScrollTrigger` para reveals, carregado em **idle** com limpeza (`useGSAP`/kill). `SplitText` no hero. Galeria Momentos reconstruída com `Flip`/`Observer` (corrige o bug de espaço vazio do pin atual). **RAF único** para Lenis + 3D + qualquer loop (regra de conflito). **Lenis × ScrollSmoother nunca juntos.**

## BACKGROUND
- Papel caqui com textura sutil/grão estático (sem canvas contínuo pesado). Profundidade fica concentrada no hero (3D) e em transições GSAP, não no fundo da página inteira.

## SCROLL
- Rolagem suave desktop + reveals por seção. **Sem** rolagem infinita (Active Theory é lindo, mas não serve a quem entrou do Instagram para marcar aula — atrapalharia o caminho até o CTA).

## CTA
- **WhatsApp** como ação única e dominante (`wa.me/5521982808635`, mensagem pré-preenchida), repetido em hero, meio e contato. Formulário Google = alternativa **discreta** secundária. "Já é aluno? Entrar" leva à Área do Aluno.

## MOBILE
- Mobile-first. 3D vira imagem estática; Lenis off; imagens responsivas; CTA WhatsApp fixo/acessível; foco em LCP e leitura.

## CUSTO TÉCNICO
- Stack alvo provável: decidido na FASE 7 (depois do design). Candidatos: HTML+GSAP+Lenis (mais leve, GitHub Pages direto) **ou** Next se a Área do Aluno redesenhada justificar componentização. GSAP é 100% grátis. 3D só se otimizado (gltf-transform). Nada carregado "por via das dúvidas".

## SEQUÊNCIA PROPOSTA (evitar big-bang; Área do Aluno entra, mas depois da pública)
1. Página pública V2 (hero → seções → CTA → motion → mobile).
2. Validar (preview + Lighthouse comparativo).
3. **Depois** redesenhar Área do Aluno (login + dashboard) reaproveitando o design system.
4. Tracking reconstruído por último (FASE 15), só em produção.

## Pendências que viram tarefa de design (Penpot/asset)
- Escolher o motivo do objeto 3D (faixa / tatame / emblema).
- Decidir se entra um display tipográfico além do Nunito.
- Definir prova social (depoimentos reais? números?).
