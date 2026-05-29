# CONTEXTO GERAL — ORIUM™

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

## CLIENTES ATIVOS

- Altemans Barbearia — Instagram, posts, stories, vídeos, planejamento mensal
- Prof. Marcelo Félix — Posicionamento profissional, autoridade, comunicação
- Cortex — Projeto educacional saúde (proposta entregue)
- Ekipar Acessórios — Raio-X gerado (primeiro case real)

---

## STACK TÉCNICO

- Site: oriumagencia.com.br
- Stack: Next.js 16 + TypeScript + Tailwind CSS
- Deploy: Vercel | Repo: GitHub (OriumThiago777/Orium-site)
- Projeto local: C:\Users\Thiago\Desktop\Orium\Site\orium-site
- Claude Code instalado e ativo no VSCode

Notion Databases:
- Briefings Pessoa: 43cb83171254494b9d41660c4cdd9a8e
- Briefings Empresa: 89560b9f-c653-48f7-8f73-b13c00979d44
- NOTION_TOKEN: ver .env.local (não versionar)

.env.local:
NOTION_TOKEN=<ver arquivo local>
NOTION_DB_PESSOA=43cb83171254494b9d41660c4cdd9a8e
NOTION_DB_EMPRESA=89560b9f-c653-48f7-8f73-b13c00979d44
RAIO_X_PASSWORD=a

---

## SISTEMA DE AUTENTICAÇÃO

Arquivo: lib/auth.ts — localStorage compartilhado
Chave: orium_auth | Duração: 1 hora
Funções: saveAuth(), isAuthenticated(), clearAuth()
Autenticar em qualquer ferramenta libera todas por 1h.
Senha: a (RAIO_X_PASSWORD) | Verificação: POST /api/raio-x/auth
Todas as ferramentas usam: useState(() => isAuthenticated())

---

## FERRAMENTAS INTERNAS

✅ /hub — Central de ferramentas. Visual premium (tela de senha com Anton gigante + hero.jpg). Cards ativos e Em breve.
✅ /briefing — Onboarding integrado ao Notion. 2 fluxos, 6 etapas, sidebar recolhível. REFERÊNCIA VISUAL ABSOLUTA.
✅ /raio-x — Diagnóstico 8 dimensões. PDF 10 páginas. Prompt copiável.
✅ /proposta — Até 3 fases. Checkboxes de serviços. PDF com valor R$ formatado, prazo, contato.
✅ /contrato — 9 etapas. 18 cláusulas dinâmicas. Copiar contrato.
✅ /calendario — 4 etapas. Geração via API Anthropic (claude-sonnet-4-20250514). Cards com título, legenda, hashtags reais.
🔄 /relatorio — FUTURO
🔄 /checklist — FUTURO

---

## PADRÃO VISUAL (todas as ferramentas)

Referência: app/briefing/page.tsx — ler antes de qualquer alteração visual.

Fundo: #080808 + hero.jpg (opacity 0.07) + gradiente radial laranja 5%
Layout: position fixed, inset 0, overflow hidden, Poppins
Sidebar: 260px/60px, border-right #141414, blur(12px), toggle ←/→, link "← menu" → /hub
Inputs: rgba(255,255,255,0.04), border #1e1e1e, focus #FF6B00, borderRadius 10px
Botão primário: #FF6B00, Anton, letterSpacing, boxShadow laranja
Botão secundário: border #1e1e1e, sem fundo
Footer fixo: rgba(8,8,8,0.9), blur(8px), borderTop #141414

---

## ARQUITETURA

app/
├── page.tsx
├── layout.tsx (sem FloatingWhatsApp)
├── hub/ ├── briefing/ ├── raio-x/ ├── proposta/ ├── contrato/ ├── calendario/
└── api/
    ├── briefing/route.ts
    ├── raio-x/auth/route.ts
    └── calendario/route.ts

lib/
└── auth.ts

public/
├── lglaranja.png, lgbranca.png, hero.jpg, wpp.png
└── altemans.jpg, marcelo.jpg, estrategia.jpg, processo.jpg, cta.jpg

---

## FLUXO DE TRABALHO

1. Pedido no terminal do Claude Code
2. Edita localmente → testa em localhost:3000
3. Aprovado: git add . && git commit -m "descrição" && git push
4. Vercel deploy automático ~1 min

Atualizar claude.md: ao fim de sessões que mudem arquitetura, rotas ou padrões visuais.

---

## MODO DE TRABALHO

4 camadas: Estratégia → Estrutura → Execução → Continuidade
Código: Claude Code no VSCode
Estratégia/conteúdo/decisões: chat estratégico

---

## PRIORIDADES ATUAIS

1. ✅ Hub visual premium
2. ✅ Autenticação compartilhada 1h
3. ✅ Calendário com API Anthropic
4. 🔄 Testar calendário com cliente real
5. 🔄 Construir /relatorio

---

## REGRAS DE RESPOSTA

- Nunca trate a ORIUM como social media comum
- Conecte sempre design, conteúdo e presença à percepção estratégica
- Entregue estrutura pronta, texto pronto, próximos passos objetivos
- Código: arquivo, o que substituir, comando, resultado esperado

Última atualização: 29/05/2026