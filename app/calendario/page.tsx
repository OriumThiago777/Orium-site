'use client'

import { useState, useEffect, useRef, type CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { DragEndEvent } from '@dnd-kit/core'
import { clearAuth, authHeaders } from '@/lib/auth'
import AuthGate from '@/components/AuthGate'
import ToolBackground from '@/components/ToolBackground'
import { WeekGrid } from './components/WeekGrid'
import { CLIENTES_CALENDARIO, type EventoCalendario } from './types'

const MESES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function toISODate(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function startOfWeekMonday(d: Date) {
  const r = new Date(d)
  const diaSemana = r.getDay()
  const diff = diaSemana === 0 ? -6 : 1 - diaSemana
  r.setDate(r.getDate() + diff)
  r.setHours(0, 0, 0, 0)
  return r
}

function gerarSemana(base: Date): Date[] {
  const inicio = startOfWeekMonday(base)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(inicio)
    d.setDate(d.getDate() + i)
    return d
  })
}

function tituloSemana(dias: Date[]) {
  const ini = dias[0]
  const fim = dias[6]
  const diaIni = String(ini.getDate()).padStart(2, '0')
  const diaFim = String(fim.getDate()).padStart(2, '0')
  if (ini.getMonth() === fim.getMonth()) {
    return `${diaIni} – ${diaFim} ${MESES_ABREV[fim.getMonth()]} ${fim.getFullYear()}`
  }
  return `${diaIni} ${MESES_ABREV[ini.getMonth()]} – ${diaFim} ${MESES_ABREV[fim.getMonth()]} ${fim.getFullYear()}`
}

function CalendarioSemanalPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [selectedCliente, setSelectedCliente] = useState('todos')
  const [eventos, setEventos] = useState<EventoCalendario[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const savingRef = useRef(false)
  // Incrementado a cada drag (handleDragEnd). Uma resposta de carregarEventos só é
  // aplicada se o epoch capturado no início do fetch ainda for o atual — evita que a
  // resposta de um poll disparado antes do drag (stale) sobrescreva o estado otimista
  // pós-drag quando ela chega depois (race condition do poll de 18s).
  const epochRef = useRef(0)

  const dias = gerarSemana(currentDate)

  async function carregarEventos(diasAlvo: Date[], cliente: string, silencioso = false) {
    if (!silencioso) setLoading(true)
    const params = new URLSearchParams({ inicio: toISODate(diasAlvo[0]), fim: toISODate(diasAlvo[6]) })
    if (cliente !== 'todos') params.set('cliente', cliente)
    const epoch = epochRef.current
    try {
      const res = await fetch(`/api/calendario/eventos?${params}`, { headers: authHeaders() })
      if (!res.ok) {
        // Falha real da API (ex.: Notion fora do ar, ver route.ts). Num poll silencioso
        // isso não deve derrubar o que já está na tela — a próxima tentativa corrige.
        // Num load visível (troca de semana/cliente/inicial), degrada como o resto do
        // app (ver VistaCalendario.tsx: carregarItens -> .catch(() => setItems([]))).
        if (!silencioso && epochRef.current === epoch) setEventos([])
        return
      }
      const data = await res.json()
      if (epochRef.current === epoch) setEventos(data.eventos ?? [])
    } catch {
      if (!silencioso && epochRef.current === epoch) setEventos([])
    } finally {
      if (!silencioso) setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => { carregarEventos(gerarSemana(currentDate), selectedCliente) }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate.getTime(), selectedCliente])

  useEffect(() => {
    const id = setInterval(() => {
      if (savingRef.current) return
      carregarEventos(gerarSemana(currentDate), selectedCliente, true)
    }, 18000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate.getTime(), selectedCliente])

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    const eventoId = String(active.id)
    const novaData = String(over.id)
    const evento = eventos.find(e => e.id === eventoId)
    if (!evento || evento.data === novaData) return

    const anterior = eventos
    setErro('')
    epochRef.current += 1
    setEventos(es => es.map(e => e.id === eventoId ? { ...e, data: novaData } : e))
    savingRef.current = true
    try {
      const res = await fetch(`/api/calendario/eventos/${encodeURIComponent(eventoId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ novaData }),
      })
      if (!res.ok) throw new Error('Falha ao mover evento')
    } catch (err) {
      console.error('Erro ao mover evento do calendário:', err)
      setEventos(anterior)
      setErro('Não foi possível mover o evento. A data foi restaurada.')
    } finally {
      savingRef.current = false
    }
  }

  function eventosDoDia(dia: Date) {
    const iso = toISODate(dia)
    return eventos.filter(e => e.data === iso)
  }

  function navegar(direcao: -1 | 1) {
    setCurrentDate(d => {
      const novo = new Date(d)
      novo.setDate(novo.getDate() + direcao * 7)
      return novo
    })
  }

  const navBtnStyle: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: '#111', border: '1px solid #333', borderRadius: '6px', color: '#999', fontSize: '1rem', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#080808', fontFamily: 'Poppins, sans-serif', display: 'flex' }}>
      <ToolBackground position="absolute" />

      {/* Sidebar */}
      <div style={{ position: 'relative', width: sidebarCollapsed ? '60px' : '260px', flexShrink: 0, height: '100%', zIndex: 10, transition: 'width 0.3s ease' }}>
        <button
          onClick={() => setSidebarCollapsed(c => !c)}
          title={sidebarCollapsed ? 'Expandir' : 'Recolher'}
          style={{ position: 'absolute', right: '-12px', top: '50%', transform: 'translateY(-50%)', zIndex: 20, width: '24px', height: '24px', background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#333', fontSize: '0.65rem', transition: 'all 0.2s' }}
          onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = '#FF6B00'; b.style.color = '#FF6B00' }}
          onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = '#1e1e1e'; b.style.color = '#333' }}
        >
          {sidebarCollapsed ? '›' : '‹'}
        </button>

        <div style={{ width: '100%', height: '100%', borderRight: '1px solid #0f0f0f', display: 'flex', flexDirection: 'column', background: 'rgba(8,8,8,0.97)', backdropFilter: 'blur(16px)', overflow: 'hidden' }}>
          {!sidebarCollapsed ? (
            <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid #0f0f0f', flexShrink: 0 }}>
              <Link href="/" className="inline-block cursor-pointer transition-opacity hover:opacity-80">
                <Image src="/lglaranja.png" alt="ORIUM" width={90} height={28} style={{ objectFit: 'contain' }} />
              </Link>
              <p style={{ color: '#444444', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Poppins, sans-serif', marginTop: '0.5rem', marginBottom: 0 }}>CALENDÁRIO DE CONTEÚDO</p>
            </div>
          ) : (
            <div style={{ flexShrink: 0, height: '60px', borderBottom: '1px solid #0f0f0f' }} />
          )}

          <div style={{ flex: 1 }} />

          <div style={{ borderTop: '1px solid #0f0f0f', padding: sidebarCollapsed ? '1rem 0' : '1rem 1.75rem 1.5rem', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: sidebarCollapsed ? 'center' : 'flex-start', gap: '0.75rem' }}>
            <a
              href="/hub"
              title="Voltar ao painel"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#888888', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.15s', fontFamily: 'Poppins, sans-serif', border: '1px solid #1e1e1e', padding: '8px 12px', borderRadius: '8px' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00'; e.currentTarget.style.borderColor = '#FF6B00' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#888888'; e.currentTarget.style.borderColor = '#1e1e1e' }}
            >
              <span>←</span>
              {!sidebarCollapsed && <span>PAINEL</span>}
            </a>
            {!sidebarCollapsed && (
              <a href="/biblioteca" style={{ color: '#777', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s', fontFamily: 'Poppins, sans-serif' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#777' }}>
                BIBLIOTECA
              </a>
            )}
            {!sidebarCollapsed && (
              <button
                onClick={() => { clearAuth(); window.location.reload() }}
                style={{ background: 'none', border: 'none', color: '#1a1a1a', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', transition: 'color 0.2s', padding: 0, fontFamily: 'Poppins, sans-serif' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#1a1a1a' }}
              >
                sair
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <div style={{ padding: '2.5rem 3rem 1.5rem', borderBottom: '1px solid #141414', flexShrink: 0 }}>
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#fff', letterSpacing: '0.04em', lineHeight: 1, marginBottom: '0.25rem' }}>CALENDÁRIO DE CONTEÚDO</h2>
          <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Planejamento semanal com dados ao vivo do Notion.</p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button onClick={() => navegar(-1)} style={navBtnStyle}>‹</button>
              <button onClick={() => setCurrentDate(new Date())} style={{ ...navBtnStyle, width: 'auto', padding: '0 0.875rem', fontSize: '0.78rem', letterSpacing: '0.05em' }}>Hoje</button>
              <button onClick={() => navegar(1)} style={navBtnStyle}>›</button>
              <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.05rem', color: '#fff', letterSpacing: '0.03em', margin: '0 0 0 0.75rem' }}>
                {tituloSemana(dias)}
              </h3>
            </div>
            <select
              value={selectedCliente}
              onChange={e => setSelectedCliente(e.target.value)}
              style={{ background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '0.5rem 0.875rem', color: '#aaa', fontSize: '0.82rem', fontFamily: 'Poppins, sans-serif', outline: 'none', cursor: 'pointer' }}
            >
              <option value="todos" style={{ background: '#0f0f0f' }}>Todos os clientes</option>
              {CLIENTES_CALENDARIO.map(c => (
                <option key={c} value={c} style={{ background: '#0f0f0f' }}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 3rem' }}>
          {erro && (
            <div style={{ marginBottom: '1rem', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: '8px', padding: '0.625rem 0.875rem', color: '#fca5a5', fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
              <span>{erro}</span>
              <button type="button" onClick={() => setErro('')} style={{ background: 'transparent', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1 }}>×</button>
            </div>
          )}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: '#444', fontSize: '0.9rem' }}>Carregando calendário...</div>
          ) : (
            <WeekGrid dias={dias} eventosPorDia={eventosDoDia} onDragEnd={handleDragEnd} />
          )}
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <AuthGate title="CALENDÁRIO" subtitle="Calendário de conteúdo em tempo real.">
      <CalendarioSemanalPage />
    </AuthGate>
  )
}
