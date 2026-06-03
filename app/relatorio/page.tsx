'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { isAuthenticated, saveAuth } from '@/lib/auth'

type FormData = {
  cliente: string
  periodoMes: string
  periodoAno: string
  responsavel: string
  segInicio: string
  segFim: string
  alcance: string
  impressoes: string
  engajamento: string
  cliques: string
  destaques: string
  atencao: string
  observacoes: string
}

type Listas = {
  entregas: string[]
  proximos: string[]
}

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const ANOS = ['2024','2025','2026','2027']

const STEPS = [
  { bloco: 'IDENTIFICAÇÃO',       subtitulo: 'Dados básicos do relatório.' },
  { bloco: 'ENTREGAS DO MÊS',    subtitulo: 'O que foi entregue neste período.' },
  { bloco: 'MÉTRICAS',            subtitulo: 'Números do período.' },
  { bloco: 'DESTAQUES',           subtitulo: 'Conquistas e pontos positivos.' },
  { bloco: 'PONTOS DE ATENÇÃO',   subtitulo: 'O que precisa melhorar.' },
  { bloco: 'PRÓXIMOS PASSOS',     subtitulo: 'Ações planejadas para o próximo período.' },
  { bloco: 'OBSERVAÇÕES',         subtitulo: 'Notas livres.' },
]

const BG_GRADIENT = 'radial-gradient(ellipse at 20% 50%, rgba(255,107,0,0.05) 0%, transparent 60%), linear-gradient(to bottom, #080808 0%, transparent 30%, transparent 70%, #080808 100%)'

export default function RelatorioPage() {
  const [autenticado, setAutenticado] = useState(() => isAuthenticated())
  const [senha, setSenha] = useState('')
  const [erroSenha, setErroSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)

  const [step, setStep] = useState(0)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const [form, setForm] = useState<FormData>({
    cliente: '', periodoMes: '', periodoAno: '', responsavel: 'Thiago',
    segInicio: '', segFim: '', alcance: '', impressoes: '',
    engajamento: '', cliques: '', destaques: '', atencao: '', observacoes: '',
  })
  const [listas, setListas] = useState<Listas>({ entregas: [], proximos: [] })
  const [inputTemp, setInputTemp] = useState({ entregas: '', proximos: '' })
  const [copiado, setCopiado] = useState(false)
  const [exportando, setExportando] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const setF = (key: keyof FormData, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const addLista = (key: keyof Listas) => {
    const val = inputTemp[key].trim()
    if (!val) return
    setListas(prev => ({ ...prev, [key]: [...prev[key], val] }))
    setInputTemp(prev => ({ ...prev, [key]: '' }))
  }

  const removeLista = (key: keyof Listas, idx: number) =>
    setListas(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== idx) }))

  const bgImage = (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Image src="/hero.jpg" alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.07 }} />
      <div style={{ position: 'absolute', inset: 0, background: BG_GRADIENT }} />
    </div>
  )

  // ── Tela de senha ──────────────────────────────────────────────────────────
  if (!autenticado) {
    return (
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins, sans-serif' }}>
        {bgImage}
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px', padding: '0 2rem' }}>
          <div style={{ marginBottom: '3rem' }}>
            <Image src="/lglaranja.png" alt="ORIUM" width={120} height={40} style={{ objectFit: 'contain' }} />
          </div>
          <p style={{ color: '#FF6B00', fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>ACESSO INTERNO</p>
          <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(3rem, 6vw, 4.5rem)', color: '#fff', letterSpacing: '0.02em', lineHeight: 0.95, marginBottom: '1.75rem' }}>RELATÓRIO</h1>
          <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.75, marginBottom: '3rem' }}>Relatório mensal de resultados por cliente.</p>
          <form onSubmit={async e => {
            e.preventDefault()
            setCarregando(true); setErroSenha(false)
            try {
              const res = await fetch('/api/raio-x/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ senha }) })
              if (res.ok) { saveAuth(); setAutenticado(true) }
              else setErroSenha(true)
            } catch { setErroSenha(true) }
            finally { setCarregando(false) }
          }}>
            <input
              type="password" placeholder="Senha de acesso" value={senha}
              onChange={e => { setSenha(e.target.value); setErroSenha(false) }} autoFocus
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${erroSenha ? '#ef4444' : '#1e1e1e'}`, borderRadius: '10px', padding: '1rem 1.25rem', color: '#fff', fontSize: '0.95rem', fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              onFocus={e => { if (!erroSenha) e.target.style.borderColor = '#FF6B00' }}
              onBlur={e => { if (!erroSenha) e.target.style.borderColor = '#1e1e1e' }}
            />
            {erroSenha && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.75rem', textAlign: 'center' }}>Senha incorreta. Tente novamente.</p>}
            <button type="submit" disabled={carregando || !senha}
              style={{ width: '100%', background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '1rem', color: '#000', fontFamily: 'Anton, sans-serif', fontSize: '1rem', letterSpacing: '0.15em', cursor: carregando || !senha ? 'not-allowed' : 'pointer', boxShadow: '0 4px 20px rgba(255,107,0,0.2)', marginTop: '1rem', opacity: carregando || !senha ? 0.5 : 1, transition: 'all 0.2s' }}>
              {carregando ? '...' : 'ACESSAR'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── Placeholder functions (serão implementadas nas tasks seguintes) ─────────
  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e1e',
    borderRadius: '10px', padding: '1rem 1.25rem', color: '#fff', fontSize: '0.95rem',
    fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', color: '#e0e0e0', fontSize: '1rem', lineHeight: 1.5, marginBottom: '0.75rem', fontWeight: 500,
  }
  const fieldWrap: React.CSSProperties = { display: 'flex', flexDirection: 'column' }
  const textareaStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e1e',
    borderRadius: '10px', padding: '1rem 1.25rem', color: '#fff', fontSize: '0.95rem',
    fontFamily: 'Poppins, sans-serif', resize: 'none', outline: 'none', boxSizing: 'border-box',
    lineHeight: 1.65, transition: 'border-color 0.2s',
  }

  function renderStep(): React.ReactNode {
    const wrap = { maxWidth: '680px', display: 'flex', flexDirection: 'column' as const, gap: '2.5rem' }

    if (step === 0) return (
      <div style={wrap}>
        <div style={fieldWrap}>
          <label style={labelStyle}>Nome do cliente</label>
          <input style={inputStyle} value={form.cliente} onChange={e => setF('cliente', e.target.value)} placeholder="Ex: Altemans Barbearia"
            onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#1e1e1e'} />
        </div>
        <div style={fieldWrap}>
          <label style={labelStyle}>Período</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select value={form.periodoMes} onChange={e => setF('periodoMes', e.target.value)}
              style={{ ...inputStyle, flex: 1, cursor: 'pointer' }}>
              <option value="">Mês</option>
              {MESES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={form.periodoAno} onChange={e => setF('periodoAno', e.target.value)}
              style={{ ...inputStyle, flex: 1, cursor: 'pointer' }}>
              <option value="">Ano</option>
              {ANOS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>
        <div style={fieldWrap}>
          <label style={labelStyle}>Responsável ORIUM</label>
          <input style={inputStyle} value={form.responsavel} onChange={e => setF('responsavel', e.target.value)} placeholder="Thiago"
            onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#1e1e1e'} />
        </div>
      </div>
    )

    if (step === 1) return (
      <div style={wrap}>
        <div style={fieldWrap}>
          <label style={labelStyle}>Entregas do mês</label>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <input style={{ ...inputStyle, flex: 1 }} value={inputTemp.entregas}
              onChange={e => setInputTemp(p => ({ ...p, entregas: e.target.value }))}
              placeholder="Descreva uma entrega…"
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addLista('entregas') } }}
              onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#1e1e1e'} />
            <button onClick={() => addLista('entregas')}
              style={{ background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '0 1.5rem', color: '#000', fontFamily: 'Anton, sans-serif', fontSize: '1.1rem', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#e55f00'}
              onMouseLeave={e => e.currentTarget.style.background = '#FF6B00'}>+</button>
          </div>
          {listas.entregas.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {listas.entregas.map((item, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.25)', borderRadius: '6px', padding: '0.4rem 0.75rem', color: '#ddd', fontSize: '0.85rem' }}>
                  {item}
                  <button onClick={() => removeLista('entregas', i)}
                    style={{ background: 'none', border: 'none', color: '#FF6B00', cursor: 'pointer', padding: 0, lineHeight: 1, fontSize: '0.9rem' }}>×</button>
                </span>
              ))}
            </div>
          )}
          {listas.entregas.length === 0 && (
            <p style={{ color: '#333', fontSize: '0.85rem' }}>Nenhuma entrega adicionada ainda.</p>
          )}
        </div>
      </div>
    )

    if (step === 2) return (
      <div style={wrap}>
        <div style={fieldWrap}>
          <label style={labelStyle}>Seguidores</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#555', fontSize: '0.78rem', marginBottom: '0.5rem' }}>Início do mês</p>
              <input type="number" style={inputStyle} value={form.segInicio} onChange={e => setF('segInicio', e.target.value)} placeholder="0"
                onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#1e1e1e'} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#555', fontSize: '0.78rem', marginBottom: '0.5rem' }}>Fim do mês</p>
              <input type="number" style={inputStyle} value={form.segFim} onChange={e => setF('segFim', e.target.value)} placeholder="0"
                onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#1e1e1e'} />
            </div>
          </div>
        </div>
        <div style={fieldWrap}>
          <label style={labelStyle}>Alcance total</label>
          <input type="number" style={inputStyle} value={form.alcance} onChange={e => setF('alcance', e.target.value)} placeholder="0"
            onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#1e1e1e'} />
        </div>
        <div style={fieldWrap}>
          <label style={labelStyle}>Impressões</label>
          <input type="number" style={inputStyle} value={form.impressoes} onChange={e => setF('impressoes', e.target.value)} placeholder="0"
            onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#1e1e1e'} />
        </div>
        <div style={fieldWrap}>
          <label style={labelStyle}>Engajamento %</label>
          <input type="number" step="0.1" style={inputStyle} value={form.engajamento} onChange={e => setF('engajamento', e.target.value)} placeholder="0"
            onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#1e1e1e'} />
        </div>
        <div style={fieldWrap}>
          <label style={labelStyle}>Cliques no link</label>
          <input type="number" style={inputStyle} value={form.cliques} onChange={e => setF('cliques', e.target.value)} placeholder="0"
            onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#1e1e1e'} />
        </div>
      </div>
    )

    if (step === 3) return (
      <div style={wrap}>
        <div style={fieldWrap}>
          <label style={labelStyle}>Conquistas e pontos positivos do período</label>
          <textarea rows={6} style={textareaStyle} value={form.destaques} onChange={e => setF('destaques', e.target.value)}
            placeholder="Descreva as principais conquistas, resultados positivos, marcos importantes…"
            onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#1e1e1e'} />
        </div>
      </div>
    )

    if (step === 4) return (
      <div style={wrap}>
        <div style={fieldWrap}>
          <label style={labelStyle}>O que precisa melhorar ou está travando</label>
          <textarea rows={6} style={textareaStyle} value={form.atencao} onChange={e => setF('atencao', e.target.value)}
            placeholder="Descreva os pontos de atenção, obstáculos, o que não performou como esperado…"
            onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#1e1e1e'} />
        </div>
      </div>
    )

    if (step === 5) return (
      <div style={wrap}>
        <div style={fieldWrap}>
          <label style={labelStyle}>Próximos passos</label>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <input style={{ ...inputStyle, flex: 1 }} value={inputTemp.proximos}
              onChange={e => setInputTemp(p => ({ ...p, proximos: e.target.value }))}
              placeholder="Descreva uma ação…"
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addLista('proximos') } }}
              onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#1e1e1e'} />
            <button onClick={() => addLista('proximos')}
              style={{ background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '0 1.5rem', color: '#000', fontFamily: 'Anton, sans-serif', fontSize: '1.1rem', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#e55f00'}
              onMouseLeave={e => e.currentTarget.style.background = '#FF6B00'}>+</button>
          </div>
          {listas.proximos.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {listas.proximos.map((item, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.25)', borderRadius: '6px', padding: '0.4rem 0.75rem', color: '#ddd', fontSize: '0.85rem' }}>
                  {item}
                  <button onClick={() => removeLista('proximos', i)}
                    style={{ background: 'none', border: 'none', color: '#FF6B00', cursor: 'pointer', padding: 0, lineHeight: 1, fontSize: '0.9rem' }}>×</button>
                </span>
              ))}
            </div>
          )}
          {listas.proximos.length === 0 && (
            <p style={{ color: '#333', fontSize: '0.85rem' }}>Nenhum passo adicionado ainda.</p>
          )}
        </div>
      </div>
    )

    if (step === 6) return (
      <div style={wrap}>
        <div style={fieldWrap}>
          <label style={labelStyle}>Observações gerais</label>
          <textarea rows={8} style={textareaStyle} value={form.observacoes} onChange={e => setF('observacoes', e.target.value)}
            placeholder="Notas livres, contexto adicional, informações relevantes para o próximo período…"
            onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#1e1e1e'} />
        </div>
      </div>
    )

    return null
  }
  function renderPreview(): React.ReactNode {
    const segDiff = form.segFim && form.segInicio
      ? Number(form.segFim) - Number(form.segInicio)
      : null

    const secTitle = (text: string) => (
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ width: '3px', height: '1.4rem', background: '#FF6B00', borderRadius: '2px', flexShrink: 0 }} />
          <h3 style={{ fontFamily: 'Anton, sans-serif', color: '#FF6B00', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', margin: 0 }}>{text}</h3>
        </div>
        <div style={{ height: '1px', background: '#1a1a1a' }} />
      </div>
    )

    return (
      <div>
        {/* Header do preview */}
        <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ color: '#FF6B00', fontSize: '0.68rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>RELATÓRIO MENSAL</p>
            <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#fff', letterSpacing: '0.04em', lineHeight: 1, marginBottom: '0.5rem' }}>
              {form.cliente || 'CLIENTE'}
            </h1>
            <p style={{ color: '#555', fontSize: '0.9rem' }}>
              {form.periodoMes && form.periodoAno ? `${form.periodoMes} de ${form.periodoAno}` : 'Período não definido'}
              {form.responsavel && ` · ${form.responsavel}`}
            </p>
          </div>
          <Image src="/lglaranja.png" alt="ORIUM" width={90} height={28} style={{ objectFit: 'contain', opacity: 0.7 }} />
        </div>

        {/* Div capturável pelo html2canvas */}
        <div ref={previewRef} style={{ background: '#0d0d0d', borderRadius: '12px', padding: '2.5rem', border: '1px solid #1a1a1a' }}>

          {/* Métricas */}
          {secTitle('MÉTRICAS')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {[
              {
                label: 'SEGUIDORES',
                value: form.segFim || '—',
                sub: segDiff !== null ? (segDiff >= 0 ? `+${segDiff}` : `${segDiff}`) : undefined,
                subColor: segDiff !== null ? (segDiff >= 0 ? '#22c55e' : '#ef4444') : '#555',
              },
              { label: 'ALCANCE', value: form.alcance || '—', sub: undefined, subColor: '#555' },
              { label: 'IMPRESSÕES', value: form.impressoes || '—', sub: undefined, subColor: '#555' },
              { label: 'ENGAJAMENTO', value: form.engajamento ? `${form.engajamento}%` : '—', sub: undefined, subColor: '#555' },
              { label: 'CLIQUES', value: form.cliques || '—', sub: undefined, subColor: '#555' },
            ].map(card => (
              <div key={card.label} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '1.25rem', textAlign: 'center' }}>
                <p style={{ color: '#444', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{card.label}</p>
                <p style={{ fontFamily: 'Anton, sans-serif', color: '#FF6B00', fontSize: '1.5rem', letterSpacing: '0.05em', lineHeight: 1, marginBottom: '0.25rem' }}>{card.value}</p>
                {card.sub && <p style={{ color: card.subColor, fontSize: '0.78rem', fontWeight: 500 }}>{card.sub}</p>}
              </div>
            ))}
          </div>

          {/* Entregas */}
          {listas.entregas.length > 0 && (
            <div style={{ marginBottom: '2.5rem' }}>
              {secTitle('ENTREGAS DO MÊS')}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {listas.entregas.map((e, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', color: '#bbb', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    <span style={{ color: '#FF6B00', flexShrink: 0, marginTop: '0.15rem' }}>▸</span>{e}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Destaques */}
          {form.destaques && (
            <div style={{ marginBottom: '2.5rem' }}>
              {secTitle('DESTAQUES')}
              <p style={{ color: '#bbb', fontSize: '0.9rem', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{form.destaques}</p>
            </div>
          )}

          {/* Pontos de atenção */}
          {form.atencao && (
            <div style={{ marginBottom: '2.5rem' }}>
              {secTitle('PONTOS DE ATENÇÃO')}
              <p style={{ color: '#bbb', fontSize: '0.9rem', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{form.atencao}</p>
            </div>
          )}

          {/* Próximos passos */}
          {listas.proximos.length > 0 && (
            <div style={{ marginBottom: '2.5rem' }}>
              {secTitle('PRÓXIMOS PASSOS')}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {listas.proximos.map((p, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', color: '#bbb', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    <span style={{ color: '#FF6B00', flexShrink: 0, marginTop: '0.15rem' }}>▸</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Observações */}
          {form.observacoes && (
            <div>
              {secTitle('OBSERVAÇÕES')}
              <p style={{ color: '#bbb', fontSize: '0.9rem', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{form.observacoes}</p>
            </div>
          )}

          {/* Rodapé interno */}
          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: '#2a2a2a', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>ORIUM™ — Relatório Mensal</p>
            <p style={{ color: '#2a2a2a', fontSize: '0.65rem' }}>
              {form.periodoMes} {form.periodoAno}
            </p>
          </div>
        </div>

        {/* Botão para editar */}
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-start' }}>
          <button onClick={() => setStep(0)}
            style={{ background: 'transparent', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '0.625rem 1.25rem', color: '#555', fontSize: '0.8rem', fontFamily: 'Poppins, sans-serif', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { const b = e.currentTarget; b.style.borderColor = '#444'; b.style.color = '#ccc' }}
            onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = '#1e1e1e'; b.style.color = '#555' }}
          >← Editar dados</button>
        </div>
      </div>
    )
  }
  async function handleCopiar() {
    const periodoStr = form.periodoMes && form.periodoAno
      ? `${form.periodoMes} de ${form.periodoAno}`
      : 'Período não informado'

    const segDiff = form.segFim && form.segInicio
      ? Number(form.segFim) - Number(form.segInicio)
      : null
    const segDiffStr = segDiff !== null ? ` (${segDiff >= 0 ? '+' : ''}${segDiff})` : ''

    const linhas = [
      `RELATÓRIO MENSAL — ${(form.cliente || 'Cliente').toUpperCase()}`,
      `Período: ${periodoStr}`,
      `Responsável: ${form.responsavel || 'Thiago'}`,
      '',
      '─── MÉTRICAS ───',
      `Seguidores: ${form.segFim || '—'}${segDiffStr} (início: ${form.segInicio || '—'})`,
      `Alcance total: ${form.alcance || '—'}`,
      `Impressões: ${form.impressoes || '—'}`,
      `Engajamento: ${form.engajamento ? form.engajamento + '%' : '—'}`,
      `Cliques no link: ${form.cliques || '—'}`,
    ]

    if (listas.entregas.length > 0) {
      linhas.push('', '─── ENTREGAS DO MÊS ───')
      listas.entregas.forEach(e => linhas.push(`• ${e}`))
    }
    if (form.destaques) {
      linhas.push('', '─── DESTAQUES ───', form.destaques)
    }
    if (form.atencao) {
      linhas.push('', '─── PONTOS DE ATENÇÃO ───', form.atencao)
    }
    if (listas.proximos.length > 0) {
      linhas.push('', '─── PRÓXIMOS PASSOS ───')
      listas.proximos.forEach(p => linhas.push(`• ${p}`))
    }
    if (form.observacoes) {
      linhas.push('', '─── OBSERVAÇÕES ───', form.observacoes)
    }
    linhas.push('', '─'.repeat(40), 'ORIUM™ — Relatório Mensal')

    await navigator.clipboard.writeText(linhas.join('\n'))
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  async function handleExportarPDF() {
    if (!previewRef.current) return
    setExportando(true)
    try {
      const { default: jsPDF } = await import('jspdf')
      const { default: html2canvas } = await import('html2canvas')

      const el = previewRef.current
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0d0d0d',
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageW = doc.internal.pageSize.getWidth()
      const pageH = doc.internal.pageSize.getHeight()
      const margin = 10
      const contentW = pageW - margin * 2
      const contentH = (canvas.height * contentW) / canvas.width

      if (contentH <= pageH - margin * 2) {
        doc.addImage(imgData, 'PNG', margin, margin, contentW, contentH)
      } else {
        let remainingH = contentH
        let srcY = 0
        const sliceH = pageH - margin * 2
        const sliceHPx = (sliceH * canvas.width) / contentW

        while (remainingH > 0) {
          if (srcY > 0) doc.addPage()
          const thisSliceH = Math.min(sliceH, remainingH)
          const thisSliceHPx = (thisSliceH * canvas.width) / contentW

          const sliceCanvas = document.createElement('canvas')
          sliceCanvas.width = canvas.width
          sliceCanvas.height = thisSliceHPx
          const ctx = sliceCanvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(canvas, 0, srcY, canvas.width, thisSliceHPx, 0, 0, canvas.width, thisSliceHPx)
          }
          doc.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', margin, margin, contentW, thisSliceH)

          srcY += sliceHPx
          remainingH -= sliceH
        }
      }

      const clienteSlug = (form.cliente || 'relatorio').toLowerCase().replace(/\s+/g, '-')
      const mesSlug = (form.periodoMes || 'mes').toLowerCase()
      const anoSlug = form.periodoAno || 'ano'
      doc.save(`relatorio-${clienteSlug}-${mesSlug}-${anoSlug}.pdf`)
    } catch (err) {
      console.error('Erro ao gerar PDF:', err)
      alert('Erro ao gerar PDF. Tente novamente.')
    } finally {
      setExportando(false)
    }
  }

  const isPreview = step === 7

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#080808', fontFamily: 'Poppins, sans-serif', display: 'flex' }}>
      {bgImage}

      {/* ── Sidebar ── */}
      <div style={{ position: 'relative', width: sidebarCollapsed ? '60px' : '260px', flexShrink: 0, height: '100%', zIndex: 10, transition: 'width 0.3s ease' }}>
        <button
          onClick={() => setSidebarCollapsed(c => !c)}
          title={sidebarCollapsed ? 'Expandir' : 'Recolher'}
          style={{ position: 'absolute', right: '-12px', top: '50%', transform: 'translateY(-50%)', zIndex: 20, width: '24px', height: '24px', background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#333', fontSize: '0.65rem', transition: 'all 0.2s' }}
          onMouseEnter={e => { const b = e.currentTarget; b.style.borderColor = '#FF6B00'; b.style.color = '#FF6B00' }}
          onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = '#1e1e1e'; b.style.color = '#333' }}
        >
          {sidebarCollapsed ? '›' : '‹'}
        </button>

        <div style={{ width: '100%', height: '100%', borderRight: '1px solid #0f0f0f', display: 'flex', flexDirection: 'column', background: 'rgba(8,8,8,0.97)', backdropFilter: 'blur(16px)', overflow: 'hidden' }}>

          {/* Logo */}
          {!sidebarCollapsed ? (
            <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid #0f0f0f', flexShrink: 0 }}>
              <Image src="/lglaranja.png" alt="ORIUM" width={90} height={28} style={{ objectFit: 'contain' }} />
              <p style={{ color: '#2a2a2a', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '0.5rem', marginBottom: 0 }}>RELATÓRIO</p>
            </div>
          ) : (
            <div style={{ flexShrink: 0, height: '60px', borderBottom: '1px solid #0f0f0f' }} />
          )}

          {/* Etapas */}
          <div style={{ flex: 1, overflowY: 'hidden' }}>
            {!sidebarCollapsed && (
              <p style={{ color: '#1a1a1a', fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', padding: '1.25rem 1.75rem 0.75rem', margin: 0 }}>ETAPAS</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {STEPS.map((s, i) => (
                <button key={i} onClick={() => { if (contentRef.current) contentRef.current.scrollTop = 0; setStep(i) }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '0.75rem', padding: sidebarCollapsed ? '0.875rem 0' : '0.7rem 1.75rem', background: i === step && !isPreview ? 'rgba(255,107,0,0.06)' : 'transparent', border: 'none', borderLeft: sidebarCollapsed ? 'none' : `2px solid ${i === step && !isPreview ? '#FF6B00' : 'transparent'}`, outline: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.2s', boxSizing: 'border-box' }}
                  onMouseEnter={e => { if (i !== step) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                  onMouseLeave={e => { if (i !== step) e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ fontFamily: 'Anton, sans-serif', fontSize: '0.65rem', letterSpacing: '0.05em', minWidth: '20px', flexShrink: 0, color: isPreview ? '#3a3a3a' : i === step ? '#FF6B00' : i < step ? '#3a3a3a' : '#333', transition: 'color 0.2s' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {!sidebarCollapsed && (
                    <span style={{ fontSize: '0.78rem', color: isPreview ? '#2a2a2a' : i === step ? '#fff' : i < step ? '#3a3a3a' : '#444', fontFamily: 'Poppins, sans-serif', fontWeight: i === step && !isPreview ? 500 : 400, lineHeight: 1.3, transition: 'color 0.2s' }}>
                      {s.bloco}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Progresso */}
          {!sidebarCollapsed && !isPreview && (
            <div style={{ borderTop: '1px solid #0f0f0f', padding: '1.25rem 1.75rem', flexShrink: 0 }}>
              <p style={{ color: '#1a1a1a', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.625rem' }}>PROGRESSO</p>
              <div style={{ height: '2px', background: '#111', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${((step + 1) / 7) * 100}%`, background: '#FF6B00', borderRadius: '2px', transition: 'width 0.5s ease' }} />
              </div>
              <p style={{ color: '#2a2a2a', fontSize: '0.7rem', marginTop: '0.5rem' }}>{Math.round(((step + 1) / 7) * 100)}% concluído</p>
            </div>
          )}

          {/* Link hub */}
          <div style={{ borderTop: '1px solid #0f0f0f', padding: sidebarCollapsed ? '1rem 0' : '1rem 1.75rem 1.5rem', flexShrink: 0, display: 'flex', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
            <a href="/hub" title="Voltar ao painel"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#222', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#222' }}
            >
              <span>←</span>
              {!sidebarCollapsed && <span>PAINEL</span>}
            </a>
          </div>
        </div>
      </div>

      {/* ── Área de conteúdo ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        {/* cabeçalho */}
        {!isPreview && (
          <div style={{ padding: '3rem 5rem 2.5rem', borderBottom: '1px solid #141414', flexShrink: 0 }}>
            <p style={{ color: '#FF6B00', fontSize: '0.68rem', letterSpacing: '0.3em', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Etapa {step + 1} de 7</p>
            <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: '#fff', letterSpacing: '0.04em', lineHeight: 1, marginBottom: '0.5rem' }}>{STEPS[step].bloco}</h2>
            <p style={{ color: '#555', fontSize: '0.95rem' }}>{STEPS[step].subtitulo}</p>
          </div>
        )}

        {/* corpo */}
        <div ref={contentRef} style={{ flex: 1, overflowY: 'auto', padding: isPreview ? '2rem 3rem' : '3rem 5rem' }}>
          {!isPreview && renderStep()}
          {isPreview && renderPreview()}
        </div>

        {/* footer formulário */}
        {!isPreview && (
          <div style={{ padding: '1.75rem 5rem', borderTop: '1px solid #141414', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(8px)' }}>
            {step > 0 ? (
              <button onClick={() => setStep(s => s - 1)}
                style={{ background: 'transparent', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '0.875rem 2rem', color: '#666', fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { const b = e.currentTarget; b.style.borderColor = '#444'; b.style.color = '#ccc' }}
                onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = '#1e1e1e'; b.style.color = '#666' }}
              >← Voltar</button>
            ) : <div />}
            <button
              onClick={() => { if (contentRef.current) contentRef.current.scrollTop = 0; setStep(s => s + 1) }}
              style={{ background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '0.875rem 2.75rem', color: '#fff', fontFamily: 'Anton, sans-serif', fontSize: '0.9rem', letterSpacing: '0.15em', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(255,107,0,0.2)' }}
              onMouseEnter={e => { const b = e.currentTarget; b.style.background = '#e55f00'; b.style.boxShadow = '0 6px 28px rgba(255,107,0,0.35)' }}
              onMouseLeave={e => { const b = e.currentTarget; b.style.background = '#FF6B00'; b.style.boxShadow = '0 4px 20px rgba(255,107,0,0.2)' }}
            >
              {step === 6 ? 'VER RELATÓRIO' : 'CONTINUAR →'}
            </button>
          </div>
        )}

        {/* footer preview — implementado na Task 6 */}
        {isPreview && (
          <div style={{ padding: '1.75rem 3rem', borderTop: '1px solid #141414', display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center', flexShrink: 0, background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(8px)' }}>
            <button
              onClick={handleCopiar}
              style={{ background: 'transparent', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '0.875rem 2rem', color: '#ccc', fontSize: '0.88rem', fontFamily: 'Anton, sans-serif', letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { const b = e.currentTarget; b.style.borderColor = '#444'; b.style.color = '#fff' }}
              onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = '#1e1e1e'; b.style.color = '#ccc' }}
            >
              {copiado ? '✓ COPIADO' : 'COPIAR RELATÓRIO'}
            </button>
            <button
              onClick={handleExportarPDF}
              disabled={exportando}
              style={{ background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '0.875rem 2.75rem', color: '#fff', fontFamily: 'Anton, sans-serif', fontSize: '0.88rem', letterSpacing: '0.15em', cursor: exportando ? 'not-allowed' : 'pointer', opacity: exportando ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(255,107,0,0.2)' }}
              onMouseEnter={e => { if (!exportando) { const b = e.currentTarget; b.style.background = '#e55f00'; b.style.boxShadow = '0 6px 28px rgba(255,107,0,0.35)' }}}
              onMouseLeave={e => { const b = e.currentTarget; b.style.background = '#FF6B00'; b.style.boxShadow = '0 4px 20px rgba(255,107,0,0.2)' }}
            >
              {exportando ? 'GERANDO...' : 'EXPORTAR PDF'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
