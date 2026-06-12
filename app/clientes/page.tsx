'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { isAuthenticated, saveAuth, authHeaders } from '@/lib/auth'
import { DragEndEvent } from '@dnd-kit/core'
import type { Cliente, Atividade, ProgressoData, OrdenarPor } from './components/types'
import {
  FASES,
  BgImage,
  formatBRL,
  formatDate,
  deliverableUrgency,
  diasDesdeInteracao,
  getHealthScore,
  FaseBadge,
} from './components/shared'
import { ModalNovoCliente } from './components/ModalNovoCliente'
import { ModalDetalhes } from './components/ModalCliente'
import { KanbanBoard } from './components/KanbanBoard'
import { VistaTable } from './components/TabelaClientes'
import { VistaLeads } from './components/VistaLeads'
import { VistaCalendario } from './components/VistaCalendario'

// ─── Dashboard ───────────────────────────────────────────────────────────────
function Dashboard({ clientes, onFiltrarEntregas }: { clientes: Cliente[]; onFiltrarEntregas: () => void }) {
  const [totalDocs, setTotalDocs] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/documentos', { headers: authHeaders() })
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
    { label: 'RECEITA MENSAL',    value: receita % 1 === 0 ? `R$ ${receita.toLocaleString('pt-BR')}` : receita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), cor: '#FF6B00' },
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

      {(() => {
        const mrrPorFase = FASES.map(f => ({
          ...f,
          valor: clientes
            .filter(c => c.faseAtual === f.nome && c.status === 'Ativo')
            .reduce((acc, c) => acc + (c.valorMensal || 0), 0),
        })).filter(f => f.valor > 0)

        if (mrrPorFase.length === 0) return null

        const mrrTotal = mrrPorFase.reduce((acc, f) => acc + f.valor, 0)
        const maxVal = Math.max(...mrrPorFase.map(f => f.valor))
        const viewH = mrrPorFase.length * 28 + 16

        return (
          <div style={{ background: '#111111', border: '1px solid #222222', borderRadius: '8px', padding: '0.875rem 1rem', marginBottom: '1rem', maxWidth: '480px' }}>
            <svg viewBox={`0 0 400 ${viewH}`} style={{ width: '100%', display: 'block' }}>
              {mrrPorFase.map((f, i) => {
                const y = i * 28 + 8
                const barW = Math.max(4, (f.valor / maxVal) * 160)
                return (
                  <g key={f.nome}>
                    <text x={0} y={y + 14} fill="#777" fontSize={10} fontFamily="Poppins, sans-serif">
                      {f.nome.length > 18 ? f.nome.slice(0, 17) + '…' : f.nome}
                    </text>
                    <rect x={140} y={y} width={barW} height={20} rx={4} ry={4} fill={f.cor} />
                    <text x={140 + barW + 6} y={y + 14} fill="#ccc" fontSize={10} fontFamily="Poppins, sans-serif">
                      {`R$ ${f.valor.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`}
                    </text>
                  </g>
                )
              })}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem', gap: '0.5rem', alignItems: 'baseline' }}>
              <span style={{ color: '#777', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>MRR TOTAL</span>
              <span style={{ fontFamily: 'Anton, sans-serif', fontSize: '1rem', color: '#FF6B00' }}>
                {`R$ ${mrrTotal.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`}
              </span>
            </div>
          </div>
        )
      })()}

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
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ senha }),
      })
      if (res.ok) { saveAuth(senha); onAuth() }
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
  const [autenticado, setAutenticado] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)
  const [vistaAtiva, setVistaAtiva] = useState<'kanban' | 'table' | 'leads' | 'calendario'>('kanban')
  const [modalNovo, setModalNovo] = useState(false)
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null)
  const [busca, setBusca] = useState('')
  const [ordenarPor, setOrdenarPor] = useState<OrdenarPor>('dataInicio')
  const [ordenarDir, setOrdenarDir] = useState<'asc' | 'desc'>('desc')
  const [filtroUrgente, setFiltroUrgente] = useState(false)
  const [filtroAtencao, setFiltroAtencao] = useState(false)
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [exportando, setExportando] = useState(false)
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [loadingAtividades, setLoadingAtividades] = useState(false)
  const [atividadesExpandidas, setAtividadesExpandidas] = useState(false)
  const [progressos, setProgressos] = useState<Record<string, ProgressoData>>({})
  const [kanbanErro, setKanbanErro] = useState('')

  const justDraggedRef = useRef(false)

  useEffect(() => {
    setAutenticado(isAuthenticated())
    setAuthChecked(true)
    const vista = new URLSearchParams(window.location.search).get('vista')
    if (vista === 'kanban' || vista === 'table' || vista === 'leads' || vista === 'calendario') {
      setVistaAtiva(vista)
    }
  }, [])

  useEffect(() => {
    if (!autenticado) return
    setLoading(true)
    fetch('/api/clientes', { headers: authHeaders() })
      .then(r => r.json())
      .then(d => setClientes(d.clientes ?? []))
      .finally(() => setLoading(false))
  }, [autenticado])

  useEffect(() => {
    if (!clienteSelecionado) return
    setAtividadesExpandidas(false)
    setLoadingAtividades(true)
    fetch(`/api/atividades?clienteId=${clienteSelecionado.id}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => setAtividades(d.atividades || []))
      .catch(() => setAtividades([]))
      .finally(() => setLoadingAtividades(false))
  }, [clienteSelecionado])

  async function handleDragEnd(event: DragEndEvent) {
    justDraggedRef.current = true
    requestAnimationFrame(() => { justDraggedRef.current = false })
    const { active, over } = event
    if (!over) return
    const clienteId = String(active.id)
    const novaFase = String(over.id)
    if (!FASES.some(f => f.nome === novaFase)) return
    const cliente = clientes.find(c => c.id === clienteId)
    if (!cliente || cliente.faseAtual === novaFase) return
    const prev = clientes
    setKanbanErro('')
    setClientes(cs => cs.map(c => c.id === clienteId ? { ...c, faseAtual: novaFase } : c))
    try {
      const res = await fetch(`/api/clientes?id=${encodeURIComponent(clienteId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ faseAtual: novaFase, clienteNome: cliente.nome }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.detail || data?.error || 'Falha ao atualizar fase')
      }
      const atualizado = await res.json()
      setClientes(cs => cs.map(c => c.id === clienteId ? { ...c, ...atualizado } : c))
    } catch (err) {
      console.error('Erro ao mover cliente no Kanban:', err)
      setClientes(prev)
      setKanbanErro('Não foi possível mover o cliente. A fase foi restaurada.')
    }
  }

  function handleOrdenar(col: OrdenarPor) {
    if (ordenarPor === col) setOrdenarDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setOrdenarPor(col); setOrdenarDir('desc') }
  }

  async function handleExportarCSV() {
    setExportando(true)
    try {
      const res = await fetch('/api/clientes/export', { headers: authHeaders() })
      if (!res.ok) throw new Error('Falha na exportação')
      const blob = await res.blob()
      const url = URL.createObjectURL(new Blob([blob], { type: 'text/csv' }))
      const a = document.createElement('a')
      const today = new Date().toISOString().split('T')[0]
      a.href = url
      a.download = `clientes-orium-${today}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Erro ao exportar CSV:', err)
    } finally {
      setExportando(false)
    }
  }

  function handleFiltrarEntregas() {
    setVistaAtiva('table')
    setFiltroUrgente(true)
  }

  if (!authChecked) return null
  if (!autenticado) return <TelaSenha onAuth={() => setAutenticado(true)} />

  const receitaMensal = clientes.filter(c => c.status === 'Ativo').reduce((acc, c) => acc + (c.valorMensal ?? 0), 0)
  const totalAtivos = clientes.filter(c => c.status === 'Ativo').length

  const clientesFiltrados = clientes
    .filter(c => !busca.trim() || c.nome.toLowerCase().includes(busca.toLowerCase()))
    .filter(c => !filtroAtencao || getHealthScore(c).cor !== 'verde')

  return (
    <div style={{ position: 'fixed', inset: 0, overflowY: 'auto', background: '#080808', fontFamily: 'Poppins, sans-serif' }}>
      <BgImage />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Link href="/" className="inline-block cursor-pointer transition-opacity hover:opacity-80">
              <Image src="/lglaranja.png" alt="ORIUM" width={100} height={32} style={{ objectFit: 'contain', display: 'block', marginBottom: '1.25rem' }} />
            </Link>
            <p style={{ color: '#FF6B00', fontSize: '0.68rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>GESTÃO</p>
            <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', letterSpacing: '0.03em', lineHeight: 0.95, marginBottom: '0.375rem' }}>CLIENTES</h1>
            <p style={{ color: '#777', fontSize: '0.875rem' }}>Gestão de clientes ativos e fases</p>
            {(() => {
              const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
              const vencidas = clientes.filter(c => c.status === 'Ativo' && c.proximoDeliverable && new Date(c.proximoDeliverable + 'T00:00:00') < hoje).length
              const relatorio = clientes.filter(c => c.status === 'Ativo' && c.precisaRelatorio).length
              const semContato = clientes.filter(c => c.status === 'Ativo' && diasDesdeInteracao(c) > 14).length
              if (!vencidas && !relatorio && !semContato) return null
              return (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                  {vencidas > 0 && (
                    <button onClick={() => { setVistaAtiva('table'); setFiltroUrgente(true) }}
                      style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontSize: '0.75rem', fontFamily: 'Poppins, sans-serif', cursor: 'pointer', transition: 'opacity 0.15s' }}>
                      ⚠ {vencidas} entrega{vencidas !== 1 ? 's' : ''} vencida{vencidas !== 1 ? 's' : ''}
                    </button>
                  )}
                  {relatorio > 0 && (
                    <button onClick={() => { setVistaAtiva('table'); setFiltroStatus('Ativo') }}
                      style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(255,107,0,0.3)', background: 'rgba(255,107,0,0.15)', color: '#FF6B00', fontSize: '0.75rem', fontFamily: 'Poppins, sans-serif', cursor: 'pointer', transition: 'opacity 0.15s' }}>
                      📄 {relatorio} cliente{relatorio !== 1 ? 's' : ''} {relatorio !== 1 ? 'precisam' : 'precisa'} de relatório
                    </button>
                  )}
                  {semContato > 0 && (
                    <button onClick={() => { setVistaAtiva('table'); setFiltroStatus('Ativo') }}
                      style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(234,179,8,0.3)', background: 'rgba(234,179,8,0.15)', color: '#EAB308', fontSize: '0.75rem', fontFamily: 'Poppins, sans-serif', cursor: 'pointer', transition: 'opacity 0.15s' }}>
                      💬 {semContato} cliente{semContato !== 1 ? 's' : ''} sem contato há 14+ dias
                    </button>
                  )}
                </div>
              )
            })()}
          </div>
          <div style={{ display: 'flex', gap: '0.625rem', alignSelf: 'flex-end', flexWrap: 'wrap' }}>
            <button onClick={handleExportarCSV} disabled={exportando}
              style={{ background: 'transparent', border: '1px solid #333', borderRadius: '8px', padding: '0.75rem 1.25rem', color: '#aaa', fontFamily: 'Anton, sans-serif', fontSize: '0.9rem', letterSpacing: '0.12em', cursor: exportando ? 'not-allowed' : 'pointer', opacity: exportando ? 0.6 : 1, transition: 'all 0.15s' }}
              onMouseEnter={e => { if (!exportando) { e.currentTarget.style.borderColor = '#FF6B00'; e.currentTarget.style.color = '#fff' } }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#aaa' }}>
              {exportando ? 'Exportando...' : 'Exportar CSV'}
            </button>
            <button onClick={() => setModalNovo(true)}
              style={{ background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem', color: '#fff', fontFamily: 'Anton, sans-serif', fontSize: '0.9rem', letterSpacing: '0.12em', cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,107,0,0.25)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e55f00'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(255,107,0,0.35)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FF6B00'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,107,0,0.25)' }}>
              + NOVO CLIENTE
            </button>
          </div>
        </div>

        {/* Dashboard */}
        <Dashboard clientes={clientes} onFiltrarEntregas={handleFiltrarEntregas} />

        {/* Abas de vista */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {([
            { key: 'kanban' as const, label: 'QUADROS', icon: null as string | null },
            { key: 'table' as const, label: 'TABELA', icon: null as string | null },
            { key: 'leads' as const, label: 'LEADS', icon: '👤' },
            { key: 'calendario' as const, label: 'CALENDÁRIO', icon: '📅' },
          ]).map(v => (
            <button key={v.key} onClick={() => setVistaAtiva(v.key)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1.25rem', borderRadius: '6px', border: `1px solid ${vistaAtiva === v.key ? '#FF6B00' : '#333'}`, background: vistaAtiva === v.key ? '#FF6B00' : 'transparent', color: vistaAtiva === v.key ? '#fff' : '#777', fontFamily: 'Anton, sans-serif', fontSize: '0.82rem', letterSpacing: '0.12em', cursor: 'pointer', transition: 'all 0.15s' }}>
              {v.icon && <span style={{ fontSize: '0.9rem' }}>{v.icon}</span>}
              {v.label}
            </button>
          ))}
        </div>

        {/* Busca + filtro atenção (Kanban/Table) */}
        {(vistaAtiva === 'kanban' || vistaAtiva === 'table') && (
          <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
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
            <button
              onClick={() => setFiltroAtencao(a => !a)}
              style={{
                padding: '0.625rem 1rem', borderRadius: '8px', whiteSpace: 'nowrap', fontFamily: 'Poppins, sans-serif', fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s',
                border: filtroAtencao ? '1px solid rgba(245,158,11,0.6)' : '1px solid #333',
                background: filtroAtencao ? 'rgba(245,158,11,0.12)' : 'transparent',
                color: filtroAtencao ? '#f59e0b' : '#666',
              }}
            >
              ⚠ Precisa de Atenção{filtroAtencao ? ' ×' : ''}
            </button>
          </div>
        )}

        {/* Conteúdo */}
        {vistaAtiva === 'leads' ? (
          <VistaLeads />
        ) : vistaAtiva === 'calendario' ? (
          <VistaCalendario />
        ) : loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: '#444', fontSize: '0.9rem' }}>
            Carregando clientes...
          </div>
        ) : vistaAtiva === 'kanban' ? (
          <KanbanBoard
            clientes={clientesFiltrados}
            progressos={progressos}
            onProgressoLoaded={(id, data) => setProgressos(p => ({ ...p, [id]: data }))}
            onSelect={(c) => {
              if (justDraggedRef.current) return
              setClienteSelecionado(c)
            }}
            kanbanErro={kanbanErro}
            onDismissErro={() => setKanbanErro('')}
            onDragStart={() => { justDraggedRef.current = false }}
            onDragEnd={handleDragEnd}
          />
        ) : (
          <VistaTable
            clientes={clientesFiltrados}
            onSelect={setClienteSelecionado}
            ordenarPor={ordenarPor}
            ordenarDir={ordenarDir}
            onOrdenar={handleOrdenar}
            filtroUrgente={filtroUrgente}
            onLimparUrgente={() => setFiltroUrgente(false)}
            filtroStatus={filtroStatus}
            onFiltroStatus={setFiltroStatus}
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
          onDeleted={id => setClientes(cs => cs.filter(c => c.id !== id))}
          atividades={atividades}
          loadingAtividades={loadingAtividades}
          atividadesExpandidas={atividadesExpandidas}
          setAtividadesExpandidas={setAtividadesExpandidas}
          progresso={progressos[clienteSelecionado.id] ?? null} />
      )}
    </div>
  )
}
