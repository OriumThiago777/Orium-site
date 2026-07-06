'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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

const FAIXA_COLORS: Record<string, string> = {
  'Excelência': '#22C55E',
  'Muito bom': '#14B8A6',
  'Bom': '#F59E0B',
  'Atenção': '#FB7A1E',
  'Ação imediata': '#EF4444',
};
const FAIXA_ORDEM = ['Excelência', 'Muito bom', 'Bom', 'Atenção', 'Ação imediata'];
const CORES_BARBEIRO = ['#386AD5', '#4B7FC8', '#8B5CF6', '#EC4899'];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutSlicePath(cx: number, cy: number, rOuter: number, rInner: number, startAngle: number, endAngle: number) {
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  const outerStart = polarToCartesian(cx, cy, rOuter, endAngle);
  const outerEnd = polarToCartesian(cx, cy, rOuter, startAngle);
  const innerStart = polarToCartesian(cx, cy, rInner, startAngle);
  const innerEnd = polarToCartesian(cx, cy, rInner, endAngle);
  return [
    'M', outerStart.x, outerStart.y,
    'A', rOuter, rOuter, 0, largeArc, 0, outerEnd.x, outerEnd.y,
    'L', innerStart.x, innerStart.y,
    'A', rInner, rInner, 0, largeArc, 1, innerEnd.x, innerEnd.y,
    'Z',
  ].join(' ');
}

function DonutChart({ data, totalLabel }: { data: { label: string; value: number; color: string }[]; totalLabel: string }) {
  const total = data.reduce((a, b) => a + b.value, 0);
  if (!total) return <p className={styles.panelTitle}>Sem dados suficientes ainda.</p>;
  let cursor = 0;
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className={styles.donutWrap}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((d) => {
          if (d.value === 0) return null;
          const startAngle = (cursor / total) * 360;
          cursor += d.value;
          const endAngle = (cursor / total) * 360;
          return <path key={d.label} d={donutSlicePath(cx, cy, 80, 48, startAngle, endAngle)} fill={d.color} />;
        })}
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize="22" fontWeight="600" fill="#F5F7FA">{total}</text>
        <text x={cx} y={cy + 16} textAnchor="middle" fontSize="10" fill="#7C93B8">{totalLabel}</text>
      </svg>
      <div className={styles.donutLegend}>
        {data.filter((d) => d.value > 0).map((d) => (
          <div className={styles.legendRow} key={d.label}>
            <span className={styles.legendDot} style={{ background: d.color }} />
            <span className={styles.legendLabel}>{d.label}</span>
            <span className={styles.legendValue}>{d.value} ({Math.round((d.value / total) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChartV({ data, max, color = '#386AD5' }: { data: { label: string; value: number }[]; max: number; color?: string }) {
  const width = Math.max(320, data.length * 90);
  const height = 200;
  const barWidth = 44;
  const gap = (width - data.length * barWidth) / (data.length + 1);
  const baseline = height - 30;

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      <line x1={0} y1={baseline} x2={width} y2={baseline} stroke="rgba(245,247,250,0.14)" />
      {data.map((d, i) => {
        const x = gap + i * (barWidth + gap);
        const barHeight = max ? (d.value / max) * (baseline - 24) : 0;
        const y = baseline - barHeight;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barWidth} height={Math.max(barHeight, 0)} rx={4} fill={color} />
            <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontSize="13" fontWeight="600" fill="#F5F7FA">{d.value}</text>
            <text x={x + barWidth / 2} y={baseline + 18} textAnchor="middle" fontSize="11" fill="#7C93B8">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function avg(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
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
  const [aba, setAba] = useState<'geral' | 'barbeiro'>('geral');
  const [filtroBarbeiro, setFiltroBarbeiro] = useState('Todos');
  const [filtroFaixa, setFiltroFaixa] = useState('Todas');

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

  const analytics = useMemo(() => {
    if (!data) return null;
    const respostas = data.respostas;

    const porBarbeiroMap = new Map<string, number[]>();
    respostas.forEach((r) => {
      const arr = porBarbeiroMap.get(r.barbeiro) || [];
      if (typeof r.indice === 'number') arr.push(r.indice);
      porBarbeiroMap.set(r.barbeiro, arr);
    });

    const porBarbeiro = Array.from(porBarbeiroMap.entries()).map(([nome, valores]) => ({
      label: nome,
      value: valores.length ? Math.round(avg(valores)) : 0,
    }));

    const porBarbeiroDetalhado = Array.from(porBarbeiroMap.keys()).map((nome) => {
      const doGrupo = respostas.filter((r) => r.barbeiro === nome);
      const npsDoGrupo = doGrupo.map((r) => r.nps).filter((n): n is number => typeof n === 'number');
      const promotoresG = npsDoGrupo.filter((n) => n >= 9).length;
      const detratoresG = npsDoGrupo.filter((n) => n <= 6).length;
      const npsScoreG = npsDoGrupo.length ? Math.round(((promotoresG - detratoresG) / npsDoGrupo.length) * 100) : null;
      const notas = doGrupo.map((r) => r.notaGeral).filter((n): n is number => typeof n === 'number');
      const valoresIndice = porBarbeiroMap.get(nome);
      const indiceMedio = valoresIndice && valoresIndice.length ? Math.round(avg(valoresIndice)) : null;
      return {
        nome,
        total: doGrupo.length,
        notaMedia: notas.length ? Math.round(avg(notas) * 10) / 10 : null,
        indiceMedio,
        npsScore: npsScoreG,
      };
    }).sort((a, b) => (b.indiceMedio ?? 0) - (a.indiceMedio ?? 0));

    return { porBarbeiro, porBarbeiroDetalhado };
  }, [data]);

  const respostasFiltradas = useMemo(() => {
    if (!data) return [];
    return data.respostas.filter((r) => {
      const passaBarbeiro = filtroBarbeiro === 'Todos' || r.barbeiro === filtroBarbeiro;
      const passaFaixa = filtroFaixa === 'Todas' || r.faixa === filtroFaixa;
      return passaBarbeiro && passaFaixa;
    });
  }, [data, filtroBarbeiro, filtroFaixa]);

  const faixaPieData = data
    ? FAIXA_ORDEM.map((f) => ({ label: f, value: data.summary.porFaixa[f] || 0, color: FAIXA_COLORS[f] }))
    : [];

  return (
    <div className={`${styles.page} ${oswald.variable} ${inter.variable}`}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Central de dados</p>
        <h1 className={styles.title}>Experiência do cliente</h1>
        <p className={styles.subtitle}>Alteman&apos;s Barbearia</p>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tabBtn} ${aba === 'geral' ? styles.tabActive : ''}`} onClick={() => setAba('geral')}>Visão geral</button>
        <button className={`${styles.tabBtn} ${aba === 'barbeiro' ? styles.tabActive : ''}`} onClick={() => setAba('barbeiro')}>Por barbeiro</button>
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
        {aba === 'geral' && (
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

          <div className={styles.analysisGrid}>
            <div className={styles.chartPanel}>
              <p className={styles.panelTitle}>Índice médio por barbeiro</p>
              {analytics && <BarChartV data={analytics.porBarbeiro} max={100} />}
            </div>
            <div className={styles.chartPanel}>
              <p className={styles.panelTitle}>Distribuição por Faixa</p>
              <DonutChart data={faixaPieData} totalLabel="respostas" />
            </div>
          </div>

          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Barbeiro</span>
              {['Todos', 'Felipe Brandão', 'Hiago Martins', 'Vitor Pereira', 'Rian Fernando'].map((b) => (
                <button key={b} className={`${styles.filterChip} ${filtroBarbeiro === b ? styles.filterChipActive : ''}`} onClick={() => setFiltroBarbeiro(b)}>{b}</button>
              ))}
            </div>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Faixa</span>
              {['Todas', ...FAIXA_ORDEM].map((f) => (
                <button key={f} className={`${styles.filterChip} ${filtroFaixa === f ? styles.filterChipActive : ''}`} onClick={() => setFiltroFaixa(f)}>{f}</button>
              ))}
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
                {respostasFiltradas.map((r) => (
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

        {aba === 'barbeiro' && analytics && (
          <div className={styles.section}>
            <div className={styles.analysisGrid}>
              <div className={styles.chartPanel}>
                <p className={styles.panelTitle}>Índice médio por barbeiro</p>
                <BarChartV data={analytics.porBarbeiro} max={100} />
              </div>
              <div className={styles.chartPanel}>
                <p className={styles.panelTitle}>Participação (atendimentos avaliados)</p>
                <DonutChart
                  data={analytics.porBarbeiroDetalhado.map((b, i) => ({ label: b.nome, value: b.total, color: CORES_BARBEIRO[i % CORES_BARBEIRO.length] }))}
                  totalLabel="atendimentos"
                />
              </div>
            </div>
            <div className={styles.barbeiroGrid}>
              {analytics.porBarbeiroDetalhado.map((b) => (
                <div className={styles.barbeiroCard} key={b.nome}>
                  <p className={styles.barbeiroNome}>{b.nome}</p>
                  <div className={styles.barbeiroMetric}><span>Atendimentos avaliados</span><b>{b.total}</b></div>
                  <div className={styles.barbeiroMetric}><span>Nota geral média</span><b>{b.notaMedia ?? '—'}</b></div>
                  <div className={styles.barbeiroMetric}><span>Índice médio</span><b>{b.indiceMedio ?? '—'}</b></div>
                  <div className={styles.barbeiroMetric}><span>NPS Score</span><b>{b.npsScore ?? '—'}</b></div>
                </div>
              ))}
            </div>
          </div>
        )}
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
