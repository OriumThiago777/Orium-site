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

type Checklist = {
  individual: boolean;
  grupo?: boolean;
  prioridade?: boolean;
  formandos: Record<string, boolean>;
};

type ChecklistPessoa = {
  pageId: string | null;
  nomeCompleto: string;
  chamarDe: string;
  horarioChegada: string;
  acompanhantes: string;
  fotoGarantida: string;
  autorizacao: 'Sim' | 'Não' | '';
  fotoUrl: string | null;
  fotografado: boolean;
  status: 'ok' | 'sem_resposta';
  checklist: Checklist | null;
};

type ItemView = {
  key: string;
  label: string;
  sub?: string;
  checked: boolean;
  destaque: boolean;
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

function computeCompleto(checklist: Checklist): boolean {
  if (!checklist.individual) return false;
  if (checklist.grupo !== undefined && !checklist.grupo) return false;
  if (checklist.prioridade !== undefined && !checklist.prioridade) return false;
  return Object.values(checklist.formandos).every(Boolean);
}

function buildItemsView(pessoa: ChecklistPessoa): ItemView[] {
  if (!pessoa.checklist) return [];
  const items: ItemView[] = [
    { key: 'individual', label: 'Foto individual', checked: pessoa.checklist.individual, destaque: false },
  ];

  if (pessoa.checklist.grupo !== undefined) {
    items.push({
      key: 'grupo',
      label: 'Foto em grupo',
      sub: pessoa.acompanhantes,
      checked: pessoa.checklist.grupo,
      destaque: false,
    });
  }

  if (pessoa.checklist.prioridade !== undefined) {
    items.push({
      key: 'prioridade',
      label: `Prioridade — foto com ${pessoa.fotoGarantida}`,
      checked: pessoa.checklist.prioridade,
      destaque: true,
    });
  }

  Object.entries(pessoa.checklist.formandos).forEach(([nome, checked]) => {
    items.push({ key: `formando:${nome}`, label: `Foto com ${nome}`, checked, destaque: false });
  });

  return items;
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

function FotoGrande({ pessoa }: { pessoa: ChecklistPessoa }) {
  const base: CSSProperties = {
    width: '100%',
    aspectRatio: '4 / 5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderBottom: '1px solid #000',
  };

  if (pessoa.fotoUrl) {
    return (
      <div style={base}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pessoa.fotoUrl} alt={pessoa.nomeCompleto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }

  return (
    <div style={{ ...base, background: '#e6e6e0' }}>
      <span style={{ fontFamily: serifFont, fontStyle: 'italic', fontWeight: 600, fontSize: '3rem', color: '#999' }}>
        {iniciais(pessoa.nomeCompleto)}
      </span>
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

function CheckSquare({ checked }: { checked: boolean }) {
  return (
    <span
      style={{
        width: '20px',
        height: '20px',
        minWidth: '20px',
        border: '1px solid #000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: checked ? '#000' : 'transparent',
        marginTop: '0.1rem',
        transition: 'background 0.15s',
      }}
    >
      {checked && (
        <svg width="12" height="10" viewBox="0 0 11 9" fill="none">
          <path d="M1 4.5L4 7.5L10 1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? '#000' : 'none'} stroke="#000" strokeWidth="1.5" style={{ marginRight: '0.35rem', flexShrink: 0 }}>
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8-6.3 3.8 1.7-7-5.4-4.7 7.1-.6L12 2z" strokeLinejoin="round" />
    </svg>
  );
}

function ChecklistItemRow({ item, onToggle }: { item: ItemView; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        width: '100%',
        textAlign: 'left',
        padding: item.destaque ? '0.75rem 0.85rem' : '0.65rem 0.15rem',
        margin: item.destaque ? '0.5rem 0' : 0,
        border: item.destaque ? '2px solid #000' : 'none',
        borderBottom: item.destaque ? '2px solid #000' : '1px solid #ececE6',
        background: item.destaque ? '#f5f0e2' : 'transparent',
        cursor: 'pointer',
        font: 'inherit',
      }}
    >
      <CheckSquare checked={item.checked} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            fontFamily: sansFont,
            fontSize: '0.92rem',
            fontWeight: item.destaque ? 600 : 400,
            color: '#111',
            textDecoration: item.checked ? 'line-through' : 'none',
            opacity: item.checked ? 0.55 : 1,
          }}
        >
          {item.destaque && <StarIcon filled={item.checked} />}
          {item.label}
        </span>
        {item.sub && (
          <span style={{ display: 'block', fontFamily: sansFont, fontSize: '0.78rem', color: '#888', marginTop: '0.15rem' }}>
            {item.sub}
          </span>
        )}
      </span>
    </button>
  );
}

function Card({
  pessoa,
  onToggleItem,
}: {
  pessoa: ChecklistPessoa;
  onToggleItem: (pessoa: ChecklistPessoa, itemKey: string) => void;
}) {
  const semResposta = pessoa.status === 'sem_resposta';
  const itens = buildItemsView(pessoa);

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #000',
        marginBottom: '1.5rem',
        opacity: semResposta ? 0.55 : 1,
        transition: 'opacity 0.15s',
      }}
    >
      <FotoGrande pessoa={pessoa} />

      <div style={{ padding: '1.1rem 1.25rem 1.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          <p style={{ fontFamily: serifFont, fontWeight: 600, fontSize: '1.4rem', color: '#111', margin: 0 }}>
            {pessoa.nomeCompleto}
            {pessoa.chamarDe && pessoa.chamarDe !== pessoa.nomeCompleto && (
              <span style={{ fontFamily: sansFont, fontWeight: 400, fontSize: '0.85rem', color: '#777' }}> ({pessoa.chamarDe})</span>
            )}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <AutorizacaoBadge valor={pessoa.autorizacao} />
          {!semResposta && pessoa.horarioChegada && (
            <span style={{ fontFamily: sansFont, fontWeight: 600, fontSize: '1rem', color: '#111' }}>
              {pessoa.horarioChegada}
            </span>
          )}
        </div>

        {semResposta ? (
          <p style={{ fontFamily: sansFont, fontStyle: 'italic', fontSize: '0.9rem', color: '#999', margin: 0 }}>
            Ainda não respondeu
          </p>
        ) : (
          <div>
            {itens.map(item => (
              <ChecklistItemRow key={item.key} item={item} onToggle={() => onToggleItem(pessoa, item.key)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ChecklistContent() {
  const [items, setItems] = useState<ChecklistPessoa[]>([]);
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

  function handleToggleItem(pessoa: ChecklistPessoa, itemKey: string) {
    if (!pessoa.pageId || !pessoa.checklist) return;

    const novoChecklist: Checklist = {
      ...pessoa.checklist,
      formandos: { ...pessoa.checklist.formandos },
    };

    if (itemKey === 'individual') {
      novoChecklist.individual = !novoChecklist.individual;
    } else if (itemKey === 'grupo') {
      novoChecklist.grupo = !novoChecklist.grupo;
    } else if (itemKey === 'prioridade') {
      novoChecklist.prioridade = !novoChecklist.prioridade;
    } else if (itemKey.startsWith('formando:')) {
      const nome = itemKey.slice('formando:'.length);
      novoChecklist.formandos[nome] = !novoChecklist.formandos[nome];
    }

    const completo = computeCompleto(novoChecklist);
    const checklistAnterior = pessoa.checklist;
    const fotografadoAnterior = pessoa.fotografado;

    setItems(prev => prev.map(p => (p.pageId === pessoa.pageId ? { ...p, checklist: novoChecklist, fotografado: completo } : p)));

    fetch('/api/colacao/checklist/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageId: pessoa.pageId, checklist: novoChecklist, completo }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Falha ao atualizar');
      })
      .catch(() => {
        setItems(prev => prev.map(p => (p.pageId === pessoa.pageId ? { ...p, checklist: checklistAnterior, fotografado: fotografadoAnterior } : p)));
      });
  }

  const itensVisiveis = filtro === 'pendentes' ? items.filter(i => !i.fotografado) : items;

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf9', padding: 'clamp(1.25rem, 5vw, 2.5rem) 1rem', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
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

        {!loading && !erro && itensVisiveis.map(pessoa => (
          <Card key={pessoa.nomeCompleto} pessoa={pessoa} onToggleItem={handleToggleItem} />
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
