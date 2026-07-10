'use client'

import type { CSSProperties } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { corDoFormato, type EventoCalendario } from '../types'

export function EventCard({ evento }: { evento: EventoCalendario }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: evento.id })
  const cor = corDoFormato(evento.formato)

  const style: CSSProperties = {
    background: `${cor}1a`,
    borderLeft: `3px solid ${cor}`,
    borderRadius: '6px',
    padding: '0.55rem 0.7rem',
    marginBottom: '0.5rem',
    cursor: isDragging ? 'grabbing' : 'grab',
    userSelect: 'none',
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? 50 : undefined,
    position: 'relative',
    boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,0.6)' : undefined,
  }

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      <span style={{ display: 'inline-block', background: `${cor}33`, border: `1px solid ${cor}66`, borderRadius: '4px', padding: '0.1rem 0.4rem', color: cor, fontSize: '0.62rem', fontFamily: 'Anton, sans-serif', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
        {(evento.formato || 'SEM FORMATO').toUpperCase()}
      </span>
      <p title={evento.titulo} style={{ margin: '0 0 0.3rem', color: '#fff', fontSize: '0.82rem', fontFamily: 'Poppins, sans-serif', fontWeight: 600, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {evento.titulo || 'Sem título'}
      </p>
      <p style={{ margin: 0, color: '#777', fontSize: '0.68rem', fontFamily: 'Poppins, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {evento.cliente || '—'} · {evento.status || '—'}
      </p>
    </div>
  )
}
