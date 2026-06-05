'use client'

interface SaveToastProps {
  status: 'saving' | 'success' | 'error'
}

export default function SaveToast({ status }: SaveToastProps) {
  const borderLeft =
    status === 'success' ? '3px solid #FF6B00' :
    status === 'error'   ? '3px solid #991111' :
    'none'

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: 200,
      background: '#1a1a1a',
      borderLeft,
      borderRadius: '6px',
      padding: '0.75rem 1.25rem',
      color: '#fff',
      fontSize: '0.82rem',
      fontFamily: 'Poppins, sans-serif',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      animation: 'saveToastFadeIn 0.25s ease',
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      minWidth: '220px',
    }}>
      <style>{`@keyframes saveToastFadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      {status === 'saving' && 'Salvando na Biblioteca...'}
      {status === 'success' && <><span>✅</span><span>Salvo na Biblioteca</span></>}
      {status === 'error'   && <><span>⚠️</span><span>Erro ao salvar no Drive</span></>}
    </div>
  )
}
