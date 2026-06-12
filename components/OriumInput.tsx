'use client';

import React from 'react';

export const ORIUM_INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid #1e1e1e',
  borderRadius: '10px',
  padding: '1rem 1.25rem',
  color: '#fff',
  fontSize: '0.95rem',
  fontFamily: 'Poppins, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

export const ORIUM_LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  color: '#444',
  fontSize: '0.68rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  marginBottom: '0.5rem',
  fontFamily: 'Poppins, sans-serif',
};

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function OriumInput({ label, error, style, onFocus, onBlur, ...rest }: Props) {
  return (
    <div>
      {label && <label style={ORIUM_LABEL_STYLE}>{label}</label>}
      <input
        {...rest}
        style={{ ...ORIUM_INPUT_STYLE, ...(error ? { borderColor: '#ef4444' } : null), ...style }}
        onFocus={e => { if (!error) e.target.style.borderColor = '#FF6B00'; onFocus?.(e); }}
        onBlur={e => { if (!error) e.target.style.borderColor = '#1e1e1e'; onBlur?.(e); }}
      />
      {error && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.375rem' }}>{error}</p>}
    </div>
  );
}
