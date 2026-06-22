'use client'

import { useState, type CSSProperties, type FocusEvent, type FormEvent } from 'react'
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
}

const inputStyle: CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid #1e1e1e',
  borderRadius: '10px',
  padding: '0.75rem 1rem',
  color: '#fff',
  fontSize: '0.9rem',
  fontFamily: 'Poppins, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
}

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: '0.72rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#666',
  marginBottom: '0.4rem',
  fontFamily: 'Poppins, sans-serif',
}

function focusOrange(e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  e.target.style.borderColor = '#FF6B00'
}

function blurGray(e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  e.target.style.borderColor = '#1e1e1e'
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

export default function ModalConteudo({ slug, item, dataInicial, onClose, onSaved }: Props) {
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
      onSaved()
      onClose()
    } catch (err) {
      console.error('Erro ao excluir conteúdo do calendário:', err)
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
      onClick={onClose}
    >
      <form
        onSubmit={handleSalvar}
        onClick={e => e.stopPropagation()}
        style={{ background: '#1C1C1C', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.3rem', color: '#fff', letterSpacing: '0.04em', marginBottom: '1.5rem' }}>
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
              {FORMATO_OPTIONS.map(option => <option key={option} value={option} style={{ background: '#1C1C1C' }}>{option}</option>)}
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
              {STATUS_OPTIONS.map(option => <option key={option} value={option} style={{ background: '#1C1C1C' }}>{option}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: item ? 'space-between' : 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
          {item && (
            <button
              type="button"
              onClick={handleExcluir}
              disabled={excluindo}
              style={{ background: 'transparent', border: '1px solid #DC2626', borderRadius: '8px', color: '#DC2626', padding: '0.7rem 1.5rem', fontSize: '0.85rem', fontFamily: 'Poppins, sans-serif', cursor: excluindo ? 'default' : 'pointer', opacity: excluindo ? 0.6 : 1 }}
            >
              {excluindo ? 'Excluindo...' : 'Excluir'}
            </button>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'transparent', border: '1px solid #1e1e1e', borderRadius: '8px', color: '#999', padding: '0.7rem 1.5rem', fontSize: '0.85rem', fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              style={{ background: '#FF6B00', border: 'none', borderRadius: '8px', color: '#000', padding: '0.7rem 1.5rem', fontSize: '0.85rem', fontFamily: 'Anton, sans-serif', letterSpacing: '0.05em', cursor: salvando ? 'default' : 'pointer', opacity: salvando ? 0.6 : 1, boxShadow: '0 4px 20px rgba(255,107,0,0.2)' }}
            >
              {salvando ? 'SALVANDO...' : 'SALVAR'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
