'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Anton, Poppins } from 'next/font/google';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const poppins = Poppins({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  display: 'swap',
});

// ── Ferramentas ──────────────────────────────────────────────────────────────

const FERRAMENTAS = [
  {
    numero: '01',
    titulo: 'BRIEFING',
    descricao:
      'Diagnóstico inicial do cliente. Coleta estruturada para entender cenário, objetivos e contexto.',
    href: '/briefing',
  },
  {
    numero: '02',
    titulo: 'RAIO-X',
    descricao:
      'Análise estratégica em 8 dimensões. Gera diagnóstico completo em PDF premium.',
    href: '/raio-x',
  },
  {
    numero: '03',
    titulo: 'PROPOSTA',
    descricao:
      'Estrutura comercial customizável. Fases, serviços e valores em proposta PDF.',
    href: '/proposta',
  },
  {
    numero: '04',
    titulo: 'CONTRATO',
    tag: 'NOVO',
    descricao:
      'Gere contratos de prestação de serviços digitais personalizados em 9 etapas.',
    href: '/contrato',
  },
];

// ── Componente ───────────────────────────────────────────────────────────────

export default function FerramentasPage() {
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

  // ── Tela de acesso ─────────────────────────────────────────────────────────
  if (!autenticado) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: '#080808', fontFamily: poppins.style.fontFamily }}
      >
        <div className="w-full max-w-[260px] text-center">

          <p
            className="tracking-[6px] uppercase mb-12 text-lg"
            style={{ fontFamily: anton.style.fontFamily, color: '#FF6B00' }}
          >
            ORIUM
          </p>

          <form onSubmit={handleSenha} className="space-y-3">
            <input
              type="password"
              placeholder="senha de acesso"
              value={senha}
              onChange={e => { setSenha(e.target.value); setErroSenha(false); }}
              autoFocus
              className="w-full px-4 py-3 text-sm text-center text-white focus:outline-none transition-colors duration-200"
              style={{
                background: 'transparent',
                border: `1px solid ${erroSenha ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '6px',
                letterSpacing: '0.08em',
                color: '#fff',
                fontFamily: poppins.style.fontFamily,
              }}
            />

            {erroSenha && (
              <p
                className="text-xs tracking-wide"
                style={{ color: 'rgba(239,68,68,0.8)', fontWeight: 300 }}
              >
                senha incorreta
              </p>
            )}

            <button
              type="submit"
              disabled={carregando || !senha}
              className="w-full py-3 text-sm transition-opacity duration-200 disabled:opacity-20"
              style={{
                background: '#FF6B00',
                color: '#080808',
                borderRadius: '6px',
                fontFamily: poppins.style.fontFamily,
                fontWeight: 500,
                letterSpacing: '0.04em',
              }}
            >
              {carregando ? '...' : 'entrar'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Hub principal ──────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#080808', fontFamily: poppins.style.fontFamily }}
    >

      {/* Header */}
      <header
        className="px-8 md:px-16 pt-8 pb-7"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span
          className="tracking-[5px] uppercase text-base"
          style={{ fontFamily: anton.style.fontFamily, color: '#FF6B00' }}
        >
          ORIUM
        </span>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col justify-center px-8 md:px-16 py-14 md:py-20">
        <div className="max-w-6xl w-full mx-auto">

          {/* Eyebrow + título + subtítulo */}
          <div className="mb-16 md:mb-20">
            <p
              className="text-[10px] tracking-[5px] uppercase mb-5"
              style={{ color: '#FF6B00' }}
            >
              Ferramentas
            </p>

            <h1
              className="text-[clamp(2.4rem,6vw,4.5rem)] uppercase leading-none mb-5"
              style={{
                fontFamily: anton.style.fontFamily,
                color: '#FFFFFF',
                letterSpacing: '0.02em',
              }}
            >
              Estrutura<br />Operacional
            </h1>

            <p
              className="text-sm md:text-base max-w-md"
              style={{ color: '#888888', fontWeight: 300, lineHeight: 1.6 }}
            >
              Acesso direto às ferramentas estratégicas da ORIUM™
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {FERRAMENTAS.map((f) => (
              <Link key={f.href} href={f.href} className="group block">
                <div
                  className="relative p-7 md:p-8 h-full flex flex-col transition-transform duration-300 ease-out group-hover:scale-[1.015]"
                  style={{
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    transition: 'transform 300ms ease-out, border-color 300ms ease-out',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#FF6B00')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                >
                  {/* Número + tag opcional */}
                  <div className="flex items-center gap-3 mb-10">
                    <span
                      className="text-[11px] tracking-[2px] transition-colors duration-300 text-[#FF6B00] group-hover:text-white"
                      style={{ fontWeight: 400 }}
                    >
                      {f.numero}
                    </span>
                    {'tag' in f && f.tag && (
                      <span
                        className="text-[9px] tracking-[2px] uppercase px-2 py-0.5 rounded"
                        style={{ background: 'rgba(255,107,0,0.12)', color: '#FF6B00', border: '1px solid rgba(255,107,0,0.25)' }}
                      >
                        {f.tag}
                      </span>
                    )}
                  </div>

                  {/* Nome */}
                  <h2
                    className="uppercase leading-none mb-5 text-xl md:text-2xl"
                    style={{
                      fontFamily: anton.style.fontFamily,
                      color: '#FFFFFF',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {f.titulo}
                  </h2>

                  {/* Descrição */}
                  <p
                    className="text-sm leading-relaxed flex-1"
                    style={{ color: '#888888', fontWeight: 300 }}
                  >
                    {f.descricao}
                  </p>

                  {/* Seta */}
                  <div className="mt-8 flex justify-end">
                    <span
                      className="text-sm transition-all duration-300 ease-out group-hover:translate-x-1"
                      style={{ color: 'rgba(255,255,255,0.2)' }}
                    >
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer
        className="px-8 md:px-16 py-6 text-center"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <p
          className="text-[10px] tracking-[3px] uppercase"
          style={{ color: 'rgba(255,255,255,0.12)', fontWeight: 300 }}
        >
          ORIUM™ · Estruturação Digital Estratégica
        </p>
      </footer>

    </div>
  );
}
