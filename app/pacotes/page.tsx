'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  PLANOS_MENSAIS,
  NOTA_PLANOS,
  ESTRUTURACAO_INICIAL,
  SITE_INSTITUCIONAL,
  ADDONS,
  type PlanoMensal,
  type ItemUnico,
  type AddOn,
} from './data';

const WHATSAPP_NUMERO = '5531991207009';

function formatBRL(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  });
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        color: '#555',
        fontSize: '0.72rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginBottom: '1.25rem',
      }}
    >
      {children}
    </p>
  );
}

function Switch({ checked }: { checked: boolean }) {
  return (
    <div
      style={{
        flexShrink: 0,
        width: '44px',
        height: '26px',
        borderRadius: '999px',
        background: checked ? '#FF6B00' : '#1e1e1e',
        position: 'relative',
        transition: 'background 0.2s',
        marginTop: '0.15rem',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '3px',
          left: checked ? '21px' : '3px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.2s',
        }}
      />
    </div>
  );
}

function ItemList({ incluso, naoIncluso = [] }: { incluso: string[]; naoIncluso?: string[] }) {
  if (incluso.length === 0 && naoIncluso.length === 0) return null;
  return (
    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: '1.25rem 0 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      {incluso.map(item => (
        <li
          key={item}
          style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'flex-start',
            color: '#ccc',
            fontSize: '0.85rem',
            lineHeight: 1.5,
          }}
        >
          <span style={{ color: '#FF6B00', flexShrink: 0 }}>✓</span>
          {item}
        </li>
      ))}
      {naoIncluso.map(item => (
        <li
          key={item}
          style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'flex-start',
            color: '#555',
            fontSize: '0.85rem',
            lineHeight: 1.5,
            opacity: 0.6,
            textDecoration: 'line-through',
          }}
        >
          <span style={{ flexShrink: 0 }}>–</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function PlanoCard({
  plano,
  selecionado,
  onToggle,
}: {
  plano: PlanoMensal;
  selecionado: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selecionado}
      onClick={onToggle}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      style={{
        position: 'relative',
        cursor: 'pointer',
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${selecionado ? '#FF6B00' : '#1a1a1a'}`,
        borderRadius: '16px',
        padding: '2rem',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: selecionado ? '0 8px 30px rgba(255,107,0,0.1)' : 'none',
      }}
    >
      {plano.recomendado && (
        <span
          style={{
            position: 'absolute',
            top: '-0.75rem',
            right: '1.5rem',
            background: '#FF6B00',
            color: '#000',
            fontFamily: 'Anton, sans-serif',
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            padding: '0.35rem 0.75rem',
            borderRadius: '999px',
          }}
        >
          RECOMENDADO
        </span>
      )}
      <h3
        style={{
          fontFamily: 'Anton, sans-serif',
          textTransform: 'uppercase',
          fontSize: '1.5rem',
          color: '#fff',
          margin: 0,
        }}
      >
        {plano.nome}
      </h3>
      <p style={{ fontFamily: 'Anton, sans-serif', color: '#FF6B00', fontSize: '2rem', margin: '0.75rem 0 0' }}>
        {formatBRL(plano.preco)}
        <span style={{ fontSize: '0.9rem', color: '#777' }}>/mês</span>
      </p>
      <p style={{ color: '#999', fontSize: '0.9rem', margin: '0.75rem 0 0', lineHeight: 1.6 }}>
        {plano.descricao}
      </p>
      <ItemList incluso={plano.incluso} naoIncluso={plano.naoIncluso} />
    </div>
  );
}

function ToggleCard({
  item,
  selecionado,
  onToggle,
}: {
  item: ItemUnico;
  selecionado: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selecionado}
      onClick={onToggle}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      style={{
        cursor: 'pointer',
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'flex-start',
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${selecionado ? '#FF6B00' : '#1a1a1a'}`,
        borderRadius: '16px',
        padding: '1.75rem 2rem',
        transition: 'border-color 0.2s',
      }}
    >
      <Switch checked={selecionado} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            alignItems: 'baseline',
          }}
        >
          <h3
            style={{
              fontFamily: 'Anton, sans-serif',
              textTransform: 'uppercase',
              fontSize: '1.25rem',
              color: '#fff',
              margin: 0,
            }}
          >
            {item.nome}
          </h3>
          <span style={{ fontFamily: 'Anton, sans-serif', color: '#FF6B00', fontSize: '1.35rem' }}>
            {formatBRL(item.preco)}
          </span>
        </div>
        {item.descricao && (
          <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
            {item.descricao}
          </p>
        )}
        <ItemList incluso={item.incluso} />
      </div>
    </div>
  );
}

function AddonRow({
  addon,
  selecionado,
  onToggle,
}: {
  addon: AddOn;
  selecionado: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selecionado}
      onClick={onToggle}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      style={{
        cursor: 'pointer',
        display: 'flex',
        gap: '1.25rem',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${selecionado ? '#FF6B00' : '#1a1a1a'}`,
        borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        transition: 'border-color 0.2s',
      }}
    >
      <input
        type="checkbox"
        checked={selecionado}
        readOnly
        style={{ width: '18px', height: '18px', accentColor: '#FF6B00', flexShrink: 0, pointerEvents: 'none' }}
      />
      <img
        src={`/icons/icon-${addon.icon}.svg`}
        alt=""
        style={{ width: '40px', height: '40px', objectFit: 'contain', flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>{addon.nome}</p>
        <p style={{ color: '#777', fontSize: '0.82rem', margin: '0.25rem 0 0', lineHeight: 1.5 }}>
          {addon.descricao}
        </p>
      </div>
      <span
        style={{
          fontFamily: 'Anton, sans-serif',
          color: '#FF6B00',
          fontSize: '1.1rem',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {formatBRL(addon.preco)}
        {addon.monthly && <span style={{ fontSize: '0.7rem', color: '#777' }}>/mês</span>}
      </span>
    </div>
  );
}

function TotalDisplay({ label, valor, sufixo }: { label: string; valor: number; sufixo?: string }) {
  return (
    <div>
      <p style={{ color: '#777', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
        {label}
      </p>
      <p style={{ fontFamily: 'Anton, sans-serif', color: '#fff', fontSize: '1.35rem', margin: '0.15rem 0 0' }}>
        {formatBRL(valor)}
        {sufixo && <span style={{ fontSize: '0.85rem', color: '#999' }}>{sufixo}</span>}
      </p>
    </div>
  );
}

export default function PacotesPage() {
  const [planoId, setPlanoId] = useState<string | null>(null);
  const [estruturacaoSelecionada, setEstruturacaoSelecionada] = useState(false);
  const [siteSelecionado, setSiteSelecionado] = useState(false);
  const [addonsSelecionados, setAddonsSelecionados] = useState<Set<string>>(new Set());

  function toggleAddon(id: string) {
    setAddonsSelecionados(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const plano = PLANOS_MENSAIS.find(p => p.id === planoId) ?? null;
  const addonsAtivos = ADDONS.filter(a => addonsSelecionados.has(a.id));
  const addonsUnicos = addonsAtivos.filter(a => !a.monthly);
  const addonsMensais = addonsAtivos.filter(a => a.monthly);

  const totalUnico =
    (estruturacaoSelecionada ? ESTRUTURACAO_INICIAL.preco : 0) +
    (siteSelecionado ? SITE_INSTITUCIONAL.preco : 0) +
    addonsUnicos.reduce((soma, a) => soma + a.preco, 0);

  const totalMensal = (plano?.preco ?? 0) + addonsMensais.reduce((soma, a) => soma + a.preco, 0);

  const semSelecao = !plano && !estruturacaoSelecionada && !siteSelecionado && addonsSelecionados.size === 0;

  function montarMensagem(): string {
    const linhas: string[] = ['Olá! Vi a proposta da ORIUM e gostaria de avançar com:'];

    if (plano) linhas.push(`- ${plano.nome} (${formatBRL(plano.preco)}/mês)`);
    if (estruturacaoSelecionada) {
      linhas.push(`- ${ESTRUTURACAO_INICIAL.nome} (${formatBRL(ESTRUTURACAO_INICIAL.preco)})`);
    }
    if (siteSelecionado) {
      linhas.push(`- ${SITE_INSTITUCIONAL.nome} (${formatBRL(SITE_INSTITUCIONAL.preco)})`);
    }
    addonsAtivos.forEach(a => {
      linhas.push(`- ${a.nome} (${formatBRL(a.preco)}${a.monthly ? '/mês' : ''})`);
    });

    linhas.push('');
    linhas.push(`Investimento único: ${formatBRL(totalUnico)}`);
    if (totalMensal > 0) linhas.push(`Investimento mensal: ${formatBRL(totalMensal)}`);
    linhas.push('');
    linhas.push('Podemos conversar?');

    return linhas.join('\n');
  }

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(montarMensagem())}`;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#080808',
        position: 'relative',
        fontFamily: 'Poppins, sans-serif',
        color: '#fff',
        overflowX: 'hidden',
        paddingBottom: '7rem',
      }}
    >
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Poppins:wght@400;500;600;700&display=swap" />

      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Image src="/hero.jpg" alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.05 }} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 20% 0%, rgba(255,107,0,0.06) 0%, transparent 60%)',
          }}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', padding: '4rem 1.5rem 2rem' }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Image
            src="/lgbranca.png"
            alt="ORIUM"
            width={140}
            height={44}
            style={{ objectFit: 'contain', margin: '0 auto 1.25rem' }}
          />
          <p style={{ color: '#FF6B00', fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            ESTRUTURA · PERCEPÇÃO · RESULTADOS
          </p>
        </header>

        <section style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h1
            style={{
              fontFamily: 'Anton, sans-serif',
              textTransform: 'uppercase',
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              letterSpacing: '0.04em',
              lineHeight: 1,
              margin: 0,
            }}
          >
            Pacotes de <span style={{ color: '#FF6B00' }}>Serviço</span>
          </h1>
          <p style={{ color: '#999', fontSize: '1rem', marginTop: '1rem' }}>
            Escolha o nível de presença certo para agora.
          </p>
        </section>

        <section style={{ marginBottom: '3.5rem' }}>
          <SectionLabel>Planos de continuidade mensal</SectionLabel>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {PLANOS_MENSAIS.map(p => (
              <PlanoCard
                key={p.id}
                plano={p}
                selecionado={planoId === p.id}
                onToggle={() => setPlanoId(prev => (prev === p.id ? null : p.id))}
              />
            ))}
          </div>
          <p style={{ color: '#555', fontSize: '0.78rem', marginTop: '1.25rem', lineHeight: 1.6 }}>
            {NOTA_PLANOS}
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <SectionLabel>Estruturação inicial</SectionLabel>
          <ToggleCard
            item={ESTRUTURACAO_INICIAL}
            selecionado={estruturacaoSelecionada}
            onToggle={() => setEstruturacaoSelecionada(v => !v)}
          />
        </section>

        <section style={{ marginBottom: '3.5rem' }}>
          <SectionLabel>Site institucional</SectionLabel>
          <ToggleCard
            item={SITE_INSTITUCIONAL}
            selecionado={siteSelecionado}
            onToggle={() => setSiteSelecionado(v => !v)}
          />
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <SectionLabel>Evolução da plataforma digital</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {ADDONS.map(a => (
              <AddonRow
                key={a.id}
                addon={a}
                selecionado={addonsSelecionados.has(a.id)}
                onToggle={() => toggleAddon(a.id)}
              />
            ))}
          </div>
        </section>
      </div>

      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          background: 'rgba(8,8,8,0.92)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid #1e1e1e',
          padding: '1rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <TotalDisplay label="Investimento único" valor={totalUnico} />
            {totalMensal > 0 && (
              <TotalDisplay label="Investimento mensal" valor={totalMensal} sufixo="/mês" />
            )}
          </div>
          <a
            href={semSelecao ? undefined : whatsappHref}
            target={semSelecao ? undefined : '_blank'}
            rel="noopener noreferrer"
            aria-disabled={semSelecao}
            onClick={e => {
              if (semSelecao) e.preventDefault();
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: semSelecao ? '#3a2410' : '#FF6B00',
              color: semSelecao ? '#775c3c' : '#fff',
              fontFamily: 'Anton, sans-serif',
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              padding: '0.9rem 2rem',
              borderRadius: '8px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              boxShadow: semSelecao ? 'none' : '0 4px 20px rgba(255,107,0,0.25)',
              cursor: semSelecao ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Enviar seleção via WhatsApp
          </a>
        </div>
      </div>

      <footer
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '3rem 1.5rem 9rem',
          borderTop: '1px solid #1a1a1a',
          marginTop: '1rem',
        }}
      >
        <p
          style={{
            fontFamily: 'Anton, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#666',
            fontSize: '0.95rem',
            margin: 0,
          }}
        >
          Estruturamos o que gera percepção, presença e resultado.
        </p>
      </footer>
    </div>
  );
}
