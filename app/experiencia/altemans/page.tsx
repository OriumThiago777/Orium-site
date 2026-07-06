'use client';

import { useEffect, useState } from 'react';
import { Oswald, Inter } from 'next/font/google';
import styles from './styles.module.css';

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-oswald',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
});

type StepType = 'welcome' | 'rating' | 'choice' | 'nps' | 'chips' | 'text' | 'thanks';

interface StepDef {
  id: string;
  type: StepType;
  label?: string;
  question?: string;
  hint?: string;
  options?: string[];
}

const FALLBACK_STEPS: StepDef[] = [
  { id: 'welcome', type: 'welcome' },
  { id: 'geral', type: 'rating', label: 'Nota geral', question: 'Como foi sua experiência hoje?' },
  { id: 'barbeiro', type: 'choice', label: 'Atendimento', question: 'Quem realizou seu atendimento?', options: ['Felipe Brandão', 'Hiago Martins', 'Vitor Pereira', 'Rian Fernando'] },
  { id: 'recepcao', type: 'rating', label: 'Atendimento', question: 'A recepção foi boa e você se sentiu bem tratado?' },
  { id: 'entendimento', type: 'rating', label: 'Atendimento', question: 'O barbeiro entendeu exatamente o que você queria?' },
  { id: 'resultado', type: 'rating', label: 'Serviço', question: 'O resultado ficou como você esperava?' },
  { id: 'tempo', type: 'rating', label: 'Serviço', question: 'O tempo de atendimento foi adequado?' },
  { id: 'estrutura', type: 'rating', label: 'Estrutura', question: 'Como você avalia o ambiente: limpeza, conforto e organização?' },
  { id: 'nps', type: 'nps', label: 'Recomendação', question: "De 0 a 10, qual a chance de você indicar a Alteman's para um amigo?" },
  { id: 'destaque', type: 'chips', label: 'Destaque', question: 'O que mais chamou sua atenção hoje?', options: ['Atendimento', 'Corte', 'Barba', 'Ambiente', 'Rapidez', 'Preço', 'Outro'] },
  { id: 'mensagem', type: 'text', label: 'Mensagem', question: 'Tem algo que a gente devia saber?', hint: 'Opcional. Elogio, crítica ou sugestão vai direto pro dono.' },
  { id: 'thanks', type: 'thanks' },
];

const RESET_DELAY_MS = 6000;
const ADVANCE_DELAY_MS = 260;
const CACHE_KEY = 'altemans_perguntas_cache_v1';

interface PerguntaRemota {
  ordem: number;
  chave: string;
  tipo: string;
  rotulo: string;
  pergunta: string;
  dica: string;
  opcoes: string[];
  ativo: boolean;
}

function montarSteps(perguntas: PerguntaRemota[]): StepDef[] {
  const dinamicos: StepDef[] = perguntas
    .filter((p) => p.ativo)
    .sort((a, b) => a.ordem - b.ordem)
    .map((p) => ({
      id: p.chave,
      type: p.tipo as StepType,
      label: p.rotulo,
      question: p.pergunta,
      hint: p.dica || undefined,
      options: p.opcoes?.length ? p.opcoes : undefined,
    }));

  if (dinamicos.length === 0) return FALLBACK_STEPS;

  return [{ id: 'welcome', type: 'welcome' }, ...dinamicos, { id: 'thanks', type: 'thanks' }];
}

function lerCache(): StepDef[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function salvarCache(steps: StepDef[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(steps));
  } catch {
    // localStorage indisponível (modo privado, etc.) — segue sem cache
  }
}

interface Answers {
  geral?: number;
  barbeiro?: string;
  recepcao?: number;
  entendimento?: number;
  resultado?: number;
  tempo?: number;
  estrutura?: number;
  nps?: number;
  destaque?: string[];
  mensagem?: string;
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.8 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.2l7.1-.6z" />
    </svg>
  );
}

export default function ExperienciaAltemansPage() {
  const [steps, setSteps] = useState<StepDef[]>(FALLBACK_STEPS);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const step = steps[idx];

  useEffect(() => {
    const cache = lerCache();
    if (cache) setSteps(cache);

    fetch('/api/experiencia/altemans/perguntas')
      .then((res) => {
        if (!res.ok) throw new Error('Falha ao carregar perguntas');
        return res.json();
      })
      .then((json: { perguntas: PerguntaRemota[] }) => {
        const novosSteps = montarSteps(json.perguntas || []);
        setSteps(novosSteps);
        salvarCache(novosSteps);
      })
      .catch((err) => {
        console.error('Não foi possível carregar perguntas do Notion, usando cache/padrão local:', err);
      });
  }, []);

  useEffect(() => {
    if (step.type !== 'thanks') return;
    const t = setTimeout(() => {
      setAnswers({});
      setIdx(0);
    }, RESET_DELAY_MS);
    return () => clearTimeout(t);
  }, [step.type]);

  function goNext() {
    setIdx((i) => i + 1);
  }
  function goBack() {
    setIdx((i) => Math.max(1, i - 1));
  }

  const questionSteps = steps.filter((s) => s.type !== 'welcome' && s.type !== 'thanks');
  const TOTAL = questionSteps.length;
  const questionIndex = questionSteps.findIndex((s) => s.id === step.id) + 1;
  const isLastQuestion = questionIndex === TOTAL;

  function selectAndAdvance<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers((a) => ({ ...a, [key]: value }));
    setTimeout(() => {
      if (isLastQuestion) submitForm();
      else goNext();
    }, ADVANCE_DELAY_MS);
  }

  function toggleChip(key: keyof Answers, value: string) {
    setAnswers((a) => {
      const arr = (a[key] as string[] | undefined) || [];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...a, [key]: next };
    });
  }

  async function submitForm() {
    try {
      await fetch('/api/experiencia/altemans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
    } catch (err) {
      console.error('Falha ao enviar avaliação para a Alteman\'s:', err);
    } finally {
      goNext();
    }
  }

  return (
    <div className={`${styles.page} ${oswald.variable} ${inter.variable}`}>
      <div className={styles.stage}>
        <div className={styles.frame}>
          {step.type === 'welcome' && (
            <div className={styles.centerScreen}>
              <img className={styles.mark} src="/logo-altemans.png" alt="Alteman's Barbearia" />
              <h1>Avaliação da experiência</h1>
              <p>Sua opinião ajuda a gente a melhorar o que não está visível pra você, mas está pro seu próximo corte. Leva menos de 2 minutos.</p>
              <button className={styles.startBtn} onClick={goNext}>Avaliar agora</button>
            </div>
          )}

          {step.type === 'thanks' && (
            <div className={styles.centerScreen}>
              <img className={styles.mark} src="/logo-altemans.png" alt="Alteman's Barbearia" />
              <h1>Valeu!</h1>
              <p>Sua avaliação já chegou pra gente. Até o próximo corte.</p>
            </div>
          )}

          {step.type !== 'welcome' && step.type !== 'thanks' && (
            <>
              <div className={styles.topbar}>
                <div className={styles.ticket}>
                  <span>Ficha</span>
                  <b>{String(questionIndex).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}</b>
                </div>
                <div className={styles.progressTrack}>
                  {questionSteps.map((_, i) => (
                    <div className={styles.progressSeg} key={i}>
                      <i className={i < questionIndex ? styles.filled : ''} />
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.content}>
                <span className={styles.eyebrow}>{step.label}</span>
                <h1 className={styles.question}>{step.question}</h1>
                {step.hint && <span className={styles.hint}>{step.hint}</span>}

                {step.type === 'rating' && (
                  <>
                    <div className={styles.stars}>
                      {[1, 2, 3, 4, 5].map((n) => {
                        const val = answers[step.id as keyof Answers] as number | undefined;
                        const lit = (val || 0) >= n;
                        return (
                          <button
                            key={n}
                            className={`${styles.starBtn} ${lit ? styles.lit : ''}`}
                            onClick={() => selectAndAdvance(step.id as keyof Answers, n as never)}
                          >
                            <StarIcon />
                          </button>
                        );
                      })}
                    </div>
                    <div className={styles.scaleLabels}><span>Ruim</span><span>Excelente</span></div>
                  </>
                )}

                {step.type === 'choice' && (
                  <div className={styles.choiceList}>
                    {step.options?.map((o) => (
                      <button
                        key={o}
                        className={`${styles.choiceBtn} ${answers[step.id as keyof Answers] === o ? styles.selected : ''}`}
                        onClick={() => selectAndAdvance(step.id as keyof Answers, o as never)}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                )}

                {step.type === 'nps' && (
                  <>
                    <div className={styles.npsGrid}>
                      {Array.from({ length: 11 }, (_, n) => n).map((n) => (
                        <button
                          key={n}
                          className={`${styles.npsBtn} ${answers.nps === n ? styles.selected : ''}`}
                          onClick={() => selectAndAdvance('nps', n)}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <div className={styles.npsLabels}><span>Nunca indicaria</span><span>Indicaria com certeza</span></div>
                  </>
                )}

                {step.type === 'chips' && (
                  <div className={styles.chipGrid}>
                    {step.options?.map((o) => (
                      <button
                        key={o}
                        className={`${styles.chip} ${((answers[step.id as keyof Answers] as string[]) || []).includes(o) ? styles.selected : ''}`}
                        onClick={() => toggleChip(step.id as keyof Answers, o)}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                )}

                {step.type === 'text' && (
                  <textarea
                    className={styles.openField}
                    placeholder="Escreva aqui, se quiser..."
                    value={(answers[step.id as keyof Answers] as string) || ''}
                    onChange={(e) => setAnswers((a) => ({ ...a, [step.id]: e.target.value }))}
                  />
                )}
              </div>

              {(step.type === 'chips' || step.type === 'text') && (
                <div className={styles.nav}>
                  {idx > 1 && <button className={styles.btnBack} onClick={goBack}>Voltar</button>}
                  <button
                    className={styles.btnPrimary}
                    disabled={step.type === 'chips' && ((answers[step.id as keyof Answers] as string[]) || []).length === 0}
                    onClick={isLastQuestion ? submitForm : goNext}
                  >
                    {isLastQuestion ? 'Enviar avaliação' : 'Continuar'}
                  </button>
                </div>
              )}

              {step.type !== 'chips' && step.type !== 'text' && idx > 1 && (
                <div className={styles.nav}>
                  <button className={styles.btnBack} onClick={goBack}>Voltar</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
