'use client'

type Props = {
  savedAt: number
  onRetomar: () => void
  onDescartar: () => void
}

export default function DraftBanner({ savedAt, onRetomar, onDescartar }: Props) {
  const mins = Math.max(1, Math.floor((Date.now() - savedAt) / 60000))
  const tempo = mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)} h`

  return (
    <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 300, background: '#1a1a1a', border: '1px solid #FF6B00', borderRadius: '10px', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', fontFamily: 'Poppins, sans-serif', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', maxWidth: 'calc(100vw - 2rem)' }}>
      <span style={{ color: '#fff', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
        Rascunho salvo há {tempo} — deseja retomar?
      </span>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={onRetomar}
          style={{ background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '0.5rem 1.1rem', color: '#000', fontFamily: 'Anton, sans-serif', fontSize: '0.8rem', letterSpacing: '0.12em', cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,107,0,0.25)' }}
        >
          RETOMAR
        </button>
        <button
          onClick={onDescartar}
          style={{ background: 'transparent', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '0.5rem 1.1rem', color: '#888', fontFamily: 'Anton, sans-serif', fontSize: '0.8rem', letterSpacing: '0.12em', cursor: 'pointer' }}
        >
          DESCARTAR
        </button>
      </div>
    </div>
  )
}
