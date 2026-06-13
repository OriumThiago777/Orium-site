'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authHeaders } from '@/lib/auth';
import AuthGate from '@/components/AuthGate';
import ToolBackground from '@/components/ToolBackground';
import WizardFooter from '@/components/WizardFooter';
import OriumInput, { ORIUM_INPUT_STYLE as IS, ORIUM_LABEL_STYLE as LB } from '@/components/OriumInput';

function ProspectoContent() {
  const [form, setForm] = useState({ nomeSegmento: '', dificuldade: '', comoConheceu: '' });
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  const set = (campo: keyof typeof form, valor: string) =>
    setForm(prev => ({ ...prev, [campo]: valor }));

  const completo = form.nomeSegmento.trim() && form.dificuldade.trim() && form.comoConheceu.trim();

  async function enviar() {
    if (!completo || enviando) return;
    setEnviando(true);
    setErro('');
    try {
      const res = await fetch('/api/prospecto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Falha ao enviar');
      window.location.href = '/hub';
    } catch {
      setErro('Não foi possível enviar. Tente novamente.');
      setEnviando(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#080808', fontFamily: 'Poppins, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <ToolBackground position="absolute" gradient="radial" />

      {/* Header */}
      <div style={{ padding: '3rem 5rem 2.5rem', borderBottom: '1px solid #141414', flexShrink: 0, position: 'relative', zIndex: 1 }}>
        <Link href="/hub" style={{ color: '#666', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none' }}>
          ← menu
        </Link>
        <p style={{ color: '#FF6B00', fontSize: '0.68rem', letterSpacing: '0.3em', margin: '1rem 0 0.75rem', textTransform: 'uppercase' }}>Briefing Rápido</p>
        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: '#fff', letterSpacing: '0.04em', lineHeight: 1, margin: 0 }}>
          PROSPECTO
        </h2>
        <p style={{ color: '#555', fontSize: '0.95rem', marginTop: '0.5rem' }}>3 perguntas rápidas para conhecermos seu negócio.</p>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '3rem 5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div>
            <OriumInput
              label="1. Nome e segmento do negócio"
              type="text"
              placeholder="Ex: Barbearia Altemans — Beleza e Estética"
              value={form.nomeSegmento}
              onChange={e => set('nomeSegmento', e.target.value)}
            />
          </div>
          <div>
            <label style={LB}>2. Qual a maior dificuldade com a presença digital hoje?</label>
            <textarea
              rows={5}
              placeholder="Descreva o principal problema que você enfrenta hoje..."
              value={form.dificuldade}
              onChange={e => set('dificuldade', e.target.value)}
              onFocus={e => (e.target.style.borderColor = '#FF6B00')}
              onBlur={e => (e.target.style.borderColor = '#1e1e1e')}
              style={{ ...IS, resize: 'none', lineHeight: 1.65 }}
            />
          </div>
          <div>
            <OriumInput
              label="3. Como conheceu a ORIUM?"
              type="text"
              placeholder="Ex: Indicação, Instagram, Google..."
              value={form.comoConheceu}
              onChange={e => set('comoConheceu', e.target.value)}
            />
          </div>
          {erro && <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>{erro}</p>}
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <WizardFooter
          onNext={enviar}
          nextLabel={enviando ? 'ENVIANDO...' : 'ENVIAR'}
          loading={enviando}
          disabled={!completo}
        />
      </div>
    </div>
  );
}

export default function ProspectoPage() {
  return (
    <AuthGate title="PROSPECTO" subtitle="Briefing rápido para novos prospects.">
      <ProspectoContent />
    </AuthGate>
  );
}
