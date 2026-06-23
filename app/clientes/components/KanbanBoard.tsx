'use client'

import { useState, useEffect } from 'react'
import { authHeaders } from '@/lib/auth'
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { Cliente, ProgressoData } from './types'
import {
  FASES,
  FASE_AVATAR_BG,
  FASE_EMPTY_MSG,
  getIniciais,
  getHealthScore,
  diasDesdeInteracao,
  HealthBadge,
  StatusBadge,
  DeliverableLabel,
} from './shared'
import { getSugestao } from '@/lib/proximo-passo'

const URGENCIA_COR: Record<'alta' | 'media' | 'baixa', string> = {
  alta: '#FF6B00',
  media: '#999',
  baixa: '#555',
}

// ─── Kanban Card ─────────────────────────────────────────────────────────────
function KanbanCard({ cliente, faseCor, faseNome, progresso, onProgressoLoaded, onSelect }: {
  cliente: Cliente
  faseCor: string
  faseNome: string
  progresso: ProgressoData | null
  onProgressoLoaded: (id: string, data: ProgressoData) => void
  onSelect: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: cliente.id })
  const health = getHealthScore(cliente)
  const semContato = diasDesdeInteracao(cliente) > 14
  const [loadingProgresso, setLoadingProgresso] = useState(progresso === null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (progresso !== null) { setLoadingProgresso(false); return }
    setLoadingProgresso(true)
    fetch(`/api/clientes/${encodeURIComponent(cliente.id)}/progresso?nome=${encodeURIComponent(cliente.nome)}`, { headers: authHeaders() })
      .then(r => r.json())
      .then((data: ProgressoData) => {
        onProgressoLoaded(cliente.id, data)
        setLoadingProgresso(false)
      })
      .catch(() => setLoadingProgresso(false))
  }, [cliente.id, cliente.nome]) // eslint-disable-line react-hooks/exhaustive-deps

  const avatarBg = FASE_AVATAR_BG[faseNome] ?? '#1a1a1a'
  const iniciais = getIniciais(cliente.nome)
  const borderSide = isDragging ? faseCor : hovered ? 'rgba(255,107,0,0.55)' : '#1a1a1a'

  const sugestao = progresso ? getSugestao({
    nome: cliente.nome,
    faseAtual: cliente.faseAtual,
    diasSemContato: diasDesdeInteracao(cliente),
    etapasConcluidas: progresso.concluidas,
    totalEtapas: progresso.total,
  }) : null

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#0f0f0f',
        border: `1px solid ${borderSide}`,
        borderLeft: `3px solid ${faseCor}`,
        borderRadius: '10px',
        padding: '0.875rem 1rem',
        cursor: isDragging ? 'grabbing' : 'grab',
        marginBottom: '0.5rem',
        userSelect: 'none',
        opacity: isDragging ? 0.5 : 1,
        transform: CSS.Transform.toString(transform),
        zIndex: isDragging ? 50 : undefined,
        position: 'relative',
        boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,0.6)' : hovered ? '0 4px 16px rgba(255,107,0,0.07)' : undefined,
        transition: isDragging ? undefined : 'border-color 0.18s, box-shadow 0.18s',
      }}
    >
      {/* Avatar + nome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.625rem' }}>
        <div style={{
          width: '34px', height: '34px', borderRadius: '50%',
          background: avatarBg, border: `1px solid ${faseCor}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ color: faseCor, fontSize: '0.62rem', fontWeight: 700, fontFamily: 'Anton, sans-serif', letterSpacing: '0.04em' }}>
            {iniciais}
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.25rem' }}>
            <span style={{ color: '#f0f0f0', fontWeight: 600, fontSize: '0.88rem', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {cliente.nome}
            </span>
            {cliente.precisaRelatorio && <span title="Precisa relatório" style={{ fontSize: '0.72rem', flexShrink: 0 }}>📊</span>}
          </div>
          {sugestao && (
            <p style={{
              color: URGENCIA_COR[sugestao.urgencia], fontSize: '10px', fontFamily: 'Poppins, sans-serif',
              margin: '0.125rem 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {sugestao.acao}
            </p>
          )}
        </div>
      </div>

      {/* Health badge */}
      <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
        <HealthBadge health={health} />
        {semContato && (
          <span style={{ fontSize: '0.64rem', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', borderRadius: '4px', padding: '2px 6px', border: '1px solid rgba(245,158,11,0.2)' }}>⚠ Sem contato</span>
        )}
      </div>

      {/* Barra de progresso */}
      {loadingProgresso ? (
        <div style={{ height: '3px', borderRadius: '2px', background: '#1a1a1a', marginBottom: '0.5rem', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '45%', background: '#2a2a2a', borderRadius: '2px', animation: 'orium-pulse 1.5s ease-in-out infinite' }} />
        </div>
      ) : progresso !== null ? (
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ color: '#555', fontSize: '0.64rem' }}>{progresso.concluidas}/{progresso.total} etapas</span>
            <span style={{ color: '#FF6B00', fontSize: '0.64rem', fontWeight: 700 }}>{progresso.percentual}%</span>
          </div>
          <div style={{ height: '3px', borderRadius: '2px', background: '#1a1a1a' }}>
            <div style={{ height: '100%', width: `${progresso.percentual}%`, background: '#FF6B00', borderRadius: '2px', transition: 'width 0.4s ease' }} />
          </div>
        </div>
      ) : null}

      {/* Status + deliverable */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.375rem', flexWrap: 'wrap' }}>
        <StatusBadge status={cliente.status} />
        {cliente.proximoDeliverable && (
          <span style={{ fontSize: '0.75rem' }}>
            <DeliverableLabel dateStr={cliente.proximoDeliverable} />
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Coluna Kanban ────────────────────────────────────────────────────────────
function KanbanColuna({ fase, cor, clientes, progressos, onProgressoLoaded, onSelect }: {
  fase: string
  cor: string
  clientes: Cliente[]
  progressos: Record<string, ProgressoData>
  onProgressoLoaded: (id: string, data: ProgressoData) => void
  onSelect: (c: Cliente) => void
}) {
  const { isOver, setNodeRef } = useDroppable({ id: fase })

  const receitaFase = clientes
    .filter(c => c.status === 'Ativo' && c.valorMensal !== null)
    .reduce((acc, c) => acc + (c.valorMensal ?? 0), 0)

  return (
    <div
      ref={setNodeRef}
      style={{
        background: isOver ? '#151515' : '#111111',
        border: `1px solid ${isOver ? '#FF6B00' : '#1a1a1a'}`,
        borderTop: `3px solid ${cor}`,
        borderRadius: '8px',
        padding: '0.875rem',
        minWidth: '220px',
        flex: '1 1 220px',
        transition: 'border-color 0.15s, background 0.15s',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: cor, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{fase}</span>
        <span style={{ background: `${cor}22`, color: cor, borderRadius: '20px', padding: '1px 8px', fontSize: '0.72rem', fontWeight: 700 }}>{clientes.length}</span>
      </div>
      <div style={{ flex: 1 }}>
        {clientes.map(c => (
          <KanbanCard
            key={c.id}
            cliente={c}
            faseCor={cor}
            faseNome={fase}
            progresso={progressos[c.id] ?? null}
            onProgressoLoaded={onProgressoLoaded}
            onSelect={() => onSelect(c)}
          />
        ))}
        {clientes.length === 0 && (
          <div style={{ color: '#444', fontSize: '0.78rem', textAlign: 'center', padding: '2rem 0.5rem', borderRadius: '8px', border: '1px dashed #1a1a1a', lineHeight: 1.5 }}>
            {FASE_EMPTY_MSG[fase] ?? 'Nenhum cliente'}
          </div>
        )}
      </div>
      {receitaFase > 0 && (
        <div style={{ marginTop: '0.625rem', paddingTop: '0.5rem', borderTop: '1px solid #1a1a1a', textAlign: 'right' }}>
          <span style={{ color: '#555', fontSize: '0.72rem' }}>
            R$ {receitaFase.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Vista Kanban ─────────────────────────────────────────────────────────────
export function KanbanBoard({ clientes, progressos, onProgressoLoaded, onSelect, kanbanErro, onDismissErro, onDragStart, onDragEnd }: {
  clientes: Cliente[]
  progressos: Record<string, ProgressoData>
  onProgressoLoaded: (id: string, data: ProgressoData) => void
  onSelect: (c: Cliente) => void
  kanbanErro: string
  onDismissErro: () => void
  onDragStart: () => void
  onDragEnd: (event: DragEndEvent) => void
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {kanbanErro && (
        <div style={{ marginBottom: '0.875rem', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: '8px', padding: '0.625rem 0.875rem', color: '#fca5a5', fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
          <span>{kanbanErro}</span>
          <button type="button" onClick={onDismissErro} style={{ background: 'transparent', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1 }}>
            ×
          </button>
        </div>
      )}
      <div className="orium-scrollbar" style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem', alignItems: 'flex-start' }}>
        {FASES.map(fase => (
          <KanbanColuna key={fase.nome} fase={fase.nome} cor={fase.cor}
            clientes={clientes.filter(c => c.faseAtual === fase.nome)}
            progressos={progressos}
            onProgressoLoaded={onProgressoLoaded}
            onSelect={onSelect} />
        ))}
      </div>
    </DndContext>
  )
}
