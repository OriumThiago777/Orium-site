# CONTEXTO GERAL — ORIUM™

⚠️ Este arquivo NÃO deve ser versionado publicamente. Adicione ao .gitignore se ainda não estiver.

Você agora faz parte do núcleo estratégico da ORIUM™.

A ORIUM não é uma agência de social media comum. É uma empresa de estruturação digital focada em: percepção, posicionamento, presença digital, clareza, autoridade, comunicação estratégica, organização visual, valor percebido.

Tese central: "Muitos bons negócios parecem menores do que realmente são por falta de estrutura na forma como se apresentam."

---

## IDENTIDADE

Fundador: Thiago Almeida Duarte
Visual: Fundo #080808, laranja #FF6B00, branco, Anton (títulos), Poppins (corpo). Premium, editorial, minimalista.
Linguagem: Clara, estratégica, sofisticada, direta. Sem clichês. Conceitos: percepção, presença, clareza, autoridade, posicionamento, estrutura.

---

## METODOLOGIA ORIUM™

1. RAIO-X ORIUM™ — Diagnóstico estratégico (8 dimensões)
2. DIREÇÃO DE PERCEPÇÃO™ — Como a marca deve se apresentar
3. VITRINE ESTRATÉGICA™ — 3 posts fixados e entrada do perfil
4. PRESENÇA BASE™ — Bio, destaques, CTA, links
5. CONTINUIDADE DIGITAL™ — Planejamento contínuo

---

## MÉTODO ORIUM™ — 7 ETAPAS DO CLIENTE (Progresso no CRM)

Sequência obrigatória — campo "Tipo" na DB Documentos Gerados:
1. Raio-X
2. Briefing
3. Proposta
4. Contrato
5. Calendário
6. Relatório
7. Checklist

Progresso calculado automaticamente via /api/clientes/[id]/progresso
Barra visual nos cards do Kanban + checklist detalhado no modal do cliente.
Sem campos manuais — tudo em tempo real consultando a DB Documentos Gerados.

---

## CLIENTES ATIVOS

- Altemans Barbearia — Instagram, posts, stories, vídeos, planejamento mensal
- Prof. Marcelo Félix — Posicionamento profissional, autoridade, comunicação
- Cortex — Projeto educacional saúde (proposta entregue)
- Ekipar Acessórios — Raio-X gerado (primeiro case real)

---

## STACK TÉCNICO

- Site público: oriumagencia.com.br — hero full-width com overlay, texto sobreposto, responsivo mobile/desktop, modal de qualificação de leads (ContactModal) antes do WhatsApp
- Stack: Next.js 16 + TypeScript + Tailwind CSS
- Deploy: Vercel | Repo: GitHub (OriumThiago777/Orium-site)
- Projeto local: C:\Users\Thiago\Desktop\Orium\Site\orium-site
- Branch principal: main
- Claude Code instalado e ativo no VSCode

Notion Databases:
- Briefings Pessoa: 43cb83171254494b9d41660c4cdd9a8e
- Briefings Empresa: 89560b9f-c653-48f7-8f73-b13c00979d44
- NOTION_TOKEN: ver .env.local (não versionar)

Variáveis de ambiente: todas em .env.local — nunca versionar esse arquivo.

---

## INTEGRAÇÕES ATIVAS

Google Drive API (OAuth2)
- Upload automático de PDFs ao gerar qualquer documento
- Pasta criada automaticamente por cliente: ORIUM/{NomeCliente}/
- Variáveis: GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN, GOOGLE_DRIVE_ROOT_FOLDER_ID

Notion Databases:
- Clientes ORIUM: 1cefcf2469ec44ec96930b4ce5437414
- Atividades ORIUM: d1115c821e74492da16caae5f7611cff
- Leads ORIUM: 12720f37381c4f87b3abb1c922bd4755
- Documentos Gerados: 37bf88b086fd49f1b1738095420c708d
- Biblioteca ORIUM: 45ad5490-91a7-43ee-99a1-6d939d344d29
- Briefings Pessoa: 43cb83171254494b9d41660c4cdd9a8e
- Briefings Empresa: 89560b9f-c653-48f7-8f73-b13c00979d44

---

## SISTEMA DE AUTENTICAÇÃO

Arquivo: lib/auth.ts — localStorage compartilhado
Chave: orium_auth | Duração: 1 hora
Funções: saveAuth(), isAuthenticated(), clearAuth()
Autenticar em qualquer ferramenta libera todas por 1h.
Senha: ver .env.local (RAIO_X_PASSWORD)
Verificação: POST /api/raio-x/auth
Padrão correto (todas as ferramentas): useEffect + authChecked para evitar flash SSR.
  const [autenticado, setAutenticado] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  useEffect(() => { setAutenticado(isAuthenticated()); setAuthChecked(true) }, [])
  if (!authChecked) return null   ← obrigatório, evita mostrar tela de senha para usuário autenticado
NÃO usar: useState(() => isAuthenticated()) — falha em SSR (localStorage indisponível no servidor)

---

## FERRAMENTAS INTERNAS

✅ /hub — Central de ferramentas. Visual premium (tela de senha com Anton gigante + hero.jpg). Exibe todas as ferramentas ativas: Raio-X, Briefing, Proposta, Contrato, Calendário, Relatório, Checklist, Clientes, Biblioteca. Array EM_BREVE vazio.
✅ /briefing — Onboarding integrado ao Notion. 2 fluxos, 6 etapas, sidebar recolhível. REFERÊNCIA VISUAL ABSOLUTA.
✅ /raio-x — Diagnóstico 8 dimensões. PDF 10 páginas. Prompt copiável.
✅ /proposta — Até 3 fases. Checkboxes de serviços. PDF com valor R$ formatado, prazo, contato.
✅ /contrato — 9 etapas. 18 cláusulas dinâmicas. Copiar contrato.
✅ /calendario — 4 etapas. Geração via API Anthropic (claude-sonnet-4-20250514). Cards com título, legenda, hashtags reais.
✅ /relatorio — 6 etapas, PDF premium, integrado ao Notion.
✅ /checklist — 4 etapas, 19 serviços, PDF só com entregues, integrado ao Notion.
✅ /clientes — CRM Kanban + Table + Leads + Acessos + Calendário, drag-and-drop, score de saúde, timeline de atividades, exportação CSV, progresso por cliente. Aba Leads consome NOTION_DB_LEADS (busca, filtros, status inline editável). Aba Acessos é placeholder ("EM BREVE — Google Analytics"). Aba Calendário consome NOTION_DB_CALENDARIO (visão mensal/semanal, filtros por cliente/tipo/status, modal de criação/edição com CRUD completo via Notion).
✅ /meus-documentos — BIBLIOTECA (renomeada visualmente, rota preservada). Histórico de documentos gerados.
✅ /biblioteca — Biblioteca de Assets ORIUM. Grid de cards por segmento, filtros, modal de adição, integração Notion (NOTION_DB_BIBLIOTECA).

---

## PADRÃO VISUAL (todas as ferramentas)

Referência absoluta: app/briefing/page.tsx — ler antes de qualquer alteração visual.
Nunca quebrar esse padrão sem aprovação explícita do Thiago.

Fundo: #080808 + hero.jpg (opacity 0.07) + gradiente radial laranja 5%
Layout: position fixed, inset 0, overflow hidden, Poppins
Sidebar: 260px/60px, border-right #141414, blur(12px), toggle ←/→, link "← menu" → /hub
Inputs: rgba(255,255,255,0.04), border #1e1e1e, focus #FF6B00, borderRadius 10px
Botão primário: #FF6B00, Anton, letterSpacing, boxShadow laranja
Botão secundário: border #1e1e1e, sem fundo
Footer fixo: rgba(8,8,8,0.9), blur(8px), borderTop #141414

Componentes: não há componentes globais reutilizáveis ainda — estilos aplicados inline por página. Ao criar novos, seguir o padrão acima. Se identificar padrão repetido em 3+ páginas, sugerir extração para componente.

---

## CONVENÇÃO DE COMMITS

feat: nova funcionalidade
fix: correção de bug
style: ajuste visual sem mudança de lógica
refactor: reestruturação sem mudança de comportamento
chore: configuração, dependências, arquivos auxiliares

Exemplos:
- feat: adicionar geração de PDF no /relatorio
- fix: corrigir autenticação no /contrato
- style: ajustar sidebar no /calendario

---

## ARQUITETURA

app/
├── page.tsx (client component — modalOpen state + ContactModal)
├── layout.tsx
├── hub/ ├── briefing/ ├── raio-x/ ├── proposta/ ├── contrato/ ├── calendario/
├── relatorio/ ├── checklist/ ├── clientes/ ├── meus-documentos/
└── api/
    ├── briefing/route.ts
    ├── raio-x/auth/route.ts
    ├── calendario/route.ts
    ├── documentos/route.ts
    ├── clientes/route.ts
    ├── clientes/[id]/progresso/route.ts
    ├── atividades/route.ts
    ├── clientes/export/route.ts
    ├── upload-pdf/route.ts
    └── biblioteca/route.ts

lib/
├── auth.ts
├── google-drive.ts
└── upload-helper.ts

public/
├── lglaranja.png, lgbranca.png, hero.jpg, wpp.png
└── altemans.jpg, marcelo.jpg, estrategia.jpg, processo.jpg, cta.jpg

---

## HOOKS ATIVOS (.claude/settings.json)

PostToolUse — após git commit:
Sugere /code-review antes do push para garantir qualidade.

PreToolUse — antes de editar page.tsx ou layout.tsx:
Injeta automaticamente o padrão visual do CLAUDE.md no contexto do modelo.

Scripts: .claude/hooks/post-commit-review.js e .claude/hooks/check-visual-file.js
Para gerenciar: /hooks no Claude Code
Para ativar na sessão: fechar e reabrir o Claude Code

---

## FLUXO DE TRABALHO

1. Pedido no terminal do Claude Code
2. Edita localmente → testa em localhost:3000
3. Aprovado: git add . && git commit -m "descrição" && git push
4. Vercel deploy automático ~1 min

Atualizar CLAUDE.md: ao fim de sessões que mudem arquitetura, rotas, padrões visuais ou regras de trabalho.

---

## LACUNAS CONHECIDAS (a resolver)

- [x] Bloco 3: upload automático de PDF em todas as ferramentas — concluído (05/06/2026)
      Commits: 6220644 (raio-x, proposta, relatorio, checklist) + 8344d1c (briefing, contrato)
      Padrão: savePdfToCloud() paralelo ao doc.save(), SaveToast com 3 estados, saveStatus state
- [x] Bloco 4: redesign visual premium dos cards do CRM — concluído (05/06/2026)
      Commit: 23bcbc4 — KanbanCard com avatar/iniciais, HealthBadge, barra de progresso melhorada, hover ORIUM, empty states por fase, filtro "Precisa de Atenção"
- [ ] Validar upload de PDF para Google Drive em produção (Vercel)
- [ ] Cadastrar clientes reais no CRM (Altemans, Prof. Marcelo, Ekipar)
- [x] CTA do site público — rastreamento via CTALink (trackCTA + gtag) — commit 742e6b1
      ⚠️ Componente CTALink ficou órfão (sem uso): os CTAs de WhatsApp agora abrem o
      ContactModal em vez de navegar direto, então o tracking gtag deixou de disparar
      nesses pontos. Se for necessário medir esses cliques, adicionar trackCTA/gtag
      dentro do ContactModal (ex.: no momento do handleSubmit).
- [x] Responsividade mobile do site público — concluída e validada visualmente (08/06/2026)
      Commits: 8493120 (feat: select necessidade + responsividade mobile completa) +
               5e129f6 (fix: alinhamento centralizado do link WhatsApp no footer mobile)
      Mudanças principais em app/page.tsx: breakpoints sm:→md: em botões/grids, padding px-5,
      tipografia fluida clamp() via Tailwind arbitrary values, DIFERENCIAL 4 cards grid→1 coluna,
      footer flex-col centralizado, Etapa 4 sem border-bottom sobrando (prop last no ProcessStep).
      Em components/ServiceCard.tsx: ícone w-12 h-12 md:w-[78px] md:h-[78px].
      Em components/ProcessStep.tsx: prop last?, border-bottom max-md: apenas entre etapas.
      Bug encontrado via teste Playwright mobile (375px): botão WhatsApp no footer tinha text-left
      fixo — corrigido para text-center md:text-left. Sem overflow horizontal (docWidth === winWidth).
- [x] Hero do site público — título/subtítulo/botões redimensionados, travessão removido,
      bug de botões cortados (overflow-hidden + altura fixa) corrigido, padding-top/bottom
      ajustado — commit e6ac8e3 (07/06/2026)
- [x] Modal de qualificação de leads (ContactModal) antes do WhatsApp — concluído (07/06/2026)
      Commits: 91855dc (mensagem padrão unificada), 2bdb261 (componente + integração),
      69d78bd (Poppins, campo email opcional, Navbar abrindo modal),
      917a770 (lead salvo no Notion antes de abrir o WhatsApp)
      Padrão: components/ContactModal.tsx — overlay + form (nome, segmento, instagram,
      email opcional, necessidade como select) — monta mensagem e abre wa.me/5531999352065 no submit.
      Campo "necessidade": select com 7 opções (última "Outro"); se "Outro" selecionado, exibe
      textarea "DESCREVA SUA NECESSIDADE". Valor final computado como necessidadeFinal e usado
      identicamente no payload do /api/leads e na mensagem do WhatsApp. Commits desta sessão:
      8493120 — select + responsividade. NOTION_DB_LEADS salva o valor final (nunca "Outro" isolado).
      Todos os CTAs "Falar com a ORIUM/Falar agora/Solicitar diagnóstico/WhatsApp" do
      site público agora abrem o modal via setModalOpen(true) em vez de navegar direto.
      Comunicação cross-component (Navbar → page.tsx): CustomEvent 'openContactModal'
      disparado via window.dispatchEvent e escutado em useEffect no Home.
      components/FloatingWhatsApp.tsx removido (estava órfão — não importado em nenhum
      lugar; o botão flutuante real era inline em page.tsx e agora abre o modal).
      Persistência: handleSubmit agora é async — POST para /api/leads (app/api/leads/route.ts)
      grava o lead no Notion (database "Leads ORIUM", id 12720f37381c4f87b3abb1c922bd4755)
      via fetch direto + header NH (mesmo padrão de app/api/atividades/route.ts, NÃO
      @notionhq/client — pacote não está instalado). Botão mostra "Salvando..." durante
      o loading; falha no Notion não bloqueia o redirecionamento ao WhatsApp (try/catch).
      Variável NOTION_DB_LEADS adicionada ao .env.local — falta configurar no Vercel.
- [x] Abas Leads e Acessos no /clientes — concluído (08/06/2026)
      Commit: ea72501 — feat: aba Leads e Acessos no /clientes com integração Notion
      vistaAtiva agora é 'kanban' | 'table' | 'leads' | 'acessos'; abas com ícone (👤 Leads, 📊 Acessos).
      VistaLeads: header (título Anton + subtítulo + contador laranja), busca por nome/Instagram,
      filtros de Status (Novo azul/Contatado amarelo/Em negociação laranja/Fechado verde/Perdido
      vermelho — LEAD_STATUS_COR) e Segmento (cores extraídas do select do Notion via
      NOTION_SELECT_COR), tabela (#0f0f0f/#1a1a1a, hover #111, Instagram→link instagram.com/handle,
      Email→mailto:, Necessidade truncada 60 chars com title=tooltip, Status como <select> inline
      que dispara PATCH /api/leads), empty state "Nenhum lead ainda...".
      VistaAcessos: placeholder estático "EM BREVE — Integração com Google Analytics".
      app/api/leads/route.ts ganhou GET (query NOTION_DB_LEADS ordenado por created_time desc,
      filtros opcionais ?status= e ?segmento=, mapeia para {id, nome, segmento, segmentoCor,
      instagram, email, necessidade, status, data}) e PATCH ({ pageId, status } → atualiza
      propriedade Status no Notion). "Data" usa o created_time nativo da página (não há
      propriedade Data customizada no database).
      Testado ao vivo: lead real "Jaqueline" carregou com tag de segmento colorida, link de
      Instagram, mailto, e troca de status via PATCH confirmada (200, Notion atualizado).
      ⚠️ Database "Leads ORIUM" precisou ser compartilhado com a integração "ORIUM Briefing"
      no Notion (•••→Connections) — sem isso a API retorna 404 object_not_found.
- [x] Aba Calendário no /clientes — concluído (08/06/2026)
      Commit: 4d864e3 — feat: aba Calendário no /clientes com visão mensal e semanal
      vistaAtiva agora é 'kanban' | 'table' | 'leads' | 'acessos' | 'calendario'; nova aba "📅 CALENDÁRIO".
      ⚠️ app/api/calendario/route.ts JÁ EXISTIA (gerador de calendário com IA, /calendario,
      exporta só POST). Para não sobrescrevê-lo, a rota CRUD do CRM foi criada em
      app/api/clientes/calendario/route.ts (mesmo padrão de namespacing de
      clientes/[id]/progresso e clientes/export) — exporta GET/POST/PATCH/DELETE contra
      NOTION_DB_CALENDARIO via fetch direto + header NH.
      GET aceita ?mes=YYYY-MM (filtra por propriedade Data com on_or_after/on_or_before,
      sorts ascending) e mapeia para {id, titulo, cliente, tipo, status, data, descricao,
      legenda}. POST cria página (Título/Cliente/Tipo/Status/Data/Descrição/Legenda).
      PATCH aceita atualização parcial via {pageId, ...campos opcionais}. DELETE (?id=)
      arquiva a página (archived: true — soft delete).
      VistaCalendario: header (título Anton + subtítulo + botão "+ NOVO ITEM" laranja),
      navegação (‹ › Hoje, toggle Mês|Semana, título "Junho 2026" ou "07 – 13 Jun 2026"
      via tituloNavegacaoCalendario), filtros com bullet colorido por Cliente/Tipo/Status
      (FiltroComCor), grade mensal (42 células via gerarGradeMensal/startOfWeek, pills
      com cor do cliente a 0.15 opacidade + borda esquerda 3px, máx. 3 visíveis + "+N mais",
      dia atual com círculo laranja, dias fora do mês a 0.3 opacidade), visão semanal
      (gerarSemana, 7 colunas com cards título+tipo+badge de status).
      CLIENT_COLORS (Altemans laranja/Marcelo azul/Ekipar verde/ORIUM Interno cinza/Outro
      cinza-claro) e STATUS_COLORS (Planejado/Produzindo/Aprovado/Publicado/Cancelado).
      ModalItemCalendario: criação/edição com inputs estilo ContactModal (bg #080808,
      border #222, focus #FF6B00, sem border-radius, Poppins), botões Salvar (POST/PATCH)
      /Excluir (DELETE com confirm())/Cancelar.
      Testado ao vivo via Playwright: visão mensal, semanal (header "07 – 13 Jun 2026",
      hoje destacado em laranja) e modal "NOVO ITEM" renderizam sem erros de console.
      Variável NOTION_DB_CALENDARIO=078ecd0389b848d0b34ac00d3648c871 adicionada ao
      .env.local — falta configurar no Vercel.
      ⚠️ TIPOS_CONTEUDO no modal do /clientes deve ser ['Post Feed','Story','Reels',
      'Tarefa Interna','Reunião','Entrega'] — corrigido em 08/06/2026 para bater com o
      schema real da DB Notion (commit 8493120). Fallback da API também atualizado para 'Post Feed'.
- [ ] ⚠️ Configurar todas as variáveis do .env.local no painel do Vercel (NOTION_TOKEN, RAIO_X_PASSWORD, GOOGLE_OAUTH_*, etc.) — sem isso as ferramentas falham em produção com "API token is invalid"

---

## MODO DE TRABALHO

4 camadas: Estratégia → Estrutura → Execução → Continuidade
Código e execução: Claude Code no VSCode
Estratégia, conteúdo e decisões: chat estratégico (claude.ai)

---

## REGRAS DE RESPOSTA

- Nunca trate a ORIUM como social media comum
- Conecte sempre design, conteúdo e presença à percepção estratégica
- Entregue estrutura pronta, texto pronto, próximos passos objetivos
- Ao mexer em código: informe qual arquivo, o que substituir, comando para rodar, resultado esperado e mensagem de commit
- Ao criar nova ferramenta interna: seguir padrão visual do /briefing obrigatoriamente
- Ao identificar risco (segurança, quebra de padrão, regressão): avisar antes de executar

---

- [x] Padrão visual premium nos PDFs — proposta (hero.jpg cover + logo branca), relatório e checklist (capa programática) — commit 742e6b1

Última atualização: 08/06/2026 (sessão 10)

---

## Skills Instaladas

- frontend-design — diretrizes de UI/UX para componentes web
- visual-polish — polimento visual e estética premium (customizada para ORIUM™)
- ui-ux-pro-max — estilos, paletas, tipografia e diretrizes de UX

---

## Assets Visuais

### Fotos — /public/fotos/

Todas as fotos são PNG, estética dark premium com luz laranja
#FF6B00. Geradas com IA (ChatGPT/Nano Banana).

| Arquivo | Uso | Seção |
|---|---|---|
| hero2.png | Imagem principal do site, workspace com laptop e luz laranja | Hero |
| estrategia.png | Geométrica com linhas laranja em fundo escuro | Seção Diferencial |
| processo.png | Flat lay premium com notebook e objetos em mesa preta | Seção Processo |
| cta.png | Abstrata com luz laranja, fundo escuro | Seção CTA final |
| altemans.png | Interior de barbearia premium com cadeira e luz quente | Projeto Altemans |
| marcelo.png | Ambiente acadêmico com livros e luz laranja de mesa | Projeto Prof. Marcelo |
| og-image.png | Ícone circular laranja em fundo escuro | Open Graph / redes sociais |

Ao usar fotos em novas seções:
- Sempre aplique overlay rgba(8,8,8,0.75) a rgba(8,8,8,0.90)
  sobre a imagem para garantir legibilidade do texto
- Para fundos de seção, prefira background-image CSS
  em vez de next/image
- Para imagens de conteúdo (projetos, cards), use next/image
  com object-fit: cover

---

### Ícones — /public/icons/

Todos os ícones são SVG 64x64px, traço laranja #FF6B00,
fundo transparente, estilo minimalista linear.

| Arquivo | Descrição | Uso no site |
|---|---|---|
| icon-posicionamento.svg | Bússola minimalista | Diferencial — Posicionamento |
| icon-percepcao.svg | Diamante geométrico | Diferencial — Percepção Premium |
| icon-operacao.svg | Engrenagem 6 dentes | Diferencial — Operação Digital |
| icon-crescimento.svg | Seta diagonal subindo | Diferencial — Crescimento Sustentável |
| icon-branding.svg | Letra B em quadrado | Serviços — Branding |
| icon-sites.svg | Janela de navegador | Serviços — Sites |
| icon-automacao.svg | Dois nós conectados | Serviços — Automação |
| icon-contato.svg | Balão de fala reto | Timeline — Primeiro contato |
| icon-analise.svg | Lupa minimalista | Timeline — Analisamos presença |
| icon-melhorias.svg | Lista com checkmark | Timeline — Indicamos melhorias |
| icon-proposta.svg | Documento com assinatura | Timeline — Montamos proposta |
| icon-presenca.svg | Olho minimalista | Diagnóstico — Presença Visual |
| icon-comunicacao.svg | Ondas de sinal | Diagnóstico — Comunicação |
| icon-estrutura.svg | Grade de pontos conectados | Diagnóstico — Estrutura Digital |
| icon-proximos.svg | Seta em círculo | Diagnóstico — Próximos Passos |

Ao usar ícones:
- Tamanho inline (ao lado de texto): width={32} height={32}
- Tamanho destaque (topo de card/coluna): width={48} height={48}
- Tamanho timeline: width={64} height={64}
- Sempre usar next/image com alt descritivo
- Nunca aplicar filtro CSS de cor — os SVGs já são laranja #FF6B00

---

Última atualização: 08/06/2026 (sessão 10)