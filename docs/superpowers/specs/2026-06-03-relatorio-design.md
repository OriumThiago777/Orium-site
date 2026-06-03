# /relatorio — Design Spec

**Data:** 2026-06-03  
**Status:** Aprovado

---

## Objetivo

Ferramenta interna ORIUM para gerar relatórios mensais de clientes. Formulário em 7 etapas → preview premium → exportação em PDF e texto copiável.

---

## Arquitetura

**Arquivo único:** `app/relatorio/page.tsx` (client component)  
**Sem rota de API** — tudo processado no cliente.  
**Autenticação:** `useState(() => isAuthenticated())` de `lib/auth.ts`. Tela de senha via `POST /api/raio-x/auth`.  
**PDF:** `jsPDF` + `html2canvas` (já instalados — mesmo padrão do `/raio-x`).

### Estados da página

1. `!autenticado` → tela de senha
2. `step < 7` → formulário em etapas (sidebar + área de conteúdo)
3. `step === 7` → preview + botões de exportação

---

## Padrão Visual

Referência absoluta: `app/briefing/page.tsx`.

- Fundo: `#080808` + `hero.jpg` (opacity 0.07) + gradiente radial laranja 5%
- Layout: `position: fixed`, `inset: 0`, `overflow: hidden`, Poppins
- Sidebar: 260px / 60px (colapsada), `border-right #141414`, `backdrop-filter: blur(12px)`, toggle ←/→
- Inputs: `rgba(255,255,255,0.04)`, border `#1e1e1e`, focus `#FF6B00`, `borderRadius: 10px`
- Botão primário: `#FF6B00`, Anton, letterSpacing, boxShadow laranja
- Botão secundário: border `#1e1e1e`, sem fundo
- Footer fixo: `rgba(8,8,8,0.9)`, `blur(8px)`, `borderTop #141414`

---

## Tela de Senha

Idêntica ao hub: logo ORIUM + label "ACESSO INTERNO" + `h1` "RELATÓRIO" em Anton + input password + botão "ACESSAR". Chama `POST /api/raio-x/auth`; em sucesso chama `saveAuth()` e atualiza state.

---

## Formulário — 7 Etapas

### Sidebar

- Logo ORIUM (expandida) / altura mínima (colapsada)
- Label "ETAPAS" + lista 01–07 com bloco de cada etapa
- Etapa ativa: fundo `rgba(255,107,0,0.06)`, border-left `#FF6B00`
- Etapas concluídas: cor `#3a3a3a`
- Barra de progresso (só expandida): altura 2px, fill laranja, transição 0.5s
- Link `← PAINEL` → `/hub` no rodapé da sidebar

### Cabeçalho do conteúdo

`Etapa X de 7` em laranja + título do bloco em Anton + subtítulo em `#555`.

### Footer do conteúdo

Botão "← Voltar" (secundário, hidden na etapa 1) + botão "CONTINUAR →" / "VER RELATÓRIO" (primário, Anton).

---

## Campos por Etapa

### Etapa 1 — IDENTIFICAÇÃO
- `cliente`: input texto — "Nome do cliente"
- `periodo`: dois selects lado a lado (mês: Jan–Dez; ano: 2024–2027)
- `responsavel`: input texto — "Responsável ORIUM", default "Thiago"

### Etapa 2 — ENTREGAS DO MÊS
- Lista dinâmica: input + botão "+" (laranja). Items aparecem como tags com × para remover.
- State: `string[]` em `listas.entregas`

### Etapa 3 — MÉTRICAS
- `segInicio` / `segFim`: dois inputs numéricos lado a lado — "Seguidores (início / fim)"
- `alcance`: input numérico — "Alcance total"
- `impressoes`: input numérico — "Impressões"
- `engajamento`: input numérico — "Engajamento %"
- `cliques`: input numérico — "Cliques no link"

### Etapa 4 — DESTAQUES
- `destaques`: textarea — conquistas e pontos positivos

### Etapa 5 — PONTOS DE ATENÇÃO
- `atencao`: textarea — o que precisa melhorar

### Etapa 6 — PRÓXIMOS PASSOS
- Lista dinâmica igual à Etapa 2 — state: `listas.proximos`

### Etapa 7 — OBSERVAÇÕES
- `observacoes`: textarea livre

---

## State Shape

```ts
const [form, setForm] = useState({
  cliente: '',
  periodoMes: '',
  periodoAno: '',
  responsavel: 'Thiago',
  segInicio: '',
  segFim: '',
  alcance: '',
  impressoes: '',
  engajamento: '',
  cliques: '',
  destaques: '',
  atencao: '',
  observacoes: '',
})

const [listas, setListas] = useState<{ entregas: string[]; proximos: string[] }>({
  entregas: [],
  proximos: [],
})

const [inputTemp, setInputTemp] = useState({ entregas: '', proximos: '' })
```

---

## Preview (step === 7)

Renderizado no DOM dentro de `<div id="relatorio-preview">` — capturado pelo html2canvas.

### Estrutura do preview

```
┌─────────────────────────────────────┐
│  ORIUM™           RELATÓRIO MENSAL  │
│  ─────────────────────────────────  │
│  [NOME DO CLIENTE]   [MÊS / ANO]    │
│  Responsável: Thiago                │
├─────────────────────────────────────┤
│  ENTREGAS DO MÊS                    │
│  • Item 1   • Item 2   • Item 3     │
├─────────────────────────────────────┤
│  MÉTRICAS                           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ...    │
│  │ SEG  │ │ALCNC │ │IMPRS │        │
│  │ +NNN │ │ NNN  │ │ NNN  │        │
│  └──────┘ └──────┘ └──────┘        │
├─────────────────────────────────────┤
│  DESTAQUES                          │
│  [texto]                            │
├─────────────────────────────────────┤
│  PONTOS DE ATENÇÃO                  │
│  [texto]                            │
├─────────────────────────────────────┤
│  PRÓXIMOS PASSOS                    │
│  • Item 1   • Item 2                │
├─────────────────────────────────────┤
│  OBSERVAÇÕES                        │
│  [texto]                            │
└─────────────────────────────────────┘
```

Estilo: fundo `#0d0d0d`, seções separadas por linha laranja fina, títulos em Anton laranja, corpo em Poppins branco/cinza.

### Métricas — card especial

Seguidores exibe variação: `+N` ou `-N` em verde/vermelho. Os outros campos mostram o valor puro.

---

## Exportação

### Copiar relatório
Monta string Markdown formatada com todas as seções e copia via `navigator.clipboard.writeText()`. Botão muda para "✓ COPIADO" por 2s.

### Exportar PDF
```ts
const { default: jsPDF } = await import('jspdf')
const { default: html2canvas } = await import('html2canvas')
// captura #relatorio-preview, converte para imagem, insere no PDF A4
// nome do arquivo: relatorio-[cliente]-[mes]-[ano].pdf
```
Mesmo padrão do `/raio-x`.

---

## Hub — Alteração

Em `app/hub/page.tsx`:
- Remover `RELATÓRIO` de `EM_BREVE`
- Adicionar em `FERRAMENTAS`:
  ```ts
  { tag: 'RESULTADOS', titulo: 'RELATÓRIO', descricao: 'Relatório mensal de resultados por cliente.', href: '/relatorio' }
  ```

---

## Arquivos Afetados

| Arquivo | Ação |
|---------|------|
| `app/relatorio/page.tsx` | Criar |
| `app/hub/page.tsx` | Editar (mover card) |
