'use client'

import { useState, useRef } from 'react'
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

  // placeholder para próximas tasks
  return <div style={{ color: '#fff', padding: '2rem', fontFamily: 'Poppins' }}>Em construção…</div>
}
