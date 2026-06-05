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

- Site público: oriumagencia.com.br — hero full-width com overlay, texto sobreposto, responsivo mobile/desktop
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
- Documentos Gerados: 37bf88b086fd49f1b1738095420c708d
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
✅ /clientes — CRM Kanban + Table, drag-and-drop, score de saúde, timeline de atividades, exportação CSV, progresso por cliente.
✅ /meus-documentos — BIBLIOTECA (renomeada visualmente, rota preservada). Histórico de documentos gerados.

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
├── page.tsx
├── layout.tsx (sem FloatingWhatsApp)
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
    └── upload-pdf/route.ts

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

- [ ] Bloco 3: conectar upload automático de PDF nos botões de geração de cada ferramenta (/relatorio, /raio-x, /proposta, /contrato, /checklist)
- [ ] Bloco 4: redesign visual premium dos cards do CRM
- [ ] Validar upload de PDF para Google Drive em produção (Vercel)
- [ ] Cadastrar clientes reais no CRM (Altemans, Prof. Marcelo, Ekipar)
- [ ] CTA do site público — rastrear cliques e definir destino do "Falar agora"
- [x] Responsividade mobile do site público — concluída (05/06/2026)
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

Última atualização: 05/06/2026 (sessão 2)