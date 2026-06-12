'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import NextImage from 'next/image';
import Link from 'next/link';
import { authHeaders } from '@/lib/auth';
import { savePdfToCloud } from '@/lib/upload-helper';
import { useDraft } from '@/lib/draft';
import SaveToast from '@/components/SaveToast';
import DraftBanner from '@/components/DraftBanner';
import ClienteSelector from '@/components/ClienteSelector';
import ImportarBriefing, { BriefingImportado } from '@/components/ImportarBriefing';
import AuthGate from '@/components/AuthGate';
import ToolBackground from '@/components/ToolBackground';
import WizardFooter from '@/components/WizardFooter';

// ── Serviços pré-definidos ────────────────────────────────────────────────────

interface Servico {
  id: string;
  nome: string;
  descricao: string;
}

const SERVICOS_POR_CATEGORIA: Array<{ nome: string; servicos: Servico[] }> = [
  {
    nome: 'ESTRUTURAÇÃO INICIAL',
    servicos: [
      { id: 'briefing-estrategico', nome: 'Briefing Estratégico™', descricao: 'Diagnóstico inicial para entender posicionamento, público, objetivos e direção da marca' },
      { id: 'direcao-percepcao', nome: 'Direção de Percepção™', descricao: 'Definição de como a marca deve ser percebida visualmente e estrategicamente' },
      { id: 'presenca-base', nome: 'Presença Base™', descricao: 'Bio profissional, destaques e alinhamento inicial da comunicação' },
      { id: 'vitrine-estrategica', nome: 'Vitrine Estratégica™', descricao: 'Estruturação dos 3 posts fixados para apresentação da marca' },
      { id: 'estruturacao-instagram', nome: 'Estruturação do Instagram™', descricao: 'Organização inicial do perfil, comunicação e presença digital' },
      { id: 'google-meu-negocio', nome: 'Google Meu Negócio™', descricao: 'Configuração e otimização da presença no Google' },
      { id: 'facebook', nome: 'Facebook™', descricao: 'Estruturação e organização da página no Facebook' },
      { id: 'whatsapp-business', nome: 'WhatsApp Business™', descricao: 'Configuração profissional do WhatsApp Business' },
    ],
  },
  {
    nome: 'CONTEÚDO E COMUNICAÇÃO',
    servicos: [
      { id: 'planejamento-conteudo', nome: 'Planejamento de Conteúdo™', descricao: 'Organização mensal das publicações e direção estratégica dos conteúdos' },
      { id: 'conteudo-estrategico', nome: 'Conteúdo Estratégico™', descricao: 'Criação de posts institucionais, educativos e de divulgação' },
      { id: 'presenca-continua', nome: 'Presença Contínua™', descricao: 'Fortalecimento da consistência visual e da comunicação da marca' },
      { id: 'stories-estrategicos', nome: 'Stories Estratégicos™', descricao: 'Criação e planejamento de stories com intenção comercial' },
      { id: 'reels-videos', nome: 'Reels e Vídeos™', descricao: 'Produção de conteúdo em vídeo para engajamento e alcance' },
    ],
  },
  {
    nome: 'EXPANSÃO DIGITAL',
    servicos: [
      { id: 'site-institucional', nome: 'Site Institucional™', descricao: 'Estruturação de um site profissional para apresentação da marca' },
      { id: 'landing-page', nome: 'Landing Page™', descricao: 'Página de venda ou captura focada em conversão' },
      { id: 'automacao-atendimento', nome: 'Automação de Atendimento™', descricao: 'Fluxos entre Instagram, WhatsApp e formulários' },
      { id: 'estrutura-cursos', nome: 'Estrutura de Cursos™', descricao: 'Páginas para divulgação e venda das formações' },
      { id: 'campanhas-divulgacao', nome: 'Campanhas de Divulgação™', descricao: 'Estratégias para fortalecimento da presença e alcance' },
      { id: 'relatorio-mensal', nome: 'Relatório Mensal™', descricao: 'Análise de resultados e direcionamento estratégico mensal' },
    ],
  },
];

const TODOS_SERVICOS = SERVICOS_POR_CATEGORIA.flatMap(c => c.servicos);

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface Fase {
  nome: string;
  subtitulo: string;
  descricao: string;
  servicosSelecionados: string[];
  objetivo: string;
  valor: string;
  prazo: string;
  aberta: boolean;
}

interface ProximoPasso {
  titulo: string;
  descricao: string;
}

interface FormState {
  nomeCliente: string;
  segmento: string;
  dataProposta: string;
  validadeProposta: string;
  fases: Fase[];
  proximosPassos: ProximoPasso[];
  contato: {
    responsavel: string;
    whatsapp: string;
    email: string;
    instagram: string;
  };
  condicoesPagamento: string;
}

const PASSOS_DEFAULT: ProximoPasso[] = [
  { titulo: 'Aprovação da proposta', descricao: 'Confirmação do aceite e alinhamento das condições comerciais.' },
  { titulo: 'Briefing Estratégico™', descricao: 'Sessão de levantamento profundo sobre o negócio, público e posicionamento.' },
  { titulo: 'Reunião de alinhamento', descricao: 'Apresentação do planejamento detalhado e validação das entregas.' },
  { titulo: 'Início da Estruturação Digital™', descricao: 'Execução das ações conforme o cronograma acordado.' },
];

function novaFase(): Fase {
  return { nome: '', subtitulo: '', descricao: '', servicosSelecionados: [], objetivo: '', valor: '', prazo: '', aberta: true };
}

const STEPS_PROPOSTA = ['DADOS DO CLIENTE', 'FASES DA PROPOSTA', 'PRÓXIMOS PASSOS', 'PAGAMENTO E CONTATO'];
const STEP_SUBTITLES = [
  'Identifique o cliente e defina os dados da proposta.',
  'Configure as fases e selecione os serviços incluídos.',
  'Defina as etapas após a aprovação da proposta.',
  'Condições de pagamento, contato e geração do PDF.',
];

// ── Componente ────────────────────────────────────────────────────────────────

function CharCounter({ value, max }: { value: string; max: number }) {
  const remaining = max - value.length;
  return (
    <div style={{ textAlign: 'right', fontSize: '0.7rem', fontFamily: 'Poppins, sans-serif', color: remaining <= 10 ? '#FF6B00' : '#777', marginTop: '0.25rem' }}>
      {value.length}/{max}
    </div>
  );
}

function PropostaPage() {
  const [gerando, setGerando] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [step, setStep] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

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
    if (!docParam) return;
    fetch(`/api/documentos?id=${docParam}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => { if (data.dados) { setForm(data.dados); setDocumentoId(docParam); } })
      .catch(console.error);
  }, [docParam]);

  const [categoriasColapsadas, setCategoriasColapsadas] = useState<Set<string>>(new Set());

  const [form, setForm] = useState<FormState>({
    nomeCliente: clienteParam || '',
    segmento: '',
    dataProposta: new Date().toISOString().split('T')[0],
    validadeProposta: '',
    fases: [novaFase()],
    proximosPassos: PASSOS_DEFAULT.map(p => ({ ...p })),
    contato: {
      responsavel: 'Thiago Duarte',
      whatsapp: '(31) 99935-2065',
      email: 'contato@oriumagencia.com.br',
      instagram: '@orium.agc',
    },
    condicoesPagamento: '50% na aprovação · 50% na entrega final · PIX, boleto ou cartão',
  });

  const { draft, retomar, descartar, concluir } = useDraft(
    'proposta',
    { step, form },
    d => { setForm(d.form); setStep(d.step); },
    !docParam,
  );

  // ── Fases ───────────────────────────────────────────────────────────────────
  function adicionarFase() {
    if (form.fases.length >= 3) return;
    setForm(p => ({ ...p, fases: [...p.fases, novaFase()] }));
  }

  function removerFase(i: number) {
    if (form.fases.length <= 1) return;
    setForm(p => ({ ...p, fases: p.fases.filter((_, idx) => idx !== i) }));
  }

  function toggleFase(i: number) {
    setForm(p => ({ ...p, fases: p.fases.map((f, idx) => idx === i ? { ...f, aberta: !f.aberta } : f) }));
  }

  function setFase(i: number, campo: 'nome' | 'subtitulo' | 'descricao' | 'objetivo' | 'valor' | 'prazo', valor: string) {
    setForm(p => ({ ...p, fases: p.fases.map((f, idx) => idx === i ? { ...f, [campo]: valor } : f) }));
  }

  // ── Serviços ────────────────────────────────────────────────────────────────
  function toggleServico(fi: number, servicoId: string) {
    setForm(p => ({
      ...p,
      fases: p.fases.map((f, idx) => {
        if (idx !== fi) return f;
        const sel = f.servicosSelecionados;
        return { ...f, servicosSelecionados: sel.includes(servicoId) ? sel.filter(id => id !== servicoId) : [...sel, servicoId] };
      }),
    }));
  }

  function toggleCategoria(nome: string) {
    setCategoriasColapsadas(prev => {
      const next = new Set(prev);
      if (next.has(nome)) next.delete(nome);
      else next.add(nome);
      return next;
    });
  }

  // ── Próximos passos ─────────────────────────────────────────────────────────
  function setPasso(i: number, campo: keyof ProximoPasso, valor: string) {
    setForm(p => ({ ...p, proximosPassos: p.proximosPassos.map((ps, idx) => idx === i ? { ...ps, [campo]: valor } : ps) }));
  }

  // ── Formatação de valor ─────────────────────────────────────────────────────
  function formatCurrency(value: string): string {
    const numbers = value.replace(/\D/g, '')
    if (!numbers) return ''
    const amount = parseInt(numbers) / 100
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  function formatarValorPDF(valor: string): string {
    const v = valor.trim();
    if (!v) return 'A DEFINIR';
    if (/^\d[\d.,\s]*$/.test(v)) {
      const num = parseFloat(v.replace(/\./g, '').replace(',', '.').replace(/\s/g, ''));
      if (!isNaN(num)) return 'R$ ' + num.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    return v;
  }

  // ── Gerar PDF ───────────────────────────────────────────────────────────────
  async function gerarPDF() {
    if (!form.nomeCliente.trim()) {
      alert('Preencha o nome do cliente antes de gerar o PDF.');
      return;
    }
    setGerando(true);
    try {
      if (!document.getElementById('proposta-gfonts')) {
        const link = document.createElement('link');
        link.id = 'proposta-gfonts';
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

      const loadImg = (src: string) => new Promise<string>(resolve => {
        const img = new Image(); img.crossOrigin = 'anonymous';
        img.onload = () => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; c.getContext('2d')!.drawImage(img, 0, 0); resolve(c.toDataURL('image/png')); };
        img.onerror = () => resolve('');
        img.src = src;
      });

      const [logoBase64, logoWhiteBase64, bgData] = await Promise.all([
        loadImg('/lglaranja.png'),
        loadImg('/lgbranca.png'),
        loadImg('/hero.jpg'),
      ]);

      const logoLg = logoBase64
        ? `<img src="${logoBase64}" style="height:72px;object-fit:contain;" />`
        : `<span style="font-family:'Anton',Impact,sans-serif;font-size:40px;color:#FF6B00;letter-spacing:8px;">ORIUM</span>`;
      const logoSm = logoBase64
        ? `<img src="${logoBase64}" style="height:40px;object-fit:contain;" />`
        : `<span style="font-family:'Anton',Impact,sans-serif;font-size:22px;color:#FF6B00;letter-spacing:6px;">ORIUM</span>`;
      const logoXs = logoBase64
        ? `<img src="${logoBase64}" style="height:28px;object-fit:contain;" />`
        : `<span style="font-family:'Anton',Impact,sans-serif;font-size:16px;color:#FF6B00;letter-spacing:4px;">ORIUM</span>`;
      const logoWhiteSm = logoWhiteBase64
        ? `<img src="${logoWhiteBase64}" style="height:40px;object-fit:contain;" />`
        : `<span style="font-family:'Anton',Impact,sans-serif;font-size:22px;color:#fff;letter-spacing:6px;">ORIUM</span>`;
      const logoWhiteXs = logoWhiteBase64
        ? `<img src="${logoWhiteBase64}" style="height:28px;object-fit:contain;" />`
        : `<span style="font-family:'Anton',Impact,sans-serif;font-size:16px;color:#fff;letter-spacing:4px;">ORIUM</span>`;

      const dataFormatada = new Date(form.dataProposta + 'T12:00:00').toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric',
      });

      const P = "font-family:'Poppins',Arial,sans-serif;";
      const A = "font-family:'Anton',Impact,sans-serif;";
      const BAR = 'position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#FF6B00,#FF8C00 50%,#FF6B00);';
      const BBAR = 'position:absolute;bottom:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#FF6B00,#FF8C00 50%,#FF6B00);';

      const metodologiaHtml = [
        { nome: 'RAIO-X ORIUM™', desc: 'Diagnóstico estratégico da presença digital' },
        { nome: 'DIREÇÃO DE PERCEPÇÃO™', desc: 'Posicionamento e identidade de marca' },
        { nome: 'VITRINE ESTRATÉGICA™', desc: 'Estruturação visual e digital da marca' },
        { nome: 'PRESENÇA BASE™', desc: 'Organização completa dos canais digitais' },
      ].map(m => `<div style="border-left:2px solid #FF6B00;padding-left:12px;"><div style="${A}font-size:10px;color:#fff;letter-spacing:1px;margin-bottom:3px;line-height:1.2;">${m.nome}</div><div style="color:#555;font-size:11px;line-height:1.5;${P}">${m.desc}</div></div>`).join('');

      const passosHtml = form.proximosPassos.map((p, i) => `
        <div style="background:#0f0f0f;border:1px solid #1a1a1a;border-radius:10px;padding:18px;">
          <div style="${A}font-size:28px;color:#FF6B00;line-height:1;margin-bottom:8px;">${String(i + 1).padStart(2, '0')}</div>
          <div style="${P}color:#fff;font-size:14px;font-weight:700;margin-bottom:5px;">${p.titulo.trim()}</div>
          <div style="${P}color:#666;font-size:13px;line-height:1.6;">${p.descricao.trim()}</div>
        </div>
      `).join('');

      let isFirst = true;
      const addPage = async (html: string) => {
        const el = document.createElement('div');
        el.style.cssText = ['position:fixed', 'left:-9999px', 'top:0', `width:${PX_W}px`, `height:${PX_H}px`, 'background:#080808', 'overflow:hidden', "font-family:'Poppins',Arial,sans-serif", 'box-sizing:border-box'].join(';');
        el.innerHTML = html;
        document.body.appendChild(el);
        try {
          await new Promise(r => setTimeout(r, 100));
          const canvas = await html2canvas(el, { backgroundColor: '#080808', scale: 2, useCORS: true, allowTaint: true, logging: false, width: PX_W, height: PX_H });
          const imgData = canvas.toDataURL('image/jpeg', 0.93);
          if (!isFirst) doc.addPage();
          isFirst = false;
          doc.addImage(imgData, 'JPEG', 0, 0, 210, 297);
        } finally {
          document.body.removeChild(el);
        }
      };

      const nomeFontSize = form.nomeCliente.length > 12 ? '64' : form.nomeCliente.length > 8 ? '80' : '96';
      await addPage(`
        <div style="${P}width:${PX_W}px;height:${PX_H}px;position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px;box-sizing:border-box;">
          ${bgData ? `<img src="${bgData}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;" />` : '<div style="position:absolute;inset:0;background:#080808;"></div>'}
          <div style="position:absolute;inset:0;background:rgba(0,0,0,0.80);"></div>
          <div style="position:absolute;top:56px;z-index:1;display:flex;flex-direction:column;align-items:center;gap:8px;">${logoWhiteSm}<div style="color:rgba(255,255,255,0.2);font-size:9px;letter-spacing:5px;text-transform:uppercase;margin-top:5px;${P}">ESTRUTURA · PRESENÇA · RESULTADOS</div></div>
          <div style="position:relative;z-index:1;text-align:center;">
            <div style="color:#FF6B00;font-size:11px;letter-spacing:8px;text-transform:uppercase;margin-bottom:22px;font-weight:600;${P}">PROPOSTA COMERCIAL</div>
            <div style="${A}font-size:${nomeFontSize}px;color:#fff;letter-spacing:3px;line-height:0.9;margin-bottom:18px;text-transform:uppercase;">${form.nomeCliente.trim().toUpperCase()}</div>
            <div style="color:rgba(255,255,255,0.15);font-size:13px;letter-spacing:2px;margin-bottom:18px;">━━━━━━━━━━━━━━━━━━━━━</div>
            <div style="${A}font-size:20px;color:#fff;letter-spacing:6px;margin-bottom:10px;">ESTRUTURAÇÃO DIGITAL</div>
            <div style="color:#FF6B00;font-size:11px;letter-spacing:4px;${P}">PRESENÇA · AUTORIDADE · CRESCIMENTO</div>
          </div>
          <div style="position:absolute;bottom:54px;z-index:1;display:flex;flex-direction:column;align-items:center;gap:8px;">${logoWhiteXs}<div style="color:rgba(255,255,255,0.15);font-size:9px;letter-spacing:3px;text-transform:uppercase;margin-top:3px;${P}">ESTRUTURAMOS O QUE GERA RESULTADOS.</div></div>
        </div>
      `);

      await addPage(`
        <div style="${P}width:${PX_W}px;height:${PX_H}px;background:#080808;box-sizing:border-box;position:relative;display:flex;flex-direction:column;">
          <div style="${BAR}"></div>
          <div style="padding:44px 70px 20px 70px;"><div style="margin-bottom:12px;">${logoXs}</div><div style="${A}font-size:44px;color:#fff;line-height:1;margin-bottom:8px;">Sobre a <span style="color:#FF6B00;">ORIUM</span></div><div style="color:#555;font-size:14px;max-width:540px;line-height:1.7;${P}">Estruturação de presença digital para marcas que desejam ser percebidas com mais clareza, autoridade e profissionalismo.</div></div>
          <div style="padding:0 70px;flex:1;display:flex;flex-direction:column;gap:12px;">
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
              <div style="background:#0d0d0d;border:1px solid #1a1a1a;border-radius:10px;padding:16px;"><div style="color:#FF6B00;font-size:10px;letter-spacing:4px;font-weight:700;margin-bottom:6px;${P}">QUEM SOMOS</div><div style="color:#999;font-size:13px;line-height:1.75;${P}">A ORIUM é uma agência de estruturação digital especializada em construir presença profissional para negócios que querem crescer com estratégia e consistência.</div></div>
              <div style="background:#0d0d0d;border:1px solid #1a1a1a;border-radius:10px;padding:16px;"><div style="color:#FF6B00;font-size:10px;letter-spacing:4px;font-weight:700;margin-bottom:6px;${P}">O QUE FAZEMOS</div><div style="color:#999;font-size:13px;line-height:1.75;${P}">Estruturamos a base digital: identidade visual, posicionamento, site, conteúdo e presença local — tudo conectado e alinhado com os objetivos do negócio.</div></div>
              <div style="background:#0d0d0d;border:1px solid #1a1a1a;border-radius:10px;padding:16px;"><div style="color:#FF6B00;font-size:10px;letter-spacing:4px;font-weight:700;margin-bottom:6px;${P}">COMO TRABALHAMOS</div><div style="color:#999;font-size:13px;line-height:1.75;${P}">Cada projeto começa com diagnóstico estratégico. Entendemos o negócio, o público e os objetivos antes de qualquer entrega. Clareza primeiro, execução depois.</div></div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <div style="background:#0d0d0d;border:1px solid #1a1a1a;border-radius:10px;padding:16px;"><div style="color:#FF6B00;font-size:10px;letter-spacing:4px;font-weight:700;margin-bottom:6px;${P}">NOSSO COMPROMISSO</div><div style="color:#999;font-size:13px;line-height:1.75;${P}">Não entregamos apenas peças — entregamos estrutura. Cada decisão criativa tem propósito estratégico. Nosso trabalho gera percepção, confiança e resultado mensurável.</div></div>
              <div style="background:#0d0d0d;border:1px solid #1a1a1a;border-radius:10px;padding:16px;"><div style="color:#FF6B00;font-size:10px;letter-spacing:4px;font-weight:700;margin-bottom:6px;${P}">NOSSO DIFERENCIAL</div><div style="color:#999;font-size:13px;line-height:1.75;${P}">Combinamos estratégia, design e tecnologia em um processo integrado. Cada entrega é pensada para gerar impacto real no posicionamento e na percepção da sua marca.</div></div>
            </div>
            <div style="background:#0d0d0d;border:1px solid #1a1a1a;border-radius:10px;padding:20px;"><div style="${A}font-size:13px;color:#FF6B00;letter-spacing:4px;margin-bottom:14px;">METODOLOGIA ORIUM™</div><div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:16px;">${metodologiaHtml}</div></div>
          </div>
          <div style="background:#FF6B00;padding:14px 70px;display:flex;justify-content:center;align-items:center;margin-top:14px;"><div style="${A}font-size:11px;color:#000;letter-spacing:3px;">ESTRUTURAMOS O QUE GERA PERCEPÇÃO, PRESENÇA E RESULTADO.</div></div>
        </div>
      `);

      for (let i = 0; i < form.fases.length; i++) {
        const fase = form.fases[i];
        const num = String(i + 1).padStart(2, '0');
        const servicosSel = fase.servicosSelecionados.map(id => TODOS_SERVICOS.find(s => s.id === id)).filter((s): s is Servico => !!s);
        const entregasHtml = servicosSel.map(s => `<div style="margin-bottom:10px;padding:12px 16px;background:#0d0d0d;border:1px solid #1a1a1a;border-radius:8px;"><div style="color:#fff;font-size:16px;font-weight:700;margin-bottom:4px;${P}">${s.nome}</div><div style="color:#666;font-size:14px;line-height:1.6;${P}">${s.descricao}</div></div>`).join('');
        const faseNome = fase.nome.trim() || `FASE ${i + 1}`;
        const faseValorFormatado = formatarValorPDF(fase.valor);

        await addPage(`
          <div style="${P}width:${PX_W}px;height:${PX_H}px;background:#080808;box-sizing:border-box;position:relative;display:flex;flex-direction:column;">
            <div style="${BAR}"></div>
            <div style="padding:30px 70px 18px 70px;border-bottom:1px solid #161616;display:flex;justify-content:space-between;align-items:center;position:relative;z-index:1;">${logoXs}<div style="color:#2a2a2a;font-size:12px;letter-spacing:4px;text-transform:uppercase;${P}">PROPOSTA COMERCIAL</div></div>
            <div style="padding:26px 70px;flex:1;position:relative;z-index:1;overflow:hidden;">
              <div style="color:#FF6B00;font-size:13px;letter-spacing:6px;font-weight:700;margin-bottom:6px;${P}">FASE ${num}</div>
              <div style="${A}font-size:54px;color:#fff;line-height:0.95;margin-bottom:10px;text-transform:uppercase;">${faseNome.toUpperCase()}</div>
              ${fase.subtitulo.trim() ? `<div style="color:#FF6B00;font-size:16px;margin-bottom:18px;font-weight:600;${P}">${fase.subtitulo.trim()}</div>` : ''}
              <div style="width:44px;height:2px;background:#FF6B00;margin-bottom:18px;"></div>
              ${fase.descricao.trim() ? `<div style="color:#888;font-size:17px;line-height:2.0;margin-bottom:22px;max-width:600px;word-wrap:break-word;overflow-wrap:break-word;${P}">${fase.descricao.trim().replace(/\n/g, '<br/>')}</div>` : ''}
              ${entregasHtml ? `<div><div style="color:#3a3a3a;font-size:13px;letter-spacing:4px;text-transform:uppercase;margin-bottom:10px;${P}">O QUE SERÁ DESENVOLVIDO</div>${entregasHtml}</div>` : ''}
            </div>
            <div style="background:#FF6B00;padding:18px 70px;display:flex;justify-content:space-between;align-items:center;">
              <div><div style="${P}color:rgba(0,0,0,0.55);font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:3px;">INVESTIMENTO INICIAL</div><div style="${A}color:#000;font-size:26px;letter-spacing:2px;">${faseValorFormatado}</div></div>
              ${fase.prazo.trim() ? `<div style="text-align:right;"><div style="${P}color:rgba(0,0,0,0.55);font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:3px;">PRAZO</div><div style="${A}color:#000;font-size:22px;letter-spacing:2px;">${fase.prazo.trim()}</div></div>` : ''}
            </div>
          </div>
        `);
      }

      await addPage(`
        <div style="${P}width:${PX_W}px;height:${PX_H}px;background:#080808;padding:48px 70px 0 70px;box-sizing:border-box;position:relative;display:flex;flex-direction:column;">
          <div style="${BAR}"></div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;">${logoXs}<div style="color:#2a2a2a;font-size:12px;letter-spacing:4px;text-transform:uppercase;${P}">PROPOSTA COMERCIAL</div></div>
          <div style="margin-bottom:22px;"><div style="color:#FF6B00;font-size:12px;letter-spacing:6px;font-weight:700;margin-bottom:6px;${P}">CONTINUIDADE DE RESULTADOS</div><div style="${A}font-size:42px;color:#fff;line-height:1;margin-bottom:10px;">PRÓXIMOS PASSOS</div><div style="color:#555;font-size:14px;max-width:500px;line-height:1.75;${P}">Após a aprovação desta proposta, seguiremos um caminho estruturado para garantir que cada etapa seja executada com clareza e alinhamento estratégico.</div></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">${passosHtml}</div>
          ${form.condicoesPagamento.trim() ? `<div style="border-top:1px solid #161616;padding:10px 0 14px 0;text-align:center;"><div style="${P}color:#2e2e2e;font-size:11px;letter-spacing:2px;">${form.condicoesPagamento.trim()}</div></div>` : ''}
          <div style="background:linear-gradient(135deg,#0d0d0d,#0a0a00);border:1px solid #2a2000;border-radius:12px;padding:22px;margin-bottom:18px;"><div style="${A}font-size:13px;color:#FF6B00;letter-spacing:4px;margin-bottom:10px;">COMPROMISSO ORIUM</div><div style="color:#aaa;font-size:14px;line-height:2.0;max-width:560px;${P}">Nosso compromisso vai além das entregas. Trabalhamos para construir estrutura real que gera crescimento sustentável. Cada ação é pensada para fortalecer a percepção da sua marca e ampliar seus resultados ao longo do tempo.</div></div>
          <div style="text-align:center;padding:14px 0;"><div style="${A}font-size:18px;color:#fff;letter-spacing:2px;margin-bottom:6px;">Aqui começa uma parceria estratégica</div><div style="color:#FF6B00;font-size:13px;letter-spacing:2px;${P}">focada em evolução constante.</div></div>
          <div style="margin-top:auto;border-top:1px solid #161616;padding:14px 0 28px 0;display:flex;justify-content:space-between;"><div style="color:#1e1e1e;font-size:12px;letter-spacing:2px;${P}">ORIUM AGENCY · PROPOSTA COMERCIAL</div><div style="color:#1e1e1e;font-size:12px;${P}">${form.nomeCliente.trim()} · ${dataFormatada}</div></div>
        </div>
      `);

      const ct = form.contato;
      await addPage(`
        <div style="${P}width:${PX_W}px;height:${PX_H}px;background:#080808;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;padding:80px;box-sizing:border-box;">
          <div style="${BAR}"></div><div style="${BBAR}"></div>
          <div style="margin-bottom:48px;">${logoLg}</div>
          <div style="text-align:center;margin-bottom:28px;"><div style="${A}font-size:68px;color:#fff;letter-spacing:4px;line-height:0.9;">CONTINUIDADE</div><div style="${A}font-size:68px;color:#FF6B00;letter-spacing:4px;line-height:0.9;">GERA RESULTADOS.</div></div>
          <div style="width:60px;height:3px;background:#FF6B00;margin-bottom:32px;"></div>
          ${(ct.responsavel || ct.whatsapp || ct.email || ct.instagram) ? `<div style="margin-bottom:28px;padding:14px 32px;border:1px solid #1a1a1a;border-radius:10px;display:flex;flex-wrap:wrap;gap:20px;justify-content:center;align-items:center;">${ct.responsavel ? `<div style="${P}color:#3a3a3a;font-size:11px;letter-spacing:1px;">${ct.responsavel}</div>` : ''}${ct.whatsapp ? `<div style="${P}color:#252525;font-size:10px;">·</div><div style="${P}color:#3a3a3a;font-size:11px;letter-spacing:1px;">${ct.whatsapp}</div>` : ''}${ct.email ? `<div style="${P}color:#252525;font-size:10px;">·</div><div style="${P}color:#3a3a3a;font-size:11px;letter-spacing:1px;">${ct.email}</div>` : ''}${ct.instagram ? `<div style="${P}color:#252525;font-size:10px;">·</div><div style="${P}color:#3a3a3a;font-size:11px;letter-spacing:1px;">${ct.instagram}</div>` : ''}</div>` : ''}
          <div style="color:#2a2a2a;font-size:12px;letter-spacing:4px;text-transform:uppercase;text-align:center;${P}">VAMOS SEGUIR, EVOLUIR E ALCANÇAR MAIS JUNTOS.</div>
        </div>
      `);

      const arquivo = `proposta-${form.nomeCliente.trim().toLowerCase().replace(/\s+/g, '-')}-${form.dataProposta}.pdf`;
      const pdfBlob = doc.output('blob');
      doc.save(arquivo);
      setSaveStatus('saving');
      savePdfToCloud(pdfBlob, form.nomeCliente, 'Proposta', arquivo)
        .then(result => { setSaveStatus(result.success ? 'success' : 'error'); setTimeout(() => setSaveStatus('idle'), 4000); })
        .catch(() => { setSaveStatus('error'); setTimeout(() => setSaveStatus('idle'), 4000); });

      const docId = documentoId || crypto.randomUUID();
      fetch('/api/documentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ id: docId, tipo: 'Proposta', nome: form.nomeCliente || 'Documento sem nome', cliente: form.nomeCliente, dados: form }),
      }).then(() => { setDocumentoId(docId); setSavedMsg('Salvo em Documentos'); setTimeout(() => setSavedMsg(''), 3000); }).catch(console.error);
      concluir();

    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      alert('Erro ao gerar o PDF. Verifique o console e tente novamente.');
    } finally {
      setGerando(false);
    }
  }

  // ── Layout principal ─────────────────────────────────────────────────────────

  const totalSteps = STEPS_PROPOSTA.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const inputClass = "w-full bg-zinc-900 border border-zinc-800 rounded-xl text-white px-4 py-3 focus:outline-none focus:border-orange-500 transition placeholder:text-zinc-600 text-sm";
  const labelClass = "block text-zinc-400 text-[10px] font-semibold uppercase tracking-widest mb-2";

  // Só preenche campos vazios — o que o usuário já digitou é preservado
  function importarBriefing(d: BriefingImportado): boolean {
    const preservado = !!form.segmento.trim() && !!d.segmento.trim();
    setForm(p => ({
      ...p,
      segmento: p.segmento.trim() ? p.segmento : d.segmento,
    }));
    return preservado;
  }

  function renderContent() {
    // Step 0 — Dados do Cliente
    if (step === 0) {
      return (
        <div className="space-y-6 max-w-3xl">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nome do Cliente</label>
                <ClienteSelector value={form.nomeCliente} onChange={nome => setForm(p => ({ ...p, nomeCliente: nome }))} placeholder="Ex: CORTEX Consultoria" />
                <ImportarBriefing cliente={form.nomeCliente} onImport={importarBriefing} />
              </div>
              <div>
                <label className={labelClass}>Segmento</label>
                <input type="text" placeholder="Ex: Consultoria Financeira" value={form.segmento} onChange={e => setForm(p => ({ ...p, segmento: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Data da Proposta</label>
                <input type="date" value={form.dataProposta} onChange={e => setForm(p => ({ ...p, dataProposta: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Validade da Proposta</label>
                <input type="text" placeholder="Ex: 7 dias" value={form.validadeProposta} onChange={e => setForm(p => ({ ...p, validadeProposta: e.target.value }))} className={inputClass} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Step 1 — Fases
    if (step === 1) {
      return (
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-zinc-500 text-sm">Até 3 fases. Configure nome, serviços, valor e prazo de cada uma.</p>
            <button
              onClick={adicionarFase}
              disabled={form.fases.length >= 3}
              className="text-sm bg-zinc-900 border border-zinc-700 hover:border-orange-500 text-zinc-400 hover:text-orange-400 disabled:opacity-30 disabled:cursor-not-allowed px-4 py-2 rounded-xl transition"
            >
              {form.fases.length >= 3 ? '+ Adicionar (máximo)' : `+ Adicionar Fase (${form.fases.length}/3)`}
            </button>
          </div>
          {form.fases.map((fase, i) => (
            <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="flex items-center p-5 border-b border-zinc-800/60">
                <button onClick={() => toggleFase(i)} className="flex items-center gap-3 text-left flex-1 min-w-0">
                  <span className="text-orange-500 text-xs font-bold tracking-widest shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-white font-semibold truncate">{fase.nome || `Fase ${i + 1}`}</span>
                  {fase.servicosSelecionados.length > 0 && <span className="text-orange-500/60 text-xs shrink-0">{fase.servicosSelecionados.length} serviço{fase.servicosSelecionados.length !== 1 ? 's' : ''}</span>}
                  <span className="text-zinc-600 text-xs ml-auto mr-3 shrink-0">{fase.aberta ? '▾' : '▸'}</span>
                </button>
                {form.fases.length > 1 && (
                  <button onClick={() => removerFase(i)} className="text-zinc-600 hover:text-red-400 text-xs transition px-2 py-1 rounded-lg hover:bg-red-950/30 shrink-0">Remover</button>
                )}
              </div>
              {fase.aberta && (
                <div className="p-5 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={labelClass}>Nome da Fase</label><input type="text" maxLength={35} placeholder="Ex: Estruturação Digital" value={fase.nome} onChange={e => setFase(i, 'nome', e.target.value)} className={inputClass} /><CharCounter value={fase.nome} max={35} /></div>
                    <div><label className={labelClass}>Subtítulo (laranja no PDF)</label><input type="text" maxLength={80} placeholder="Ex: Organização da base digital" value={fase.subtitulo} onChange={e => setFase(i, 'subtitulo', e.target.value)} className={inputClass} /><CharCounter value={fase.subtitulo} max={80} /></div>
                  </div>
                  <div><label className={labelClass}>Descrição</label><textarea rows={3} maxLength={280} placeholder="Descreva o que esta fase contempla..." value={fase.descricao} onChange={e => setFase(i, 'descricao', e.target.value)} className={`${inputClass} resize-none`} /><CharCounter value={fase.descricao} max={280} /></div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className={labelClass}>Serviços incluídos</label>
                      {fase.servicosSelecionados.length > 0 && <span className="text-orange-500 text-xs font-semibold">{fase.servicosSelecionados.length} selecionado{fase.servicosSelecionados.length !== 1 ? 's' : ''}</span>}
                    </div>
                    <div className="space-y-3">
                      {SERVICOS_POR_CATEGORIA.map(cat => {
                        const colapsada = categoriasColapsadas.has(cat.nome);
                        const selecionadosNaCat = cat.servicos.filter(s => fase.servicosSelecionados.includes(s.id)).length;
                        return (
                          <div key={cat.nome} className="border border-zinc-800 rounded-xl overflow-hidden">
                            <button onClick={() => toggleCategoria(cat.nome)} className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/60 hover:bg-zinc-900 transition text-left">
                              <div className="flex items-center gap-3">
                                <span className="text-zinc-300 text-xs font-bold tracking-widest">{cat.nome}</span>
                                {selecionadosNaCat > 0 && <span className="bg-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{selecionadosNaCat}</span>}
                              </div>
                              <span className="text-zinc-600 text-xs" style={{ display: 'inline-block', transform: colapsada ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▾</span>
                            </button>
                            {!colapsada && (
                              <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2 bg-zinc-950/40">
                                {cat.servicos.map(servico => {
                                  const selecionado = fase.servicosSelecionados.includes(servico.id);
                                  return (
                                    <button key={servico.id} onClick={() => toggleServico(i, servico.id)} className={`text-left p-3 rounded-lg border transition-all duration-150 ${selecionado ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 bg-[#111] hover:border-zinc-600'}`}>
                                      <div className="flex items-start gap-2">
                                        <div className={`mt-0.5 w-4 h-4 rounded shrink-0 flex items-center justify-center border transition-colors ${selecionado ? 'bg-orange-500 border-orange-500' : 'border-zinc-600 bg-transparent'}`}>
                                          {selecionado && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                        </div>
                                        <div><div className={`text-xs font-semibold mb-0.5 ${selecionado ? 'text-white' : 'text-zinc-300'}`}>{servico.nome}</div><div className="text-zinc-500 text-[11px] leading-relaxed">{servico.descricao}</div></div>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><label className={labelClass}>Objetivo da Fase</label><input type="text" placeholder="Ex: Consolidar a identidade digital" value={fase.objetivo} onChange={e => setFase(i, 'objetivo', e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Valor da Fase</label><input type="text" maxLength={20} placeholder="Ex: R$ 1.500,00" value={fase.valor} onChange={e => setFase(i, 'valor', formatCurrency(e.target.value))} className={inputClass} /></div>
                    <div><label className={labelClass}>Prazo Estimado</label><input type="text" maxLength={30} placeholder="Ex: 2 semanas" value={fase.prazo} onChange={e => setFase(i, 'prazo', e.target.value)} className={inputClass} /><CharCounter value={fase.prazo} max={30} /></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    // Step 2 — Próximos Passos
    if (step === 2) {
      return (
        <div className="max-w-3xl">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
            <div className="space-y-3">
              {form.proximosPassos.map((passo, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <span className="text-orange-500 text-xs font-bold tracking-widest w-6 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><input type="text" maxLength={60} placeholder="Título" value={passo.titulo} onChange={e => setPasso(i, 'titulo', e.target.value)} className={inputClass} /><CharCounter value={passo.titulo} max={60} /></div>
                    <div><input type="text" maxLength={120} placeholder="Descrição" value={passo.descricao} onChange={e => setPasso(i, 'descricao', e.target.value)} className={inputClass} /><CharCounter value={passo.descricao} max={120} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Step 3 — Pagamento e Contato
    return (
      <div className="space-y-6 max-w-3xl">
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-white font-bold text-sm mb-1">Condições de Pagamento</h3>
          <p className="text-zinc-500 text-xs mb-4">Exibido discretamente na página de próximos passos do PDF.</p>
          <input type="text" maxLength={120} value={form.condicoesPagamento} onChange={e => setForm(p => ({ ...p, condicoesPagamento: e.target.value }))} className={inputClass} />
          <CharCounter value={form.condicoesPagamento} max={120} />
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-white font-bold text-sm mb-1">Contato</h3>
          <p className="text-zinc-500 text-xs mb-5">Exibido na página de encerramento do PDF.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelClass}>Responsável</label><input type="text" maxLength={50} value={form.contato.responsavel} onChange={e => setForm(p => ({ ...p, contato: { ...p.contato, responsavel: e.target.value } }))} className={inputClass} /><CharCounter value={form.contato.responsavel} max={50} /></div>
            <div><label className={labelClass}>WhatsApp</label><input type="text" maxLength={20} value={form.contato.whatsapp} onChange={e => setForm(p => ({ ...p, contato: { ...p.contato, whatsapp: e.target.value } }))} className={inputClass} /><CharCounter value={form.contato.whatsapp} max={20} /></div>
            <div><label className={labelClass}>E-mail</label><input type="text" maxLength={50} value={form.contato.email} onChange={e => setForm(p => ({ ...p, contato: { ...p.contato, email: e.target.value } }))} className={inputClass} /><CharCounter value={form.contato.email} max={50} /></div>
            <div><label className={labelClass}>Instagram</label><input type="text" maxLength={30} value={form.contato.instagram} onChange={e => setForm(p => ({ ...p, contato: { ...p.contato, instagram: e.target.value } }))} className={inputClass} /><CharCounter value={form.contato.instagram} max={30} /></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#080808', fontFamily: 'Poppins, sans-serif', display: 'flex' }}>
      <ToolBackground position="absolute" gradient="radial" />

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
              <p style={{ color: '#444444', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Poppins, sans-serif', marginTop: '0.5rem', marginBottom: 0 }}>PROPOSTA COMERCIAL</p>
            </div>
          ) : (
            <div style={{ flexShrink: 0, height: '60px', borderBottom: '1px solid #0f0f0f' }} />
          )}

          {/* ZONA 2 */}
          <div style={{ flex: 1, overflowY: 'hidden' }}>
            {!sidebarCollapsed && (
              <p style={{ color: '#444444', fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', padding: '1.25rem 1.75rem 0.75rem', margin: 0 }}>ETAPAS</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {STEPS_PROPOSTA.map((nome, i) => (
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
              {STEPS_PROPOSTA[step]}
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
        <WizardFooter
          onBack={step > 0 ? () => setStep(s => s - 1) : undefined}
          onNext={step < totalSteps - 1 ? () => setStep(s => s + 1) : gerarPDF}
          nextLabel={step < totalSteps - 1 ? 'CONTINUAR →' : gerando ? 'GERANDO...' : 'GERAR PDF'}
          loading={step === totalSteps - 1 && gerando}
        />
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
      <AuthGate title="PROPOSTA" subtitle="Gerador de propostas comerciais em PDF.">
        <PropostaPage />
      </AuthGate>
    </Suspense>
  );
}
