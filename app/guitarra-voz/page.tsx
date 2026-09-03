import Reveal from '@/components/Reveal';
import ChordDiagram from '@/components/guitarra-voz/ChordDiagram';
import StruPattern from '@/components/guitarra-voz/StruPattern';
import ProgressBadge from '@/components/guitarra-voz/ProgressBadge';
import styles from './guitarra-voz.module.css';

const PROMESSAS = [
  'Sair do zero absoluto e tocar sua primeira música completa em semanas, não meses',
  'Cantar e tocar ao mesmo tempo sem perder o ritmo',
  'Entender teoria o suficiente para aprender qualquer música sozinho',
  'Construir um repertório real de músicas que você gosta de tocar',
  'Ganhar confiança para se apresentar, mesmo que seja só para os amigos',
];

const MODULOS_PREVIEW = [
  { numero: 1, titulo: 'Primeiros Contatos com a Guitarra' },
  { numero: 2, titulo: 'Ritmo e Coordenação' },
  { numero: 3, titulo: 'Fundamentos do Canto' },
  { numero: 4, titulo: 'Integração Guitarra e Voz' },
  { numero: 5, titulo: 'Guitarra de Acompanhamento' },
  { numero: 6, titulo: 'Desenvolvimento Vocal' },
  { numero: 7, titulo: 'Repertório Progressivo' },
  { numero: 8, titulo: 'Teoria Aplicada' },
  { numero: 9, titulo: 'Performance' },
];

const ELEMENTOS_AULA = [
  'Título e objetivo', 'O que você aprenderá', 'Por que isso importa', 'Explicação teórica',
  'Demonstração e exemplos', 'Aquecimento de guitarra', 'Aquecimento vocal', 'Exercício técnico',
  'Exercício de ritmo', 'Exercício de canto', 'Integração voz + guitarra', 'Aplicação em uma música',
  'Erros mais comuns', 'Como corrigir cada erro', 'Rotina de prática', 'Meta mensurável',
  'Checklist de conclusão', 'Teste final', 'O que gravar para avaliação', 'Próximo passo',
];

const ROTINAS = [
  { duracao: '15 min', foco: 'Manutenção', descricao: 'Aquecimento rápido + revisão de um exercício técnico do módulo atual.' },
  { duracao: '30 min', foco: 'Progresso constante', descricao: 'Aquecimento, exercício técnico, 10 min de repertório, 5 min de canto isolado.' },
  { duracao: '60 min', foco: 'Sessão completa', descricao: 'Aquecimento, técnica, ritmo, integração voz+guitarra, repertório e gravação de avaliação.' },
];

const REPERTORIO_PREVIEW = [
  { dificuldade: 'Muito fácil', musica: 'Pais e Filhos', artista: 'Legião Urbana' },
  { dificuldade: 'Fácil', musica: 'Wish You Were Here', artista: 'Pink Floyd' },
  { dificuldade: 'Intermediária', musica: 'Comfortably Numb', artista: 'Pink Floyd' },
  { dificuldade: 'Desafio', musica: 'Stairway to Heaven', artista: 'Led Zeppelin' },
];

const AVALIACOES = [
  { semana: 'Semana 1', item: 'Diagnóstico inicial — ponto de partida e módulo sugerido' },
  { semana: 'Semana 6', item: 'Primeira gravação — progressão de 4 acordes com ritmo estável' },
  { semana: 'Semana 12', item: 'Primeira música completa com voz e guitarra' },
  { semana: 'Semana 18', item: 'Repertório de 3 músicas encadeadas sem parar' },
  { semana: 'Semana 24', item: 'Apresentação simulada — 5 músicas gravadas em sequência' },
];

const MATERIAIS = [
  'Tabela de acordes', 'Cronograma de 24 semanas', 'Checklist por módulo', 'Ficha de música em branco',
  'Guia de afinação', 'Diagrama de escala pentatônica', 'Tabela de campo harmônico', 'Guia de capotraste',
  'Checklist de aquecimento vocal', 'Guia de postura', 'Glossário de termos', 'Roteiro de gravação para avaliação',
];

export default function GuitarraVozLanding() {
  return (
    <>
      <section className={styles.gvSection} style={{ paddingTop: '6rem', textAlign: 'center' }}>
        <p className={styles.gvLabel} style={{ marginBottom: '1rem' }}>Guitarra e Voz</p>
        <h1 className={styles.gvDisplay}>
          Do Primeiro Acorde
          <br />
          à Primeira Apresentação
        </h1>
        <p className={styles.gvBody} style={{ maxWidth: '620px', margin: '1.5rem auto 0', color: 'var(--gv-muted)' }}>
          Uma trilha progressiva de 9 módulos para sair do zero e chegar a tocar e cantar músicas completas com confiança.
        </p>
        <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', margin: '2.5rem 0', flexWrap: 'wrap' }}>
          {[['24', 'semanas'], ['9', 'módulos'], ['5+', 'músicas']].map(([num, label]) => (
            <div key={label}>
              <p className={styles.gvHeading} style={{ color: 'var(--gv-red)' }}>{num}</p>
              <p className={styles.gvLabel}>{label}</p>
            </div>
          ))}
        </div>
        {/* <Link href="/guitarra-voz/diagnostico" className={styles.gvBtnPrimary}>
          Fazer diagnóstico gratuito →
        </Link> */}
      </section>

      <section className={styles.gvSection}>
        <Reveal>
          <h2 className={styles.gvHeading}>O que você vai construir</h2>
        </Reveal>
        <div className={styles.gvGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginTop: '2rem' }}>
          {PROMESSAS.map((promessa, i) => (
            <Reveal key={promessa} delay={i * 0.05}>
              <div className={styles.gvCard}>
                <p className={styles.gvCardNumber}>{String(i + 1).padStart(2, '0')}</p>
                <p className={styles.gvBody} style={{ position: 'relative' }}>{promessa}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={styles.gvSection}>
        <Reveal>
          <h2 className={styles.gvHeading}>9 módulos progressivos</h2>
        </Reveal>
        <div className={styles.gvGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginTop: '2rem' }}>
          {MODULOS_PREVIEW.map((modulo, i) => (
            <Reveal key={modulo.numero} delay={i * 0.03}>
              <div className={styles.gvCard}>
                <p className={styles.gvCardNumber}>{String(modulo.numero).padStart(2, '0')}</p>
                <p className={styles.gvLabel} style={{ position: 'relative' }}>Módulo {modulo.numero}</p>
                <p className={styles.gvBody} style={{ position: 'relative', marginTop: '0.5rem' }}>{modulo.titulo}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={styles.gvSection}>
        <Reveal>
          <h2 className={styles.gvHeading}>Cada aula tem estrutura completa</h2>
          <p className={styles.gvBody} style={{ color: 'var(--gv-muted)', marginTop: '0.5rem' }}>
            20 elementos fixos garantem que nada fica pela metade — da teoria até o que gravar para avaliação.
          </p>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginTop: '2rem' }}>
          {ELEMENTOS_AULA.map((elemento, i) => (
            <div
              key={elemento}
              style={{ border: '1px solid var(--gv-border)', padding: '0.75rem 1rem', display: 'flex', gap: '0.6rem', alignItems: 'center' }}
            >
              <span className={styles.gvLabel} style={{ color: 'var(--gv-red)' }}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.gvSmall}>{elemento}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.gvSection}>
        <Reveal>
          <h2 className={styles.gvHeading}>Rotinas de prática</h2>
        </Reveal>
        <div className={styles.gvGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginTop: '2rem' }}>
          {ROTINAS.map((rotina) => (
            <div key={rotina.duracao} className={styles.gvCard}>
              <p className={styles.gvHeading} style={{ color: 'var(--gv-amber)', fontSize: '2rem' }}>{rotina.duracao}</p>
              <p className={styles.gvLabel}>{rotina.foco}</p>
              <p className={styles.gvBody} style={{ marginTop: '0.5rem' }}>{rotina.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.gvSection}>
        <Reveal>
          <h2 className={styles.gvHeading}>Progresso claro, sem achismo</h2>
        </Reveal>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
          <ProgressBadge state="nao-dominado" />
          <ProgressBadge state="em-desenvolvimento" />
          <ProgressBadge state="dominado" />
        </div>
        <div style={{ marginTop: '2.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <ChordDiagram name="Am" frets={[-1, 0, 2, 2, 1, 0]} fingers={[0, 0, 2, 3, 1, 0]} size="md" />
          <ChordDiagram
            name="F"
            frets={[1, 3, 3, 2, 1, 1]}
            fingers={[1, 3, 4, 2, 1, 1]}
            barre={{ fret: 1, fromString: 0, toString: 5, finger: 1 }}
            size="md"
          />
          <StruPattern label="Padrão básico — D DU UDU" strokes={['down', 'rest', 'down', 'up', 'rest', 'up', 'down', 'up']} />
        </div>
      </section>

      <section className={styles.gvSection}>
        <Reveal>
          <h2 className={styles.gvHeading}>Repertório real, por dificuldade</h2>
        </Reveal>
        <div className={styles.gvGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginTop: '2rem' }}>
          {REPERTORIO_PREVIEW.map((item) => (
            <div key={item.musica} className={styles.gvCard}>
              <p className={styles.gvLabel}>{item.dificuldade}</p>
              <p className={styles.gvBody} style={{ marginTop: '0.5rem', fontWeight: 600 }}>{item.musica}</p>
              <p className={styles.gvSmall}>{item.artista}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.gvSection}>
        <Reveal>
          <h2 className={styles.gvHeading}>Marcos de avaliação nas 24 semanas</h2>
        </Reveal>
        <div style={{ marginTop: '2rem', borderLeft: '2px solid var(--gv-border)', paddingLeft: '1.5rem' }}>
          {AVALIACOES.map((marco) => (
            <div key={marco.semana} style={{ marginBottom: '1.5rem' }}>
              <p className={styles.gvLabel} style={{ color: 'var(--gv-red)' }}>{marco.semana}</p>
              <p className={styles.gvBody}>{marco.item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.gvSection}>
        <Reveal>
          <h2 className={styles.gvHeading}>Materiais de apoio</h2>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '2rem' }}>
          {MATERIAIS.map((material) => (
            <div key={material} style={{ border: '1px solid var(--gv-border)', padding: '1rem' }} className={styles.gvSmall}>
              {material}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.gvSection} style={{ textAlign: 'center', paddingBottom: '7rem' }}>
        <Reveal>
          <h2 className={styles.gvHeading}>Pronto para começar?</h2>
          <p className={styles.gvBody} style={{ color: 'var(--gv-muted)', margin: '1rem 0 2rem' }}>
            8 a 10 perguntas. No final, você recebe o módulo de partida e as primeiras músicas indicadas.
          </p>
          {/* <Link href="/guitarra-voz/diagnostico" className={styles.gvBtnPrimary}>
            Fazer diagnóstico gratuito →
          </Link> */}
        </Reveal>
      </section>
    </>
  );
}
