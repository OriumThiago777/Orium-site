'use client'

import React, { useEffect, useRef, useState } from 'react'
import { authHeaders } from '@/lib/auth'

export type BriefingImportado = {
  nome: string
  segmento: string
  publicoAlvo: string
  dores: string
  objetivos: string
  instagram: string
  cidade: string
  tipo: 'Pessoa' | 'Empresa'
}

type Props = {
  cliente: string
  /** Retornar true se algum campo já preenchido foi preservado (muda o texto do toast). */
  onImport: (dados: BriefingImportado) => boolean | void
}

export default function ImportarBriefing({ cliente, onImport }: Props) {
  const [buscando, setBuscando] = useState(false)
  const [toast, setToast] = useState<{ texto: string; erro: boolean } | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  function mostrarToast(texto: string, erro: boolean) {
    setToast({ texto, erro })
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setToast(null), 3500)
  }

  if (!cliente.trim()) return null

  async function importar() {
    setBuscando(true)
    try {
      const res = await fetch(`/api/briefing/buscar?cliente=${encodeURIComponent(cliente.trim())}`, {
        headers: authHeaders(),
      })
      if (!res.ok) {
        mostrarToast('Nenhum briefing encontrado para este cliente', true)
        return
      }
      const dados: BriefingImportado = await res.json()
      const preservados = onImport(dados)
      mostrarToast(
        preservados ? 'Dados importados — revise antes de continuar' : 'Dados importados do briefing',
        false,
      )
    } catch {
      mostrarToast('Nenhum briefing encontrado para este cliente', true)
    } finally {
      setBuscando(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={importar}
        disabled={buscando}
        style={{
          alignSelf: 'flex-start',
          background: 'transparent',
          border: '1px solid rgba(255,107,0,0.4)',
          borderRadius: '8px',
          padding: '0.5rem 1rem',
          color: '#FF6B00',
          fontFamily: 'Anton, sans-serif',
          fontSize: '0.78rem',
          letterSpacing: '0.12em',
          cursor: buscando ? 'wait' : 'pointer',
          opacity: buscando ? 0.6 : 1,
          transition: 'all 0.2s',
          marginTop: '0.625rem',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B00'; e.currentTarget.style.background = 'rgba(255,107,0,0.07)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'; e.currentTarget.style.background = 'transparent' }}
      >
        {buscando ? 'BUSCANDO...' : '↓ IMPORTAR DO BRIEFING'}
      </button>
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          background: '#0f0f0f',
          border: `1px solid ${toast.erro ? '#444' : '#FF6B00'}`,
          borderRadius: '10px',
          padding: '0.875rem 1.25rem',
          color: toast.erro ? '#999' : '#fff',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '0.85rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        }}>
          {toast.texto}
        </div>
      )}
    </>
  )
}
