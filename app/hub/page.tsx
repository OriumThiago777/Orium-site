'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Anton, Poppins } from 'next/font/google';

const anton = Anton({ weight: '400', subsets: ['latin'], display: 'swap' });
const poppins = Poppins({ weight: ['400', '500', '600'], subsets: ['latin'], display: 'swap' });

// ── Ícones ──────────────────────────────────────────────────────────────────

function IconBriefing() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="8" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" />
      <line x1="20.5" y1="20.5" x2="28" y2="28" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="14" x2="18" y2="14" stroke="#FF6B00" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="10.5" x2="16" y2="10.5" stroke="#FF6B00" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="17.5" x2="14" y2="17.5" stroke="#FF6B00" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconRaioX() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="7" width="26" height="18" rx="2" stroke="#FF6B00" strokeWidth="2" />
      <path d="M11 16H21" stroke="#FF6B00" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 12H25" stroke="#FF6B00" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 20H25" stroke="#FF6B00" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 3V7" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 25V29" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconProposta() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="4" width="20" height="24" rx="2" stroke="#FF6B00" strokeWidth="2" />
      <line x1="11" y1="10" x2="21" y2="10" stroke="#FF6B00" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="15" x2="21" y2="15" stroke="#FF6B00" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="20" x2="17" y2="20" stroke="#FF6B00" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="21" cy="22" r="4" fill="#FF6B00" />
      <path d="M19.5 22L20.5 23L22.5 21" stroke="#080808" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Dados das ferramentas ────────────────────────────────────────────────────

const FERRAMENTAS = [
  {
    id: 'briefing',
    titulo: 'BRIEFING ESTRATÉGICO™',
    tagline: 'Diagnóstico inicial. Entender o cenário atual.',
    descricao: 'Formulário de onboarding para mapear presença, necessidades e momento do cliente antes de qualquer entrega.',
    href: '/briefing',
    Icone: IconBriefing,
    numero: '01',
  },
  {
    id: 'raio-x',
    titulo: 'RAIO-X ORIUM™',
    tagline: 'Análise profunda. 8 dimensões de percepção.',
    descricao: 'Diagnóstico estratégico completo gerado em PDF. Avalia identidade, posicionamento, conteúdo e jornada do cliente.',
    href: '/raio-x',
    Icone: IconRaioX,
    numero: '02',
  },
  {
    id: 'proposta',
    titulo: 'PROPOSTA COMERCIAL™',
    tagline: 'Estrutura de entrega. Fases, valor e resultados.',
    descricao: 'Gerador de proposta por fases com seleção de serviços, cronograma e exportação em PDF profissional.',
    href: '/proposta',
    Icone: IconProposta,
    numero: '03',
  },
];

// ── Componente principal ─────────────────────────────────────────────────────

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

  // ── Tela de senha ──────────────────────────────────────────────────────────
  if (!autenticado) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: '#080808', fontFamily: poppins.style.fontFamily }}
      >
        <div className="w-full max-w-xs">
          {/* Logo */}
          <div className="text-center mb-12">
            <p
              className="text-4xl tracking-widest mb-6"
              style={{ fontFamily: anton.style.fontFamily, color: '#FF6B00' }}
            >
              ORIUM
            </p>
            <div className="w-8 h-px bg-zinc-700 mx-auto mb-6" />
            <p className="text-xs tracking-[4px] uppercase text-zinc-500">
              Acesso Restrito
            </p>
          </div>

          <form onSubmit={handleSenha} className="space-y-3">
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={e => { setSenha(e.target.value); setErroSenha(false); }}
              className="w-full rounded-lg px-4 py-3 text-sm text-center text-white placeholder-zinc-600 focus:outline-none transition"
              style={{ background: '#111111', border: `1px solid ${erroSenha ? '#ef4444' : '#2a2a2a'}` }}
              autoFocus
            />
            {erroSenha && (
              <p className="text-red-400 text-xs text-center">
                Senha incorreta.
              </p>
            )}
            <button
              type="submit"
              disabled={carregando || !senha}
              className="w-full py-3 rounded-lg text-sm font-semibold transition disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: '#FF6B00', color: '#080808' }}
            >
              {carregando ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Hub principal ──────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen"
      style={{ background: '#080808', fontFamily: poppins.style.fontFamily }}
    >
      {/* Ruído de textura sutil */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Glow de fundo */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(255,107,0,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <header className="mb-20 md:mb-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p
                className="text-5xl md:text-7xl tracking-widest leading-none mb-3"
                style={{ fontFamily: anton.style.fontFamily, color: '#FF6B00' }}
              >
                ORIUM
              </p>
              <h1
                className="text-2xl md:text-4xl text-white leading-tight"
                style={{ fontFamily: anton.style.fontFamily, letterSpacing: '0.02em' }}
              >
                FERRAMENTAS ESTRATÉGICAS
              </h1>
            </div>
            <p className="text-sm text-zinc-500 max-w-xs leading-relaxed md:text-right">
              Arsenal interno para diagnóstico,<br />
              posicionamento e estruturação digital.
            </p>
          </div>

          {/* Linha divisória */}
          <div className="mt-10 h-px" style={{ background: 'linear-gradient(to right, #FF6B00, transparent)' }} />
        </header>

        {/* ── Cards ────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {FERRAMENTAS.map((f) => (
            <Link key={f.id} href={f.href} className="group block">
              <div
                className="relative h-full flex flex-col p-8 rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: '#0e0e0e',
                  border: '1px solid #1c1c1c',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.border = '1px solid rgba(255,107,0,0.35)';
                  el.style.transform = 'translateY(-4px)';
                  el.style.background = '#111111';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.border = '1px solid #1c1c1c';
                  el.style.transform = 'translateY(0)';
                  el.style.background = '#0e0e0e';
                }}
              >
                {/* Número */}
                <p
                  className="text-xs tracking-[3px] mb-8"
                  style={{ color: 'rgba(255,107,0,0.4)', fontFamily: poppins.style.fontFamily }}
                >
                  {f.numero}
                </p>

                {/* Ícone */}
                <div className="mb-8">
                  <f.Icone />
                </div>

                {/* Título */}
                <h2
                  className="text-lg md:text-xl leading-tight mb-3"
                  style={{ fontFamily: anton.style.fontFamily, color: '#FFFFFF', letterSpacing: '0.04em' }}
                >
                  {f.titulo}
                </h2>

                {/* Tagline */}
                <p
                  className="text-xs mb-5 leading-relaxed"
                  style={{ color: '#FF6B00', fontWeight: 500 }}
                >
                  {f.tagline}
                </p>

                {/* Descrição */}
                <p
                  className="text-sm leading-relaxed flex-1 mb-8"
                  style={{ color: '#888888' }}
                >
                  {f.descricao}
                </p>

                {/* CTA */}
                <div
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 self-start"
                  style={{ background: '#FF6B00', color: '#080808' }}
                >
                  Abrir
                  <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <footer className="mt-20 md:mt-28 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="h-px flex-1 hidden md:block" style={{ background: '#1c1c1c' }} />
          <p
            className="text-xs tracking-[3px] uppercase px-6"
            style={{ color: '#2e2e2e', fontFamily: poppins.style.fontFamily }}
          >
            ORIUM™ · Uso Interno
          </p>
          <div className="h-px flex-1 hidden md:block" style={{ background: '#1c1c1c' }} />
        </footer>
      </div>
    </div>
  );
}
