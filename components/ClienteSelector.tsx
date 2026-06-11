'use client'

import React, { useEffect, useState } from 'react'
import { authHeaders } from '@/lib/auth'

const NOVO_CLIENTE = '__novo__'

type Props = {
  value: string
  onChange: (nome: string) => void
  placeholder?: string
}

export default function ClienteSelector({ value, onChange, placeholder = 'Nome do cliente' }: Props) {
  const [nomes, setNomes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(false)
  const [novo, setNovo] = useState(false)

  useEffect(() => {
    let ativo = true
    fetch('/api/clientes', { headers: authHeaders() })
      .then(res => {
        if (!res.ok) throw new Error('CRM indisponível')
        return res.json()
      })
      .then((data: { clientes?: Array<{ nome?: string }> }) => {
        if (!ativo) return
        const unicos = Array.from(new Set(
          (data.clientes ?? []).map(c => (c.nome ?? '').trim()).filter(Boolean)
        )).sort((a, b) => a.localeCompare(b, 'pt-BR'))
        setNomes(unicos)
      })
      .catch(() => { if (ativo) setErro(true) })
      .finally(() => { if (ativo) setLoading(false) })
    return () => { ativo = false }
  }, [])

  const baseStyle: React.CSSProperties = {
    width: '100%', background: '#0f0f0f', border: '1px solid #1e1e1e',
    borderRadius: '10px', padding: '0.875rem 1.25rem', color: '#fff',
    fontSize: '0.95rem', fontFamily: 'Poppins, sans-serif', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s',
  }

  const onF = (e: React.FocusEvent<HTMLSelectElement | HTMLInputElement>) =>
    { e.target.style.borderColor = '#FF6B00' }
  const onB = (e: React.FocusEvent<HTMLSelectElement | HTMLInputElement>) =>
    { e.target.style.borderColor = '#1e1e1e' }

  if (loading) {
    return (
      <select disabled style={{ ...baseStyle, color: '#555', cursor: 'wait' }}>
        <option>Carregando clientes...</option>
      </select>
    )
  }

  if (erro) {
    return (
      <div>
        <input
          type="text" value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} style={baseStyle} onFocus={onF} onBlur={onB}
        />
        <p style={{ color: '#555', fontSize: '0.72rem', marginTop: '0.375rem', fontFamily: 'Poppins, sans-serif' }}>
          CRM indisponível
        </p>
      </div>
    )
  }

  // Valor restaurado de rascunho/query que não existe no CRM → modo texto livre
  const valorForaDoCrm = value !== '' && !nomes.includes(value)
  const modoTextoLivre = novo || valorForaDoCrm

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      <select
        value={modoTextoLivre ? NOVO_CLIENTE : value}
        onChange={e => {
          if (e.target.value === NOVO_CLIENTE) { setNovo(true); onChange('') }
          else { setNovo(false); onChange(e.target.value) }
        }}
        style={{ ...baseStyle, cursor: 'pointer' }} onFocus={onF} onBlur={onB}
      >
        <option value="">— Selecionar cliente —</option>
        {nomes.map(n => <option key={n} value={n}>{n}</option>)}
        <option value={NOVO_CLIENTE}>+ Novo cliente</option>
      </select>
      {modoTextoLivre && (
        <input
          type="text" value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} style={baseStyle} onFocus={onF} onBlur={onB}
          autoFocus={novo}
        />
      )}
    </div>
  )
}
