'use client';

import { useEffect, useRef, useState } from 'react';
import { Oswald, Inter } from 'next/font/google';
import AltemansAuthGate from './AltemansAuthGate';
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

function ThTip({ children, tip }: { children: React.ReactNode; tip?: string }) {
  const ref = useRef<HTMLTableCellElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  if (!tip) return <th>{children}</th>;

  function show() {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) setPos({ top: rect.top - 8, left: rect.left });
  }

  return (
    <th ref={ref} onMouseEnter={show} onMouseLeave={() => setPos(null)}>
      <span className={styles.thHint}>{children}</span>
      {pos && (
        <div className={styles.tooltipBox} style={{ top: pos.top, left: pos.left }}>
          {tip}
        </div>
      )}
    </th>
  );
}

function exportarCSV(respostas: Resposta[]) {
  const headers = ['Data', 'Barbeiro', 'Nota geral', 'Índice de Qualidade', 'Faixa', 'NPS', 'Destaques', 'Mensagem', 'Status'];
  const escape = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const linhas = respostas.map((r) =>
    [r.data, r.barbeiro, r.notaGeral, r.indice, r.faixa, r.nps, r.destaques.join('; '), r.mensagem, r.status]
      .map(escape)
      .join(';')
  );
  const csv = '﻿' + [headers.map(escape).join(';'), ...linhas].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `experiencia-altemans-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
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
          <div className={styles.toolbar}>
            <button className={styles.exportBtn} onClick={() => exportarCSV(data.respostas)}>
              Exportar CSV
            </button>
          </div>
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
                  <ThTip tip="Quem realizou seu atendimento?">Barbeiro</ThTip>
                  <ThTip tip="Como foi sua experiência hoje?">Nota</ThTip>
                  <ThTip tip="Calculado a partir de Atendimento (40%), Serviço (30%) e Estrutura (30%), em escala de 0 a 100.">Índice</ThTip>
                  <ThTip tip="95+ Excelência · 90+ Muito bom · 80+ Bom · 70+ Atenção · abaixo de 70 Ação imediata.">Faixa</ThTip>
                  <ThTip tip="De 0 a 10, qual a chance de você indicar a Alteman's para um amigo?">NPS</ThTip>
                  <ThTip tip="O que mais chamou sua atenção hoje?">Destaques</ThTip>
                  <ThTip tip="Tem algo que a gente devia saber? (opcional)">Mensagem</ThTip>
                  <ThTip tip="Uso interno: Novo, Revisado ou Ação necessária.">Status</ThTip>
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
    <AltemansAuthGate>
      <PainelContent />
    </AltemansAuthGate>
  );
}
