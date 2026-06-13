'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authHeaders } from '@/lib/auth'
import { getToolUrl } from '@/lib/tool-links'
import type { Cliente, Atividade, ProgressoData } from './types'
import {
  StatusBadge,
  FaseBadge,
  getHealthScore,
  HEALTH_COR,
  FASES,
  deliverableUrgency,
  formatarDataHora,
  formatDate,
  TIPO_DOC_COR,
  TIPO_DOC_ROTA,
  iconeAtividade,
} from './shared'
import { ModalPauta } from './ModalPauta'

// ─── Modal Detalhes ──────────────────────────────────────────────────────────
export function ModalDetalhes({ cliente, onClose, onUpdated, onDeleted, atividades, loadingAtividades, atividadesExpandidas, setAtividadesExpandidas, progresso }: {
  cliente: Cliente
  onClose: () => void
  onUpdated: (c: Cliente) => void
  onDeleted: (id: string) => void
  atividades: Atividade[]
  loadingAtividades: boolean
  atividadesExpandidas: boolean
  setAtividadesExpandidas: (f: boolean | ((prev: boolean) => boolean)) => void
  progresso: ProgressoData | null
}) {
  type DocItem = { id: string; pageId?: string; nome: string; tipo: string; cliente: string; dataGeracao: string }

  const [form, setForm] = useState<Cliente>({ ...cliente })
  const [saving, setSaving] = useState(false)
  const [erroSalvar, setErroSalvar] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [tab, setTab] = useState<'info' | 'acoes'>('info')
  const [docCliente, setDocCliente] = useState<DocItem[]>([])
  const [loadingDocs, setLoadingDocs] = useState(false)
  const [novaNota, setNovaNota] = useState('')
  const [expandirNotas, setExpandirNotas] = useState(false)
  const [progressoLocal, setProgressoLocal] = useState<ProgressoData | null>(null)
  const [loadingProgressoLocal, setLoadingProgressoLocal] = useState(false)
  const [gerandoPauta, setGerandoPauta] = useState(false)
  const [pautaTexto, setPautaTexto] = useState<string | null>(null)
  const [erroPauta, setErroPauta] = useState('')

  useEffect(() => {
    if (progresso !== null) return
    setLoadingProgressoLocal(true)
    fetch(`/api/clientes/${encodeURIComponent(cliente.id)}/progresso?nome=${encodeURIComponent(cliente.nome)}`, { headers: authHeaders() })
      .then(r => r.json())
      .then((data: ProgressoData) => setProgressoLocal(data))
      .catch(() => {})
      .finally(() => setLoadingProgressoLocal(false))
  }, [progresso, cliente.id, cliente.nome])

  const progressoEfetivo = progresso ?? progressoLocal
  const router = useRouter()
  const primeiraEtapaPendente = progressoEfetivo?.etapas.find(e => !e.concluida)?.nome ?? null

  useEffect(() => {
    setLoadingDocs(true)
    fetch('/api/documentos', { headers: authHeaders() })
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) {
          setDocCliente(d.filter((doc: DocItem) =>
            doc.cliente?.toLowerCase().includes(cliente.nome.toLowerCase())
          ))
        }
      })
      .catch(() => {})
      .finally(() => setLoadingDocs(false))
  }, [cliente.nome])

  const set = (k: keyof Cliente, v: unknown) => setForm(p => ({ ...p, [k]: v }))

  async function handleSave() {
    setSaving(true)
    setErroSalvar('')
    try {
      const res = await fetch(`/api/clientes?id=${cliente.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) { onUpdated(data); onClose() }
      else { setErroSalvar(data?.detail || data?.error || 'Não foi possível salvar. Tente novamente.') }
    } catch {
      setErroSalvar('Não foi possível conectar ao servidor. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/clientes?id=${cliente.id}`, { method: 'DELETE', headers: authHeaders() })
      if (res.ok) { onDeleted(cliente.id); onClose() }
    } finally {
      setDeleting(false)
    }
  }

  async function gerarPauta() {
    setGerandoPauta(true)
    setErroPauta('')
    try {
      const res = await fetch(`/api/pauta?clienteId=${encodeURIComponent(cliente.id)}&clienteNome=${encodeURIComponent(cliente.nome)}`, {
        headers: authHeaders(),
      })
      const data = await res.json()
      if (res.ok && data.pauta) {
        setPautaTexto(data.pauta)
      } else {
        setErroPauta('Não foi possível gerar a pauta')
      }
    } catch {
      setErroPauta('Não foi possível gerar a pauta')
    } finally {
      setGerandoPauta(false)
    }
  }

  async function addNota() {
    const texto = novaNota.trim()
    if (!texto) return
    const novaLinha = `[${formatarDataHora()}] ${texto}`
    const novasNotas = form.notas ? `${form.notas}\n${novaLinha}` : novaLinha
    setForm(p => ({ ...p, notas: novasNotas }))
    setNovaNota('')
    fetch(`/api/clientes?id=${cliente.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ notas: novasNotas }),
    }).catch(console.error)
  }

  function parseNota(linha: string): { timestamp: string; texto: string } {
    const m = linha.match(/^\[(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2})\]\s*(.*)$/)
    return m ? { timestamp: m[1], texto: m[2] } : { timestamp: '', texto: linha }
  }

  const linhasNotas = (form.notas || '').split('\n').filter(l => l.trim()).reverse()
  const notasVisiveis = expandirNotas ? linhasNotas : linhasNotas.slice(0, 5)

  const inputStyle: React.CSSProperties = { width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '0.65rem 0.875rem', color: '#fff', fontSize: '0.88rem', fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }
  const labelStyle: React.CSSProperties = { display: 'block', color: '#777', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }
  const actionBtnStyle: React.CSSProperties = { display: 'block', width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '0.75rem 1rem', color: '#aaa', fontSize: '0.875rem', fontFamily: 'Poppins, sans-serif', textAlign: 'left', cursor: 'pointer', textDecoration: 'none', transition: 'all 0.15s', marginBottom: '0.5rem' }

  const urgency = deliverableUrgency(form.proximoDeliverable)
  const deliverableBorder = urgency === 'vencido' ? '#ef4444' : urgency === 'urgente' ? '#FF6B00' : '#333'

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', width: '100%', maxWidth: '580px', position: 'relative', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem 2rem 1rem', borderBottom: '1px solid #1a1a1a', flexShrink: 0 }}>
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.5rem', color: '#fff', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{cliente.nome.toUpperCase()}</h2>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
            <StatusBadge status={form.status} />
            <FaseBadge fase={form.faseAtual} />
          </div>
          {(() => {
            const health = getHealthScore(cliente)
            const textoMap: Record<'verde' | 'amarelo' | 'vermelho', string> = { verde: 'Saudável', amarelo: 'Atenção', vermelho: 'Crítico' }
            const cor = HEALTH_COR[health.cor]
            return (
              <div style={{ background: `${cor}1a`, border: `1px solid ${cor}4d`, borderRadius: '8px', padding: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: cor, flexShrink: 0 }} />
                  <span style={{ color: cor, fontWeight: 700, fontSize: '0.85rem' }}>{textoMap[health.cor]}</span>
                </div>
                {health.motivos.map((m, i) => (
                  <p key={i} style={{ color: '#777', fontSize: '0.78rem', margin: '0.125rem 0 0', paddingLeft: '1.5rem' }}>· {m}</p>
                ))}
              </div>
            )
          })()}
        </div>
        <div style={{ display: 'flex', borderBottom: '1px solid #1a1a1a', flexShrink: 0 }}>
          {(['info', 'acoes'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: 'none', borderBottom: `2px solid ${tab === t ? '#FF6B00' : 'transparent'}`, color: tab === t ? '#fff' : '#555', fontFamily: 'Anton, sans-serif', fontSize: '0.85rem', letterSpacing: '0.1em', cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.15s' }}>
              {t === 'info' ? 'INFO' : 'AÇÕES'}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem' }}>
          {tab === 'info' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

              {/* Progresso ORIUM™ */}
              {(progressoEfetivo || loadingProgressoLocal) && (
                <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
                    <p style={{ fontFamily: 'Anton, sans-serif', color: '#fff', fontSize: '0.75rem', letterSpacing: '0.12em', margin: 0, textTransform: 'uppercase' }}>
                      PROGRESSO ORIUM™
                    </p>
                    {progressoEfetivo && (
                      <span style={{ color: '#E8640C', fontSize: '0.78rem', fontWeight: 700 }}>
                        {progressoEfetivo.concluidas}/{progressoEfetivo.total} — {progressoEfetivo.percentual}%
                      </span>
                    )}
                  </div>
                  {loadingProgressoLocal && !progressoEfetivo ? (
                    <div style={{ height: '4px', borderRadius: '2px', background: '#2a2a2a', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '45%', background: '#383838', borderRadius: '2px', animation: 'orium-pulse 1.5s ease-in-out infinite' }} />
                    </div>
                  ) : progressoEfetivo ? (
                    <>
                      <div style={{ height: '4px', borderRadius: '2px', background: '#2a2a2a', marginBottom: '0.75rem' }}>
                        <div style={{ height: '100%', width: `${progressoEfetivo.percentual}%`, background: '#E8640C', borderRadius: '2px', transition: 'width 0.4s ease' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        {progressoEfetivo.etapas.map(etapa => (
                          <div key={etapa.nome} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.8rem' }}>{etapa.concluida ? '✅' : '⬜'}</span>
                              <span style={{ color: etapa.concluida ? '#ccc' : '#555', fontSize: '0.82rem' }}>{etapa.nome}</span>
                            </div>
                            {etapa.concluida && etapa.linkDrive && (
                              <a href={etapa.linkDrive} target="_blank" rel="noopener noreferrer"
                                style={{ color: '#E8640C', fontSize: '0.68rem', textDecoration: 'none', border: '1px solid rgba(232,100,12,0.3)', borderRadius: '4px', padding: '2px 8px', transition: 'background 0.15s' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,100,12,0.15)' }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                                → Drive
                              </a>
                            )}
                            {!etapa.concluida && etapa.nome === primeiraEtapaPendente && (
                              <button
                                onClick={() => router.push(getToolUrl(etapa.nome, cliente.nome))}
                                style={{ background: 'transparent', border: 'none', color: '#FF6B00', fontFamily: 'Anton, sans-serif', fontSize: '0.72rem', letterSpacing: '0.15em', cursor: 'pointer', padding: '2px 4px', transition: 'opacity 0.15s' }}
                                onMouseEnter={e => { e.currentTarget.style.opacity = '0.75' }}
                                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
                                GERAR →
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              )}

              {/* Campos básicos */}
              <div>
                <label style={labelStyle}>Nome</label>
                <input value={form.nome} onChange={e => set('nome', e.target.value)} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select value={form.status} onChange={e => set('status', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'}>
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                    <option value="Proposta">Proposta</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Fase Atual</label>
                  <select value={form.faseAtual} onChange={e => set('faseAtual', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'}>
                    {FASES.map(f => <option key={f.nome} value={f.nome}>{f.nome}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Instagram</label>
                <input value={form.instagram} onChange={e => set('instagram', e.target.value)} placeholder="@handle" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>E-mail</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'} />
                </div>
                <div>
                  <label style={labelStyle}>Contato</label>
                  <input type="tel" value={form.contato} onChange={e => set('contato', e.target.value)} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Data de Início</label>
                  <input type="date" value={form.dataInicio} onChange={e => set('dataInicio', e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }}
                    onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'} />
                </div>
                <div>
                  <label style={labelStyle}>Última Interação</label>
                  <input type="date" value={form.ultimaInteracao} onChange={e => set('ultimaInteracao', e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }}
                    onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Próximo Deliverable</label>
                  <input type="date" value={form.proximoDeliverable} onChange={e => set('proximoDeliverable', e.target.value)}
                    style={{ ...inputStyle, colorScheme: 'dark', borderColor: deliverableBorder }}
                    onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = deliverableBorder} />
                </div>
                <div>
                  <label style={labelStyle}>Término do contrato</label>
                  <input type="date" value={form.dataTermino} onChange={e => set('dataTermino', e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }}
                    onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Valor Mensal (R$)</label>
                <input type="number" value={form.valorMensal ?? ''} onChange={e => set('valorMensal', e.target.value ? Number(e.target.value) : null)}
                  placeholder="0,00" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'} />
              </div>

              {/* Notas com timestamp */}
              <div>
                <label style={labelStyle}>Notas</label>
                {linhasNotas.length > 0 && (
                  <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.625rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {notasVisiveis.map((linha, i) => {
                      const { timestamp, texto } = parseNota(linha)
                      return (
                        <div key={i} style={{ borderBottom: i < notasVisiveis.length - 1 ? '1px solid #1a1a1a' : 'none', paddingBottom: i < notasVisiveis.length - 1 ? '0.5rem' : 0 }}>
                          {timestamp && <p style={{ color: '#555', fontSize: '0.72rem', margin: '0 0 0.2rem' }}>{timestamp}</p>}
                          <p style={{ color: '#ccc', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>{texto}</p>
                        </div>
                      )
                    })}
                    {linhasNotas.length > 5 && (
                      <button onClick={() => setExpandirNotas(e => !e)}
                        style={{ background: 'none', border: 'none', color: '#FF6B00', fontSize: '0.75rem', cursor: 'pointer', padding: 0, textAlign: 'left', fontFamily: 'Poppins, sans-serif', transition: 'opacity 0.15s' }}>
                        {expandirNotas ? 'Ver menos' : `Ver todas (${linhasNotas.length})`}
                      </button>
                    )}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    value={novaNota}
                    onChange={e => setNovaNota(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addNota() } }}
                    placeholder="Nova nota..."
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={e => e.target.style.borderColor = '#FF6B00'}
                    onBlur={e => e.target.style.borderColor = '#333'}
                  />
                  <button onClick={addNota} disabled={!novaNota.trim()}
                    style={{ background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '0.65rem 0.875rem', color: '#fff', fontFamily: 'Anton, sans-serif', fontSize: '0.75rem', letterSpacing: '0.1em', cursor: novaNota.trim() ? 'pointer' : 'not-allowed', opacity: novaNota.trim() ? 1 : 0.5, flexShrink: 0, transition: 'opacity 0.15s' }}>
                    ADICIONAR
                  </button>
                </div>
              </div>

              {/* Checkbox */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.precisaRelatorio} onChange={e => set('precisaRelatorio', e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#FF6B00', cursor: 'pointer' }} />
                  <span style={{ color: '#aaa', fontSize: '0.875rem' }}>Precisa de relatório</span>
                </label>
              </div>

              {/* Documentos gerados */}
              <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '0.875rem' }}>
                <p style={{ fontFamily: 'Anton, sans-serif', color: '#fff', fontSize: '0.75rem', letterSpacing: '0.12em', margin: '0 0 0.75rem', textTransform: 'uppercase' }}>DOCUMENTOS GERADOS</p>
                {loadingDocs ? (
                  <p style={{ color: '#555', fontSize: '0.82rem', margin: 0 }}>Carregando...</p>
                ) : docCliente.length === 0 ? (
                  <p style={{ color: '#555', fontSize: '0.82rem', margin: 0 }}>Nenhum documento gerado ainda</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {docCliente.slice(0, 5).map(doc => {
                      const cor = TIPO_DOC_COR[doc.tipo] ?? '#555'
                      const href = TIPO_DOC_ROTA[doc.tipo] ? `${TIPO_DOC_ROTA[doc.tipo]}?doc=${doc.id}` : '/meus-documentos'
                      return (
                        <div key={doc.id || doc.pageId} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 600, background: `${cor}22`, color: cor, border: `1px solid ${cor}44`, whiteSpace: 'nowrap', flexShrink: 0 }}>
                            {doc.tipo || '—'}
                          </span>
                          <span style={{ color: '#777', fontSize: '0.78rem', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {doc.dataGeracao ? formatDate(doc.dataGeracao) : '—'}
                          </span>
                          <a href={href} target="_blank" rel="noopener noreferrer"
                            style={{ color: '#FF6B00', fontSize: '0.72rem', textDecoration: 'none', flexShrink: 0, border: '1px solid rgba(255,107,0,0.3)', borderRadius: '4px', padding: '2px 8px', transition: 'background 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,0,0.15)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                            Abrir
                          </a>
                        </div>
                      )
                    })}
                    {docCliente.length > 5 && (
                      <a href="/meus-documentos" target="_blank" rel="noopener noreferrer"
                        style={{ color: '#555', fontSize: '0.75rem', textDecoration: 'none', marginTop: '0.125rem', transition: 'color 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00' }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#555' }}>
                        Ver todos →
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Portal do cliente */}
              {cliente.tokenPortal && (
                <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '0.875rem' }}>
                  <p style={{ fontFamily: 'Anton, sans-serif', color: '#fff', fontSize: '0.75rem', letterSpacing: '0.12em', margin: '0 0 0.625rem', textTransform: 'uppercase' }}>PORTAL DO CLIENTE</p>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input readOnly value={`https://oriumagencia.com.br/portal/${cliente.tokenPortal}`}
                      style={{ ...inputStyle, flex: 1, color: '#777', fontSize: '0.78rem' }}
                      onFocus={e => e.target.select()} />
                    <button onClick={() => navigator.clipboard.writeText(`https://oriumagencia.com.br/portal/${cliente.tokenPortal}`)}
                      style={{ background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '0.65rem 0.875rem', color: '#fff', fontFamily: 'Anton, sans-serif', fontSize: '0.7rem', letterSpacing: '0.1em', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
                      COPIAR LINK
                    </button>
                  </div>
                </div>
              )}

              {/* Atividades */}
              <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '0.875rem', marginBottom: '1rem' }}>
                <p style={{ fontFamily: 'Anton, sans-serif', fontSize: '0.75rem', letterSpacing: '0.12em', color: '#fff', margin: '0 0 0.75rem' }}>
                  ATIVIDADES
                </p>
                {loadingAtividades && <p style={{ color: '#555', fontSize: '0.85rem', margin: 0 }}>Carregando...</p>}
                {!loadingAtividades && atividades.length === 0 && (
                  <p style={{ color: '#555', fontSize: '0.85rem', margin: 0 }}>Nenhuma atividade registrada</p>
                )}
                {!loadingAtividades && atividades.length > 0 && (
                  <div style={{ borderLeft: '2px solid #1a1a1a', paddingLeft: '0.875rem' }}>
                    {(atividadesExpandidas ? atividades : atividades.slice(0, 5)).map(a => (
                      <div key={a.id} style={{ marginBottom: '0.625rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.875rem' }}>{iconeAtividade[a.tipo] || '•'}</span>
                          <span style={{ color: '#ccc', fontSize: '0.85rem', flex: 1 }}>{a.descricao}</span>
                        </div>
                        <p style={{ color: '#555', fontSize: '0.72rem', margin: '0.125rem 0 0 1.375rem' }}>
                          {a.data ? new Date(a.data).toLocaleString('pt-BR', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          }) : '—'}
                        </p>
                      </div>
                    ))}
                    {atividades.length > 5 && (
                      <button
                        onClick={() => setAtividadesExpandidas(e => !e)}
                        style={{ color: '#FF6B00', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '0.25rem' }}>
                        {atividadesExpandidas ? 'Recolher' : `Ver todas (${atividades.length} atividades)`}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          {tab === 'acoes' && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p style={{ color: '#555', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Ferramentas vinculadas</p>
              {[
                { label: '📄 Gerar Relatório', href: `/relatorio?cliente=${encodeURIComponent(cliente.nome)}` },
                { label: '✅ Gerar Checklist', href: `/checklist?cliente=${encodeURIComponent(cliente.nome)}` },
                { label: '📁 Ver Documentos', href: '/meus-documentos' },
                { label: '🔍 Novo Raio-X', href: `/raio-x?cliente=${encodeURIComponent(cliente.nome)}` },
                { label: '📋 Nova Proposta', href: `/proposta?cliente=${encodeURIComponent(cliente.nome)}` },
              ].map(item => (
                <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" style={actionBtnStyle}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B00'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#aaa' }}>
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
        <div style={{ padding: '1rem 2rem', borderTop: '1px solid #1a1a1a', flexShrink: 0 }}>
          {erroSalvar && (
            <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: '8px', padding: '0.625rem 0.875rem', color: '#fca5a5', fontSize: '0.82rem', marginBottom: '0.75rem', lineHeight: 1.5 }}>
              {erroSalvar}
            </div>
          )}
          {erroPauta && (
            <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: '8px', padding: '0.625rem 0.875rem', color: '#fca5a5', fontSize: '0.82rem', marginBottom: '0.75rem', lineHeight: 1.5 }}>
              {erroPauta}
            </div>
          )}
          <button onClick={gerarPauta} disabled={gerandoPauta} style={{ width: '100%', background: 'transparent', border: '1px solid #FF6B00', borderRadius: '8px', padding: '0.75rem', color: '#FF6B00', fontFamily: 'Anton, sans-serif', fontSize: '0.85rem', letterSpacing: '0.12em', cursor: gerandoPauta ? 'not-allowed' : 'pointer', opacity: gerandoPauta ? 0.6 : 1, marginBottom: '0.625rem', transition: 'opacity 0.15s' }}>
            {gerandoPauta ? 'GERANDO...' : 'GERAR PAUTA'}
          </button>
          <div style={{ display: 'flex', gap: '0.625rem' }}>
          <button onClick={handleSave} disabled={saving} style={{ flex: 2, background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '0.75rem', color: '#fff', fontFamily: 'Anton, sans-serif', fontSize: '0.9rem', letterSpacing: '0.12em', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1, transition: 'opacity 0.15s' }}>
            {saving ? 'SALVANDO...' : 'SALVAR'}
          </button>
          <button onClick={onClose} style={{ flex: 1, background: 'transparent', border: '1px solid #333', borderRadius: '8px', padding: '0.75rem', color: '#777', fontFamily: 'Poppins, sans-serif', fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#ccc' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#777' }}>
            Fechar
          </button>
          {confirmDelete ? (
            <button onClick={handleDelete} disabled={deleting} style={{ flex: 1, background: '#ef444422', border: '1px solid #ef4444', borderRadius: '8px', padding: '0.75rem', color: '#ef4444', fontFamily: 'Poppins, sans-serif', fontSize: '0.82rem', cursor: deleting ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}>
              {deleting ? '...' : 'Confirmar'}
            </button>
          ) : (
            <button onClick={() => setConfirmDelete(true)} style={{ flex: 1, background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '0.75rem', color: '#555', fontFamily: 'Poppins, sans-serif', fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#555' }}>
              Deletar
            </button>
          )}
          </div>
        </div>
      </div>
      {pautaTexto !== null && (
        <ModalPauta clienteNome={cliente.nome} pauta={pautaTexto} onClose={() => setPautaTexto(null)} />
      )}
    </div>
  )
}
