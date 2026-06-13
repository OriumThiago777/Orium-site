'use client'

import { useState } from 'react'
import { FASE_MENSAGENS } from '@/lib/fase-mensagens'

// ─── Modal de mensagem por fase ──────────────────────────────────────────────
// Aparece após mover um cliente de fase no Kanban — mensagem pronta para
// copiar e enviar pelo WhatsApp.
export function MensagemFase({ cliente, fase, onClose }: { cliente: string; fase: string; onClose: () => void }) {
  const [copiado, setCopiado] = useState(false)

  const template = FASE_MENSAGENS[fase]
  if (!template) return null

  const mensagem = template.replaceAll('[NOME]', cliente)

  async function handleCopiar() {
    try {
      await navigator.clipboard.writeText(mensagem)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar mensagem:', err)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={onClose}>
      <div style={{ background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.4rem', color: '#fff', letterSpacing: '0.05em', margin: 0, textTransform: 'uppercase' }}>
          Mensagem para {cliente}
        </h2>
        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem', color: '#FF6B00', letterSpacing: '0.08em', margin: '0.375rem 0 1.25rem' }}>
          Fase: {fase}
        </p>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '1rem 1.125rem', color: '#ddd', fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          {mensagem}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleCopiar} style={{ flex: 1, background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '0.875rem', color: '#fff', fontFamily: 'Anton, sans-serif', fontSize: '0.9rem', letterSpacing: '0.12em', cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,107,0,0.25)', transition: 'opacity 0.15s' }}>
            {copiado ? 'COPIADO ✓' : 'COPIAR MENSAGEM'}
          </button>
          <button onClick={onClose} style={{ flex: 1, background: 'transparent', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '0.875rem', color: '#777', fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#ccc' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#777' }}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
