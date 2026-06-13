'use client';

import Image from 'next/image';
import { clearAuth } from '@/lib/auth';
import AuthGate from '@/components/AuthGate';
import ToolBackground from '@/components/ToolBackground';
import HubStatusPanel from '@/components/HubStatusPanel';

type Tier = 'large' | 'medium' | 'small';

type Ferramenta = {
  cls: string;
  tier: Tier;
  tag?: string;
  titulo: string;
  descricao?: string;
  href: string;
  icon: string;
  badge?: string;
};

// Mosaico — todos visíveis de uma vez (ordem = ordem de leitura editorial)
const GRID: Ferramenta[] = [
  { cls: 'clientes', tier: 'large', titulo: 'CLIENTES', descricao: 'Gestão de clientes, fases e atividades.', href: '/clientes', icon: 'icon-estrutura', badge: 'CRM' },
  { cls: 'proposta', tier: 'large', titulo: 'PROPOSTA', descricao: 'Propostas comerciais com PDF premium.', href: '/proposta', icon: 'icon-proposta' },
  { cls: 'raiox', tier: 'medium', titulo: 'RAIO-X', href: '/raio-x', icon: 'icon-analise' },
  { cls: 'briefing', tier: 'medium', titulo: 'BRIEFING', href: '/briefing', icon: 'icon-contato' },
  { cls: 'calendario', tier: 'medium', titulo: 'CALENDÁRIO', href: '/calendario', icon: 'icon-conteudo' },
  { cls: 'relatorio', tier: 'medium', titulo: 'RELATÓRIO', href: '/relatorio', icon: 'icon-crescimento' },
  { cls: 'contrato', tier: 'small', titulo: 'CONTRATO', href: '/contrato', icon: 'icon-estrategia' },
  { cls: 'checklist', tier: 'small', titulo: 'CHECKLIST', href: '/checklist', icon: 'icon-melhorias' },
];

// Linha auxiliar abaixo do grid principal
const SECUNDARIAS: Ferramenta[] = [
  { cls: 'docs', tier: 'small', titulo: 'MEUS DOCUMENTOS', href: '/meus-documentos', icon: 'icon-operacao' },
  { cls: 'biblioteca', tier: 'small', titulo: 'BIBLIOTECA', href: '/biblioteca', icon: 'icon-percepcao' },
  { cls: 'prospecto', tier: 'small', titulo: 'PROSPECTO', descricao: 'Briefing rápido para prospects.', href: '/prospecto', icon: 'icon-contato' },
];

const STYLES = `
  .hub-root {
    position: fixed;
    inset: 0;
    overflow: hidden;
    background: #080808;
    font-family: 'Poppins', sans-serif;
  }
  .hub-inner {
    position: relative;
    z-index: 1;
    height: 100%;
    max-width: 1480px;
    margin: 0 auto;
    padding: 1.5rem 2.5rem 1.75rem;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  /* Header compacto */
  .hub-header {
    flex-shrink: 0;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1.5rem;
    margin-bottom: 1.25rem;
  }
  .hub-eyebrow {
    color: #FF6B00;
    font-size: 0.66rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    margin: 0 0 0.45rem;
  }
  .hub-title {
    font-family: 'Anton', sans-serif;
    font-size: clamp(1.7rem, 3vw, 2.3rem);
    color: #fff;
    letter-spacing: 0.02em;
    line-height: 0.95;
    margin: 0;
  }
  .hub-header-right { display: flex; align-items: center; gap: 1.75rem; flex-shrink: 0; }
  .hub-sair {
    background: none; border: none; padding: 0;
    color: #2a2a2a; font-size: 0.72rem; letter-spacing: 0.2em;
    text-transform: uppercase; cursor: pointer; transition: color 0.2s;
    font-family: 'Poppins', sans-serif;
  }
  .hub-sair:hover { color: #FF6B00; }

  .hub-panel-wrap { flex-shrink: 0; }

  /* Mosaico — preenche o espaço restante do viewport */
  .hub-mosaic {
    display: grid;
    grid-template-columns: 2fr 2fr 1.5fr 1.5fr 1fr;
    grid-template-rows: repeat(2, 1fr);
    gap: 12px;
    flex: 1 1 auto;
    min-height: 280px;
  }

  .hub-cell {
    position: relative;
    background: #0a0a0a;
    border: 1px solid #1a1a1a;
    border-radius: 14px;
    cursor: pointer;
    transition: border-color 0.2s ease, background 0.2s ease;
    text-decoration: none;
    min-width: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 1rem;
    box-sizing: border-box;
  }
  .hub-cell:hover { border-color: #FF6B00; background: #0f0f0f; }

  /* Posicionamento no mosaico */
  .hub-cell--clientes   { grid-column: 1; grid-row: 1 / span 2; border-color: rgba(255,107,0,0.25); }
  .hub-cell--proposta   { grid-column: 2; grid-row: 1 / span 2; }
  .hub-cell--raiox      { grid-column: 3; grid-row: 1; }
  .hub-cell--briefing   { grid-column: 3; grid-row: 2; }
  .hub-cell--calendario { grid-column: 4; grid-row: 1; }
  .hub-cell--relatorio  { grid-column: 4; grid-row: 2; }
  .hub-cell--contrato   { grid-column: 5; grid-row: 1; }
  .hub-cell--checklist  { grid-column: 5; grid-row: 2; }

  /* Conteúdo por tier */
  .hub-ico { object-fit: contain; display: block; }
  .hub-cell--large .hub-ico  { width: 52px; height: 52px; }
  .hub-cell--medium .hub-ico { width: 36px; height: 36px; }
  .hub-cell--small .hub-ico  { width: 28px; height: 28px; }

  .hub-line { width: 24px; height: 2px; background: #FF6B00; margin-top: 0.75rem; }

  .hub-name {
    font-family: 'Anton', sans-serif;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    line-height: 1.1;
    margin-top: 0.75rem;
  }
  .hub-cell--large .hub-name  { font-size: 18px; }
  .hub-cell--medium .hub-name { font-size: 13px; }
  .hub-cell--small .hub-name  { font-size: 11px; }

  .hub-desc {
    font-family: 'Poppins', sans-serif;
    font-size: 12px;
    color: #555;
    line-height: 1.5;
    margin-top: 0.6rem;
    max-width: 82%;
  }

  .hub-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    font-family: 'Anton', sans-serif;
    font-size: 10px;
    letter-spacing: 0.15em;
    color: #FF6B00;
    border: 1px solid rgba(255,107,0,0.35);
    background: rgba(255,107,0,0.08);
    border-radius: 6px;
    padding: 3px 7px;
    line-height: 1;
  }

  /* Linha auxiliar */
  .hub-secondary { display: flex; gap: 12px; margin-top: 12px; flex-shrink: 0; }
  .hub-sec-item {
    flex: 1;
    min-height: 56px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.25rem;
    background: #0a0a0a;
    border: 1px solid #1a1a1a;
    border-radius: 12px;
    text-decoration: none;
    transition: border-color 0.2s ease, background 0.2s ease;
    box-sizing: border-box;
  }
  .hub-sec-item:hover { border-color: #FF6B00; background: #0f0f0f; }
  .hub-sec-ico { width: 20px; height: 20px; object-fit: contain; flex-shrink: 0; }
  .hub-sec-text { display: flex; flex-direction: column; gap: 0.3rem; min-width: 0; }
  .hub-sec-name {
    font-family: 'Anton', sans-serif;
    font-size: 11px;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .hub-sec-desc {
    font-family: 'Poppins', sans-serif;
    font-size: 11px;
    color: #555;
    line-height: 1.4;
  }

  /* ── Tablet (768–1024px): 3 colunas, scroll permitido ── */
  @media (max-width: 1024px) {
    .hub-root { overflow-y: auto; }
    .hub-inner { height: auto; min-height: 100%; padding: 2rem; }
    .hub-mosaic {
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: none;
      grid-auto-rows: minmax(150px, auto);
      flex: none;
      min-height: 0;
    }
    .hub-cell--clientes, .hub-cell--proposta, .hub-cell--raiox, .hub-cell--briefing,
    .hub-cell--calendario, .hub-cell--relatorio, .hub-cell--contrato, .hub-cell--checklist {
      grid-column: auto;
      grid-row: auto;
    }
    .hub-cell--medium .hub-name, .hub-cell--small .hub-name { font-size: 14px; }
    .hub-cell--medium .hub-ico, .hub-cell--small .hub-ico { width: 40px; height: 40px; }
  }

  /* ── Mobile (<768px): 2 colunas, scroll permitido ── */
  @media (max-width: 767px) {
    .hub-inner { padding: 1.5rem 1.25rem; }
    .hub-mosaic { grid-template-columns: repeat(2, 1fr); }
    .hub-secondary { flex-direction: column; }
  }
`;

function HubContent() {
  return (
    <div className="hub-root">
      <style>{STYLES}</style>
      <ToolBackground position="absolute" />

      <div className="hub-inner">

        {/* Header */}
        <header className="hub-header">
          <div>
            <p className="hub-eyebrow">Ferramentas Internas</p>
            <h1 className="hub-title">HUB ORIUM</h1>
          </div>
          <div className="hub-header-right">
            <Image src="/lglaranja.png" alt="ORIUM" width={104} height={32} style={{ objectFit: 'contain' }} />
            <button className="hub-sair" onClick={() => { clearAuth(); window.location.reload(); }}>
              ← sair
            </button>
          </div>
        </header>

        {/* Painel operacional — intocado */}
        <div className="hub-panel-wrap">
          <HubStatusPanel />
        </div>

        {/* Mosaico de ferramentas */}
        <div className="hub-mosaic">
          {GRID.map(f => (
            <a key={f.href} href={f.href} className={`hub-cell hub-cell--${f.tier} hub-cell--${f.cls}`}>
              {f.badge && <span className="hub-badge">{f.badge}</span>}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="hub-ico" src={`/icons/${f.icon}.svg`} alt="" />
              {f.tier === 'large' && <span className="hub-line" />}
              <span className="hub-name">{f.titulo}</span>
              {f.tier === 'large' && f.descricao && <span className="hub-desc">{f.descricao}</span>}
            </a>
          ))}
        </div>

        {/* Ferramentas restantes */}
        <div className="hub-secondary">
          {SECUNDARIAS.map(f => (
            <a key={f.href} href={f.href} className="hub-sec-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="hub-sec-ico" src={`/icons/${f.icon}.svg`} alt="" />
              <span className="hub-sec-text">
                <span className="hub-sec-name">{f.titulo}</span>
                {f.descricao && <span className="hub-sec-desc">{f.descricao}</span>}
              </span>
            </a>
          ))}
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
