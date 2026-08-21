# portfolio-bjj-v2

Nova versão (V2) do site pessoal de jiu-jitsu do **Leo Thaylor** — reestruturação completa em formato editorial imersivo ("cena a cena"), mantendo apenas as fotos reais e a paleta da identidade.

> **Estado:** desenvolvimento. **Não publicado** — GitHub Pages desativado, sem domínio, sem rastreamento ativo. A produção atual segue no repositório `portfolio-bjj`, intacta.

## Estrutura
- `index.html` · `styles.css` · `app.js` — página pública (hero, trajetória, método, primeira aula, momentos, localização, contato).
- `alunos/` — Área do Aluno (login + dashboard: cronograma, acervo de aulas com busca e filtros, player de vídeo).
- `assets/images/` — fotos e imagens (hero em WebP responsivo).
- `TRACKING_MAP_CURRENT.md` — mapa do rastreamento da produção, para reconstrução futura e deliberada (nada ativo aqui).
- `DIRECAO_VISUAL_V2.md` — direção visual e decisões.

## Rodar localmente
```bash
python -m http.server 8791
```
Depois abra `http://127.0.0.1:8791/`.

## Stack
HTML + CSS + JS puro. Fontes Fraunces + Inter. Sem framework, sem dependências externas em runtime. Foco em performance (Perf ~99 / LCP ~2s no mobile).

## Rastreamento
Desativado de propósito. Reconstrução futura seguirá `TRACKING_MAP_CURRENT.md` e só entra em produção — nunca em desenvolvimento.
