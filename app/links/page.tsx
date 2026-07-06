'use client';

import Image from 'next/image';
import AuthGate from '@/components/AuthGate';
import ToolBackground from '@/components/ToolBackground';
import LinksKanban from '@/components/LinksKanban';
import LinksStatsCard from '@/components/LinksStatsCard';
import { gruposDeLinks, type TipoLink } from '@/lib/links-data';

function calcularEstatisticas() {
  const totalLinks = gruposDeLinks.reduce((soma, grupo) => soma + grupo.links.length, 0);
  const totalGrupos = gruposDeLinks.length;

  const porTipo: Record<TipoLink, number> = { interno: 0, cliente: 0, externo: 0 };
  gruposDeLinks.forEach(grupo => {
    grupo.links.forEach(link => {
      porTipo[link.tipo] += 1;
    });
  });

  const grupoComMaisLinks = gruposDeLinks.reduce<{ titulo: string; quantidade: number } | null>((maior, grupo) => {
    if (!maior || grupo.links.length > maior.quantidade) {
      return { titulo: grupo.titulo, quantidade: grupo.links.length };
    }
    return maior;
  }, null);

  return { totalLinks, totalGrupos, porTipo, grupoComMaisLinks };
}

function LinksContent() {
  const { totalLinks, totalGrupos, porTipo, grupoComMaisLinks } = calcularEstatisticas();

  return (
    <div style={{ position: 'fixed', inset: 0, overflowY: 'auto', background: '#080808', fontFamily: 'Poppins, sans-serif' }}>
      <ToolBackground />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto', padding: '5rem 3rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
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

        <LinksStatsCard
          totalLinks={totalLinks}
          totalGrupos={totalGrupos}
          porTipo={porTipo}
          grupoComMaisLinks={grupoComMaisLinks}
        />

        <LinksKanban gruposDeLinks={gruposDeLinks} />

        {/* Rodapé */}
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #141414' }}>
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
