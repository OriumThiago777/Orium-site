'use client'

import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import {
  CLIENTES_PORTAL,
  FORMATO_COLORS,
  FORMATO_OPTIONS,
  MESES_NOMES,
  STATUS_OPTIONS,
  gerarGradeMensal,
  isClienteSlug,
  isSameDay,
  toISODate,
  type CalendarioClienteItem,
} from '@/lib/clientes-calendario'
import ModalConteudo from './components/ModalConteudo'

const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']
const FALLBACK_MESSAGE = 'Cliente não encontrado ou calendário ainda não configurado.'
const CLIENTE_LOGOS: Record<string, string> = {
  altemans: '/logo-altemans.png',
}

// Mapeamento de cor por status. STATUS_OPTIONS reais (lib/clientes-calendario.ts) divergem
// dos 4 valores assumidos no briefing visual original (Planejado/Em produção/Pronto/Publicado) —
// "Pronto" foi reatribuído para "Aprovado" (equivalente real mais próximo) e os 2 valores extras
// (Ideia, Em revisão) ganharam cor própria seguindo o mesmo espírito da paleta.
const STATUS_COLORS: Record<string, string> = {
  Ideia: 'rgba(255,255,255,0.4)',
  Planejado: 'rgba(255,255,255,0.4)',
  'Em produção': '#FF6B00',
  'Em revisão': '#CA8A04',
  Aprovado: '#16A34A',
  Publicado: '#2563EB',
}

const FILTRO_TODOS = 'Todos'

type CalendarioResponse = {
  items?: CalendarioClienteItem[]
  configured?: boolean
  error?: string
}

type AbaId = 'calendario' | 'documentos' | 'relatorios'

const ABAS: Array<{ id: AbaId; label: string; habilitada: boolean }> = [
  { id: 'calendario', label: 'Calendário', habilitada: true },
  { id: 'documentos', label: 'Documentos', habilitada: false },
  { id: 'relatorios', label: 'Relatórios', habilitada: false },
]

// Aplica uma opacidade a uma cor, aceitando tanto hex (#FF6B00) quanto rgba/rgb já prontos
// (alguns valores de STATUS_COLORS já vêm como rgba(255,255,255,0.4) em vez de hex).
function corComOpacidade(cor: string, alpha: number): string {
  if (!cor.startsWith('#')) {
    const match = /rgba?\(([^)]+)\)/.exec(cor)
    if (!match) return cor
    const [r, g, b] = match[1].split(',').map(p => p.trim())
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const sanitized = cor.replace('#', '')
  const bigint = Number.parseInt(sanitized, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points={direction === 'left' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
    </svg>
  )
}

function CalendarioIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
    </svg>
  )
}

type PillProps = {
  label: string
  ativo: boolean
  cor?: string
  onClick: () => void
}

function FiltroPill({ label, ativo, cor, onClick }: PillProps) {
  const corBase = cor ?? '#FF6B00'
  const estiloAtivo: CSSProperties = {
    background: corComOpacidade(corBase, 0.2),
    color: corBase,
    border: `1px solid ${corComOpacidade(corBase, 0.5)}`,
  }
  const estiloInativo: CSSProperties = {
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.5)',
    border: '1px solid rgba(255,255,255,0.08)',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontFamily: 'Poppins, sans-serif',
        fontSize: '0.72rem',
        padding: '4px 10px',
        borderRadius: '20px',
        cursor: 'pointer',
        transition: 'background 150ms, color 150ms, border-color 150ms',
        ...(ativo ? estiloAtivo : estiloInativo),
      }}
      onMouseEnter={e => {
        if (!ativo) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
      }}
      onMouseLeave={e => {
        if (!ativo) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
      }}
    >
      {label}
    </button>
  )
}

export default function CalendarioClientePage() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug

  const [abaAtiva, setAbaAtiva] = useState<AbaId>('calendario')
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [items, setItems] = useState<CalendarioClienteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<CalendarioClienteItem | null>(null)
  const [dataModal, setDataModal] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [filtroFormato, setFiltroFormato] = useState<string>(FILTRO_TODOS)
  const [filtroStatus, setFiltroStatus] = useState<string>(FILTRO_TODOS)

  useEffect(() => {
    function checarLargura() {
      setIsMobile(window.innerWidth < 768)
    }

    checarLargura()
    window.addEventListener('resize', checarLargura)
    return () => window.removeEventListener('resize', checarLargura)
  }, [])

  const valido = isClienteSlug(slug)
  const ano = currentDate.getFullYear()
  const mes = currentDate.getMonth()

  const carregarItens = useCallback(async () => {
    if (!valido) {
      setLoading(false)
      setItems([])
      setFallbackMessage(FALLBACK_MESSAGE)
      return
    }

    setLoading(true)
    setFallbackMessage(null)

    try {
      const mesParam = `${ano}-${String(mes + 1).padStart(2, '0')}`
      const res = await fetch(`/api/clientes/${slug}/calendario?mes=${mesParam}`)

      if (!res.ok) {
        setItems([])
        setFallbackMessage(FALLBACK_MESSAGE)
        return
      }

      const data = (await res.json()) as CalendarioResponse
      const nextItems = Array.isArray(data.items) ? data.items : []

      setItems(nextItems)
      setFallbackMessage(data.configured === false || data.error ? FALLBACK_MESSAGE : null)
    } catch {
      setItems([])
      setFallbackMessage(FALLBACK_MESSAGE)
    } finally {
      setLoading(false)
    }
  }, [ano, mes, slug, valido])

  useEffect(() => {
    queueMicrotask(() => {
      void carregarItens()
    })
  }, [carregarItens])

  if (!valido) {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.75rem', fontFamily: 'Poppins, sans-serif', color: '#666', textAlign: 'center', padding: '2rem' }}>
        <p style={{ fontFamily: 'Anton, sans-serif', color: '#fff', fontSize: '1.5rem', letterSpacing: '0.05em', margin: 0 }}>
          CLIENTE NÃO ENCONTRADO
        </p>
        <p style={{ margin: 0 }}>{FALLBACK_MESSAGE}</p>
      </div>
    )
  }

  const nomeCliente = CLIENTES_PORTAL[slug]
  const clienteLogo = CLIENTE_LOGOS[slug]

  const itemsFiltrados = items.filter(item => {
    const passaFormato = filtroFormato === FILTRO_TODOS || item.formato === filtroFormato
    const passaStatus = filtroStatus === FILTRO_TODOS || item.status === filtroStatus
    return passaFormato && passaStatus
  })

  const semConteudoNoMes = !loading && !fallbackMessage && items.length === 0

  function itensDoDia(d: Date) {
    return itemsFiltrados.filter(item => item.data && isSameDay(new Date(`${item.data}T00:00:00`), d))
  }

  function abrirNovo(data: Date) {
    setSelectedItem(null)
    setDataModal(toISODate(data))
    setModalOpen(true)
  }

  function abrirEdicao(item: CalendarioClienteItem) {
    setSelectedItem(item)
    setDataModal(item.data)
    setModalOpen(true)
  }

  function navegarMes(direcao: -1 | 1) {
    setCurrentDate(d => {
      const novo = new Date(d)
      novo.setMonth(novo.getMonth() + direcao)
      return novo
    })
  }

  function abrirPrimeiroDoMes() {
    abrirNovo(new Date(ano, mes, 1))
  }

  const navBtnBaseStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    transition: 'background 150ms, color 150ms',
  }

  function navBtnHoverIn(e: React.MouseEvent<HTMLButtonElement>) {
    e.currentTarget.style.background = 'rgba(255,107,0,0.15)'
    e.currentTarget.style.color = '#FF6B00'
  }

  function navBtnHoverOut(e: React.MouseEvent<HTMLButtonElement>) {
    e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
    e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
  }

  const hoje = new Date()
  const grade = gerarGradeMensal(currentDate)
  const semanas = Array.from({ length: 6 }, (_, i) => grade.slice(i * 7, i * 7 + 7))

  return (
    <div style={{ minHeight: '100vh', background: '#080808', fontFamily: 'Poppins, sans-serif', color: '#fff' }}>
      <style>{'@keyframes pulse { 0%, 100% { opacity: 0.4 } 50% { opacity: 0.8 } }'}</style>

      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2rem', borderBottom: '1px solid #1e1e1e' }}>
        <Image src="/lglaranja.png" alt="ORIUM" width={120} height={40} style={{ objectFit: 'contain' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: clienteLogo ? '0.75rem' : 0, textAlign: 'center' }}>
          {clienteLogo && (
            <Image
              src={clienteLogo}
              alt={`Logo ${nomeCliente}`}
              width={220}
              height={90}
              style={{ width: 'min(220px, 52vw)', height: 'auto', objectFit: 'contain' }}
            />
          )}
          {!clienteLogo && (
            <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.4rem', letterSpacing: '0.04em', margin: 0, textAlign: 'center' }}>
              {nomeCliente.toUpperCase()}
            </h1>
          )}
        </div>
        <div style={{ width: '120px' }} />
      </header>

      <div style={{ display: 'flex', gap: '1.75rem', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 1.5rem' }}>
        {ABAS.map(aba => {
          const ativa = abaAtiva === aba.id
          const corTexto = ativa ? '#fff' : aba.habilitada ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.25)'

          return (
            <button
              key={aba.id}
              type="button"
              onClick={() => {
                if (aba.habilitada) setAbaAtiva(aba.id)
              }}
              disabled={!aba.habilitada}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'transparent',
                border: 'none',
                borderBottom: ativa ? '2px solid #FF6B00' : '2px solid transparent',
                padding: '0.9rem 0',
                margin: 0,
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.8rem',
                fontWeight: ativa ? 600 : 400,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: corTexto,
                cursor: aba.habilitada ? 'pointer' : 'default',
                transition: 'color 150ms, border-color 150ms',
              }}
              onMouseEnter={e => {
                if (aba.habilitada && !ativa) e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
              }}
              onMouseLeave={e => {
                if (aba.habilitada && !ativa) e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
              }}
            >
              {aba.label}
              {!aba.habilitada && (
                <span
                  style={{
                    marginLeft: '6px',
                    background: 'rgba(255,107,0,0.15)',
                    color: '#FF6B00',
                    borderRadius: '4px',
                    padding: '1px 5px',
                    fontSize: '0.6rem',
                    letterSpacing: '0.04em',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  EM BREVE
                </span>
              )}
            </button>
          )
        })}
      </div>

      {abaAtiva === 'calendario' && (
      <>
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <button type="button" onClick={() => navegarMes(-1)} style={navBtnBaseStyle} onMouseEnter={navBtnHoverIn} onMouseLeave={navBtnHoverOut} aria-label="Mês anterior">
            <ChevronIcon direction="left" />
          </button>
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, minWidth: '180px', textAlign: 'center', color: '#fff' }}>
            {MESES_NOMES[mes]} {ano}
          </h2>
          <button type="button" onClick={() => navegarMes(1)} style={navBtnBaseStyle} onMouseEnter={navBtnHoverIn} onMouseLeave={navBtnHoverOut} aria-label="Próximo mês">
            <ChevronIcon direction="right" />
          </button>
        </div>

        {fallbackMessage && !loading && (
          <p style={{ margin: '0 auto 1.25rem', maxWidth: '520px', color: '#888', textAlign: 'center', fontSize: '0.9rem', lineHeight: 1.6 }}>
            {fallbackMessage}
          </p>
        )}

        {!fallbackMessage && (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '0.6rem 1rem', marginBottom: '1.25rem' }}>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              FORMATO:
            </span>
            <FiltroPill label={FILTRO_TODOS} ativo={filtroFormato === FILTRO_TODOS} onClick={() => setFiltroFormato(FILTRO_TODOS)} />
            {FORMATO_OPTIONS.map(opcao => (
              <FiltroPill
                key={opcao}
                label={opcao}
                ativo={filtroFormato === opcao}
                cor={FORMATO_COLORS[opcao]}
                onClick={() => setFiltroFormato(opcao)}
              />
            ))}

            <span style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.08)', margin: '0 0.25rem' }} />

            <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              STATUS:
            </span>
            <FiltroPill label={FILTRO_TODOS} ativo={filtroStatus === FILTRO_TODOS} onClick={() => setFiltroStatus(FILTRO_TODOS)} />
            {STATUS_OPTIONS.map(opcao => (
              <FiltroPill
                key={opcao}
                label={opcao}
                ativo={filtroStatus === opcao}
                cor={STATUS_COLORS[opcao]}
                onClick={() => setFiltroStatus(opcao)}
              />
            ))}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {Array.from({ length: 35 }, (_, i) => (
              <div
                key={i}
                style={{
                  minHeight: '60px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.04)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  animationDelay: `${(i % 7) * 60}ms`,
                }}
              />
            ))}
          </div>
        ) : semConteudoNoMes ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '4rem 1rem', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', background: 'rgba(255,255,255,0.02)' }}>
            <CalendarioIcon />
            <p style={{ margin: 0, fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
              Nenhum conteúdo planejado para este mês.
            </p>
            <button
              type="button"
              onClick={abrirPrimeiroDoMes}
              style={{ background: 'transparent', border: 'none', color: '#FF6B00', fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
            >
              Adicionar o primeiro
            </button>
          </div>
        ) : isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
            {semanas.map((semana, si) => (
              <div key={si}>
                {semana.map((dia, di) => {
                  const itensDia = itensDoDia(dia)
                  const foraDoMes = dia.getMonth() !== mes

                  if (foraDoMes && itensDia.length === 0) return null

                  return (
                    <div
                      key={di}
                      onClick={() => abrirNovo(dia)}
                      style={{ padding: '0.75rem 0', borderBottom: '1px solid #1e1e1e', cursor: 'pointer' }}
                    >
                      <p style={{ margin: '0 0 0.5rem', color: isSameDay(dia, hoje) ? '#FF6B00' : '#999', fontSize: '0.8rem', fontFamily: 'Anton, sans-serif', letterSpacing: '0.04em' }}>
                        {DIAS_SEMANA[dia.getDay()]} {String(dia.getDate()).padStart(2, '0')}
                      </p>
                      {itensDia.length === 0 ? (
                        <p style={{ color: '#333', fontSize: '0.8rem', margin: 0 }}>{'—'}</p>
                      ) : itensDia.map(item => {
                        const cor = FORMATO_COLORS[item.formato] || '#FF6B00'
                        const corStatus = STATUS_COLORS[item.status] || 'rgba(255,255,255,0.3)'
                        return (
                          <div
                            key={item.id}
                            onClick={e => {
                              e.stopPropagation()
                              abrirEdicao(item)
                            }}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: corComOpacidade(cor, 0.12), borderLeft: `3px solid ${cor}`, border: `1px solid ${corComOpacidade(cor, 0.25)}`, borderRadius: '4px', padding: '6px 8px', marginBottom: '4px' }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: corStatus, flexShrink: 0 }} />
                            <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.72rem', fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>
                              {item.titulo}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {DIAS_SEMANA.map(dia => (
                <div key={dia} style={{ textAlign: 'center', paddingBottom: '0.5rem', fontFamily: 'Poppins, sans-serif', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)' }}>
                  {dia}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
              {grade.map((dia, idx) => {
                const foraDoMes = dia.getMonth() !== mes
                const ehHoje = isSameDay(dia, hoje)
                const itensDia = itensDoDia(dia)
                const visiveis = itensDia.slice(0, 3)
                const restantes = itensDia.length - visiveis.length
                const temConteudo = itensDia.length > 0

                const celulaBaseStyle: CSSProperties = {
                  minHeight: '100px',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.02)',
                  border: ehHoje ? '1px solid rgba(255,107,0,0.4)' : '1px solid rgba(255,255,255,0.06)',
                  opacity: foraDoMes ? 0.3 : 1,
                  cursor: foraDoMes ? 'default' : 'pointer',
                  transition: 'background 150ms, border-color 150ms',
                }

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (!foraDoMes) abrirNovo(dia)
                    }}
                    style={celulaBaseStyle}
                    onMouseEnter={e => {
                      if (foraDoMes) return
                      e.currentTarget.style.background = temConteudo ? 'rgba(255,255,255,0.04)' : 'rgba(255,107,0,0.04)'
                      if (!temConteudo && !ehHoje) e.currentTarget.style.borderColor = 'rgba(255,107,0,0.2)'
                    }}
                    onMouseLeave={e => {
                      if (foraDoMes) return
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                      if (!ehHoje) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.4rem' }}>
                      <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.7rem', color: ehHoje ? '#FF6B00' : 'rgba(255,255,255,0.4)', fontWeight: ehHoje ? 700 : 400 }}>
                        {dia.getDate()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {visiveis.map(item => {
                        const cor = FORMATO_COLORS[item.formato] || '#FF6B00'
                        const corStatus = STATUS_COLORS[item.status] || 'rgba(255,255,255,0.3)'
                        return (
                          <div
                            key={item.id}
                            onClick={e => {
                              e.stopPropagation()
                              abrirEdicao(item)
                            }}
                            title={item.titulo}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: corComOpacidade(cor, 0.12),
                              borderLeft: `3px solid ${cor}`,
                              border: `1px solid ${corComOpacidade(cor, 0.25)}`,
                              borderRadius: '4px',
                              padding: '6px 8px',
                              cursor: 'pointer',
                              transition: 'background 150ms ease',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = corComOpacidade(cor, 0.18)
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = corComOpacidade(cor, 0.12)
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: corStatus, flexShrink: 0 }} />
                            <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.72rem', fontWeight: 500, color: 'rgba(255,255,255,0.9)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.titulo}
                            </span>
                          </div>
                        )
                      })}
                      {restantes > 0 && (
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', paddingLeft: '4px', fontFamily: 'Poppins, sans-serif' }}>
                          +{restantes} mais
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>

      {modalOpen && (
        <ModalConteudo
          slug={slug}
          item={selectedItem}
          dataInicial={dataModal}
          onClose={() => setModalOpen(false)}
          onSaved={carregarItens}
        />
      )}
      </>
      )}
    </div>
  )
}
