'use client'

import { useState } from 'react'

// ─── Modal Pauta ─────────────────────────────────────────────────────────────
export function ModalPauta({ clienteNome, pauta, onClose }: {
  clienteNome: string
  pauta: string
  onClose: () => void
}) {
  const [copiado, setCopiado] = useState(false)

  async function copiarPauta() {
    try {
      await navigator.clipboard.writeText(pauta)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar pauta:', err)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem 2rem 1rem', borderBottom: '1px solid #1a1a1a', flexShrink: 0 }}>
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.5rem', color: '#fff', letterSpacing: '0.05em', margin: 0 }}>
            PAUTA — {clienteNome.toUpperCase()}
          </h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem' }}>
          <pre style={{ background: '#0a0a0a', padding: '24px', borderRadius: '12px', color: '#ccc', fontFamily: 'Poppins, sans-serif', fontSize: '13px', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
            {pauta}
          </pre>
        </div>
        <div style={{ padding: '1rem 2rem', borderTop: '1px solid #1a1a1a', flexShrink: 0, display: 'flex', gap: '0.625rem' }}>
          <button onClick={copiarPauta} style={{ flex: 2, background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '0.75rem', color: '#fff', fontFamily: 'Anton, sans-serif', fontSize: '0.9rem', letterSpacing: '0.12em', cursor: 'pointer', transition: 'opacity 0.15s' }}>
            {copiado ? 'COPIADO ✓' : 'COPIAR PAUTA'}
          </button>
          <button onClick={onClose} style={{ flex: 1, background: 'transparent', border: '1px solid #333', borderRadius: '8px', padding: '0.75rem', color: '#777', fontFamily: 'Poppins, sans-serif', fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#ccc' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#777' }}>
            FECHAR
          </button>
        </div>
      </div>
    </div>
  )
}
