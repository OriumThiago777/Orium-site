'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { saveAuth, isAuthenticated, clearAuth } from '@/lib/auth';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface Post {
  numero: string;
  diaSemana: string;
  formato: string;
  tema: string;
  titulo: string;
  legenda: string;
  hashtags: string;
}

interface Semana {
  numero: number;
  titulo: string;
  posts: Post[];
}

interface Calendario {
  semanas: Semana[];
}

// ─── Constantes ──────────────────────────────────────────────────────────────

const MESES = [
  'Janeiro 2026', 'Fevereiro 2026', 'Março 2026', 'Abril 2026',
  'Maio 2026', 'Junho 2026', 'Julho 2026', 'Agosto 2026',
  'Setembro 2026', 'Outubro 2026', 'Novembro 2026', 'Dezembro 2026',
  'Janeiro 2027', 'Fevereiro 2027', 'Março 2027', 'Abril 2027',
  'Maio 2027', 'Junho 2027', 'Julho 2027', 'Agosto 2027',
  'Setembro 2027', 'Outubro 2027', 'Novembro 2027', 'Dezembro 2027',
];

const SEGMENTOS = ['Barbearia', 'Saúde e Bem-estar', 'Alimentação', 'Moda e Beleza', 'Educação', 'Consultoria', 'Tecnologia', 'Varejo', 'Serviços', 'Outro'];
const OBJETIVOS = ['Gerar autoridade', 'Atrair novos clientes', 'Fidelizar clientes atuais', 'Lançar produto ou serviço', 'Aumentar engajamento', 'Fortalecer identidade da marca'];
const TONS = ['Profissional e sério', 'Descontraído e próximo', 'Inspirador e motivacional', 'Educativo e informativo', 'Premium e sofisticado', 'Direto e objetivo'];
const FREQUENCIAS = ['2x por semana', '3x por semana', '4x por semana', '5x por semana'];
const FORMATOS = ['Post estático', 'Carrossel', 'Reels', 'Stories', 'Story com enquete', 'Story com CTA'];
const TEMAS = ['Bastidores', 'Antes e depois', 'Depoimento de cliente', 'Dica rápida', 'Curiosidade do segmento', 'Promoção ou oferta', 'Produto ou serviço em destaque', 'Humanização da marca', 'Conteúdo educativo', 'Novidade ou lançamento', 'Pergunta para engajamento', 'Post motivacional'];

const LOADING_TEXTS = [
  'Analisando o negócio...',
  'Estruturando o calendário...',
  'Gerando conteúdo estratégico...',
  'Finalizando...',
];

// ─── Helpers de estilo ────────────────────────────────────────────────────────

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid #1e1e1e',
  borderRadius: '10px',
  padding: '1rem 1.25rem',
  color: '#fff',
  fontSize: '0.95rem',
  fontFamily: 'Poppins, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const TEXTAREA_STYLE: React.CSSProperties = {
  ...INPUT_STYLE,
  resize: 'none',
  lineHeight: 1.65,
};

const SELECT_STYLE: React.CSSProperties = {
  ...INPUT_STYLE,
  cursor: 'pointer',
  appearance: 'none',
  WebkitAppearance: 'none',
};

function toggleBtn(active: boolean): React.CSSProperties {
  return {
    padding: '0.625rem 1.25rem',
    borderRadius: '8px',
    border: `1px solid ${active ? '#FF6B00' : '#1e1e1e'}`,
    background: active ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.03)',
    color: active ? '#fff' : '#777',
    fontSize: '0.88rem',
    fontFamily: 'Poppins, sans-serif',
    cursor: 'pointer',
    transition: 'all 0.15s',
  };
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function CalendarioPage() {
  const [autenticado, setAutenticado] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [senha, setSenha] = useState('');
  const [erroSenha, setErroSenha] = useState(false);
  const [carregandoAuth, setCarregandoAuth] = useState(false);

  const [step, setStep] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [step]);

  const [form, setForm] = useState<Record<string, string>>({
    nomeCliente: '',
    instagram: '',
    segmento: '',
    mes: '',
    objetivo: '',
    tomVoz: '',
    diferencial: '',
    publico: '',
    frequencia: '',
    datasEspeciais: '',
    observacoes: '',
  });
  const [multi, setMulti] = useState<Record<string, string[]>>({
    formatos: [],
    temas: [],
  });

  const [gerando, setGerando] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [calendario, setCalendario] = useState<Calendario | null>(null);
  const [erroGeracao, setErroGeracao] = useState('');
  const [copiado, setCopiado] = useState(false);

  // Checar auth no client
  useEffect(() => {
    setAutenticado(isAuthenticated());
    setAuthChecked(true);
  }, []);

  // Rotacionar textos de loading
  useEffect(() => {
    if (!gerando) return;
    const id = setInterval(() => {
      setLoadingTextIndex(i => (i + 1) % LOADING_TEXTS.length);
    }, 2500);
    return () => clearInterval(id);
  }, [gerando]);

  const set = (name: string, value: string) =>
    setForm(prev => ({ ...prev, [name]: value }));

  const toggleMulti = (name: string, value: string) => {
    setMulti(prev => {
      const current = prev[name] || [];
      return {
        ...prev,
        [name]: current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value],
      };
    });
  };

  const isChecked = (name: string, value: string) =>
    (multi[name] || []).includes(value);

  // ─── Auth ──────────────────────────────────────────────────────────────────

  async function handleSenha(e: React.FormEvent) {
    e.preventDefault();
    setCarregandoAuth(true);
    setErroSenha(false);
    try {
      const res = await fetch('/api/raio-x/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha }),
      });
      if (res.ok) {
        saveAuth();
        setAutenticado(true);
      } else {
        setErroSenha(true);
      }
    } catch {
      setErroSenha(true);
    } finally {
      setCarregandoAuth(false);
    }
  }

  // ─── Geração ──────────────────────────────────────────────────────────────

  const gerarCalendario = useCallback(async () => {
    setGerando(true);
    setErroGeracao('');
    setLoadingTextIndex(0);
    try {
      const res = await fetch('/api/calendario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeCliente: form.nomeCliente,
          instagram: form.instagram,
          segmento: form.segmento,
          mes: form.mes,
          objetivo: form.objetivo,
          tomVoz: form.tomVoz,
          diferencial: form.diferencial,
          publico: form.publico,
          frequencia: form.frequencia,
          formatos: multi.formatos || [],
          temas: multi.temas || [],
          datasEspeciais: form.datasEspeciais,
          observacoes: form.observacoes,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setErroGeracao(data.error);
      } else {
        setCalendario(data);
      }
    } catch {
      setErroGeracao('Erro ao gerar calendário. Tente novamente.');
    } finally {
      setGerando(false);
    }
  }, [form, multi]);

  useEffect(() => {
    if (step === 3 && !calendario && !gerando) {
      gerarCalendario();
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Copiar ───────────────────────────────────────────────────────────────

  function copiarCalendario() {
    if (!calendario) return;
    const linhas: string[] = [
      `CALENDÁRIO DE CONTEÚDO — ${form.nomeCliente.toUpperCase()} — ${form.mes.toUpperCase()}`,
      `Gerado por ORIUM™ | oriumagencia.com.br`,
      '━'.repeat(40),
    ];
    calendario.semanas.forEach(semana => {
      linhas.push('');
      linhas.push(semana.titulo.toUpperCase());
      semana.posts.forEach(post => {
        linhas.push('');
        linhas.push(`POST ${post.numero} — ${post.diaSemana} | ${post.formato}`);
        linhas.push(`Tema: ${post.tema}`);
        linhas.push(`Título: ${post.titulo}`);
        linhas.push('Legenda:');
        linhas.push(post.legenda);
        linhas.push(`Hashtags: ${post.hashtags}`);
      });
      linhas.push('');
      linhas.push('━'.repeat(40));
    });
    navigator.clipboard.writeText(linhas.join('\n')).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  }

  function resetarForm() {
    if (!confirm('Tem certeza? O calendário atual será perdido.')) return;
    setForm({ nomeCliente: '', instagram: '', segmento: '', mes: '', objetivo: '', tomVoz: '', diferencial: '', publico: '', frequencia: '', datasEspeciais: '', observacoes: '' });
    setMulti({ formatos: [], temas: [] });
    setCalendario(null);
    setErroGeracao('');
    setStep(0);
  }

  function regerarCalendario() {
    if (!confirm('Gerar novo calendário? O atual será substituído.')) return;
    setCalendario(null);
    gerarCalendario();
  }

  // ─── Background ──────────────────────────────────────────────────────────

  const bgImage = (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Image src="/hero.jpg" alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.07 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(255,107,0,0.05) 0%, transparent 60%), linear-gradient(to bottom, #080808 0%, transparent 30%, transparent 70%, #080808 100%)' }} />
    </div>
  );

  // ─── Aguarda checagem de auth ────────────────────────────────────────────

  if (!authChecked) return null;

  // ─── Tela de senha ────────────────────────────────────────────────────────

  if (!autenticado) {
    return (
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins, sans-serif' }}>
        {bgImage}
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px', padding: '0 2rem' }}>
          <div style={{ marginBottom: '3rem' }}>
            <Image src="/lglaranja.png" alt="ORIUM" width={120} height={40} style={{ objectFit: 'contain' }} />
          </div>
          <p style={{ color: '#FF6B00', fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>ACESSO INTERNO</p>
          <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(3rem, 6vw, 4.5rem)', color: '#fff', letterSpacing: '0.02em', lineHeight: 0.95, marginBottom: '1.75rem' }}>CALENDÁRIO</h1>
          <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.75, marginBottom: '3rem' }}>Gerador de conteúdo mensal com IA.</p>
          <form onSubmit={handleSenha}>
            <input
              type="password"
              placeholder="Senha de acesso"
              value={senha}
              onChange={e => { setSenha(e.target.value); setErroSenha(false); }}
              autoFocus
              style={{ ...INPUT_STYLE, border: `1px solid ${erroSenha ? '#ef4444' : '#1e1e1e'}` }}
              onFocus={e => { if (!erroSenha) e.target.style.borderColor = '#FF6B00'; }}
              onBlur={e => { if (!erroSenha) e.target.style.borderColor = '#1e1e1e'; }}
            />
            {erroSenha && (
              <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.75rem', textAlign: 'center' }}>Senha incorreta. Tente novamente.</p>
            )}
            <button
              type="submit"
              disabled={carregandoAuth || !senha}
              style={{ width: '100%', background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '1rem', color: '#000', fontFamily: 'Anton, sans-serif', fontSize: '1rem', letterSpacing: '0.15em', cursor: carregandoAuth || !senha ? 'not-allowed' : 'pointer', boxShadow: '0 4px 20px rgba(255,107,0,0.2)', marginTop: '1rem', opacity: carregandoAuth || !senha ? 0.5 : 1, transition: 'all 0.2s' }}
            >
              {carregandoAuth ? '...' : 'ACESSAR'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Labels e steps ───────────────────────────────────────────────────────

  const STEPS = [
    { label: 'CLIENTE E MÊS' },
    { label: 'ESTRATÉGIA' },
    { label: 'CONFIGURAÇÕES' },
    { label: 'CALENDÁRIO' },
  ];

  const totalSteps = STEPS.length;
  const progress = ((step + 1) / totalSteps) * 100;

  // ─── Validação por step ───────────────────────────────────────────────────

  function podeAvancar() {
    if (step === 0) return !!(form.nomeCliente && form.segmento && form.mes);
    if (step === 1) return !!(form.objetivo && form.tomVoz && form.diferencial && form.publico);
    if (step === 2) return !!(form.frequencia && multi.formatos.length > 0 && multi.temas.length > 0);
    return true;
  }

  // ─── Conteúdo de cada step ────────────────────────────────────────────────

  function renderStep() {
    if (step === 0) {
      return (
        <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <Field label="Nome do cliente *">
            <input
              type="text"
              placeholder="Nome do cliente"
              value={form.nomeCliente}
              onChange={e => set('nomeCliente', e.target.value)}
              style={INPUT_STYLE}
              onFocus={e => e.target.style.borderColor = '#FF6B00'}
              onBlur={e => e.target.style.borderColor = '#1e1e1e'}
            />
          </Field>
          <Field label="Instagram do cliente">
            <input
              type="text"
              placeholder="@cliente"
              value={form.instagram}
              onChange={e => set('instagram', e.target.value)}
              style={INPUT_STYLE}
              onFocus={e => e.target.style.borderColor = '#FF6B00'}
              onBlur={e => e.target.style.borderColor = '#1e1e1e'}
            />
          </Field>
          <Field label="Segmento *">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
              {SEGMENTOS.map(op => (
                <button key={op} onClick={() => set('segmento', op)} style={toggleBtn(form.segmento === op)}>
                  {form.segmento === op ? '● ' : '○ '}{op}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Mês de referência *">
            <div style={{ position: 'relative' }}>
              <select
                value={form.mes}
                onChange={e => set('mes', e.target.value)}
                style={{ ...SELECT_STYLE, color: form.mes ? '#fff' : '#555' }}
                onFocus={e => e.target.style.borderColor = '#FF6B00'}
                onBlur={e => e.target.style.borderColor = '#1e1e1e'}
              >
                <option value="" disabled style={{ background: '#1a1a1a' }}>Selecione o mês</option>
                {MESES.map(m => (
                  <option key={m} value={m} style={{ background: '#1a1a1a', color: '#fff' }}>{m}</option>
                ))}
              </select>
              <span style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#555', fontSize: '0.8rem' }}>▾</span>
            </div>
          </Field>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <Field label="Objetivo principal do mês *">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
              {OBJETIVOS.map(op => (
                <button key={op} onClick={() => set('objetivo', op)} style={toggleBtn(form.objetivo === op)}>
                  {form.objetivo === op ? '● ' : '○ '}{op}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Tom de voz *">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
              {TONS.map(op => (
                <button key={op} onClick={() => set('tomVoz', op)} style={toggleBtn(form.tomVoz === op)}>
                  {form.tomVoz === op ? '● ' : '○ '}{op}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Diferencial da marca *">
            <textarea
              rows={3}
              placeholder="O que torna esse negócio único ou diferente dos concorrentes?"
              value={form.diferencial}
              onChange={e => set('diferencial', e.target.value)}
              style={TEXTAREA_STYLE}
              onFocus={e => e.target.style.borderColor = '#FF6B00'}
              onBlur={e => e.target.style.borderColor = '#1e1e1e'}
            />
          </Field>
          <Field label="Público-alvo *">
            <textarea
              rows={3}
              placeholder="Descreva quem são os clientes ideais: idade, perfil, dores, desejos..."
              value={form.publico}
              onChange={e => set('publico', e.target.value)}
              style={TEXTAREA_STYLE}
              onFocus={e => e.target.style.borderColor = '#FF6B00'}
              onBlur={e => e.target.style.borderColor = '#1e1e1e'}
            />
          </Field>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <Field label="Frequência semanal de posts *">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
              {FREQUENCIAS.map(op => (
                <button key={op} onClick={() => set('frequencia', op)} style={toggleBtn(form.frequencia === op)}>
                  {form.frequencia === op ? '● ' : '○ '}{op}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Formatos usados *" hint="Selecione quantos quiser">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
              {FORMATOS.map(op => (
                <button key={op} onClick={() => toggleMulti('formatos', op)} style={toggleBtn(isChecked('formatos', op))}>
                  {isChecked('formatos', op) ? '✓ ' : ''}{op}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Temas recorrentes *" hint="Selecione quantos quiser">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
              {TEMAS.map(op => (
                <button key={op} onClick={() => toggleMulti('temas', op)} style={toggleBtn(isChecked('temas', op))}>
                  {isChecked('temas', op) ? '✓ ' : ''}{op}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Datas especiais do mês">
            <textarea
              rows={2}
              placeholder="Ex: Dia dos Namorados 12/06, aniversário da empresa 15/06..."
              value={form.datasEspeciais}
              onChange={e => set('datasEspeciais', e.target.value)}
              style={TEXTAREA_STYLE}
              onFocus={e => e.target.style.borderColor = '#FF6B00'}
              onBlur={e => e.target.style.borderColor = '#1e1e1e'}
            />
          </Field>
          <Field label="Observações livres">
            <textarea
              rows={2}
              placeholder="Algo específico para incluir ou evitar neste mês..."
              value={form.observacoes}
              onChange={e => set('observacoes', e.target.value)}
              style={TEXTAREA_STYLE}
              onFocus={e => e.target.style.borderColor = '#FF6B00'}
              onBlur={e => e.target.style.borderColor = '#1e1e1e'}
            />
          </Field>
        </div>
      );
    }

    // step === 3
    return renderCalendario();
  }

  // ─── Calendário gerado ────────────────────────────────────────────────────

  function renderCalendario() {
    // Loading
    if (gerando || (!calendario && !erroGeracao)) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '2rem' }}>
          <Image src="/lglaranja.png" alt="ORIUM" width={100} height={32} style={{ objectFit: 'contain', opacity: 0.9 }} />
          <div style={{ position: 'relative', width: '48px', height: '48px' }}>
            <svg viewBox="0 0 48 48" style={{ width: '100%', height: '100%', animation: 'spin 1s linear infinite' }}>
              <circle cx="24" cy="24" r="20" fill="none" stroke="#1e1e1e" strokeWidth="3" />
              <circle cx="24" cy="24" r="20" fill="none" stroke="#FF6B00" strokeWidth="3" strokeDasharray="40 86" strokeLinecap="round" />
            </svg>
          </div>
          <p style={{ color: '#aaa', fontSize: '0.95rem', fontFamily: 'Poppins, sans-serif', transition: 'opacity 0.5s', minHeight: '1.5em', textAlign: 'center' }}>
            {LOADING_TEXTS[loadingTextIndex]}
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      );
    }

    // Erro
    if (erroGeracao) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '1.5rem' }}>
          <p style={{ color: '#ef4444', fontSize: '1rem' }}>{erroGeracao}</p>
          <button
            onClick={gerarCalendario}
            style={{ background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '0.875rem 2rem', color: '#fff', fontFamily: 'Anton, sans-serif', letterSpacing: '0.15em', fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,107,0,0.2)' }}
          >
            TENTAR NOVAMENTE
          </button>
        </div>
      );
    }

    if (!calendario) return null;

    const postsSemanais = parseInt(form.frequencia.split('x')[0]);
    const totalPosts = postsSemanais * 4;

    return (
      <div style={{ maxWidth: '860px' }}>
        {/* Cabeçalho */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#FF6B00', letterSpacing: '0.04em', lineHeight: 1, marginBottom: '0.25rem' }}>
            {form.nomeCliente.toUpperCase()}
          </h2>
          <p style={{ color: '#fff', fontSize: '1.2rem', fontFamily: 'Anton, sans-serif', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>{form.mes}</p>
          <p style={{ color: '#71717a', fontSize: '0.88rem' }}>
            {totalPosts} posts · 4 semanas · {form.objetivo}
          </p>
        </div>

        {/* Botões de ação */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <button
            onClick={copiarCalendario}
            style={{ background: copiado ? '#16a34a' : '#FF6B00', border: 'none', borderRadius: '8px', padding: '0.75rem 1.75rem', color: '#fff', fontFamily: 'Anton, sans-serif', letterSpacing: '0.15em', fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(255,107,0,0.2)' }}
          >
            {copiado ? '✓ COPIADO!' : 'COPIAR CALENDÁRIO'}
          </button>
          <button
            onClick={regerarCalendario}
            style={{ background: 'transparent', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '0.75rem 1.75rem', color: '#888', fontFamily: 'Poppins, sans-serif', fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { const b = e.currentTarget; b.style.borderColor = '#444'; b.style.color = '#ccc'; }}
            onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = '#1e1e1e'; b.style.color = '#888'; }}
          >
            Regerar
          </button>
          <button
            onClick={resetarForm}
            style={{ background: 'transparent', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '0.75rem 1.75rem', color: '#888', fontFamily: 'Poppins, sans-serif', fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { const b = e.currentTarget; b.style.borderColor = '#444'; b.style.color = '#ccc'; }}
            onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = '#1e1e1e'; b.style.color = '#888'; }}
          >
            Novo calendário
          </button>
        </div>

        {/* Semanas */}
        {calendario.semanas.map(semana => (
          <div key={semana.numero} style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontFamily: 'Anton, sans-serif', color: '#FF6B00', fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                {semana.titulo.toUpperCase()}
              </span>
              <div style={{ flex: 1, height: '1px', background: '#141414' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {semana.posts.map(post => (
                <PostCard key={post.numero} post={post} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ─── Layout principal ─────────────────────────────────────────────────────

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#080808', fontFamily: 'Poppins, sans-serif', display: 'flex' }}>
      {bgImage}

      {/* Sidebar */}
      <div style={{ position: 'relative', width: sidebarCollapsed ? '60px' : '260px', flexShrink: 0, height: '100%', zIndex: 10, transition: 'width 0.3s ease' }}>

        {/* Toggle — círculo */}
        <button
          onClick={() => setSidebarCollapsed(c => !c)}
          title={sidebarCollapsed ? 'Expandir' : 'Recolher'}
          style={{ position: 'absolute', right: '-12px', top: '50%', transform: 'translateY(-50%)', zIndex: 20, width: '24px', height: '24px', background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#333', fontSize: '0.65rem', transition: 'all 0.2s' }}
          onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = '#FF6B00'; b.style.color = '#FF6B00'; }}
          onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = '#1e1e1e'; b.style.color = '#333'; }}
        >
          {sidebarCollapsed ? '›' : '‹'}
        </button>

        <div style={{ width: '100%', height: '100%', borderRight: '1px solid #0f0f0f', display: 'flex', flexDirection: 'column', background: 'rgba(8,8,8,0.97)', backdropFilter: 'blur(16px)', overflow: 'hidden' }}>

          {/* ZONA 1 — Logo */}
          {!sidebarCollapsed ? (
            <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid #0f0f0f', flexShrink: 0 }}>
              <Image src="/lglaranja.png" alt="ORIUM" width={90} height={28} style={{ objectFit: 'contain' }} />
              <p style={{ color: '#444444', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Poppins, sans-serif', marginTop: '0.5rem', marginBottom: 0 }}>CALENDÁRIO DE CONTEÚDO</p>
            </div>
          ) : (
            <div style={{ flexShrink: 0, height: '60px', borderBottom: '1px solid #0f0f0f' }} />
          )}

          {/* ZONA 2 — Etapas */}
          <div style={{ flex: 1, overflowY: 'hidden' }}>
            {!sidebarCollapsed && (
              <p style={{ color: '#444444', fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', padding: '1.25rem 1.75rem 0.75rem', margin: 0 }}>ETAPAS</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {STEPS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { if (i <= step) setStep(i); }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '0.75rem', padding: sidebarCollapsed ? '0.875rem 0' : '0.7rem 1.75rem', background: i === step ? 'rgba(255,107,0,0.15)' : 'transparent', borderTop: 'none', borderRight: 'none', borderBottom: 'none', borderLeft: sidebarCollapsed ? 'none' : `2px solid ${i === step ? '#FF6B00' : 'transparent'}`, outline: 'none', cursor: i <= step ? 'pointer' : 'default', textAlign: 'left', width: '100%', transition: 'all 0.2s', boxSizing: 'border-box' as const }}
                  onMouseEnter={e => { if (i !== step && i <= step) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={e => { if (i !== step) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  <span style={{ fontFamily: 'Anton, sans-serif', fontSize: '0.65rem', letterSpacing: '0.05em', minWidth: '20px', flexShrink: 0, color: i === step ? '#FF6B00' : '#555555', transition: 'color 0.2s' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {!sidebarCollapsed && (
                    <span style={{ fontSize: '0.78rem', color: i === step ? '#fff' : '#888888', fontFamily: 'Poppins, sans-serif', fontWeight: i === step ? 600 : 400, lineHeight: 1.3, transition: 'color 0.2s' }}>
                      {s.label}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ZONA 3 — Progresso */}
          {!sidebarCollapsed && (
            <div style={{ borderTop: '1px solid #0f0f0f', padding: '1.25rem 1.75rem', flexShrink: 0 }}>
              <p style={{ color: '#444444', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.625rem' }}>PROGRESSO</p>
              <div style={{ height: '2px', background: '#111', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: '#FF6B00', borderRadius: '2px', transition: 'width 0.5s ease' }} />
              </div>
              <p style={{ color: '#2a2a2a', fontSize: '0.7rem', marginTop: '0.5rem' }}>{Math.round(progress)}% concluído</p>
            </div>
          )}

          {/* ZONA 4 — Hub + Sair */}
          <div style={{ borderTop: '1px solid #0f0f0f', padding: sidebarCollapsed ? '1rem 0' : '1rem 1.75rem 1.5rem', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: sidebarCollapsed ? 'center' : 'flex-start', gap: '0.75rem' }}>
            <a
              href="/hub"
              title="Voltar ao painel"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#888888', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.15s', fontFamily: 'Poppins, sans-serif', border: '1px solid #1e1e1e', padding: '8px 12px', borderRadius: '8px' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00'; e.currentTarget.style.borderColor = '#FF6B00'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#888888'; e.currentTarget.style.borderColor = '#1e1e1e'; }}
            >
              <span>←</span>
              {!sidebarCollapsed && <span>PAINEL</span>}
            </a>
            {!sidebarCollapsed && (
              <a href="/biblioteca" style={{ color: '#777', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s', fontFamily: 'Poppins, sans-serif' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#777'; }}>
                BIBLIOTECA
              </a>
            )}
            {!sidebarCollapsed && (
              <button
                onClick={() => { clearAuth(); setAutenticado(false); }}
                style={{ background: 'none', border: 'none', color: '#1a1a1a', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', transition: 'color 0.2s', padding: 0, fontFamily: 'Poppins, sans-serif' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#1a1a1a'; }}
              >
                sair
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ padding: '3rem 5rem 2.5rem', borderBottom: '1px solid #141414', flexShrink: 0 }}>
          <p style={{ color: '#FF6B00', fontSize: '0.68rem', letterSpacing: '0.3em', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Etapa {step + 1} de {totalSteps}
          </p>
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: '#fff', letterSpacing: '0.04em', lineHeight: 1, marginBottom: '0.5rem' }}>
            {STEPS[step].label}
          </h2>
          {step === 0 && <p style={{ color: '#555', fontSize: '0.95rem' }}>Informações básicas do cliente.</p>}
          {step === 1 && <p style={{ color: '#555', fontSize: '0.95rem' }}>Objetivo, tom e posicionamento da marca.</p>}
          {step === 2 && <p style={{ color: '#555', fontSize: '0.95rem' }}>Frequência, formatos e temas de conteúdo.</p>}
          {step === 3 && <p style={{ color: '#555', fontSize: '0.95rem' }}>Calendário gerado com IA para {form.nomeCliente || 'o cliente'}.</p>}
        </div>

        {/* Body */}
        <div ref={contentRef} style={{ flex: 1, overflowY: 'auto', padding: '3rem 5rem' }}>
          {renderStep()}
        </div>

        {/* Footer */}
        {step < 3 && (
          <div style={{ padding: '1.75rem 5rem', borderTop: '1px solid #141414', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(8px)' }}>
            {step > 0 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                style={{ background: 'transparent', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '0.875rem 2rem', color: '#666', fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { const b = e.currentTarget; b.style.borderColor = '#444'; b.style.color = '#ccc'; }}
                onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = '#1e1e1e'; b.style.color = '#666'; }}
              >← Voltar</button>
            ) : <div />}
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!podeAvancar()}
              style={{ background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '0.875rem 2.75rem', color: '#fff', fontSize: '0.9rem', fontFamily: 'Anton, sans-serif', letterSpacing: '0.15em', cursor: podeAvancar() ? 'pointer' : 'not-allowed', opacity: podeAvancar() ? 1 : 0.4, transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(255,107,0,0.2)' }}
              onMouseEnter={e => { if (podeAvancar()) { const b = e.currentTarget; b.style.background = '#e55f00'; b.style.boxShadow = '0 6px 28px rgba(255,107,0,0.35)'; } }}
              onMouseLeave={e => { const b = e.currentTarget; b.style.background = '#FF6B00'; b.style.boxShadow = '0 4px 20px rgba(255,107,0,0.2)'; }}
            >
              {step === 2 ? 'GERAR CALENDÁRIO →' : 'CONTINUAR →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', color: '#e0e0e0', fontSize: '1rem', lineHeight: 1.5, marginBottom: hint ? '0.5rem' : '1rem', fontWeight: 500 }}>
        {label}
      </label>
      {hint && <p style={{ color: '#3a3a3a', fontSize: '0.78rem', marginBottom: '0.75rem' }}>{hint}</p>}
      {children}
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? '#2a2a2a' : '#1e1e1e'}`,
        borderRadius: '12px',
        padding: '1.5rem',
        transition: 'border-color 0.2s',
      }}
    >
      {/* Topo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <span style={{ fontFamily: 'Anton, sans-serif', color: '#FF6B00', fontSize: '1.5rem', letterSpacing: '0.04em', lineHeight: 1 }}>
          {post.numero}
        </span>
        <span style={{ background: 'rgba(255,107,0,0.12)', border: '1px solid rgba(255,107,0,0.2)', borderRadius: '4px', padding: '0.2rem 0.6rem', color: '#FF6B00', fontSize: '0.7rem', fontFamily: 'Poppins, sans-serif', letterSpacing: '0.05em' }}>
          {post.formato}
        </span>
      </div>

      {/* Dia da semana */}
      <p style={{ color: '#555', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
        {post.diaSemana}
      </p>

      {/* Tema */}
      <p style={{ color: '#FF6B00', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
        {post.tema}
      </p>

      {/* Título */}
      <p style={{ color: '#fff', fontWeight: 600, fontSize: '1rem', lineHeight: 1.4, marginBottom: '0.875rem' }}>
        {post.titulo}
      </p>

      {/* Legenda */}
      <p style={{ color: '#71717a', fontSize: '0.88rem', lineHeight: 1.75, marginBottom: '0.75rem', whiteSpace: 'pre-line' }}>
        {post.legenda}
      </p>

      {/* Hashtags */}
      <p style={{ color: '#3f3f46', fontSize: '0.78rem', lineHeight: 1.5 }}>
        {post.hashtags}
      </p>
    </div>
  );
}
