'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

type Tipo = 'pessoa' | 'empresa' | null

export default function BriefingPage() {
  const [tipo, setTipo] = useState<Tipo>(null)
  const [step, setStep] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0
  }, [step])
  const [form, setForm] = useState<Record<string, string>>({})
  const [multi, setMulti] = useState<Record<string, string[]>>({})
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const set = (name: string, value: string) =>
    setForm(prev => ({ ...prev, [name]: value }))

  const toggleMulti = (name: string, value: string) => {
    setMulti(prev => {
      const current = prev[name] || []
      return {
        ...prev,
        [name]: current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value],
      }
    })
  }

  const isChecked = (name: string, value: string) =>
    (multi[name] || []).includes(value)

  const pessoaSteps = [
    {
      bloco: 'QUEM VOCÊ É',
      subtitulo: 'Vamos começar pelo básico.',
      campos: [
        { name: 'Nome completo', label: 'Nome completo', tipo: 'input', placeholder: 'Seu nome completo' },
        { name: 'Profissão', label: 'Profissão e área de atuação', tipo: 'input', placeholder: 'Ex: Médico, Advogado, Consultor...' },
        { name: 'Segmento', label: 'Segmento', tipo: 'radio', opcoes: ['Saúde', 'Educação', 'Jurídico', 'Finanças', 'Consultoria', 'Bem-estar', 'Outro'] },
        { name: 'Para quem atende', label: 'Para quem você atende?', tipo: 'textarea', placeholder: 'Descreva seu cliente ideal...' },
      ],
    },
    {
      bloco: 'PRESENÇA ATUAL',
      subtitulo: 'Uma análise honesta do momento atual.',
      campos: [
        { name: 'Presença digital atual', label: 'Quais canais digitais você já usa?', tipo: 'multi', opcoes: ['Instagram', 'Site', 'Google Meu Negócio', 'WhatsApp Business', 'LinkedIn', 'YouTube', 'Nenhum'] },
        { name: 'Já investiu em presença digital antes', label: 'Você já investiu em presença digital antes?', tipo: 'radio', opcoes: ['Nunca investi', 'Já tentei com resultados fracos', 'Sim, mas sem consistência', 'Sim, com bons resultados'] },
      ],
    },
    {
      bloco: 'A DOR REAL',
      subtitulo: 'O que precisa mudar.',
      campos: [
        { name: 'Por que agora', label: 'Por que agora?', tipo: 'textarea', placeholder: 'O que aconteceu que fez você buscar esse serviço nesse momento...' },
        { name: 'Dor concreta', label: 'Qual é o problema real que você quer resolver?', tipo: 'textarea', placeholder: 'Não o sonho — a dor concreta de hoje...' },
      ],
    },
    {
      bloco: 'PARA ONDE IR',
      subtitulo: 'Direção e resultado esperado.',
      campos: [
        { name: 'Como quer ser percebido online', label: 'Como quer que as pessoas se sintam ao encontrar sua marca?', tipo: 'textarea', placeholder: 'Antes mesmo de falar com você...' },
        { name: 'Resultado esperado em 90 dias', label: 'Qual resultado concreto você espera em 90 dias?', tipo: 'textarea', placeholder: 'Seja específico...' },
      ],
    },
    {
      bloco: 'REFERÊNCIAS',
      subtitulo: 'O que você admira e o que quer evitar.',
      campos: [
        { name: 'Referências de comunicação', label: 'Cite marcas ou profissionais que admira na comunicação', tipo: 'textarea', placeholder: 'E o que te atrai em cada um...' },
        { name: 'O que não quer transmitir', label: 'O que definitivamente não quer transmitir?', tipo: 'textarea', placeholder: 'Algo que sua marca jamais deve parecer...' },
      ],
    },
    {
      bloco: 'OPERACIONAL',
      subtitulo: 'Últimos detalhes.',
      campos: [
        { name: 'Investimento previsto', label: 'Investimento previsto', tipo: 'radio', opcoes: ['Até R$ 500', 'R$ 500–R$ 1.000', 'R$ 1.000–R$ 2.000', 'R$ 2.000–R$ 5.000', 'Acima de R$ 5.000'] },
        { name: 'Forma de comunicação preferida', label: 'Como prefere se comunicar?', tipo: 'multi', opcoes: ['WhatsApp', 'E-mail', 'Reunião online', 'Reunião presencial'] },
        { name: 'Contato', label: 'WhatsApp', tipo: 'input', placeholder: '(XX) XXXXX-XXXX' },
        { name: 'Email', label: 'E-mail', tipo: 'input', placeholder: 'seu@email.com' },
      ],
    },
  ]

  const empresaSteps = [
    {
      bloco: 'QUEM É A EMPRESA',
      subtitulo: 'Vamos começar pelo básico.',
      campos: [
        { name: 'Nome da empresa', label: 'Nome da empresa', tipo: 'input', placeholder: 'Nome oficial' },
        { name: 'Segmento', label: 'Segmento de atuação', tipo: 'radio', opcoes: ['Saúde', 'Educação', 'Alimentação', 'Beleza', 'Jurídico', 'Tecnologia', 'Varejo', 'Serviços', 'Outro'] },
        { name: 'Tempo de mercado', label: 'Tempo de mercado', tipo: 'radio', opcoes: ['Menos de 1 ano', '1 a 3 anos', '3 a 5 anos', 'Mais de 5 anos'] },
        { name: 'O que faz e para quem', label: 'Em uma frase: o que faz e para quem?', tipo: 'textarea', placeholder: 'Seja direto...' },
      ],
    },
    {
      bloco: 'PRESENÇA ATUAL',
      subtitulo: 'Uma análise honesta do momento atual.',
      campos: [
        { name: 'Presença digital atual', label: 'Quais canais digitais a empresa já usa?', tipo: 'multi', opcoes: ['Instagram', 'Site', 'Google Meu Negócio', 'WhatsApp Business', 'LinkedIn', 'YouTube', 'Nenhum'] },
        { name: 'Já investiu em presença digital antes', label: 'A empresa já investiu em presença digital?', tipo: 'radio', opcoes: ['Nunca investimos', 'Já tentamos com resultados fracos', 'Sim, mas sem consistência', 'Sim, com bons resultados'] },
      ],
    },
    {
      bloco: 'A DOR REAL',
      subtitulo: 'O que precisa mudar.',
      campos: [
        { name: 'Por que agora', label: 'Por que agora?', tipo: 'textarea', placeholder: 'O que mudou que fez a empresa buscar esse serviço nesse momento...' },
        { name: 'Dor concreta', label: 'Qual é o problema real que querem resolver?', tipo: 'textarea', placeholder: 'Não o objetivo de longo prazo — a dor concreta de hoje...' },
      ],
    },
    {
      bloco: 'PARA ONDE IR',
      subtitulo: 'Direção e resultado esperado.',
      campos: [
        { name: 'Como quer ser percebida online', label: 'Como querem que um cliente se sinta ao encontrar a empresa?', tipo: 'textarea', placeholder: 'Antes mesmo do primeiro contato...' },
        { name: 'Resultado esperado em 90 dias', label: 'Qual resultado concreto esperam em 90 dias?', tipo: 'textarea', placeholder: 'Seja específico...' },
      ],
    },
    {
      bloco: 'REFERÊNCIAS',
      subtitulo: 'O que admiram e o que querem evitar.',
      campos: [
        { name: 'Referências visuais', label: 'Referências de identidade visual ou comunicação', tipo: 'textarea', placeholder: 'E o que atrai em cada uma...' },
        { name: 'O que não quer transmitir', label: 'O que definitivamente não querem transmitir?', tipo: 'textarea', placeholder: 'Algo que a marca jamais deve parecer...' },
      ],
    },
    {
      bloco: 'OPERACIONAL',
      subtitulo: 'Últimos detalhes.',
      campos: [
        { name: 'Investimento previsto', label: 'Investimento previsto', tipo: 'radio', opcoes: ['Até R$ 500', 'R$ 500–R$ 1.000', 'R$ 1.000–R$ 2.000', 'R$ 2.000–R$ 5.000', 'Acima de R$ 5.000'] },
        { name: 'Quem aprova as entregas', label: 'Quem aprova as entregas?', tipo: 'radio', opcoes: ['Só o fundador', 'Fundador e sócio', 'Fundador e equipe', 'Comitê interno'] },
        { name: 'Forma de comunicação preferida', label: 'Como preferem se comunicar?', tipo: 'multi', opcoes: ['WhatsApp', 'E-mail', 'Reunião online', 'Reunião presencial'] },
        { name: 'Contato responsável', label: 'WhatsApp do responsável', tipo: 'input', placeholder: '(XX) XXXXX-XXXX' },
        { name: 'Email', label: 'E-mail', tipo: 'input', placeholder: 'contato@empresa.com' },
      ],
    },
  ]

  const steps = tipo === 'pessoa' ? pessoaSteps : empresaSteps
  const totalSteps = steps.length
  const currentStep = steps[step]
  const progress = ((step + 1) / totalSteps) * 100

  const handleNext = () => { if (step < totalSteps - 1) setStep(s => s + 1) }
  const handleBack = () => { if (step > 0) setStep(s => s - 1) }

  const handleSubmit = async () => {
    setEnviando(true)
    const multiAsString: Record<string, string> = {}
    for (const [key, values] of Object.entries(multi)) {
      multiAsString[key] = values.join(', ')
    }
    try {
      await fetch('/api/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, ...form, ...multiAsString }),
      })
      setEnviado(true)
    } catch {
      alert('Erro ao enviar. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  const pageStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    overflow: 'hidden',
    background: '#080808',
    fontFamily: 'Poppins, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const bgImage = (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Image src="/hero.jpg" alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.07 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(255,107,0,0.05) 0%, transparent 60%), linear-gradient(to bottom, #080808 0%, transparent 30%, transparent 70%, #080808 100%)' }} />
    </div>
  )

  if (enviado) {
    return (
      <div style={pageStyle}>
        {bgImage}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem', maxWidth: '480px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,107,0,0.12)', border: '1px solid rgba(255,107,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', fontSize: '1.5rem' }}>✦</div>
          <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '2.5rem', color: '#fff', letterSpacing: '0.05em', marginBottom: '1.25rem', lineHeight: 1.05 }}>BRIEFING<br />RECEBIDO</h1>
          <p style={{ color: '#aaa', lineHeight: 1.75, fontSize: '1rem' }}>Suas respostas chegaram. Em breve entraremos em contato.</p>
          <div style={{ width: '32px', height: '2px', background: '#FF6B00', margin: '2rem auto 0' }} />
        </div>
      </div>
    )
  }

  if (!tipo) {
    return (
      <div style={{ ...pageStyle, alignItems: 'flex-start', overflowY: 'auto' }}>
        {bgImage}
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '860px', margin: '0 auto', padding: '5rem 3rem' }}>
          <div style={{ marginBottom: '5rem' }}>
            <Image src="/lglaranja.png" alt="ORIUM" width={120} height={40} style={{ objectFit: 'contain' }} />
          </div>
          <p style={{ color: '#FF6B00', fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>Ponto de partida</p>
          <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(3.5rem, 8vw, 6rem)', color: '#fff', letterSpacing: '0.02em', lineHeight: 0.95, marginBottom: '1.75rem' }}>BRIEFING</h1>
          <p style={{ color: '#aaa', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '500px', marginBottom: '4rem' }}>
            Ponto de partida do nosso trabalho. Responda com honestidade — quanto mais preciso, melhor o resultado.
          </p>
          <p style={{ color: '#444', fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Como você chega</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', maxWidth: '560px' }}>
            {[
              { id: 'pessoa', label: 'PROFISSIONAL\nMARCA PESSOAL', sub: 'Profissional liberal, consultor, marca pessoal' },
              { id: 'empresa', label: 'EMPRESA\nPROJETO', sub: 'Negócio local, projeto educacional, organização' },
            ].map(op => (
              <button
                key={op.id}
                onClick={() => setTipo(op.id as Tipo)}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '1.75rem', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = '#FF6B00'; b.style.background = 'rgba(255,107,0,0.07)' }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = '#1e1e1e'; b.style.background = 'rgba(255,255,255,0.03)' }}
              >
                <p style={{ fontFamily: 'Anton, sans-serif', color: '#fff', fontSize: '1.2rem', lineHeight: 1.2, marginBottom: '0.625rem', whiteSpace: 'pre-line', letterSpacing: '0.05em' }}>{op.label}</p>
                <p style={{ color: '#555', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>{op.sub}</p>
                <div style={{ width: '20px', height: '2px', background: '#FF6B00' }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#080808', fontFamily: 'Poppins, sans-serif', display: 'flex' }}>
      {bgImage}

      {/* Sidebar */}
      <div style={{ position: 'relative', width: sidebarCollapsed ? '60px' : '260px', flexShrink: 0, height: '100%', zIndex: 10, transition: 'width 0.3s ease' }}>

        {/* Toggle — círculo */}
        <button
          onClick={() => setSidebarCollapsed(c => !c)}
          title={sidebarCollapsed ? 'Expandir' : 'Recolher'}
          style={{ position: 'absolute', right: '-12px', top: '50%', transform: 'translateY(-50%)', zIndex: 20, width: '24px', height: '24px', background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#333', fontSize: '0.65rem', transition: 'all 0.2s' }}
          onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = '#FF6B00'; b.style.color = '#FF6B00'; }}
          onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = '#1e1e1e'; b.style.color = '#333'; }}
        >
          {sidebarCollapsed ? '›' : '‹'}
        </button>

        <div style={{ width: '100%', height: '100%', borderRight: '1px solid #0f0f0f', display: 'flex', flexDirection: 'column', background: 'rgba(8,8,8,0.97)', backdropFilter: 'blur(16px)', overflow: 'hidden' }}>

          {/* ZONA 1 — Logo */}
          {!sidebarCollapsed ? (
            <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid #0f0f0f', flexShrink: 0 }}>
              <Image src="/lglaranja.png" alt="ORIUM" width={90} height={28} style={{ objectFit: 'contain' }} />
              <p style={{ color: '#2a2a2a', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Poppins, sans-serif', marginTop: '0.5rem', marginBottom: 0 }}>ONBOARDING</p>
            </div>
          ) : (
            <div style={{ flexShrink: 0, height: '60px', borderBottom: '1px solid #0f0f0f' }} />
          )}

          {/* ZONA 2 — Etapas */}
          <div style={{ flex: 1, overflowY: 'hidden' }}>
            {!sidebarCollapsed && (
              <p style={{ color: '#1a1a1a', fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', padding: '1.25rem 1.75rem 0.75rem', margin: 0 }}>ETAPAS</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {steps.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '0.75rem', padding: sidebarCollapsed ? '0.875rem 0' : '0.7rem 1.75rem', background: i === step ? 'rgba(255,107,0,0.06)' : 'transparent', borderTop: 'none', borderRight: 'none', borderBottom: 'none', borderLeft: sidebarCollapsed ? 'none' : `2px solid ${i === step ? '#FF6B00' : 'transparent'}`, outline: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.2s', boxSizing: 'border-box' as const }}
                  onMouseEnter={e => { if (i !== step) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={e => { if (i !== step) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  <span style={{ fontFamily: 'Anton, sans-serif', fontSize: '0.65rem', letterSpacing: '0.05em', minWidth: '20px', flexShrink: 0, color: i === step ? '#FF6B00' : i < step ? '#3a3a3a' : '#1e1e1e', transition: 'color 0.2s' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {!sidebarCollapsed && (
                    <span style={{ fontSize: '0.78rem', color: i === step ? '#fff' : i < step ? '#3a3a3a' : '#2e2e2e', fontFamily: 'Poppins, sans-serif', fontWeight: i === step ? 500 : 400, lineHeight: 1.3, transition: 'color 0.2s' }}>
                      {s.bloco}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ZONA 3 — Progresso */}
          {!sidebarCollapsed && (
            <div style={{ borderTop: '1px solid #0f0f0f', padding: '1.25rem 1.75rem', flexShrink: 0 }}>
              <p style={{ color: '#1a1a1a', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.625rem' }}>PROGRESSO</p>
              <div style={{ height: '2px', background: '#111', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: '#FF6B00', borderRadius: '2px', transition: 'width 0.5s ease' }} />
              </div>
              <p style={{ color: '#2a2a2a', fontSize: '0.7rem', marginTop: '0.5rem' }}>{Math.round(progress)}% concluído</p>
            </div>
          )}

          {/* ZONA 4 — Hub */}
          <div style={{ borderTop: '1px solid #0f0f0f', padding: sidebarCollapsed ? '1rem 0' : '1rem 1.75rem 1.5rem', flexShrink: 0, display: 'flex', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
            <a
              href="/hub"
              title="Voltar ao painel"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#222', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s', fontFamily: 'Poppins, sans-serif' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#222'; }}
            >
              <span>←</span>
              {!sidebarCollapsed && <span>PAINEL</span>}
            </a>
          </div>

        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <div style={{ padding: '3rem 5rem 2.5rem', borderBottom: '1px solid #141414', flexShrink: 0 }}>
          <p style={{ color: '#FF6B00', fontSize: '0.68rem', letterSpacing: '0.3em', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Etapa {step + 1} de {totalSteps}</p>
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: '#fff', letterSpacing: '0.04em', lineHeight: 1, marginBottom: '0.5rem' }}>
            {currentStep.bloco}
          </h2>
          <p style={{ color: '#555', fontSize: '0.95rem' }}>{currentStep.subtitulo}</p>
        </div>

        <div ref={contentRef} style={{ flex: 1, overflowY: 'auto', padding: '3rem 5rem' }}>
          <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {currentStep.campos.map(campo => (
              <div key={campo.name}>
                <label style={{ display: 'block', color: '#e0e0e0', fontSize: '1rem', lineHeight: 1.5, marginBottom: '1rem', fontWeight: 500 }}>
                  {campo.label}
                </label>
                {campo.tipo === 'textarea' && (
                  <textarea
                    rows={3}
                    value={form[campo.name] || ''}
                    onChange={e => set(campo.name, e.target.value)}
                    placeholder={campo.placeholder || ''}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '1rem 1.25rem', color: '#fff', fontSize: '0.95rem', fontFamily: 'Poppins, sans-serif', resize: 'none', outline: 'none', boxSizing: 'border-box', lineHeight: 1.65, transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#FF6B00'}
                    onBlur={e => e.target.style.borderColor = '#1e1e1e'}
                  />
                )}
                {campo.tipo === 'input' && (
                  <input
                    type="text"
                    value={form[campo.name] || ''}
                    onChange={e => set(campo.name, e.target.value)}
                    placeholder={campo.placeholder || ''}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '1rem 1.25rem', color: '#fff', fontSize: '0.95rem', fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#FF6B00'}
                    onBlur={e => e.target.style.borderColor = '#1e1e1e'}
                  />
                )}
                {campo.tipo === 'radio' && campo.opcoes && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                    {campo.opcoes.map(op => (
                      <button key={op} onClick={() => set(campo.name, op)}
                        style={{ padding: '0.625rem 1.25rem', borderRadius: '8px', border: `1px solid ${form[campo.name] === op ? '#FF6B00' : '#1e1e1e'}`, background: form[campo.name] === op ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.03)', color: form[campo.name] === op ? '#fff' : '#777', fontSize: '0.88rem', fontFamily: 'Poppins, sans-serif', cursor: 'pointer', transition: 'all 0.15s' }}>
                        {form[campo.name] === op ? '● ' : '○ '}{op}
                      </button>
                    ))}
                  </div>
                )}
                {campo.tipo === 'multi' && campo.opcoes && (
                  <>
                    <p style={{ color: '#3a3a3a', fontSize: '0.78rem', marginBottom: '0.75rem' }}>Selecione quantos quiser</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                      {campo.opcoes.map(op => (
                        <button key={op} onClick={() => toggleMulti(campo.name, op)}
                          style={{ padding: '0.625rem 1.25rem', borderRadius: '8px', border: `1px solid ${isChecked(campo.name, op) ? '#FF6B00' : '#1e1e1e'}`, background: isChecked(campo.name, op) ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.03)', color: isChecked(campo.name, op) ? '#fff' : '#777', fontSize: '0.88rem', fontFamily: 'Poppins, sans-serif', cursor: 'pointer', transition: 'all 0.15s' }}>
                          {isChecked(campo.name, op) ? '✓ ' : ''}{op}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '1.75rem 5rem', borderTop: '1px solid #141414', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(8px)' }}>
          {step > 0 ? (
            <button onClick={handleBack}
              style={{ background: 'transparent', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '0.875rem 2rem', color: '#666', fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = '#444'; b.style.color = '#ccc' }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = '#1e1e1e'; b.style.color = '#666' }}
            >← Voltar</button>
          ) : <div />}
          <button
            onClick={step === totalSteps - 1 ? handleSubmit : handleNext}
            disabled={enviando}
            style={{ background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '0.875rem 2.75rem', color: '#fff', fontSize: '0.9rem', fontFamily: 'Anton, sans-serif', letterSpacing: '0.15em', cursor: enviando ? 'not-allowed' : 'pointer', opacity: enviando ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(255,107,0,0.2)' }}
            onMouseEnter={e => { if (!enviando) { const b = e.currentTarget as HTMLButtonElement; b.style.background = '#e55f00'; b.style.boxShadow = '0 6px 28px rgba(255,107,0,0.35)' }}}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = '#FF6B00'; b.style.boxShadow = '0 4px 20px rgba(255,107,0,0.2)' }}
          >
            {enviando ? 'ENVIANDO...' : step === totalSteps - 1 ? 'ENVIAR BRIEFING' : 'CONTINUAR →'}
          </button>
        </div>
      </div>
    </div>
  )
}