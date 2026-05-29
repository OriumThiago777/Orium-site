'use client';

import { useState } from 'react';

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

// Cores sólidas e legíveis para o PDF
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

export default function RaioXPage() {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState('');
  const [erroSenha, setErroSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [promptAberto, setPromptAberto] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const [form, setForm] = useState<FormState>({
    nomeCliente: '',
    segmentoCliente: '',
    dataAnalise: new Date().toISOString().split('T')[0],
    dimensoes: Array.from({ length: 8 }, () => ({ classificacao: '' as Classificacao, observacao: '' })),
    investimento: '',
    proximosPassos: '',
  });

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
      if (res.ok) setAutenticado(true);
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
      // Carrega Google Fonts
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

      // Logo em base64 para evitar CORS no html2canvas
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

      // ── Capa ───────────────────────────────────────────────────────────────────
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

      // ── Dimensões (omite as que não têm classificação E nem observação) ────────
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

      // ── Resumo final ───────────────────────────────────────────────────────────
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

      // Layout em flex-column para evitar sobreposição
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
      doc.save(arquivo);

    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      alert('Erro ao gerar o PDF. Verifique o console e tente novamente.');
    } finally {
      setGerando(false);
    }
  }

  // ── Tela de senha ──────────────────────────────────────────────────────────────
  if (!autenticado) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <div className="text-orange-500 text-xs font-semibold tracking-[4px] uppercase mb-3">Acesso Restrito</div>
            <h1 className="text-white font-bold text-3xl mb-1">RAIO-X ORIUM</h1>
            <p className="text-zinc-500 text-sm">Ferramenta interna de diagnóstico</p>
          </div>
          <form onSubmit={handleSenha} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Senha de acesso"
                value={senha}
                onChange={e => { setSenha(e.target.value); setErroSenha(false); }}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl text-white px-4 py-3 text-center focus:outline-none focus:border-orange-500 transition placeholder:text-zinc-600"
                autoFocus
              />
              {erroSenha && (
                <p className="text-red-400 text-xs text-center mt-2">Senha incorreta. Tente novamente.</p>
              )}
            </div>
            <button
              type="submit"
              disabled={carregando || !senha}
              className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition"
            >
              {carregando ? 'Verificando...' : 'Entrar'}
            </button>
          </form>

        </div>
      </div>
    );
  }

  // ── Formulário ─────────────────────────────────────────────────────────────────
  const inputClass = "w-full bg-zinc-900 border border-zinc-800 rounded-xl text-white px-4 py-3 focus:outline-none focus:border-orange-500 transition placeholder:text-zinc-600";
  const labelClass = "block text-zinc-400 text-[10px] font-semibold uppercase tracking-widest mb-2";

  return (
    <div className="min-h-screen bg-black">
      {/* Header fixo */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-sm border-b border-zinc-900">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <a
              href="/hub"
              style={{ color: '#2a2a2a', fontSize: '0.68rem', letterSpacing: '0.2em', textDecoration: 'none', textTransform: 'uppercase', transition: 'color 0.2s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#2a2a2a'; }}
            >← menu</a>
            <div style={{ width: '1px', height: '22px', background: '#1a1a1a' }} />
            <div>
              <div className="text-orange-500 text-[10px] tracking-[4px] uppercase font-semibold mb-0.5">Ferramenta Interna</div>
              <h1 className="text-white font-bold text-lg leading-none">RAIO-X ORIUM</h1>
            </div>
          </div>
          <button
            onClick={gerarPDF}
            disabled={gerando}
            className="bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold px-6 py-2.5 rounded-xl transition text-sm"
          >
            {gerando ? 'Gerando...' : 'Gerar PDF'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        {/* Prompt de Análise */}
        <div style={{ border: '1px solid #222', borderRadius: '12px', overflow: 'hidden', background: '#111' }}>
          <button
            onClick={() => setPromptAberto(p => !p)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.25rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '0.85rem', fontFamily: 'inherit' }}
          >
            <span>Prompt de Análise</span>
            <span style={{ fontSize: '0.75rem', display: 'inline-block', transform: promptAberto ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▾</span>
          </button>
          {promptAberto && (
            <div style={{ borderTop: '1px solid #222', padding: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <pre style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '8px', padding: '1rem', paddingTop: '2.5rem', color: '#aaa', fontSize: '0.78rem', lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, maxHeight: '300px', overflowY: 'auto', fontFamily: 'monospace' }}>
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

        {/* Informações do cliente */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-white font-bold text-base mb-5">Informações do Cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Nome do Cliente</label>
              <input
                type="text"
                placeholder="Ex: Restaurante do João"
                value={form.nomeCliente}
                onChange={e => setForm(p => ({ ...p, nomeCliente: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Segmento</label>
              <input
                type="text"
                placeholder="Ex: Alimentação"
                value={form.segmentoCliente}
                onChange={e => setForm(p => ({ ...p, segmentoCliente: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Data da Análise</label>
              <input
                type="date"
                value={form.dataAnalise}
                onChange={e => setForm(p => ({ ...p, dataAnalise: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Dimensões */}
        <div>
          <h2 className="text-white font-bold text-base mb-4">Dimensões de Avaliação</h2>
          <div className="space-y-3">
            {DIMENSOES.map((nome, i) => {
              const dim = form.dimensoes[i];
              return (
                <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
                  <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                    <div>
                      <div className="text-orange-500 text-[10px] font-bold tracking-widest uppercase mb-1">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <h3 className="text-white font-semibold">{nome}</h3>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {(['Crítico', 'Atenção', 'Sólido'] as const).map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setDimensao(i, 'classificacao', dim.classificacao === c ? '' : c)}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold border transition ${
                            dim.classificacao === c
                              ? c === 'Crítico'
                                ? 'bg-red-950 text-red-300 border-red-700'
                                : c === 'Atenção'
                                  ? 'bg-amber-950 text-amber-300 border-amber-700'
                                  : 'bg-green-950 text-green-300 border-green-700'
                              : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Observações</label>
                    <textarea
                      rows={3}
                      placeholder="Descreva os pontos observados nesta dimensão..."
                      value={dim.observacao}
                      onChange={e => setDimensao(i, 'observacao', e.target.value)}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conclusões */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-bold text-base mb-2">Conclusões</h2>
          <div>
            <label className={labelClass}>Investimento Sugerido</label>
            <input
              type="text"
              placeholder="Ex: 2500 ou R$ 2.500"
              value={form.investimento}
              onChange={e => setForm(p => ({ ...p, investimento: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Próximos Passos</label>
            <textarea
              rows={5}
              placeholder="Descreva as ações recomendadas para o cliente..."
              value={form.proximosPassos}
              onChange={e => setForm(p => ({ ...p, proximosPassos: e.target.value }))}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {/* Botão inferior */}
        <div className="flex justify-end pb-12">
          <button
            onClick={gerarPDF}
            disabled={gerando}
            className="bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold px-10 py-4 rounded-2xl transition text-base"
          >
            {gerando ? 'Gerando PDF...' : 'Gerar PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
