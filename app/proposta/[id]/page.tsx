'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { TODOS_SERVICOS } from '@/lib/servicos-proposta';

interface Fase {
  nome: string;
  subtitulo: string;
  descricao: string;
  servicosSelecionados: string[];
  objetivo: string;
  valor: string;
  prazo: string;
}

interface ProximoPasso {
  titulo: string;
  descricao: string;
}

interface PropostaDados {
  nomeCliente: string;
  segmento: string;
  dataProposta: string;
  validadeProposta: string;
  fases: Fase[];
  proximosPassos: ProximoPasso[];
  contato: {
    responsavel: string;
    whatsapp: string;
    email: string;
    instagram: string;
  };
  condicoesPagamento: string;
}

const WHATSAPP_NUMERO = '5531991207009';
const MENSAGEM_WHATSAPP = 'Olá! Analisei a proposta da ORIUM e tenho interesse em avançar.';

function formatarValor(valor: string): string {
  const v = (valor || '').trim();
  return v || 'A DEFINIR';
}

function formatarData(data: string): string {
  if (!data) return '';
  try {
    return new Date(data + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch {
    return data;
  }
}

export default function PropostaPublicaPage() {
  const params = useParams();
  const id = params.id as string;

  const [dados, setDados] = useState<PropostaDados | null>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'erro'>('loading');

  useEffect(() => {
    fetch(`/api/proposta/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then(data => {
        if (!data.dados) throw new Error('empty');
        setDados(data.dados);
        setStatus('ok');
      })
      .catch(() => setStatus('erro'));
  }, [id]);

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins, sans-serif', color: '#666' }}>
        Carregando proposta...
      </div>
    );
  }

  if (status === 'erro' || !dados) {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.75rem', fontFamily: 'Poppins, sans-serif', color: '#666', textAlign: 'center', padding: '2rem' }}>
        <p style={{ fontFamily: 'Anton, sans-serif', color: '#fff', fontSize: '1.5rem', letterSpacing: '0.05em' }}>PROPOSTA NÃO ENCONTRADA</p>
        <p>O link pode estar incorreto ou a proposta foi removida.</p>
      </div>
    );
  }

  const dataGeracao = formatarData(dados.dataProposta);
  const validadeDias = dados.validadeProposta?.trim() || '7 dias';
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(MENSAGEM_WHATSAPP)}`;

  return (
    <div style={{ minHeight: '100vh', background: '#080808', position: 'relative', fontFamily: 'Poppins, sans-serif', color: '#fff', overflowX: 'hidden' }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Poppins:wght@400;500;600;700&display=swap" />

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Image src="/hero.jpg" alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.05 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 0%, rgba(255,107,0,0.06) 0%, transparent 60%)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', padding: '4rem 1.5rem 2rem' }}>

        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Image src="/lgbranca.png" alt="ORIUM" width={140} height={44} style={{ objectFit: 'contain', margin: '0 auto 1.5rem' }} />
          <div style={{ width: '60px', height: '2px', background: '#FF6B00', margin: '0 auto 1.5rem' }} />
          <h1 style={{ fontFamily: 'Anton, sans-serif', textTransform: 'uppercase', fontSize: 'clamp(2rem, 6vw, 3.5rem)', letterSpacing: '0.06em', lineHeight: 1, margin: 0 }}>
            Proposta Comercial
          </h1>
          {dados.nomeCliente && (
            <p style={{ fontFamily: 'Poppins, sans-serif', color: '#999', fontSize: '1.1rem', marginTop: '0.75rem' }}>
              {dados.nomeCliente}
            </p>
          )}
        </header>

        {/* Introdução */}
        <section style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
          <p style={{ color: '#999', fontSize: '1rem', lineHeight: 1.8, maxWidth: '620px', margin: '0 auto 1rem' }}>
            A ORIUM é uma empresa de estruturação digital. Organizamos a presença da sua marca com
            clareza, posicionamento e consistência — para que ela seja percebida com a autoridade que merece.
          </p>
          {dataGeracao && (
            <p style={{ color: '#555', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Proposta gerada em {dataGeracao}
            </p>
          )}
        </section>

        {/* Fases */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3.5rem' }}>
          {dados.fases.map((fase, i) => {
            const servicos = fase.servicosSelecionados
              .map(sid => TODOS_SERVICOS.find(s => s.id === sid))
              .filter((s): s is { id: string; nome: string; descricao: string } => !!s);
            const nome = fase.nome.trim() || `Fase ${i + 1}`;

            return (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ fontFamily: 'Anton, sans-serif', color: '#FF6B00', fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1 }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div style={{ fontFamily: 'Anton, sans-serif', textTransform: 'uppercase', color: '#fff', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', letterSpacing: '0.04em', lineHeight: 1.1 }}>
                      {nome}
                    </div>
                    {fase.subtitulo.trim() && (
                      <p style={{ color: '#FF6B00', fontSize: '0.95rem', fontWeight: 600, marginTop: '0.5rem' }}>{fase.subtitulo.trim()}</p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Anton, sans-serif', color: '#FF6B00', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                      {formatarValor(fase.valor)}
                    </div>
                    {fase.prazo.trim() && (
                      <p style={{ color: '#777', fontSize: '0.85rem', marginTop: '0.25rem' }}>Prazo: {fase.prazo.trim()}</p>
                    )}
                  </div>
                </div>

                {fase.descricao.trim() && (
                  <p style={{ color: '#999', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                    {fase.descricao.trim()}
                  </p>
                )}

                {servicos.length > 0 && (
                  <div>
                    <p style={{ color: '#555', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                      Serviços incluídos
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {servicos.map(s => (
                        <div key={s.id} style={{ borderLeft: '2px solid #FF6B00', paddingLeft: '0.875rem' }}>
                          <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>{s.nome}</p>
                          <p style={{ color: '#666', fontSize: '0.8rem', lineHeight: 1.6, margin: '0.2rem 0 0' }}>{s.descricao}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* Próximos passos */}
        {dados.proximosPassos?.length > 0 && (
          <section style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: 'Anton, sans-serif', textTransform: 'uppercase', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', letterSpacing: '0.04em', marginBottom: '1.5rem' }}>
              Próximos <span style={{ color: '#FF6B00' }}>Passos</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {dados.proximosPassos.map((passo, i) => (
                <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1.25rem 1.5rem' }}>
                  <span style={{ fontFamily: 'Anton, sans-serif', color: '#FF6B00', fontSize: '1.5rem', lineHeight: 1, flexShrink: 0 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>{passo.titulo}</p>
                    {passo.descricao && <p style={{ color: '#777', fontSize: '0.85rem', lineHeight: 1.6, margin: '0.25rem 0 0' }}>{passo.descricao}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer CTA */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid #1a1a1a', textAlign: 'center', padding: '3.5rem 1.5rem' }}>
        <h2 style={{ fontFamily: 'Anton, sans-serif', textTransform: 'uppercase', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', letterSpacing: '0.04em', marginBottom: '1.75rem' }}>
          Pronto para estruturar sua presença digital?
        </h2>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', background: '#FF6B00', borderRadius: '8px', padding: '1rem 2.5rem', color: '#fff', fontFamily: 'Anton, sans-serif', fontSize: '0.95rem', letterSpacing: '0.12em', textDecoration: 'none', boxShadow: '0 4px 20px rgba(255,107,0,0.25)' }}
        >
          QUERO AVANÇAR
        </a>
        <p style={{ color: '#444', fontSize: '0.75rem', letterSpacing: '0.05em', marginTop: '1.75rem' }}>
          Proposta válida por {validadeDias} a partir de {dataGeracao}
        </p>
      </footer>
    </div>
  );
}
