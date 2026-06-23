'use client'

import { useState } from 'react'
import type { Cliente } from './types'

function PortalCard({ cliente }: { cliente: Cliente }) {
  const [copiado, setCopiado] = useState(false)
  const url = `https://oriumagencia.com.br/portal/${cliente.tokenPortal}`

  function handleCopiar() {
    navigator.clipboard.writeText(url)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1rem' }}>
      <p style={{ fontFamily: 'Anton, sans-serif', fontSize: '14px', color: '#fff', margin: '0 0 0.25rem', letterSpacing: '0.02em' }}>{cliente.nome}</p>
      <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: '#666', margin: '0 0 0.5rem' }}>{cliente.instagram || '—'}</p>
      <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#444', margin: '0 0 0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={handleCopiar}
          style={{ flex: 1, background: copiado ? 'rgba(34,197,94,0.12)' : '#FF6B00', border: copiado ? '1px solid rgba(34,197,94,0.4)' : 'none', borderRadius: '8px', padding: '0.625rem 0.875rem', color: copiado ? '#22C55E' : '#fff', fontFamily: 'Anton, sans-serif', fontSize: '0.7rem', letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.15s' }}>
          {copiado ? 'COPIADO ✓' : 'COPIAR LINK'}
        </button>
        <a href={url} target="_blank" rel="noopener noreferrer"
          style={{ flex: 1, textAlign: 'center', background: 'transparent', border: '1px solid #333', borderRadius: '8px', padding: '0.625rem 0.875rem', color: '#aaa', fontFamily: 'Anton, sans-serif', fontSize: '0.7rem', letterSpacing: '0.1em', textDecoration: 'none', cursor: 'pointer', transition: 'all 0.15s' }}>
          ABRIR
        </a>
      </div>
    </div>
  )
}

export function VistaPortais({ clientes }: { clientes: Cliente[] }) {
  const clientesComPortal = clientes.filter(c => c.tokenPortal)

  return (
    <div>
      {/* Header da aba */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.6rem', color: '#fff', letterSpacing: '0.03em', marginBottom: '0.25rem', textTransform: 'uppercase' }}>PORTAIS ATIVOS</h2>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', color: '#666' }}>Links exclusivos por cliente</p>
        </div>
      </div>

      {clientesComPortal.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: '#444', fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif' }}>
          Nenhum portal ativo ainda
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.875rem' }}>
          {clientesComPortal.map(c => (
            <PortalCard key={c.id} cliente={c} />
          ))}
        </div>
      )}
    </div>
  )
}
