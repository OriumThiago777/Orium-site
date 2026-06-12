'use client'

import { useState, useEffect, type CSSProperties } from 'react'
import { authHeaders } from '@/lib/auth'
import type { CalendarioItem } from './types'

// ─── Calendário ──────────────────────────────────────────────────────────────
const CLIENT_COLORS: Record<string, string> = {
  'Altemans Barbearia': '#FF6B00',
  'Prof. Marcelo Félix': '#3B82F6',
  'Ekipar Acessórios': '#10B981',
  'ORIUM Interno': '#6B7280',
  'Outro': '#9CA3AF',
}

const STATUS_COLORS: Record<string, string> = {
  'Planejado': '#6B7280',
  'Produzindo': '#F59E0B',
  'Aprovado': '#3B82F6',
  'Publicado': '#10B981',
  'Cancelado': '#EF4444',
}

const TIPOS_CONTEUDO = ['Post Feed', 'Story', 'Reels', 'Tarefa Interna', 'Reunião', 'Gravação', 'Entrega']
const DURACOES_REUNIAO = ['30 min', '1 hora', '1h30', '2 horas']
const TIPOS_CONTEUDO_GRAVACAO = ['Reel', 'Vídeo longo', 'Stories', 'Bastidores']
const STATUS_CALENDARIO = Object.keys(STATUS_COLORS)
const CLIENTES_CALENDARIO = Object.keys(CLIENT_COLORS)
const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']
const MESES_NOMES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const MESES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function toISODate(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function startOfWeek(d: Date) {
  const r = new Date(d)
  r.setDate(r.getDate() - r.getDay())
  r.setHours(0, 0, 0, 0)
  return r
}

function gerarGradeMensal(currentDate: Date): Date[] {
  const inicio = startOfWeek(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(inicio)
    d.setDate(d.getDate() + i)
    return d
  })
}

function gerarSemana(currentDate: Date): Date[] {
  const inicio = startOfWeek(currentDate)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(inicio)
    d.setDate(d.getDate() + i)
    return d
  })
}

function tituloNavegacaoCalendario(currentDate: Date, viewMode: 'month' | 'week') {
  if (viewMode === 'month') {
    return `${MESES_NOMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`
  }
  const semana = gerarSemana(currentDate)
  const ini = semana[0]
  const fim = semana[6]
  const diaIni = String(ini.getDate()).padStart(2, '0')
  const diaFim = String(fim.getDate()).padStart(2, '0')
  if (ini.getMonth() === fim.getMonth()) {
    return `${diaIni} – ${diaFim} ${MESES_ABREV[fim.getMonth()]} ${fim.getFullYear()}`
  }
  return `${diaIni} ${MESES_ABREV[ini.getMonth()]} – ${diaFim} ${MESES_ABREV[fim.getMonth()]} ${fim.getFullYear()}`
}

function ModalItemCalendario({ item, dataInicial, onClose, onSaved }: {
  item: CalendarioItem | null
  dataInicial: string
  onClose: () => void
  onSaved: () => void
}) {
  const [titulo, setTitulo] = useState(item?.titulo ?? '')
  const [cliente, setCliente] = useState(item?.cliente ?? CLIENTES_CALENDARIO[0])
  const [tipo, setTipo] = useState(item?.tipo ?? TIPOS_CONTEUDO[0])
  const [status, setStatus] = useState(item?.status ?? STATUS_CALENDARIO[0])
  const [data, setData] = useState(item?.data ?? dataInicial)
  const [descricao, setDescricao] = useState(item?.descricao ?? '')
  const [legenda, setLegenda] = useState(item?.legenda ?? '')
  const [participantes, setParticipantes] = useState(item?.participantes ?? '')
  const [pauta, setPauta] = useState(item?.pauta ?? '')
  const [linkReuniao, setLinkReuniao] = useState(item?.linkReuniao ?? '')
  const [duracaoReuniao, setDuracaoReuniao] = useState(item?.duracaoReuniao ?? DURACOES_REUNIAO[0])
  const [tipoGravacao, setTipoGravacao] = useState(item?.tipoGravacao ?? TIPOS_CONTEUDO_GRAVACAO[0])
  const [roteiroGravacao, setRoteiroGravacao] = useState(item?.roteiroGravacao ?? '')
  const [localGravacao, setLocalGravacao] = useState(item?.localGravacao ?? '')
  const [equipamentoGravacao, setEquipamentoGravacao] = useState(item?.equipamentoGravacao ?? '')
  const [salvando, setSalvando] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  const inputStyle: CSSProperties = {
    width: '100%', background: '#080808', border: '1px solid #222', borderRadius: 0,
    padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif',
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
  }
  const labelStyle: CSSProperties = {
    display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase',
    color: '#666', marginBottom: '0.4rem', fontFamily: 'Poppins, sans-serif',
  }
  function focusOrange(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) { e.target.style.borderColor = '#FF6B00' }
  function blurGray(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) { e.target.style.borderColor = '#222' }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault()
    if (!titulo.trim() || !data) return
    setSalvando(true)
    try {
      const payload = {
        titulo, cliente, tipo, status, data, descricao, legenda,
        participantes, pauta, linkReuniao, duracaoReuniao,
        tipoGravacao, roteiroGravacao, localGravacao, equipamentoGravacao,
      }
      const res = await fetch('/api/clientes/calendario', {
        method: item ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(item ? { pageId: item.id, ...payload } : payload),
      })
      if (!res.ok) throw new Error('Falha ao salvar item')
      onSaved()
      onClose()
    } catch (err) {
      console.error('Erro ao salvar item do calendário:', err)
    } finally {
      setSalvando(false)
    }
  }

  async function handleExcluir() {
    if (!item) return
    if (!confirm('Excluir este item do calendário?')) return
    setExcluindo(true)
    try {
      const res = await fetch(`/api/clientes/calendario?id=${item.id}`, { method: 'DELETE', headers: authHeaders() })
      if (!res.ok) throw new Error('Falha ao excluir item')
      onSaved()
      onClose()
    } catch (err) {
      console.error('Erro ao excluir item do calendário:', err)
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
      onClick={onClose}>
      <form onSubmit={handleSalvar} onClick={e => e.stopPropagation()}
        style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '2rem', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.3rem', color: '#fff', letterSpacing: '0.03em', marginBottom: '1.5rem' }}>
          {item ? 'EDITAR ITEM' : 'NOVO ITEM'}
        </h2>

        <div style={{ marginBottom: '1.1rem' }}>
          <label style={labelStyle}>Título</label>
          <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título do conteúdo" required
            style={inputStyle} onFocus={focusOrange} onBlur={blurGray} />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Cliente</label>
            <select value={cliente} onChange={e => setCliente(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }} onFocus={focusOrange} onBlur={blurGray}>
              {CLIENTES_CALENDARIO.map(c => <option key={c} value={c} style={{ background: '#0f0f0f' }}>{c}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Tipo</label>
            <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }} onFocus={focusOrange} onBlur={blurGray}>
              {TIPOS_CONTEUDO.map(t => <option key={t} value={t} style={{ background: '#0f0f0f' }}>{t}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }} onFocus={focusOrange} onBlur={blurGray}>
              {STATUS_CALENDARIO.map(s => <option key={s} value={s} style={{ background: '#0f0f0f' }}>{s}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Data</label>
            <input type="date" value={data} onChange={e => setData(e.target.value)} required
              style={{ ...inputStyle, colorScheme: 'dark' }} onFocus={focusOrange} onBlur={blurGray} />
          </div>
        </div>

        <div style={{ marginBottom: '1.1rem' }}>
          <label style={labelStyle}>Descrição</label>
          <textarea value={descricao} onChange={e => setDescricao(e.target.value)} rows={3} placeholder="Briefing / observações internas"
            style={{ ...inputStyle, resize: 'vertical' }} onFocus={focusOrange} onBlur={blurGray} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Legenda</label>
          <textarea value={legenda} onChange={e => setLegenda(e.target.value)} rows={3} placeholder="Texto de publicação"
            style={{ ...inputStyle, resize: 'vertical' }} onFocus={focusOrange} onBlur={blurGray} />
        </div>

        {tipo === 'Reunião' && (
          <>
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={labelStyle}>Participantes</label>
              <input value={participantes} onChange={e => setParticipantes(e.target.value)} placeholder="Nomes dos participantes"
                style={inputStyle} onFocus={focusOrange} onBlur={blurGray} />
            </div>
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={labelStyle}>Pauta</label>
              <textarea value={pauta} onChange={e => setPauta(e.target.value)} rows={3} placeholder="Assuntos a tratar na reunião"
                style={{ ...inputStyle, resize: 'vertical' }} onFocus={focusOrange} onBlur={blurGray} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Link da reunião</label>
                <input value={linkReuniao} onChange={e => setLinkReuniao(e.target.value)} placeholder="Google Meet, Zoom..."
                  style={inputStyle} onFocus={focusOrange} onBlur={blurGray} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Duração estimada</label>
                <select value={duracaoReuniao} onChange={e => setDuracaoReuniao(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }} onFocus={focusOrange} onBlur={blurGray}>
                  {DURACOES_REUNIAO.map(d => <option key={d} value={d} style={{ background: '#0f0f0f' }}>{d}</option>)}
                </select>
              </div>
            </div>
          </>
        )}

        {tipo === 'Gravação' && (
          <>
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={labelStyle}>Tipo de conteúdo</label>
              <select value={tipoGravacao} onChange={e => setTipoGravacao(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }} onFocus={focusOrange} onBlur={blurGray}>
                {TIPOS_CONTEUDO_GRAVACAO.map(t => <option key={t} value={t} style={{ background: '#0f0f0f' }}>{t}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={labelStyle}>Roteiro / Descrição</label>
              <textarea value={roteiroGravacao} onChange={e => setRoteiroGravacao(e.target.value)} rows={3} placeholder="Roteiro ou descrição da gravação"
                style={{ ...inputStyle, resize: 'vertical' }} onFocus={focusOrange} onBlur={blurGray} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Local de gravação</label>
                <input value={localGravacao} onChange={e => setLocalGravacao(e.target.value)} placeholder="Onde será gravado"
                  style={inputStyle} onFocus={focusOrange} onBlur={blurGray} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Equipamento necessário</label>
                <input value={equipamentoGravacao} onChange={e => setEquipamentoGravacao(e.target.value)} placeholder="Opcional"
                  style={inputStyle} onFocus={focusOrange} onBlur={blurGray} />
              </div>
            </div>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: item ? 'space-between' : 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
          {item && (
            <button type="button" onClick={handleExcluir} disabled={excluindo}
              style={{ background: 'transparent', border: '1px solid #EF4444', borderRadius: 0, color: '#EF4444', padding: '0.7rem 1.5rem', fontSize: '0.85rem', fontFamily: 'Poppins, sans-serif', cursor: excluindo ? 'default' : 'pointer', opacity: excluindo ? 0.6 : 1 }}>
              {excluindo ? 'Excluindo...' : 'Excluir'}
            </button>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto' }}>
            <button type="button" onClick={onClose}
              style={{ background: 'transparent', border: '1px solid #333', borderRadius: 0, color: '#999', padding: '0.7rem 1.5rem', fontSize: '0.85rem', fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button type="submit" disabled={salvando}
              style={{ background: '#FF6B00', border: 'none', borderRadius: 0, color: '#000', padding: '0.7rem 1.5rem', fontSize: '0.85rem', fontFamily: 'Poppins, sans-serif', fontWeight: 600, cursor: salvando ? 'default' : 'pointer', opacity: salvando ? 0.6 : 1 }}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

function FiltroComCor({ valor, onChange, opcoes, cores, placeholder }: { valor: string; onChange: (v: string) => void; opcoes: string[]; cores: Record<string, string>; placeholder: string }) {
  const selectStyle: CSSProperties = { background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '0.5rem 0.875rem', color: '#aaa', fontSize: '0.82rem', fontFamily: 'Poppins, sans-serif', outline: 'none', cursor: 'pointer' }
  return (
    <select value={valor} onChange={e => onChange(e.target.value)} style={selectStyle}>
      <option value="todos" style={{ background: '#0f0f0f', color: '#aaa' }}>{placeholder}</option>
      {opcoes.map(o => (
        <option key={o} value={o} style={{ background: '#0f0f0f', color: cores[o] || '#aaa' }}>● {o}</option>
      ))}
    </select>
  )
}

export function VistaCalendario() {
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month')
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [selectedCliente, setSelectedCliente] = useState('todos')
  const [selectedTipo, setSelectedTipo] = useState('todos')
  const [selectedStatus, setSelectedStatus] = useState('todos')
  const [items, setItems] = useState<CalendarioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<CalendarioItem | null>(null)
  const [dataModal, setDataModal] = useState('')

  const ano = currentDate.getFullYear()
  const mes = currentDate.getMonth()

  function carregarItens() {
    setLoading(true)
    const mesParam = `${ano}-${String(mes + 1).padStart(2, '0')}`
    fetch(`/api/clientes/calendario?mes=${mesParam}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => setItems(d.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    carregarItens()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ano, mes])

  const filtrados = items
    .filter(i => selectedCliente === 'todos' || i.cliente === selectedCliente)
    .filter(i => selectedTipo === 'todos' || i.tipo === selectedTipo)
    .filter(i => selectedStatus === 'todos' || i.status === selectedStatus)

  function itensDoDia(d: Date) {
    return filtrados.filter(i => i.data && isSameDay(new Date(i.data + 'T00:00:00'), d))
  }

  function abrirNovo(data: Date) {
    setSelectedItem(null)
    setDataModal(toISODate(data))
    setModalOpen(true)
  }

  function abrirEdicao(item: CalendarioItem) {
    setSelectedItem(item)
    setDataModal(item.data)
    setModalOpen(true)
  }

  function navegar(direcao: -1 | 1) {
    setCurrentDate(d => {
      const novo = new Date(d)
      if (viewMode === 'month') novo.setMonth(novo.getMonth() + direcao)
      else novo.setDate(novo.getDate() + direcao * 7)
      return novo
    })
  }

  const hoje = new Date()
  const navBtnStyle: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: '#111', border: '1px solid #333', borderRadius: '6px', color: '#999', fontSize: '1rem', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.6rem', color: '#fff', letterSpacing: '0.03em', marginBottom: '0.25rem' }}>CALENDÁRIO DE CONTEÚDO</h2>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', color: '#999' }}>Planejamento e produção de conteúdo por cliente</p>
        </div>
        <button onClick={() => abrirNovo(currentDate)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#FF6B00', border: 'none', borderRadius: '6px', color: '#000', padding: '0.65rem 1.25rem', fontSize: '0.82rem', fontFamily: 'Anton, sans-serif', letterSpacing: '0.06em', cursor: 'pointer' }}>
          + NOVO ITEM
        </button>
      </div>

      {/* Navegação */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={() => navegar(-1)} style={navBtnStyle}>‹</button>
          <button onClick={() => setCurrentDate(new Date())} style={{ ...navBtnStyle, width: 'auto', padding: '0 0.875rem', fontSize: '0.78rem', letterSpacing: '0.05em' }}>Hoje</button>
          <button onClick={() => navegar(1)} style={navBtnStyle}>›</button>
          <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.1rem', color: '#fff', letterSpacing: '0.03em', margin: '0 0 0 0.75rem' }}>
            {tituloNavegacaoCalendario(currentDate, viewMode)}
          </h3>
        </div>
        <div style={{ display: 'flex', border: '1px solid #333', borderRadius: '6px', overflow: 'hidden' }}>
          {(['month', 'week'] as const).map(v => (
            <button key={v} onClick={() => setViewMode(v)}
              style={{ padding: '0.45rem 1.1rem', border: 'none', background: viewMode === v ? '#FF6B00' : 'transparent', color: viewMode === v ? '#000' : '#777', fontSize: '0.78rem', fontFamily: 'Anton, sans-serif', letterSpacing: '0.06em', cursor: 'pointer', transition: 'all 0.15s' }}>
              {v === 'month' ? 'MÊS' : 'SEMANA'}
            </button>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <FiltroComCor valor={selectedCliente} onChange={setSelectedCliente} opcoes={CLIENTES_CALENDARIO} cores={CLIENT_COLORS} placeholder="Todos os clientes" />
        <FiltroComCor valor={selectedTipo} onChange={setSelectedTipo} opcoes={TIPOS_CONTEUDO} cores={{}} placeholder="Todos os tipos" />
        <FiltroComCor valor={selectedStatus} onChange={setSelectedStatus} opcoes={STATUS_CALENDARIO} cores={STATUS_COLORS} placeholder="Todos os status" />
      </div>

      {/* Grade */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: '#444', fontSize: '0.9rem' }}>Carregando calendário...</div>
      ) : viewMode === 'month' ? (
        <div style={{ border: '1px solid #1a1a1a', borderRadius: '8px', overflow: 'hidden', background: '#0f0f0f' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {DIAS_SEMANA.map(d => (
              <div key={d} style={{ padding: '0.6rem', textAlign: 'center', color: '#666', fontSize: '0.7rem', letterSpacing: '0.12em', fontFamily: 'Poppins, sans-serif', borderBottom: '1px solid #1a1a1a', background: '#080808' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {gerarGradeMensal(currentDate).map((dia, idx) => {
              const foraDoMes = dia.getMonth() !== mes
              const ehHoje = isSameDay(dia, hoje)
              const itensDia = itensDoDia(dia)
              const visiveis = itensDia.slice(0, 3)
              const restantes = itensDia.length - visiveis.length
              return (
                <div key={idx}
                  onClick={() => abrirNovo(dia)}
                  style={{ minHeight: '110px', padding: '0.5rem', borderRight: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a', opacity: foraDoMes ? 0.3 : 1, cursor: 'pointer', transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#131313'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.4rem' }}>
                    <span style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: ehHoje ? '#FF6B00' : 'transparent',
                      color: ehHoje ? '#000' : '#999', fontSize: '0.78rem',
                      fontFamily: 'Poppins, sans-serif', fontWeight: ehHoje ? 700 : 400,
                    }}>
                      {dia.getDate()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {visiveis.map(item => {
                      const cor = CLIENT_COLORS[item.cliente] || CLIENT_COLORS['Outro']
                      return (
                        <div key={item.id}
                          onClick={e => { e.stopPropagation(); abrirEdicao(item) }}
                          title={item.titulo}
                          style={{ background: `${cor}26`, borderLeft: `3px solid ${cor}`, borderRadius: '3px', padding: '0.2rem 0.4rem', color: '#eee', fontSize: '0.7rem', fontFamily: 'Poppins, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                          {item.titulo}
                        </div>
                      )
                    })}
                    {restantes > 0 && (
                      <span style={{ color: '#666', fontSize: '0.68rem', fontFamily: 'Poppins, sans-serif', paddingLeft: '0.4rem' }}>+{restantes} mais</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.625rem' }}>
          {gerarSemana(currentDate).map((dia, idx) => {
            const ehHoje = isSameDay(dia, hoje)
            const itensDia = itensDoDia(dia)
            return (
              <div key={idx} style={{ background: '#0f0f0f', border: `1px solid ${ehHoje ? '#FF6B00' : '#1a1a1a'}`, borderRadius: '8px', padding: '0.75rem', minHeight: '320px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <div>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.65rem', letterSpacing: '0.12em', fontFamily: 'Poppins, sans-serif' }}>{DIAS_SEMANA[dia.getDay()]}</p>
                    <p style={{ margin: 0, color: ehHoje ? '#FF6B00' : '#fff', fontSize: '1.1rem', fontFamily: 'Anton, sans-serif' }}>{dia.getDate()}</p>
                  </div>
                  <button onClick={() => abrirNovo(dia)}
                    style={{ background: 'transparent', border: '1px solid #333', borderRadius: '4px', color: '#777', width: '24px', height: '24px', fontSize: '0.9rem', cursor: 'pointer', lineHeight: 1 }}>+</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
                  {itensDia.length === 0 ? (
                    <p style={{ color: '#333', fontSize: '0.75rem', fontFamily: 'Poppins, sans-serif' }}>—</p>
                  ) : itensDia.map(item => {
                    const corCliente = CLIENT_COLORS[item.cliente] || CLIENT_COLORS['Outro']
                    const corStatus = STATUS_COLORS[item.status] || STATUS_COLORS['Planejado']
                    return (
                      <div key={item.id} onClick={() => abrirEdicao(item)}
                        style={{ background: `${corCliente}1a`, borderLeft: `3px solid ${corCliente}`, borderRadius: '4px', padding: '0.55rem 0.7rem', cursor: 'pointer' }}>
                        <p style={{ margin: '0 0 0.3rem', color: '#fff', fontSize: '0.82rem', fontFamily: 'Poppins, sans-serif', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.titulo}</p>
                        <p style={{ margin: '0 0 0.35rem', color: '#999', fontSize: '0.72rem', fontFamily: 'Poppins, sans-serif' }}>{item.tipo}</p>
                        <span style={{ display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: '20px', background: `${corStatus}22`, border: `1px solid ${corStatus}55`, color: corStatus, fontSize: '0.65rem' }}>{item.status}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modalOpen && (
        <ModalItemCalendario
          item={selectedItem}
          dataInicial={dataModal}
          onClose={() => setModalOpen(false)}
          onSaved={carregarItens}
        />
      )}
    </div>
  )
}
