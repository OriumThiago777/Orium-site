'use client';

import { useState, useEffect } from 'react';
import NextImage from 'next/image';
import { isAuthenticated, saveAuth, authHeaders } from '@/lib/auth';

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
};

function fmtData(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function MeusDocumentosPage() {
  const [autenticado, setAutenticado] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [senha, setSenha] = useState('');
  const [erroSenha, setErroSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [docs, setDocs] = useState<Documento[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [filtro, setFiltro] = useState('Todos');
  const [excluindo, setExcluindo] = useState<string | null>(null);

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
      if (res.ok) { saveAuth(senha); setAutenticado(true); }
      else setErroSenha(true);
    } catch { setErroSenha(true); }
    finally { setCarregando(false); }
  }

  async function carregarDocs() {
    setLoadingDocs(true);
    try {
      const res = await fetch('/api/documentos', { headers: authHeaders() });
      if (res.ok) setDocs(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoadingDocs(false); }
  }

  useEffect(() => {
    setAutenticado(isAuthenticated());
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (autenticado) carregarDocs();
  }, [autenticado]);

  async function excluir(id: string) {
    if (!confirm('Excluir este documento? Esta ação não pode ser desfeita.')) return;
    setExcluindo(id);
    try {
      await fetch(`/api/documentos?id=${id}`, { method: 'DELETE', headers: authHeaders() });
      setDocs(prev => prev.filter(d => d.id !== id));
    } catch (e) { console.error(e); }
    finally { setExcluindo(null); }
  }

  const FP = 'Poppins, sans-serif';
  const FA = 'Anton, sans-serif';

  if (!authChecked) return null;
  if (!autenticado) {
    return (
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FP }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(255,107,0,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px', padding: '0 2rem' }}>
          <div style={{ marginBottom: '3rem' }}>
            <NextImage src="/lglaranja.png" alt="ORIUM" width={120} height={40} style={{ objectFit: 'contain' }} />
          </div>
          <p style={{ color: '#FF6B00', fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>ACESSO INTERNO</p>
          <h1 style={{ fontFamily: FA, fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff', letterSpacing: '0.02em', lineHeight: 0.95, marginBottom: '1.75rem' }}>DOCUMENTOS</h1>
          <p style={{ color: '#777', fontSize: '1rem', lineHeight: 1.75, marginBottom: '3rem' }}>Acesse os documentos gerados pela equipe.</p>
          <form onSubmit={handleSenha} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              type="password"
              placeholder="Senha de acesso"
              value={senha}
              onChange={e => { setSenha(e.target.value); setErroSenha(false); }}
              autoFocus
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${erroSenha ? '#ef4444' : '#1e1e1e'}`, borderRadius: '10px', padding: '1rem 1.25rem', color: '#fff', fontSize: '0.95rem', fontFamily: FP, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              onFocus={e => { if (!erroSenha) e.target.style.borderColor = '#FF6B00'; }}
              onBlur={e => { if (!erroSenha) e.target.style.borderColor = '#1e1e1e'; }}
            />
            {erroSenha && <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>Senha incorreta. Tente novamente.</p>}
            <button
              type="submit"
              disabled={carregando || !senha}
              style={{ width: '100%', background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '1rem', color: '#000', fontFamily: FA, fontSize: '1rem', letterSpacing: '0.15em', cursor: carregando || !senha ? 'not-allowed' : 'pointer', boxShadow: '0 4px 20px rgba(255,107,0,0.2)', opacity: carregando || !senha ? 0.5 : 1, transition: 'all 0.2s' }}
            >
              {carregando ? '...' : 'ACESSAR'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tiposFiltro = ['Todos', 'Raio-X', 'Proposta', 'Contrato'];
  const docsFiltrados = filtro === 'Todos' ? docs : docs.filter(d => d.tipo === filtro);

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#080808', fontFamily: FP, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 20% 50%, rgba(255,107,0,0.05) 0%, transparent 60%)' }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <NextImage src="/hero.jpg" alt="" fill style={{ objectFit: 'cover', opacity: 0.07 }} priority />
      </div>

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
          <p style={{ color: '#777', fontSize: '0.9rem' }}>Carregando documentos...</p>
        ) : docsFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
            <p style={{ color: '#777', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Nenhum documento salvo ainda.</p>
            <a href="/hub" style={{ color: '#FF6B00', fontSize: '0.82rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}>← Ir ao painel</a>
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
    </div>
  );
}
