'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NextImage from 'next/image';
import { authHeaders } from '@/lib/auth';
import AuthGate from '@/components/AuthGate';
import ToolBackground from '@/components/ToolBackground';
import { duplicarDocumento, getToolKey } from '@/lib/duplicar-documento';

interface Documento {
  id: string;
  pageId: string;
  nome: string;
  tipo: string;
  cliente: string;
  dataGeracao: string;
  dataEdicao: string | null;
}

const TIPO_ROTA: Record<string, string> = {
  'Raio-X': '/raio-x',
  'Proposta': '/proposta',
  'Contrato': '/contrato',
};

const TIPO_COR: Record<string, string> = {
  'Raio-X': '#FF6B00',
  'Proposta': '#3b82f6',
  'Contrato': '#22c55e',
  'Relatório': '#a855f7',
  'Calendário': '#eab308',
  'Checklist': '#06b6d4',
};

function fmtData(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function MeusDocumentosContent() {
  const router = useRouter();
  const [docs, setDocs] = useState<Documento[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [erroDocs, setErroDocs] = useState(false);
  const [filtro, setFiltro] = useState('Todos');
  const [excluindo, setExcluindo] = useState<string | null>(null);
  const [duplicando, setDuplicando] = useState<string | null>(null);
  const [erroDuplicar, setErroDuplicar] = useState<string | null>(null);

  async function carregarDocs() {
    setLoadingDocs(true);
    setErroDocs(false);
    try {
      const res = await fetch('/api/documentos', { headers: authHeaders() });
      if (!res.ok) throw new Error('documentos indisponíveis');
      setDocs(await res.json());
    } catch (e) { console.error(e); setErroDocs(true); }
    finally { setLoadingDocs(false); }
  }

  useEffect(() => {
    carregarDocs();
  }, []);

  async function excluir(id: string) {
    if (!confirm('Excluir este documento? Esta ação não pode ser desfeita.')) return;
    setExcluindo(id);
    try {
      await fetch(`/api/documentos?id=${id}`, { method: 'DELETE', headers: authHeaders() });
      setDocs(prev => prev.filter(d => d.id !== id));
    } catch (e) { console.error(e); }
    finally { setExcluindo(null); }
  }

  async function duplicar(doc: Documento) {
    setErroDuplicar(null);
    setDuplicando(doc.id);
    try {
      const res = await fetch(`/api/documentos?id=${doc.id}`, { headers: authHeaders() });
      if (!res.ok) throw new Error('documento indisponível');
      const data = await res.json();
      if (!data.dados) throw new Error('sem dados');
      duplicarDocumento(doc.tipo, data.dados, doc.cliente, router);
    } catch (e) {
      console.error(e);
      setErroDuplicar('Não foi possível carregar o documento');
      setTimeout(() => setErroDuplicar(null), 4000);
    } finally {
      setDuplicando(null);
    }
  }

  const FP = 'Poppins, sans-serif';
  const FA = 'Anton, sans-serif';

  const tiposFiltro = ['Todos', 'Raio-X', 'Proposta', 'Contrato'];
  const docsFiltrados = filtro === 'Todos' ? docs : docs.filter(d => d.tipo === filtro);

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#080808', fontFamily: FP, display: 'flex', flexDirection: 'column' }}>
      <ToolBackground position="absolute" gradient="radial" />

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 1, padding: '2.5rem 4rem 2rem', borderBottom: '1px solid #141414', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
          <NextImage src="/lglaranja.png" alt="ORIUM" width={100} height={32} style={{ objectFit: 'contain' }} />
          <a href="/hub" style={{ color: '#777', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: FP, transition: 'color 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#777'; }}>
            ← PAINEL
          </a>
        </div>
        <h1 style={{ fontFamily: FA, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', letterSpacing: '0.06em', lineHeight: 1, marginBottom: '1.5rem' }}>BIBLIOTECA</h1>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {tiposFiltro.map(t => (
            <button
              key={t}
              onClick={() => setFiltro(t)}
              style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: `1px solid ${filtro === t ? '#FF6B00' : '#1e1e1e'}`, background: filtro === t ? 'rgba(255,107,0,0.12)' : 'rgba(255,255,255,0.03)', color: filtro === t ? '#FF6B00' : '#777', fontSize: '0.82rem', fontFamily: FP, cursor: 'pointer', transition: 'all 0.15s' }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, overflowY: 'auto', padding: '2rem 4rem' }}>
        {loadingDocs ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1.5rem', minHeight: '150px', animation: 'orium-skeleton 1.4s ease-in-out infinite' }}>
                <div style={{ height: '14px', background: '#1a1a1a', borderRadius: '4px', width: '60%', marginBottom: '0.75rem' }} />
                <div style={{ height: '10px', background: '#1a1a1a', borderRadius: '4px', width: '40%', marginBottom: '1.5rem' }} />
                <div style={{ height: '10px', background: '#1a1a1a', borderRadius: '4px', width: '70%' }} />
              </div>
            ))}
          </div>
        ) : erroDocs ? (
          <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
            <p style={{ color: '#777', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Não foi possível carregar — tente novamente</p>
            <button onClick={carregarDocs}
              style={{ background: 'transparent', border: '1px solid #FF6B00', borderRadius: '8px', padding: '0.625rem 1.25rem', color: '#FF6B00', fontFamily: FA, fontSize: '0.82rem', letterSpacing: '0.1em', cursor: 'pointer' }}>
              TENTAR NOVAMENTE
            </button>
          </div>
        ) : docsFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.35 }}>📄</div>
            <p style={{ color: '#777', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              {docs.length === 0
                ? 'Nenhum documento ainda — gere o primeiro no Raio-X'
                : `Nenhum documento do tipo ${filtro}.`}
            </p>
            {docs.length === 0 && (
              <a href="/raio-x" style={{ color: '#FF6B00', fontSize: '0.82rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}>Abrir Raio-X →</a>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {docsFiltrados.map(doc => (
              <div key={doc.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.nome || '—'}</p>
                    {doc.cliente && doc.cliente !== doc.nome && (
                      <p style={{ color: '#777', fontSize: '0.78rem' }}>{doc.cliente}</p>
                    )}
                  </div>
                  <span style={{ flexShrink: 0, background: `${TIPO_COR[doc.tipo] ?? '#777'}22`, border: `1px solid ${TIPO_COR[doc.tipo] ?? '#777'}55`, borderRadius: '6px', padding: '0.25rem 0.625rem', color: TIPO_COR[doc.tipo] ?? '#777', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                    {doc.tipo}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#777' }}>
                  <span>Gerado em {fmtData(doc.dataGeracao)}</span>
                  {doc.dataEdicao && (
                    <span style={{ color: '#555', display: 'block' }}>Editado em {fmtData(doc.dataEdicao)}</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <a
                    href={`${TIPO_ROTA[doc.tipo] ?? '/hub'}?doc=${doc.id}`}
                    style={{ flex: 1, textAlign: 'center', padding: '0.625rem', background: '#FF6B00', border: 'none', borderRadius: '8px', color: '#000', fontSize: '0.8rem', fontFamily: FA, letterSpacing: '0.1em', textDecoration: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#e55f00'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#FF6B00'; }}
                  >
                    EDITAR
                  </a>
                  {getToolKey(doc.tipo) && (
                    <button
                      onClick={() => duplicar(doc)}
                      disabled={duplicando === doc.id}
                      style={{ padding: '0.625rem 1rem', background: 'transparent', border: '1px solid #333', borderRadius: '8px', color: '#999', fontSize: '0.625rem', fontFamily: FA, letterSpacing: '0.1em', cursor: duplicando === doc.id ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: duplicando === doc.id ? 0.4 : 1 }}
                      onMouseEnter={e => { if (duplicando !== doc.id) e.currentTarget.style.borderColor = '#FF6B00'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; }}
                    >
                      {duplicando === doc.id ? '...' : 'DUPLICAR'}
                    </button>
                  )}
                  <button
                    onClick={() => excluir(doc.id)}
                    disabled={excluindo === doc.id}
                    style={{ padding: '0.625rem 1rem', background: 'transparent', border: '1px solid #1e1e1e', borderRadius: '8px', color: '#777', fontSize: '0.8rem', fontFamily: FP, cursor: excluindo === doc.id ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: excluindo === doc.id ? 0.4 : 1 }}
                    onMouseEnter={e => { if (excluindo !== doc.id) { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; } }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#777'; }}
                  >
                    {excluindo === doc.id ? '...' : 'Excluir'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ position: 'relative', zIndex: 1, padding: '1.25rem 4rem', borderTop: '1px solid #141414', flexShrink: 0, background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/hub" style={{ color: '#777', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#777'; }}>
          ← PAINEL
        </a>
        <p style={{ color: '#333', fontSize: '0.7rem', letterSpacing: '0.15em' }}>{docs.length} documento{docs.length !== 1 ? 's' : ''} salvos</p>
      </div>

      {erroDuplicar && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 200, background: '#1a1a1a', borderLeft: '3px solid #991111', borderRadius: '6px', padding: '0.75rem 1.25rem', color: '#fff', fontSize: '0.82rem', fontFamily: FP, boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
          ⚠️ {erroDuplicar}
        </div>
      )}
    </div>
  );
}

export default function MeusDocumentosPage() {
  return (
    <AuthGate title="DOCUMENTOS" subtitle="Acesse os documentos gerados pela equipe.">
      <MeusDocumentosContent />
    </AuthGate>
  );
}
