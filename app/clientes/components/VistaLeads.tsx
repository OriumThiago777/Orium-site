'use client'

import { useState, useEffect, type CSSProperties } from 'react'
import { authHeaders } from '@/lib/auth'
import type { Lead } from './types'

// ─── Leads ───────────────────────────────────────────────────────────────────
const LEAD_STATUS = ['Novo', 'Contatado', 'Em negociação', 'Fechado', 'Perdido']

const LEAD_STATUS_COR: Record<string, string> = {
  'Novo': '#3B82F6',
  'Contatado': '#EAB308',
  'Em negociação': '#FF6B00',
  'Fechado': '#22C55E',
  'Perdido': '#EF4444',
}

const NOTION_SELECT_COR: Record<string, string> = {
  default: '#9b9a97',
  gray: '#9b9a97',
  brown: '#9f6b53',
  orange: '#d9730d',
  yellow: '#cb912f',
  green: '#448361',
  blue: '#337ea9',
  purple: '#9065b0',
  pink: '#c14c8a',
  red: '#d44c47',
}

function formatDataHora(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${dd}/${mm}/${d.getFullYear()} ${hh}:${min}`
}

function truncarTexto(texto: string, max: number) {
  if (!texto) return '—'
  return texto.length > max ? texto.slice(0, max).trimEnd() + '…' : texto
}

function LeadStatusSelect({ lead, onChange }: { lead: Lead; onChange: (id: string, status: string) => void }) {
  const cor = LEAD_STATUS_COR[lead.status] || '#6B7280'
  return (
    <select
      value={lead.status}
      onChange={e => onChange(lead.id, e.target.value)}
      style={{
        background: `${cor}1a`, border: `1px solid ${cor}55`, borderRadius: '6px',
        padding: '0.3rem 0.6rem', color: cor, fontSize: '0.78rem', fontFamily: 'Poppins, sans-serif',
        cursor: 'pointer', outline: 'none',
      }}
    >
      {LEAD_STATUS.map(s => (
        <option key={s} value={s} style={{ background: '#0f0f0f', color: '#fff' }}>{s}</option>
      ))}
    </select>
  )
}

export function VistaLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [filtroSegmento, setFiltroSegmento] = useState('todos')

  useEffect(() => {
    setLoading(true)
    fetch('/api/leads', { headers: authHeaders() })
      .then(r => r.json())
      .then(d => setLeads(d.leads ?? []))
      .catch(() => setLeads([]))
      .finally(() => setLoading(false))
  }, [])

  async function handleStatusChange(id: string, status: string) {
    const anterior = leads
    setLeads(ls => ls.map(l => l.id === id ? { ...l, status } : l))
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ pageId: id, status }),
      })
      if (!res.ok) throw new Error('Falha ao atualizar status')
    } catch (err) {
      console.error('Erro ao atualizar status do lead:', err)
      setLeads(anterior)
    }
  }

  const segmentosDisponiveis = Array.from(new Set(leads.map(l => l.segmento).filter(Boolean)))

  const filtrados = leads
    .filter(l => {
      if (!busca.trim()) return true
      const termo = busca.toLowerCase()
      return l.nome.toLowerCase().includes(termo) || l.instagram.toLowerCase().includes(termo)
    })
    .filter(l => filtroStatus === 'todos' || l.status === filtroStatus)
    .filter(l => filtroSegmento === 'todos' || l.segmento === filtroSegmento)

  const COLS = ['Nome', 'Segmento', 'Instagram', 'Email', 'Necessidade', 'Status', 'Data']
  const selectStyle: CSSProperties = { background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '0.625rem 1rem', color: '#aaa', fontSize: '0.85rem', fontFamily: 'Poppins, sans-serif', outline: 'none', cursor: 'pointer' }

  return (
    <div>
      {/* Header da aba */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.6rem', color: '#fff', letterSpacing: '0.03em', marginBottom: '0.25rem' }}>LEADS RECEBIDOS</h2>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', color: '#999' }}>Contatos capturados pelo site</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ display: 'block', fontFamily: 'Anton, sans-serif', fontSize: '2.2rem', color: '#FF6B00', lineHeight: 1 }}>{leads.length}</span>
          <span style={{ fontSize: '0.7rem', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total</span>
        </div>
      </div>

      {/* Busca + filtros */}
      <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.875rem', pointerEvents: 'none', lineHeight: 1 }}>🔍</span>
          <input
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por nome ou Instagram..."
            style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '0.625rem 1rem 0.625rem 2.25rem', color: '#fff', fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
            onFocus={e => e.target.style.borderColor = '#FF6B00'}
            onBlur={e => e.target.style.borderColor = '#333'}
          />
        </div>
        <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} style={selectStyle}>
          <option value="todos">Todos os status</option>
          {LEAD_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filtroSegmento} onChange={e => setFiltroSegmento(e.target.value)} style={selectStyle}>
          <option value="todos">Todos os segmentos</option>
          {segmentosDisponiveis.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Tabela / Empty state */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: '#444', fontSize: '0.9rem' }}>Carregando leads...</div>
      ) : filtrados.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', color: '#333', textAlign: 'center' }}>
          <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📭</span>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem', color: '#333', maxWidth: '320px' }}>
            {leads.length === 0
              ? 'Nenhum lead ainda. Quando alguém preencher o formulário do site, aparece aqui.'
              : 'Nenhum lead encontrado com esses filtros.'}
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #1a1a1a', background: '#0f0f0f' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Poppins, sans-serif' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                {COLS.map(label => (
                  <th key={label} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#666', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, background: '#080808', whiteSpace: 'nowrap' }}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map(lead => {
                const segCor = NOTION_SELECT_COR[lead.segmentoCor] || NOTION_SELECT_COR.default
                const handle = lead.instagram.replace(/^@/, '').trim()
                return (
                  <tr key={lead.id}
                    style={{ borderBottom: '1px solid #141414', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#111'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '0.875rem 1rem', fontFamily: 'Anton, sans-serif', color: '#fff', fontSize: '0.95rem' }}>{lead.nome}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      {lead.segmento ? (
                        <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '20px', background: `${segCor}22`, border: `1px solid ${segCor}55`, color: segCor, fontSize: '0.75rem' }}>
                          {lead.segmento}
                        </span>
                      ) : <span style={{ color: '#555' }}>—</span>}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      {handle ? (
                        <a href={`https://instagram.com/${handle}`} target="_blank" rel="noopener noreferrer"
                          style={{ color: '#FF6B00', fontSize: '0.85rem', textDecoration: 'none' }}
                          onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                          onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
                          @{handle}
                        </a>
                      ) : <span style={{ color: '#555' }}>—</span>}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      {lead.email ? (
                        <a href={`mailto:${lead.email}`} style={{ color: '#aaa', fontSize: '0.85rem', textDecoration: 'none' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#FF6B00'}
                          onMouseLeave={e => e.currentTarget.style.color = '#aaa'}>
                          {lead.email}
                        </a>
                      ) : <span style={{ color: '#555' }}>—</span>}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#999', fontSize: '0.85rem', maxWidth: '240px' }} title={lead.necessidade || undefined}>
                      {truncarTexto(lead.necessidade, 60)}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <LeadStatusSelect lead={lead} onChange={handleStatusChange} />
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#777', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{formatDataHora(lead.data)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
