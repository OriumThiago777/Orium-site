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
import { ROTEIROS_ALTEMANS } from '@/lib/roteiros-altemans'
import ModalConteudo from './components/ModalConteudo'
import {
  COR_TIPO_CAMPANHA,
  SIGLA_TIPO_CAMPANHA,
  type Campanha,
  type PlataformaCampanha,
  type StatusCampanha,
  type TipoCampanha,
} from '@/lib/tipos-campanhas'

const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']
const FALLBACK_MESSAGE = 'Cliente não encontrado ou calendário ainda não configurado.'
const CLIENTE_LOGOS: Record<string, string> = {
  altemans: '/logo-altemans.png',
}

const TIPOS_CAMPANHA: TipoCampanha[] = [
  'Tráfego Pago',
  'Feriado',
  'Lançamento',
  'Promoção',
  'Data Comemorativa',
  'Outro',
]

const STATUS_CAMPANHA_OPCOES: StatusCampanha[] = ['Planejada', 'Em andamento', 'Encerrada', 'Cancelada']

const PLATAFORMAS_OPCOES: PlataformaCampanha[] = ['Instagram', 'Facebook', 'Google', 'WhatsApp', 'YouTube']

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

type AbaId = 'calendario' | 'documentos' | 'relatorios' | 'campanhas'

const ABAS: Array<{ id: AbaId; label: string; habilitada: boolean }> = [
  { id: 'calendario', label: 'Calendário', habilitada: true },
  { id: 'campanhas', label: 'Campanhas', habilitada: true },
  { id: 'documentos', label: 'Documentos', habilitada: false },
  { id: 'relatorios', label: 'Relatórios', habilitada: false },
]

type FormCampanha = {
  titulo: string
  tipo: TipoCampanha | ''
  dataInicio: string
  dataFim: string
  status: StatusCampanha
  plataformas: PlataformaCampanha[]
  objetivo: string
  orcamento: string
  observacoes: string
}

const FORM_VAZIO: FormCampanha = {
  titulo: '',
  tipo: '',
  dataInicio: '',
  dataFim: '',
  status: 'Planejada',
  plataformas: [],
  objetivo: '',
  orcamento: '',
  observacoes: '',
}

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

function parseDateLocal(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return '—'
  const parts = dateStr.split('-')
  if (parts.length < 3) return '—'
  return `${parts[2]}/${parts[1]}`
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

  const [campanhas, setCampanhas] = useState<Campanha[]>([])
  const [loadingCampanhas, setLoadingCampanhas] = useState(false)
  const [modalCampanha, setModalCampanha] = useState<{ aberto: boolean; modo: 'criar' | 'editar'; dados?: Campanha }>({ aberto: false, modo: 'criar' })
  const [campanhaSelecionada, setCampanhaSelecionada] = useState<Campanha | null>(null)
  const [formCampanha, setFormCampanha] = useState<FormCampanha>(FORM_VAZIO)
  const [erroCampanha, setErroCampanha] = useState('')
  const [salvandoCampanha, setSalvandoCampanha] = useState(false)

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

  const fetchCampanhas = useCallback(async () => {
    if (!valido) return
    setLoadingCampanhas(true)
    try {
      const res = await fetch(`/api/clientes/${slug}/campanhas`)
      if (res.ok) {
        const data = (await res.json()) as Campanha[]
        setCampanhas(Array.isArray(data) ? data : [])
      }
    } catch {
      // silently ignore — campanhas são opcionais para o calendário
    } finally {
      setLoadingCampanhas(false)
    }
  }, [slug, valido])

  useEffect(() => {
    queueMicrotask(() => {
      void carregarItens()
      void fetchCampanhas()
    })
  }, [carregarItens, fetchCampanhas])

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

  function campanhasDoDia(d: Date): Campanha[] {
    return campanhas.filter(c => {
      if (!c.dataInicio || !c.dataFim) return false
      const inicio = parseDateLocal(c.dataInicio)
      const fim = parseDateLocal(c.dataFim)
      return d >= inicio && d <= fim
    })
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

  function abrirModalCriar() {
    setFormCampanha(FORM_VAZIO)
    setErroCampanha('')
    setCampanhaSelecionada(null)
    setModalCampanha({ aberto: true, modo: 'criar' })
  }

  function abrirModalEditar(c: Campanha) {
    setFormCampanha({
      titulo: c.titulo,
      tipo: c.tipo,
      dataInicio: c.dataInicio,
      dataFim: c.dataFim,
      status: c.status,
      plataformas: c.plataformas,
      objetivo: c.objetivo,
      orcamento: c.orcamento,
      observacoes: c.observacoes,
    })
    setErroCampanha('')
    setCampanhaSelecionada(c)
    setModalCampanha({ aberto: true, modo: 'editar', dados: c })
  }

  function fecharModalCampanha() {
    setModalCampanha({ aberto: false, modo: 'criar' })
    setCampanhaSelecionada(null)
    setErroCampanha('')
  }

  async function salvarCampanha() {
    if (!formCampanha.titulo.trim() || !formCampanha.tipo || !formCampanha.dataInicio || !formCampanha.dataFim) {
      setErroCampanha('Preencha: Título, Tipo, Data Início e Data Fim.')
      return
    }
    setSalvandoCampanha(true)
    setErroCampanha('')
    try {
      const body = {
        titulo: formCampanha.titulo,
        tipo: formCampanha.tipo,
        dataInicio: formCampanha.dataInicio,
        dataFim: formCampanha.dataFim,
        status: formCampanha.status,
        plataformas: formCampanha.plataformas,
        objetivo: formCampanha.objetivo,
        orcamento: formCampanha.orcamento,
        observacoes: formCampanha.observacoes,
      }

      if (modalCampanha.modo === 'criar') {
        const res = await fetch(`/api/clientes/${slug}/campanhas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error('Erro ao salvar')
      } else if (campanhaSelecionada) {
        const res = await fetch(`/api/clientes/${slug}/campanhas/${campanhaSelecionada.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error('Erro ao salvar')
      }

      fecharModalCampanha()
      void fetchCampanhas()
    } catch {
      setErroCampanha('Erro ao salvar. Tente novamente.')
    } finally {
      setSalvandoCampanha(false)
    }
  }

  async function excluirCampanha() {
    if (!campanhaSelecionada) return
    if (!window.confirm(`Excluir a campanha "${campanhaSelecionada.titulo}"?`)) return
    setSalvandoCampanha(true)
    try {
      await fetch(`/api/clientes/${slug}/campanhas/${campanhaSelecionada.id}`, { method: 'DELETE' })
      fecharModalCampanha()
      void fetchCampanhas()
    } catch {
      setErroCampanha('Erro ao excluir. Tente novamente.')
    } finally {
      setSalvandoCampanha(false)
    }
  }

  function togglePlataforma(p: PlataformaCampanha) {
    setFormCampanha(prev => ({
      ...prev,
      plataformas: prev.plataformas.includes(p)
        ? prev.plataformas.filter(x => x !== p)
        : [...prev.plataformas, p],
    }))
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

  const inputStyle: CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid #1e1e1e',
    borderRadius: '8px',
    padding: '0.6rem 0.75rem',
    color: '#fff',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.85rem',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: CSSProperties = {
    display: 'block',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '0.68rem',
    color: '#444',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '0.35rem',
  }

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
                const campsDia = campanhasDoDia(dia)
                const visiveis = itensDia.slice(0, 3)
                const restantes = itensDia.length - visiveis.length
                const temConteudo = itensDia.length > 0
                const temCampanha = campsDia.length > 0
                const corCampanha = temCampanha ? COR_TIPO_CAMPANHA[campsDia[0].tipo] : ''
                const tooltipCampanhas = campsDia.map(c => c.titulo).join(' | ')

                const celulaBaseStyle: CSSProperties = {
                  minHeight: '100px',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.02)',
                  border: ehHoje ? '1px solid rgba(255,107,0,0.4)' : '1px solid rgba(255,255,255,0.06)',
                  borderBottom: temCampanha
                    ? `2px solid ${corCampanha}`
                    : ehHoje ? '1px solid rgba(255,107,0,0.4)' : '1px solid rgba(255,255,255,0.06)',
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
                      if (!temConteudo && !ehHoje && !temCampanha) e.currentTarget.style.borderColor = 'rgba(255,107,0,0.2)'
                    }}
                    onMouseLeave={e => {
                      if (foraDoMes) return
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                      if (!ehHoje && !temCampanha) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.25rem' }}>
                      <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.7rem', color: ehHoje ? '#FF6B00' : 'rgba(255,255,255,0.4)', fontWeight: ehHoje ? 700 : 400 }}>
                        {dia.getDate()}
                      </span>
                    </div>

                    {temCampanha && (
                      <div
                        title={tooltipCampanhas}
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '0.65rem',
                          color: corCampanha,
                          background: corComOpacidade(corCampanha, 0.1),
                          borderRadius: '3px',
                          padding: '1px 4px',
                          marginBottom: '0.25rem',
                          maxWidth: '100%',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          cursor: 'default',
                        }}
                      >
                        {temConteudo || campsDia.length > 1
                          ? campsDia.length > 1
                            ? `${SIGLA_TIPO_CAMPANHA[campsDia[0].tipo]} +${campsDia.length - 1}`
                            : SIGLA_TIPO_CAMPANHA[campsDia[0].tipo]
                          : campsDia[0].titulo}
                      </div>
                    )}

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
          onDeleted={id => setItems(prev => prev.filter(i => i.id !== id))}
          sugestoes={slug === 'altemans' ? ROTEIROS_ALTEMANS : undefined}
        />
      )}
      </>
      )}

      {abaAtiva === 'campanhas' && (
        <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
            <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.4rem', letterSpacing: '0.05em', margin: 0, textTransform: 'uppercase' }}>
              Campanhas
            </h2>
            <button
              type="button"
              onClick={abrirModalCriar}
              style={{
                background: '#FF6B00',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.6rem 1.25rem',
                fontFamily: 'Anton, sans-serif',
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(255,107,0,0.25)',
              }}
            >
              NOVA CAMPANHA
            </button>
          </div>

          {loadingCampanhas ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ height: '120px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
          ) : campanhas.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '4rem 1rem', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
              <span style={{ fontSize: '2rem' }}>📅</span>
              <p style={{ margin: 0, fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem', color: '#4B5563', fontWeight: 500 }}>
                Nenhuma campanha cadastrada ainda.
              </p>
              <p style={{ margin: 0, fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem', color: '#4B5563' }}>
                Clique em Nova Campanha para começar.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {campanhas.map(c => {
                const corTipo = COR_TIPO_CAMPANHA[c.tipo]
                const cancelada = c.status === 'Cancelada'

                const badgeStatusStyle: CSSProperties = (() => {
                  switch (c.status) {
                    case 'Em andamento': return { background: '#052e16', border: '1px solid rgba(22,163,74,0.25)', color: '#4ade80' }
                    case 'Encerrada': return { background: '#1f2937', border: '1px solid #374151', color: '#6B7280' }
                    case 'Cancelada': return { background: '#2d0a0a', border: '1px solid rgba(220,38,38,0.25)', color: '#f87171' }
                    default: return { background: 'transparent', border: '1px solid #4B5563', color: '#9CA3AF' }
                  }
                })()

                return (
                  <div
                    key={c.id}
                    style={{
                      background: '#111111',
                      border: '1px solid #222222',
                      borderLeft: `3px solid ${corTipo}`,
                      borderRadius: '8px',
                      padding: '1.25rem 1.5rem',
                      transition: 'background 150ms, border-color 150ms',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#161616'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#111111'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          background: corComOpacidade(corTipo, 0.15),
                          border: `1px solid ${corComOpacidade(corTipo, 0.4)}`,
                          color: corTipo,
                          fontSize: '0.7rem',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontFamily: 'Poppins, sans-serif',
                        }}>
                          {c.tipo}
                        </span>
                        <span style={{
                          ...badgeStatusStyle,
                          fontSize: '0.7rem',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontFamily: 'Poppins, sans-serif',
                        }}>
                          {c.status}
                        </span>
                      </div>
                      <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem', color: '#6B7280' }}>
                        {formatDateDisplay(c.dataInicio)} → {formatDateDisplay(c.dataFim)}
                      </span>
                    </div>

                    <p style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.1rem', color: '#fff', margin: '0 0 0.3rem', letterSpacing: '0.03em', textDecoration: cancelada ? 'line-through' : 'none' }}>
                      {c.titulo}
                    </p>
                    {c.objetivo && (
                      <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', color: '#9CA3AF', margin: '0 0 0.75rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {c.objetivo}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {c.plataformas.map(p => (
                          <span key={p} style={{ background: '#1C1C1C', border: '1px solid #333', color: '#9CA3AF', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', fontFamily: 'Poppins, sans-serif' }}>
                            {p}
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => abrirModalEditar(c)}
                        style={{ background: 'none', border: 'none', color: '#FF6B00', fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem', cursor: 'pointer', padding: 0 }}
                      >
                        Editar →
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      )}

      {modalCampanha.aberto && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={e => { if (e.target === e.currentTarget) fecharModalCampanha() }}
        >
          <div style={{ background: '#0f0f0f', border: '1px solid #222', borderRadius: '12px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.3rem', letterSpacing: '0.05em', margin: '0 0 1.5rem', color: '#fff' }}>
              {modalCampanha.modo === 'criar' ? 'NOVA CAMPANHA' : 'EDITAR CAMPANHA'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Título *</label>
                <input
                  type="text"
                  value={formCampanha.titulo}
                  onChange={e => setFormCampanha(p => ({ ...p, titulo: e.target.value }))}
                  placeholder="Nome da campanha"
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = '#FF6B00' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#1e1e1e' }}
                />
              </div>

              <div>
                <label style={labelStyle}>Tipo *</label>
                <select
                  value={formCampanha.tipo}
                  onChange={e => setFormCampanha(p => ({ ...p, tipo: e.target.value as TipoCampanha }))}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#FF6B00' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#1e1e1e' }}
                >
                  <option value="" disabled style={{ background: '#0f0f0f' }}>Selecione o tipo</option>
                  {TIPOS_CAMPANHA.map(t => (
                    <option key={t} value={t} style={{ background: '#0f0f0f' }}>{t}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Data Início *</label>
                  <input
                    type="date"
                    value={formCampanha.dataInicio}
                    onChange={e => setFormCampanha(p => ({ ...p, dataInicio: e.target.value }))}
                    style={{ ...inputStyle, colorScheme: 'dark' }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#FF6B00' }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#1e1e1e' }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Data Fim *</label>
                  <input
                    type="date"
                    value={formCampanha.dataFim}
                    onChange={e => setFormCampanha(p => ({ ...p, dataFim: e.target.value }))}
                    style={{ ...inputStyle, colorScheme: 'dark' }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#FF6B00' }}
                    onBlur={e => { e.currentTarget.style.borderColor = '#1e1e1e' }}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Status *</label>
                <select
                  value={formCampanha.status}
                  onChange={e => setFormCampanha(p => ({ ...p, status: e.target.value as StatusCampanha }))}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#FF6B00' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#1e1e1e' }}
                >
                  {STATUS_CAMPANHA_OPCOES.map(s => (
                    <option key={s} value={s} style={{ background: '#0f0f0f' }}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Plataformas</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {PLATAFORMAS_OPCOES.map(p => {
                    const ativa = formCampanha.plataformas.includes(p)
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => togglePlataforma(p)}
                        style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          border: ativa ? '1px solid rgba(255,107,0,0.5)' : '1px solid #333',
                          background: ativa ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.04)',
                          color: ativa ? '#FF6B00' : '#9CA3AF',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          transition: 'all 150ms',
                        }}
                      >
                        {p}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Objetivo</label>
                <textarea
                  value={formCampanha.objetivo}
                  onChange={e => setFormCampanha(p => ({ ...p, objetivo: e.target.value }))}
                  placeholder="Descreva o objetivo da campanha"
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#FF6B00' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#1e1e1e' }}
                />
              </div>

              <div>
                <label style={labelStyle}>Orçamento</label>
                <input
                  type="text"
                  value={formCampanha.orcamento}
                  onChange={e => setFormCampanha(p => ({ ...p, orcamento: e.target.value }))}
                  placeholder="Ex: R$ 500/mês — opcional"
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = '#FF6B00' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#1e1e1e' }}
                />
              </div>

              <div>
                <label style={labelStyle}>Observações</label>
                <textarea
                  value={formCampanha.observacoes}
                  onChange={e => setFormCampanha(p => ({ ...p, observacoes: e.target.value }))}
                  placeholder="Observações adicionais (opcional)"
                  rows={2}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#FF6B00' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#1e1e1e' }}
                />
              </div>

              {erroCampanha && (
                <p style={{ margin: 0, color: '#f87171', fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem' }}>
                  {erroCampanha}
                </p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: modalCampanha.modo === 'editar' ? 'space-between' : 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                {modalCampanha.modo === 'editar' && (
                  <button
                    type="button"
                    onClick={excluirCampanha}
                    disabled={salvandoCampanha}
                    style={{ background: 'transparent', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', borderRadius: '6px', padding: '0.55rem 1rem', fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem', cursor: 'pointer', opacity: salvandoCampanha ? 0.5 : 1 }}
                  >
                    Excluir
                  </button>
                )}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={fecharModalCampanha}
                    disabled={salvandoCampanha}
                    style={{ background: 'transparent', border: '1px solid #222', color: 'rgba(255,255,255,0.5)', borderRadius: '6px', padding: '0.55rem 1.25rem', fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={salvarCampanha}
                    disabled={salvandoCampanha}
                    style={{ background: '#FF6B00', border: 'none', color: '#fff', borderRadius: '6px', padding: '0.55rem 1.25rem', fontFamily: 'Anton, sans-serif', fontSize: '0.85rem', letterSpacing: '0.06em', cursor: 'pointer', opacity: salvandoCampanha ? 0.7 : 1, boxShadow: '0 0 16px rgba(255,107,0,0.3)' }}
                  >
                    {salvandoCampanha ? 'SALVANDO...' : modalCampanha.modo === 'criar' ? 'SALVAR CAMPANHA' : 'SALVAR ALTERAÇÕES'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
