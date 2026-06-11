'use client'

import React, { useEffect, useState } from 'react'
import { authHeaders } from '@/lib/auth'

type HubStatus = {
  entregas: Array<{ titulo: string; cliente: string; data: string; status: string }>
  leads: Array<{ nome: string; segmento: string; createdTime: string }>
  clientesSemContato: Array<{ nome: string; diasSemContato: number }>
  documentos: { total: number; porTipo: Record<string, number> }
}

const CARD_BASE: React.CSSProperties = {
  background: '#0f0f0f',
  border: '1px solid #1e1e1e',
  borderRadius: '12px',
  padding: '24px',
  display: 'block',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'border-color 0.2s, background 0.2s',
  boxSizing: 'border-box',
}

const TITULO_STYLE: React.CSSProperties = {
  fontFamily: 'Poppins, sans-serif',
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  color: '#666',
  margin: 0,
  marginBottom: '14px',
}

const NUMERO_STYLE: React.CSSProperties = {
  fontFamily: 'Anton, sans-serif',
  fontSize: '32px',
  color: '#FF6B00',
  lineHeight: 1,
  margin: 0,
  marginBottom: '10px',
}

const SUB_STYLE: React.CSSProperties = {
  fontFamily: 'Poppins, sans-serif',
  fontSize: '13px',
  color: '#999',
  lineHeight: 1.5,
  margin: 0,
}

function tempoDesde(iso: string): string {
  const horas = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000)
  if (horas >= 24) {
    const dias = Math.floor(horas / 24)
    return `há ${dias} ${dias === 1 ? 'dia' : 'dias'}`
  }
  return `há ${Math.max(horas, 1)}h`
}

function Card({ titulo, numero, sub, href, destaque, vazio }: {
  titulo: string
  numero: number
  sub: string
  href: string
  destaque?: boolean
  vazio: boolean
}) {
  const borda = destaque ? '#FF6B00' : '#1e1e1e'
  return (
    <a
      href={href}
      style={{ ...CARD_BASE, borderColor: borda }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B00'; e.currentTarget.style.background = 'rgba(255,107,0,0.05)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = borda; e.currentTarget.style.background = '#0f0f0f' }}
    >
      <p style={TITULO_STYLE}>{titulo}</p>
      <p style={{ ...NUMERO_STYLE, color: vazio ? '#333' : '#FF6B00' }}>{numero}</p>
      <p style={SUB_STYLE}>{vazio ? 'Tudo em dia' : sub}</p>
    </a>
  )
}

export default function HubStatusPanel() {
  const [status, setStatus] = useState<HubStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    let ativo = true
    fetch('/api/hub-status', { headers: authHeaders() })
      .then(res => {
        if (!res.ok) throw new Error('hub-status indisponível')
        return res.json()
      })
      .then((data: HubStatus) => { if (ativo) setStatus(data) })
      .catch(() => { if (ativo) setErro(true) })
      .finally(() => { if (ativo) setLoading(false) })
    return () => { ativo = false }
  }, [])

  if (erro) return null

  if (loading || !status) {
    return (
      <div style={{ marginBottom: '3rem' }}>
        <style>{`
          .hub-status-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
          @media (min-width: 900px) { .hub-status-grid { grid-template-columns: repeat(4, 1fr); } }
          @keyframes hubPulse { 0%, 100% { background-color: #0f0f0f; } 50% { background-color: #141414; } }
        `}</style>
        <div className="hub-status-grid">
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ ...CARD_BASE, cursor: 'default', animation: 'hubPulse 1.4s ease-in-out infinite', minHeight: '120px' }} />
          ))}
        </div>
      </div>
    )
  }

  const { entregas, leads, clientesSemContato, documentos } = status

  const leadMaisAntigo = leads[0] // API ordena por created_time ascendente
  const leadAtrasado = leadMaisAntigo
    ? Date.now() - new Date(leadMaisAntigo.createdTime).getTime() > 48 * 3600000
    : false

  const maisParado = clientesSemContato[0] // API ordena por diasSemContato descendente

  const breakdown = Object.entries(documentos.porTipo)
    .map(([tipo, n]) => `${n} ${n > 1 && tipo !== 'Raio-X' ? `${tipo}s` : tipo}`)
    .join(' · ')

  return (
    <div style={{ marginBottom: '3rem' }}>
      <style>{`
        .hub-status-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        @media (min-width: 900px) { .hub-status-grid { grid-template-columns: repeat(4, 1fr); } }
      `}</style>
      <div className="hub-status-grid">
        <Card
          titulo="Próximas entregas"
          numero={entregas.length}
          sub="nos próximos 7 dias"
          href="/clientes?vista=calendario"
          vazio={entregas.length === 0}
        />
        <Card
          titulo="Leads para responder"
          numero={leads.length}
          sub={leadMaisAntigo ? `mais antigo ${tempoDesde(leadMaisAntigo.createdTime)}` : ''}
          href="/clientes?vista=leads"
          destaque={leadAtrasado}
          vazio={leads.length === 0}
        />
        <Card
          titulo="Clientes parados"
          numero={clientesSemContato.length}
          sub={maisParado ? `${maisParado.nome} — ${maisParado.diasSemContato} dias` : ''}
          href="/clientes?vista=kanban"
          vazio={clientesSemContato.length === 0}
        />
        <Card
          titulo="Gerado esta semana"
          numero={documentos.total}
          sub={breakdown}
          href="/meus-documentos"
          vazio={documentos.total === 0}
        />
      </div>
    </div>
  )
}
