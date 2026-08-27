'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { Cormorant_Garamond, Inter } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const serifFont = cormorant.style.fontFamily;
const sansFont = inter.style.fontFamily;

const AUTH_KEY = 'colacao_checklist_auth';
const AUTH_DURATION = 8 * 60 * 60 * 1000;

function isChecklistAuthenticated(): boolean {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data.authenticated) return false;
    if (Date.now() - data.timestamp > AUTH_DURATION) {
      localStorage.removeItem(AUTH_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function saveChecklistAuth() {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ authenticated: true, timestamp: Date.now() }));
}

type ChecklistItem = {
  pageId: string | null;
  nomeCompleto: string;
  chamarDe: string;
  whatsapp: string;
  instagram: string;
  horarioChegada: string;
  acompanhantes: string;
  fotoGarantida: string;
  fotosFormandos: string[];
  autorizacao: 'Sim' | 'Não' | '';
  fotoUrl: string | null;
  fotografado: boolean;
  status: 'ok' | 'sem_resposta';
};

const underlineInputStyle: CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid #cfcfc9',
  borderRadius: 0,
  padding: '0.55rem 0.1rem',
  fontFamily: sansFont,
  fontSize: '0.95rem',
  color: '#111',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  const primeiras = partes.slice(0, 2).map(p => p[0]?.toUpperCase() ?? '');
  return primeiras.join('');
}

function whatsappHref(numero: string): string {
  const digitos = numero.replace(/\D/g, '');
  return `https://wa.me/${digitos}`;
}

function AuthScreen({ onAuth }: { onAuth: () => void }) {
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro(false);
    try {
      const res = await fetch('/api/colacao/checklist/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha }),
      });
      if (res.ok) {
        saveChecklistAuth();
        onAuth();
      } else {
        setErro(true);
      }
    } catch {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fafaf9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1.25rem, 5vw, 3rem) 1rem',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          background: '#fff',
          border: '1px solid #000',
          padding: 'clamp(2.25rem, 6vw, 3rem) clamp(1.5rem, 6vw, 2.5rem)',
          boxSizing: 'border-box',
        }}
      >
        <p style={{ fontFamily: serifFont, fontStyle: 'italic', fontWeight: 500, fontSize: '26px', color: '#111', textAlign: 'center', margin: '0 0 0.5rem' }}>
          Checklist
        </p>
        <p style={{ fontFamily: sansFont, fontSize: '0.85rem', color: '#777', textAlign: 'center', margin: '0 0 2rem' }}>
          Acesso restrito — colação de grau.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Senha"
            autoFocus
            value={senha}
            onChange={e => { setSenha(e.target.value); setErro(false); }}
            style={{ ...underlineInputStyle, textAlign: 'center', marginBottom: '1.25rem' }}
          />
          {erro && (
            <p style={{ fontFamily: sansFont, fontSize: '0.8rem', color: '#b00020', textAlign: 'center', margin: '0 0 1rem' }}>
              Senha incorreta.
            </p>
          )}
          <button
            type="submit"
            disabled={carregando || !senha}
            style={{
              width: '100%',
              padding: '0.85rem',
              background: '#000',
              color: '#fff',
              border: 'none',
              fontFamily: sansFont,
              fontSize: '0.82rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              cursor: carregando || !senha ? 'not-allowed' : 'pointer',
              opacity: carregando || !senha ? 0.5 : 1,
            }}
          >
            {carregando ? '...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Avatar({ item }: { item: ChecklistItem }) {
  const base: CSSProperties = {
    width: '56px',
    height: '56px',
    minWidth: '56px',
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #000',
  };
  if (item.fotoUrl) {
    return (
      <div style={base}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.fotoUrl} alt={item.nomeCompleto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }
  return (
    <div style={{ ...base, background: '#e6e6e0' }}>
      <span style={{ fontFamily: sansFont, fontWeight: 600, fontSize: '1rem', color: '#111' }}>{iniciais(item.nomeCompleto)}</span>
    </div>
  );
}

function AutorizacaoBadge({ valor }: { valor: 'Sim' | 'Não' | '' }) {
  if (!valor) return null;
  const ok = valor === 'Sim';
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: sansFont,
        fontSize: '0.68rem',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        padding: '0.2rem 0.55rem',
        borderRadius: '999px',
        color: '#fff',
        background: ok ? '#2f7d4f' : '#b00020',
      }}
    >
      {ok ? 'Autorizado' : 'Sem autorização'}
    </span>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: sansFont,
        fontSize: '0.75rem',
        color: '#333',
        background: '#f2f2ec',
        border: '1px solid #e0e0d8',
        borderRadius: '999px',
        padding: '0.2rem 0.65rem',
        marginRight: '0.4rem',
        marginBottom: '0.4rem',
      }}
    >
      {children}
    </span>
  );
}

function Card({
  item,
  onToggle,
}: {
  item: ChecklistItem;
  onToggle: (item: ChecklistItem) => void;
}) {
  const semResposta = item.status === 'sem_resposta';

  return (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        background: '#fff',
        border: '1px solid #000',
        padding: '1.1rem 1.25rem',
        marginBottom: '0.9rem',
        opacity: semResposta ? 0.55 : item.fotografado ? 0.6 : 1,
        transition: 'opacity 0.15s',
      }}
    >
      <Avatar item={item} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
          <p
            style={{
              fontFamily: serifFont,
              fontWeight: 600,
              fontSize: '1.15rem',
              color: '#111',
              margin: 0,
              textDecoration: item.fotografado && !semResposta ? 'line-through' : 'none',
            }}
          >
            {item.nomeCompleto}
            {item.chamarDe && item.chamarDe !== item.nomeCompleto && (
              <span style={{ fontFamily: sansFont, fontWeight: 400, fontSize: '0.85rem', color: '#777' }}> ({item.chamarDe})</span>
            )}
          </p>
          {!semResposta && item.horarioChegada && (
            <span style={{ fontFamily: sansFont, fontWeight: 600, fontSize: '0.95rem', color: '#111' }}>
              {item.horarioChegada}
            </span>
          )}
        </div>

        {semResposta ? (
          <p style={{ fontFamily: sansFont, fontStyle: 'italic', fontSize: '0.85rem', color: '#999', margin: '0.5rem 0 0' }}>
            Ainda não respondeu
          </p>
        ) : (
          <>
            <div style={{ margin: '0.45rem 0 0.6rem' }}>
              <AutorizacaoBadge valor={item.autorizacao} />
            </div>

            {item.fotoGarantida && (
              <p style={{ fontFamily: sansFont, fontSize: '0.85rem', color: '#111', margin: '0 0 0.5rem' }}>
                <strong>Foto garantida:</strong> {item.fotoGarantida}
              </p>
            )}

            {item.fotosFormandos.length > 0 && (
              <div style={{ margin: '0 0 0.5rem' }}>
                <p style={{ fontFamily: sansFont, fontSize: '0.75rem', color: '#777', margin: '0 0 0.35rem' }}>Quer fotos com:</p>
                <div>
                  {item.fotosFormandos.map(nome => <Chip key={nome}>{nome}</Chip>)}
                </div>
              </div>
            )}

            {item.acompanhantes && (
              <p style={{ fontFamily: sansFont, fontSize: '0.78rem', color: '#888', margin: '0 0 0.5rem' }}>
                Acompanhantes: {item.acompanhantes}
              </p>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              {item.whatsapp ? (
                <a
                  href={whatsappHref(item.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: sansFont, fontSize: '0.78rem', color: '#111', textDecoration: 'underline' }}
                >
                  {item.whatsapp}
                </a>
              ) : <span />}

              <button
                type="button"
                onClick={() => onToggle(item)}
                disabled={!item.pageId}
                style={{
                  fontFamily: sansFont,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '0.55rem 1rem',
                  border: '1px solid #000',
                  background: item.fotografado ? '#000' : 'transparent',
                  color: item.fotografado ? '#fff' : '#000',
                  cursor: item.pageId ? 'pointer' : 'not-allowed',
                  opacity: item.pageId ? 1 : 0.4,
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                {item.fotografado ? '✓ Fotografado' : 'Marcar como fotografado'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ChecklistContent() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [filtro, setFiltro] = useState<'todos' | 'pendentes'>('todos');

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setLoading(true);
    setErro(false);
    try {
      const res = await fetch('/api/colacao/checklist');
      if (!res.ok) throw new Error('Falha ao carregar');
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      setErro(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(item: ChecklistItem) {
    if (!item.pageId) return;
    const novoValor = !item.fotografado;
    setItems(prev => prev.map(i => (i.pageId === item.pageId ? { ...i, fotografado: novoValor } : i)));
    try {
      const res = await fetch('/api/colacao/checklist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId: item.pageId, fotografado: novoValor }),
      });
      if (!res.ok) throw new Error('Falha ao atualizar');
    } catch {
      setItems(prev => prev.map(i => (i.pageId === item.pageId ? { ...i, fotografado: !novoValor } : i)));
    }
  }

  const itensVisiveis = filtro === 'pendentes' ? items.filter(i => !i.fotografado) : items;

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf9', padding: 'clamp(1.25rem, 5vw, 2.5rem) 1rem', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ fontFamily: serifFont, fontStyle: 'italic', fontWeight: 500, fontSize: '28px', color: '#111', margin: '0 0 0.4rem' }}>
            Checklist — Colação de Grau
          </p>
          <p style={{ fontFamily: sansFont, fontSize: '0.85rem', color: '#777', margin: 0 }}>
            {items.filter(i => i.fotografado).length} de {items.length} fotografados
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          {(['todos', 'pendentes'] as const).map(opt => {
            const ativo = filtro === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setFiltro(opt)}
                style={{
                  fontFamily: sansFont,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '0.5rem 1.1rem',
                  border: '1px solid #000',
                  background: ativo ? '#000' : 'transparent',
                  color: ativo ? '#fff' : '#000',
                  cursor: 'pointer',
                }}
              >
                {opt === 'todos' ? 'Mostrar todos' : 'Só pendentes'}
              </button>
            );
          })}
        </div>

        {loading && (
          <p style={{ fontFamily: sansFont, fontSize: '0.9rem', color: '#777', textAlign: 'center' }}>Carregando...</p>
        )}

        {erro && !loading && (
          <p style={{ fontFamily: sansFont, fontSize: '0.9rem', color: '#b00020', textAlign: 'center' }}>
            Não foi possível carregar os dados. <button type="button" onClick={carregar} style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontFamily: sansFont, color: '#b00020' }}>Tentar de novo</button>
          </p>
        )}

        {!loading && !erro && itensVisiveis.map(item => (
          <Card key={item.nomeCompleto} item={item} onToggle={handleToggle} />
        ))}
      </div>
    </div>
  );
}

export default function ChecklistPage() {
  const [autenticado, setAutenticado] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    setAutenticado(isChecklistAuthenticated());
    setAuthChecked(true);
  }, []);

  if (!authChecked) return null;
  if (!autenticado) return <AuthScreen onAuth={() => setAutenticado(true)} />;

  return <ChecklistContent />;
}
