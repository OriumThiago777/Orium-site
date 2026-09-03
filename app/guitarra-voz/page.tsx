import Reveal from '@/components/Reveal';
import ChordDiagram from '@/components/guitarra-voz/ChordDiagram';
import {
  getModulos,
  getMusicas,
  getAcordes,
  getEscalas,
  DIFICULDADE_LABEL,
  DIFICULDADE_ORDEM,
} from '@/lib/guitarra-voz-content';
import styles from './guitarra-voz.module.css';

const ANCORAS = [
  { href: '#modulos', label: 'Módulos' },
  { href: '#repertorio', label: 'Repertório' },
  { href: '#acordes', label: 'Acordes' },
  { href: '#escalas', label: 'Escalas e Modos' },
  { href: '#teoria', label: 'Teoria' },
];

const ESCALA_GRUPOS: { categoria: 'diatonica' | 'pentatonica' | 'blues' | 'modo-grego'; titulo: string; vazio: string }[] = [
  { categoria: 'diatonica', titulo: 'Escalas diatônicas', vazio: 'Nenhuma escala diatônica cadastrada ainda.' },
  { categoria: 'pentatonica', titulo: 'Pentatônicas', vazio: 'Nenhuma pentatônica cadastrada ainda.' },
  { categoria: 'blues', titulo: 'Escala de blues', vazio: 'Nenhuma escala de blues cadastrada ainda.' },
  { categoria: 'modo-grego', titulo: 'Modos gregos', vazio: 'Nenhum modo grego cadastrado ainda.' },
];

const SCROLL_OFFSET = { scrollMarginTop: '84px' } as const;

export default function GuitarraVozLanding() {
  const modulos = getModulos();
  const musicas = getMusicas();
  const acordes = getAcordes();
  const escalas = getEscalas();
  const acordesMap = new Map(acordes.map((a) => [a.slug, a]));

  return (
    <>
      <section className={styles.gvSection} style={{ paddingTop: '5rem', paddingBottom: '2rem' }}>
        <h1 className={styles.gvDisplay}>Guitarra e Voz</h1>
        <p className={styles.gvBody} style={{ color: 'var(--gv-muted)', marginTop: '0.75rem' }}>
          Material de estudo pessoal
        </p>
        <nav aria-label="Seções da página" style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap', marginTop: '2rem' }}>
          {ANCORAS.map((ancora) => (
            <a key={ancora.href} href={ancora.href} className={styles.gvLabel} style={{ color: 'var(--gv-amber)' }}>
              {ancora.label}
            </a>
          ))}
        </nav>
      </section>

      {/* MÓDULOS */}
      <section id="modulos" className={styles.gvSection} style={SCROLL_OFFSET}>
        <Reveal>
          <p className={styles.gvLabel}>Trilha completa</p>
          <h2 className={styles.gvHeading} style={{ marginTop: '0.5rem' }}>Módulos</h2>
        </Reveal>
        <div style={{ marginTop: '2rem' }}>
          {modulos.map((modulo) => (
            <div key={modulo.slug} style={{ borderTop: '1px solid var(--gv-border)', padding: '2.5rem 0' }}>
              <p className={styles.gvLabel} style={{ color: 'var(--gv-red)' }}>
                Módulo {String(modulo.numero).padStart(2, '0')}
              </p>
              <h3 className={styles.gvHeading} style={{ fontSize: '1.4rem', marginTop: '0.5rem' }}>
                {modulo.titulo}
              </h3>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.1rem' }}>
                {modulo.topicos.map((topico) => (
                  <li key={topico} className={styles.gvBody} style={{ marginBottom: '0.4rem' }}>
                    {topico}
                  </li>
                ))}
              </ul>
              {modulo.acordesIntroduzidos.length > 0 && (
                <p className={styles.gvSmall} style={{ marginTop: '1rem' }}>
                  Acordes introduzidos:{' '}
                  {modulo.acordesIntroduzidos.map((slug) => acordesMap.get(slug)?.name ?? slug).join(', ')}
                </p>
              )}
              <p className={styles.gvBody} style={{ marginTop: '1rem', color: 'var(--gv-amber)' }}>
                Conquista final: {modulo.conquistaFinal}
              </p>
              <p className={styles.gvSmall} style={{ marginTop: '0.75rem' }}>
                {modulo.preRequisito === null
                  ? 'Sem pré-requisito — pode começar aqui'
                  : `Pré-requisito: Módulo ${modulo.preRequisito}`}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* REPERTÓRIO */}
      <section id="repertorio" className={styles.gvSection} style={SCROLL_OFFSET}>
        <Reveal>
          <p className={styles.gvLabel}>Repertório</p>
          <h2 className={styles.gvHeading} style={{ marginTop: '0.5rem' }}>Músicas para tocar</h2>
        </Reveal>
        {DIFICULDADE_ORDEM.map((dificuldade) => {
          const grupo = musicas.filter((m) => m.dificuldade === dificuldade);
          if (grupo.length === 0) return null;
          return (
            <div key={dificuldade} style={{ marginTop: '2.5rem' }}>
              <p className={styles.gvLabel} style={{ color: 'var(--gv-red)' }}>{DIFICULDADE_LABEL[dificuldade]}</p>
              <div style={{ marginTop: '1rem' }}>
                {grupo.map((musica) => (
                  <div key={musica.slug} style={{ borderTop: '1px solid var(--gv-border)', padding: '2rem 0' }}>
                    <h3 className={styles.gvHeading} style={{ fontSize: '1.3rem' }}>{musica.titulo}</h3>
                    <p className={styles.gvSmall} style={{ marginTop: '0.3rem' }}>
                      {musica.artista} · {musica.bpm} BPM
                    </p>
                    <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
                      {musica.acordes.map((slug) => {
                        const acorde = acordesMap.get(slug);
                        if (!acorde) return null;
                        return (
                          <ChordDiagram
                            key={slug}
                            name={acorde.name}
                            frets={acorde.frets}
                            fingers={acorde.fingers}
                            barre={acorde.barre}
                            startFret={acorde.startFret}
                            size="sm"
                          />
                        );
                      })}
                    </div>
                    <p className={styles.gvBody} style={{ marginTop: '1.25rem' }}>{musica.estrategiaEstudo}</p>
                    <a
                      href={musica.linkCifraClub}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.gvBtnSecondary}
                      style={{ marginTop: '1rem', display: 'inline-flex' }}
                    >
                      Ver cifra no Cifra Club →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* ACORDES */}
      <section id="acordes" className={styles.gvSection} style={SCROLL_OFFSET}>
        <Reveal>
          <p className={styles.gvLabel}>Dicionário</p>
          <h2 className={styles.gvHeading} style={{ marginTop: '0.5rem' }}>Acordes</h2>
        </Reveal>
        <div className={styles.gvAcordesGrid} style={{ marginTop: '2rem' }}>
          {acordes.map((acorde) => (
            <div key={acorde.slug} style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>
              <ChordDiagram
                name={acorde.name}
                frets={acorde.frets}
                fingers={acorde.fingers}
                barre={acorde.barre}
                startFret={acorde.startFret}
                size="lg"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ESCALAS E MODOS */}
      <section id="escalas" className={styles.gvSection} style={SCROLL_OFFSET}>
        <Reveal>
          <p className={styles.gvLabel}>Teoria aplicada</p>
          <h2 className={styles.gvHeading} style={{ marginTop: '0.5rem' }}>Escalas e Modos</h2>
        </Reveal>
        {ESCALA_GRUPOS.map((grupo) => {
          const itens = escalas.filter((e) => e.categoria === grupo.categoria);
          return (
            <div key={grupo.categoria} style={{ marginTop: '2.5rem' }}>
              <p className={styles.gvLabel} style={{ color: 'var(--gv-red)' }}>{grupo.titulo}</p>
              {itens.length === 0 ? (
                <p className={styles.gvSmall} style={{ marginTop: '1rem' }}>{grupo.vazio}</p>
              ) : (
                <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '480px' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', borderBottom: '1px solid var(--gv-border)', padding: '0.6rem 0.75rem 0.6rem 0' }} className={styles.gvLabel}>
                          Nome
                        </th>
                        <th style={{ textAlign: 'left', borderBottom: '1px solid var(--gv-border)', padding: '0.6rem 0.75rem' }} className={styles.gvLabel}>
                          Fórmula
                        </th>
                        <th style={{ textAlign: 'left', borderBottom: '1px solid var(--gv-border)', padding: '0.6rem 0.75rem' }} className={styles.gvLabel}>
                          Aplicação
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {itens.map((escala) => (
                        <tr key={escala.slug}>
                          <td style={{ padding: '0.75rem 0.75rem 0.75rem 0', borderBottom: '1px solid var(--gv-border)' }} className={styles.gvBody}>
                            {escala.nome}
                          </td>
                          <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--gv-border)' }} className={styles.gvSmall}>
                            {escala.intervalos.join(' – ')}
                          </td>
                          <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--gv-border)' }} className={styles.gvSmall}>
                            {escala.descricao}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* TEORIA — MÓDULO 8 */}
      <section id="teoria" className={styles.gvSection} style={{ ...SCROLL_OFFSET, paddingBottom: '7rem' }}>
        <Reveal>
          <p className={styles.gvLabel}>Módulo 8</p>
          <h2 className={styles.gvHeading} style={{ marginTop: '0.5rem' }}>Teoria Aplicada</h2>
          <p className={styles.gvBody} style={{ color: 'var(--gv-muted)', marginTop: '1rem', maxWidth: '620px' }}>
            As 8 aulas deste módulo ainda não foram adicionadas aqui — assim que o conteúdo (modulo-8-aulas.md) for
            colado em <code>content/guitarra-voz/</code>, esta seção passa a expor cada aula por completo.
          </p>
        </Reveal>
      </section>
    </>
  );
}
