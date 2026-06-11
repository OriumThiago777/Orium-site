'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import NextImage from 'next/image';
import Link from 'next/link';
import { isAuthenticated, saveAuth, authHeaders } from '@/lib/auth';
import { savePdfToCloud } from '@/lib/upload-helper';
import { useDraft } from '@/lib/draft';
import SaveToast from '@/components/SaveToast';
import DraftBanner from '@/components/DraftBanner';
import ClienteSelector from '@/components/ClienteSelector';

const DIMENSOES = [
  'Primeira Impressão',
  'Clareza da Oferta',
  'Identidade Visual',
  'Posicionamento',
  'Conteúdo e Comunicação',
  'Presença Local e Digital',
  'Jornada do Cliente',
  'Percepção de Valor',
] as const;

type Classificacao = 'Crítico' | 'Atenção' | 'Sólido' | '';

interface DimensaoData {
  classificacao: Classificacao;
  observacao: string;
}

interface FormState {
  nomeCliente: string;
  segmentoCliente: string;
  dataAnalise: string;
  dimensoes: DimensaoData[];
  investimento: string;
  proximosPassos: string;
}

const BADGE = {
  Crítico: { bg: '#DC2626', text: '#ffffff', border: '#991b1b' },
  Atenção: { bg: '#D97706', text: '#ffffff', border: '#92400e' },
  Sólido:  { bg: '#16A34A', text: '#ffffff', border: '#14532d' },
} as const;

const PROMPT_ANALISE = `Você é um analista estratégico da ORIUM, empresa de estruturação digital.

Acesse o perfil do Instagram: [COLE O LINK AQUI]

Analise com base nas seguintes dimensões e me entregue um diagnóstico completo:

1. PRIMEIRA IMPRESSÃO — O que um desconhecido vê nos primeiros 10 segundos. Bio, foto de perfil, feed, destaques.

2. CLAREZA DA OFERTA — Fica claro o que essa pessoa/empresa faz, para quem e por quê escolher ela?

3. IDENTIDADE VISUAL — Existe consistência entre cores, tipografia, tom e estética? Parece profissional ou improvisado?

4. POSICIONAMENTO — A marca tem um ponto de vista claro ou é genérica?

5. CONTEÚDO E COMUNICAÇÃO — O que está sendo publicado serve para atrair, educar ou converter?

6. PRESENÇA LOCAL E DIGITAL — Google Meu Negócio, avaliações, site, links, WhatsApp Business — está tudo organizado?

7. JORNADA DO CLIENTE — Quando alguém quer contratar, o caminho é claro? Tem CTA, link, contato?

8. PERCEPÇÃO DE VALOR — O que a marca comunica está compatível com o que ela cobra?

Para cada dimensão classifique como:
🔴 Crítico — precisa de ação imediata
🟡 Atenção — funciona mas tem gaps importantes
🟢 Sólido — está bem

Ao final liste as 3 prioridades mais urgentes com observações detalhadas para cada uma.`;

function formatarInvestimento(val: string): string {
  if (!val.trim()) return '—';
  if (val.trim().startsWith('R$')) return val.trim();
  const num = parseFloat(val.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, ''));
  if (!isNaN(num)) {
    return 'R$ ' + num.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  return val.trim();
}

const ALL_STEPS = ['Informações', ...DIMENSOES, 'Conclusões'];
const STEP_SUBTITLES = [
  'Identifique o cliente e utilize o prompt abaixo com a IA.',
  ...DIMENSOES.map((_, i) => `Dimensão ${i + 1} de 8 — classifique e documente as observações.`),
  'Defina o investimento sugerido e os próximos passos.',
];

function CharCounter({ value, max }: { value: string; max: number }) {
  const remaining = max - value.length;
  return (
    <div style={{ textAlign: 'right', fontSize: '0.7rem', fontFamily: 'Poppins, sans-serif', color: remaining <= 10 ? '#FF6B00' : '#777', marginTop: '0.25rem' }}>
      {value.length}/{max}
    </div>
  );
}

function RaioXPage() {
  const [autenticado, setAutenticado] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [senha, setSenha] = useState('');
  const [erroSenha, setErroSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [promptAberto, setPromptAberto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [step, setStep] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAutenticado(isAuthenticated());
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [step]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [documentoId, setDocumentoId] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState('');
  const searchParams = useSearchParams();
  const docParam = searchParams.get('doc');
  const clienteParam = searchParams.get('cliente');

  useEffect(() => {
    if (!autenticado || !docParam) return;
    fetch(`/api/documentos?id=${docParam}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => { if (data.dados) { setForm(data.dados); setDocumentoId(docParam); } })
      .catch(console.error);
  }, [autenticado, docParam]);

  const [form, setForm] = useState<FormState>({
    nomeCliente: clienteParam || '',
    segmentoCliente: '',
    dataAnalise: new Date().toISOString().split('T')[0],
    dimensoes: Array.from({ length: 8 }, () => ({ classificacao: '' as Classificacao, observacao: '' })),
    investimento: '',
    proximosPassos: '',
  });

  const { draft, retomar, descartar, concluir } = useDraft(
    'raio-x',
    { step, form },
    d => { setForm(d.form); setStep(d.step); },
    autenticado && !docParam,
  );

  async function handleSenha(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErroSenha(false);
    try {
      const res = await fetch('/api/raio-x/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha }),
      });
      if (res.ok) { saveAuth(senha); setAutenticado(true); }
      else setErroSenha(true);
    } catch {
      setErroSenha(true);
    } finally {
      setCarregando(false);
    }
  }

  function copiarPrompt() {
    navigator.clipboard.writeText(PROMPT_ANALISE);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  function setDimensao(i: number, campo: keyof DimensaoData, valor: string) {
    setForm(prev => ({
      ...prev,
      dimensoes: prev.dimensoes.map((d, idx) => idx === i ? { ...d, [campo]: valor } : d),
    }));
  }

  async function gerarPDF() {
    if (!form.nomeCliente.trim()) {
      alert('Preencha o nome do cliente antes de gerar o PDF.');
      return;
    }

    setGerando(true);
    try {
      if (!document.getElementById('raio-x-gfonts')) {
        const link = document.createElement('link');
        link.id = 'raio-x-gfonts';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Anton&family=Poppins:wght@400;600;700&display=swap';
        document.head.appendChild(link);
        await new Promise(r => setTimeout(r, 1500));
      }
      await document.fonts.ready;

      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const PX_W = 794;
      const PX_H = 1123;

      const logoBase64 = await new Promise<string>(resolve => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const c = document.createElement('canvas');
          c.width = img.width;
          c.height = img.height;
          c.getContext('2d')!.drawImage(img, 0, 0);
          resolve(c.toDataURL('image/png'));
        };
        img.onerror = () => resolve('');
        img.src = '/lgbranca.png';
      });

      const dataFormatada = new Date(form.dataAnalise + 'T12:00:00').toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric',
      });

      let isFirst = true;
      async function addPage(html: string) {
        const el = document.createElement('div');
        el.style.cssText = [
          'position:fixed', 'left:-9999px', 'top:0',
          `width:${PX_W}px`, `height:${PX_H}px`,
          'background:#080808', 'overflow:hidden',
          "font-family:'Poppins',Arial,sans-serif",
          'box-sizing:border-box',
        ].join(';');
        el.innerHTML = html;
        document.body.appendChild(el);
        try {
          await new Promise(r => setTimeout(r, 80));
          const canvas = await html2canvas(el, {
            backgroundColor: '#080808',
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            width: PX_W,
            height: PX_H,
          });
          const imgData = canvas.toDataURL('image/jpeg', 0.93);
          if (!isFirst) doc.addPage();
          isFirst = false;
          doc.addImage(imgData, 'JPEG', 0, 0, 210, 297);
        } finally {
          document.body.removeChild(el);
        }
      }

      const POPPINS = "font-family:'Poppins',Arial,sans-serif;";
      const ANTON   = "font-family:'Anton',Impact,sans-serif;";
      const TOP_BAR = 'position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#FF6B00,#FF8C00 50%,#FF6B00);';
      const LABEL   = 'color:#555;font-size:13px;letter-spacing:4px;text-transform:uppercase;';

      await addPage(`
        <div style="${POPPINS}width:${PX_W}px;height:${PX_H}px;background:#080808;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;padding:80px;box-sizing:border-box;">
          <div style="${TOP_BAR}"></div>
          <div style="position:absolute;bottom:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#FF6B00,#FF8C00 50%,#FF6B00);"></div>
          ${logoBase64
            ? `<img src="${logoBase64}" style="height:52px;margin-bottom:80px;object-fit:contain;" />`
            : `<div style="height:132px;"></div>`}
          <div style="text-align:center;margin-bottom:48px;">
            <div style="${ANTON}font-size:84px;color:#FF6B00;letter-spacing:6px;line-height:1;margin-bottom:8px;">RAIO-X</div>
            <div style="${ANTON}font-size:34px;color:#fff;letter-spacing:18px;">ORIUM</div>
          </div>
          <div style="width:56px;height:3px;background:#FF6B00;margin-bottom:48px;"></div>
          <div style="text-align:center;">
            <div style="${LABEL}margin-bottom:14px;">Diagnóstico para</div>
            <div style="${ANTON}font-size:42px;color:#fff;margin-bottom:10px;">${form.nomeCliente}</div>
            <div style="color:#FF6B00;font-size:17px;margin-bottom:30px;font-weight:600;">${form.segmentoCliente}</div>
            <div style="color:#444;font-size:14px;">${dataFormatada}</div>
          </div>
          <div style="position:absolute;bottom:28px;color:#2a2a2a;font-size:10px;letter-spacing:3px;text-transform:uppercase;">Uso Interno · Orium Agency</div>
        </div>
      `);

      for (let i = 0; i < DIMENSOES.length; i++) {
        const dim = form.dimensoes[i];
        if (!dim.classificacao && !dim.observacao.trim()) continue;

        const co = dim.classificacao in BADGE
          ? BADGE[dim.classificacao as keyof typeof BADGE]
          : null;

        const badgeHtml = co
          ? `<div style="display:inline-block;background:${co.bg};border-radius:8px;padding:12px 30px;">
               <span style="color:${co.text};font-weight:700;font-size:16px;letter-spacing:2px;${POPPINS}">${dim.classificacao!.toUpperCase()}</span>
             </div>`
          : `<div style="display:inline-block;background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:12px 30px;">
               <span style="color:#555;font-size:14px;${POPPINS}">Não avaliado</span>
             </div>`;

        const obs = dim.observacao
          ? dim.observacao.replace(/\n/g, '<br/>')
          : '<span style="color:#333;font-style:italic;">Nenhuma observação registrada.</span>';

        await addPage(`
          <div style="${POPPINS}width:${PX_W}px;height:${PX_H}px;background:#080808;padding:70px 70px 100px 70px;box-sizing:border-box;position:relative;">
            <div style="${TOP_BAR}"></div>
            <div style="${ANTON}font-size:200px;color:#FF6B00;position:absolute;right:40px;top:10px;opacity:0.05;line-height:1;">${String(i + 1).padStart(2, '0')}</div>
            <div style="margin-bottom:32px;">
              <div style="${LABEL}margin-bottom:10px;">DIMENSÃO ${i + 1} DE ${DIMENSOES.length}</div>
              <div style="${ANTON}font-size:52px;color:#fff;line-height:1.1;margin-bottom:22px;">${DIMENSOES[i]}</div>
              ${badgeHtml}
            </div>
            <div style="width:48px;height:2px;background:#FF6B00;margin-bottom:38px;"></div>
            <div>
              <div style="${LABEL}margin-bottom:16px;">ANÁLISE E OBSERVAÇÕES</div>
              <div style="color:#d0d0d0;font-size:20px;line-height:2.0;max-width:620px;">${obs}</div>
            </div>
            <div style="position:absolute;bottom:36px;left:70px;right:70px;border-top:1px solid #1a1a1a;padding-top:16px;display:flex;justify-content:space-between;">
              <div style="color:#2a2a2a;font-size:13px;letter-spacing:2px;">ORIUM AGENCY · RAIO-X</div>
              <div style="color:#2a2a2a;font-size:13px;">${form.nomeCliente} · ${form.dataAnalise}</div>
            </div>
          </div>
        `);
      }

      const criticos = DIMENSOES.map((n, i) => ({ n, i })).filter(({ i }) => form.dimensoes[i].classificacao === 'Crítico');
      const atencao  = DIMENSOES.map((n, i) => ({ n, i })).filter(({ i }) => form.dimensoes[i].classificacao === 'Atenção');
      const top3 = [...criticos, ...atencao].slice(0, 3);

      const top3Html = top3.length
        ? top3.map(({ n, i }, rank) => {
            const cl = form.dimensoes[i].classificacao as keyof typeof BADGE;
            const co = BADGE[cl];
            const obs = form.dimensoes[i].observacao;
            const resumo = obs.length > 85 ? obs.slice(0, 85) + '…' : (obs || 'Sem observação');
            return `
              <div style="display:flex;align-items:center;gap:16px;margin-bottom:10px;background:#0f0f0f;border:1px solid #1a1a1a;border-radius:10px;padding:14px 18px;">
                <div style="${ANTON}font-size:34px;color:#FF6B00;min-width:38px;line-height:1;">${rank + 1}</div>
                <div style="flex:1;min-width:0;">
                  <div style="color:#fff;font-size:15px;font-weight:700;margin-bottom:3px;${POPPINS}">${n}</div>
                  <div style="color:#555;font-size:12px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;${POPPINS}">${resumo}</div>
                </div>
                <div style="background:${co.bg};border-radius:6px;padding:5px 12px;white-space:nowrap;flex-shrink:0;">
                  <span style="color:${co.text};font-size:11px;font-weight:700;${POPPINS}">${cl.toUpperCase()}</span>
                </div>
              </div>`;
          }).join('')
        : `<div style="color:#2a2a2a;font-style:italic;padding:16px 0;font-size:15px;${POPPINS}">Nenhuma prioridade crítica identificada.</div>`;

      const investimentoFormatado = formatarInvestimento(form.investimento);
      const passosHtml = form.proximosPassos.replace(/\n/g, '<br/>');

      await addPage(`
        <div style="${POPPINS}width:${PX_W}px;height:${PX_H}px;background:#080808;padding:60px 70px 0 70px;box-sizing:border-box;position:relative;display:flex;flex-direction:column;">
          <div style="${TOP_BAR}"></div>
          <div style="margin-bottom:36px;margin-top:10px;">
            <div style="color:#FF6B00;font-size:10px;letter-spacing:4px;text-transform:uppercase;margin-bottom:10px;">RESUMO EXECUTIVO</div>
            <div style="${ANTON}font-size:50px;color:#fff;line-height:1;">DIAGNÓSTICO FINAL</div>
          </div>
          <div style="margin-bottom:28px;">
            <div style="${LABEL}margin-bottom:14px;">TOP 3 PRIORIDADES</div>
            ${top3Html}
          </div>
          <div style="width:100%;height:1px;background:#1a1a1a;margin-bottom:28px;"></div>
          <div style="margin-bottom:24px;">
            <div style="${LABEL}margin-bottom:10px;">INVESTIMENTO SUGERIDO</div>
            <div style="${ANTON}font-size:38px;color:#FF6B00;line-height:1;">${investimentoFormatado}</div>
          </div>
          ${form.proximosPassos ? `
          <div style="margin-bottom:24px;">
            <div style="${LABEL}margin-bottom:10px;">PRÓXIMOS PASSOS</div>
            <div style="color:#d0d0d0;font-size:17px;line-height:2.0;max-width:640px;${POPPINS}">${passosHtml}</div>
          </div>` : ''}
          <div style="margin-top:auto;border-top:1px solid #1a1a1a;padding:16px 0 36px 0;display:flex;justify-content:space-between;">
            <div style="color:#2a2a2a;font-size:13px;letter-spacing:2px;">ORIUM AGENCY · RAIO-X</div>
            <div style="color:#2a2a2a;font-size:13px;">${dataFormatada}</div>
          </div>
        </div>
      `);

      const arquivo = `raio-x-${form.nomeCliente.toLowerCase().replace(/\s+/g, '-')}-${form.dataAnalise}.pdf`;
      const pdfBlob = doc.output('blob');
      doc.save(arquivo);
      setSaveStatus('saving');
      savePdfToCloud(pdfBlob, form.nomeCliente, 'Raio-X', arquivo)
        .then(result => { setSaveStatus(result.success ? 'success' : 'error'); setTimeout(() => setSaveStatus('idle'), 4000); })
        .catch(() => { setSaveStatus('error'); setTimeout(() => setSaveStatus('idle'), 4000); });

      const docId = documentoId || crypto.randomUUID();
      fetch('/api/documentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ id: docId, tipo: 'Raio-X', nome: form.nomeCliente || 'Documento sem nome', cliente: form.nomeCliente, dados: form }),
      }).then(() => { setDocumentoId(docId); setSavedMsg('Salvo em Documentos'); setTimeout(() => setSavedMsg(''), 3000); }).catch(console.error);
      concluir();

    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      alert('Erro ao gerar o PDF. Verifique o console e tente novamente.');
    } finally {
      setGerando(false);
    }
  }

  // ── Tela de senha ──────────────────────────────────────────────────────────────
  if (!authChecked) return null;
  if (!autenticado) {
    return (
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins, sans-serif' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(255,107,0,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px', padding: '0 2rem' }}>
          <div style={{ marginBottom: '3rem' }}>
            <NextImage src="/lglaranja.png" alt="ORIUM" width={120} height={40} style={{ objectFit: 'contain' }} />
          </div>
          <p style={{ color: '#FF6B00', fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem' }}>ACESSO INTERNO</p>
          <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(3rem, 6vw, 4.5rem)', color: '#fff', letterSpacing: '0.02em', lineHeight: 0.95, marginBottom: '1.75rem' }}>RAIO-X</h1>
          <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.75, marginBottom: '3rem' }}>Ferramenta interna de diagnóstico estratégico.</p>
          <form onSubmit={handleSenha} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              type="password"
              placeholder="Senha de acesso"
              value={senha}
              onChange={e => { setSenha(e.target.value); setErroSenha(false); }}
              autoFocus
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${erroSenha ? '#ef4444' : '#1e1e1e'}`, borderRadius: '10px', padding: '1rem 1.25rem', color: '#fff', fontSize: '0.95rem', fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              onFocus={e => { if (!erroSenha) e.target.style.borderColor = '#FF6B00'; }}
              onBlur={e => { if (!erroSenha) e.target.style.borderColor = '#1e1e1e'; }}
            />
            {erroSenha && <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>Senha incorreta. Tente novamente.</p>}
            <button
              type="submit"
              disabled={carregando || !senha}
              style={{ width: '100%', background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '1rem', color: '#000', fontFamily: 'Anton, sans-serif', fontSize: '1rem', letterSpacing: '0.15em', cursor: carregando || !senha ? 'not-allowed' : 'pointer', boxShadow: '0 4px 20px rgba(255,107,0,0.2)', opacity: carregando || !senha ? 0.5 : 1, transition: 'all 0.2s' }}
            >
              {carregando ? '...' : 'ACESSAR'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Layout principal ───────────────────────────────────────────────────────────

  const totalSteps = ALL_STEPS.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const IS: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e1e',
    borderRadius: '10px', padding: '1rem 1.25rem', color: '#fff', fontSize: '0.95rem',
    fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
  };
  const onF = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = '#FF6B00'; };
  const onB = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = '#1e1e1e'; };
  const LB: React.CSSProperties = { display: 'block', color: '#444', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: 'Poppins, sans-serif' };

  function renderContent() {
    // Step 0 — Informações
    if (step === 0) {
      return (
        <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Prompt */}
          <div style={{ border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
            <button
              onClick={() => setPromptAberto(p => !p)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.25rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '0.85rem', fontFamily: 'Poppins, sans-serif' }}
            >
              <span>Prompt de Análise</span>
              <span style={{ fontSize: '0.75rem', display: 'inline-block', transform: promptAberto ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▾</span>
            </button>
            {promptAberto && (
              <div style={{ borderTop: '1px solid #1e1e1e', padding: '1rem' }}>
                <div style={{ position: 'relative' }}>
                  <pre style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '1rem', paddingTop: '2.5rem', color: '#aaa', fontSize: '0.78rem', lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, maxHeight: '300px', overflowY: 'auto', fontFamily: 'monospace' }}>
                    {PROMPT_ANALISE}
                  </pre>
                  <button
                    onClick={copiarPrompt}
                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: copiado ? '#444' : '#FF6B00', border: 'none', borderRadius: '6px', padding: '0.375rem 0.75rem', color: '#fff', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s', letterSpacing: '0.05em' }}
                  >
                    {copiado ? 'Copiado ✓' : 'Copiar'}
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Dados do cliente */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            <div>
              <label style={LB}>Nome do Cliente</label>
              <ClienteSelector value={form.nomeCliente} onChange={nome => setForm(p => ({ ...p, nomeCliente: nome }))} placeholder="Ex: Restaurante do João" />
            </div>
            <div>
              <label style={LB}>Segmento</label>
              <input type="text" maxLength={40} placeholder="Ex: Alimentação" value={form.segmentoCliente} onChange={e => setForm(p => ({ ...p, segmentoCliente: e.target.value }))} onFocus={onF} onBlur={onB} style={IS} />
              <CharCounter value={form.segmentoCliente} max={40} />
            </div>
            <div>
              <label style={LB}>Data da Análise</label>
              <input type="date" value={form.dataAnalise} onChange={e => setForm(p => ({ ...p, dataAnalise: e.target.value }))} onFocus={onF} onBlur={onB} style={IS} />
            </div>
          </div>
        </div>
      );
    }

    // Steps 1–8 — Dimensões
    if (step >= 1 && step <= 8) {
      const di = step - 1;
      const dim = form.dimensoes[di];
      return (
        <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
            {(['Crítico', 'Atenção', 'Sólido'] as const).map(c => {
              const active = dim.classificacao === c;
              const col = c === 'Crítico' ? '#ef4444' : c === 'Atenção' ? '#f59e0b' : '#22c55e';
              return (
                <button
                  key={c}
                  onClick={() => setDimensao(di, 'classificacao', active ? '' : c)}
                  style={{ padding: '0.625rem 1.75rem', borderRadius: '8px', border: `1px solid ${active ? col : '#1e1e1e'}`, background: active ? `${col}1a` : 'rgba(255,255,255,0.03)', color: active ? col : '#555', fontSize: '0.88rem', fontFamily: 'Poppins, sans-serif', fontWeight: active ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}
                >
                  {c}
                </button>
              );
            })}
          </div>
          <div>
            <label style={LB}>Observações</label>
            <textarea
              rows={10}
              maxLength={500}
              placeholder="Descreva os pontos observados nesta dimensão..."
              value={dim.observacao}
              onChange={e => setDimensao(di, 'observacao', e.target.value)}
              onFocus={onF} onBlur={onB}
              style={{ ...IS, resize: 'none', lineHeight: 1.65 }}
            />
            <CharCounter value={dim.observacao} max={500} />
          </div>
        </div>
      );
    }

    // Step 9 — Conclusões
    return (
      <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <div>
          <label style={LB}>Investimento Sugerido</label>
          <input type="text" maxLength={30} placeholder="Ex: 2500 ou R$ 2.500" value={form.investimento} onChange={e => setForm(p => ({ ...p, investimento: e.target.value }))} onFocus={onF} onBlur={onB} style={IS} />
          <CharCounter value={form.investimento} max={30} />
        </div>
        <div>
          <label style={LB}>Próximos Passos</label>
          <textarea rows={8} maxLength={400} placeholder="Descreva as ações recomendadas para o cliente..." value={form.proximosPassos} onChange={e => setForm(p => ({ ...p, proximosPassos: e.target.value }))} onFocus={onF} onBlur={onB} style={{ ...IS, resize: 'none', lineHeight: 1.65 }} />
          <CharCounter value={form.proximosPassos} max={400} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#080808', fontFamily: 'Poppins, sans-serif', display: 'flex' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 20% 50%, rgba(255,107,0,0.05) 0%, transparent 60%)' }} />

      {/* Sidebar */}
      <div style={{ position: 'relative', width: sidebarCollapsed ? '60px' : '260px', flexShrink: 0, height: '100%', zIndex: 10, transition: 'width 0.3s ease' }}>
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

          {/* ZONA 1 */}
          {!sidebarCollapsed ? (
            <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid #0f0f0f', flexShrink: 0 }}>
              <Link href="/" className="inline-block cursor-pointer transition-opacity hover:opacity-80">
                <NextImage src="/lglaranja.png" alt="ORIUM" width={90} height={28} style={{ objectFit: 'contain' }} />
              </Link>
              <p style={{ color: '#444444', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Poppins, sans-serif', marginTop: '0.5rem', marginBottom: 0 }}>DIAGNÓSTICO DIGITAL</p>
            </div>
          ) : (
            <div style={{ flexShrink: 0, height: '60px', borderBottom: '1px solid #0f0f0f' }} />
          )}

          {/* ZONA 2 */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {!sidebarCollapsed && (
              <p style={{ color: '#444444', fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', padding: '1.25rem 1.75rem 0.75rem', margin: 0 }}>ETAPAS</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {ALL_STEPS.map((nome, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '0.75rem', padding: sidebarCollapsed ? '0.875rem 0' : '0.7rem 1.75rem', background: i === step ? 'rgba(255,107,0,0.15)' : 'transparent', borderTop: 'none', borderRight: 'none', borderBottom: 'none', borderLeft: sidebarCollapsed ? 'none' : `2px solid ${i === step ? '#FF6B00' : 'transparent'}`, outline: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.2s', boxSizing: 'border-box' as const }}
                  onMouseEnter={e => { if (i !== step) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={e => { if (i !== step) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  <span style={{ fontFamily: 'Anton, sans-serif', fontSize: '0.65rem', letterSpacing: '0.05em', minWidth: '20px', flexShrink: 0, color: i === step ? '#FF6B00' : '#555555', transition: 'color 0.2s' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {!sidebarCollapsed && (
                    <span style={{ fontSize: '0.78rem', color: i === step ? '#fff' : '#888888', fontFamily: 'Poppins, sans-serif', fontWeight: i === step ? 600 : 400, lineHeight: 1.3, transition: 'color 0.2s' }}>
                      {nome}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ZONA 3 */}
          {!sidebarCollapsed && (
            <div style={{ borderTop: '1px solid #0f0f0f', padding: '1.25rem 1.75rem', flexShrink: 0 }}>
              <p style={{ color: '#444444', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.625rem' }}>PROGRESSO</p>
              <div style={{ height: '2px', background: '#111', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: '#FF6B00', borderRadius: '2px', transition: 'width 0.5s ease' }} />
              </div>
              <p style={{ color: '#2a2a2a', fontSize: '0.7rem', marginTop: '0.5rem' }}>{Math.round(progress)}% concluído</p>
            </div>
          )}

          {/* ZONA 4 */}
          <div style={{ borderTop: '1px solid #0f0f0f', padding: sidebarCollapsed ? '1rem 0' : '1rem 1.75rem 1.5rem', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem', alignItems: sidebarCollapsed ? 'center' : 'flex-start' }}>
            <a
              href="/hub"
              title="Voltar ao painel"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#888888', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.15s', fontFamily: 'Poppins, sans-serif', border: '1px solid #1e1e1e', padding: '8px 12px', borderRadius: '8px' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00'; e.currentTarget.style.borderColor = '#FF6B00'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#888888'; e.currentTarget.style.borderColor = '#1e1e1e'; }}
            >
              <span>←</span>
              {!sidebarCollapsed && <span>PAINEL</span>}
            </a>
            {!sidebarCollapsed && (
              <a href="/meus-documentos" style={{ color: '#777', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s', fontFamily: 'Poppins, sans-serif' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#777'; }}>
                DOCUMENTOS
              </a>
            )}
            {!sidebarCollapsed && (
              <a href="/biblioteca" style={{ color: '#777', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s', fontFamily: 'Poppins, sans-serif' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#777'; }}>
                BIBLIOTECA
              </a>
            )}
          </div>

        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ padding: '3rem 5rem 2.5rem', borderBottom: '1px solid #141414', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem' }}>
          <div>
            <p style={{ color: '#FF6B00', fontSize: '0.68rem', letterSpacing: '0.3em', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Etapa {step + 1} de {totalSteps}</p>
            <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: '#fff', letterSpacing: '0.04em', lineHeight: 1, marginBottom: '0.5rem' }}>
              {ALL_STEPS[step].toUpperCase()}
            </h2>
            <p style={{ color: '#555', fontSize: '0.95rem' }}>{STEP_SUBTITLES[step]}</p>
          </div>
          <button
            onClick={gerarPDF}
            disabled={gerando}
            style={{ background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '0.875rem 2rem', color: '#fff', fontSize: '0.85rem', fontFamily: 'Anton, sans-serif', letterSpacing: '0.12em', cursor: gerando ? 'not-allowed' : 'pointer', opacity: gerando ? 0.6 : 1, transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(255,107,0,0.2)', flexShrink: 0, whiteSpace: 'nowrap' }}
            onMouseEnter={e => { if (!gerando) e.currentTarget.style.background = '#e55f00'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FF6B00'; }}
          >
            {gerando ? 'GERANDO...' : 'GERAR PDF'}
          </button>
        </div>

        {/* Body */}
        <div ref={contentRef} style={{ flex: 1, overflowY: 'auto', padding: '3rem 5rem' }}>
          {renderContent()}
        </div>

        {/* Footer */}
        <div style={{ padding: '1.75rem 5rem', borderTop: '1px solid #141414', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(8px)' }}>
          {step > 0 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{ background: 'transparent', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '0.875rem 2rem', color: '#666', fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = '#444'; b.style.color = '#ccc'; }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = '#1e1e1e'; b.style.color = '#666'; }}
            >← Voltar</button>
          ) : <div />}
          {step < totalSteps - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              style={{ background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '0.875rem 2.75rem', color: '#fff', fontSize: '0.9rem', fontFamily: 'Anton, sans-serif', letterSpacing: '0.15em', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(255,107,0,0.2)' }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = '#e55f00'; b.style.boxShadow = '0 6px 28px rgba(255,107,0,0.35)'; }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = '#FF6B00'; b.style.boxShadow = '0 4px 20px rgba(255,107,0,0.2)'; }}
            >CONTINUAR →</button>
          ) : (
            <button
              onClick={gerarPDF}
              disabled={gerando}
              style={{ background: '#FF6B00', border: 'none', borderRadius: '8px', padding: '0.875rem 2.75rem', color: '#fff', fontSize: '0.9rem', fontFamily: 'Anton, sans-serif', letterSpacing: '0.15em', cursor: gerando ? 'not-allowed' : 'pointer', opacity: gerando ? 0.6 : 1, transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(255,107,0,0.2)' }}
              onMouseEnter={e => { if (!gerando) e.currentTarget.style.background = '#e55f00'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FF6B00'; }}
            >{gerando ? 'GERANDO...' : 'GERAR PDF'}</button>
          )}
        </div>
      </div>
      {savedMsg && (
        <div style={{ position: 'fixed', bottom: '5rem', right: '2rem', zIndex: 100, background: 'rgba(8,8,8,0.95)', border: '1px solid #FF6B00', borderRadius: '8px', padding: '0.75rem 1.25rem', color: '#FF6B00', fontSize: '0.8rem', fontFamily: 'Poppins, sans-serif', backdropFilter: 'blur(8px)' }}>
          {savedMsg}
        </div>
      )}
      {draft && <DraftBanner savedAt={draft.savedAt} onRetomar={retomar} onDescartar={descartar} />}
      {saveStatus !== 'idle' && <SaveToast status={saveStatus} />}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <RaioXPage />
    </Suspense>
  );
}
