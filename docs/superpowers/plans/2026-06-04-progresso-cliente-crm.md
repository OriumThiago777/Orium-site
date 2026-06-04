# Progresso do Cliente no CRM — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mostrar o progresso das 7 etapas do Método ORIUM™ por cliente — barra visual no Kanban e checklist detalhado no modal — calculado em tempo real a partir da database Documentos Gerados no Notion.

**Architecture:** Nova API route consulta NOTION_DB_DOCUMENTOS filtrando por nome do cliente e mapeia quais das 7 etapas possuem documento gerado. O KanbanCard faz fetch próprio e notifica o ClientesPage (estado agregado). O ModalDetalhes recebe o dado via prop, com fallback para fetch próprio quando aberto pela vista Table.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Notion API v2022-06-28, inline styles (sem Tailwind)

---

## File Map

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `app/api/clientes/[id]/progresso/route.ts` | **Criar** | Consultar Notion e calcular progresso por cliente |
| `app/globals.css` | **Modificar** | Adicionar keyframe `@keyframes orium-pulse` para loading |
| `app/clientes/page.tsx` | **Modificar** | Tipo `ProgressoData`, estado agregado, KanbanCard, ModalDetalhes |

---

## Task 1: Criar a API route de progresso

**Files:**
- Create: `app/api/clientes/[id]/progresso/route.ts`

- [ ] **Criar o arquivo** com o conteúdo abaixo:

```typescript
import { NextResponse } from 'next/server'

const NOTION_TOKEN = process.env.NOTION_TOKEN
const DB_ID = process.env.NOTION_DB_DOCUMENTOS

const NH = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Content-Type': 'application/json',
  'Notion-Version': '2022-06-28',
}

const ETAPAS = [
  'Raio-X', 'Briefing', 'Proposta', 'Contrato',
  'Calendário', 'Relatório', 'Checklist',
] as const

type EtapaDoc = {
  properties: {
    Tipo?: { select?: { name: string } | null }
    'Link Drive'?: { url?: string | null }
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const nome = searchParams.get('nome')
    if (!nome) {
      return NextResponse.json({ error: 'Parâmetro nome obrigatório' }, { status: 400 })
    }

    const res = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: 'POST',
      headers: NH,
      body: JSON.stringify({
        filter: { property: 'Cliente', rich_text: { equals: nome } },
        page_size: 20,
      }),
    })

    if (!res.ok) {
      console.error('Notion progresso error:', await res.json())
      return NextResponse.json({ error: 'Erro ao buscar documentos' }, { status: 500 })
    }

    const data = await res.json()
    const docs = (data.results ?? []) as EtapaDoc[]

    const docMap = new Map<string, string | null>()
    for (const doc of docs) {
      const tipo = doc.properties.Tipo?.select?.name
      if (tipo && !docMap.has(tipo)) {
        docMap.set(tipo, doc.properties['Link Drive']?.url ?? null)
      }
    }

    const etapas = ETAPAS.map(etapaNome => ({
      nome: etapaNome,
      concluida: docMap.has(etapaNome),
      linkDrive: docMap.get(etapaNome) ?? null,
    }))

    const concluidas = etapas.filter(e => e.concluida).length

    return NextResponse.json({
      etapas,
      total: 7,
      concluidas,
      percentual: Math.round((concluidas / 7) * 100),
    })
  } catch (err) {
    console.error('GET /api/clientes/[id]/progresso:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
```

- [ ] **Verificar** que a pasta `app/api/clientes/[id]/` foi criada corretamente (o `[id]` é um segmento dinâmico do Next.js — o nome da pasta deve ser literalmente `[id]`).

---

## Task 2: Adicionar keyframe de loading ao globals.css

**Files:**
- Modify: `app/globals.css`

- [ ] **Adicionar ao final** de `app/globals.css`:

```css
@keyframes orium-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
```

---

## Task 3: Adicionar tipo `ProgressoData` em `app/clientes/page.tsx`

**Files:**
- Modify: `app/clientes/page.tsx` — inserir tipo após a linha `type Atividade = { ... }` (linha ~35)

- [ ] **Inserir** o tipo `ProgressoData` logo após o bloco do tipo `Atividade`:

```typescript
type ProgressoData = {
  etapas: Array<{ nome: string; concluida: boolean; linkDrive: string | null }>
  total: number
  concluidas: number
  percentual: number
}
```

---

## Task 4: Adicionar estado `progressos` ao `ClientesPage` e wiring

**Files:**
- Modify: `app/clientes/page.tsx` — função `ClientesPage` (linha ~1084)

- [ ] **Adicionar** a linha de estado `progressos` logo após a declaração de `atividades` (por volta da linha 1097):

```typescript
const [progressos, setProgressos] = useState<Record<string, ProgressoData>>({})
```

- [ ] **Localizar** onde `KanbanColuna` recebe `onSelect` e adicionar o callback `onProgressoLoaded`. Dentro do `DndContext`, a chamada de `KanbanColuna` passa `onSelect` — precisamos propagar o callback até o `KanbanCard`. Substituir o bloco do `DndContext` (aproximadamente linhas 1273–1288) pelo seguinte:

```tsx
<DndContext
  sensors={sensors}
  onDragStart={() => { justDraggedRef.current = false }}
  onDragEnd={handleDragEnd}
>
  <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem', alignItems: 'flex-start' }}>
    {FASES.map(fase => (
      <KanbanColuna key={fase.nome} fase={fase.nome} cor={fase.cor}
        clientes={clientesFiltrados.filter(c => c.faseAtual === fase.nome)}
        progressos={progressos}
        onProgressoLoaded={(id, data) => setProgressos(p => ({ ...p, [id]: data }))}
        onSelect={(c) => {
          if (justDraggedRef.current) return
          setClienteSelecionado(c)
        }} />
    ))}
  </div>
</DndContext>
```

- [ ] **Localizar** onde `ModalDetalhes` é renderizado (aproximadamente linha 1332) e adicionar a prop `progresso`:

```tsx
{clienteSelecionado && (
  <ModalDetalhes
    cliente={clienteSelecionado}
    onClose={() => setClienteSelecionado(null)}
    onUpdated={updated => setClientes(cs => cs.map(c => c.id === updated.id ? updated : c))}
    onDeleted={id => setClientes(cs => cs.filter(c => c.id !== id))}
    atividades={atividades}
    loadingAtividades={loadingAtividades}
    atividadesExpandidas={atividadesExpandidas}
    setAtividadesExpandidas={setAtividadesExpandidas}
    progresso={progressos[clienteSelecionado.id] ?? null} />
)}
```

---

## Task 5: Atualizar `KanbanColuna` para propagar `progressos` e `onProgressoLoaded`

**Files:**
- Modify: `app/clientes/page.tsx` — componente `KanbanColuna` (linha ~730)

- [ ] **Substituir** a definição do componente `KanbanColuna` (função + props) pelo seguinte:

```typescript
function KanbanColuna({ fase, cor, clientes, progressos, onProgressoLoaded, onSelect }: {
  fase: string
  cor: string
  clientes: Cliente[]
  progressos: Record<string, ProgressoData>
  onProgressoLoaded: (id: string, data: ProgressoData) => void
  onSelect: (c: Cliente) => void
}) {
```

- [ ] **Dentro de `KanbanColuna`**, onde os `KanbanCard` são renderizados, adicionar as props novas:

```tsx
{clientes.map(c => (
  <KanbanCard
    key={c.id}
    cliente={c}
    faseCor={cor}
    progresso={progressos[c.id] ?? null}
    onProgressoLoaded={onProgressoLoaded}
    onSelect={() => onSelect(c)}
  />
))}
```

---

## Task 6: Atualizar `KanbanCard` com fetch de progresso e barra visual

**Files:**
- Modify: `app/clientes/page.tsx` — componente `KanbanCard` (linha ~674)

- [ ] **Substituir** a definição completa do componente `KanbanCard` pelo seguinte:

```typescript
function KanbanCard({ cliente, faseCor, progresso, onProgressoLoaded, onSelect }: {
  cliente: Cliente
  faseCor: string
  progresso: ProgressoData | null
  onProgressoLoaded: (id: string, data: ProgressoData) => void
  onSelect: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: cliente.id })
  const health = getHealthScore(cliente)
  const semContato = diasDesdeInteracao(cliente) > 14
  const healthTooltip = health.motivos[0]
  const [loadingProgresso, setLoadingProgresso] = useState(progresso === null)

  useEffect(() => {
    if (progresso !== null) { setLoadingProgresso(false); return }
    setLoadingProgresso(true)
    fetch(`/api/clientes/${encodeURIComponent(cliente.id)}/progresso?nome=${encodeURIComponent(cliente.nome)}`)
      .then(r => r.json())
      .then((data: ProgressoData) => {
        onProgressoLoaded(cliente.id, data)
        setLoadingProgresso(false)
      })
      .catch(() => setLoadingProgresso(false))
  }, [cliente.id, cliente.nome]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onSelect}
      style={{
        background: '#1a1a1a',
        border: '1px solid #222',
        borderLeft: `3px solid ${faseCor}`,
        borderRadius: '8px',
        padding: '0.875rem 1rem',
        cursor: isDragging ? 'grabbing' : 'grab',
        marginBottom: '0.5rem',
        userSelect: 'none',
        opacity: isDragging ? 0.5 : 1,
        transform: CSS.Transform.toString(transform),
        zIndex: isDragging ? 50 : undefined,
        position: 'relative',
        boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,0.6)' : undefined,
        transition: isDragging ? undefined : 'border-color 0.15s, opacity 0.15s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.375rem' }}>
        <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.3, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cliente.nome}</span>
        <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center', flexShrink: 0, marginLeft: '0.5rem' }}>
          {cliente.precisaRelatorio && <span title="Precisa relatório" style={{ fontSize: '0.8rem' }}>📊</span>}
          <div title={healthTooltip} style={{ width: '10px', height: '10px', borderRadius: '50%', background: HEALTH_COR[health.cor], flexShrink: 0 }} />
        </div>
      </div>

      {/* Barra de progresso */}
      {loadingProgresso ? (
        <div style={{ height: '4px', borderRadius: '2px', background: '#2a2a2a', marginBottom: '0.375rem', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '45%', background: '#383838', borderRadius: '2px', animation: 'orium-pulse 1.5s ease-in-out infinite' }} />
        </div>
      ) : progresso !== null ? (
        <div style={{ marginBottom: '0.375rem' }}>
          <div style={{ height: '4px', borderRadius: '2px', background: '#2a2a2a', position: 'relative', marginBottom: '0.2rem' }}>
            <div style={{ height: '100%', width: `${progresso.percentual}%`, background: '#E8640C', borderRadius: '2px', transition: 'width 0.4s ease' }} />
          </div>
          <span style={{ color: '#666', fontSize: '0.66rem' }}>{progresso.concluidas}/{progresso.total}</span>
        </div>
      ) : null}

      <div style={{ marginBottom: '0.375rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center' }}>
        <StatusBadge status={cliente.status} />
        {semContato && (
          <span style={{ fontSize: '0.7rem', background: 'rgba(234,179,8,0.15)', color: '#EAB308', borderRadius: '4px', padding: '2px 6px' }}>⚠ Sem contato</span>
        )}
      </div>
      {cliente.proximoDeliverable && (
        <div style={{ fontSize: '0.78rem', marginTop: '0.375rem' }}>
          <DeliverableLabel dateStr={cliente.proximoDeliverable} />
        </div>
      )}
    </div>
  )
}
```

---

## Task 7: Atualizar `ModalDetalhes` com seção Progresso ORIUM™

**Files:**
- Modify: `app/clientes/page.tsx` — componente `ModalDetalhes` (linha ~307)

- [ ] **Adicionar** `progresso: ProgressoData | null` na assinatura de props do `ModalDetalhes`:

```typescript
function ModalDetalhes({ cliente, onClose, onUpdated, onDeleted, atividades, loadingAtividades, atividadesExpandidas, setAtividadesExpandidas, progresso }: {
  cliente: Cliente
  onClose: () => void
  onUpdated: (c: Cliente) => void
  onDeleted: (id: string) => void
  atividades: Atividade[]
  loadingAtividades: boolean
  atividadesExpandidas: boolean
  setAtividadesExpandidas: (f: boolean | ((prev: boolean) => boolean)) => void
  progresso: ProgressoData | null
}) {
```

- [ ] **Adicionar** as seguintes linhas de estado logo após as declarações de estado existentes no início do corpo da função `ModalDetalhes` (após `const [expandirNotas, setExpandirNotas] = useState(false)`):

```typescript
  const [progressoLocal, setProgressoLocal] = useState<ProgressoData | null>(null)
  const [loadingProgressoLocal, setLoadingProgressoLocal] = useState(false)

  useEffect(() => {
    if (progresso !== null) return
    setLoadingProgressoLocal(true)
    fetch(`/api/clientes/${encodeURIComponent(cliente.id)}/progresso?nome=${encodeURIComponent(cliente.nome)}`)
      .then(r => r.json())
      .then((data: ProgressoData) => setProgressoLocal(data))
      .catch(() => {})
      .finally(() => setLoadingProgressoLocal(false))
  }, [progresso, cliente.id, cliente.nome])

  const progressoEfetivo = progresso ?? progressoLocal
```

- [ ] **Localizar** o bloco de `tab === 'info'` no JSX do modal. Inserir a seção de progresso **após** o bloco do health score (após o `})()}`) e **antes** do label `labelStyle` do campo Nome. O trecho a inserir:

```tsx
{/* Progresso ORIUM™ */}
{(progressoEfetivo || loadingProgressoLocal) && (
  <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '0.875rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
      <p style={{ fontFamily: 'Anton, sans-serif', color: '#fff', fontSize: '0.75rem', letterSpacing: '0.12em', margin: 0, textTransform: 'uppercase' }}>
        PROGRESSO ORIUM™
      </p>
      {progressoEfetivo && (
        <span style={{ color: '#E8640C', fontSize: '0.78rem', fontWeight: 700 }}>
          {progressoEfetivo.concluidas}/{progressoEfetivo.total} — {progressoEfetivo.percentual}%
        </span>
      )}
    </div>

    {loadingProgressoLocal && !progressoEfetivo ? (
      <div style={{ height: '4px', borderRadius: '2px', background: '#2a2a2a', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: '45%', background: '#383838', borderRadius: '2px', animation: 'orium-pulse 1.5s ease-in-out infinite' }} />
      </div>
    ) : progressoEfetivo ? (
      <>
        <div style={{ height: '4px', borderRadius: '2px', background: '#2a2a2a', marginBottom: '0.75rem' }}>
          <div style={{ height: '100%', width: `${progressoEfetivo.percentual}%`, background: '#E8640C', borderRadius: '2px', transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {progressoEfetivo.etapas.map(etapa => (
            <div key={etapa.nome} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem' }}>{etapa.concluida ? '✅' : '⬜'}</span>
                <span style={{ color: etapa.concluida ? '#ccc' : '#555', fontSize: '0.82rem' }}>{etapa.nome}</span>
              </div>
              {etapa.concluida && etapa.linkDrive && (
                <a href={etapa.linkDrive} target="_blank" rel="noopener noreferrer"
                  style={{ color: '#E8640C', fontSize: '0.68rem', textDecoration: 'none', border: '1px solid rgba(232,100,12,0.3)', borderRadius: '4px', padding: '2px 8px', transition: 'background 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,100,12,0.15)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                  → Drive
                </a>
              )}
            </div>
          ))}
        </div>
      </>
    ) : null}
  </div>
)}
```

---

## Task 8: Verificar build + testar manualmente

- [ ] **Rodar** `npm run dev` no diretório `orium-site`

```
cd orium-site
npm run dev
```

- [ ] **Abrir** `http://localhost:3000/clientes` e autenticar

- [ ] **Verificar** nos cards Kanban:
  - Cards mostram barra de loading cinza animada por ~1s
  - Barra laranja `#E8640C` com proporção correta aparece após carregamento
  - Texto `N/7` abaixo da barra

- [ ] **Verificar** no modal (clicar em um cliente):
  - Seção "PROGRESSO ORIUM™" aparece na aba INFO, acima dos campos de edição
  - Lista as 7 etapas com ✅ ou ⬜
  - Percentual exibido no header da seção

- [ ] **Verificar** fallback (opcional): abrir um cliente pela vista Table — modal deve mostrar progresso via fetch próprio

---

## Task 9: Commit

- [ ] **Fazer commit** com a mensagem especificada:

```bash
git add app/api/clientes/[id]/progresso/route.ts app/globals.css app/clientes/page.tsx
git commit -m "feat: progresso do cliente no CRM — barra visual + checklist por etapa"
```

---

## Self-Review

**Spec coverage:**
- ✅ API route `app/api/clientes/[id]/progresso/route.ts` → Task 1
- ✅ Barra de progresso no KanbanCard → Tasks 5 e 6
- ✅ Loading state animado → Tasks 2 e 6
- ✅ Seção "Progresso ORIUM™" no modal → Task 7
- ✅ Link para Drive por etapa → Task 7
- ✅ Fallback fetch no modal (Table view) → Task 7
- ✅ Cor `#E8640C`, fundo `#2a2a2a` → Tasks 6 e 7
- ✅ Padrão visual CLAUDE.md (Anton, Poppins, #080808) → mantido em todos os tasks

**Type consistency:**
- `ProgressoData` definido em Task 3 — usado em Tasks 4, 6, 7 ✅
- `onProgressoLoaded: (id: string, data: ProgressoData) => void` — definido em Task 5, implementado em Task 6 ✅
- Props do `KanbanCard`: `progresso`, `onProgressoLoaded` — passadas em Task 5, recebidas em Task 6 ✅
- Props do `ModalDetalhes`: `progresso` — passada em Task 4, recebida em Task 7 ✅

**Placeholder scan:** Nenhum TBD, TODO ou passo sem código. ✅
