'use client';

import { useEffect, useState } from 'react';
import { Oswald, Inter } from 'next/font/google';
import AuthGate from '@/components/AuthGate';
import styles from './styles.module.css';

const oswald = Oswald({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-oswald' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-inter' });

interface Resposta {
  id: string;
  registro: string;
  data: string;
  barbeiro: string;
  notaGeral: number | null;
  indice: number | null;
  faixa: string | null;
  nps: number | null;
  destaques: string[];
  mensagem: string;
  status: string;
}

interface Summary {
  total: number;
  indiceMedio: number | null;
  npsMedio: number | null;
  porFaixa: Record<string, number>;
}

interface ApiResponse {
  summary: Summary;
  respostas: Resposta[];
}

const badgeClass: Record<string, string> = {
  'Excelência': 'badgeExcelencia',
  'Muito bom': 'badgeMuitoBom',
  'Bom': 'badgeBom',
  'Atenção': 'badgeAtencao',
  'Ação imediata': 'badgeAcaoImediata',
};

function Faixa({ nome }: { nome: string | null }) {
  if (!nome) return <span>—</span>;
  const cls = badgeClass[nome];
  return <span className={`${styles.badge} ${cls ? styles[cls] : ''}`}>{nome}</span>;
}

function PainelContent() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/experiencia/altemans')
      .then((res) => {
        if (!res.ok) throw new Error('Falha ao carregar');
        return res.json();
      })
      .then((json: ApiResponse) => setData(json))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`${styles.page} ${oswald.variable} ${inter.variable}`}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Central de dados</p>
        <h1 className={styles.title}>Experiência do cliente</h1>
        <p className={styles.subtitle}>Alteman&apos;s Barbearia</p>
      </div>

      {loading && <p className={styles.state}>Carregando respostas...</p>}

      {!loading && error && (
        <p className={styles.state}>Não deu pra carregar as respostas agora. Recarregue a página.</p>
      )}

      {!loading && !error && data && data.respostas.length === 0 && (
        <p className={styles.state}>Nenhuma resposta ainda. Assim que o primeiro cliente avaliar, ela aparece aqui.</p>
      )}

      {!loading && !error && data && data.respostas.length > 0 && (
        <>
          <div className={styles.cards}>
            <div className={styles.card}>
              <p className={styles.cardLabel}>Total de respostas</p>
              <p className={styles.cardValue}>{data.summary.total}</p>
            </div>
            <div className={styles.card}>
              <p className={styles.cardLabel}>Índice médio</p>
              <p className={styles.cardValue}>{data.summary.indiceMedio ?? '—'}</p>
            </div>
            <div className={styles.card}>
              <p className={styles.cardLabel}>NPS médio</p>
              <p className={styles.cardValue}>{data.summary.npsMedio ?? '—'}</p>
            </div>
            <div className={styles.card}>
              <p className={styles.cardLabel}>Faixa predominante</p>
              <p className={styles.cardValue}>
                {Object.entries(data.summary.porFaixa).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'}
              </p>
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Barbeiro</th>
                  <th>Nota</th>
                  <th>Índice</th>
                  <th>Faixa</th>
                  <th>NPS</th>
                  <th>Destaques</th>
                  <th>Mensagem</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.respostas.map((r) => (
                  <tr key={r.id}>
                    <td>{r.data}</td>
                    <td>{r.barbeiro}</td>
                    <td>{r.notaGeral ?? '—'}</td>
                    <td>{r.indice ?? '—'}</td>
                    <td><Faixa nome={r.faixa} /></td>
                    <td>{r.nps ?? '—'}</td>
                    <td>
                      <div className={styles.destaques}>
                        {r.destaques.map((d) => (
                          <span className={styles.tag} key={d}>{d}</span>
                        ))}
                      </div>
                    </td>
                    <td className={styles.mensagem}>{r.mensagem || '—'}</td>
                    <td>{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default function PainelExperienciaAltemansPage() {
  return (
    <AuthGate>
      <PainelContent />
    </AuthGate>
  );
}
