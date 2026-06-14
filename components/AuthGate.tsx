'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { isAuthenticated, saveAuth } from '@/lib/auth';
import ToolBackground from './ToolBackground';
import { ORIUM_INPUT_STYLE } from './OriumInput';

type Props = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
};

export default function AuthGate({ children, title = 'ORIUM', subtitle = 'Acesso restrito à equipe.' }: Props) {
  const [autenticado, setAutenticado] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [senha, setSenha] = useState('');
  const [erroSenha, setErroSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setAutenticado(isAuthenticated());
    setAuthChecked(true);
  }, []);

  async function handleSenha(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErroSenha(false);
    try {
      const res = await fetch('/api/raio-x/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha }),
      });
      if (res.ok) { saveAuth(senha); setAutenticado(true); }
      else setErroSenha(true);
    } catch {
      setErroSenha(true);
    } finally {
      setCarregando(false);
    }
  }

  if (!authChecked) return null;
  if (autenticado) return <>{children}</>;

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins, sans-serif' }}>
      <ToolBackground />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px', padding: '0 2rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <Image src="/lglaranja.png" alt="ORIUM" width={120} height={40} style={{ objectFit: 'contain' }} />
        </div>
        <p style={{ color: '#FF6B00', fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>ACESSO INTERNO</p>
        <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(3rem, 6vw, 4.5rem)', color: '#fff', letterSpacing: '0.02em', lineHeight: 0.95, marginBottom: '1.75rem' }}>{title}</h1>
        <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.75, marginBottom: '3rem' }}>{subtitle}</p>
        <form onSubmit={handleSenha} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha de acesso"
              value={senha}
              onChange={e => { setSenha(e.target.value); setErroSenha(false); }}
              autoFocus
              style={{ ...ORIUM_INPUT_STYLE, paddingRight: '2.75rem', border: `1px solid ${erroSenha ? '#ef4444' : '#1e1e1e'}` }}
              onFocus={e => { if (!erroSenha) e.target.style.borderColor = '#FF6B00'; }}
              onBlur={e => { if (!erroSenha) e.target.style.borderColor = '#1e1e1e'; }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 0, color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#666'; }}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {erroSenha && <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>Senha incorreta. Tente novamente.</p>}
          <button
            type="submit"
            disabled={carregando || !senha}
            style={{ width: '100%', background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '1rem', color: '#000', fontFamily: 'Anton, sans-serif', fontSize: '1rem', letterSpacing: '0.15em', cursor: carregando || !senha ? 'not-allowed' : 'pointer', boxShadow: '0 4px 20px rgba(255,107,0,0.2)', opacity: carregando || !senha ? 0.5 : 1, transition: 'all 0.2s' }}
          >
            {carregando ? '...' : 'ACESSAR'}
          </button>
        </form>
      </div>
    </div>
  );
}
