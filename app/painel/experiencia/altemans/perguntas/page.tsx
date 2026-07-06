'use client';

import { useEffect, useState } from 'react';
import { Oswald, Inter } from 'next/font/google';
import AuthGate from '@/components/AuthGate';
import styles from './styles.module.css';

const oswald = Oswald({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-oswald' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-inter' });

const CHAVES_TRAVADAS = ['recepcao', 'entendimento', 'resultado', 'tempo', 'estrutura'];

interface Pergunta {
  id: string;
  ordem: number;
  chave: string;
  tipo: string;
  rotulo: string;
  pergunta: string;
  dica: string;
  opcoes: string[];
  ativo: boolean;
}

function PerguntasContent() {
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [rascunho, setRascunho] = useState<Partial<Pergunta>>({});
  const [salvando, setSalvando] = useState(false);

  function carregar() {
    setLoading(true);
    fetch('/api/experiencia/altemans/perguntas')
      .then((res) => {
        if (!res.ok) throw new Error('falha');
        return res.json();
      })
      .then((json) => setPerguntas(json.perguntas))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    carregar();
  }, []);

  function abrirEdicao(p: Pergunta) {
    setEditandoId(p.id);
    setRascunho({ pergunta: p.pergunta, rotulo: p.rotulo, dica: p.dica, opcoes: p.opcoes });
  }

  async function salvar(id: string) {
    setSalvando(true);
    try {
      await fetch(`/api/experiencia/altemans/perguntas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rascunho),
      });
      setEditandoId(null);
      carregar();
    } finally {
      setSalvando(false);
    }
  }

  async function alternarAtivo(p: Pergunta) {
    if (p.ativo && CHAVES_TRAVADAS.includes(p.chave)) {
      const confirmado = window.confirm(
        `"${p.rotulo}" entra no cálculo do Índice de Qualidade. Desativar essa pergunta muda a matemática do índice pra todas as respostas futuras. Continuar?`
      );
      if (!confirmado) return;
    }
    await fetch(`/api/experiencia/altemans/perguntas/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ativo: !p.ativo }),
    });
    carregar();
  }

  async function mover(index: number, direcao: -1 | 1) {
    const alvo = perguntas[index + direcao];
    const atual = perguntas[index];
    if (!alvo) return;
    await Promise.all([
      fetch(`/api/experiencia/altemans/perguntas/${atual.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ordem: alvo.ordem }),
      }),
      fetch(`/api/experiencia/altemans/perguntas/${alvo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ordem: atual.ordem }),
      }),
    ]);
    carregar();
  }

  return (
    <div className={`${styles.page} ${oswald.variable} ${inter.variable}`}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Central de dados</p>
        <h1 className={styles.title}>Editor de perguntas</h1>
      </div>
      <p className={styles.notice}>
        Editável aqui: texto da pergunta, rótulo, dica, opções e ordem. <strong>Chave</strong> e{' '}
        <strong>Tipo</strong> são estruturais e não aparecem pra edição — mudar isso exigiria
        alterar o formulário e a database de respostas junto, então não fica disponível nessa tela
        de propósito.
      </p>

      {loading && <p className={styles.state}>Carregando perguntas...</p>}
      {!loading && error && <p className={styles.state}>Não deu pra carregar. Recarregue a página.</p>}

      {!loading && !error && (
        <div className={styles.list}>
          {perguntas.map((p, i) => (
            <div className={styles.row} key={p.id}>
              <div className={styles.rowHead}>
                <div className={styles.order}>
                  <button className={styles.orderBtn} onClick={() => mover(i, -1)} disabled={i === 0}>▲</button>
                  <span className={styles.orderNum}>{p.ordem}</span>
                  <button className={styles.orderBtn} onClick={() => mover(i, 1)} disabled={i === perguntas.length - 1}>▼</button>
                </div>

                <div className={styles.meta}>
                  <p className={styles.rotulo}>{p.rotulo}</p>
                  <p className={styles.perguntaText} onClick={() => abrirEdicao(p)}>{p.pergunta}</p>
                  <p className={styles.chaveTag}>chave: {p.chave}</p>
                </div>

                <span className={styles.tipoBadge}>{p.tipo}</span>

                <button
                  className={`${styles.toggle} ${p.ativo ? styles.on : ''}`}
                  onClick={() => alternarAtivo(p)}
                  aria-label="Ativar ou desativar pergunta"
                >
                  <span className={styles.toggleDot} />
                </button>
              </div>

              {editandoId === p.id && (
                <div className={styles.editForm}>
                  <div className={styles.field}>
                    <label>Pergunta</label>
                    <textarea
                      value={rascunho.pergunta || ''}
                      onChange={(e) => setRascunho((r) => ({ ...r, pergunta: e.target.value }))}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Rótulo (categoria mostrada acima da pergunta)</label>
                    <input
                      value={rascunho.rotulo || ''}
                      onChange={(e) => setRascunho((r) => ({ ...r, rotulo: e.target.value }))}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Dica (opcional)</label>
                    <input
                      value={rascunho.dica || ''}
                      onChange={(e) => setRascunho((r) => ({ ...r, dica: e.target.value }))}
                    />
                  </div>
                  {(p.tipo === 'choice' || p.tipo === 'chips') && (
                    <div className={styles.field}>
                      <label>Opções (separe por ponto e vírgula)</label>
                      <input
                        value={(rascunho.opcoes || []).join(';')}
                        onChange={(e) =>
                          setRascunho((r) => ({
                            ...r,
                            opcoes: e.target.value.split(';').map((s) => s.trim()).filter(Boolean),
                          }))
                        }
                      />
                      <p className={styles.hintText}>Ex: Felipe Brandão;Hiago Martins;Vitor Pereira</p>
                    </div>
                  )}
                  <div className={styles.formActions}>
                    <button className={styles.btnSave} disabled={salvando} onClick={() => salvar(p.id)}>
                      {salvando ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button className={styles.btnCancel} onClick={() => setEditandoId(null)}>Cancelar</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EditorPerguntasPage() {
  return (
    <AuthGate>
      <PerguntasContent />
    </AuthGate>
  );
}
