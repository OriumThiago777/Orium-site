'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { isAuthenticated, saveAuth } from '@/lib/auth'
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

type OrdenarPor = 'nome' | 'dataInicio' | 'proximoDeliverable' | 'valorMensal'

type Cliente = {
  id: string
  nome: string
  status: 'Ativo' | 'Inativo' | 'Proposta' | string
  faseAtual: 'Diagnóstico' | 'Estruturação Inicial' | 'Conteúdo e Comunicação' | 'Expansão Digital' | 'Pausado' | 'Finalizado' | string
  instagram: string
  email: string
  contato: string
  dataInicio: string
  ultimaInteracao: string
  proximoDeliverable: string
  precisaRelatorio: boolean
  notas: string
  valorMensal: number | null
}

const FASES: { nome: string; cor: string }[] = [
  { nome: 'Diagnóstico', cor: '#FF6B00' },
  { nome: 'Estruturação Inicial', cor: '#3B82F6' },
  { nome: 'Conteúdo e Comunicação', cor: '#8B5CF6' },
  { nome: 'Expansão Digital', cor: '#EC4899' },
  { nome: 'Pausado', cor: '#6B7280' },
  { nome: 'Finalizado', cor: '#22C55E' },
]

const FASE_COR: Record<string, string> = Object.fromEntries(FASES.map(f => [f.nome, f.cor]))

const STATUS_COR: Record<string, string> = {
  'Ativo': '#22C55E',
  'Inativo': '#6B7280',
  'Proposta': '#3B82F6',
}

const HEALTH_COR: Record<string, string> = {
  verde: '#22C55E',
  amarelo: '#EAB308',
  vermelho: '#ef4444',
}

const BG_STYLE = 'radial-gradient(ellipse at 20% 50%, rgba(255,107,0,0.05) 0%, transparent 60%), linear-gradient(to bottom, #080808 0%, transparent 30%, transparent 70%, #080808 100%)'

function BgImage() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Image src="/hero.jpg" alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.07 }} />
      <div style={{ position: 'absolute', inset: 0, background: BG_STYLE }} />
    </div>
  )
}

function formatBRL(value: number | null) {
  if (value === null) return '—'
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

function deliverableUrgency(dateStr: string): 'vencido' | 'urgente' | 'normal' | 'sem' {
  if (!dateStr) return 'sem'
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const dt = new Date(dateStr + 'T00:00:00')
  const diff = Math.floor((dt.getTime() - today.getTime()) / 86400000)
  if (diff < 0) return 'vencido'
  if (diff <= 1) return 'urgente'
  return 'normal'
}

function diasDesdeInteracao(cliente: Cliente): number {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const refStr = cliente.ultimaInteracao || cliente.dataInicio
  if (!refStr) return 9999
  const ref = new Date(refStr + 'T00:00:00')
  return Math.floor((today.getTime() - ref.getTime()) / 86400000)
}

function getHealthScore(cliente: Cliente): 'verde' | 'amarelo' | 'vermelho' {
  if (cliente.precisaRelatorio) return 'vermelho'
  if (cliente.proximoDeliverable) {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const dt = new Date(cliente.proximoDeliverable + 'T00:00:00')
    if (dt < today) return 'vermelho'
  }
  if (diasDesdeInteracao(cliente) > 14) return 'amarelo'
  return 'verde'
}

function DeliverableLabel({ dateStr }: { dateStr: string }) {
  const urgency = deliverableUrgency(dateStr)
  if (urgency === 'sem') return <span style={{ color: '#555' }}>Sem prazo</span>
  const colors: Record<string, string> = { vencido: '#ef4444', urgente: '#FF6B00', normal: '#777' }
  const icons: Record<string, string> = { vencido: ' ⚠', urgente: ' 🔔', normal: '' }
  return <span style={{ color: colors[urgency], fontSize: '0.82rem' }}>{formatDate(dateStr)}{icons[urgency]}</span>
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '20px',
      fontSize: '0.72rem',
      fontWeight: 600,
      background: `${STATUS_COR[status] ?? '#6B7280'}22`,
      color: STATUS_COR[status] ?? '#6B7280',
      border: `1px solid ${STATUS_COR[status] ?? '#6B7280'}44`,
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
    }}>
      {status || '—'}
    </span>
  )
}

function FaseBadge({ fase }: { fase: string }) {
  const cor = FASE_COR[fase] ?? '#555'
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '20px',
      fontSize: '0.72rem',
      fontWeight: 600,
      background: `${cor}22`,
      color: cor,
      border: `1px solid ${cor}44`,
      letterSpacing: '0.03em',
    }}>
      {fase || '—'}
    </span>
  )
}

// ─── Modal Novo Cliente ──────────────────────────────────────────────────────
function ModalNovoCliente({ onClose, onCreated }: { onClose: () => void; onCreated: (c: Cliente) => void }) {
  const [form, setForm] = useState({ nome: '', status: 'Proposta', faseAtual: 'Diagnóstico', instagram: '', email: '', contato: '' })
  const [loading, setLoading] = useState(false)

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) { onCreated(data); onClose() }
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = { width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }
  const labelStyle: React.CSSProperties = { display: 'block', color: '#aaa', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.375rem' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '480px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.6rem', color: '#fff', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>NOVO CLIENTE</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Nome *</label>
            <input value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Nome do cliente" required style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'}>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
                <option value="Proposta">Proposta</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Fase Atual</label>
              <select value={form.faseAtual} onChange={e => set('faseAtual', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'}>
                {FASES.map(f => <option key={f.nome} value={f.nome}>{f.nome}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Instagram</label>
            <input value={form.instagram} onChange={e => set('instagram', e.target.value)} placeholder="@handle" style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>E-mail</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@..." style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'} />
            </div>
            <div>
              <label style={labelStyle}>Contato</label>
              <input type="tel" value={form.contato} onChange={e => set('contato', e.target.value)} placeholder="(XX) XXXXX-XXXX" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" disabled={loading || !form.nome.trim()} style={{ flex: 1, background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '0.875rem', color: '#fff', fontFamily: 'Anton, sans-serif', fontSize: '0.95rem', letterSpacing: '0.12em', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, transition: 'opacity 0.15s' }}>
              {loading ? 'CRIANDO...' : 'CRIAR'}
            </button>
            <button type="button" onClick={onClose} style={{ flex: 1, background: 'transparent', border: '1px solid #333', borderRadius: '8px', padding: '0.875rem', color: '#777', fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#ccc' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#777' }}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Modal Detalhes ──────────────────────────────────────────────────────────
function ModalDetalhes({ cliente, onClose, onUpdated, onDeleted }: {
  cliente: Cliente
  onClose: () => void
  onUpdated: (c: Cliente) => void
  onDeleted: (id: string) => void
}) {
  const [form, setForm] = useState<Cliente>({ ...cliente })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [tab, setTab] = useState<'info' | 'acoes'>('info')

  const set = (k: keyof Cliente, v: unknown) => setForm(p => ({ ...p, [k]: v }))

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/clientes?id=${cliente.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) { onUpdated(data); onClose() }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/clientes?id=${cliente.id}`, { method: 'DELETE' })
      if (res.ok) { onDeleted(cliente.id); onClose() }
    } finally {
      setDeleting(false)
    }
  }

  const inputStyle: React.CSSProperties = { width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '0.65rem 0.875rem', color: '#fff', fontSize: '0.88rem', fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }
  const labelStyle: React.CSSProperties = { display: 'block', color: '#777', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }
  const actionBtnStyle: React.CSSProperties = { display: 'block', width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '0.75rem 1rem', color: '#aaa', fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif', textAlign: 'left', cursor: 'pointer', textDecoration: 'none', transition: 'all 0.15s', marginBottom: '0.5rem' }

  const urgency = deliverableUrgency(form.proximoDeliverable)
  const deliverableBorder = urgency === 'vencido' ? '#ef4444' : urgency === 'urgente' ? '#FF6B00' : '#333'

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', width: '100%', maxWidth: '580px', position: 'relative', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem 2rem 1rem', borderBottom: '1px solid #1a1a1a', flexShrink: 0 }}>
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.5rem', color: '#fff', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{cliente.nome.toUpperCase()}</h2>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <StatusBadge status={form.status} />
            <FaseBadge fase={form.faseAtual} />
          </div>
        </div>
        <div style={{ display: 'flex', borderBottom: '1px solid #1a1a1a', flexShrink: 0 }}>
          {(['info', 'acoes'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: 'none', borderBottom: `2px solid ${tab === t ? '#FF6B00' : 'transparent'}`, color: tab === t ? '#fff' : '#555', fontFamily: 'Anton, sans-serif', fontSize: '0.85rem', letterSpacing: '0.1em', cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.15s' }}>
              {t === 'info' ? 'INFO' : 'AÇÕES'}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem' }}>
          {tab === 'info' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label style={labelStyle}>Nome</label>
                <input value={form.nome} onChange={e => set('nome', e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select value={form.status} onChange={e => set('status', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'}>
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                    <option value="Proposta">Proposta</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Fase Atual</label>
                  <select value={form.faseAtual} onChange={e => set('faseAtual', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'}>
                    {FASES.map(f => <option key={f.nome} value={f.nome}>{f.nome}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Instagram</label>
                <input value={form.instagram} onChange={e => set('instagram', e.target.value)} placeholder="@handle" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>E-mail</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'} />
                </div>
                <div>
                  <label style={labelStyle}>Contato</label>
                  <input type="tel" value={form.contato} onChange={e => set('contato', e.target.value)} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Data de Início</label>
                  <input type="date" value={form.dataInicio} onChange={e => set('dataInicio', e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }}
                    onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'} />
                </div>
                <div>
                  <label style={labelStyle}>Última Interação</label>
                  <input type="date" value={form.ultimaInteracao} onChange={e => set('ultimaInteracao', e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }}
                    onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Próximo Deliverable</label>
                <input type="date" value={form.proximoDeliverable} onChange={e => set('proximoDeliverable', e.target.value)}
                  style={{ ...inputStyle, colorScheme: 'dark', borderColor: deliverableBorder }}
                  onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = deliverableBorder} />
              </div>
              <div>
                <label style={labelStyle}>Valor Mensal (R$)</label>
                <input type="number" value={form.valorMensal ?? ''} onChange={e => set('valorMensal', e.target.value ? Number(e.target.value) : null)}
                  placeholder="0,00" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'} />
              </div>
              <div>
                <label style={labelStyle}>Notas</label>
                <textarea rows={3} value={form.notas} onChange={e => set('notas', e.target.value)} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'} />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.precisaRelatorio} onChange={e => set('precisaRelatorio', e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#FF6B00', cursor: 'pointer' }} />
                  <span style={{ color: '#aaa', fontSize: '0.875rem' }}>Precisa de relatório</span>
                </label>
              </div>
            </div>
          )}
          {tab === 'acoes' && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p style={{ color: '#555', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Ferramentas vinculadas</p>
              {[
                { label: '📄 Gerar Relatório', href: `/relatorio?cliente=${encodeURIComponent(cliente.nome)}` },
                { label: '✅ Gerar Checklist', href: `/checklist?cliente=${encodeURIComponent(cliente.nome)}` },
                { label: '📁 Ver Documentos', href: '/meus-documentos' },
                { label: '🔍 Novo Raio-X', href: `/raio-x?cliente=${encodeURIComponent(cliente.nome)}` },
                { label: '📋 Nova Proposta', href: `/proposta?cliente=${encodeURIComponent(cliente.nome)}` },
              ].map(item => (
                <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" style={actionBtnStyle}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B00'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#aaa' }}>
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
        <div style={{ padding: '1rem 2rem', borderTop: '1px solid #1a1a1a', display: 'flex', gap: '0.625rem', flexShrink: 0 }}>
          <button onClick={handleSave} disabled={saving} style={{ flex: 2, background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '0.75rem', color: '#fff', fontFamily: 'Anton, sans-serif', fontSize: '0.9rem', letterSpacing: '0.12em', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1, transition: 'opacity 0.15s' }}>
            {saving ? 'SALVANDO...' : 'SALVAR'}
          </button>
          <button onClick={onClose} style={{ flex: 1, background: 'transparent', border: '1px solid #333', borderRadius: '8px', padding: '0.75rem', color: '#777', fontFamily: 'Poppins, sans-serif', fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#ccc' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#777' }}>
            Fechar
          </button>
          {confirmDelete ? (
            <button onClick={handleDelete} disabled={deleting} style={{ flex: 1, background: '#ef444422', border: '1px solid #ef4444', borderRadius: '8px', padding: '0.75rem', color: '#ef4444', fontFamily: 'Poppins, sans-serif', fontSize: '0.82rem', cursor: deleting ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}>
              {deleting ? '...' : 'Confirmar'}
            </button>
          ) : (
            <button onClick={() => setConfirmDelete(true)} style={{ flex: 1, background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '0.75rem', color: '#555', fontFamily: 'Poppins, sans-serif', fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#555' }}>
              Deletar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Kanban Card ─────────────────────────────────────────────────────────────
function KanbanCard({ cliente, faseCor, onSelect }: {
  cliente: Cliente
  faseCor: string
  onSelect: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: cliente.id })
  const health = getHealthScore(cliente)
  const semContato = diasDesdeInteracao(cliente) > 14

  const healthTooltip = {
    vermelho: cliente.precisaRelatorio ? 'Relatório pendente' : 'Entrega vencida',
    amarelo: 'Sem contato há mais de 14 dias',
    verde: 'Cliente em dia',
  }[health]

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.3, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cliente.nome}</span>
        <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center', flexShrink: 0, marginLeft: '0.5rem' }}>
          {cliente.precisaRelatorio && <span title="Precisa relatório" style={{ fontSize: '0.8rem' }}>📊</span>}
          <div title={healthTooltip} style={{ width: '10px', height: '10px', borderRadius: '50%', background: HEALTH_COR[health], flexShrink: 0 }} />
        </div>
      </div>
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

// ─── Coluna Kanban ────────────────────────────────────────────────────────────
function KanbanColuna({ fase, cor, clientes, onSelect }: {
  fase: string
  cor: string
  clientes: Cliente[]
  onSelect: (c: Cliente) => void
}) {
  const { isOver, setNodeRef } = useDroppable({ id: fase })

  const receitaFase = clientes
    .filter(c => c.status === 'Ativo' && c.valorMensal !== null)
    .reduce((acc, c) => acc + (c.valorMensal ?? 0), 0)

  return (
    <div
      ref={setNodeRef}
      style={{
        background: isOver ? '#151515' : '#111111',
        border: `1px solid ${isOver ? '#FF6B00' : '#1a1a1a'}`,
        borderTop: `3px solid ${cor}`,
        borderRadius: '8px',
        padding: '0.875rem',
        minWidth: '220px',
        flex: '1 1 220px',
        transition: 'border-color 0.15s, background 0.15s',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: cor, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{fase}</span>
        <span style={{ background: `${cor}22`, color: cor, borderRadius: '20px', padding: '1px 8px', fontSize: '0.72rem', fontWeight: 700 }}>{clientes.length}</span>
      </div>
      <div style={{ flex: 1 }}>
        {clientes.map(c => (
          <KanbanCard key={c.id} cliente={c} faseCor={cor} onSelect={() => onSelect(c)} />
        ))}
        {clientes.length === 0 && (
          <p style={{ color: '#555', fontSize: '0.8rem', textAlign: 'center', padding: '1.5rem 0', borderRadius: '6px', border: '1px dashed #1a1a1a' }}>Nenhum cliente</p>
        )}
      </div>
      {receitaFase > 0 && (
        <div style={{ marginTop: '0.625rem', paddingTop: '0.5rem', borderTop: '1px solid #1a1a1a', textAlign: 'right' }}>
          <span style={{ color: '#555', fontSize: '0.72rem' }}>
            R$ {receitaFase.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Vista Table ──────────────────────────────────────────────────────────────
function VistaTable({
  clientes, onSelect, ordenarPor, ordenarDir, onOrdenar, filtroUrgente, onLimparUrgente,
}: {
  clientes: Cliente[]
  onSelect: (c: Cliente) => void
  ordenarPor: OrdenarPor
  ordenarDir: 'asc' | 'desc'
  onOrdenar: (col: OrdenarPor) => void
  filtroUrgente: boolean
  onLimparUrgente: () => void
}) {
  const [filtro, setFiltro] = useState<string>('todos')
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

  let filtered = filtro === 'todos' ? clientes : clientes.filter(c => c.status === filtro)
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
          <button key={f} onClick={() => setFiltro(f)}
            style={{ padding: '0.375rem 1rem', borderRadius: '20px', border: `1px solid ${filtro === f ? '#FF6B00' : '#333'}`, background: filtro === f ? 'rgba(255,107,0,0.15)' : 'transparent', color: filtro === f ? '#FF6B00' : '#777', fontSize: '0.82rem', fontFamily: 'Poppins, sans-serif', cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.05em' }}>
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
                const healthTooltip = {
                  vermelho: c.precisaRelatorio ? 'Relatório pendente' : 'Entrega vencida',
                  amarelo: 'Sem contato há mais de 14 dias',
                  verde: 'Cliente em dia',
                }[health]
                return (
                  <tr key={c.id} onClick={() => onSelect(c)}
                    style={{ borderBottom: '1px solid #141414', cursor: 'pointer', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#151515'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '0.875rem 1rem', color: '#e0e0e0', fontWeight: 500, fontSize: '0.9rem' }}>{c.nome}</td>
                    <td style={{ padding: '0.875rem 1rem' }}><StatusBadge status={c.status} /></td>
                    <td style={{ padding: '0.875rem 1rem' }}><FaseBadge fase={c.faseAtual} /></td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div title={healthTooltip} style={{ width: '10px', height: '10px', borderRadius: '50%', background: HEALTH_COR[health], cursor: 'help' }} />
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

// ─── Dashboard ───────────────────────────────────────────────────────────────
function Dashboard({ clientes, onFiltrarEntregas }: { clientes: Cliente[]; onFiltrarEntregas: () => void }) {
  const [totalDocs, setTotalDocs] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/documentos')
      .then(r => r.json())
      .then(d => setTotalDocs(Array.isArray(d) ? d.length : 0))
      .catch(() => setTotalDocs(0))
  }, [])

  const today = new Date(); today.setHours(0, 0, 0, 0)

  function diffDays(dateStr: string) {
    return Math.floor((new Date(dateStr + 'T00:00:00').getTime() - today.getTime()) / 86400000)
  }

  const ativos = clientes.filter(c => c.status === 'Ativo').length
  const receita = clientes.filter(c => c.status === 'Ativo').reduce((acc, c) => acc + (c.valorMensal ?? 0), 0)
  const proximasCount = clientes.filter(c => {
    if (!c.proximoDeliverable) return false
    const d = diffDays(c.proximoDeliverable)
    return d >= 0 && d <= 7
  }).length
  const proximasList = clientes
    .filter(c => c.proximoDeliverable && diffDays(c.proximoDeliverable) <= 7)
    .sort((a, b) => a.proximoDeliverable.localeCompare(b.proximoDeliverable))

  type CardDef = { label: string; value: string; cor: string; onClick?: () => void }
  const cards: CardDef[] = [
    { label: 'CLIENTES ATIVOS',   value: String(ativos),                                 cor: '#22C55E' },
    { label: 'RECEITA MENSAL',    value: formatBRL(receita),                             cor: '#FF6B00' },
    { label: 'PRÓXIMAS ENTREGAS', value: String(proximasCount),                          cor: '#3B82F6', onClick: onFiltrarEntregas },
    { label: 'DOCUMENTOS GERADOS', value: totalDocs === null ? '...' : String(totalDocs), cor: '#8B5CF6' },
  ]

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* 4 metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.875rem', marginBottom: '1rem' }}>
        {cards.map(card => (
          <div key={card.label}
            onClick={card.onClick}
            style={{ background: '#111111', border: '1px solid #222222', borderTop: `4px solid ${card.cor}`, borderRadius: '8px', padding: '1.125rem 1.25rem', cursor: card.onClick ? 'pointer' : 'default', transition: 'border-color 0.15s' }}
            onMouseEnter={card.onClick ? e => { (e.currentTarget as HTMLDivElement).style.borderColor = card.cor } : undefined}
            onMouseLeave={card.onClick ? e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#222222' } : undefined}
          >
            <p style={{ color: '#777', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>{card.label}</p>
            <p style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.75rem', color: '#fff', margin: 0, letterSpacing: '0.02em', lineHeight: 1 }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Próximas entregas — lista */}
      <div style={{ background: '#111111', border: '1px solid #222222', borderRadius: '8px', padding: '1.125rem 1.25rem' }}>
        <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '0.9rem', color: '#fff', letterSpacing: '0.12em', margin: '0 0 0.875rem' }}>PRÓXIMAS ENTREGAS</h3>
        {proximasList.length === 0 ? (
          <p style={{ color: '#555', fontSize: '0.85rem', margin: 0 }}>Nenhuma entrega nos próximos 7 dias</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {proximasList.map(c => {
              const urgency = deliverableUrgency(c.proximoDeliverable)
              const rowBg = urgency === 'vencido' ? 'rgba(239,68,68,0.1)' : urgency === 'urgente' ? 'rgba(255,107,0,0.1)' : 'transparent'
              const dateCor = urgency === 'vencido' ? '#ef4444' : urgency === 'urgente' ? '#FF6B00' : '#777'
              return (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.45rem 0.625rem', borderRadius: '6px', background: rowBg }}>
                  <span style={{ color: '#e0e0e0', fontSize: '0.875rem', fontWeight: 500, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nome}</span>
                  <FaseBadge fase={c.faseAtual} />
                  <span style={{ color: dateCor, fontSize: '0.82rem', whiteSpace: 'nowrap', flexShrink: 0 }}>{formatDate(c.proximoDeliverable)}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Tela de Senha ────────────────────────────────────────────────────────────
function TelaSenha({ onAuth }: { onAuth: () => void }) {
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setErro(false)
    try {
      const res = await fetch('/api/raio-x/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha }),
      })
      if (res.ok) { saveAuth(); onAuth() }
      else setErro(true)
    } catch { setErro(true) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins, sans-serif' }}>
      <BgImage />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px', padding: '0 2rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <Image src="/lglaranja.png" alt="ORIUM" width={120} height={40} style={{ objectFit: 'contain' }} />
        </div>
        <p style={{ color: '#FF6B00', fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>ACESSO INTERNO</p>
        <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(3rem, 6vw, 4.5rem)', color: '#fff', letterSpacing: '0.02em', lineHeight: 0.95, marginBottom: '1.75rem' }}>CLIENTES</h1>
        <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.75, marginBottom: '3rem' }}>Gestão de clientes e fases.</p>
        <form onSubmit={handleSubmit}>
          <input type="password" placeholder="Senha de acesso" value={senha}
            onChange={e => { setSenha(e.target.value); setErro(false) }} autoFocus
            style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${erro ? '#ef4444' : '#1e1e1e'}`, borderRadius: '10px', padding: '1rem 1.25rem', color: '#fff', fontSize: '0.95rem', fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
            onFocus={e => { if (!erro) e.target.style.borderColor = '#FF6B00' }}
            onBlur={e => { if (!erro) e.target.style.borderColor = '#1e1e1e' }} />
          {erro && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.75rem', textAlign: 'center' }}>Senha incorreta.</p>}
          <button type="submit" disabled={loading || !senha}
            style={{ width: '100%', background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '1rem', color: '#000', fontFamily: 'Anton, sans-serif', fontSize: '1rem', letterSpacing: '0.15em', cursor: loading || !senha ? 'not-allowed' : 'pointer', boxShadow: '0 4px 20px rgba(255,107,0,0.2)', marginTop: '1rem', opacity: loading || !senha ? 0.5 : 1, transition: 'all 0.2s' }}>
            {loading ? '...' : 'ACESSAR'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Página Principal ─────────────────────────────────────────────────────────
export default function ClientesPage() {
  const [autenticado, setAutenticado] = useState(() => isAuthenticated())
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)
  const [vistaAtiva, setVistaAtiva] = useState<'kanban' | 'table'>('kanban')
  const [modalNovo, setModalNovo] = useState(false)
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null)
  const [busca, setBusca] = useState('')
  const [ordenarPor, setOrdenarPor] = useState<OrdenarPor>('dataInicio')
  const [ordenarDir, setOrdenarDir] = useState<'asc' | 'desc'>('desc')
  const [filtroUrgente, setFiltroUrgente] = useState(false)

  const justDraggedRef = useRef(false)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  useEffect(() => {
    if (!autenticado) return
    setLoading(true)
    fetch('/api/clientes')
      .then(r => r.json())
      .then(d => setClientes(d.clientes ?? []))
      .finally(() => setLoading(false))
  }, [autenticado])

  function handleDragEnd(event: DragEndEvent) {
    justDraggedRef.current = true
    requestAnimationFrame(() => { justDraggedRef.current = false })
    const { active, over } = event
    if (!over) return
    const clienteId = String(active.id)
    const novaFase = String(over.id)
    const cliente = clientes.find(c => c.id === clienteId)
    if (!cliente || cliente.faseAtual === novaFase) return
    const prev = clientes
    setClientes(cs => cs.map(c => c.id === clienteId ? { ...c, faseAtual: novaFase } : c))
    fetch(`/api/clientes?id=${clienteId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ faseAtual: novaFase }),
    }).then(r => { if (!r.ok) setClientes(prev) })
  }

  function handleOrdenar(col: OrdenarPor) {
    if (ordenarPor === col) setOrdenarDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setOrdenarPor(col); setOrdenarDir('desc') }
  }

  function handleFiltrarEntregas() {
    setVistaAtiva('table')
    setFiltroUrgente(true)
  }

  if (!autenticado) return <TelaSenha onAuth={() => setAutenticado(true)} />

  const receitaMensal = clientes.filter(c => c.status === 'Ativo').reduce((acc, c) => acc + (c.valorMensal ?? 0), 0)
  const totalAtivos = clientes.filter(c => c.status === 'Ativo').length

  const clientesFiltrados = busca.trim()
    ? clientes.filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()))
    : clientes

  return (
    <div style={{ position: 'fixed', inset: 0, overflowY: 'auto', background: '#080808', fontFamily: 'Poppins, sans-serif' }}>
      <BgImage />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Image src="/lglaranja.png" alt="ORIUM" width={100} height={32} style={{ objectFit: 'contain', display: 'block', marginBottom: '1.25rem' }} />
            <p style={{ color: '#FF6B00', fontSize: '0.68rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>GESTÃO</p>
            <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', letterSpacing: '0.03em', lineHeight: 0.95, marginBottom: '0.375rem' }}>CLIENTES</h1>
            <p style={{ color: '#777', fontSize: '0.875rem' }}>Gestão de clientes ativos e fases</p>
          </div>
          <button onClick={() => setModalNovo(true)}
            style={{ background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem', color: '#fff', fontFamily: 'Anton, sans-serif', fontSize: '0.9rem', letterSpacing: '0.12em', cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,107,0,0.25)', transition: 'all 0.2s', alignSelf: 'flex-end' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e55f00'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(255,107,0,0.35)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FF6B00'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,107,0,0.25)' }}>
            + NOVO CLIENTE
          </button>
        </div>

        {/* Dashboard */}
        <Dashboard clientes={clientes} onFiltrarEntregas={handleFiltrarEntregas} />

        {/* Abas de vista */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {(['kanban', 'table'] as const).map(v => (
            <button key={v} onClick={() => setVistaAtiva(v)}
              style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: `1px solid ${vistaAtiva === v ? '#FF6B00' : '#333'}`, background: vistaAtiva === v ? '#FF6B00' : 'transparent', color: vistaAtiva === v ? '#fff' : '#777', fontFamily: 'Anton, sans-serif', fontSize: '0.82rem', letterSpacing: '0.12em', cursor: 'pointer', transition: 'all 0.15s' }}>
              {v === 'kanban' ? 'KANBAN' : 'TABLE'}
            </button>
          ))}
        </div>

        {/* Busca */}
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.875rem', pointerEvents: 'none', lineHeight: 1 }}>🔍</span>
          <input
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar cliente..."
            style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '0.625rem 1rem 0.625rem 2.25rem', color: '#fff', fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
            onFocus={e => e.target.style.borderColor = '#FF6B00'}
            onBlur={e => e.target.style.borderColor = '#333'}
          />
        </div>

        {/* Conteúdo */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: '#444', fontSize: '0.9rem' }}>
            Carregando clientes...
          </div>
        ) : vistaAtiva === 'kanban' ? (
          <DndContext
            sensors={sensors}
            onDragStart={() => { justDraggedRef.current = false }}
            onDragEnd={handleDragEnd}
          >
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem', alignItems: 'flex-start' }}>
              {FASES.map(fase => (
                <KanbanColuna key={fase.nome} fase={fase.nome} cor={fase.cor}
                  clientes={clientesFiltrados.filter(c => c.faseAtual === fase.nome)}
                  onSelect={(c) => {
                    if (justDraggedRef.current) return
                    setClienteSelecionado(c)
                  }} />
              ))}
            </div>
          </DndContext>
        ) : (
          <VistaTable
            clientes={clientesFiltrados}
            onSelect={setClienteSelecionado}
            ordenarPor={ordenarPor}
            ordenarDir={ordenarDir}
            onOrdenar={handleOrdenar}
            filtroUrgente={filtroUrgente}
            onLimparUrgente={() => setFiltroUrgente(false)}
          />
        )}

        {/* Rodapé com métricas */}
        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #141414', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Total', value: String(clientes.length) },
              { label: 'Ativos', value: String(totalAtivos) },
              { label: 'Receita estimada', value: formatBRL(receitaMensal) },
            ].map(m => (
              <div key={m.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '0.625rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                <span style={{ color: '#555', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{m.label}</span>
                <span style={{ color: '#e0e0e0', fontSize: '1rem', fontWeight: 600 }}>{m.value}</span>
              </div>
            ))}
          </div>
          <a href="/hub"
            style={{ color: '#777', fontSize: '0.82rem', textDecoration: 'none', letterSpacing: '0.1em', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = '#777'}>
            ← Painel
          </a>
        </div>
      </div>

      {/* Modais */}
      {modalNovo && (
        <ModalNovoCliente
          onClose={() => setModalNovo(false)}
          onCreated={c => setClientes(cs => [c, ...cs])} />
      )}
      {clienteSelecionado && (
        <ModalDetalhes
          cliente={clienteSelecionado}
          onClose={() => setClienteSelecionado(null)}
          onUpdated={updated => setClientes(cs => cs.map(c => c.id === updated.id ? updated : c))}
          onDeleted={id => setClientes(cs => cs.filter(c => c.id !== id))} />
      )}
    </div>
  )
}
