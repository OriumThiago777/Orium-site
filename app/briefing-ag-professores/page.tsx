'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ToolBackground from '@/components/ToolBackground';
import { useScrollSpy } from '@/lib/useScrollSpy';

const FP = 'var(--font-poppins), Poppins, sans-serif';

const SIDEBAR_ITEMS = [
  { id: 'parte1', label: 'Identificação' },
  { id: 'parte2', label: 'História' },
  { id: 'parte3', label: 'Método de ensino' },
  { id: 'parte4', label: 'Prova e resultado' },
  { id: 'parte5', label: 'Fotos e mídia' },
  { id: 'parte6', label: 'Redes e autorização' },
];

const SECTION_IDS = SIDEBAR_ITEMS.map(item => item.id);

function isValidUrl(value: string): boolean {
  if (!value) return true;
  try {
    new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return true;
  } catch {
    return false;
  }
}

function PartHeader({ n, title }: { n: number; title: string }) {
  return (
    <div style={{ paddingBottom: '2rem', marginBottom: '2.5rem', borderBottom: '1px solid #141414' }}>
      <p style={{ color: '#FF6B00', fontSize: '0.68rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.625rem', fontFamily: FP }}>
        Bloco {n} de {SECTION_IDS.length}
      </p>
      <h2 style={{ fontFamily: FP, fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', color: '#fff', letterSpacing: '0.04em', lineHeight: 1, margin: 0 }}>
        {title.toUpperCase()}
      </h2>
    </div>
  );
}

export default function BriefingAgProfessoresPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useScrollSpy(SECTION_IDS);

  // Bloco 1 — Identificação
  const [nome_completo, setNomeCompleto] = useState('');
  const [nome_exibicao, setNomeExibicao] = useState('');
  const [materia_area, setMateriaArea] = useState('');
  const [tempo_experiencia, setTempoExperiencia] = useState('');
  const [formacao_academica, setFormacaoAcademica] = useState('');

  // Bloco 2 — História
  const [como_comecou, setComoComecou] = useState('');
  const [momento_decisivo, setMomentoDecisivo] = useState('');
  const [o_que_mais_gosta, setOQueMaisGosta] = useState('');

  // Bloco 3 — Método de ensino
  const [metodo_ensino, setMetodoEnsino] = useState('');
  const [diferencial, setDiferencial] = useState('');
  const [frase_filosofia, setFraseFilosofia] = useState('');

  // Bloco 4 — Prova e resultado
  const [situacao_resultado, setSituacaoResultado] = useState('');
  const [certificacoes, setCertificacoes] = useState('');
  const [depoimento_aluno, setDepoimentoAluno] = useState('');

  // Bloco 5 — Fotos e mídia
  const [link_fotos, setLinkFotos] = useState('');
  const [foto_perfil_atual, setFotoPerfilAtual] = useState('');
  const [link_videos, setLinkVideos] = useState('');

  // Bloco 6 — Redes e autorização
  const [instagram_pessoal, setInstagramPessoal] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [autoriza_uso, setAutorizaUso] = useState('');

  async function handleSubmit() {
    setError('');

    if (!link_fotos.trim()) {
      setError('O link de fotos é obrigatório.');
      return;
    }
    if (!autoriza_uso) {
      setError('É necessário responder se autoriza o uso de imagem e depoimento.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/briefing-ag-professores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome_completo, nome_exibicao, materia_area, tempo_experiencia, formacao_academica,
          como_comecou, momento_decisivo, o_que_mais_gosta,
          metodo_ensino, diferencial, frase_filosofia,
          situacao_resultado, certificacoes, depoimento_aluno,
          link_fotos, foto_perfil_atual, link_videos,
          instagram_pessoal, whatsapp, autoriza_uso,
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
  const hint = 'text-[#8d8379] text-[0.72rem] mt-1.5 font-sans';
  const errHint = 'text-red-400 text-[0.72rem] mt-1.5 font-sans';
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
          <p className="text-white text-2xl uppercase tracking-wide mb-2">Formulário enviado</p>
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
              <p style={{ color: '#444444', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: FP, marginTop: '0.5rem', marginBottom: 0 }}>BRIEFING — AG PROFESSORES</p>
            </div>
          ) : (
            <div style={{ flexShrink: 0, height: '60px', borderBottom: '1px solid #0f0f0f' }} />
          )}

          {/* ZONA 2 — Blocos */}
          <div style={{ flex: 1, overflowY: 'hidden' }}>
            {!sidebarCollapsed && (
              <p style={{ color: '#444444', fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', padding: '1.25rem 1.75rem 0.75rem', margin: 0 }}>BLOCOS</p>
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

          {/* BLOCO 0 — Abertura */}
          <section>
            <p style={{ fontFamily: FP, fontSize: '0.95rem', lineHeight: 1.75, color: '#d8d0c8' }}>
              A AG - Ensino Personalizado agora conta com a ORIUM na estruturação da presença digital da marca. Você, como parte do time de professores da AG, também vai aparecer nesse processo. Vamos criar conteúdo que mostra quem você é, como ensina e o resultado que já gera para seus alunos. Preencha o formulário abaixo. Leva menos de 10 minutos e é a base para os posts que vamos produzir sobre você e seu trabalho.
            </p>
          </section>

          {/* BLOCO 1 */}
          <section id="parte1">
            <PartHeader n={1} title="Identificação" />
            <div className="space-y-5">
              <div><label className={lbl}>Nome completo</label><input className={input} value={nome_completo} onChange={e => setNomeCompleto(e.target.value)} /></div>
              <div><label className={lbl}>Como prefere ser chamado(a) nas redes</label><input className={input} value={nome_exibicao} onChange={e => setNomeExibicao(e.target.value)} /></div>
              <div><label className={lbl}>Matéria(s) ou área que leciona</label><input className={input} value={materia_area} onChange={e => setMateriaArea(e.target.value)} /></div>
              <div><label className={lbl}>Tempo de experiência como educador(a)</label><input className={input} value={tempo_experiencia} onChange={e => setTempoExperiencia(e.target.value)} /></div>
              <div><label className={lbl}>Formação acadêmica</label><input className={input} value={formacao_academica} onChange={e => setFormacaoAcademica(e.target.value)} /></div>
            </div>
          </section>

          {/* BLOCO 2 */}
          <section id="parte2">
            <PartHeader n={2} title="História" />
            <div className="space-y-5">
              <div><label className={lbl}>Como você começou a lecionar? O que te trouxe para o ensino?</label><textarea className={ta} value={como_comecou} onChange={e => setComoComecou(e.target.value)} /></div>
              <div><label className={lbl}>Qual foi um momento decisivo na sua trajetória como educador(a)?</label><textarea className={ta} value={momento_decisivo} onChange={e => setMomentoDecisivo(e.target.value)} /></div>
              <div><label className={lbl}>O que você mais gosta em ensinar sua matéria?</label><textarea className={ta} value={o_que_mais_gosta} onChange={e => setOQueMaisGosta(e.target.value)} /></div>
            </div>
          </section>

          {/* BLOCO 3 */}
          <section id="parte3">
            <PartHeader n={3} title="Método de ensino" />
            <div className="space-y-5">
              <div><label className={lbl}>Como você descreveria seu método de ensino?</label><textarea className={ta} value={metodo_ensino} onChange={e => setMetodoEnsino(e.target.value)} /></div>
              <div><label className={lbl}>O que diferencia sua forma de ensinar da maioria dos professores?</label><textarea className={ta} value={diferencial} onChange={e => setDiferencial(e.target.value)} /></div>
              <div><label className={lbl}>Resuma sua filosofia de ensino em uma frase</label><textarea className={ta} value={frase_filosofia} onChange={e => setFraseFilosofia(e.target.value)} /></div>
            </div>
          </section>

          {/* BLOCO 4 */}
          <section id="parte4">
            <PartHeader n={4} title="Prova e resultado" />
            <div className="space-y-5">
              <div><label className={lbl}>Conte uma situação real em que um aluno teve um resultado importante graças ao seu ensino</label><textarea className={ta} value={situacao_resultado} onChange={e => setSituacaoResultado(e.target.value)} /></div>
              <div><label className={lbl}>Você tem alguma certificação, prêmio ou reconhecimento relevante?</label><textarea className={ta} value={certificacoes} onChange={e => setCertificacoes(e.target.value)} /></div>
              <div><label className={lbl}>Tem algum depoimento de aluno que possamos usar?</label><textarea className={ta} value={depoimento_aluno} onChange={e => setDepoimentoAluno(e.target.value)} /></div>
            </div>
          </section>

          {/* BLOCO 5 */}
          <section id="parte5">
            <PartHeader n={5} title="Fotos e mídia" />
            <div className="space-y-5">
              <div>
                <label className={lbl}>Link (Google Drive, WeTransfer ou similar) com fotos suas em boa qualidade</label>
                <input className={input} value={link_fotos} onChange={e => setLinkFotos(e.target.value)} placeholder="https://" />
                {link_fotos && !isValidUrl(link_fotos) && <p className={errHint}>Formato de link inválido.</p>}
              </div>
              <div>
                <label className={lbl}>Tem uma foto de perfil que já usa nas redes e quer manter?</label>
                <input className={input} value={foto_perfil_atual} onChange={e => setFotoPerfilAtual(e.target.value)} placeholder="https://" />
                {foto_perfil_atual && !isValidUrl(foto_perfil_atual) && <p className={errHint}>Formato de link inválido.</p>}
              </div>
              <div>
                <label className={lbl}>Tem vídeos curtos seus que possamos usar? (opcional)</label>
                <input className={input} value={link_videos} onChange={e => setLinkVideos(e.target.value)} placeholder="https://" />
                {link_videos && !isValidUrl(link_videos) && <p className={errHint}>Formato de link inválido.</p>}
              </div>
            </div>
          </section>

          {/* BLOCO 6 */}
          <section id="parte6">
            <PartHeader n={6} title="Redes e autorização" />
            <div className="space-y-5">
              <div><label className={lbl}>Instagram pessoal (se tiver)</label><input className={input} value={instagram_pessoal} onChange={e => setInstagramPessoal(e.target.value)} placeholder="@usuario ou link" /></div>
              <div><label className={lbl}>WhatsApp para contato</label><input className={input} value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="(31) 90000-0000" /></div>
              <div>
                <label className={lbl}>Autoriza o uso da sua imagem, história e depoimentos nos conteúdos da AG e da ORIUM?</label>
                <Radios options={['Sim', 'Não']} value={autoriza_uso} onChange={setAutorizaUso} />
                {!autoriza_uso && <p className={hint}>Campo obrigatório.</p>}
              </div>
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
              {loading ? 'ENVIANDO...' : 'ENVIAR FORMULÁRIO'}
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}
