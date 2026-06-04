'use client'

import React, { useState, useRef, Suspense } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { isAuthenticated, saveAuth } from '@/lib/auth'

type ChecklistItem = {
  id: string
  categoria: string
  label: string
  incluido: boolean
}

const CATEGORIAS = [
  {
    nome: 'PRESENÇA DIGITAL',
    itens: [
      'Criação/otimização de perfil no Instagram',
      'Criação/otimização de perfil no Google Meu Negócio',
      'Criação de site ou landing page',
      'Configuração de link na bio (Linktree ou similar)',
    ],
  },
  {
    nome: 'IDENTIDADE VISUAL',
    itens: [
      'Desenvolvimento de logotipo',
      'Definição de paleta de cores e tipografia',
      'Criação de templates para posts e stories',
    ],
  },
  {
    nome: 'CONTEÚDO E COMUNICAÇÃO',
    itens: [
      'Planejamento de conteúdo mensal',
      'Criação de roteiro de legendas',
      'Produção de artes/posts',
      'Criação de destaques do Instagram',
    ],
  },
  {
    nome: 'ESTRATÉGIA E POSICIONAMENTO',
    itens: [
      'Diagnóstico de posicionamento (Raio-X)',
      'Definição de público-alvo e persona',
      'Análise de concorrência',
      'Proposta de valor e diferenciais',
    ],
  },
  {
    nome: 'GESTÃO E AUTOMAÇÃO',
    itens: [
      'Configuração de respostas automáticas',
      'Criação de fluxo de atendimento',
      'Integração com WhatsApp Business',
      'Relatório mensal de desempenho',
    ],
  },
]

function buildItems(): ChecklistItem[] {
  const items: ChecklistItem[] = []
  let idx = 0
  for (const cat of CATEGORIAS) {
    for (const label of cat.itens) {
      items.push({ id: `item-${idx++}`, categoria: cat.nome, label, incluido: false })
    }
  }
  return items
}

const STEPS_SIDEBAR = ['Configuração', 'Serviços', 'Preview', 'Concluído']
const BG_GRADIENT = 'radial-gradient(ellipse at 20% 50%, rgba(255,107,0,0.05) 0%, transparent 60%), linear-gradient(to bottom, #080808 0%, transparent 30%, transparent 70%, #080808 100%)'

function ChecklistContent() {
  const searchParams = useSearchParams()
  const clienteParam = searchParams.get('cliente')

  const [autenticado, setAutenticado] = useState(() => isAuthenticated())
  const [senha, setSenha] = useState('')
  const [erroSenha, setErroSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)

  const [step, setStep] = useState(0)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const [cliente, setCliente] = useState(clienteParam || '')
  const [periodo, setPeriodo] = useState('')
  const [responsavel, setResponsavel] = useState('Thiago')
  const [observacoes, setObservacoes] = useState('')
  const [items, setItems] = useState<ChecklistItem[]>(buildItems)
  const [salvando, setSalvando] = useState(false)

  const itensMarcados = items.filter(i => i.incluido)
  const totalMarcados = itensMarcados.length

  const categoriasMarcadas = CATEGORIAS.map(cat => ({
    nome: cat.nome,
    itens: itensMarcados.filter(i => i.categoria === cat.nome),
  })).filter(cat => cat.itens.length > 0)

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, incluido: !i.incluido } : i))
  }

  const scrollTop = () => { if (contentRef.current) contentRef.current.scrollTop = 0 }

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
          <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(3rem, 6vw, 4.5rem)', color: '#fff', letterSpacing: '0.02em', lineHeight: 0.95, marginBottom: '1.75rem' }}>CHECKLIST</h1>
          <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.75, marginBottom: '3rem' }}>Checklist de entregas por cliente e período.</p>
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

  // ── Etapa 3: Concluído ─────────────────────────────────────────────────────
  if (step === 3) {
    return (
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins, sans-serif' }}>
        {bgImage}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem', maxWidth: '480px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,107,0,0.12)', border: '1px solid rgba(255,107,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', fontSize: '1.5rem' }}>✦</div>
          <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '2.5rem', color: '#fff', letterSpacing: '0.05em', marginBottom: '1.25rem', lineHeight: 1.05 }}>CHECKLIST<br />SALVO</h1>
          <p style={{ color: '#aaa', lineHeight: 1.75, fontSize: '1rem', marginBottom: '2.5rem' }}>
            Documento gerado e registrado com sucesso.<br />{totalMarcados} serviço{totalMarcados !== 1 ? 's' : ''} entregue{totalMarcados !== 1 ? 's' : ''} registrado{totalMarcados !== 1 ? 's' : ''}.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setCliente(clienteParam || '')
                setPeriodo('')
                setResponsavel('Thiago')
                setObservacoes('')
                setItems(buildItems())
                setStep(0)
                scrollTop()
              }}
              style={{ background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '0.875rem 2rem', color: '#fff', fontFamily: 'Anton, sans-serif', fontSize: '0.9rem', letterSpacing: '0.15em', cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,107,0,0.2)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e55f00'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(255,107,0,0.35)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FF6B00'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,107,0,0.2)' }}
            >GERAR NOVO CHECKLIST</button>
            <a href="/hub"
              style={{ background: 'transparent', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '0.875rem 2rem', color: '#666', fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#ccc' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#666' }}
            >← Painel</a>
          </div>
          <div style={{ width: '32px', height: '2px', background: '#FF6B00', margin: '2.5rem auto 0' }} />
        </div>
      </div>
    )
  }

  // ── Estilos reutilizáveis ──────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#1a1a1a', border: '1px solid #333',
    borderRadius: '10px', padding: '1rem 1.25rem', color: '#fff', fontSize: '0.95rem',
    fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', color: '#e0e0e0', fontSize: '1rem', lineHeight: 1.5, marginBottom: '0.75rem', fontWeight: 500,
  }

  // ── Geração de PDF e salvamento ───────────────────────────────────────────
  async function handleSalvarEGerarPDF() {
    if (!previewRef.current) return
    setSalvando(true)
    try {
      const { default: jsPDF } = await import('jspdf')
      const { default: html2canvas } = await import('html2canvas')

      const el = previewRef.current
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
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
          sliceCanvas.height = Math.ceil(thisSliceHPx)
          const ctx = sliceCanvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(canvas, 0, srcY, canvas.width, thisSliceHPx, 0, 0, canvas.width, thisSliceHPx)
          }
          doc.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', margin, margin, contentW, thisSliceH)
          srcY += sliceHPx
          remainingH -= sliceH
        }
      }

      const clienteSlug = (cliente || 'cliente').toLowerCase().replace(/\s+/g, '-')
      const periodoSlug = (periodo || 'periodo').toLowerCase().replace(/\s+/g, '-')
      doc.save(`checklist-${clienteSlug}-${periodoSlug}.pdf`)

      // Salvar no Notion
      const docId = `checklist-${Date.now()}`
      await fetch('/api/documentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: docId,
          tipo: 'Checklist',
          nome: `Checklist — ${cliente} — ${periodo}`,
          cliente,
          dados: {
            cliente,
            periodo,
            responsavel,
            observacoes,
            itensMarcados: itensMarcados.map(i => ({ categoria: i.categoria, label: i.label })),
          },
        }),
      })

      setStep(3)
    } catch (err) {
      console.error('Erro ao gerar checklist:', err)
      alert('Erro ao gerar PDF. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  // ── Conteúdo por etapa ────────────────────────────────────────────────────
  function renderStepContent(): React.ReactNode {
    if (step === 0) {
      return (
        <div style={{ maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <label style={labelStyle}>Nome do cliente *</label>
            <input style={inputStyle} value={cliente} onChange={e => setCliente(e.target.value)}
              placeholder="Ex: Altemans Barbearia"
              onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'} />
          </div>
          <div>
            <label style={labelStyle}>Período de referência</label>
            <input style={inputStyle} value={periodo} onChange={e => setPeriodo(e.target.value)}
              placeholder="Ex: Maio 2025"
              onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'} />
          </div>
          <div>
            <label style={labelStyle}>Responsável</label>
            <input style={inputStyle} value={responsavel} onChange={e => setResponsavel(e.target.value)}
              placeholder="Thiago"
              onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'} />
          </div>
        </div>
      )
    }

    if (step === 1) {
      return (
        <div style={{ maxWidth: '720px' }}>
          <p style={{ color: '#777', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Marque apenas o que foi efetivamente entregue neste período.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {CATEGORIAS.map(cat => {
              const catItems = items.filter(i => i.categoria === cat.nome)
              const marcados = catItems.filter(i => i.incluido).length
              return (
                <div key={cat.nome}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem', paddingBottom: '0.75rem', borderBottom: '1px solid #1a1a1a' }}>
                    <p style={{ fontFamily: 'Anton, sans-serif', color: '#FF6B00', fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>{cat.nome}</p>
                    <span style={{ color: marcados > 0 ? '#FF6B00' : '#444', fontSize: '0.72rem', letterSpacing: '0.1em', fontFamily: 'Poppins, sans-serif' }}>
                      {marcados}/{catItems.length} selecionados
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {catItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.875rem',
                          padding: '0.875rem 1.125rem', borderRadius: '8px',
                          background: item.incluido ? 'rgba(255,107,0,0.1)' : '#111',
                          border: `1px solid ${item.incluido ? '#FF6B00' : '#333'}`,
                          cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { if (!item.incluido) { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.background = '#161616' }}}
                        onMouseLeave={e => { if (!item.incluido) { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.background = '#111' }}}
                      >
                        <span style={{
                          width: '20px', height: '20px', borderRadius: '4px', flexShrink: 0,
                          background: item.incluido ? '#FF6B00' : 'transparent',
                          border: `1.5px solid ${item.incluido ? '#FF6B00' : '#444'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontSize: '0.72rem', fontWeight: 700, transition: 'all 0.15s',
                        }}>
                          {item.incluido ? '✓' : ''}
                        </span>
                        <span style={{ color: item.incluido ? '#fff' : '#888', fontSize: '0.9rem', lineHeight: 1.4, transition: 'color 0.15s' }}>
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ height: '60px' }} />
        </div>
      )
    }

    if (step === 2) {
      const logoUrl = typeof window !== 'undefined' ? `${window.location.origin}/lglaranja.png` : '/lglaranja.png'
      return (
        <div>
          <p style={{ color: '#777', fontSize: '0.88rem', marginBottom: '2rem' }}>
            Confira o documento antes de salvar e gerar o PDF.
          </p>

          {/* Preview capturável pelo html2canvas */}
          <div ref={previewRef} style={{ background: '#ffffff', borderRadius: '12px', padding: '2.5rem', maxWidth: '720px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '2px solid #FF6B00' }}>
              <div>
                <p style={{ color: '#FF6B00', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.375rem', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 600 }}>CHECKLIST DE ENTREGAS</p>
                <h1 style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 900, fontSize: '1.6rem', color: '#111', letterSpacing: '0.04em', lineHeight: 1, marginBottom: '0.375rem', textTransform: 'uppercase' }}>
                  {cliente || 'CLIENTE'}
                </h1>
                <p style={{ color: '#666', fontSize: '0.85rem', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  {periodo || 'Período não informado'} · Responsável: {responsavel}
                </p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoUrl} alt="ORIUM" style={{ height: '30px', objectFit: 'contain' }} />
            </div>

            {/* Categorias com itens marcados */}
            {categoriasMarcadas.length === 0 ? (
              <p style={{ color: '#aaa', fontSize: '0.9rem', fontFamily: 'Arial, sans-serif' }}>Nenhum serviço selecionado.</p>
            ) : (
              categoriasMarcadas.map(cat => (
                <div key={cat.nome} style={{ marginBottom: '1.75rem' }}>
                  <p style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 700, color: '#FF6B00', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                    {cat.nome}
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {cat.itens.map(item => (
                      <li key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#333', fontSize: '0.88rem', fontFamily: 'Arial, Helvetica, sans-serif', lineHeight: 1.5 }}>
                        <span style={{ color: '#FF6B00', fontWeight: 700, flexShrink: 0 }}>✓</span>
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}

            {/* Observações */}
            {observacoes && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #eee' }}>
                <p style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 700, color: '#FF6B00', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.625rem' }}>OBSERVAÇÕES</p>
                <p style={{ color: '#333', fontSize: '0.88rem', fontFamily: 'Arial, Helvetica, sans-serif', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{observacoes}</p>
              </div>
            )}

            {/* Rodapé */}
            <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ color: '#bbb', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Gerado por ORIUM • {new Date().toLocaleDateString('pt-BR')}
              </p>
              <p style={{ color: '#bbb', fontSize: '0.62rem', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                {totalMarcados} serviço{totalMarcados !== 1 ? 's' : ''} entregue{totalMarcados !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Campo de observações (editável fora do preview) */}
          <div style={{ maxWidth: '720px', marginTop: '1.5rem' }}>
            <label style={{ ...labelStyle, color: '#aaa', fontSize: '0.88rem' }}>Observações (opcional)</label>
            <textarea
              rows={3} value={observacoes} onChange={e => setObservacoes(e.target.value)}
              placeholder="Notas adicionais para este checklist..."
              style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '10px', padding: '1rem 1.25rem', color: '#fff', fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif', resize: 'none', outline: 'none', boxSizing: 'border-box', lineHeight: 1.65, transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#FF6B00'} onBlur={e => e.target.style.borderColor = '#333'}
            />
          </div>
          <div style={{ height: '60px' }} />
        </div>
      )
    }

    return null
  }

  const stepTitles = ['CONFIGURAÇÃO', 'SERVIÇOS', 'PREVIEW']
  const stepSubtitles = [
    'Dados básicos do checklist.',
    'Selecione os serviços entregues.',
    'Revise e gere o documento.',
  ]

  const canNext = step === 0 ? cliente.trim() !== '' : step === 1 ? totalMarcados > 0 : false

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#080808', fontFamily: 'Poppins, sans-serif', display: 'flex' }}>
      {bgImage}

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
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
              <p style={{ color: '#444444', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '0.5rem', marginBottom: 0 }}>CHECKLIST</p>
            </div>
          ) : (
            <div style={{ flexShrink: 0, height: '60px', borderBottom: '1px solid #0f0f0f' }} />
          )}

          {/* Etapas */}
          <div style={{ flex: 1, overflowY: 'hidden' }}>
            {!sidebarCollapsed && (
              <p style={{ color: '#444444', fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', padding: '1.25rem 1.75rem 0.75rem', margin: 0 }}>ETAPAS</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {STEPS_SIDEBAR.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { if (i !== step) { scrollTop(); setStep(i) } }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    gap: '0.75rem', padding: sidebarCollapsed ? '0.875rem 0' : '0.7rem 1.75rem',
                    background: i === step ? 'rgba(255,107,0,0.15)' : 'transparent',
                    border: 'none', borderLeft: sidebarCollapsed ? 'none' : `2px solid ${i === step ? '#FF6B00' : 'transparent'}`,
                    outline: 'none', cursor: i !== step ? 'pointer' : 'default', textAlign: 'left', width: '100%', transition: 'all 0.2s', boxSizing: 'border-box' as const,
                  }}
                  onMouseEnter={e => { if (i !== step) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={e => { if (i !== step) e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ fontFamily: 'Anton, sans-serif', fontSize: '0.65rem', letterSpacing: '0.05em', minWidth: '20px', flexShrink: 0, color: i === step ? '#FF6B00' : i < step ? 'rgba(255,107,0,0.4)' : '#666', transition: 'color 0.2s' }}>
                    {i < step ? '✓' : String(i + 1).padStart(2, '0')}
                  </span>
                  {!sidebarCollapsed && (
                    <span style={{ fontSize: '0.78rem', color: i === step ? '#fff' : i < step ? '#666' : '#999', fontFamily: 'Poppins, sans-serif', fontWeight: i === step ? 600 : 400, lineHeight: 1.3, transition: 'color 0.2s' }}>
                      {s}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Contador de serviços */}
          {!sidebarCollapsed && (
            <div style={{ borderTop: '1px solid #0f0f0f', padding: '1.25rem 1.75rem', flexShrink: 0 }}>
              <p style={{ color: '#444444', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>MARCADOS</p>
              <p style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.4rem', letterSpacing: '0.05em', color: totalMarcados > 0 ? '#FF6B00' : '#2a2a2a', lineHeight: 1 }}>
                {totalMarcados}<span style={{ color: '#2a2a2a', fontSize: '0.9rem' }}>/19</span>
              </p>
              <p style={{ color: '#333', fontSize: '0.68rem', marginTop: '0.25rem' }}>serviços selecionados</p>
            </div>
          )}

          {/* Link painel */}
          <div style={{ borderTop: '1px solid #0f0f0f', padding: sidebarCollapsed ? '1rem 0' : '1rem 1.75rem 1.5rem', flexShrink: 0, display: 'flex', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
            <a
              href="/hub"
              title="Voltar ao painel"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#888888', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.15s', fontFamily: 'Poppins, sans-serif', border: '1px solid #1e1e1e', padding: '8px 12px', borderRadius: '8px' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00'; e.currentTarget.style.borderColor = '#FF6B00' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#888888'; e.currentTarget.style.borderColor = '#1e1e1e' }}
            >
              <span>←</span>
              {!sidebarCollapsed && <span>PAINEL</span>}
            </a>
          </div>

        </div>
      </div>

      {/* ── Área de conteúdo ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ padding: '3rem 5rem 2.5rem', borderBottom: '1px solid #141414', flexShrink: 0 }}>
          <p style={{ color: '#FF6B00', fontSize: '0.68rem', letterSpacing: '0.3em', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Etapa {step + 1} de 4</p>
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: '#fff', letterSpacing: '0.04em', lineHeight: 1, marginBottom: '0.5rem' }}>
            {stepTitles[step] ?? 'CHECKLIST'}
          </h2>
          <p style={{ color: '#555', fontSize: '0.95rem' }}>{stepSubtitles[step] ?? ''}</p>
        </div>

        {/* Conteúdo scrollável */}
        <div ref={contentRef} style={{ flex: 1, overflowY: 'auto', padding: '3rem 5rem' }}>
          {renderStepContent()}
        </div>

        {/* Footer com botões */}
        <div style={{ padding: '1.75rem 5rem', borderTop: '1px solid #141414', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(8px)' }}>

          {/* Botão voltar */}
          {step > 0 ? (
            <button
              onClick={() => { scrollTop(); setStep(s => s - 1) }}
              style={{ background: 'transparent', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '0.875rem 2rem', color: '#666', fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { const b = e.currentTarget; b.style.borderColor = '#444'; b.style.color = '#ccc' }}
              onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = '#1e1e1e'; b.style.color = '#666' }}
            >{step === 2 ? '← Editar' : '← Voltar'}</button>
          ) : <div />}

          {/* Contador central (etapa 1) */}
          {step === 1 && (
            <span style={{ color: totalMarcados > 0 ? '#FF6B00' : '#444', fontSize: '0.78rem', fontFamily: 'Poppins, sans-serif', letterSpacing: '0.05em' }}>
              {totalMarcados} de 19 serviços selecionados
            </span>
          )}

          {/* Botão avançar / salvar */}
          {step < 2 ? (
            <button
              onClick={() => { scrollTop(); setStep(s => s + 1) }}
              disabled={!canNext}
              style={{ background: canNext ? '#FF6B00' : '#1e1e1e', border: 'none', borderRadius: '8px', padding: '0.875rem 2.75rem', color: canNext ? '#fff' : '#444', fontSize: '0.9rem', fontFamily: 'Anton, sans-serif', letterSpacing: '0.15em', cursor: canNext ? 'pointer' : 'not-allowed', transition: 'all 0.2s', boxShadow: canNext ? '0 4px 20px rgba(255,107,0,0.2)' : 'none' }}
              onMouseEnter={e => { if (canNext) { const b = e.currentTarget; b.style.background = '#e55f00'; b.style.boxShadow = '0 6px 28px rgba(255,107,0,0.35)' }}}
              onMouseLeave={e => { if (canNext) { const b = e.currentTarget; b.style.background = '#FF6B00'; b.style.boxShadow = '0 4px 20px rgba(255,107,0,0.2)' }}}
            >
              {step === 0 ? 'PRÓXIMO →' : 'VER PREVIEW →'}
            </button>
          ) : (
            <button
              onClick={handleSalvarEGerarPDF}
              disabled={salvando}
              style={{ background: salvando ? '#1e1e1e' : '#FF6B00', border: 'none', borderRadius: '8px', padding: '0.875rem 2.75rem', color: salvando ? '#444' : '#fff', fontSize: '0.9rem', fontFamily: 'Anton, sans-serif', letterSpacing: '0.15em', cursor: salvando ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: salvando ? 'none' : '0 4px 20px rgba(255,107,0,0.2)' }}
              onMouseEnter={e => { if (!salvando) { const b = e.currentTarget; b.style.background = '#e55f00'; b.style.boxShadow = '0 6px 28px rgba(255,107,0,0.35)' }}}
              onMouseLeave={e => { if (!salvando) { const b = e.currentTarget; b.style.background = '#FF6B00'; b.style.boxShadow = '0 4px 20px rgba(255,107,0,0.2)' }}}
            >
              {salvando ? 'GERANDO...' : 'SALVAR E GERAR PDF'}
            </button>
          )}

        </div>
      </div>
    </div>
  )
}

export default function ChecklistPage() {
  return (
    <Suspense fallback={
      <div style={{ position: 'fixed', inset: 0, background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '2px solid #FF6B00', borderTopColor: 'transparent', borderRadius: '50%' }} />
      </div>
    }>
      <ChecklistContent />
    </Suspense>
  )
}
