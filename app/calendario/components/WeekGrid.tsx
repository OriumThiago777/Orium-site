'use client'

import type { CSSProperties } from 'react'
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core'
import type { EventoCalendario } from '../types'
import { EventCard } from './EventCard'

const DIAS_SEMANA = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM']

function toISODate(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function DiaColuna({ dia, eventos }: { dia: Date; eventos: EventoCalendario[] }) {
  const isoDate = toISODate(dia)
  const { isOver, setNodeRef } = useDroppable({ id: isoDate })
  const ehHoje = isSameDay(dia, new Date())

  const style: CSSProperties = {
    background: isOver ? '#151515' : '#0f0f0f',
    border: `1px solid ${isOver ? '#FF6B00' : ehHoje ? 'rgba(255,107,0,0.4)' : '#1a1a1a'}`,
    borderRadius: '8px',
    padding: '0.75rem',
    minHeight: '360px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'border-color 0.15s, background 0.15s',
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ marginBottom: '0.6rem' }}>
        <p style={{ margin: 0, color: '#666', fontSize: '0.65rem', letterSpacing: '0.12em', fontFamily: 'Poppins, sans-serif' }}>
          {DIAS_SEMANA[dia.getDay() === 0 ? 6 : dia.getDay() - 1]}
        </p>
        <p style={{ margin: 0, color: ehHoje ? '#FF6B00' : '#fff', fontSize: '1.1rem', fontFamily: 'Anton, sans-serif' }}>{dia.getDate()}</p>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {eventos.length === 0 ? (
          <p style={{ color: '#333', fontSize: '0.75rem', fontFamily: 'Poppins, sans-serif' }}>—</p>
        ) : eventos.map(evento => <EventCard key={evento.id} evento={evento} />)}
      </div>
    </div>
  )
}

export function WeekGrid({ dias, eventosPorDia, onDragEnd }: {
  dias: Date[]
  eventosPorDia: (dia: Date) => EventoCalendario[]
  onDragEnd: (event: DragEndEvent) => void
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  return (
    <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragEnd={onDragEnd}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.625rem' }}>
        {dias.map(dia => (
          <DiaColuna key={toISODate(dia)} dia={dia} eventos={eventosPorDia(dia)} />
        ))}
      </div>
    </DndContext>
  )
}
