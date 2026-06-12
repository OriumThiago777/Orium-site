'use client'

import { useState } from 'react'
import { authHeaders } from '@/lib/auth'
import type { Cliente } from './types'
import { FASES } from './shared'

// ─── Modal Novo Cliente ──────────────────────────────────────────────────────
export function ModalNovoCliente({ onClose, onCreated }: { onClose: () => void; onCreated: (c: Cliente) => void }) {
  const [form, setForm] = useState({ nome: '', status: 'Proposta', faseAtual: 'Diagnóstico', instagram: '', email: '', contato: '' })
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome.trim()) return
    setLoading(true)
    setErro('')
    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        onCreated(data)
        onClose()
      } else {
        setErro(data?.detail || data?.error || 'Não foi possível criar o cliente.')
      }
    } catch (err) {
      console.error('Erro ao criar cliente:', err)
      setErro('Não foi possível conectar ao servidor. Tente novamente.')
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
          {erro && (
            <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: '8px', padding: '0.75rem 0.875rem', color: '#fca5a5', fontSize: '0.82rem', lineHeight: 1.5 }}>
              {erro}
            </div>
          )}
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
