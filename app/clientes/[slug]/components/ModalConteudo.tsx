'use client'

import { useState, type CSSProperties, type FocusEvent, type FormEvent, type MouseEvent } from 'react'
import {
  FORMATO_OPTIONS,
  STATUS_OPTIONS,
  type CalendarioClienteItem,
} from '@/lib/clientes-calendario'

type Props = {
  slug: string
  item: CalendarioClienteItem | null
  dataInicial: string
  onClose: () => void
  onSaved: () => void
  onDeleted: (id: string) => void
}

const inputStyle: CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '4px',
  padding: '0.6rem 0.75rem',
  color: '#fff',
  fontSize: '0.85rem',
  fontFamily: 'Poppins, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 150ms',
}

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: '0.7rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.4)',
  marginBottom: '6px',
  fontFamily: 'Poppins, sans-serif',
}

function focusOrange(e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  e.target.style.borderColor = '#FF6B00'
}

function blurGray(e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  e.target.style.borderColor = 'rgba(255,255,255,0.08)'
}

function hoverCancelarIn(e: MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
}

function hoverCancelarOut(e: MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
}

function hoverSalvarIn(e: MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.background = '#e55f00'
}

function hoverSalvarOut(e: MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.background = '#FF6B00'
}

function hoverExcluirIn(e: MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.background = 'rgba(220,38,38,0.2)'
}

function hoverExcluirOut(e: MouseEvent<HTMLButtonElement>) {
  e.currentTarget.style.background = 'rgba(220,38,38,0.12)'
}

function gerarTitulo(ideia: string, formato: string, data: string) {
  const ideiaLimpa = ideia.trim().replace(/\s+/g, ' ')
  if (ideiaLimpa) {
    return ideiaLimpa.length > 50 ? `${ideiaLimpa.slice(0, 50)}...` : ideiaLimpa
  }

  return `Conteúdo - ${formato} - ${data}`
}

function getCriadoPor(quemVaiFazer: string) {
  return quemVaiFazer === 'ORIUM' ? 'ORIUM' : 'Cliente'
}

export default function ModalConteudo({ slug, item, dataInicial, onClose, onSaved, onDeleted }: Props) {
  const [ideiaRoteiro, setIdeiaRoteiro] = useState(item?.sobre || item?.titulo || '')
  const [tipoConteudo, setTipoConteudo] = useState<string>(item?.formato || FORMATO_OPTIONS[0])
  const [quemVaiFazer, setQuemVaiFazer] = useState<string>(item?.quemGrava || '')
  const [data, setData] = useState(item?.data ?? dataInicial)
  const [status, setStatus] = useState<string>(item?.status || STATUS_OPTIONS[0])
  const [salvando, setSalvando] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  async function handleSalvar(e: FormEvent) {
    e.preventDefault()
    if (!ideiaRoteiro.trim() || !data) return

    setSalvando(true)
    try {
      const payload = {
        titulo: gerarTitulo(ideiaRoteiro, tipoConteudo, data),
        data,
        formato: tipoConteudo,
        quemGrava: quemVaiFazer.trim() || 'A definir',
        sobre: ideiaRoteiro,
        criadoPor: getCriadoPor(quemVaiFazer),
        status,
        observacoes: item?.observacoes ?? '',
      }
      const url = item
        ? `/api/clientes/${slug}/calendario/${item.id}`
        : `/api/clientes/${slug}/calendario`
      const res = await fetch(url, {
        method: item ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Falha ao salvar conteúdo')
      onSaved()
      onClose()
    } catch (err) {
      console.error('Erro ao salvar conteúdo do calendário:', err)
    } finally {
      setSalvando(false)
    }
  }

  async function handleExcluir() {
    if (!item) return
    if (!confirm('Excluir esta ideia do calendário?')) return

    setExcluindo(true)
    try {
      const res = await fetch(`/api/clientes/${slug}/calendario/${item.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Falha ao excluir conteúdo')
      onDeleted(item.id)
      onClose()
    } catch (err) {
      console.error('Erro ao excluir conteúdo do calendário:', err)
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
      onClick={onClose}
    >
      <form
        onSubmit={handleSalvar}
        onClick={e => e.stopPropagation()}
        style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', boxShadow: '0 24px 64px rgba(0,0,0,0.6)', padding: '1.75rem', width: 'calc(100% - 2rem)', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.1rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.5rem' }}>
          Nova ideia de conteúdo
        </h2>

        <div style={{ marginBottom: '1.1rem' }}>
          <label style={labelStyle}>IDEIA DO ROTEIRO</label>
          <textarea
            value={ideiaRoteiro}
            onChange={e => setIdeiaRoteiro(e.target.value)}
            rows={5}
            placeholder="Descreva a ideia, gancho, cenas ou pontos principais do conteúdo."
            required
            style={{ ...inputStyle, resize: 'vertical', minHeight: '140px', lineHeight: 1.5 }}
            onFocus={focusOrange}
            onBlur={blurGray}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>TIPO DE CONTEÚDO</label>
            <select value={tipoConteudo} onChange={e => setTipoConteudo(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }} onFocus={focusOrange} onBlur={blurGray}>
              {FORMATO_OPTIONS.map(option => <option key={option} value={option} style={{ background: '#111111' }}>{option}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>QUEM VAI FAZER</label>
            <input
              value={quemVaiFazer}
              onChange={e => setQuemVaiFazer(e.target.value)}
              placeholder="Ex: Thiago, equipe, cliente, designer..."
              style={inputStyle}
              onFocus={focusOrange}
              onBlur={blurGray}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>DATA</label>
            <input
              type="date"
              value={data}
              onChange={e => setData(e.target.value)}
              required
              style={{ ...inputStyle, colorScheme: 'dark' }}
              onFocus={focusOrange}
              onBlur={blurGray}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>STATUS</label>
            <select value={status} onChange={e => setStatus(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }} onFocus={focusOrange} onBlur={blurGray}>
              {STATUS_OPTIONS.map(option => <option key={option} value={option} style={{ background: '#111111' }}>{option}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: item ? 'space-between' : 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
          {item && (
            <button
              type="button"
              onClick={handleExcluir}
              disabled={excluindo}
              onMouseEnter={hoverExcluirIn}
              onMouseLeave={hoverExcluirOut}
              style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '4px', color: '#ef4444', padding: '0.65rem 1.5rem', fontSize: '0.8rem', fontFamily: 'Poppins, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, transition: 'background 150ms', cursor: excluindo ? 'default' : 'pointer', opacity: excluindo ? 0.6 : 1 }}
            >
              {excluindo ? 'Excluindo...' : 'Excluir'}
            </button>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto' }}>
            <button
              type="button"
              onClick={onClose}
              onMouseEnter={hoverCancelarIn}
              onMouseLeave={hoverCancelarOut}
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: 'rgba(255,255,255,0.6)', padding: '0.65rem 1.5rem', fontSize: '0.8rem', fontFamily: 'Poppins, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, transition: 'border-color 150ms', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              onMouseEnter={hoverSalvarIn}
              onMouseLeave={hoverSalvarOut}
              style={{ background: '#FF6B00', border: 'none', borderRadius: '4px', color: '#000', padding: '0.65rem 1.5rem', fontSize: '0.8rem', fontFamily: 'Poppins, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, transition: 'background 150ms', cursor: salvando ? 'default' : 'pointer', opacity: salvando ? 0.6 : 1 }}
            >
              {salvando ? 'SALVANDO...' : 'SALVAR'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
