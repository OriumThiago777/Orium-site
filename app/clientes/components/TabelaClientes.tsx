'use client'

import type { Cliente, OrdenarPor } from './types'
import {
  getHealthScore,
  formatBRL,
  StatusBadge,
  FaseBadge,
  HealthBadge,
  DeliverableLabel,
} from './shared'

// ─── Vista Table ──────────────────────────────────────────────────────────────
export function VistaTable({
  clientes, onSelect, ordenarPor, ordenarDir, onOrdenar, filtroUrgente, onLimparUrgente, filtroStatus, onFiltroStatus,
}: {
  clientes: Cliente[]
  onSelect: (c: Cliente) => void
  ordenarPor: OrdenarPor
  ordenarDir: 'asc' | 'desc'
  onOrdenar: (col: OrdenarPor) => void
  filtroUrgente: boolean
  onLimparUrgente: () => void
  filtroStatus: string
  onFiltroStatus: (f: string) => void
}) {
  const filtros = ['todos', 'Ativo', 'Inativo', 'Proposta']
  const counts: Record<string, number> = { todos: clientes.length, Ativo: 0, Inativo: 0, Proposta: 0 }
  clientes.forEach(c => { if (counts[c.status] !== undefined) counts[c.status]++ })

  const today = new Date(); today.setHours(0, 0, 0, 0)

  function isUrgenteCliente(c: Cliente): boolean {
    if (!c.proximoDeliverable) return false
    const dt = new Date(c.proximoDeliverable + 'T00:00:00')
    const diff = Math.floor((dt.getTime() - today.getTime()) / 86400000)
    return diff <= 7
  }

  let filtered = filtroStatus === 'todos' ? clientes : clientes.filter(c => c.status === filtroStatus)
  if (filtroUrgente) filtered = filtered.filter(isUrgenteCliente)

  const sorted = [...filtered].sort((a, b) => {
    let va: string | number | null = null
    let vb: string | number | null = null
    if (ordenarPor === 'nome') { va = a.nome.toLowerCase(); vb = b.nome.toLowerCase() }
    else if (ordenarPor === 'dataInicio') { va = a.dataInicio || null; vb = b.dataInicio || null }
    else if (ordenarPor === 'proximoDeliverable') { va = a.proximoDeliverable || null; vb = b.proximoDeliverable || null }
    else if (ordenarPor === 'valorMensal') { va = a.valorMensal; vb = b.valorMensal }
    if (va === null && vb === null) return 0
    if (va === null) return 1
    if (vb === null) return -1
    const cmp = typeof va === 'number' && typeof vb === 'number'
      ? va - vb
      : String(va).localeCompare(String(vb))
    return ordenarDir === 'asc' ? cmp : -cmp
  })

  type ColDef = { label: string; col: OrdenarPor | null }
  const COLS: ColDef[] = [
    { label: 'Nome', col: 'nome' },
    { label: 'Status', col: null },
    { label: 'Fase Atual', col: null },
    { label: 'Saúde', col: null },
    { label: 'Próximo Deliverable', col: 'proximoDeliverable' },
    { label: 'Valor Mensal', col: 'valorMensal' },
    { label: 'Ações', col: null },
  ]

  return (
    <div>
      {/* Filtros de status */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {filtros.map(f => (
          <button key={f} onClick={() => onFiltroStatus(f)}
            style={{ padding: '0.375rem 1rem', borderRadius: '20px', border: `1px solid ${filtroStatus === f ? '#FF6B00' : '#333'}`, background: filtroStatus === f ? 'rgba(255,107,0,0.15)' : 'transparent', color: filtroStatus === f ? '#FF6B00' : '#777', fontSize: '0.82rem', fontFamily: 'Poppins, sans-serif', cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.05em' }}>
            {f === 'todos' ? 'Todos' : f} ({counts[f] ?? 0})
          </button>
        ))}
        {filtroUrgente && (
          <button onClick={onLimparUrgente}
            style={{ padding: '0.375rem 1rem', borderRadius: '20px', border: '1px solid #FF6B00', background: 'rgba(255,107,0,0.15)', color: '#FF6B00', fontSize: '0.82rem', fontFamily: 'Poppins, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', transition: 'all 0.15s' }}>
            Entregas urgentes <span style={{ fontWeight: 700 }}>×</span>
          </button>
        )}
      </div>

      {/* Tabela */}
      <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #1a1a1a' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Poppins, sans-serif' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
              {COLS.map(h => (
                <th key={h.label}
                  onClick={h.col ? () => onOrdenar(h.col!) : undefined}
                  style={{ padding: '0.75rem 1rem', textAlign: 'left', color: h.col && ordenarPor === h.col ? '#FF6B00' : '#555', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, background: '#0d0d0d', whiteSpace: 'nowrap', cursor: h.col ? 'pointer' : 'default', userSelect: 'none', transition: 'color 0.15s' }}>
                  {h.label}
                  {h.col && (
                    <span style={{ marginLeft: '0.25rem', fontSize: '0.68rem', opacity: 0.8 }}>
                      {ordenarPor === h.col ? (ordenarDir === 'asc' ? '↑' : '↓') : '·'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#555', fontSize: '0.9rem' }}>Nenhum cliente encontrado</td></tr>
            ) : (
              sorted.map(c => {
                const health = getHealthScore(c)
                const healthTooltip = health.motivos[0]
                return (
                  <tr key={c.id} onClick={() => onSelect(c)}
                    style={{ borderBottom: '1px solid #141414', cursor: 'pointer', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#151515'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '0.875rem 1rem', color: '#e0e0e0', fontWeight: 500, fontSize: '0.9rem' }}>{c.nome}</td>
                    <td style={{ padding: '0.875rem 1rem' }}><StatusBadge status={c.status} /></td>
                    <td style={{ padding: '0.875rem 1rem' }}><FaseBadge fase={c.faseAtual} /></td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <HealthBadge health={health} />
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}><DeliverableLabel dateStr={c.proximoDeliverable} /></td>
                    <td style={{ padding: '0.875rem 1rem', color: '#aaa', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{formatBRL(c.valorMensal)}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <button style={{ background: 'transparent', border: '1px solid #333', borderRadius: '6px', padding: '0.3rem 0.75rem', color: '#777', fontSize: '0.78rem', fontFamily: 'Poppins, sans-serif', cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B00'; e.currentTarget.style.color = '#FF6B00' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#777' }}>
                        Ver
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
