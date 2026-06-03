'use client';

import { useState } from 'react';
import Image from 'next/image';

const FERRAMENTAS = [
  {
    tag: 'DIAGNÓSTICO',
    titulo: 'RAIO-X ORIUM',
    descricao: 'Diagnóstico estratégico da presença digital em 8 dimensões.',
    href: '/raio-x',
  },
  {
    tag: 'COMERCIAL',
    titulo: 'PROPOSTA',
    descricao: 'Gere propostas comerciais personalizadas com PDF premium.',
    href: '/proposta',
  },
  {
    tag: 'CONTRATOS',
    titulo: 'CONTRATO',
    descricao: 'Crie contratos de prestação de serviços digitais completos.',
    href: '/contrato',
  },
  {
    tag: 'ONBOARDING',
    titulo: 'BRIEFING',
    descricao: 'Formulário de onboarding estratégico integrado ao Notion.',
    href: '/briefing',
  },
  {
    tag: 'CONTEÚDO',
    titulo: 'CALENDÁRIO',
    descricao: 'Planejamento de conteúdo mensal gerado com IA por cliente.',
    href: '/calendario',
  },
  {
    tag: 'RESULTADOS',
    titulo: 'RELATÓRIO',
    descricao: 'Relatório mensal de resultados por cliente.',
    href: '/relatorio',
  },
];

const EM_BREVE = [
  {
    tag: 'EM BREVE',
    titulo: 'CHECKLIST',
    descricao: 'Checklist de entrega por fase e cliente.',
  },
];

const BG_STYLE = 'radial-gradient(ellipse at 20% 50%, rgba(255,107,0,0.05) 0%, transparent 60%), linear-gradient(to bottom, #080808 0%, transparent 30%, transparent 70%, #080808 100%)';

function BgImage() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Image src="/hero.jpg" alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.07 }} />
      <div style={{ position: 'absolute', inset: 0, background: BG_STYLE }} />
    </div>
  );
}

export default function HubPage() {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState('');
  const [erroSenha, setErroSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

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
      if (res.ok) setAutenticado(true);
      else setErroSenha(true);
    } catch {
      setErroSenha(true);
    } finally {
      setCarregando(false);
    }
  }

  // ── Tela de senha ─────────────────────────────────────────────────────────────
  if (!autenticado) {
    return (
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins, sans-serif' }}>
        <BgImage />
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px', padding: '0 2rem' }}>
          <div style={{ marginBottom: '3rem' }}>
            <Image src="/lglaranja.png" alt="ORIUM" width={120} height={40} style={{ objectFit: 'contain' }} />
          </div>
          <p style={{ color: '#FF6B00', fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            ACESSO INTERNO
          </p>
          <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(3rem, 6vw, 4.5rem)', color: '#fff', letterSpacing: '0.02em', lineHeight: 0.95, marginBottom: '1.75rem' }}>
            HUB ORIUM
          </h1>
          <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.75, marginBottom: '3rem' }}>
            Central de ferramentas estratégicas.
          </p>
          <form onSubmit={handleSenha}>
            <input
              type="password"
              placeholder="Senha de acesso"
              value={senha}
              onChange={e => { setSenha(e.target.value); setErroSenha(false); }}
              autoFocus
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${erroSenha ? '#ef4444' : '#1e1e1e'}`,
                borderRadius: '10px',
                padding: '1rem 1.25rem',
                color: '#fff',
                fontSize: '0.95rem',
                fontFamily: 'Poppins, sans-serif',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => { if (!erroSenha) e.target.style.borderColor = '#FF6B00'; }}
              onBlur={e => { if (!erroSenha) e.target.style.borderColor = '#1e1e1e'; }}
            />
            {erroSenha && (
              <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.75rem', textAlign: 'center' }}>
                Senha incorreta. Tente novamente.
              </p>
            )}
            <button
              type="submit"
              disabled={carregando || !senha}
              style={{
                width: '100%',
                background: '#FF6B00',
                border: 'none',
                borderRadius: '8px',
                padding: '1rem',
                color: '#000',
                fontFamily: 'Anton, sans-serif',
                fontSize: '1rem',
                letterSpacing: '0.15em',
                cursor: carregando || !senha ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(255,107,0,0.2)',
                marginTop: '1rem',
                opacity: carregando || !senha ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
            >
              {carregando ? '...' : 'ACESSAR'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Hub principal ─────────────────────────────────────────────────────────────
  return (
    <div style={{ position: 'fixed', inset: 0, overflowY: 'auto', background: '#080808', fontFamily: 'Poppins, sans-serif' }}>
      <BgImage />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto', padding: '5rem 3rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '4rem' }}>
          <Image src="/lglaranja.png" alt="ORIUM" width={120} height={40} style={{ objectFit: 'contain', display: 'block', marginBottom: '4rem' }} />
          <p style={{ color: '#FF6B00', fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            FERRAMENTAS INTERNAS
          </p>
          <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff', letterSpacing: '0.02em', lineHeight: 0.95, marginBottom: '0.75rem' }}>
            HUB ORIUM
          </h1>
          <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '4rem' }}>
            Acesse, gerencie e execute. Tudo em um lugar.
          </p>
        </div>

        {/* Grid de cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {FERRAMENTAS.map(f => (
            <a key={f.href} href={f.href} style={{ textDecoration: 'none', display: 'block' }}>
              <div
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '1.75rem', cursor: 'pointer', transition: 'all 0.2s', height: '100%', boxSizing: 'border-box' }}
                onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = '#FF6B00'; d.style.background = 'rgba(255,107,0,0.07)'; }}
                onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = '#1e1e1e'; d.style.background = 'rgba(255,255,255,0.03)'; }}
              >
                <p style={{ color: '#FF6B00', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>
                  {f.tag}
                </p>
                <p style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.3rem', color: '#fff', letterSpacing: '0.05em', lineHeight: 1.2, marginBottom: '0.625rem', marginTop: '0.5rem' }}>
                  {f.titulo}
                </p>
                <p style={{ color: '#555', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {f.descricao}
                </p>
                <div style={{ width: '20px', height: '2px', background: '#FF6B00' }} />
              </div>
            </a>
          ))}

          {EM_BREVE.map(f => (
            <div
              key={f.titulo}
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #141414', borderRadius: '12px', padding: '1.75rem', opacity: 0.35, cursor: 'default' }}
            >
              <p style={{ color: '#FF6B00', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>
                {f.tag}
              </p>
              <p style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.3rem', color: '#fff', letterSpacing: '0.05em', lineHeight: 1.2, marginBottom: '0.625rem', marginTop: '0.5rem' }}>
                {f.titulo}
              </p>
              <p style={{ color: '#555', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {f.descricao}
              </p>
              <div style={{ width: '20px', height: '2px', background: '#FF6B00' }} />
            </div>
          ))}
        </div>

        {/* Rodapé */}
        <div style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid #141414', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: '#1e1e1e', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>
            ORIUM™ — Ferramentas Internas
          </p>
          <button
            onClick={() => setAutenticado(false)}
            style={{ background: 'none', border: 'none', color: '#2a2a2a', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', transition: 'color 0.2s', padding: 0, fontFamily: 'Poppins, sans-serif' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#2a2a2a'; }}
          >
            ← sair
          </button>
        </div>

      </div>
    </div>
  );
}
