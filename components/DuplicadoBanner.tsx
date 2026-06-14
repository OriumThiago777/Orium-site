'use client'

type Props = {
  onDismiss: () => void
}

export default function DuplicadoBanner({ onDismiss }: Props) {
  return (
    <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 300, background: '#1a1a1a', border: '1px solid #FF6B00', borderRadius: '10px', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', fontFamily: 'Poppins, sans-serif', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', maxWidth: 'calc(100vw - 2rem)' }}>
      <span style={{ color: '#fff', fontSize: '0.85rem' }}>
        Documento duplicado — revise os dados antes de continuar
      </span>
      <button
        onClick={onDismiss}
        style={{ background: 'transparent', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '0.5rem 1.1rem', color: '#888', fontFamily: 'Anton, sans-serif', fontSize: '0.8rem', letterSpacing: '0.12em', cursor: 'pointer' }}
      >
        OK
      </button>
    </div>
  )
}
