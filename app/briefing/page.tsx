'use client'

import { useState } from 'react'

type Tipo = 'pessoa' | 'empresa' | null

export default function BriefingPage() {
  const [tipo, setTipo] = useState<Tipo>(null)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<Record<string, string>>({})
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const pessoaSteps = [
    {
      bloco: 'QUEM VOCÊ É',
      campos: [
        { name: 'Nome completo', label: 'Nome completo', tipo: 'input' },
        { name: 'Profissão', label: 'Profissão e área de atuação', tipo: 'input' },
        { name: 'Para quem atende', label: 'Para quem você atende — descreva seu cliente ideal', tipo: 'textarea' },
        { name: 'Diferencial real', label: 'Qual é o seu diferencial real — não o que gostaria que fosse, o que seus melhores clientes dizem quando indicam você', tipo: 'textarea' },
      ]
    },
    {
      bloco: 'ONDE VOCÊ ESTÁ AGORA',
      campos: [
        { name: 'Presença digital atual', label: 'Como está sua presença digital hoje — Instagram, site, Google, WhatsApp Business. Seja honesto sobre o estado real de cada um', tipo: 'textarea' },
        { name: 'O que o cliente encontra ao pesquisar', label: 'Quando um novo cliente pesquisa seu nome online, o que ele encontra — e o que provavelmente pensa ao ver isso', tipo: 'textarea' },
        { name: 'Já investiu em presença digital antes', label: 'Você já investiu em presença digital antes — agência, freelancer, curso, ferramenta? O que aconteceu', tipo: 'textarea' },
      ]
    },
    {
      bloco: 'O QUE MUDOU',
      campos: [
        { name: 'Por que agora', label: 'Por que agora? O que aconteceu ou mudou que fez você buscar esse serviço nesse momento', tipo: 'textarea' },
        { name: 'Dor concreta', label: 'Qual é a dor mais concreta que você quer resolver — não o sonho, o problema real de hoje', tipo: 'textarea' },
      ]
    },
    {
      bloco: 'PARA ONDE QUER IR',
      campos: [
        { name: 'Como quer ser percebido online', label: 'Como você quer que as pessoas se sintam ao encontrar sua marca online — antes mesmo de falar com você', tipo: 'textarea' },
        { name: 'Resultado esperado em 90 dias', label: 'Qual resultado concreto você espera nos próximos 90 dias', tipo: 'textarea' },
        { name: 'O que seria um trabalho bem-feito', label: 'O que seria, para você, um trabalho bem-feito', tipo: 'textarea' },
      ]
    },
    {
      bloco: 'REFERÊNCIAS',
      campos: [
        { name: 'Referências de comunicação', label: 'Cite duas ou três marcas ou profissionais que admira na forma como se comunicam online — e diga o que te atrai em cada um', tipo: 'textarea' },
        { name: 'O que não quer transmitir', label: 'Existe algo que você definitivamente não quer que sua marca pareça ou transmita', tipo: 'textarea' },
      ]
    },
    {
      bloco: 'OPERACIONAL',
      campos: [
        { name: 'Investimento previsto', label: 'Qual é o seu investimento previsto para esse projeto', tipo: 'input' },
        { name: 'Quem aprova as entregas', label: 'Quem aprova as entregas — só você ou mais alguém', tipo: 'input' },
        { name: 'Forma de comunicação preferida', label: 'Como prefere se comunicar e qual sua disponibilidade real', tipo: 'textarea' },
        { name: 'Contato', label: 'WhatsApp', tipo: 'input' },
        { name: 'Email', label: 'E-mail', tipo: 'input' },
      ]
    },
  ]

  const empresaSteps = [
    {
      bloco: 'QUEM É A EMPRESA',
      campos: [
        { name: 'Nome da empresa', label: 'Nome da empresa', tipo: 'input' },
        { name: 'Segmento', label: 'Segmento de atuação', tipo: 'input' },
        { name: 'Tempo de mercado', label: 'Tempo de mercado', tipo: 'input' },
        { name: 'O que faz e para quem', label: 'Em uma frase: o que a empresa faz e para quem', tipo: 'textarea' },
        { name: 'Diferencial real', label: 'Qual é o diferencial real do negócio — não o institucional, o que seus melhores clientes dizem quando indicam vocês', tipo: 'textarea' },
      ]
    },
    {
      bloco: 'ONDE A EMPRESA ESTÁ AGORA',
      campos: [
        { name: 'Presença digital atual', label: 'Como está a presença digital hoje — Instagram, site, Google Meu Negócio, WhatsApp Business. Descreva o estado real de cada canal', tipo: 'textarea' },
        { name: 'O que o cliente encontra ao pesquisar', label: 'Quando um cliente em potencial pesquisa a empresa online, o que ele encontra — e o que provavelmente pensa ao ver isso', tipo: 'textarea' },
        { name: 'Já investiu em presença digital antes', label: 'A empresa já investiu em presença digital antes? O que funcionou e o que não funcionou', tipo: 'textarea' },
      ]
    },
    {
      bloco: 'O QUE MUDOU',
      campos: [
        { name: 'Por que agora', label: 'Por que agora? O que aconteceu ou mudou que fez a empresa buscar esse serviço nesse momento', tipo: 'textarea' },
        { name: 'Dor concreta', label: 'Qual é a dor mais concreta que vocês querem resolver — não o objetivo de longo prazo, o problema real de hoje', tipo: 'textarea' },
      ]
    },
    {
      bloco: 'PARA ONDE QUER IR',
      campos: [
        { name: 'Como quer ser percebida online', label: 'Como vocês querem que um cliente em potencial se sinta ao encontrar a empresa online — antes mesmo do primeiro contato', tipo: 'textarea' },
        { name: 'Resultado esperado em 90 dias', label: 'Qual resultado concreto esperam nos próximos 90 dias', tipo: 'textarea' },
        { name: 'O que seria um trabalho bem-feito', label: 'O que seria, para vocês, um trabalho bem-feito', tipo: 'textarea' },
      ]
    },
    {
      bloco: 'MERCADO E REFERÊNCIAS',
      campos: [
        { name: 'Concorrentes diretos', label: 'Quem são os dois ou três concorrentes diretos — e o que eles fazem melhor que vocês na presença digital', tipo: 'textarea' },
        { name: 'Referências fora do segmento', label: 'Existe alguma marca fora do seu segmento que vocês admiram na forma como se comunicam — e por quê', tipo: 'textarea' },
        { name: 'Referências visuais', label: 'Cite referências de identidade visual ou estética que representam o que vocês querem transmitir — e explique o que atrai em cada uma', tipo: 'textarea' },
        { name: 'O que não quer transmitir', label: 'Existe algo que vocês definitivamente não querem que a marca pareça ou transmita', tipo: 'textarea' },
      ]
    },
    {
      bloco: 'OPERACIONAL',
      campos: [
        { name: 'Investimento previsto', label: 'Qual é o investimento previsto para esse projeto', tipo: 'input' },
        { name: 'Quem aprova as entregas', label: 'Quem aprova as entregas internamente', tipo: 'input' },
        { name: 'Quantas pessoas envolvidas', label: 'Quantas pessoas estão envolvidas nesse processo de aprovação', tipo: 'input' },
        { name: 'Forma de comunicação preferida', label: 'Como preferem se comunicar e qual a disponibilidade real da equipe', tipo: 'textarea' },
        { name: 'Contato responsável', label: 'WhatsApp do responsável', tipo: 'input' },
        { name: 'Email', label: 'E-mail', tipo: 'input' },
      ]
    },
  ]

  const steps = tipo === 'pessoa' ? pessoaSteps : empresaSteps
  const totalSteps = steps.length
  const currentStep = steps[step]
  const progress = ((step + 1) / totalSteps) * 100

  const handleChange = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(s => s + 1)
  }

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1)
  }

  const handleSubmit = async () => {
    setEnviando(true)
    try {
      await fetch('/api/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, ...form }),
      })
      setEnviado(true)
    } catch (e) {
      alert('Erro ao enviar. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <main style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins, sans-serif',
        padding: '2rem',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>✦</div>
          <h1 style={{
            fontFamily: 'Anton, sans-serif',
            fontSize: '2rem',
            color: '#fff',
            letterSpacing: '0.05em',
            marginBottom: '1rem',
          }}>BRIEFING RECEBIDO</h1>
          <p style={{ color: '#888', lineHeight: 1.7, fontSize: '0.95rem' }}>
            Suas respostas chegaram. Em breve entraremos em contato para dar início ao processo.
          </p>
          <div style={{
            marginTop: '2rem',
            width: '40px',
            height: '2px',
            background: '#FF6B00',
            margin: '2rem auto 0',
          }} />
        </div>
      </main>
    )
  }

  if (!tipo) {
    return (
      <main style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins, sans-serif',
        padding: '2rem',
      }}>
        <div style={{ maxWidth: '560px', width: '100%' }}>
          <div style={{ marginBottom: '3rem' }}>
            <p style={{
              fontFamily: 'Anton, sans-serif',
              fontSize: '0.8rem',
              color: '#FF6B00',
              letterSpacing: '0.2em',
              marginBottom: '1.5rem',
            }}>ORIUM™</p>
            <h1 style={{
              fontFamily: 'Anton, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: '#fff',
              letterSpacing: '0.05em',
              lineHeight: 1.1,
              marginBottom: '1rem',
            }}>BRIEFING</h1>
            <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.7 }}>
              Este documento é o ponto de partida do nosso trabalho. Responda com honestidade — quanto mais preciso, melhor o resultado.
            </p>
          </div>

          <p style={{ color: '#444', fontSize: '0.8rem', letterSpacing: '0.15em', marginBottom: '1rem' }}>
            VOCÊ É
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { id: 'pessoa', label: 'PROFISSIONAL / MARCA PESSOAL', sub: 'Profissional liberal, consultor, marca pessoal' },
              { id: 'empresa', label: 'EMPRESA / PROJETO', sub: 'Negócio local, projeto educacional, organização' },
            ].map(op => (
              <button
                key={op.id}
                onClick={() => setTipo(op.id as Tipo)}
                style={{
                  background: 'transparent',
                  border: '1px solid #222',
                  borderRadius: '4px',
                  padding: '1.5rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#FF6B00'
                  ;(e.currentTarget as HTMLButtonElement).style.background = '#111'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#222'
                  ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                }}
              >
                <p style={{
                  fontFamily: 'Anton, sans-serif',
                  color: '#fff',
                  letterSpacing: '0.1em',
                  fontSize: '0.95rem',
                  marginBottom: '0.3rem',
                }}>{op.label}</p>
                <p style={{ color: '#555', fontSize: '0.8rem' }}>{op.sub}</p>
              </button>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      fontFamily: 'Poppins, sans-serif',
      padding: '3rem 1.5rem',
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <p style={{
            fontFamily: 'Anton, sans-serif',
            fontSize: '0.75rem',
            color: '#FF6B00',
            letterSpacing: '0.2em',
            marginBottom: '0.5rem',
          }}>ORIUM™ — BRIEFING</p>

          {/* Progress */}
          <div style={{
            height: '2px',
            background: '#1a1a1a',
            borderRadius: '2px',
            marginBottom: '0.5rem',
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: '#FF6B00',
              borderRadius: '2px',
              transition: 'width 0.4s ease',
            }} />
          </div>
          <p style={{ color: '#333', fontSize: '0.75rem' }}>
            {step + 1} de {totalSteps}
          </p>
        </div>

        {/* Bloco */}
        <p style={{
          fontSize: '0.7rem',
          color: '#FF6B00',
          letterSpacing: '0.2em',
          marginBottom: '2rem',
        }}>{currentStep.bloco}</p>

        {/* Campos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
          {currentStep.campos.map(campo => (
            <div key={campo.name}>
              <label style={{
                display: 'block',
                color: '#aaa',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                marginBottom: '0.75rem',
              }}>{campo.label}</label>
              {campo.tipo === 'textarea' ? (
                <textarea
                  rows={4}
                  value={form[campo.name] || ''}
                  onChange={e => handleChange(campo.name, e.target.value)}
                  style={{
                    width: '100%',
                    background: '#111',
                    border: '1px solid #222',
                    borderRadius: '4px',
                    padding: '0.875rem',
                    color: '#fff',
                    fontSize: '0.9rem',
                    fontFamily: 'Poppins, sans-serif',
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = '#FF6B00'}
                  onBlur={e => e.target.style.borderColor = '#222'}
                />
              ) : (
                <input
                  type="text"
                  value={form[campo.name] || ''}
                  onChange={e => handleChange(campo.name, e.target.value)}
                  style={{
                    width: '100%',
                    background: '#111',
                    border: '1px solid #222',
                    borderRadius: '4px',
                    padding: '0.875rem',
                    color: '#fff',
                    fontSize: '0.9rem',
                    fontFamily: 'Poppins, sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = '#FF6B00'}
                  onBlur={e => e.target.style.borderColor = '#222'}
                />
              )}
            </div>
          ))}
        </div>

        {/* Navegação */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
          {step > 0 && (
            <button
              onClick={handleBack}
              style={{
                background: 'transparent',
                border: '1px solid #222',
                borderRadius: '4px',
                padding: '0.875rem 1.5rem',
                color: '#555',
                fontSize: '0.85rem',
                fontFamily: 'Poppins, sans-serif',
                cursor: 'pointer',
                letterSpacing: '0.1em',
              }}
            >VOLTAR</button>
          )}
          <button
            onClick={step === totalSteps - 1 ? handleSubmit : handleNext}
            disabled={enviando}
            style={{
              marginLeft: 'auto',
              background: '#FF6B00',
              border: 'none',
              borderRadius: '4px',
              padding: '0.875rem 2rem',
              color: '#fff',
              fontSize: '0.85rem',
              fontFamily: 'Anton, sans-serif',
              letterSpacing: '0.15em',
              cursor: 'pointer',
              opacity: enviando ? 0.7 : 1,
            }}
          >
            {enviando ? 'ENVIANDO...' : step === totalSteps - 1 ? 'ENVIAR BRIEFING' : 'CONTINUAR →'}
          </button>
        </div>

      </div>
    </main>
  )
}