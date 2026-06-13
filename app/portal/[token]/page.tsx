'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

type Etapa = { nome: string; concluida: boolean; linkDrive: string | null };
type Documento = { tipo: string; nome: string; data: string; linkDrive: string };
type Entrega = { titulo: string; data: string; status: string; tipo: string };

type PortalDados = {
  cliente: { nome: string; faseAtual: string };
  progresso: { etapas: Etapa[]; total: number; concluidas: number; percentual: number };
  documentos: Documento[];
  proximasEntregas: Entrega[];
  atualizadoEm: string;
};

const WHATSAPP_NUMERO = '5531991207009';
const MENSAGEM_WHATSAPP = 'Olá! Estou acompanhando o progresso pelo portal e gostaria de falar com a ORIUM.';

function formatarData(data: string): string {
  if (!data) return '';
  try {
    return new Date(data + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return data;
  }
}

const sectionTitle = (text: string) => (
  <div style={{ marginBottom: '1.5rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
      <div style={{ width: '3px', height: '1.4rem', background: '#FF6B00', borderRadius: '2px', flexShrink: 0 }} />
      <h2 style={{ fontFamily: 'Anton, sans-serif', color: '#fff', fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>{text}</h2>
    </div>
    <div style={{ height: '1px', background: '#1a1a1a' }} />
  </div>
);

export default function PortalClientePage() {
  const params = useParams();
  const token = params.token as string;

  const [dados, setDados] = useState<PortalDados | null>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'erro'>('loading');

  useEffect(() => {
    fetch(`/api/portal/${token}`)
      .then(r => {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then(data => {
        if (!data.cliente) throw new Error('empty');
        setDados(data);
        setStatus('ok');
      })
      .catch(() => setStatus('erro'));
  }, [token]);

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins, sans-serif', color: '#666' }}>
        Carregando portal...
      </div>
    );
  }

  if (status === 'erro' || !dados) {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.75rem', fontFamily: 'Poppins, sans-serif', color: '#666', textAlign: 'center', padding: '2rem' }}>
        <p style={{ fontFamily: 'Anton, sans-serif', color: '#fff', fontSize: '1.5rem', letterSpacing: '0.05em' }}>PORTAL NÃO ENCONTRADO</p>
        <p>O link pode estar incorreto ou expirado.</p>
      </div>
    );
  }

  const { cliente, progresso, documentos, proximasEntregas, atualizadoEm } = dados;
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(MENSAGEM_WHATSAPP)}`;
  const dataAtualizacao = new Date(atualizadoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const entregasOrdenadas = [...proximasEntregas].sort((a, b) => (a.data || '').localeCompare(b.data || ''));

  return (
    <div style={{ minHeight: '100vh', background: '#080808', position: 'relative', fontFamily: 'Poppins, sans-serif', color: '#fff', overflowX: 'hidden' }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Poppins:wght@400;500;600;700&display=swap" />

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Image src="/hero.jpg" alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.04 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 0%, rgba(255,107,0,0.06) 0%, transparent 60%)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', padding: '4rem 1.5rem 2rem' }}>

        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <Image src="/lgbranca.png" alt="ORIUM" width={140} height={44} style={{ objectFit: 'contain', margin: '0 auto 1.5rem' }} />
          <p style={{ fontFamily: 'Anton, sans-serif', textTransform: 'uppercase', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', letterSpacing: '0.08em', margin: 0 }}>
            PORTAL DO CLIENTE
          </p>
          {cliente.nome && (
            <p style={{ fontFamily: 'Poppins, sans-serif', color: '#999', fontSize: '1rem', marginTop: '0.5rem' }}>
              {cliente.nome}
            </p>
          )}
          <div style={{ width: '60px', height: '2px', background: '#FF6B00', margin: '1.5rem auto 0' }} />
        </header>

        {/* Seção 1 — Fase atual */}
        <section style={{ marginBottom: '3rem' }}>
          {sectionTitle('Fase atual')}
          <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '2rem' }}>
            <div style={{ display: 'inline-block', background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.35)', borderRadius: '6px', padding: '0.5rem 1.25rem', marginBottom: '1.25rem' }}>
              <span style={{ fontFamily: 'Anton, sans-serif', color: '#FF6B00', fontSize: '0.95rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {cliente.faseAtual || 'EM ANDAMENTO'}
              </span>
            </div>
            <div style={{ height: '8px', background: '#1a1a1a', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.75rem' }}>
              <div style={{ height: '100%', width: `${progresso.percentual}%`, background: '#FF6B00', borderRadius: '4px', transition: 'width 0.5s ease' }} />
            </div>
            <p style={{ color: '#777', fontSize: '0.85rem', margin: 0 }}>
              Etapa {progresso.concluidas} de {progresso.total} concluída{progresso.concluidas === 1 ? '' : 's'} ({progresso.percentual}%)
            </p>
          </div>
        </section>

        {/* Seção 2 — Documentos entregues */}
        <section style={{ marginBottom: '3rem' }}>
          {sectionTitle('Documentos entregues')}
          {documentos.length === 0 ? (
            <p style={{ color: '#555', fontSize: '0.9rem' }}>Nenhum documento gerado ainda.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {documentos.map((doc, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1rem 1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '50%', background: doc.linkDrive ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)', color: doc.linkDrive ? '#22c55e' : '#444', fontSize: '0.8rem', flexShrink: 0 }}>
                      {doc.linkDrive ? '✓' : '—'}
                    </span>
                    <div>
                      <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>{doc.tipo}</p>
                      <p style={{ color: '#777', fontSize: '0.8rem', margin: '0.15rem 0 0' }}>{doc.nome}{doc.data ? ` · ${formatarData(doc.data.slice(0, 10))}` : ''}</p>
                    </div>
                  </div>
                  {doc.linkDrive && (
                    <a href={doc.linkDrive} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#FF6B00', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', flexShrink: 0 }}>
                      VER ARQUIVO →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Seção 3 — Próximas entregas */}
        <section style={{ marginBottom: '3rem' }}>
          {sectionTitle('Próximas entregas')}
          {entregasOrdenadas.length === 0 ? (
            <p style={{ color: '#555', fontSize: '0.9rem' }}>Nenhuma entrega programada.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
              {entregasOrdenadas.map((item, i) => (
                <div key={i} style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1.25rem' }}>
                  <p style={{ color: '#FF6B00', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{item.tipo || 'ENTREGA'}</p>
                  <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', margin: '0 0 0.5rem' }}>{item.titulo || 'Sem título'}</p>
                  <p style={{ color: '#777', fontSize: '0.8rem', margin: 0 }}>{formatarData(item.data)}</p>
                  {item.status && (
                    <p style={{ color: '#555', fontSize: '0.75rem', marginTop: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{item.status}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Seção 4 — Mensagem da ORIUM */}
        <section style={{ marginBottom: '3rem' }}>
          {sectionTitle('Mensagem da ORIUM')}
          <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#999', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              Estamos trabalhando para estruturar sua presença digital com método e precisão. Qualquer dúvida, entre em contato.
            </p>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', background: '#FF6B00', borderRadius: '8px', padding: '0.875rem 2.25rem', color: '#fff', fontFamily: 'Anton, sans-serif', fontSize: '0.85rem', letterSpacing: '0.12em', textDecoration: 'none', boxShadow: '0 4px 20px rgba(255,107,0,0.25)' }}>
              FALAR COM A ORIUM
            </a>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid #1a1a1a', textAlign: 'center', padding: '2rem 1.5rem' }}>
        <p style={{ color: '#444', fontSize: '0.75rem', letterSpacing: '0.05em', margin: 0 }}>
          Portal exclusivo ORIUM™ para {cliente.nome}
        </p>
        <p style={{ color: '#333', fontSize: '0.7rem', marginTop: '0.4rem' }}>
          Última atualização: {dataAtualizacao}
        </p>
      </footer>
    </div>
  );
}
