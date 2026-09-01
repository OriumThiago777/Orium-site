'use client';

import { useMemo, useState } from 'react';
import ChordDiagram from '@/components/guitarra-voz/ChordDiagram';
import { getAcordes, type CategoriaAcorde } from '@/lib/guitarra-voz-content';
import styles from '../guitarra-voz.module.css';

const CATEGORIA_LABEL: Record<CategoriaAcorde, string> = {
  maior: 'Maiores',
  menor: 'Menores',
  setima: 'Sétimas',
  suspenso: 'Suspensos',
};

const FILTRO_TODOS = 'todos' as const;
type Filtro = CategoriaAcorde | typeof FILTRO_TODOS;

export default function AcordesPage() {
  const [filtro, setFiltro] = useState<Filtro>(FILTRO_TODOS);
  const acordes = getAcordes();
  const categorias = useMemo(() => Array.from(new Set(acordes.map((a) => a.categoria))), [acordes]);
  const acordesFiltrados = filtro === FILTRO_TODOS ? acordes : acordes.filter((a) => a.categoria === filtro);

  return (
    <section className={styles.gvSection} style={{ paddingTop: '4rem' }}>
      <p className={styles.gvLabel}>Dicionário</p>
      <h1 className={styles.gvDisplay} style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Acordes</h1>
      <p className={styles.gvBody} style={{ color: 'var(--gv-muted)', marginTop: '1rem', maxWidth: '620px' }}>
        {acordes.length} acordes com diagrama de posição, do básico ao com pestana.
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '2rem' }}>
        <button
          type="button"
          onClick={() => setFiltro(FILTRO_TODOS)}
          className={filtro === FILTRO_TODOS ? styles.gvBtnPrimary : styles.gvBtnSecondary}
        >
          Todos
        </button>
        {categorias.map((categoria) => (
          <button
            key={categoria}
            type="button"
            onClick={() => setFiltro(categoria)}
            className={filtro === categoria ? styles.gvBtnPrimary : styles.gvBtnSecondary}
          >
            {CATEGORIA_LABEL[categoria]}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '1.5rem',
          marginTop: '2.5rem',
        }}
      >
        {acordesFiltrados.map((acorde) => (
          <div
            key={acorde.slug}
            style={{ border: '1px solid var(--gv-border)', padding: '1.25rem 1rem', textAlign: 'center' }}
          >
            <ChordDiagram
              name={acorde.name}
              frets={acorde.frets}
              fingers={acorde.fingers}
              barre={acorde.barre}
              startFret={acorde.startFret}
              size="md"
            />
          </div>
        ))}
        {acordesFiltrados.length === 0 && (
          <p className={styles.gvSmall}>Nenhum acorde nessa categoria ainda.</p>
        )}
      </div>
    </section>
  );
}
