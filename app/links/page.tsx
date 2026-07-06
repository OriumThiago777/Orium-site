'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AuthGate from '@/components/AuthGate';
import ToolBackground from '@/components/ToolBackground';
import { gruposDeLinks, type LinkItem } from '@/lib/links-data';

const TIPO_COLOR: Record<LinkItem['tipo'], string> = {
  interno: '#6B7280',
  cliente: '#3B82F6',
  externo: '#10B981',
};

const TIPO_LABEL: Record<LinkItem['tipo'], string> = {
  interno: 'INTERNO',
  cliente: 'CLIENTE',
  externo: 'EXTERNO',
};

const actionBtnStyle: React.CSSProperties = {
  border: '1px solid #1e1e1e',
  background: 'transparent',
  color: '#888',
  fontSize: '0.75rem',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  borderRadius: '8px',
  padding: '0.5rem 0.9rem',
  cursor: 'pointer',
  transition: 'all 0.15s',
  textDecoration: 'none',
  display: 'inline-block',
  fontFamily: 'Poppins, sans-serif',
  whiteSpace: 'nowrap',
};

function ActionButton({ children, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      {...props}
      style={actionBtnStyle}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B00'; e.currentTarget.style.color = '#FF6B00'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#888'; }}
    >
      {children}
    </button>
  );
}

function LinkCard({ item }: { item: LinkItem }) {
  const [copiado, setCopiado] = useState(false);
  const cor = TIPO_COLOR[item.tipo];

  function copiar() {
    const valor = item.externo ? item.href : `${window.location.origin}${item.href}`;
    navigator.clipboard.writeText(valor);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  }

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid #1e1e1e',
        borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <span
          style={{
            display: 'inline-block',
            color: cor,
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            border: `1px solid ${cor}`,
            borderRadius: '999px',
            padding: '0.15rem 0.6rem',
            marginBottom: '0.5rem',
          }}
        >
          {TIPO_LABEL[item.tipo]}
        </span>
        <p style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 500, margin: 0 }}>{item.label}</p>
        {item.descricao && (
          <p style={{ color: '#555', fontSize: '0.8rem', margin: '0.25rem 0 0', lineHeight: 1.5 }}>{item.descricao}</p>
        )}
        <p style={{ color: '#3a3a3a', fontSize: '0.72rem', margin: '0.25rem 0 0', wordBreak: 'break-all' }}>{item.href}</p>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
        <ActionButton onClick={copiar}>{copiado ? 'Copiado!' : 'Copiar link'}</ActionButton>
        {item.externo ? (
          <a href={item.href} target="_blank" rel="noopener noreferrer" style={actionBtnStyle}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B00'; e.currentTarget.style.color = '#FF6B00'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#888'; }}
          >
            Abrir
          </a>
        ) : (
          <Link href={item.href} style={actionBtnStyle}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B00'; e.currentTarget.style.color = '#FF6B00'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#888'; }}
          >
            Abrir
          </Link>
        )}
      </div>
    </div>
  );
}

function LinksContent() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflowY: 'auto', background: '#080808', fontFamily: 'Poppins, sans-serif' }}>
      <ToolBackground />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto', padding: '5rem 3rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '4rem' }}>
          <Image src="/lglaranja.png" alt="ORIUM" width={120} height={40} style={{ objectFit: 'contain', display: 'block', marginBottom: '4rem' }} />
          <p style={{ color: '#FF6B00', fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Índice Central
          </p>
          <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff', letterSpacing: '0.02em', lineHeight: 0.95, marginBottom: '1.25rem' }}>
            LINKS ORIUM
          </h1>
          <div style={{ width: '48px', height: '3px', background: '#FF6B00', marginBottom: '1.5rem' }} />
          <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: 1.75, maxWidth: '560px' }}>
            Todas as URLs internas e externas do ecossistema ORIUM, organizadas por categoria.
          </p>
        </div>

        {/* Grupos */}
        {gruposDeLinks.map(grupo => (
          <div key={grupo.id} style={{ marginBottom: '3rem' }}>
            <p
              style={{
                fontFamily: 'Anton, sans-serif',
                fontSize: '1.1rem',
                letterSpacing: '0.05em',
                color: grupo.cor || '#fff',
                marginBottom: '1rem',
                textTransform: 'uppercase',
              }}
            >
              {grupo.titulo}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {grupo.links.map(link => (
                <LinkCard key={link.href} item={link} />
              ))}
            </div>
          </div>
        ))}

        {/* Rodapé */}
        <div style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid #141414' }}>
          <a
            href="/hub"
            style={{ color: '#888888', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#888888'; }}
          >
            ← painel
          </a>
        </div>

      </div>
    </div>
  );
}

export default function LinksPage() {
  return (
    <AuthGate title="LINKS" subtitle="Índice central de URLs do ecossistema ORIUM.">
      <LinksContent />
    </AuthGate>
  );
}
