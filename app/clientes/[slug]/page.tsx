'use client'

import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import {
  CLIENTES_PORTAL,
  FORMATO_COLORS,
  MESES_NOMES,
  STATUS_ICON,
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

type CalendarioResponse = {
  items?: CalendarioClienteItem[]
  configured?: boolean
  error?: string
}

export default function CalendarioClientePage() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug

  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [items, setItems] = useState<CalendarioClienteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<CalendarioClienteItem | null>(null)
  const [dataModal, setDataModal] = useState('')
  const [isMobile, setIsMobile] = useState(false)

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
      setFallbackMessage(data.configured === false || data.error || nextItems.length === 0 ? FALLBACK_MESSAGE : null)
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

  function itensDoDia(d: Date) {
    return items.filter(item => item.data && isSameDay(new Date(`${item.data}T00:00:00`), d))
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

  const navBtnStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    background: '#111111',
    border: '1px solid #2a2a2a',
    borderRadius: '6px',
    color: '#999',
    fontSize: '1rem',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
  }

  const hoje = new Date()
  const grade = gerarGradeMensal(currentDate)
  const semanas = Array.from({ length: 6 }, (_, i) => grade.slice(i * 7, i * 7 + 7))

  return (
    <div style={{ minHeight: '100vh', background: '#080808', fontFamily: 'Poppins, sans-serif', color: '#fff' }}>
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
          <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.4rem', letterSpacing: '0.04em', margin: 0, textAlign: 'center' }}>
            {nomeCliente.toUpperCase()}
          </h1>
        </div>
        <div style={{ width: '120px' }} />
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <button type="button" onClick={() => navegarMes(-1)} style={navBtnStyle} aria-label="Mês anterior">
            {'\u2039'}
          </button>
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.3rem', letterSpacing: '0.03em', margin: 0, minWidth: '220px', textAlign: 'center' }}>
            {MESES_NOMES[mes]} {ano}
          </h2>
          <button type="button" onClick={() => navegarMes(1)} style={navBtnStyle} aria-label="Próximo mês">
            {'\u203a'}
          </button>
        </div>

        {fallbackMessage && !loading && (
          <p style={{ margin: '0 auto 1.25rem', maxWidth: '520px', color: '#888', textAlign: 'center', fontSize: '0.9rem', lineHeight: 1.6 }}>
            {fallbackMessage}
          </p>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: '#444', fontSize: '0.9rem' }}>
            Carregando calendário...
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
                        <p style={{ color: '#333', fontSize: '0.8rem', margin: 0 }}>{'\u2014'}</p>
                      ) : itensDia.map(item => {
                        const cor = FORMATO_COLORS[item.formato] || '#FF6B00'
                        return (
                          <div
                            key={item.id}
                            onClick={e => {
                              e.stopPropagation()
                              abrirEdicao(item)
                            }}
                            style={{ background: `${cor}26`, borderLeft: `3px solid ${cor}`, borderRadius: '6px', padding: '0.5rem 0.75rem', marginBottom: '0.4rem', fontSize: '0.85rem' }}
                          >
                            {STATUS_ICON[item.status] || '\u25cb'} {item.titulo}
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
          <div style={{ border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden', background: '#111111' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {DIAS_SEMANA.map(dia => (
                <div key={dia} style={{ padding: '0.6rem', textAlign: 'center', color: '#666', fontSize: '0.7rem', letterSpacing: '0.12em', borderBottom: '1px solid #1e1e1e', background: '#080808' }}>
                  {dia}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {grade.map((dia, idx) => {
                const foraDoMes = dia.getMonth() !== mes
                const ehHoje = isSameDay(dia, hoje)
                const itensDia = itensDoDia(dia)
                const visiveis = itensDia.slice(0, 3)
                const restantes = itensDia.length - visiveis.length

                return (
                  <div
                    key={idx}
                    onClick={() => abrirNovo(dia)}
                    style={{ minHeight: '110px', padding: '0.5rem', borderRight: '1px solid #1e1e1e', borderBottom: '1px solid #1e1e1e', opacity: foraDoMes ? 0.3 : 1, cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.4rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '50%', background: ehHoje ? '#FF6B00' : 'transparent', color: ehHoje ? '#000' : '#999', fontSize: '0.78rem', fontWeight: ehHoje ? 700 : 400 }}>
                        {dia.getDate()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {visiveis.map(item => {
                        const cor = FORMATO_COLORS[item.formato] || '#FF6B00'
                        return (
                          <div
                            key={item.id}
                            onClick={e => {
                              e.stopPropagation()
                              abrirEdicao(item)
                            }}
                            title={item.titulo}
                            style={{ background: `${cor}26`, borderLeft: `3px solid ${cor}`, borderRadius: '3px', padding: '0.2rem 0.4rem', color: '#eee', fontSize: '0.7rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}
                          >
                            {STATUS_ICON[item.status] || '\u25cb'} {item.titulo}
                          </div>
                        )
                      })}
                      {restantes > 0 && (
                        <span style={{ color: '#666', fontSize: '0.68rem', paddingLeft: '0.4rem' }}>
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
    </div>
  )
}
