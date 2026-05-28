'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Anton, Poppins } from 'next/font/google';

const anton = Anton({ weight: '400', subsets: ['latin'], display: 'swap' });
const poppins = Poppins({ weight: ['400', '500'], subsets: ['latin'], display: 'swap' });

const FERRAMENTAS = [
  {
    numero: '01',
    titulo: 'Briefing Estratégico™',
    tagline: 'Diagnóstico inicial do cliente',
    href: '/briefing',
  },
  {
    numero: '02',
    titulo: 'Raio-X ORIUM™',
    tagline: '8 dimensões de análise digital',
    href: '/raio-x',
  },
  {
    numero: '03',
    titulo: 'Proposta Comercial™',
    tagline: 'Fases, serviços e entrega em PDF',
    href: '/proposta',
  },
];

function Background() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src="/cta.jpg"
        alt=""
        fill
        className="object-cover"
        priority
        quality={90}
      />
      <div className="absolute inset-0 bg-black/85" />
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
    }
    setCarregando(false);
  }

  // ── Login ──────────────────────────────────────────────────────────────────
  if (!autenticado) {
    return (
      <div
        className="relative min-h-screen flex items-center justify-center px-6"
        style={{ fontFamily: poppins.style.fontFamily }}
      >
        <Background />
        <div className="relative z-10 w-full max-w-[280px] text-center">
          <p
            className="text-3xl tracking-widest mb-10"
            style={{ fontFamily: anton.style.fontFamily, color: '#FF6B00' }}
          >
            ORIUM
          </p>
          <form onSubmit={handleSenha} className="space-y-3">
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={e => { setSenha(e.target.value); setErroSenha(false); }}
              autoFocus
              className="w-full rounded-lg px-4 py-3 text-sm text-center text-white placeholder-zinc-600 focus:outline-none transition-colors"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${erroSenha ? '#ef4444' : 'rgba(255,255,255,0.12)'}`,
              }}
            />
            {erroSenha && (
              <p className="text-red-400 text-xs">Senha incorreta.</p>
            )}
            <button
              type="submit"
              disabled={carregando || !senha}
              className="w-full py-3 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: '#FF6B00', color: '#080808' }}
            >
              {carregando ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Hub ────────────────────────────────────────────────────────────────────
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20"
      style={{ fontFamily: poppins.style.fontFamily }}
    >
      <Background />

      <div className="relative z-10 w-full max-w-lg">

        {/* Header */}
        <div className="mb-14">
          <p
            className="text-2xl tracking-widest leading-none mb-2"
            style={{ fontFamily: anton.style.fontFamily, color: '#FF6B00' }}
          >
            ORIUM
          </p>
          <p
            className="text-xs tracking-[3px] uppercase"
            style={{ color: 'rgba(255,255,255,0.25)' }}
          >
            Ferramentas Internas
          </p>
        </div>

        {/* Lista */}
        <div>
          {FERRAMENTAS.map((f) => (
            <Link key={f.href} href={f.href} className="block group">
              <div
                className="flex items-center gap-5 py-5 transition-all duration-200"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span
                  className="text-[11px] w-5 shrink-0 tabular-nums"
                  style={{ color: 'rgba(255,107,0,0.5)' }}
                >
                  {f.numero}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white transition-colors duration-200 group-hover:text-orange-400">
                    {f.titulo}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {f.tagline}
                  </p>
                </div>

                <svg
                  className="w-3.5 h-3.5 shrink-0 transition-all duration-200 group-hover:translate-x-1 group-hover:text-orange-500"
                  style={{ color: 'rgba(255,107,0,0.4)' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Rodapé */}
        <p
          className="mt-14 text-[10px] tracking-[3px] uppercase"
          style={{ color: 'rgba(255,255,255,0.12)' }}
        >
          ORIUM™ · Uso Interno
        </p>

      </div>
    </div>
  );
}
