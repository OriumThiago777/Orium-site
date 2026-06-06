'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { isAuthenticated, saveAuth } from '@/lib/auth'

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Asset {
  id: string
  nome: string
  segmento: string
  tipo: string
  fonte: string
  link: string
  thumbnail: string
  cliente: string
  tags: string[]
  notas: string
  data: string
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const SEGMENTOS = [
  'Barbearia', 'Restaurante / Alimentação', 'Saúde e Estética',
  'Educação / Infoproduto', 'Moda e Varejo', 'Serviços Locais',
  'Fitness / Academia', 'Outros',
]

const TIPOS = [
  'Post Feed', 'Story', 'Reels / Capa de Vídeo', 'Destaque',
  'Proposta / Documento', 'Identidade Visual',
]

const FONTES = ['Canva', 'Google Drive', 'YouTube', 'Referência Externa']

const TAGS_OPTS = ['Template', 'Criação Original', 'Referência', 'Em uso']

const SEG_COR: Record<string, string> = {
  'Barbearia': '#8B5CF6',
  'Restaurante / Alimentação': '#EF4444',
  'Saúde e Estética': '#10B981',
  'Educação / Infoproduto': '#3B82F6',
  'Moda e Varejo': '#EC4899',
  'Serviços Locais': '#F59E0B',
  'Fitness / Academia': '#FF6B00',
  'Outros': '#6B7280',
}

const FONTE_COR: Record<string, string> = {
  'Canva': '#FF6B00',
  'Google Drive': '#3B82F6',
  'YouTube': '#EF4444',
  'Referência Externa': '#6B7280',
}

const TIPO_ICONE: Record<string, string> = {
  'Post Feed': '🖼',
  'Story': '📱',
  'Reels / Capa de Vídeo': '🎬',
  'Destaque': '⭐',
  'Proposta / Documento': '📄',
  'Identidade Visual': '🎨',
}

const FA = 'Anton, sans-serif'
const FP = 'Poppins, sans-serif'

// ─── Empty Form ───────────────────────────────────────────────────────────────
function emptyForm() {
  return { nome: '', segmento: '', tipo: '', fonte: '', link: '', thumbnail: '', cliente: '', tags: [] as string[], notas: '', data: new Date().toISOString().split('T')[0] }
}

// ─── BgImage ─────────────────────────────────────────────────────────────────
function BgImage() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Image src="/hero.jpg" alt="" fill style={{ objectFit: 'cover', opacity: 0.04 }} priority />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(255,107,0,0.05) 0%, transparent 60%)' }} />
    </div>
  )
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ height: '140px', background: '#1a1a1a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,107,0,0.04), transparent)', animation: 'orium-pulse 1.5s ease-in-out infinite' }} />
      </div>
      <div style={{ padding: '0.875rem' }}>
        <div style={{ height: '10px', background: '#1a1a1a', borderRadius: '4px', marginBottom: '0.5rem', width: '60%' }} />
        <div style={{ height: '14px', background: '#1a1a1a', borderRadius: '4px', marginBottom: '0.75rem', width: '80%' }} />
        <div style={{ height: '10px', background: '#1a1a1a', borderRadius: '4px', width: '40%' }} />
      </div>
    </div>
  )
}

// ─── Asset Card ───────────────────────────────────────────────────────────────
function AssetCard({ asset, onDelete }: { asset: Asset; onDelete: (id: string) => void }) {
  const [hovered, setHovered] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)
  const segCor = SEG_COR[asset.segmento] ?? '#6B7280'
  const fonteCor = FONTE_COR[asset.fonte] ?? '#6B7280'
  const icone = TIPO_ICONE[asset.tipo] ?? '📁'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setConfirmDel(false) }}
      style={{
        background: '#0f0f0f',
        border: `1px solid ${hovered ? '#FF6B00' : '#1a1a1a'}`,
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'border-color 0.18s, box-shadow 0.18s',
        boxShadow: hovered ? '0 4px 20px rgba(255,107,0,0.07)' : undefined,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Thumbnail */}
      <div style={{ height: '140px', background: '#141414', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        {asset.thumbnail ? (
          <img src={asset.thumbnail} alt={asset.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
            {icone}
          </div>
        )}
        {/* Lixeira */}
        {hovered && (
          <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
            {!confirmDel ? (
              <button
                onClick={e => { e.stopPropagation(); setConfirmDel(true) }}
                style={{ width: '28px', height: '28px', background: 'rgba(0,0,0,0.7)', border: '1px solid #333', borderRadius: '6px', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#666' }}
              >🗑</button>
            ) : (
              <button
                onClick={e => { e.stopPropagation(); onDelete(asset.id) }}
                style={{ padding: '0 8px', height: '28px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.5)', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', fontSize: '0.7rem', fontFamily: FP }}
              >Confirmar</button>
            )}
          </div>
        )}
      </div>

      {/* Corpo */}
      <div style={{ padding: '0.875rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        {/* Badges segmento + tipo */}
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {asset.segmento && (
            <span style={{ fontSize: '0.62rem', fontWeight: 600, padding: '2px 7px', borderRadius: '4px', background: `${segCor}18`, color: segCor, border: `1px solid ${segCor}30`, letterSpacing: '0.03em' }}>
              {asset.segmento}
            </span>
          )}
          {asset.tipo && (
            <span style={{ fontSize: '0.62rem', padding: '2px 7px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: '#888', border: '1px solid #1e1e1e' }}>
              {icone} {asset.tipo}
            </span>
          )}
        </div>

        {/* Nome */}
        <p style={{ color: '#f0f0f0', fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.3, margin: 0, fontFamily: FP }}>
          {asset.nome || '(sem nome)'}
        </p>

        {/* Fonte + cliente */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {asset.fonte && (
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: fonteCor, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {asset.fonte}
            </span>
          )}
          {asset.cliente && (
            <span style={{ fontSize: '0.65rem', color: '#555' }}>· {asset.cliente}</span>
          )}
        </div>

        {/* Tags */}
        {asset.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
            {asset.tags.map(t => (
              <span key={t} style={{ fontSize: '0.6rem', padding: '1px 6px', borderRadius: '4px', background: '#1a1a1a', color: '#555', border: '1px solid #222' }}>{t}</span>
            ))}
          </div>
        )}

        {/* Spacer + botão Abrir */}
        <div style={{ flex: 1 }} />
        {asset.link && (
          <a
            href={asset.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', textAlign: 'center', padding: '0.5rem', background: '#FF6B00', borderRadius: '6px', color: '#000', fontFamily: FA, fontSize: '0.78rem', letterSpacing: '0.12em', textDecoration: 'none', marginTop: '0.5rem', transition: 'background 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e55f00' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FF6B00' }}
          >
            ABRIR
          </a>
        )}
      </div>
    </div>
  )
}

// ─── Modal Adicionar ──────────────────────────────────────────────────────────
function ModalAdicionar({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState(emptyForm())
  const [salvando, setSalvando] = useState(false)

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))
  const toggleTag = (t: string) => setForm(p => ({
    ...p,
    tags: p.tags.includes(t) ? p.tags.filter(x => x !== t) : [...p.tags, t],
  }))

  async function handleSalvar() {
    if (!form.nome.trim()) { alert('Preencha o nome do asset.'); return }
    setSalvando(true)
    try {
      const res = await fetch('/api/biblioteca', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      onSave()
    } catch (err) {
      alert('Erro ao salvar: ' + (err instanceof Error ? err.message : 'desconhecido'))
    } finally {
      setSalvando(false)
    }
  }

  const IS: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', fontFamily: FP, outline: 'none', boxSizing: 'border-box' }
  const LB: React.CSSProperties = { display: 'block', color: '#555', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.375rem', fontFamily: FP }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: '8px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: FA, fontSize: '1.5rem', color: '#fff', letterSpacing: '0.05em', margin: 0 }}>NOVO ASSET</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#555', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={LB}>Nome *</label>
            <input value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Nome do asset ou template" style={IS} onFocus={e => { e.target.style.borderColor = '#FF6B00' }} onBlur={e => { e.target.style.borderColor = '#1e1e1e' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={LB}>Segmento</label>
              <select value={form.segmento} onChange={e => set('segmento', e.target.value)} style={{ ...IS, cursor: 'pointer' }}>
                <option value="">Selecione...</option>
                {SEGMENTOS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={LB}>Tipo</label>
              <select value={form.tipo} onChange={e => set('tipo', e.target.value)} style={{ ...IS, cursor: 'pointer' }}>
                <option value="">Selecione...</option>
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={LB}>Fonte</label>
              <select value={form.fonte} onChange={e => set('fonte', e.target.value)} style={{ ...IS, cursor: 'pointer' }}>
                <option value="">Selecione...</option>
                {FONTES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={LB}>Data</label>
              <input type="date" value={form.data} onChange={e => set('data', e.target.value)} style={{ ...IS }} onFocus={e => { e.target.style.borderColor = '#FF6B00' }} onBlur={e => { e.target.style.borderColor = '#1e1e1e' }} />
            </div>
          </div>

          <div>
            <label style={LB}>Link</label>
            <input value={form.link} onChange={e => set('link', e.target.value)} placeholder="https://..." style={IS} onFocus={e => { e.target.style.borderColor = '#FF6B00' }} onBlur={e => { e.target.style.borderColor = '#1e1e1e' }} />
          </div>

          <div>
            <label style={LB}>Thumbnail (URL)</label>
            <input value={form.thumbnail} onChange={e => set('thumbnail', e.target.value)} placeholder="https://..." style={IS} onFocus={e => { e.target.style.borderColor = '#FF6B00' }} onBlur={e => { e.target.style.borderColor = '#1e1e1e' }} />
          </div>

          <div>
            <label style={LB}>Cliente</label>
            <input value={form.cliente} onChange={e => set('cliente', e.target.value)} placeholder="Nome do cliente (opcional)" style={IS} onFocus={e => { e.target.style.borderColor = '#FF6B00' }} onBlur={e => { e.target.style.borderColor = '#1e1e1e' }} />
          </div>

          <div>
            <label style={LB}>Tags</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {TAGS_OPTS.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTag(t)}
                  style={{ padding: '4px 10px', borderRadius: '4px', border: `1px solid ${form.tags.includes(t) ? '#FF6B00' : '#1e1e1e'}`, background: form.tags.includes(t) ? 'rgba(255,107,0,0.12)' : 'transparent', color: form.tags.includes(t) ? '#FF6B00' : '#555', fontSize: '0.75rem', fontFamily: FP, cursor: 'pointer', transition: 'all 0.15s' }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={LB}>Notas</label>
            <textarea value={form.notas} onChange={e => set('notas', e.target.value)} rows={3} placeholder="Observações internas..." style={{ ...IS, resize: 'vertical' }} onFocus={e => { e.target.style.borderColor = '#FF6B00' }} onBlur={e => { e.target.style.borderColor = '#1e1e1e' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button onClick={onClose} style={{ flex: 1, padding: '0.875rem', border: '1px solid #1e1e1e', borderRadius: '8px', background: 'transparent', color: '#777', fontFamily: FA, fontSize: '0.9rem', letterSpacing: '0.1em', cursor: 'pointer' }}>
              CANCELAR
            </button>
            <button
              onClick={handleSalvar}
              disabled={salvando}
              style={{ flex: 1, padding: '0.875rem', border: 'none', borderRadius: '8px', background: '#FF6B00', color: '#000', fontFamily: FA, fontSize: '0.9rem', letterSpacing: '0.1em', cursor: salvando ? 'not-allowed' : 'pointer', opacity: salvando ? 0.6 : 1, boxShadow: '0 4px 20px rgba(255,107,0,0.2)', transition: 'all 0.2s' }}
            >
              {salvando ? '...' : 'SALVAR'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function BibliotecaPage() {
  const [autenticado, setAutenticado] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [senha, setSenha] = useState('')
  const [erroSenha, setErroSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)

  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [segmentoAtivo, setSegmentoAtivo] = useState('todos')
  const [tipoFiltro, setTipoFiltro] = useState('')
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)

  useEffect(() => {
    setAutenticado(isAuthenticated())
    setAuthChecked(true)
  }, [])

  useEffect(() => {
    if (autenticado) fetchAssets()
  }, [autenticado])

  async function fetchAssets() {
    setLoading(true)
    try {
      const res = await fetch('/api/biblioteca')
      const data = await res.json()
      setAssets(Array.isArray(data) ? data : [])
    } catch {
      setAssets([])
    } finally {
      setLoading(false)
    }
  }

  async function handleSenha(e: React.FormEvent) {
    e.preventDefault()
    setCarregando(true)
    try {
      const res = await fetch('/api/raio-x/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ senha }) })
      if (res.ok) { saveAuth(); setAutenticado(true) }
      else { setErroSenha(true) }
    } catch { setErroSenha(true) }
    finally { setCarregando(false) }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/biblioteca?id=${id}`, { method: 'DELETE' })
    setAssets(a => a.filter(x => x.id !== id))
  }

  if (!authChecked) return null

  // ── Tela de senha ────────────────────────────────────────────────────────────
  if (!autenticado) {
    return (
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FP }}>
        <BgImage />
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px', padding: '0 2rem' }}>
          <div style={{ marginBottom: '3rem' }}>
            <Image src="/lglaranja.png" alt="ORIUM" width={120} height={40} style={{ objectFit: 'contain' }} />
          </div>
          <p style={{ color: '#FF6B00', fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>ACESSO INTERNO</p>
          <h1 style={{ fontFamily: FA, fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff', letterSpacing: '0.02em', lineHeight: 0.95, marginBottom: '1.75rem' }}>BIBLIOTECA</h1>
          <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.75, marginBottom: '3rem' }}>Acervo de templates e criações por segmento.</p>
          <form onSubmit={handleSenha} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              type="password"
              placeholder="Senha de acesso"
              value={senha}
              onChange={e => { setSenha(e.target.value); setErroSenha(false) }}
              autoFocus
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${erroSenha ? '#ef4444' : '#1e1e1e'}`, borderRadius: '10px', padding: '1rem 1.25rem', color: '#fff', fontSize: '0.95rem', fontFamily: FP, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              onFocus={e => { if (!erroSenha) e.target.style.borderColor = '#FF6B00' }}
              onBlur={e => { if (!erroSenha) e.target.style.borderColor = '#1e1e1e' }}
            />
            {erroSenha && <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>Senha incorreta. Tente novamente.</p>}
            <button type="submit" disabled={carregando || !senha}
              style={{ width: '100%', background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '1rem', color: '#000', fontFamily: FA, fontSize: '1rem', letterSpacing: '0.15em', cursor: carregando || !senha ? 'not-allowed' : 'pointer', boxShadow: '0 4px 20px rgba(255,107,0,0.2)', opacity: carregando || !senha ? 0.5 : 1, transition: 'all 0.2s' }}>
              {carregando ? '...' : 'ACESSAR'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── Filtros aplicados ────────────────────────────────────────────────────────
  const assetsFiltrados = assets
    .filter(a => segmentoAtivo === 'todos' || a.segmento === segmentoAtivo)
    .filter(a => !tipoFiltro || a.tipo === tipoFiltro)
    .filter(a => !busca.trim() || a.nome.toLowerCase().includes(busca.toLowerCase()) || a.cliente.toLowerCase().includes(busca.toLowerCase()))

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ position: 'fixed', inset: 0, overflowY: 'auto', background: '#080808', fontFamily: FP }}>
      <BgImage />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.25rem' }}>
              <Image src="/lgbranca.png" alt="ORIUM" width={100} height={32} style={{ objectFit: 'contain' }} />
              <a href="/hub" style={{ color: '#555', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#555' }}>
                ← PAINEL
              </a>
            </div>
            <p style={{ color: '#FF6B00', fontSize: '0.68rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>ACERVO</p>
            <h1 style={{ fontFamily: FA, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', letterSpacing: '0.03em', lineHeight: 0.95, marginBottom: '0.375rem' }}>
              BIBLIOTECA ORIUM
            </h1>
            <p style={{ color: '#777', fontSize: '0.875rem' }}>Acervo de templates e criações por segmento</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={() => setModalAberto(true)}
              style={{ background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem', color: '#fff', fontFamily: FA, fontSize: '0.9rem', letterSpacing: '0.12em', cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,107,0,0.25)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e55f00'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(255,107,0,0.35)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FF6B00'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,107,0,0.25)' }}
            >
              + ADICIONAR ASSET
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Tabs segmento */}
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {['todos', ...SEGMENTOS].map(seg => {
              const ativo = segmentoAtivo === seg
              const cor = SEG_COR[seg] ?? '#FF6B00'
              return (
                <button key={seg} onClick={() => setSegmentoAtivo(seg)}
                  style={{ padding: '0.375rem 0.875rem', borderRadius: '20px', border: `1px solid ${ativo ? cor : '#222'}`, background: ativo ? `${cor}18` : 'transparent', color: ativo ? cor : '#555', fontSize: '0.78rem', fontFamily: FP, cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.02em' }}>
                  {seg === 'todos' ? 'Todos' : seg}
                </button>
              )
            })}
          </div>

          {/* Tipo + Busca */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select value={tipoFiltro} onChange={e => setTipoFiltro(e.target.value)}
              style={{ background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '0.5rem 0.875rem', color: tipoFiltro ? '#fff' : '#555', fontSize: '0.85rem', fontFamily: FP, outline: 'none', cursor: 'pointer' }}>
              <option value="">Todos os tipos</option>
              {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', pointerEvents: 'none' }}>🔍</span>
              <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por nome ou cliente..."
                style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '0.5rem 1rem 0.5rem 2.125rem', color: '#fff', fontSize: '0.85rem', fontFamily: FP, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                onFocus={e => { e.target.style.borderColor = '#FF6B00' }}
                onBlur={e => { e.target.style.borderColor = '#333' }} />
            </div>
          </div>
        </div>

        {/* Contagem */}
        {!loading && (
          <p style={{ color: '#444', fontSize: '0.78rem', marginBottom: '1.25rem' }}>
            {assetsFiltrados.length} asset{assetsFiltrados.length !== 1 ? 's' : ''}
            {segmentoAtivo !== 'todos' ? ` em ${segmentoAtivo}` : ''}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : assetsFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#444' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📁</div>
            <p style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: '#555' }}>
              Nenhum asset em {segmentoAtivo === 'todos' ? 'nenhum segmento' : segmentoAtivo} ainda.
            </p>
            <button onClick={() => setModalAberto(true)}
              style={{ marginTop: '1rem', background: 'transparent', border: '1px solid #FF6B00', borderRadius: '8px', padding: '0.625rem 1.25rem', color: '#FF6B00', fontFamily: FA, fontSize: '0.82rem', letterSpacing: '0.1em', cursor: 'pointer' }}>
              + ADICIONAR ASSET
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {assetsFiltrados.map(a => (
              <AssetCard key={a.id} asset={a} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalAberto && (
        <ModalAdicionar
          onClose={() => setModalAberto(false)}
          onSave={() => { setModalAberto(false); fetchAssets() }}
        />
      )}
    </div>
  )
}
