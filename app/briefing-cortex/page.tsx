'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ToolBackground from '@/components/ToolBackground';
import { useScrollSpy } from '@/lib/useScrollSpy';

const FP = 'Poppins, sans-serif';

const CURSOS = [
  'Primeiros Socorros', 'PS Familiar em Geriatria', 'Suporte Básico de Vida',
  'Suporte Intermediário de Vida', 'APH', 'Punção Venosa Periférica',
  'Acessos Especiais', 'Hipodermóclise', 'PICC', 'Coleta de Sangue',
  'Sutura para Enfermeiros', 'Curativos e Feridas', 'Administração de Injetáveis',
  'Semiologia para Enfermeiros', 'Cateterismos', 'CIPI — Cuidador de Idosos',
  'Lei Lucas', 'Eventos Corporativos',
];

const SIDEBAR_ITEMS = [
  { id: 'parte1', label: 'A Marca' },
  { id: 'parte2', label: 'O Fundador' },
  { id: 'parte3', label: 'Os Públicos' },
  { id: 'parte4', label: 'Os Cursos' },
  { id: 'parte5', label: 'Presença Digital' },
  { id: 'parte6', label: 'Autoridade e Prova Social' },
  { id: 'parte7', label: 'Objetivos e Direção' },
  { id: 'parte8', label: 'Perguntas Abertas' },
];

const SECTION_IDS = SIDEBAR_ITEMS.map(item => item.id);

function PartHeader({ n, title }: { n: number; title: string }) {
  return (
    <div style={{ paddingBottom: '2rem', marginBottom: '2.5rem', borderBottom: '1px solid #141414' }}>
      <p style={{ color: '#FF6B00', fontSize: '0.68rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.625rem', fontFamily: FP }}>
        Parte {n} de {SECTION_IDS.length}
      </p>
      <h2 style={{ fontFamily: FP, fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', color: '#fff', letterSpacing: '0.04em', lineHeight: 1, margin: 0 }}>
        {title.toUpperCase()}
      </h2>
    </div>
  );
}

type CursoRow = { status: string; frequencia: string; alunos: string; preco: string; canal: string };
const defaultCurso = (): CursoRow => ({ status: 'Ativo', frequencia: '', alunos: '', preco: '', canal: '' });

export default function BriefingCortexPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useScrollSpy(SECTION_IDS);

  // Parte 1
  const [frase_marca, setFraseMarca] = useState('');
  const [historia_origem, setHistoriaOrigem] = useState('');
  const [adjetivos, setAdjetivos] = useState('');
  const [o_que_defende, setOQueDefende] = useState('');
  const [frase_proposito, setFraseProposito] = useState('');
  const [concorrentes, setConcorrentes] = useState('');
  const [transformacao_aluno, setTransformacaoAluno] = useState('');
  const [posicao_2anos, setPosicao2anos] = useState('');
  const [bordao, setBordao] = useState('');
  const [jamais_faria, setJamaisFaria] = useState('');
  const [tom_indesejado, setTomIndesejado] = useState<string[]>([]);
  const [tom_indesejado_comentario, setTomComentario] = useState('');
  const [referencias_comunicacao, setReferencias] = useState('');

  // Parte 2
  const [momento_origem, setMomentoOrigem] = useState('');
  const [experiencia_samu, setExperienciaSamu] = useState('');
  const [crenca_ensino, setCrencaEnsino] = useState('');
  const [conhecimento_unico, setConhecimentoUnico] = useState('');
  const [conforto_camera, setConfortoCamera] = useState('');
  const [conforto_camera_comentario, setConfortoCameraComentario] = useState('');
  const [assunto_horas, setAssuntoHoras] = useState('');
  const [pergunta_recebida, setPerguntaRecebida] = useState('');
  const [erro_treinamento, setErroTreinamento] = useState('');
  const [outros_professores, setOutrosProfessores] = useState('');
  const [autoridade_professores, setAutoridadeProfessores] = useState('');

  // Parte 3
  const [aluno_tipico, setAlunoTipico] = useState('');
  const [dor_humana, setDorHumana] = useState('');
  const [sentir_depois, setSentirDepois] = useState('');
  const [objecao, setObjecao] = useState<string[]>([]);
  const [objecao_outro, setObjecaoOutro] = useState('');
  const [consumo_instagram, setConsumoInstagram] = useState('');
  const [decide_corporativo, setDecideCorporativo] = useState('');
  const [chega_corporativo, setChegaCorporativo] = useState('');
  const [motivacao_corporativo, setMotivacaoCorporativo] = useState<string[]>([]);
  const [motivacao_corporativo_outro, setMotivacaoCorporativoOutro] = useState('');
  const [medo_contratante, setMedoContratante] = useState('');
  const [case_corporativo, setCaseCorporativo] = useState('');
  const [publico_geral_quem, setPublicoGeralQuem] = useState('');
  const [publico_geral_motivacao, setPublicoGeralMotivacao] = useState('');
  const [publico_geral_demanda, setPublicoGeralDemanda] = useState('');

  // Parte 4
  const [cursos, setCursos] = useState<Record<string, CursoRow>>(
    Object.fromEntries(CURSOS.map(c => [c, defaultCurso()]))
  );
  const [cursos_potencial, setCursosPotencial] = useState('');
  const [curso_vaga, setCursoVaga] = useState('');
  const [curso_pedido, setCursoPedido] = useState('');
  const [lancamento_previsto, setLancamentoPrevisto] = useState('');
  const [pratica_diferente, setPraticaDiferente] = useState('');
  const [parte_comentada, setParteComentada] = useState('');
  const [gerador_confianca, setGeradorConfianca] = useState('');

  // Parte 5
  const [frequencia_postagem, setFrequenciaPostagem] = useState('');
  const [quem_cria, setQuemCria] = useState('');
  const [tipos_post, setTiposPost] = useState<string[]>([]);
  const [o_que_funcionou, setOQueFuncionou] = useState('');
  const [o_que_nao_funcionou, setOQueNaoFuncionou] = useState('');
  const [banco_midia, setBancoMidia] = useState('');
  const [depoimentos, setDepoimentos] = useState('');
  const [fotos_espaco, setFotosEspaco] = useState('');
  const [fotos_marcelo, setFotosMarcelo] = useState('');
  const [site_atual, setSiteAtual] = useState('');
  const [whatsapp_business, setWhatsappBusiness] = useState('');
  const [lista_transmissao, setListaTransmissao] = useState('');
  const [trafego_pago, setTrafegoPago] = useState('');
  const [trafego_pago_resultado, setTrafegoPagoResultado] = useState('');

  // Parte 6
  const [total_alunos, setTotalAlunos] = useState('');
  const [numeros_prova, setNumerosProva] = useState('');
  const [aluno_emergencia, setAlunoEmergencia] = useState('');
  const [parcerias, setParcerias] = useState('');
  const [publicacoes_marcelo, setPublicacoesMarcelo] = useState('');
  const [google_negocio, setGoogleNegocio] = useState('');

  // Parte 7
  const [objetivo_6meses, setObjetivo6meses] = useState<string[]>([]);
  const [objetivo_outro, setObjetivoOutro] = useState('');
  const [metrica_sucesso, setMetricaSucesso] = useState('');
  const [evento_60dias, setEvento60dias] = useState('');
  const [palavras_sim, setPalavrasSim] = useState('');
  const [palavras_nao, setPalavrasNao] = useState('');
  const [sensacao_post, setSensacaoPost] = useState('');
  const [referencia_visual, setReferenciaVisual] = useState('');
  const [posts_semana, setPostsSemana] = useState('');
  const [frequencia_videos, setFrequenciaVideos] = useState('');
  const [equipe_producao, setEquipeProducao] = useState('');
  const [datas_turmas, setDatasTurmas] = useState('');

  // Parte 8
  const [o_que_digam, setOQueDigam] = useState('');
  const [frustracao, setFrustracao] = useState('');
  const [mudanca_percepcao, setMudancaPercepcao] = useState('');
  const [info_adicional, setInfoAdicional] = useState('');

  function toggleCheck(state: string[], setState: (v: string[]) => void, value: string) {
    setState(state.includes(value) ? state.filter(v => v !== value) : [...state, value]);
  }

  function updateCurso(curso: string, field: keyof CursoRow, value: string) {
    setCursos(prev => ({ ...prev, [curso]: { ...prev[curso], [field]: value } }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/briefing-cortex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frase_marca, historia_origem, adjetivos, o_que_defende, frase_proposito,
          concorrentes, transformacao_aluno, posicao_2anos, bordao, jamais_faria,
          tom_indesejado, tom_indesejado_comentario, referencias_comunicacao,
          momento_origem, experiencia_samu, crenca_ensino, conhecimento_unico,
          conforto_camera, conforto_camera_comentario, assunto_horas, pergunta_recebida,
          erro_treinamento, outros_professores, autoridade_professores,
          aluno_tipico, dor_humana, sentir_depois, objecao, objecao_outro, consumo_instagram,
          decide_corporativo, chega_corporativo, motivacao_corporativo, motivacao_corporativo_outro,
          medo_contratante, case_corporativo, publico_geral_quem, publico_geral_motivacao, publico_geral_demanda,
          cursos, cursos_potencial, curso_vaga, curso_pedido, lancamento_previsto,
          pratica_diferente, parte_comentada, gerador_confianca,
          frequencia_postagem, quem_cria, tipos_post, o_que_funcionou, o_que_nao_funcionou,
          banco_midia, depoimentos, fotos_espaco, fotos_marcelo, site_atual,
          whatsapp_business, lista_transmissao, trafego_pago, trafego_pago_resultado,
          total_alunos, numeros_prova, aluno_emergencia, parcerias, publicacoes_marcelo, google_negocio,
          objetivo_6meses, objetivo_outro, metrica_sucesso, evento_60dias,
          palavras_sim, palavras_nao, sensacao_post, referencia_visual,
          posts_semana, frequencia_videos, equipe_producao, datas_turmas,
          o_que_digam, frustracao, mudanca_percepcao, info_adicional,
        }),
      });
      const data = await res.json();
      if (data.success) setSuccess(true);
      else setError(data.error || 'Erro ao enviar.');
    } catch {
      setError('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  }

  function scrollTo(id: string) {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  const input = "w-full bg-[rgba(255,255,255,0.04)] border border-[#1e1e1e] rounded-[10px] px-5 py-3.5 text-white text-[0.9rem] font-['Poppins'] placeholder-[#444] outline-none transition-colors duration-200 focus:border-[#FF6B00]";
  const ta = input + ' resize-none min-h-[80px]';
  const lbl = "block text-[#444] text-[0.68rem] tracking-[0.2em] uppercase mb-2 font-['Poppins']";
  const secTitle = "text-[#2a2a2a] text-[0.65rem] tracking-[0.22em] uppercase mb-6 pb-3 border-b border-[#141414] mt-8 font-['Poppins']";
  const chk = 'w-4 h-4 rounded border-[#444] bg-[#111] cursor-pointer accent-[#FF6B00]';
  const activeIndex = SECTION_IDS.indexOf(activeSection);
  const progress = ((activeIndex + 1) / SECTION_IDS.length) * 100;

  function Checks({ options, state, setState }: { options: string[]; state: string[]; setState: (v: string[]) => void }) {
    return (
      <div className="flex flex-col gap-2">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-3 cursor-pointer text-sm font-['Poppins'] text-[#ccc]">
            <input type="checkbox" className={chk} checked={state.includes(opt)} onChange={() => toggleCheck(state, setState, opt)} />
            {opt}
          </label>
        ))}
      </div>
    );
  }

  function Radios({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
    return (
      <div className="flex flex-col gap-2">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-3 cursor-pointer text-sm font-['Poppins'] text-[#ccc]">
            <input type="radio" className="accent-[#FF6B00] w-4 h-4 cursor-pointer" checked={value === opt} onChange={() => onChange(opt)} />
            {opt}
          </label>
        ))}
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="font-['Poppins'] text-white text-2xl uppercase tracking-wide mb-2">Briefing enviado</p>
          <p className="font-['Poppins'] text-[#666] text-sm mb-8">As respostas foram registradas no Notion.</p>
          <Link href="/hub" className="text-[#FF6B00] font-['Poppins'] text-sm underline">Voltar ao hub</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', fontFamily: FP, display: 'flex', position: 'relative' }}>
      <ToolBackground />

      {/* Sidebar */}
      <div style={{ position: 'sticky', top: 0, width: sidebarCollapsed ? '60px' : '260px', flexShrink: 0, height: '100vh', zIndex: 10, transition: 'width 0.3s ease' }}>

        {/* Toggle — círculo */}
        <button
          onClick={() => setSidebarCollapsed(c => !c)}
          title={sidebarCollapsed ? 'Expandir' : 'Recolher'}
          style={{ position: 'absolute', right: '-12px', top: '50%', transform: 'translateY(-50%)', zIndex: 20, width: '24px', height: '24px', background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#333', fontSize: '0.65rem', transition: 'all 0.2s' }}
          onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = '#FF6B00'; b.style.color = '#FF6B00'; }}
          onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = '#1e1e1e'; b.style.color = '#333'; }}
        >
          {sidebarCollapsed ? '›' : '‹'}
        </button>

        <div style={{ width: '100%', height: '100%', borderRight: '1px solid #0f0f0f', display: 'flex', flexDirection: 'column', background: 'rgba(8,8,8,0.97)', backdropFilter: 'blur(16px)', overflow: 'hidden' }}>

          {/* ZONA 1 — Logo */}
          {!sidebarCollapsed ? (
            <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid #0f0f0f', flexShrink: 0 }}>
              <Link href="/" className="inline-block cursor-pointer transition-opacity hover:opacity-80">
                <Image src="/lglaranja.png" alt="ORIUM" width={90} height={28} style={{ objectFit: 'contain' }} />
              </Link>
              <p style={{ color: '#444444', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: FP, marginTop: '0.5rem', marginBottom: 0 }}>BRIEFING — CÓRTEX HUB</p>
            </div>
          ) : (
            <div style={{ flexShrink: 0, height: '60px', borderBottom: '1px solid #0f0f0f' }} />
          )}

          {/* ZONA 2 — Partes */}
          <div style={{ flex: 1, overflowY: 'hidden' }}>
            {!sidebarCollapsed && (
              <p style={{ color: '#444444', fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', padding: '1.25rem 1.75rem 0.75rem', margin: 0 }}>PARTES</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {SIDEBAR_ITEMS.map((item, i) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '0.75rem', padding: sidebarCollapsed ? '0.875rem 0' : '0.7rem 1.75rem', background: isActive ? 'rgba(255,107,0,0.15)' : 'transparent', border: 'none', borderLeft: sidebarCollapsed ? 'none' : `2px solid ${isActive ? '#FF6B00' : 'transparent'}`, outline: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.2s', boxSizing: 'border-box' as const }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    <span style={{ fontFamily: FP, fontSize: '0.65rem', letterSpacing: '0.05em', minWidth: '20px', flexShrink: 0, color: isActive ? '#FF6B00' : '#555555', transition: 'color 0.2s' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {!sidebarCollapsed && (
                      <span style={{ fontSize: '0.78rem', color: isActive ? '#fff' : '#888888', fontFamily: FP, fontWeight: isActive ? 600 : 400, lineHeight: 1.3, transition: 'color 0.2s' }}>
                        {item.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ZONA 3 — Progresso */}
          {!sidebarCollapsed && (
            <div style={{ borderTop: '1px solid #0f0f0f', padding: '1.25rem 1.75rem', flexShrink: 0 }}>
              <p style={{ color: '#444444', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.625rem' }}>PROGRESSO</p>
              <div style={{ height: '2px', background: '#111', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: '#FF6B00', borderRadius: '2px', transition: 'width 0.5s ease' }} />
              </div>
              <p style={{ color: '#2a2a2a', fontSize: '0.7rem', marginTop: '0.5rem' }}>{Math.round(progress)}% concluído</p>
            </div>
          )}

          {/* ZONA 4 — Painel */}
          <div style={{ borderTop: '1px solid #0f0f0f', padding: sidebarCollapsed ? '1rem 0' : '1rem 1.75rem 1.5rem', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem', alignItems: sidebarCollapsed ? 'center' : 'flex-start' }}>
            <a
              href="/hub"
              title="Voltar ao painel"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#888888', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.15s', fontFamily: FP, border: '1px solid #1e1e1e', padding: '8px 12px', borderRadius: '8px' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00'; e.currentTarget.style.borderColor = '#FF6B00'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#888888'; e.currentTarget.style.borderColor = '#1e1e1e'; }}
            >
              <span>←</span>
              {!sidebarCollapsed && <span>PAINEL</span>}
            </a>
          </div>

        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative', zIndex: 1 }}>

        {/* Form */}
        <main className="flex-1 px-16 py-10 max-w-[720px] w-full space-y-16">

          {/* PARTE 1 */}
          <section id="parte1">
            <PartHeader n={1} title="A Marca" />
            <p className={secTitle}>1.1 Identidade</p>
            <div className="space-y-5">
              <div><label className={lbl}>Frase da marca</label><textarea className={ta} value={frase_marca} onChange={e => setFraseMarca(e.target.value)} placeholder="A frase que resume o que a Córtex é..." /></div>
              <div><label className={lbl}>História de origem</label><textarea className={ta} value={historia_origem} onChange={e => setHistoriaOrigem(e.target.value)} placeholder="Como a Córtex surgiu..." /></div>
              <div><label className={lbl}>3 adjetivos da personalidade</label><textarea className={ta} value={adjetivos} onChange={e => setAdjetivos(e.target.value)} /></div>
              <div><label className={lbl}>O que a Córtex defende</label><textarea className={ta} value={o_que_defende} onChange={e => setOQueDefende(e.target.value)} /></div>
              <div><label className={lbl}>Frase de propósito — "A Córtex Hub existe para que profissionais de saúde..."</label><textarea className={ta} value={frase_proposito} onChange={e => setFraseProposito(e.target.value)} /></div>
            </div>
            <p className={secTitle}>1.2 Posicionamento</p>
            <div className="space-y-5">
              <div><label className={lbl}>3 concorrentes diretos em BH (Nome / O que oferecem / Por que são diferentes)</label><textarea className={ta} rows={5} value={concorrentes} onChange={e => setConcorrentes(e.target.value)} /></div>
              <div><label className={lbl}>Transformação do aluno</label><textarea className={ta} value={transformacao_aluno} onChange={e => setTransformacaoAluno(e.target.value)} /></div>
              <div><label className={lbl}>Posição desejada em 2 anos</label><textarea className={ta} value={posicao_2anos} onChange={e => setPosicao2anos(e.target.value)} /></div>
              <div><label className={lbl}>Bordão ou conceito natural</label><textarea className={ta} value={bordao} onChange={e => setBordao(e.target.value)} /></div>
            </div>
            <p className={secTitle}>1.3 Valores e limites</p>
            <div className="space-y-5">
              <div><label className={lbl}>O que jamais faria</label><textarea className={ta} value={jamais_faria} onChange={e => setJamaisFaria(e.target.value)} /></div>
              <div>
                <label className={lbl}>Tom indesejado</label>
                <Checks options={['Muito clínico e frio', 'Muito comercial e agressivo', 'Muito motivacional e genérico', 'Muito informal']} state={tom_indesejado} setState={setTomIndesejado} />
                <textarea className={ta + ' mt-3'} placeholder="Comentário..." value={tom_indesejado_comentario} onChange={e => setTomComentario(e.target.value)} />
              </div>
              <div><label className={lbl}>Referências de comunicação</label><textarea className={ta} value={referencias_comunicacao} onChange={e => setReferencias(e.target.value)} /></div>
            </div>
          </section>

          {/* PARTE 2 */}
          <section id="parte2">
            <PartHeader n={2} title="O Fundador" />
            <p className={secTitle}>2.1 Marcelo Félix</p>
            <div className="space-y-5">
              <div><label className={lbl}>Momento de origem da Córtex</label><textarea className={ta} value={momento_origem} onChange={e => setMomentoOrigem(e.target.value)} /></div>
              <div><label className={lbl}>Experiência do SAMU que mudou tudo</label><textarea className={ta} value={experiencia_samu} onChange={e => setExperienciaSamu(e.target.value)} /></div>
              <div><label className={lbl}>Crença central de ensino</label><textarea className={ta} value={crenca_ensino} onChange={e => setCrencaEnsino(e.target.value)} /></div>
              <div><label className={lbl}>Conhecimento único sobre treinamento</label><textarea className={ta} value={conhecimento_unico} onChange={e => setConhecimentoUnico(e.target.value)} /></div>
              <div>
                <label className={lbl}>Conforto com câmera</label>
                <Radios options={['Confortável — posso falar para câmera sem problema', 'Parcialmente confortável — prefiro contexto (sala de aula, simulação)', 'Desconfortável — prefiro aparecer pouco', 'Indiferente — faço o que for necessário']} value={conforto_camera} onChange={setConfortoCamera} />
                <textarea className={ta + ' mt-3'} placeholder="Comentário..." value={conforto_camera_comentario} onChange={e => setConfortoCameraComentario(e.target.value)} />
              </div>
              <div><label className={lbl}>Assunto que poderia falar por horas</label><textarea className={ta} value={assunto_horas} onChange={e => setAssuntoHoras(e.target.value)} /></div>
              <div><label className={lbl}>Pergunta mais recebida de alunos</label><textarea className={ta} value={pergunta_recebida} onChange={e => setPerguntaRecebida(e.target.value)} /></div>
              <div><label className={lbl}>Erro mais comum que um bom treinamento resolveria</label><textarea className={ta} value={erro_treinamento} onChange={e => setErroTreinamento(e.target.value)} /></div>
            </div>
            <p className={secTitle}>2.2 Outros profissionais</p>
            <div className="space-y-5">
              <div><label className={lbl}>Outros professores (Nome / Especialidade / Disponibilidade)</label><textarea className={ta} rows={4} value={outros_professores} onChange={e => setOutrosProfessores(e.target.value)} /></div>
              <div><label className={lbl}>Autoridade e trajetória dos outros professores</label><textarea className={ta} value={autoridade_professores} onChange={e => setAutoridadeProfessores(e.target.value)} /></div>
            </div>
          </section>

          {/* PARTE 3 */}
          <section id="parte3">
            <PartHeader n={3} title="Os Públicos" />
            <p className={secTitle}>3.1 Profissionais e estudantes de saúde</p>
            <div className="space-y-5">
              <div><label className={lbl}>Aluno típico (Idade / Área / Nível / Onde trabalha / Como chegou / O que sentia antes)</label><textarea className={ta} rows={5} value={aluno_tipico} onChange={e => setAlunoTipico(e.target.value)} /></div>
              <div><label className={lbl}>Dor humana real</label><textarea className={ta} value={dor_humana} onChange={e => setDorHumana(e.target.value)} /></div>
              <div><label className={lbl}>O que quer sentir depois do curso</label><textarea className={ta} value={sentir_depois} onChange={e => setSentirDepois(e.target.value)} /></div>
              <div>
                <label className={lbl}>Principal objeção</label>
                <Checks options={['Preço', 'Tempo / disponibilidade', 'Já sei isso', 'Não conhece a Córtex ainda', 'Medo de não conseguir aplicar na prática', 'Outro']} state={objecao} setState={setObjecao} />
                {objecao.includes('Outro') && (
                  <input className={input + ' mt-3'} placeholder="Qual?" value={objecao_outro} onChange={e => setObjecaoOutro(e.target.value)} />
                )}
              </div>
              <div><label className={lbl}>Consumo de conteúdo no Instagram</label><textarea className={ta} value={consumo_instagram} onChange={e => setConsumoInstagram(e.target.value)} /></div>
            </div>
            <p className={secTitle}>3.2 Público Corporativo</p>
            <div className="space-y-5">
              <div><label className={lbl}>Quem decide a contratação</label><textarea className={ta} value={decide_corporativo} onChange={e => setDecideCorporativo(e.target.value)} /></div>
              <div><label className={lbl}>Como chega até a Córtex</label><textarea className={ta} value={chega_corporativo} onChange={e => setChegaCorporativo(e.target.value)} /></div>
              <div>
                <label className={lbl}>Motivação principal</label>
                <Checks options={['Obrigação legal (SIPAT, NR)', 'Prevenção de acidentes', 'Valorização dos colaboradores', 'Evento diferenciado', 'Outro']} state={motivacao_corporativo} setState={setMotivacaoCorporativo} />
                {motivacao_corporativo.includes('Outro') && (
                  <input className={input + ' mt-3'} placeholder="Qual?" value={motivacao_corporativo_outro} onChange={e => setMotivacaoCorporativoOutro(e.target.value)} />
                )}
              </div>
              <div><label className={lbl}>Maior medo do contratante</label><textarea className={ta} value={medo_contratante} onChange={e => setMedoContratante(e.target.value)} /></div>
              <div><label className={lbl}>Case corporativo de sucesso</label><textarea className={ta} value={case_corporativo} onChange={e => setCaseCorporativo(e.target.value)} /></div>
            </div>
            <p className={secTitle}>3.3 Público Geral</p>
            <div className="space-y-5">
              <div><label className={lbl}>Quem é essa pessoa</label><textarea className={ta} value={publico_geral_quem} onChange={e => setPublicoGeralQuem(e.target.value)} /></div>
              <div><label className={lbl}>O que motivou a busca pelo curso</label><textarea className={ta} value={publico_geral_motivacao} onChange={e => setPublicoGeralMotivacao(e.target.value)} /></div>
              <div><label className={lbl}>É trabalhado ativamente ou demanda espontânea</label><textarea className={ta} value={publico_geral_demanda} onChange={e => setPublicoGeralDemanda(e.target.value)} /></div>
            </div>
          </section>

          {/* PARTE 4 */}
          <section id="parte4">
            <PartHeader n={4} title="Os Cursos" />
            <p className={secTitle}>4.1 Portfólio atual</p>
            <div className="overflow-x-auto rounded-[10px] border border-[#1e1e1e] mb-6">
              <table className="w-full text-xs font-['Poppins']">
                <thead>
                  <tr className="border-b border-[#1e1e1e]">
                    <th className="text-left px-3 py-3 text-[#444] font-normal">Curso</th>
                    <th className="text-left px-3 py-3 text-[#444] font-normal">Status</th>
                    <th className="text-left px-3 py-3 text-[#444] font-normal">Frequência</th>
                    <th className="text-left px-3 py-3 text-[#444] font-normal">Alunos/turma</th>
                    <th className="text-left px-3 py-3 text-[#444] font-normal">Preço médio</th>
                    <th className="text-left px-3 py-3 text-[#444] font-normal">Canal inscrição</th>
                  </tr>
                </thead>
                <tbody>
                  {CURSOS.map((curso, i) => (
                    <tr key={curso} className={`border-b border-[#141414] ${i % 2 === 0 ? 'bg-[rgba(255,255,255,0.02)]' : 'bg-transparent'}`}>
                      <td className="px-3 py-2 text-[#ccc] whitespace-nowrap">{curso}</td>
                      <td className="px-3 py-2">
                        <select className="bg-[rgba(255,255,255,0.04)] border border-[#1e1e1e] rounded-[8px] px-2 py-1 text-white text-xs outline-none focus:border-[#FF6B00]"
                          value={cursos[curso].status} onChange={e => updateCurso(curso, 'status', e.target.value)}>
                          {['Ativo', 'Pausado', 'Em breve'].map(s => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-2"><input className="bg-[rgba(255,255,255,0.04)] border border-[#1e1e1e] rounded-[8px] px-2 py-1 text-white text-xs w-24 outline-none focus:border-[#FF6B00]" value={cursos[curso].frequencia} onChange={e => updateCurso(curso, 'frequencia', e.target.value)} placeholder="Ex: mensal" /></td>
                      <td className="px-3 py-2"><input type="number" className="bg-[rgba(255,255,255,0.04)] border border-[#1e1e1e] rounded-[8px] px-2 py-1 text-white text-xs w-16 outline-none focus:border-[#FF6B00]" value={cursos[curso].alunos} onChange={e => updateCurso(curso, 'alunos', e.target.value)} /></td>
                      <td className="px-3 py-2"><input className="bg-[rgba(255,255,255,0.04)] border border-[#1e1e1e] rounded-[8px] px-2 py-1 text-white text-xs w-24 outline-none focus:border-[#FF6B00]" value={cursos[curso].preco} onChange={e => updateCurso(curso, 'preco', e.target.value)} placeholder="R$" /></td>
                      <td className="px-3 py-2"><input className="bg-[rgba(255,255,255,0.04)] border border-[#1e1e1e] rounded-[8px] px-2 py-1 text-white text-xs w-28 outline-none focus:border-[#FF6B00]" value={cursos[curso].canal} onChange={e => updateCurso(curso, 'canal', e.target.value)} placeholder="WhatsApp, site..." /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={secTitle}>4.2 Prioridades</p>
            <div className="space-y-5">
              <div><label className={lbl}>3 cursos com maior potencial agora</label><textarea className={ta} value={cursos_potencial} onChange={e => setCursosPotencial(e.target.value)} /></div>
              <div><label className={lbl}>Curso com vaga sobrando</label><textarea className={ta} value={curso_vaga} onChange={e => setCursoVaga(e.target.value)} /></div>
              <div><label className={lbl}>Curso mais pedido que não existe</label><textarea className={ta} value={curso_pedido} onChange={e => setCursoPedido(e.target.value)} /></div>
              <div><label className={lbl}>Lançamento previsto nos próximos 3 meses</label><textarea className={ta} value={lancamento_previsto} onChange={e => setLancamentoPrevisto(e.target.value)} /></div>
            </div>
            <p className={secTitle}>4.3 Diferenciais dos cursos</p>
            <div className="space-y-5">
              <div><label className={lbl}>O que torna a prática diferente</label><textarea className={ta} value={pratica_diferente} onChange={e => setPraticaDiferente(e.target.value)} /></div>
              <div><label className={lbl}>Parte mais comentada positivamente</label><textarea className={ta} value={parte_comentada} onChange={e => setParteComentada(e.target.value)} /></div>
              <div>
                <label className={lbl}>Maior gerador de confiança</label>
                <Radios options={['O professor', 'O material', 'A prática', 'O certificado', 'O espaço']} value={gerador_confianca} onChange={setGeradorConfianca} />
              </div>
            </div>
          </section>

          {/* PARTE 5 */}
          <section id="parte5">
            <PartHeader n={5} title="Presença Digital" />
            <p className={secTitle}>5.1 Instagram atual</p>
            <div className="space-y-5">
              <div><label className={lbl}>Frequência de postagem</label><textarea className={ta} value={frequencia_postagem} onChange={e => setFrequenciaPostagem(e.target.value)} /></div>
              <div><label className={lbl}>Quem cria o conteúdo hoje</label><textarea className={ta} value={quem_cria} onChange={e => setQuemCria(e.target.value)} /></div>
              <div>
                <label className={lbl}>Tipos de post já feitos</label>
                <Checks options={['Fotos dos cursos em andamento', 'Vídeos de simulação / prática', 'Textos educativos', 'Depoimentos de alunos', 'Prof. Marcelo falando para câmera', 'Divulgação de turmas', 'Nenhum com consistência']} state={tipos_post} setState={setTiposPost} />
              </div>
              <div><label className={lbl}>O que funcionou</label><textarea className={ta} value={o_que_funcionou} onChange={e => setOQueFuncionou(e.target.value)} /></div>
              <div><label className={lbl}>O que não funcionou</label><textarea className={ta} value={o_que_nao_funcionou} onChange={e => setOQueNaoFuncionou(e.target.value)} /></div>
            </div>
            <p className={secTitle}>5.2 Materiais disponíveis</p>
            <div className="space-y-5">
              <div>
                <label className={lbl}>Banco de fotos e vídeos</label>
                <Radios options={['Sim, bastante material', 'Sim, mas pouco', 'Não, precisamos produzir do zero']} value={banco_midia} onChange={setBancoMidia} />
              </div>
              <div>
                <label className={lbl}>Depoimentos disponíveis</label>
                <Radios options={['Sim, em vídeo', 'Sim, em texto / print de WhatsApp', 'Não, mas posso coletar', 'Não tenho nenhum registrado']} value={depoimentos} onChange={setDepoimentos} />
              </div>
              <div><label className={lbl}>Fotos do espaço físico</label><textarea className={ta} value={fotos_espaco} onChange={e => setFotosEspaco(e.target.value)} /></div>
              <div><label className={lbl}>Fotos ou vídeos do Prof. Marcelo</label><textarea className={ta} value={fotos_marcelo} onChange={e => setFotosMarcelo(e.target.value)} /></div>
            </div>
            <p className={secTitle}>5.3 Outros canais</p>
            <div className="space-y-5">
              <div><label className={lbl}>Site atual</label><textarea className={ta} value={site_atual} onChange={e => setSiteAtual(e.target.value)} /></div>
              <div><label className={lbl}>WhatsApp Business</label><textarea className={ta} value={whatsapp_business} onChange={e => setWhatsappBusiness(e.target.value)} /></div>
              <div><label className={lbl}>Lista de transmissão ou grupo</label><textarea className={ta} value={lista_transmissao} onChange={e => setListaTransmissao(e.target.value)} /></div>
              <div>
                <label className={lbl}>Tráfego pago</label>
                <Radios options={['Sim', 'Não, nunca', 'Tentei mas não funcionou']} value={trafego_pago} onChange={setTrafegoPago} />
                {(trafego_pago === 'Sim' || trafego_pago === 'Tentei mas não funcionou') && (
                  <textarea className={ta + ' mt-3'} placeholder="Resultado ou motivo..." value={trafego_pago_resultado} onChange={e => setTrafegoPagoResultado(e.target.value)} />
                )}
              </div>
            </div>
          </section>

          {/* PARTE 6 */}
          <section id="parte6">
            <PartHeader n={6} title="Autoridade e Prova Social" />
            <div className="space-y-5">
              <div><label className={lbl}>Total de alunos desde a fundação</label><input className={input} value={total_alunos} onChange={e => setTotalAlunos(e.target.value)} /></div>
              <div><label className={lbl}>Números de prova (turmas / certificados / nota média)</label><textarea className={ta} value={numeros_prova} onChange={e => setNumerosProva(e.target.value)} /></div>
              <div><label className={lbl}>Aluno que aplicou em situação real de emergência</label><textarea className={ta} value={aluno_emergencia} onChange={e => setAlunoEmergencia(e.target.value)} /></div>
              <div><label className={lbl}>Parcerias institucionais</label><textarea className={ta} value={parcerias} onChange={e => setParcerias(e.target.value)} /></div>
              <div><label className={lbl}>Publicações, entrevistas ou eventos do Prof. Marcelo</label><textarea className={ta} value={publicacoes_marcelo} onChange={e => setPublicacoesMarcelo(e.target.value)} /></div>
              <div><label className={lbl}>Google Meu Negócio — avaliações e nota</label><textarea className={ta} value={google_negocio} onChange={e => setGoogleNegocio(e.target.value)} /></div>
            </div>
          </section>

          {/* PARTE 7 */}
          <section id="parte7">
            <PartHeader n={7} title="Objetivos e Direção" />
            <p className={secTitle}>7.1 Objetivos</p>
            <div className="space-y-5">
              <div>
                <label className={lbl}>Principal objetivo em 6 meses</label>
                <Checks options={['Encher turmas com vagas sobrando', 'Lançar cursos novos', 'Crescer no segmento corporativo', 'Fortalecer autoridade do Marcelo', 'Expandir para outras cidades ou formato online', 'Outro']} state={objetivo_6meses} setState={setObjetivo6meses} />
                {objetivo_6meses.includes('Outro') && (
                  <input className={input + ' mt-3'} placeholder="Qual?" value={objetivo_outro} onChange={e => setObjetivoOutro(e.target.value)} />
                )}
              </div>
              <div><label className={lbl}>Métrica de sucesso</label><textarea className={ta} value={metrica_sucesso} onChange={e => setMetricaSucesso(e.target.value)} /></div>
              <div><label className={lbl}>Evento ou lançamento nos próximos 60 dias</label><textarea className={ta} value={evento_60dias} onChange={e => setEvento60dias(e.target.value)} /></div>
            </div>
            <p className={secTitle}>7.2 Direção criativa</p>
            <div className="space-y-5">
              <div><label className={lbl}>3 palavras que devem estar na comunicação</label><textarea className={ta} value={palavras_sim} onChange={e => setPalavrasSim(e.target.value)} /></div>
              <div><label className={lbl}>3 palavras que jamais devem aparecer</label><textarea className={ta} value={palavras_nao} onChange={e => setPalavrasNao(e.target.value)} /></div>
              <div><label className={lbl}>Sensação ao ver um post no feed</label><textarea className={ta} value={sensacao_post} onChange={e => setSensacaoPost(e.target.value)} /></div>
              <div><label className={lbl}>Referência visual</label><textarea className={ta} value={referencia_visual} onChange={e => setReferenciaVisual(e.target.value)} /></div>
            </div>
            <p className={secTitle}>7.3 Logística de conteúdo</p>
            <div className="space-y-5">
              <div><label className={lbl}>Posts por semana com material disponível</label><textarea className={ta} value={posts_semana} onChange={e => setPostsSemana(e.target.value)} /></div>
              <div>
                <label className={lbl}>Frequência de vídeos do Prof. Marcelo</label>
                <Radios options={['Todo dia', '2-3x por semana', '1x por semana', 'Raramente']} value={frequencia_videos} onChange={setFrequenciaVideos} />
              </div>
              <div><label className={lbl}>Alguém na equipe para produção</label><textarea className={ta} value={equipe_producao} onChange={e => setEquipeProducao(e.target.value)} /></div>
              <div><label className={lbl}>Datas fixas de turmas</label><textarea className={ta} value={datas_turmas} onChange={e => setDatasTurmas(e.target.value)} /></div>
            </div>
          </section>

          {/* PARTE 8 */}
          <section id="parte8">
            <PartHeader n={8} title="Perguntas Abertas" />
            <div className="space-y-5">
              <div><label className={lbl}>O que querem que as pessoas digam da Córtex</label><textarea className={ta} value={o_que_digam} onChange={e => setOQueDigam(e.target.value)} /></div>
              <div><label className={lbl}>Frustração com a comunicação atual</label><textarea className={ta} value={frustracao} onChange={e => setFrustracao(e.target.value)} /></div>
              <div><label className={lbl}>Mudança de percepção que deseja</label><textarea className={ta} value={mudanca_percepcao} onChange={e => setMudancaPercepcao(e.target.value)} /></div>
              <div><label className={lbl}>Informação adicional não perguntada</label><textarea className={ta} rows={5} value={info_adicional} onChange={e => setInfoAdicional(e.target.value)} /></div>
            </div>
          </section>

          {/* Erro e Botão */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              <p className="text-red-400 text-sm font-['Poppins']">{error}</p>
            </div>
          )}

          <div className="pb-16">
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: '100%', padding: '0.875rem 1.75rem', background: loading ? 'rgba(255,107,0,0.4)' : '#FF6B00', border: 'none', borderRadius: '8px', color: '#fff', fontFamily: FP, fontSize: '0.88rem', letterSpacing: '0.12em', textTransform: 'uppercase' as const, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(255,107,0,0.2)' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#e55f00'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#FF6B00'; }}
            >
              {loading ? 'ENVIANDO...' : 'ENVIAR BRIEFING'}
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}
