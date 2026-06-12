'use client';

import React from 'react';

type Props = {
  /** Se ausente, o botão Voltar não aparece (mantém o espaçador à esquerda) */
  onBack?: () => void;
  onNext: () => void;
  backLabel?: string;
  nextLabel?: string;
  /** Ação em andamento — botão desabilitado com opacidade 0.6 */
  loading?: boolean;
  /** Avanço bloqueado por validação */
  disabled?: boolean;
  /** 'dim': opacidade reduzida; 'gray': fundo #1e1e1e (padrão do /checklist) */
  disabledVariant?: 'dim' | 'gray';
  /** Conteúdo opcional entre os botões (ex.: contador do /checklist) */
  center?: React.ReactNode;
  /** Overrides do container (ex.: padding do /contrato) */
  containerStyle?: React.CSSProperties;
};

export default function WizardFooter({
  onBack,
  onNext,
  backLabel = '← Voltar',
  nextLabel = 'CONTINUAR →',
  loading = false,
  disabled = false,
  disabledVariant = 'dim',
  center,
  containerStyle,
}: Props) {
  const blocked = loading || disabled;
  const gray = disabledVariant === 'gray' && blocked;

  return (
    <div style={{ padding: '1.75rem 5rem', borderTop: '1px solid #141414', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(8px)', ...containerStyle }}>
      {onBack ? (
        <button
          onClick={onBack}
          style={{ background: 'transparent', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '0.875rem 2rem', color: '#666', fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => { const b = e.currentTarget; b.style.borderColor = '#444'; b.style.color = '#ccc'; }}
          onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = '#1e1e1e'; b.style.color = '#666'; }}
        >{backLabel}</button>
      ) : <div />}
      {center}
      <button
        onClick={onNext}
        disabled={blocked}
        style={{
          background: gray ? '#1e1e1e' : '#FF6B00',
          border: 'none',
          borderRadius: '8px',
          padding: '0.875rem 2.75rem',
          color: gray ? '#444' : '#fff',
          fontSize: '0.9rem',
          fontFamily: 'Anton, sans-serif',
          letterSpacing: '0.15em',
          cursor: blocked ? 'not-allowed' : 'pointer',
          opacity: gray ? 1 : loading ? 0.6 : disabled ? 0.4 : 1,
          transition: 'all 0.2s',
          boxShadow: gray ? 'none' : '0 4px 20px rgba(255,107,0,0.2)',
        }}
        onMouseEnter={e => { if (!blocked) { const b = e.currentTarget; b.style.background = '#e55f00'; b.style.boxShadow = '0 6px 28px rgba(255,107,0,0.35)'; } }}
        onMouseLeave={e => { if (!blocked) { const b = e.currentTarget; b.style.background = '#FF6B00'; b.style.boxShadow = '0 4px 20px rgba(255,107,0,0.2)'; } }}
      >{nextLabel}</button>
    </div>
  );
}
