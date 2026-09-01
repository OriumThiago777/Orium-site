'use client';

import { useMemo, useState } from 'react';
import {
  getMusicas,
  getAcordes,
  DIFICULDADE_LABEL,
  DIFICULDADE_ORDEM,
  type Dificuldade,
} from '@/lib/guitarra-voz-content';
import styles from '../guitarra-voz.module.css';

const FILTRO_TODAS = 'todas' as const;
type Filtro = Dificuldade | typeof FILTRO_TODAS;

export default function RepertorioPage() {
  const [filtro, setFiltro] = useState<Filtro>(FILTRO_TODAS);
  const musicas = getMusicas();
  const acordesMap = useMemo(() => new Map(getAcordes().map((a) => [a.slug, a.name])), []);

  const musicasFiltradas = filtro === FILTRO_TODAS ? musicas : musicas.filter((m) => m.dificuldade === filtro);

  return (
    <section className={styles.gvSection} style={{ paddingTop: '4rem' }}>
      <p className={styles.gvLabel}>Repertório</p>
      <h1 className={styles.gvDisplay} style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Músicas para tocar</h1>
      <p className={styles.gvBody} style={{ color: 'var(--gv-muted)', marginTop: '1rem', maxWidth: '620px' }}>
        {musicas.length} músicas organizadas por dificuldade, com cifra, acordes necessários e estratégia de estudo.
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '2rem' }}>
        <button
          type="button"
          onClick={() => setFiltro(FILTRO_TODAS)}
          className={filtro === FILTRO_TODAS ? styles.gvBtnPrimary : styles.gvBtnSecondary}
        >
          Todas
        </button>
        {DIFICULDADE_ORDEM.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setFiltro(d)}
            className={filtro === d ? styles.gvBtnPrimary : styles.gvBtnSecondary}
          >
            {DIFICULDADE_LABEL[d]}
          </button>
        ))}
      </div>

      <div
        className={styles.gvGrid}
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginTop: '2rem' }}
      >
        {musicasFiltradas.map((musica) => (
          <div key={musica.slug} className={styles.gvCard}>
            <p className={styles.gvLabel} style={{ color: 'var(--gv-red)' }}>
              {DIFICULDADE_LABEL[musica.dificuldade]}
            </p>
            <p className={styles.gvHeading} style={{ fontSize: '1.2rem', marginTop: '0.4rem' }}>{musica.titulo}</p>
            <p className={styles.gvSmall}>
              {musica.artista} · {musica.bpm} BPM
            </p>
            <p className={styles.gvSmall} style={{ marginTop: '0.75rem' }}>
              Acordes: {musica.acordes.map((slug) => acordesMap.get(slug) ?? slug).join(', ')}
            </p>
            <p className={styles.gvBody} style={{ marginTop: '0.75rem' }}>{musica.estrategiaEstudo}</p>
            <a
              href={musica.linkCifraClub}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.gvBtnSecondary}
              style={{ marginTop: '1rem', display: 'inline-flex' }}
            >
              Ver cifra →
            </a>
          </div>
        ))}
        {musicasFiltradas.length === 0 && (
          <p className={styles.gvSmall}>Nenhuma música nessa dificuldade ainda.</p>
        )}
      </div>
    </section>
  );
}
