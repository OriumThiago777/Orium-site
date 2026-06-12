'use client'

import ToolBackground from '@/components/ToolBackground'
import type { Cliente, HealthScore } from './types'

export const FASES: { nome: string; cor: string }[] = [
  { nome: 'Prospecção', cor: '#6B7280' },
  { nome: 'Diagnóstico', cor: '#FF6B00' },
  { nome: 'Estruturação Inicial', cor: '#3B82F6' },
  { nome: 'Conteúdo e Comunicação', cor: '#8B5CF6' },
  { nome: 'Expansão Digital', cor: '#EC4899' },
  { nome: 'Pausado', cor: '#6B7280' },
  { nome: 'Finalizado', cor: '#22C55E' },
]

export const FASE_COR: Record<string, string> = Object.fromEntries(FASES.map(f => [f.nome, f.cor]))

export const STATUS_COR: Record<string, string> = {
  'Ativo': '#22C55E',
  'Inativo': '#6B7280',
  'Proposta': '#3B82F6',
}

export const HEALTH_COR: Record<string, string> = {
  verde: '#22c55e',
  amarelo: '#f59e0b',
  vermelho: '#ef4444',
}

export const FASE_AVATAR_BG: Record<string, string> = {
  'Prospecção': '#2a2a2a',
  'Diagnóstico': '#1a3a2a',
  'Estruturação Inicial': '#1a2a3a',
  'Conteúdo e Comunicação': '#2a1a3a',
  'Expansão Digital': '#3a2a1a',
  'Pausado': '#2a2a2a',
  'Finalizado': '#1a1a2a',
}

export const FASE_EMPTY_MSG: Record<string, string> = {
  'Prospecção': 'Nenhum cliente em prospecção',
  'Diagnóstico': 'Nenhum cliente em diagnóstico ainda',
  'Estruturação Inicial': 'Nenhum cliente em estruturação',
  'Conteúdo e Comunicação': 'Nenhum conteúdo ativo',
  'Expansão Digital': 'Nenhum cliente em expansão',
  'Pausado': 'Nenhum cliente pausado',
  'Finalizado': 'Nenhum cliente finalizado',
}

export function getIniciais(nome: string): string {
  const palavras = nome.trim().split(/\s+/).filter(Boolean)
  if (!palavras.length) return '?'
  if (palavras.length === 1) return palavras[0].slice(0, 2).toUpperCase()
  return (palavras[0][0] + palavras[palavras.length - 1][0]).toUpperCase()
}

export function BgImage() {
  return <ToolBackground />
}

export function formatBRL(value: number | null) {
  if (value === null) return '—'
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

export function deliverableUrgency(dateStr: string): 'vencido' | 'urgente' | 'normal' | 'sem' {
  if (!dateStr) return 'sem'
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const dt = new Date(dateStr + 'T00:00:00')
  const diff = Math.floor((dt.getTime() - today.getTime()) / 86400000)
  if (diff < 0) return 'vencido'
  if (diff <= 1) return 'urgente'
  return 'normal'
}

export function diasDesdeInteracao(cliente: Cliente): number {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const refStr = cliente.ultimaInteracao || cliente.dataInicio
  if (!refStr) return 9999
  const ref = new Date(refStr + 'T00:00:00')
  return Math.floor((today.getTime() - ref.getTime()) / 86400000)
}

export function getHealthScore(cliente: Cliente): HealthScore {
  const motivos: string[] = []
  const hoje = new Date()
  hoje.setHours(0,0,0,0)

  if (cliente.proximoDeliverable) {
    const d = new Date(cliente.proximoDeliverable)
    d.setHours(0,0,0,0)
    if (d < hoje) motivos.push('Entrega vencida')
  }
  if (cliente.precisaRelatorio) motivos.push('Relatório pendente')

  if (motivos.length > 0) return { cor: 'vermelho', motivos }

  const refDate = cliente.ultimaInteracao || cliente.dataInicio
  if (!refDate) {
    motivos.push('Nenhuma interação registrada')
    return { cor: 'amarelo', motivos }
  }
  const ref = new Date(refDate)
  const diffDias = Math.floor((hoje.getTime() - ref.getTime()) / 86400000)
  if (diffDias > 14) {
    motivos.push(`Sem contato há ${diffDias} dias`)
    return { cor: 'amarelo', motivos }
  }

  return { cor: 'verde', motivos: ['Cliente em dia'] }
}

export function formatarDataHora(): string {
  const n = new Date()
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${pad(n.getDate())}/${pad(n.getMonth() + 1)}/${n.getFullYear()} ${pad(n.getHours())}:${pad(n.getMinutes())}`
}

export const TIPO_DOC_COR: Record<string, string> = {
  'Raio-X': '#FF6B00',
  'Proposta': '#3B82F6',
  'Relatório': '#22C55E',
  'Contrato': '#8B5CF6',
}

export const TIPO_DOC_ROTA: Record<string, string> = {
  'Raio-X': '/raio-x',
  'Proposta': '/proposta',
  'Relatório': '/relatorio',
  'Contrato': '/contrato',
}

export const iconeAtividade: Record<string, string> = {
  cliente_criado: '🟢',
  fase_alterada: '🔄',
  proposta_gerada: '📋',
  relatorio_gerado: '📄',
  checklist_gerado: '✅',
  raio_x_gerado: '🔍',
  nota_adicionada: '💬',
  contrato_gerado: '📝',
}

export function DeliverableLabel({ dateStr }: { dateStr: string }) {
  const urgency = deliverableUrgency(dateStr)
  if (urgency === 'sem') return <span style={{ color: '#555' }}>Sem prazo</span>
  const colors: Record<string, string> = { vencido: '#ef4444', urgente: '#FF6B00', normal: '#777' }
  const icons: Record<string, string> = { vencido: ' ⚠', urgente: ' 🔔', normal: '' }
  return <span style={{ color: colors[urgency], fontSize: '0.82rem' }}>{formatDate(dateStr)}{icons[urgency]}</span>
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '20px',
      fontSize: '0.72rem',
      fontWeight: 600,
      background: `${STATUS_COR[status] ?? '#6B7280'}22`,
      color: STATUS_COR[status] ?? '#6B7280',
      border: `1px solid ${STATUS_COR[status] ?? '#6B7280'}44`,
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
    }}>
      {status || '—'}
    </span>
  )
}

export function HealthBadge({ health }: { health: HealthScore }) {
  const label = health.cor === 'verde' ? 'Saudável' : health.cor === 'amarelo' ? 'Atenção' : 'Crítico'
  const cor = HEALTH_COR[health.cor]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '2px 8px', borderRadius: '20px',
      fontSize: '0.66rem', fontWeight: 600,
      background: `${cor}18`, color: cor,
      border: `1px solid ${cor}30`,
      letterSpacing: '0.03em', whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: cor, flexShrink: 0, display: 'inline-block' }} />
      {label}
    </span>
  )
}

export function FaseBadge({ fase }: { fase: string }) {
  const cor = FASE_COR[fase] ?? '#555'
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '20px',
      fontSize: '0.72rem',
      fontWeight: 600,
      background: `${cor}22`,
      color: cor,
      border: `1px solid ${cor}44`,
      letterSpacing: '0.03em',
    }}>
      {fase || '—'}
    </span>
  )
}
