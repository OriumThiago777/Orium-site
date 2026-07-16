'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ToolBackground from '@/components/ToolBackground';
import { useScrollSpy } from '@/lib/useScrollSpy';

const FP = 'var(--font-poppins), Poppins, sans-serif';

const SIDEBAR_ITEMS = [
  { id: 'parte1', label: 'Identidade' },
  { id: 'parte2', label: 'A Gestora' },
  { id: 'parte3', label: 'Públicos' },
  { id: 'parte4', label: 'Produto e Status' },
  { id: 'parte5', label: 'Autoridade' },
  { id: 'parte6', label: 'Objetivos' },
  { id: 'parte7', label: 'Direção Criativa' },
  { id: 'parte8', label: 'Logística' },
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

export default function BriefingAGPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useScrollSpy(SECTION_IDS);

  // Parte 1 — Identidade e Posicionamento
  const [o_que_e_ag, setOQueEAg] = useState('');
  const [falta_se_sumisse, setFaltaSeSumisse] = useState('');
  const [diferencial_principal, setDiferencialPrincipal] = useState('');
  const [tagline_atual, setTaglineAtual] = useState('');
  const [peso_escolha, setPesoEscolha] = useState('');

  // Parte 2 — Perfil da Gestora/Responsável
  const [trajetoria_gestora, setTrajetoriaGestora] = useState('');
  const [credencial_autoridade, setCredencialAutoridade] = useState('');
  const [historia_origem, setHistoriaOrigem] = useState('');

  // Parte 3 — Públicos e Audiências
  const [perfil_aluno, setPerfilAluno] = useState('');
  const [perfil_professor, setPerfilProfessor] = useState('');
  const [publico_prioridade, setPublicoPrioridade] = useState('');
  const [objecao_aluno, setObjecaoAluno] = useState('');
  const [objecao_professor, setObjecaoProfessor] = useState('');
  const [depoimento_satisfeitos, setDepoimentoSatisfeitos] = useState('');

  // Parte 4 — Produto/Portfólio e Status Atual
  const [servicos_oferecidos, setServicosOferecidos] = useState('');
  const [servico_mais_demanda, setServicoMaisDemanda] = useState('');
  const [servico_potencial, setServicoPotencial] = useState('');
  const [status_instagram, setStatusInstagram] = useState('');
  const [site_reflete, setSiteReflete] = useState('');
  const [atendimento_whatsapp, setAtendimentoWhatsapp] = useState('');
  const [fotos_espaco, setFotosEspaco] = useState('');

  // Parte 5 — Autoridade e Prova Social
  const [depoimentos_numeros, setDepoimentosNumeros] = useState('');
  const [parcerias_certificacoes, setParceriasCertificacoes] = useState('');
  const [midia_imprensa, setMidiaImprensa] = useState('');

  // Parte 6 — Objetivos
  const [objetivo_3_6_meses, setObjetivo36Meses] = useState('');
  const [maior_gargalo, setMaiorGargalo] = useState('');
  const [coworking_prioridade, setCoworkingPrioridade] = useState('');

  // Parte 7 — Direção Criativa
  const [referencia_visual, setReferenciaVisual] = useState('');
  const [o_que_nao_querem, setOQueNaoQuerem] = useState('');
  const [tom_voz, setTomVoz] = useState('');

  // Parte 8 — Logística e Operação
  const [frequencia_producao, setFrequenciaProducao] = useState('');
  const [quem_aprova, setQuemAprova] = useState('');
  const [sazonalidade, setSazonalidade] = useState('');
  const [canal_horario_aprovacao, setCanalHorarioAprovacao] = useState('');

  async function handleSubmit() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/briefing-ag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          o_que_e_ag, falta_se_sumisse, diferencial_principal, tagline_atual, peso_escolha,
          trajetoria_gestora, credencial_autoridade, historia_origem,
          perfil_aluno, perfil_professor, publico_prioridade, objecao_aluno, objecao_professor, depoimento_satisfeitos,
          servicos_oferecidos, servico_mais_demanda, servico_potencial, status_instagram, site_reflete, atendimento_whatsapp, fotos_espaco,
          depoimentos_numeros, parcerias_certificacoes, midia_imprensa,
          objetivo_3_6_meses, maior_gargalo, coworking_prioridade,
          referencia_visual, o_que_nao_querem, tom_voz,
          frequencia_producao, quem_aprova, sazonalidade, canal_horario_aprovacao,
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

  const input = 'w-full bg-[rgba(255,255,255,0.065)] border border-[#2a2520] rounded-[10px] px-[1.15rem] py-[0.92rem] text-[#f4eee8] text-[0.95rem] max-md:text-base leading-[1.65] font-sans caret-[#FF6B00] placeholder-[#91877d] outline-none transition-[border-color,background-color,box-shadow] duration-200 hover:bg-[rgba(255,255,255,0.075)] hover:border-[#3a332d] focus:bg-[rgba(255,255,255,0.082)] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]/40 focus:shadow-[0_10px_32px_rgba(0,0,0,0.18)]';
  const ta = input + ' resize-y min-h-[118px]';
  const lbl = 'block text-[#d8d0c8] text-[0.74rem] font-medium tracking-[0.08em] leading-[1.45] uppercase mb-2.5 font-sans';
  const chk = 'w-4 h-4 shrink-0 mt-[0.18rem] cursor-pointer accent-[#FF6B00]';
  const choiceList = 'flex flex-col gap-[0.65rem]';
  const choice = 'flex items-start gap-3 cursor-pointer text-[#d6d0c8] text-[0.92rem] leading-[1.55] font-sans transition-colors duration-200 hover:text-white';
  const activeIndex = SECTION_IDS.indexOf(activeSection);
  const progress = ((activeIndex + 1) / SECTION_IDS.length) * 100;

  function Radios({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
    return (
      <div className={choiceList}>
        {options.map(opt => (
          <label key={opt} className={choice}>
            <input type="radio" className={chk} checked={value === opt} onChange={() => onChange(opt)} />
            {opt}
          </label>
        ))}
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center p-8" style={{ fontFamily: FP }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-white text-2xl uppercase tracking-wide mb-2">Briefing enviado</p>
          <p className="text-[#8d8379] text-sm mb-8">As respostas foram registradas no Notion.</p>
          <Link href="/hub" className="text-[#FF6B00] text-sm underline">Voltar ao hub</Link>
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
              <p style={{ color: '#444444', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: FP, marginTop: '0.5rem', marginBottom: 0 }}>BRIEFING — AG ENSINO PERSONALIZADO</p>
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
        <main className="flex-1 px-6 md:px-16 py-10 md:py-12 max-w-[760px] w-full space-y-20">

          {/* PARTE 1 */}
          <section id="parte1">
            <PartHeader n={1} title="Identidade e Posicionamento" />
            <div className="space-y-5">
              <div><label className={lbl}>Em uma frase, o que é a AG</label><textarea className={ta} value={o_que_e_ag} onChange={e => setOQueEAg(e.target.value)} placeholder="Uma frase que resume o que a AG é..." /></div>
              <div><label className={lbl}>O que os alunos/professores sentiriam falta se a AG sumisse amanhã</label><textarea className={ta} value={falta_se_sumisse} onChange={e => setFaltaSeSumisse(e.target.value)} /></div>
              <div><label className={lbl}>Principal diferencial frente a outras opções de aula particular/plataformas em BH</label><textarea className={ta} value={diferencial_principal} onChange={e => setDiferencialPrincipal(e.target.value)} /></div>
              <div><label className={lbl}>Tagline ou frase-síntese já usada (opcional)</label><input className={input} value={tagline_atual} onChange={e => setTaglineAtual(e.target.value)} /></div>
              <div>
                <label className={lbl}>O que mais pesa na escolha hoje</label>
                <Radios options={['Preço', 'Espaço físico', 'Qualidade dos professores', 'Conveniência', 'Indicação', 'Outro']} value={peso_escolha} onChange={setPesoEscolha} />
              </div>
            </div>
          </section>

          {/* PARTE 2 */}
          <section id="parte2">
            <PartHeader n={2} title="Perfil da Gestora/Responsável" />
            <div className="space-y-5">
              <div><label className={lbl}>Trajetória de quem fundou/gerencia a AG</label><textarea className={ta} value={trajetoria_gestora} onChange={e => setTrajetoriaGestora(e.target.value)} /></div>
              <div><label className={lbl}>Credencial, formação ou experiência que sustente autoridade</label><textarea className={ta} value={credencial_autoridade} onChange={e => setCredencialAutoridade(e.target.value)} /></div>
              <div><label className={lbl}>História de origem — por que a AG começou</label><textarea className={ta} value={historia_origem} onChange={e => setHistoriaOrigem(e.target.value)} /></div>
            </div>
          </section>

          {/* PARTE 3 */}
          <section id="parte3">
            <PartHeader n={3} title="Públicos e Audiências" />
            <div className="space-y-5">
              <div><label className={lbl}>Perfil dos alunos que mais procuram hoje</label><textarea className={ta} value={perfil_aluno} onChange={e => setPerfilAluno(e.target.value)} /></div>
              <div><label className={lbl}>Perfil dos professores que mais procuram hoje</label><textarea className={ta} value={perfil_professor} onChange={e => setPerfilProfessor(e.target.value)} /></div>
              <div>
                <label className={lbl}>Público prioridade de crescimento agora</label>
                <Radios options={['Aluno', 'Professor', 'Ambos']} value={publico_prioridade} onChange={setPublicoPrioridade} />
              </div>
              <div><label className={lbl}>Principal objeção do aluno antes de fechar</label><textarea className={ta} value={objecao_aluno} onChange={e => setObjecaoAluno(e.target.value)} /></div>
              <div><label className={lbl}>Principal objeção do professor antes de fechar</label><textarea className={ta} value={objecao_professor} onChange={e => setObjecaoProfessor(e.target.value)} /></div>
              <div><label className={lbl}>O que dizem depois de satisfeitos (depoimento real, se houver)</label><textarea className={ta} value={depoimento_satisfeitos} onChange={e => setDepoimentoSatisfeitos(e.target.value)} /></div>
            </div>
          </section>

          {/* PARTE 4 */}
          <section id="parte4">
            <PartHeader n={4} title="Produto/Portfólio e Status Atual" />
            <div className="space-y-5">
              <div><label className={lbl}>Todos os serviços oferecidos hoje (aulas particulares, co-working, mentorias, cursos, produção acadêmica, outro)</label><textarea className={ta} value={servicos_oferecidos} onChange={e => setServicosOferecidos(e.target.value)} /></div>
              <div><label className={lbl}>Serviço com mais demanda hoje</label><textarea className={ta} value={servico_mais_demanda} onChange={e => setServicoMaisDemanda(e.target.value)} /></div>
              <div><label className={lbl}>Serviço com potencial não explorado</label><textarea className={ta} value={servico_potencial} onChange={e => setServicoPotencial(e.target.value)} /></div>
              <div><label className={lbl}>Estado atual do Instagram @ag_ensino_personalizado</label><textarea className={ta} value={status_instagram} onChange={e => setStatusInstagram(e.target.value)} /></div>
              <div><label className={lbl}>O site anaglades.com.br reflete bem o que a AG é hoje</label><textarea className={ta} value={site_reflete} onChange={e => setSiteReflete(e.target.value)} /></div>
              <div><label className={lbl}>Como funciona o atendimento via WhatsApp hoje</label><textarea className={ta} value={atendimento_whatsapp} onChange={e => setAtendimentoWhatsapp(e.target.value)} /></div>
              <div><label className={lbl}>Fotos do espaço físico disponíveis para uso</label><textarea className={ta} value={fotos_espaco} onChange={e => setFotosEspaco(e.target.value)} placeholder="Há banco de fotos/vídeos do espaço? Precisamos produzir do zero?" /></div>
            </div>
          </section>

          {/* PARTE 5 */}
          <section id="parte5">
            <PartHeader n={5} title="Autoridade e Prova Social" />
            <div className="space-y-5">
              <div><label className={lbl}>Depoimentos, números (alunos, professores, anos de atuação) ou resultados</label><textarea className={ta} value={depoimentos_numeros} onChange={e => setDepoimentosNumeros(e.target.value)} /></div>
              <div><label className={lbl}>Parcerias, certificações ou reconhecimentos relevantes</label><textarea className={ta} value={parcerias_certificacoes} onChange={e => setParceriasCertificacoes(e.target.value)} /></div>
              <div><label className={lbl}>Mídia ou imprensa que já falou da AG</label><textarea className={ta} value={midia_imprensa} onChange={e => setMidiaImprensa(e.target.value)} /></div>
            </div>
          </section>

          {/* PARTE 6 */}
          <section id="parte6">
            <PartHeader n={6} title="Objetivos" />
            <div className="space-y-5">
              <div><label className={lbl}>O que a AG precisa alcançar nos próximos 3-6 meses, de forma concreta</label><textarea className={ta} value={objetivo_3_6_meses} onChange={e => setObjetivo36Meses(e.target.value)} /></div>
              <div><label className={lbl}>Maior gargalo hoje que impede crescer mais rápido</label><textarea className={ta} value={maior_gargalo} onChange={e => setMaiorGargalo(e.target.value)} /></div>
              <div>
                <label className={lbl}>O co-working é frente prioritária de crescimento ou complemento secundário</label>
                <Radios options={['Frente prioritária de crescimento', 'Complemento secundário']} value={coworking_prioridade} onChange={setCoworkingPrioridade} />
              </div>
            </div>
          </section>

          {/* PARTE 7 */}
          <section id="parte7">
            <PartHeader n={7} title="Direção Criativa" />
            <div className="space-y-5">
              <div><label className={lbl}>Referência visual que admiram e gostariam de se inspirar</label><textarea className={ta} value={referencia_visual} onChange={e => setReferenciaVisual(e.target.value)} /></div>
              <div><label className={lbl}>O que NÃO querem no conteúdo (tom, estética, tipo de post)</label><textarea className={ta} value={o_que_nao_querem} onChange={e => setOQueNaoQuerem(e.target.value)} /></div>
              <div>
                <label className={lbl}>Tom de voz ideal</label>
                <Radios options={['Formal/institucional', 'Próximo/acolhedor', 'Premium/exclusivo', 'Outro']} value={tom_voz} onChange={setTomVoz} />
              </div>
            </div>
          </section>

          {/* PARTE 8 */}
          <section id="parte8">
            <PartHeader n={8} title="Logística e Operação" />
            <div className="space-y-5">
              <div><label className={lbl}>Frequência que conseguem gravar/fotografar/produzir conteúdo</label><input className={input} value={frequencia_producao} onChange={e => setFrequenciaProducao(e.target.value)} /></div>
              <div><label className={lbl}>Quem aprova o conteúdo antes de publicar</label><input className={input} value={quem_aprova} onChange={e => setQuemAprova(e.target.value)} /></div>
              <div><label className={lbl}>Datas ou sazonalidade que influenciam a demanda (início de semestre, vestibular, provas)</label><textarea className={ta} value={sazonalidade} onChange={e => setSazonalidade(e.target.value)} /></div>
              <div><label className={lbl}>Melhor canal e horário para falar sobre aprovações e ajustes</label><input className={input} value={canal_horario_aprovacao} onChange={e => setCanalHorarioAprovacao(e.target.value)} /></div>
            </div>
          </section>

          {/* Erro e Botão */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
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
