'use client';

import { useEffect, useState } from 'react';
import { Oswald, Inter } from 'next/font/google';
import gateStyles from './AltemansAuthGate.module.css';

const oswald = Oswald({ subsets: ['latin'], weight: ['600'], variable: '--font-oswald' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-inter' });

const STORAGE_KEY = 'altemans-panel-auth';

export default function AltemansAuthGate({ children }: { children: React.ReactNode }) {
  const [autenticado, setAutenticado] = useState(false);
  const [checando, setChecando] = useState(true);
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const ok = typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) === 'ok';
    setAutenticado(ok);
    setChecando(false);
  }, []);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErro(false);
    try {
      const res = await fetch('/api/experiencia/altemans/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha }),
      });
      const json = await res.json();
      if (json.ok) {
        localStorage.setItem(STORAGE_KEY, 'ok');
        setAutenticado(true);
      } else {
        setErro(true);
      }
    } catch {
      setErro(true);
    } finally {
      setEnviando(false);
    }
  }

  if (checando) return null;

  if (!autenticado) {
    return (
      <div className={`${gateStyles.wrap} ${oswald.variable} ${inter.variable}`}>
        <form className={gateStyles.card} onSubmit={entrar}>
          <p className={gateStyles.eyebrow}>Alteman&apos;s Barbearia</p>
          <h1 className={gateStyles.title}>Acesso ao painel</h1>
          <input
            type="password"
            className={gateStyles.input}
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoFocus
          />
          {erro && <p className={gateStyles.error}>Senha incorreta.</p>}
          <button className={gateStyles.button} disabled={enviando}>
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
