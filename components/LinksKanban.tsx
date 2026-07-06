'use client';

import { useEffect, useState } from 'react';
import LinkCard from './LinkCard';
import type { GrupoLinks } from '@/lib/links-data';

const STORAGE_KEY = 'orium_links_kanban_collapsed';

export default function LinksKanban({ gruposDeLinks }: { gruposDeLinks: GrupoLinks[] }) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCollapsed(JSON.parse(raw));
    } catch {
      // localStorage indisponível ou valor corrompido — segue com tudo expandido
    }
  }, []);

  function toggle(id: string) {
    setCollapsed(atual => {
      const proximo = { ...atual, [id]: !atual[id] };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(proximo));
      }
      return proximo;
    });
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '1.25rem',
        overflowX: 'auto',
        alignItems: 'flex-start',
        paddingBottom: '1.5rem',
        scrollBehavior: 'smooth',
      }}
    >
      {gruposDeLinks.map(grupo => {
        const isCollapsed = !!collapsed[grupo.id];
        const cor = grupo.cor || '#333';

        return (
          <div
            key={grupo.id}
            style={{
              flexShrink: 0,
              flexGrow: 0,
              width: isCollapsed ? '48px' : '300px',
              minWidth: isCollapsed ? '48px' : '300px',
              maxWidth: isCollapsed ? '48px' : '300px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid #1e1e1e',
              borderLeft: `3px solid ${cor}`,
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            {isCollapsed ? (
              <button
                onClick={() => toggle(grupo.id)}
                aria-label={`Expandir ${grupo.titulo}`}
                style={{
                  width: '100%',
                  minHeight: '280px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 0',
                  color: '#888',
                  fontFamily: 'Poppins, sans-serif',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}
              >
                <span style={{ fontSize: '1rem' }}>→</span>
                <span
                  style={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    fontFamily: 'Anton, sans-serif',
                    fontSize: '0.85rem',
                    letterSpacing: '0.05em',
                    color: '#ccc',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {grupo.titulo}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#555' }}>{grupo.links.length}</span>
              </button>
            ) : (
              <div style={{ padding: '1.25rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    marginBottom: '1.1rem',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'Anton, sans-serif',
                      fontSize: '0.95rem',
                      letterSpacing: '0.03em',
                      color: '#fff',
                      textTransform: 'uppercase',
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {grupo.titulo}{' '}
                    <span style={{ color: '#555', fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '0.78rem', textTransform: 'none' }}>
                      ({grupo.links.length})
                    </span>
                  </p>
                  <button
                    onClick={() => toggle(grupo.id)}
                    aria-label={`Recolher ${grupo.titulo}`}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#888',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      padding: '0.1rem 0.3rem',
                      flexShrink: 0,
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}
                  >
                    ←
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {grupo.links.map(link => (
                    <LinkCard key={link.href} item={link} />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
