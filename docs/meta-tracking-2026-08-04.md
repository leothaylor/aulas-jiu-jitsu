# Handoff técnico — Meta Ads e consentimento

Data da implementação: 2026-08-04 (America/Sao_Paulo)

## Escopo e ativos confirmados

- Projeto/site: Leo Thaylor BJJ — `https://leothaylor.github.io/portfolio-bjj/`
- Portfólio empresarial: Leo Thaylor (Business ID `979695764465633`)
- Conta de anúncios: `1575458310844892`
- Página: Leo Thaylor (ID `61590757532705`)
- Instagram: `@leothaylor`
- Dataset/Meta Pixel exclusivo: **Leo Thaylor BJJ** (ID `941784835609445`)

O Dataset/Pixel foi criado no Gerenciador de Eventos sem Conversions API e sem correspondência avançada automática. Nenhuma campanha, conjunto ou anúncio foi criado ou publicado, e nenhum saldo foi consumido.

## Estado verificável

| Item | Estado | Evidência |
|---|---|---|
| Pixel `941784835609445` | OPERACIONAL E VALIDADO NO PAINEL DA META | Overview reconheceu os quatro eventos como ativos pela integração Meta Pixel |
| Eventos Meta | OPERACIONAIS | `PageView` 7, `ViewContent` 7, `Contact` 3 e `FormOpen` 3 |
| GA4 `G-901CW6RW4H` | OPERACIONAL | Realtime exibiu `page_view`, `click_form` e `click_whatsapp` |
| Microsoft Clarity `xs3yejldmx` | OPERACIONAL | painel do projeto exibiu sessão pública, duas páginas e zero erros JavaScript |
| Consentimento | TESTADO | recusar não carrega rastreadores; aceitar por categoria carrega apenas os scripts correspondentes |
| GitHub Pages | OPERACIONAL | os novos arquivos responderam HTTP 200 no domínio público |

Os estados acima distinguem presença/configuração de validação efetivamente observada. A evidência posterior do painel Overview encerrou a pendência temporária do Meta Test Events e comprovou o fluxo site → Meta Pixel → Meta.

## Implementação

Arquivos principais:

- `tracking-consent.js`: consentimento, carregamento condicional dos rastreadores, atribuição e eventos.
- `tracking-consent.css`: interface responsiva do banner e painel de preferências.
- `privacidade.html`: aviso técnico de privacidade e instruções para alterar/revogar preferências.
- `index.html`: remove o carregamento incondicional antigo e liga a camada centralizada.

Eventos Meta:

- `PageView`: uma vez por carregamento, após consentimento de marketing.
- `ViewContent`: uma vez por carregamento, após consentimento de marketing.
- `Contact`: cliques nos CTAs de WhatsApp.
- `FormOpen`: evento personalizado nos cliques do Google Forms.

Não há disparos de `Lead` nem `Schedule`, pois o site não comprova envio ou agendamento concluído. Os eventos existentes do GA4 (`click_whatsapp`, `click_form`, `click_route`, `click_instagram`, `open_photo`) e do Clarity foram preservados.

## Consentimento

A preferência é armazenada em `localStorage` sob `lt_tracking_consent_v1`. GA4 e Clarity dependem de consentimento de analytics; Meta Pixel depende de consentimento de marketing. A recusa mantém apenas a operação técnica essencial do site. O botão fixo “Privacidade” permite reabrir e revogar escolhas; a revogação recarrega a página para encerrar o estado corrente dos rastreadores.

O aviso implementado é técnico e deve ser revisado juridicamente caso o controlador necessite adequação formal adicional.

## UTMs e atribuição

Padrão preparado para anúncios futuros:

```text
https://leothaylor.github.io/portfolio-bjj/?utm_source=meta&utm_medium=paid_social&utm_campaign=bjj_trion_aula_experimental_2026_08&utm_content=video_iniciante_v1&utm_id={{campaign.id}}&utm_term={{adset.id}}&campaign_id={{campaign.id}}&adset_id={{adset.id}}&ad_id={{ad.id}}&placement={{placement}}&site_source={{site_source_name}}
```

A captura aceita somente `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `utm_id`, `campaign_id`, `adset_id`, `ad_id`, `placement` e `site_source`. Valores têm caracteres de controle e caracteres de marcação removidos, são limitados a 160 caracteres e ficam na sessão atual em `sessionStorage` (`lt_attribution_v1`). A navegação direta, sem parâmetros, permanece funcional. Os dados permitidos acompanham eventos enviados a Meta e GA4 e são publicados como tags de sessão no Clarity.

Os parâmetros dinâmicos listados são compatíveis com a sintaxe de URL Parameters da Meta. Como nenhuma campanha podia ser criada nesta execução, a confirmação final deve ser repetida no construtor de URL do anúncio quando existir um rascunho autorizado — sem publicar.

## Validações executadas

Ambiente local servido com:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Comandos e versões:

```text
node --check tracking-consent.js
node work/test-tracking.mjs
git diff --check
Node v22.19.0
Python 3.11.9
Git 2.54.0.windows.1
```

Resultados:

- o painel Overview da Meta marcou `PageView`, `ViewContent`, `Contact` e `FormOpen` como **Active**, pela integração **Meta Pixel**;
- totais observados na validação final: `PageView` 7, `ViewContent` 7, `Contact` 3 e `FormOpen` 3;
- os acessos feitos pelo Instagram, celular e sessão de teste podem compor esses totais; o Overview agregado não permite atribuir cada ocorrência a um dispositivo específico;
- 8 asserções automatizadas passaram para whitelist, sanitização, persistência, consentimento e unicidade dos eventos.
- visita direta e visita com UTMs simuladas carregaram sem erro;
- clique de WhatsApp abriu o destino e produziu `Contact`/`click_whatsapp`;
- clique de formulário abriu o Google Forms e produziu `FormOpen`/`click_form`;
- recusa, aceite completo, apenas analytics e apenas marketing foram testados;
- não houve duplicidade de GA4, Clarity, `PageView` ou `ViewContent`;
- layouts desktop e mobile (390 × 844) foram inspecionados;
- console público não apresentou erro do site;
- busca no código não encontrou referência a “Rotina ACS”.

## Git e publicação

- branch de segurança: `backup/pre-meta-tracking-2026-08-04` no commit `3b8189b`
- branch de implementação: `feat/meta-tracking-2026-08-04`
- commit funcional: `eea69c2 feat: adiciona Meta Pixel e consentimento real`

A implementação funcional foi enviada à branch e integrada por fast-forward à `main`, acionando o GitHub Pages. O arquivo não versionado `HANDOFF_CLAUDE_CODE_PREMIUM_V2.md`, preexistente e pertencente ao usuário, foi preservado e não entrou nos commits.

## Encerramento da Etapa C

A Etapa C está formalmente concluída: os quatro eventos foram recebidos e classificados como ativos pela Meta, GA4 e Clarity foram validados, o consentimento controla os scripts reais e nenhuma campanha foi publicada.

## Próximos passos seguros

1. Na futura criação autorizada de um anúncio, conferir os parâmetros dinâmicos no construtor de URL e usar exatamente o padrão deste documento.
2. Considerar Conversions API apenas se houver backend/proxy autorizado e política de consentimento correspondente; nenhum token foi gerado ou armazenado nesta entrega.
