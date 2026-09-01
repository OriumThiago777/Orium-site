import Reveal from '@/components/Reveal';
import { getModulos, getAcordes } from '@/lib/guitarra-voz-content';
import styles from '../guitarra-voz.module.css';

function nomesAcordes(slugs: string[], acordesMap: Map<string, string>): string {
  return slugs.map((slug) => acordesMap.get(slug) ?? slug).join(', ');
}

export default function ModulosPage() {
  const modulos = getModulos();
  const acordesMap = new Map(getAcordes().map((a) => [a.slug, a.name]));

  return (
    <section className={styles.gvSection} style={{ paddingTop: '4rem' }}>
      <p className={styles.gvLabel}>Trilha completa</p>
      <h1 className={styles.gvDisplay} style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Módulos</h1>
      <p className={styles.gvBody} style={{ color: 'var(--gv-muted)', marginTop: '1rem', maxWidth: '620px' }}>
        {modulos.length} módulos progressivos, do zero absoluto até a primeira apresentação.
      </p>

      <div
        className={styles.gvGrid}
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginTop: '2.5rem' }}
      >
        {modulos.map((modulo, i) => (
          <Reveal key={modulo.slug} delay={i * 0.04}>
            <div className={styles.gvCard}>
              <p className={styles.gvCardNumber}>{String(modulo.numero).padStart(2, '0')}</p>
              <p className={styles.gvLabel} style={{ position: 'relative' }}>Módulo {modulo.numero}</p>
              <p className={styles.gvHeading} style={{ position: 'relative', fontSize: '1.3rem', marginTop: '0.4rem' }}>
                {modulo.titulo}
              </p>
              <ul style={{ position: 'relative', marginTop: '1rem', paddingLeft: '1.1rem' }}>
                {modulo.topicos.map((topico) => (
                  <li key={topico} className={styles.gvSmall} style={{ marginBottom: '0.3rem' }}>
                    {topico}
                  </li>
                ))}
              </ul>
              {modulo.acordesIntroduzidos.length > 0 && (
                <p className={styles.gvSmall} style={{ position: 'relative', marginTop: '1rem' }}>
                  Acordes novos: {nomesAcordes(modulo.acordesIntroduzidos, acordesMap)}
                </p>
              )}
              <p className={styles.gvBody} style={{ position: 'relative', marginTop: '1rem', color: 'var(--gv-amber)' }}>
                Conquista final: {modulo.conquistaFinal}
              </p>
              <p className={styles.gvSmall} style={{ position: 'relative', marginTop: '1rem' }}>
                {modulo.preRequisito === null
                  ? 'Sem pré-requisito — pode começar aqui'
                  : `Pré-requisito: Módulo ${modulo.preRequisito}`}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
