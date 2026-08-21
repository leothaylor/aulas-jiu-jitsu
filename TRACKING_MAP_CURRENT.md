# TRACKING_MAP_CURRENT.md — rastreamento do site atual (produção)

> Objetivo: permitir reconstruir o rastreamento na V2 **de forma deliberada**, sem copiar scripts antigos cegamente.
> Fonte: código da branch `main` de `leothaylor/portfolio-bjj` (auditado em 2026-08-20) + página canônica do Notion "Arquitetura atual — Portfólio BJJ".
> **DEV = tracking OFF. PROD = tracking ON.** Esta cópia (`portfolio-bjj-v2-dev`) está com tudo neutralizado.
> Os IDs abaixo são **identificadores públicos client-side** (já visíveis no site publicado), não são segredos. Gitleaks confirmou: 0 vazamentos (working tree + 35 commits).

## Como estava montado
- Todo o rastreamento vivia em **um arquivo externo**: `tracking-consent.js` (+ `tracking-consent.css`), carregado no `<head>` do `index.html` (`<script defer src="./tracking-consent.js">`).
- Um **único listener central** lê `data-track="..."` nos elementos e despacha para GA4 + Clarity (+ Meta). Não havia listeners espalhados.
- Carregamento **condicionado a consentimento real** (banner): recusa / aceite total / aceite por categoria testados.
- **CTAs são links nativos** (`wa.me`, Google Forms, Google Maps, Instagram) → funcionam sem nenhum JS de tracking. Por isso a cópia DEV sanitizada mantém 100% da função e envia 0 eventos.

## Plataformas e IDs (client-side, públicos)
| Plataforma | ID | Onde |
|---|---|---|
| Google Analytics 4 | `G-901CW6RW4H` | gtag via tracking-consent.js |
| Microsoft Clarity | `xs3yejldmx` | clarity.ms/tag/... |
| Meta Pixel ("Leo Thaylor BJJ") | `941784835609445` | connect.facebook.net/fbevents.js |
| Conta de anúncios Meta vinculada | `1575458310844892` | (referência, não vai no site) |

## Eventos GA4 (personalizados)
`click_whatsapp`, `click_form`, `click_route`, `click_instagram`, `open_photo`
- Parâmetros: `element_location`, `element_label`, `photo_name`, `link_url`.
- Recomendados como conversão principal: `click_whatsapp`, `click_form`. Os demais = interesse, não conversão confirmada.
- Nota honesta: clique ≠ mensagem enviada / formulário concluído / matrícula.

## Nomes enviados ao Clarity
`whatsapp_hero`, `whatsapp_contact`, `form_hero`, `form_location`, `route_location`, `instagram_hero`, `instagram_contact`, `photo_introducao`, `photo_retomada`, `photo_orientacao`

## Eventos Meta Pixel (implementados)
`PageView`, `ViewContent`, `Contact`, `FormOpen`
- **NÃO** implementados de propósito: `Lead`, `Schedule` (sem comprovação técnica de envio real do form / agendamento). Validados no painel Meta em 04/08/2026.

## Atributos `data-track` no HTML (mapa elemento → nome)
| Local (seção) | data-track |
|---|---|
| Hero — WhatsApp | `whatsapp_hero` |
| Hero — Formulário | `form_hero` |
| Hero — Instagram | `instagram_hero` |
| Primeira aula — foto 1 | `photo_introducao` |
| Primeira aula — foto 2 | `photo_retomada` |
| Primeira aula — foto 3 | `photo_orientacao` |
| Localização — rota/Maps | `route_location` |
| Localização — Formulário | `form_location` |
| Contato — WhatsApp | `whatsapp_contact` |
| Contato — Instagram | `instagram_contact` |

## UTMs / atribuição
- Captura por **whitelist**: `utm_source, utm_medium, utm_campaign, utm_content, utm_term, utm_id`.
- Sanitização de valores + limite de 160 caracteres por parâmetro.
- Persistência em `sessionStorage`; disponível para GA4/Clarity/Meta sem quebrar visita direta sem UTMs.
- Instagram costuma injetar `fbclid`; a fonte canônica do site permanece `https://leothaylor.github.io/portfolio-bjj/`.

## Consentimento
- O banner controla efetivamente o carregamento de GA4, Clarity e Meta Pixel (nada carrega antes do aceite).
- Estados testados: recusa, aceite total, aceite por categoria, visita direta, visita com UTMs.

## Decisão para a V2 (a combinar — FASE 15)
1. Reconstruir a partir DESटE mapa, não copiando `tracking-consent.js` cegamente.
2. Reavaliar cada evento: manter `click_whatsapp`/`click_form` como principais; decidir se `open_photo`/`route`/`instagram` seguem.
3. Manter separação DEV(off)/PROD(on) explícita e auditável.
4. Reconsiderar `Lead`/`Schedule` só se houver confirmação real de envio.
5. Não reutilizar IDs do projeto Rotina ACS.
