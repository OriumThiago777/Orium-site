# Design: Progresso do Cliente no CRM

**Data:** 2026-06-04  
**Projeto:** ORIUM™ — Sistema Interno  
**Feature:** Progresso ORIUM™ por cliente (barra visual + checklist por etapa)

---

## Contexto

As 7 etapas do Método ORIUM™ são: Raio-X, Briefing, Proposta, Contrato, Calendário, Relatório, Checklist.

O progresso de cada cliente é calculado consultando a database `NOTION_DB_DOCUMENTOS`. Se existe um documento do tipo correspondente para aquele cliente (campo `Cliente` rich_text), a etapa está concluída. Zero campos manuais.

---

## Arquivos a criar/modificar

| Arquivo | Ação |
|---|---|
| `app/api/clientes/[id]/progresso/route.ts` | **Criar** — nova API route |
| `app/clientes/page.tsx` | **Modificar** — KanbanCard + ModalDetalhes |

---

## 1. API Route — `/api/clientes/[id]/progresso`

**Arquivo:** `app/api/clientes/[id]/progresso/route.ts`

### Contrato

```
GET /api/clientes/{notionPageId}/progresso?nome=NomeCliente
```

- `[id]` no path = Notion page ID do cliente (disponível via `params`, não usado na query Notion)
- `nome` na query string = nome do cliente para filtrar `NOTION_DB_DOCUMENTOS`

### Lógica

1. Ler `nome` de `searchParams`; se ausente → 400
2. Query `NOTION_DB_DOCUMENTOS` com filtro `Cliente rich_text equals nome` (page_size 20)
3. Para cada resultado, extrair `Tipo` (select) e `Link Drive` (url)
4. Mapear as 7 etapas ordenadas: verificar se `tipo` existe nos resultados
5. Retornar o shape abaixo

### Shape de resposta

```ts
{
  etapas: Array<{
    nome: string       // "Raio-X" | "Briefing" | "Proposta" | "Contrato" | "Calendário" | "Relatório" | "Checklist"
    concluida: boolean
    linkDrive: string | null  // URL do campo "Link Drive" se concluída e disponível
  }>
  total: 7
  concluidas: number
  percentual: number  // Math.round(concluidas/7*100)
}
```

### Padrão de implementação

- Mesmo padrão de `app/api/documentos/route.ts`: headers `NH` com `NOTION_TOKEN` + `Notion-Version: 2022-06-28`
- `NOTION_DB_DOCUMENTOS` via `process.env.NOTION_DB_DOCUMENTOS`
- Try/catch com `NextResponse.json({ error }, { status })`

---

## 2. KanbanCard — barra de progresso

### Estado novo

```ts
type ProgressoData = {
  etapas: Array<{ nome: string; concluida: boolean; linkDrive: string | null }>
  total: number
  concluidas: number
  percentual: number
}

// Em KanbanCard:
const [progresso, setProgresso] = useState<ProgressoData | null>(null)
const [loadingProgresso, setLoadingProgresso] = useState(true)
```

### Props novas

```ts
onProgressoLoaded: (id: string, data: ProgressoData) => void
```

O card chama `onProgressoLoaded` ao receber resposta do fetch (sucesso ou não — no erro, passa `null` e o pai ignora).

### Fetch

`useEffect` com `[cliente.id, cliente.nome]` como deps:

```
GET /api/clientes/${cliente.id}/progresso?nome=${encodeURIComponent(cliente.nome)}
```

### Render — loading state

```jsx
<div style={{
  height: '6px', borderRadius: '3px', background: '#2a2a2a',
  marginTop: '0.5rem', overflow: 'hidden'
}}>
  <div style={{
    height: '100%', width: '40%', background: '#333',
    borderRadius: '3px',
    animation: 'pulse 1.5s ease-in-out infinite'
  }} />
</div>
```

(Animação `pulse` via `<style>` tag injetada inline ou keyframe em globals.css)

### Render — dado carregado

```jsx
{/* Barra de progresso */}
<div style={{ marginTop: '0.5rem' }}>
  <div style={{
    height: '4px', borderRadius: '2px', background: '#2a2a2a', position: 'relative'
  }}>
    <div style={{
      height: '100%',
      width: `${progresso.percentual}%`,
      background: '#E8640C',
      borderRadius: '2px',
      transition: 'width 0.3s ease'
    }} />
  </div>
  <span style={{ color: '#777', fontSize: '0.68rem', marginTop: '0.2rem', display: 'block' }}>
    {progresso.concluidas}/{progresso.total}
  </span>
</div>
```

### Posicionamento no card

Abaixo do nome do cliente, acima dos badges de status.

---

## 3. ClientesPage — estado de progresso agregado

### Estado novo

```ts
const [progressos, setProgressos] = useState<Record<string, ProgressoData>>({})
```

### Callback passado ao KanbanCard

```ts
onProgressoLoaded={(id, data) => setProgressos(p => ({ ...p, [id]: data }))}
```

### Passagem ao ModalDetalhes

```ts
progresso={progressos[clienteSelecionado.id] ?? null}
```

---

## 4. ModalDetalhes — seção "Progresso ORIUM™"

### Props novas

```ts
progresso: ProgressoData | null
```

### Fetch de fallback

Quando `progresso` for `null` (modal aberto pela vista Table, sem pré-carregamento):

```ts
const [progressoLocal, setProgressoLocal] = useState<ProgressoData | null>(null)
const [loadingProgressoLocal, setLoadingProgressoLocal] = useState(false)

useEffect(() => {
  if (progresso !== null) return   // já tem dado do card
  setLoadingProgressoLocal(true)
  fetch(`/api/clientes/${cliente.id}/progresso?nome=${encodeURIComponent(cliente.nome)}`)
    .then(r => r.json())
    .then(d => setProgressoLocal(d))
    .catch(() => {})
    .finally(() => setLoadingProgressoLocal(false))
}, [progresso, cliente.id, cliente.nome])

const progressoEfetivo = progresso ?? progressoLocal
```

### Posicionamento

Inserida na aba `info`, **entre** o health score e a seção "Documentos Gerados".

### Render

```jsx
<div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '0.875rem' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
    <p style={{ fontFamily: 'Anton, sans-serif', color: '#fff', fontSize: '0.75rem', letterSpacing: '0.12em', margin: 0, textTransform: 'uppercase' }}>
      PROGRESSO ORIUM™
    </p>
    <span style={{ color: '#E8640C', fontSize: '0.75rem', fontWeight: 700 }}>
      {progressoEfetivo.percentual}%
    </span>
  </div>

  {/* Barra geral */}
  <div style={{ height: '4px', borderRadius: '2px', background: '#2a2a2a', marginBottom: '0.875rem' }}>
    <div style={{ height: '100%', width: `${progressoEfetivo.percentual}%`, background: '#E8640C', borderRadius: '2px' }} />
  </div>

  {/* Lista de etapas */}
  {progressoEfetivo.etapas.map(etapa => (
    <div key={etapa.nome} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.85rem' }}>{etapa.concluida ? '✅' : '⬜'}</span>
        <span style={{ color: etapa.concluida ? '#ccc' : '#555', fontSize: '0.85rem' }}>{etapa.nome}</span>
      </div>
      {etapa.concluida && etapa.linkDrive && (
        <a href={etapa.linkDrive} target="_blank" rel="noopener noreferrer"
          style={{ color: '#E8640C', fontSize: '0.68rem', textDecoration: 'none', border: '1px solid rgba(232,100,12,0.3)', borderRadius: '4px', padding: '2px 8px' }}>
          → Drive
        </a>
      )}
    </div>
  ))}
</div>
```

---

## Edge cases

| Caso | Comportamento |
|---|---|
| Erro no fetch do card | `loadingProgresso: false`, barra não renderizada (silencioso) |
| Nenhum documento para o cliente | Barra 0% + todas as etapas ⬜ |
| Múltiplos docs do mesmo tipo | `concluida: true` desde que ao menos um exista |
| Modal aberto por Table sem cache | Fetch independente (fallback local) |
| Campo "Link Drive" ausente | `linkDrive: null`, link não exibido |

---

## Restrições

- Não alterar nenhuma funcionalidade existente (kanban drag, modal save/delete, dashboard, table view)
- Padrão visual: `#080808`, `#E8640C` para barra de progresso, `Anton` para títulos de seção, `Poppins` corpo — em linha com `CLAUDE.md`
- Sem dependências novas
