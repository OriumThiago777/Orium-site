'use client';

import Image from 'next/image';
import { clearAuth } from '@/lib/auth';
import AuthGate from '@/components/AuthGate';
import ToolBackground from '@/components/ToolBackground';
import HubStatusPanel from '@/components/HubStatusPanel';

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
  {
    tag: 'ENTREGAS',
    titulo: 'CHECKLIST',
    descricao: 'Checklist de entregas por cliente e período.',
    href: '/checklist',
  },
  {
    tag: 'CRM',
    titulo: 'CLIENTES',
    descricao: 'Gestão de clientes, fases e atividades.',
    href: '/clientes',
  },
  {
    tag: 'DOCUMENTOS',
    titulo: 'BIBLIOTECA',
    descricao: 'Histórico de documentos gerados.',
    href: '/meus-documentos',
  },
  {
    tag: 'ACERVO',
    titulo: 'BIBLIOTECA DE ASSETS',
    descricao: 'Templates e criações organizados por segmento.',
    href: '/biblioteca',
  },
];

const EM_BREVE: { tag: string; titulo: string; descricao: string }[] = [];

function HubContent() {
  // ── Hub principal ─────────────────────────────────────────────────────────────
  return (
    <div className="hub-shell" style={{ position: 'fixed', inset: 0, background: '#080808', fontFamily: 'Poppins, sans-serif' }}>
      <style>{`
        .hub-shell { overflow-y: auto; }
        .hub-content { display: block; }
        .hub-logo-wrap { margin-bottom: 4rem; }
        .hub-tag { margin-bottom: 1rem; }
        .hub-title { margin-bottom: 0.75rem; }
        .hub-subtitle { margin-bottom: 4rem; }
        .hub-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        .hub-footer { margin-top: 5rem; padding-top: 2rem; }
        @media (min-width: 768px) {
          .hub-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1025px) {
          .hub-shell { overflow: hidden; }
          .hub-content { display: flex; flex-direction: column; height: 100%; padding: 0.4rem 3rem !important; }
          .hub-header { flex-shrink: 0; }
          .hub-logo-wrap { margin-bottom: 0.5rem; }
          .hub-tag { margin-bottom: 0.375rem; }
          .hub-title { margin-bottom: 0.25rem; }
          .hub-subtitle { margin-bottom: 0.5rem; }
          .hub-status-wrap { flex-shrink: 0; }
          .hub-status-wrap > div { margin-bottom: 0.25rem !important; }
          .hub-grid { flex: 1; min-height: 0; grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(2, minmax(0, 1fr)); gap: 0.5rem; }
          .hub-grid > a { min-height: 0; }
          .hub-footer { flex-shrink: 0; margin-top: 0.25rem; padding-top: 0.5rem; }
        }
      `}</style>
      <ToolBackground />
      <div className="hub-content" style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto', padding: '5rem 3rem', boxSizing: 'border-box', minHeight: '100%' }}>

        {/* Header */}
        <div className="hub-header">
          <Image src="/lglaranja.png" alt="ORIUM" width={120} height={40} className="hub-logo-wrap" style={{ objectFit: 'contain', display: 'block' }} />
          <p style={{ color: '#FF6B00', fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            FERRAMENTAS INTERNAS
          </p>
          <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff', letterSpacing: '0.02em', lineHeight: 0.95, marginBottom: '0.75rem' }}>
            HUB ORIUM
          </h1>
          <p className="hub-subtitle" style={{ color: '#555', fontSize: '0.95rem', lineHeight: 1.75 }}>
            Acesse, gerencie e execute. Tudo em um lugar.
          </p>
        </div>

        {/* Painel operacional */}
        <div className="hub-status-wrap">
          <HubStatusPanel />
        </div>

        {/* Grid de cards */}
        <div className="hub-grid">
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
        <div className="hub-footer" style={{ paddingTop: '2rem', borderTop: '1px solid #141414', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: '#1e1e1e', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>
            ORIUM™ — Ferramentas Internas
          </p>
          <button
            onClick={() => { clearAuth(); window.location.reload(); }}
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

export default function HubPage() {
  return (
    <AuthGate title="HUB ORIUM" subtitle="Central de ferramentas estratégicas.">
      <HubContent />
    </AuthGate>
  );
}
