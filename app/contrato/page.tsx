'use client';

import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { authHeaders } from '@/lib/auth';
import { savePdfToCloud } from '@/lib/upload-helper';
import { useDraft } from '@/lib/draft';
import SaveToast from '@/components/SaveToast';
import DraftBanner from '@/components/DraftBanner';
import ClienteSelector from '@/components/ClienteSelector';
import AuthGate from '@/components/AuthGate';
import ToolBackground from '@/components/ToolBackground';
import WizardFooter from '@/components/WizardFooter';

const FA = 'Anton, sans-serif';
const FP = 'Poppins, sans-serif';

// ── Constantes ────────────────────────────────────────────────────────────────

const ETAPAS = [
  'Dados das Partes',
  'Tipo de Contrato',
  'Serviços',
  'Escopo e Entregáveis',
  'Prazos',
  'Valores e Pagamento',
  'Revisões e Condições',
  'Cláusulas Opcionais',
  'Preview e Exportação',
];

const SUBTITULOS = [
  'Identifique as partes envolvidas no contrato.',
  'Defina a natureza dos serviços a serem prestados.',
  'Selecione os serviços que serão entregues.',
  'Delimite o escopo de trabalho e as entregas.',
  'Estabeleça datas de início, entrega e prazos.',
  'Configure o valor total e as condições de pagamento.',
  'Defina o número de revisões e as regras de alteração.',
  'Selecione as cláusulas adicionais do contrato.',
  'Revise o contrato gerado e copie o texto.',
];

const TIPOS_CONTRATO = [
  'Prestação de serviços digitais',
  'Criação de site / landing page',
  'Gestão de conteúdo mensal',
  'Identidade visual / branding',
  'Estruturação de Instagram',
  'Automação / formulários / CRM',
  'Consultoria estratégica',
  'Diagnóstico digital',
  'Pacote personalizado',
];

interface ServicoItem { id: string; nome: string; }
const GRUPOS_SERVICOS: Array<{ nome: string; servicos: ServicoItem[] }> = [
  {
    nome: 'BRANDING E IDENTIDADE',
    servicos: [
      { id: 'branding', nome: 'Branding e posicionamento' },
      { id: 'identidade', nome: 'Identidade visual' },
      { id: 'manual', nome: 'Manual de marca' },
    ],
  },
  {
    nome: 'PRESENÇA DIGITAL',
    servicos: [
      { id: 'estruturacao-ig', nome: 'Estruturação de Instagram' },
      { id: 'bio-destaques', nome: 'Bio e destaques' },
      { id: 'posts-feed', nome: 'Posts para feed' },
      { id: 'stories', nome: 'Stories' },
      { id: 'reels', nome: 'Reels' },
      { id: 'planejamento-conteudo', nome: 'Planejamento de conteúdo' },
      { id: 'gestao-conteudo', nome: 'Gestão de conteúdo mensal' },
      { id: 'google-meu-negocio', nome: 'Google Meu Negócio' },
    ],
  },
  {
    nome: 'DESENVOLVIMENTO E TECNOLOGIA',
    servicos: [
      { id: 'site-institucional', nome: 'Criação de site institucional' },
      { id: 'landing-page', nome: 'Criação de landing page' },
      { id: 'pagina-captura', nome: 'Página de captura' },
      { id: 'formulario', nome: 'Formulário estratégico' },
      { id: 'crm', nome: 'CRM simples' },
      { id: 'automacao', nome: 'Automação de atendimento' },
      { id: 'integracao-wpp', nome: 'Integração com WhatsApp' },
      { id: 'google-ads', nome: 'Google Ads' },
      { id: 'meta-ads', nome: 'Meta Ads' },
      { id: 'diagnostico', nome: 'Diagnóstico digital' },
      { id: 'consultoria', nome: 'Consultoria estratégica' },
      { id: 'treinamento', nome: 'Treinamento ou orientação' },
      { id: 'outro', nome: 'Outro serviço personalizado' },
    ],
  },
];

const CONDICOES_PAGAMENTO = [
  '100% antecipado',
  '50% entrada + 50% na entrega',
  'Entrada + parcelas',
  'Mensal recorrente',
  'Personalizado',
];

const FORMAS_PAGAMENTO = ['Pix', 'Transferência bancária', 'Cartão de crédito', 'Boleto', 'Dinheiro', 'Outro'];

// Parâmetros jurídicos fixos (decisão deliberada: não viram campos no wizard)
const MULTA_ATRASO_PAGAMENTO = '2%';
const JUROS_MORA_MENSAL = '1%';
const DIAS_TOLERANCIA_SUSPENSAO = 10;
const PRAZO_CONFIDENCIALIDADE_ANOS = 2;
const MULTA_CANCELAMENTO_SEM_AVISO = '20%';
const AVISO_PREVIO_PADRAO_DIAS = 15;

const TIPOS_CONTRATACAO = [
  'Projeto pontual',
  'Serviço mensal recorrente',
  'Consultoria avulsa',
  'Pacote com duração definida',
];

// ── Tipos e estado inicial ────────────────────────────────────────────────────

interface FormState {
  prestador: { nome: string; responsavel: string; email: string; whatsapp: string; cidade: string; uf: string; cpfCnpj: string; endereco: string; };
  cliente: { empresa: string; responsavel: string; cpfCnpj: string; email: string; whatsapp: string; endereco: string; cidade: string; uf: string; instagram: string; site: string; segmento: string; obs: string; };
  tipoContrato: string;
  servicosSelecionados: string[];
  servicosDescricoes: Record<string, string>;
  descricaoGeral: string; objetivo: string; entregaveis: string;
  qtdPecas: string; qtdReunioes: string; qtdRevisoes: string;
  plataformas: string; canais: string; naoIncluso: string; materiaisCliente: string;
  dataInicio: string; dataEntrega: string; duracaoEstimada: string;
  prazoMateriais: string; prazoAprovacao: string;
  tipoContratacao: string; diaVencimentoMensal: string; periodoMinimo: string; avisoPrevio: string;
  valorTotal: string; entrada: string; numeroParcelas: string; diaVencimentoParcelas: string;
  condicaoPagamento: string; formasPagamento: string[];
  numRevisoes: string; prazoRevisao: string; oQueContaRevisao: string; valorRevisaoExtra: string;
  clausulas: {
    confidencialidade: boolean; portfolioPermitido: boolean; portfolioNaoPermitido: boolean;
    portfolioAposLancamento: boolean; publicacaoCliente: boolean; publicacaoOrium: boolean;
    gestaoAnuncios: boolean; midiaSeparada: boolean; arquivosEditaveis: boolean;
    semArquivosEditaveis: boolean; cancelamento30: boolean; entradaNaoReembolsavel: boolean;
  };
}

function estadoInicial(): FormState {
  return {
    prestador: { nome: 'ORIUM', responsavel: 'Thiago Almeida Duarte', email: 'contato@oriumagencia.com.br', whatsapp: '(31) 99935-2065', cidade: 'Belo Horizonte', uf: 'MG', cpfCnpj: '', endereco: '' },
    cliente: { empresa: '', responsavel: '', cpfCnpj: '', email: '', whatsapp: '', endereco: '', cidade: '', uf: '', instagram: '', site: '', segmento: '', obs: '' },
    tipoContrato: '',
    servicosSelecionados: [], servicosDescricoes: {},
    descricaoGeral: '', objetivo: '', entregaveis: '', qtdPecas: '', qtdReunioes: '', qtdRevisoes: '',
    plataformas: '', canais: '', naoIncluso: '', materiaisCliente: '',
    dataInicio: '', dataEntrega: '', duracaoEstimada: '',
    prazoMateriais: '5 dias úteis após assinatura', prazoAprovacao: '3 dias úteis após envio',
    tipoContratacao: 'Projeto pontual', diaVencimentoMensal: '', periodoMinimo: '', avisoPrevio: '30 dias',
    valorTotal: '', entrada: '', numeroParcelas: '', diaVencimentoParcelas: '',
    condicaoPagamento: '50% entrada + 50% na entrega', formasPagamento: ['Pix'],
    numRevisoes: '', prazoRevisao: '5 dias úteis após entrega',
    oQueContaRevisao: 'Alterações no texto, cores ou layout dentro do escopo original', valorRevisaoExtra: '',
    clausulas: {
      confidencialidade: true, portfolioPermitido: true, portfolioNaoPermitido: false,
      portfolioAposLancamento: false, publicacaoCliente: true, publicacaoOrium: false,
      gestaoAnuncios: false, midiaSeparada: false, arquivosEditaveis: false,
      semArquivosEditaveis: false, cancelamento30: false, entradaNaoReembolsavel: true,
    },
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseMoeda(val: string): number {
  return parseFloat(val.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, '')) || 0;
}

function fmtMoeda(centavos: string): string {
  const raw = centavos.replace(/\D/g, '');
  if (!raw) return '';
  return (parseInt(raw, 10) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calcRestante(total: string, entrada: string): string {
  const r = parseMoeda(total) - parseMoeda(entrada);
  return r > 0 ? r.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
}

function calcParcela(restante: string, n: string): string {
  const num = parseInt(n, 10);
  const r = parseMoeda(restante);
  return num > 0 && r > 0 ? (r / num).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
}

function dataExtenso(iso: string): string {
  if (!iso) return '___/___/______';
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

// ── Cláusulas ─────────────────────────────────────────────────────────────────

type Clausula = {
  titulo: string;       // ex: 'DO OBJETO' (sem o prefixo "CLÁUSULA N —")
  linhas: string[];     // parágrafos já formatados. '{N}' é substituído pelo número real da cláusula.
  destaque?: boolean;   // true = cláusula que vira quote-box no PDF
};

function montarClausulas(f: FormState): Clausula[] {
  const cl = f.clausulas;
  const restante = calcRestante(f.valorTotal, f.entrada);
  const parcela = calcParcela(restante, f.numeroParcelas);
  const clausulas: Clausula[] = [];

  clausulas.push({
    titulo: 'DO OBJETO',
    linhas: [`Este contrato tem por objeto a prestação de serviços de ${f.tipoContrato.trim() || 'serviços digitais'}, pela CONTRATADA à CONTRATANTE, conforme especificações detalhadas nas cláusulas seguintes.`],
  });

  {
    const linhas: string[] = ['A CONTRATADA prestará os seguintes serviços:', ''];
    if (f.servicosSelecionados.length > 0) {
      const todos = GRUPOS_SERVICOS.flatMap(g => g.servicos);
      f.servicosSelecionados.forEach((id, i) => {
        const s = todos.find(x => x.id === id);
        if (!s) return;
        const desc = f.servicosDescricoes[id]?.trim();
        linhas.push(`${i + 1}. ${s.nome}${desc ? ` — ${desc}` : ''}`);
      });
    } else { linhas.push('[Serviços a definir]'); }
    clausulas.push({ titulo: 'DOS SERVIÇOS CONTRATADOS', linhas });
  }

  {
    const linhas: string[] = [];
    if (f.descricaoGeral.trim()) linhas.push(`{N}.1 Descrição geral: ${f.descricaoGeral.trim()}`);
    if (f.objetivo.trim()) linhas.push(`{N}.2 Objetivo: ${f.objetivo.trim()}`);
    if (f.entregaveis.trim()) linhas.push(`{N}.3 Entregáveis: ${f.entregaveis.trim()}`);
    if (f.qtdPecas.trim()) linhas.push(`{N}.4 Quantidade de peças/designs: ${f.qtdPecas.trim()}`);
    if (f.qtdReunioes.trim()) linhas.push(`{N}.5 Reuniões incluídas: ${f.qtdReunioes.trim()}`);
    if (f.qtdRevisoes.trim()) linhas.push(`{N}.6 Revisões incluídas: ${f.qtdRevisoes.trim()}`);
    if (f.plataformas.trim()) linhas.push(`{N}.7 Plataformas envolvidas: ${f.plataformas.trim()}`);
    if (f.canais.trim()) linhas.push(`{N}.8 Canais envolvidos: ${f.canais.trim()}`);
    if (f.naoIncluso.trim()) { linhas.push(''); linhas.push(`{N}.9 O seguinte NÃO está incluso no escopo: ${f.naoIncluso.trim()}`); }
    if (f.materiaisCliente.trim()) { linhas.push(''); linhas.push(`{N}.10 Materiais a serem fornecidos pelo CONTRATANTE: ${f.materiaisCliente.trim()}`); }
    clausulas.push({ titulo: 'DO ESCOPO E ENTREGÁVEIS', linhas });
  }

  {
    const linhas: string[] = [];
    if (f.dataInicio) linhas.push(`{N}.1 Data de início: ${dataExtenso(f.dataInicio)}`);
    if (f.dataEntrega) linhas.push(`{N}.2 Data prevista de entrega: ${dataExtenso(f.dataEntrega)}`);
    if (f.duracaoEstimada.trim()) linhas.push(`{N}.3 Duração estimada: ${f.duracaoEstimada.trim()}`);
    if (f.prazoMateriais.trim()) linhas.push(`{N}.4 Prazo para envio de materiais: ${f.prazoMateriais.trim()}`);
    if (f.prazoAprovacao.trim()) linhas.push(`{N}.5 Prazo para aprovação: ${f.prazoAprovacao.trim()}`);
    if (f.tipoContratacao) { linhas.push(''); linhas.push(`{N}.6 Modalidade: ${f.tipoContratacao}`); }
    if (f.tipoContratacao === 'Serviço mensal recorrente') {
      if (f.diaVencimentoMensal.trim()) linhas.push(`{N}.7 Dia de vencimento mensal: ${f.diaVencimentoMensal.trim()}`);
      if (f.periodoMinimo.trim()) linhas.push(`{N}.8 Período mínimo: ${f.periodoMinimo.trim()}`);
      if (f.avisoPrevio.trim()) linhas.push(`{N}.9 Aviso prévio para cancelamento: ${f.avisoPrevio.trim()}`);
    }
    clausulas.push({ titulo: 'DOS PRAZOS', linhas });
  }

  {
    const linhas: string[] = [`{N}.1 O valor total dos serviços é de R$ ${f.valorTotal.trim() || '0,00'}.`];
    if (f.entrada.trim()) {
      linhas.push(`{N}.2 Entrada: R$ ${f.entrada.trim()}`);
      if (restante) linhas.push(`{N}.3 Valor restante: R$ ${restante}`);
    }
    if (f.numeroParcelas.trim() && parcela) linhas.push(`{N}.4 Parcelamento: ${f.numeroParcelas}x de R$ ${parcela}${f.diaVencimentoParcelas.trim() ? `, vencimento dia ${f.diaVencimentoParcelas.trim()}` : ''}.`);
    linhas.push('');
    linhas.push(`{N}.5 Condição de pagamento: ${f.condicaoPagamento}`);
    if (f.formasPagamento.length > 0) linhas.push(`{N}.6 Formas de pagamento aceitas: ${f.formasPagamento.join(', ')}`);
    linhas.push('');
    linhas.push(`Em caso de atraso no pagamento, incidirão multa de ${MULTA_ATRASO_PAGAMENTO} sobre o valor em atraso e juros de mora de ${JUROS_MORA_MENSAL} ao mês, calculados pro rata die.`);
    linhas.push(`Decorridos ${DIAS_TOLERANCIA_SUSPENSAO} dias corridos de atraso sem regularização, a CONTRATADA reserva-se o direito de suspender a execução dos serviços até a quitação do débito, sem prejuízo das demais penalidades previstas nesta cláusula.`);
    clausulas.push({ titulo: 'DO VALOR E FORMA DE PAGAMENTO', linhas, destaque: true });
  }

  {
    const linhas: string[] = [
      f.numRevisoes.trim() ? `{N}.1 Estão incluídas ${f.numRevisoes.trim()} revisões no escopo deste contrato.` : '{N}.1 O número de revisões incluídas está definido no escopo contratado.',
    ];
    if (f.oQueContaRevisao.trim()) { linhas.push(''); linhas.push(`{N}.2 Considera-se revisão: ${f.oQueContaRevisao.trim()}`); }
    if (f.valorRevisaoExtra.trim()) { linhas.push(''); linhas.push(`{N}.3 Revisões adicionais: R$ ${f.valorRevisaoExtra.trim()} cada.`); }
    if (f.prazoRevisao.trim()) { linhas.push(''); linhas.push(`{N}.4 Prazo para solicitar revisão: ${f.prazoRevisao.trim()} após cada entrega.`); }
    linhas.push('');
    linhas.push('Não são consideradas revisões solicitações de conteúdo novo, mudança de escopo ou inclusão de itens não previstos no objeto deste contrato, tratadas como serviço adicional mediante orçamento e aprovação prévia.');
    linhas.push('Caso o CONTRATANTE não solicite revisão dentro do prazo estipulado, a entrega correspondente será considerada tacitamente aprovada.');
    clausulas.push({ titulo: 'DAS REVISÕES E ALTERAÇÕES', linhas });
  }

  {
    const itens = ['executar os serviços conforme o escopo contratado', 'manter comunicação clara e profissional durante todo o projeto', 'cumprir os prazos estabelecidos, desde que o CONTRATANTE cumpra suas obrigações', 'preservar as informações confidenciais do CONTRATANTE', 'entregar os materiais combinados nas condições acordadas', 'informar previamente qualquer alteração relevante no cronograma'];
    clausulas.push({ titulo: 'DAS RESPONSABILIDADES DA CONTRATADA', linhas: ['A CONTRATADA compromete-se a:', ...itens.map((v, i) => `${['I', 'II', 'III', 'IV', 'V', 'VI'][i]}. ${v};`)] });
  }

  {
    const itens = ['fornecer informações completas e corretas', 'enviar os materiais necessários dentro dos prazos acordados', 'aprovar ou solicitar ajustes no prazo estipulado', 'efetuar os pagamentos nas datas acordadas', 'não solicitar entregas fora do escopo sem orçamento adicional', 'revisar os conteúdos antes da publicação', 'garantir que possui direito de uso sobre imagens, marcas, textos e materiais enviados', 'fornecer os acessos necessários às plataformas envolvidas'];
    clausulas.push({ titulo: 'DAS RESPONSABILIDADES DO CONTRATANTE', linhas: ['O CONTRATANTE compromete-se a:', ...itens.map((v, i) => `${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][i]}. ${v};`)] });
  }

  clausulas.push({
    titulo: 'DAS APROVAÇÕES E ATRASOS',
    linhas: [
      'Caso o CONTRATANTE atrase o envio de informações, materiais ou aprovações, os prazos de entrega poderão ser automaticamente ajustados proporcionalmente ao atraso, sem caracterizar descumprimento contratual por parte da CONTRATADA.',
      '',
      'Atrasos recorrentes na aprovação ou no envio de materiais por parte do CONTRATANTE (3 ou mais ocorrências) autorizam a CONTRATADA a suspender temporariamente a execução até a regularização, sem caracterizar descumprimento contratual.',
    ],
  });

  clausulas.push({
    titulo: 'DOS MATERIAIS, ACESSOS E ARQUIVOS EDITÁVEIS',
    linhas: [
      cl.arquivosEditaveis && !cl.semArquivosEditaveis
        ? 'Os arquivos editáveis serão entregues à CONTRATANTE após a quitação integral do valor total previsto na cláusula de pagamento. A entrega de arquivos editáveis está condicionada ao pagamento completo de todas as parcelas contratadas.'
        : 'Arquivos editáveis, links de Canva, arquivos fonte ou estruturas editáveis não serão entregues, salvo disposição expressa em contrário no escopo contratado.',
    ],
  });

  if (cl.confidencialidade) {
    clausulas.push({
      titulo: 'DA CONFIDENCIALIDADE',
      linhas: [
        'As partes comprometem-se a manter sigilo sobre todas as informações confidenciais trocadas durante a vigência deste contrato, não as divulgando a terceiros sem consentimento expresso da outra parte.',
        '',
        `Esta obrigação de confidencialidade permanece válida por ${PRAZO_CONFIDENCIALIDADE_ANOS} anos após o encerramento deste contrato, independentemente do motivo da rescisão.`,
      ],
    });
  }

  clausulas.push({
    titulo: 'DA PROPRIEDADE INTELECTUAL',
    linhas: ['Os materiais desenvolvidos pela CONTRATADA no âmbito deste contrato permanecem de propriedade da CONTRATADA até a quitação integral do valor previsto neste contrato. Após a quitação integral, os direitos de uso sobre os materiais entregues são transferidos ao CONTRATANTE, ressalvado o direito da CONTRATADA de utilizá-los em portfólio e materiais de divulgação, conforme cláusula seguinte.'],
    destaque: true,
  });

  clausulas.push({
    titulo: 'DO USO EM PORTFÓLIO',
    linhas: [
      cl.portfolioAposLancamento
        ? 'A utilização em portfólio pela CONTRATADA somente será permitida após o lançamento público do projeto.'
        : cl.portfolioNaoPermitido
          ? 'Os materiais desenvolvidos não poderão ser utilizados pela CONTRATADA em seu portfólio sem autorização expressa do CONTRATANTE.'
          : 'A CONTRATADA fica autorizada a utilizar os materiais desenvolvidos neste projeto em seu portfólio e materiais de divulgação.',
    ],
  });

  if (cl.gestaoAnuncios || cl.midiaSeparada) {
    clausulas.push({
      titulo: 'DOS ANÚNCIOS E INVESTIMENTO EM MÍDIA',
      linhas: ['O investimento em mídia paga (Google Ads, Meta Ads ou similares) é de responsabilidade exclusiva do CONTRATANTE e não está incluso no valor de prestação de serviço objeto deste contrato, salvo disposição expressa em contrário.'],
    });
  }

  {
    const diasAviso = f.tipoContratacao === 'Serviço mensal recorrente'
      ? (f.avisoPrevio.trim() || `${AVISO_PREVIO_PADRAO_DIAS} dias`)
      : (cl.cancelamento30 ? '30 dias' : `${AVISO_PREVIO_PADRAO_DIAS} dias`);
    const linhas: string[] = [];
    if (f.tipoContratacao === 'Serviço mensal recorrente') {
      linhas.push(`Este contrato tem vigência mínima de ${f.periodoMinimo.trim() || 'prazo definido no escopo'}.`);
    }
    linhas.push(`O cancelamento deste contrato poderá ser solicitado por qualquer das partes mediante aviso prévio de ${diasAviso}, por escrito.`);
    linhas.push('Os valores já pagos até a data do cancelamento não serão reembolsados, correspondendo à remuneração pelos serviços já prestados ou reservados.');
    linhas.push('As parcelas futuras, ainda não vencidas, não serão cobradas caso o aviso prévio estipulado seja respeitado.');
    linhas.push(`Caso o cancelamento ocorra sem o cumprimento do aviso prévio estipulado, será devida multa de ${MULTA_CANCELAMENTO_SEM_AVISO} sobre o valor total do contrato, a título de indenização pelos prejuízos decorrentes da interrupção abrupta.`);
    if (cl.entradaNaoReembolsavel) { linhas.push(''); linhas.push('O valor de entrada pago não será reembolsável após o início da execução dos serviços.'); }
    clausulas.push({ titulo: 'DO CANCELAMENTO', linhas, destaque: true });
  }

  clausulas.push({
    titulo: 'DA LIMITAÇÃO DE RESPONSABILIDADE',
    linhas: ['A CONTRATADA não garante resultados específicos de vendas, crescimento, engajamento, alcance ou faturamento, pois tais resultados dependem de fatores externos, de mercado e do comportamento do público.'],
  });

  clausulas.push({
    titulo: 'DA PUBLICAÇÃO',
    linhas: [
      cl.publicacaoOrium && !cl.publicacaoCliente
        ? 'A publicação dos materiais desenvolvidos será realizada pela CONTRATADA conforme acordado.'
        : 'A publicação dos materiais desenvolvidos será de responsabilidade exclusiva do CONTRATANTE.',
    ],
  });

  clausulas.push({
    titulo: 'DAS DISPOSIÇÕES GERAIS',
    linhas: [
      '{N}.1 Este contrato representa o acordo integral entre as partes, substituindo quaisquer negociações anteriores.',
      '{N}.2 Qualquer alteração deverá ser feita por escrito e assinada por ambas as partes.',
      '{N}.3 As partes elegem o foro da comarca de Belo Horizonte/MG para dirimir quaisquer controvérsias.',
    ],
  });

  {
    const p = f.prestador;
    const c = f.cliente;
    const linhas: string[] = [
      'E por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor.',
      '',
      `Belo Horizonte, ${dataExtenso(new Date().toISOString().split('T')[0])}.`,
      '', '',
      '_________________________________', 'CONTRATADA', p.nome.trim(), p.responsavel.trim(),
      '', '',
      '_________________________________', 'CONTRATANTE', c.empresa.trim() || '[Nome do cliente]',
    ];
    if (c.responsavel.trim()) linhas.push(c.responsavel.trim());
    clausulas.push({ titulo: 'DA ASSINATURA', linhas });
  }

  return clausulas;
}

// ── Gerador do contrato ───────────────────────────────────────────────────────

function gerarContrato(f: FormState): string {
  const p = f.prestador;
  const c = f.cliente;
  const L: string[] = [];
  const add = (s: string) => L.push(s);
  const br = () => L.push('');

  add('CONTRATO DE PRESTAÇÃO DE SERVIÇOS DIGITAIS');
  br(); add('════════════════════════════════════════════════════════════════'); br();
  add('IDENTIFICAÇÃO DAS PARTES'); br();
  add(`CONTRATADA: ${p.nome.trim()}`);
  add(`Responsável: ${p.responsavel.trim()}`);
  add(`E-mail: ${p.email.trim()}`);
  add(`WhatsApp: ${p.whatsapp.trim()}`);
  add(`Cidade/UF: ${p.cidade.trim()} / ${p.uf.trim()}`);
  if (p.cpfCnpj.trim()) add(`CPF/CNPJ: ${p.cpfCnpj.trim()}`);
  if (p.endereco.trim()) add(`Endereço: ${p.endereco.trim()}`);
  br();
  add(`CONTRATANTE: ${c.empresa.trim() || '[Nome do cliente]'}`);
  if (c.responsavel.trim()) add(`Responsável: ${c.responsavel.trim()}`);
  if (c.cpfCnpj.trim()) add(`CPF/CNPJ: ${c.cpfCnpj.trim()}`);
  if (c.email.trim()) add(`E-mail: ${c.email.trim()}`);
  if (c.whatsapp.trim()) add(`WhatsApp: ${c.whatsapp.trim()}`);
  if (c.endereco.trim()) add(`Endereço: ${c.endereco.trim()}`);
  if (c.cidade.trim() || c.uf.trim()) add(`Cidade/UF: ${c.cidade.trim()} / ${c.uf.trim()}`);
  br();
  add('As partes acima identificadas têm entre si justo e contratado o presente Contrato de Prestação de Serviços Digitais, que se regerá pelas cláusulas e condições seguintes.');

  montarClausulas(f).forEach((clausula, i) => {
    const numero = i + 1;
    br(); add('════════════════════════════════════════════════════════════════'); br();
    add(`CLÁUSULA ${numero} — ${clausula.titulo}`); br();
    clausula.linhas.forEach(linha => add(linha.replace(/\{N\}/g, String(numero))));
  });

  return L.join('\n');
}

// ── Estilos base ──────────────────────────────────────────────────────────────

const BI: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e1e',
  borderRadius: '10px', padding: '0.875rem 1.25rem', color: '#fff', fontSize: '0.9rem',
  fontFamily: FP, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
};
const onF = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = '#FF6B00'; };
const onB = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = '#1e1e1e'; };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', color: '#444', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: '0.5rem', fontFamily: FP }}>{label}</label>
      {children}
    </div>
  );
}

function ErrMsg({ children }: { children: React.ReactNode }) {
  return <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.375rem' }}>{children}</p>;
}

function Sep() {
  return <div style={{ height: '1px', background: '#141414', margin: '2rem 0' }} />;
}

function SecLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ color: '#2a2a2a', fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase' as const, marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid #141414' }}>{children}</p>;
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>{children}</div>;
}

function Grid3({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>{children}</div>;
}

function RadioPill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{ padding: '0.625rem 1.25rem', borderRadius: '8px', border: `1px solid ${selected ? '#FF6B00' : '#1e1e1e'}`, background: selected ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.03)', color: selected ? '#fff' : '#555', fontSize: '0.88rem', fontFamily: FP, cursor: 'pointer', transition: 'all 0.15s' }}>
      {selected ? '● ' : '○ '}{label}
    </button>
  );
}

function CheckPill({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{ padding: '0.625rem 1.25rem', borderRadius: '8px', border: `1px solid ${checked ? '#FF6B00' : '#1e1e1e'}`, background: checked ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.03)', color: checked ? '#fff' : '#555', fontSize: '0.88rem', fontFamily: FP, cursor: 'pointer', transition: 'all 0.15s' }}>
      {checked ? '✓ ' : ''}{label}
    </button>
  );
}

function Colapsavel({ nome, aberto, toggle, children }: { nome: string; aberto: boolean; toggle: () => void; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '0.75rem', border: '1px solid #1a1a1a', borderRadius: '10px', overflow: 'hidden' }}>
      <button type="button" onClick={toggle} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.02)', border: 'none', cursor: 'pointer', textAlign: 'left' as const }}>
        <span style={{ fontFamily: FA, color: '#FF6B00', fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase' as const }}>{nome}</span>
        <span style={{ color: '#444', fontSize: '1.1rem', lineHeight: 1 }}>{aberto ? '−' : '+'}</span>
      </button>
      {aberto && <div style={{ padding: '0.75rem 1.25rem 1.25rem' }}>{children}</div>}
    </div>
  );
}

function MoedaInput({ value, onChange, placeholder = '0,00' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#FF6B00', fontSize: '0.88rem', pointerEvents: 'none' }}>R$</span>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={e => { const raw = e.target.value.replace(/\D/g, ''); onChange(raw ? (parseInt(raw, 10) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''); }}
        placeholder={placeholder}
        onFocus={onF}
        onBlur={onB}
        style={{ ...BI, paddingLeft: '3rem' }}
      />
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

function CharCounter({ value, max }: { value: string; max: number }) {
  const remaining = max - value.length;
  return (
    <div style={{ textAlign: 'right', fontSize: '0.7rem', fontFamily: FP, color: remaining <= 10 ? '#FF6B00' : '#777', marginTop: '0.25rem' }}>
      {value.length}/{max}
    </div>
  );
}

function ContratoPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [etapa, setEtapa] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [etapa]);
  const [erros, setErros] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const docParam = searchParams.get('doc');
  const clienteParam = searchParams.get('cliente');
  const segmentoParam = searchParams.get('segmento');
  const [form, setForm] = useState<FormState>(() => {
    const inicial = estadoInicial();
    if (clienteParam) inicial.cliente.empresa = clienteParam;
    if (segmentoParam) inicial.cliente.segmento = segmentoParam;
    return inicial;
  });
  const [gruposAbertos, setGruposAbertos] = useState<Record<string, boolean>>({
    'BRANDING E IDENTIDADE': true, 'PRESENÇA DIGITAL': false, 'DESENVOLVIMENTO E TECNOLOGIA': false,
  });
  const [copiado, setCopiado] = useState(false);
  const [documentoId, setDocumentoId] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [gerando, setGerando] = useState(false);

  useEffect(() => {
    if (!docParam) return;
    fetch(`/api/documentos?id=${docParam}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => { if (data.dados) { setForm(data.dados); setDocumentoId(docParam); } })
      .catch(console.error);
  }, [docParam]);

  const { draft, retomar, descartar, concluir } = useDraft(
    'contrato',
    { etapa, form },
    d => { setForm(d.form); setEtapa(d.etapa); },
    !docParam,
  );

  const setPrestador = useCallback((k: keyof FormState['prestador'], v: string) => setForm(p => ({ ...p, prestador: { ...p.prestador, [k]: v } })), []);
  const setCliente = useCallback((k: keyof FormState['cliente'], v: string) => setForm(p => ({ ...p, cliente: { ...p.cliente, [k]: v } })), []);
  const setF = useCallback(<K extends keyof FormState>(k: K, v: FormState[K]) => setForm(p => ({ ...p, [k]: v })), []);
  const setCl = useCallback((k: keyof FormState['clausulas'], v: boolean) => setForm(p => ({ ...p, clausulas: { ...p.clausulas, [k]: v } })), []);

  function toggleServico(id: string) {
    setForm(p => {
      const sel = p.servicosSelecionados;
      const isOn = sel.includes(id);
      const desc = { ...p.servicosDescricoes };
      if (isOn) delete desc[id];
      return { ...p, servicosSelecionados: isOn ? sel.filter(x => x !== id) : [...sel, id], servicosDescricoes: desc };
    });
  }

  function toggleForma(f: string) {
    setForm(p => ({ ...p, formasPagamento: p.formasPagamento.includes(f) ? p.formasPagamento.filter(x => x !== f) : [...p.formasPagamento, f] }));
  }

  function validar(): boolean {
    const e: string[] = [];
    if (etapa === 0) { if (!form.cliente.empresa.trim()) e.push('empresa'); if (!form.cliente.responsavel.trim()) e.push('resp'); if (!form.cliente.cpfCnpj.trim()) e.push('cpf'); }
    if (etapa === 1) { if (!form.tipoContrato) e.push('tipo'); }
    setErros(e); return e.length === 0;
  }

  function avancar() { if (!validar()) return; setEtapa(p => Math.min(p + 1, ETAPAS.length - 1)); setErros([]); }
  function voltar() { setEtapa(p => Math.max(p - 1, 0)); setErros([]); }

  function copiar() {
    navigator.clipboard.writeText(gerarContrato(form)).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
      const docId = documentoId || crypto.randomUUID();
      fetch('/api/documentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ id: docId, tipo: 'Contrato', nome: form.cliente.empresa || 'Documento sem nome', cliente: form.cliente.empresa, dados: form }),
      }).then(() => { setDocumentoId(docId); setSavedMsg('Salvo em Documentos'); setTimeout(() => setSavedMsg(''), 3000); }).catch(console.error);
    });
  }

  function limpar() {
    if (window.confirm('Limpar todo o formulário? Esta ação não pode ser desfeita.')) { setForm(estadoInicial()); setEtapa(0); setErros([]); descartar(); }
  }

  async function gerarContratoPDF() {
    setGerando(true);
    try {
      if (!document.getElementById('contrato-gfonts')) {
        const link = document.createElement('link');
        link.id = 'contrato-gfonts';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Anton&family=Poppins:wght@400;600;700&display=swap';
        document.head.appendChild(link);
        await new Promise(r => setTimeout(r, 1500));
      }
      await document.fonts.ready;

      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');

      const clientName = form.cliente.empresa || 'cliente';
      const hoje = new Date().toISOString().split('T')[0];
      const arquivo = `contrato-${clientName.toLowerCase().replace(/\s+/g, '-')}-${hoje}.pdf`;
      const dataAssinatura = dataExtenso(hoje);
      const p = form.prestador;
      const c = form.cliente;

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const PX_W = 794;
      const PX_H = 1123;

      const loadImg = (src: string) => new Promise<string>(resolve => {
        const img = new window.Image(); img.crossOrigin = 'anonymous';
        img.onload = () => { const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height; cv.getContext('2d')!.drawImage(img, 0, 0); resolve(cv.toDataURL('image/png')); };
        img.onerror = () => resolve('');
        img.src = src;
      });

      const logoBase64 = await loadImg('/lglaranja.png');
      const logoLg = logoBase64 ? `<img src="${logoBase64}" style="height:64px;object-fit:contain;" />` : `<span style="font-family:'Anton',Impact,sans-serif;font-size:34px;color:#FF6B00;letter-spacing:6px;">ORIUM</span>`;
      const logoXs = logoBase64 ? `<img src="${logoBase64}" style="height:26px;object-fit:contain;" />` : `<span style="font-family:'Anton',Impact,sans-serif;font-size:15px;color:#FF6B00;letter-spacing:4px;">ORIUM</span>`;

      const P = "font-family:'Poppins',Arial,sans-serif;";
      const A = "font-family:'Anton',Impact,sans-serif;";
      const BAR = 'position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#FF6B00,#FF8C00 50%,#FF6B00);';
      const BBAR = 'position:absolute;bottom:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#FF6B00,#FF8C00 50%,#FF6B00);';

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

      // ── Cláusulas → blocos HTML ───────────────────────────────────────────
      const clausulas = montarClausulas(form);
      const clausulasConteudo = clausulas.slice(0, -1); // exclui "DA ASSINATURA" — vira página própria

      const CONTENT_W = PX_W - 140;
      const HEADER_H = 92;
      const FOOTER_H = 60;
      const CONTENT_PAD_V = 48;
      const USABLE_H = PX_H - HEADER_H - FOOTER_H - CONTENT_PAD_V;

      function buildClausulaHtml(clausula: Clausula, numero: number): string {
        const paragrafos = clausula.linhas
          .map(l => l.replace(/\{N\}/g, String(numero)))
          .filter(l => l.trim() !== '')
          .map(l => `<div style="color:#aaa;font-size:12.5px;line-height:1.8;margin-bottom:6px;${P}">${l}</div>`)
          .join('');
        const corpo = clausula.destaque
          ? `<div style="background:#0f0f0f;border-left:2px solid #FF6B00;padding:14px 16px;">${paragrafos}</div>`
          : `<div>${paragrafos}</div>`;
        return `<div style="margin-bottom:4px;"><div style="display:flex;align-items:baseline;gap:10px;margin-bottom:8px;"><div style="${A}font-size:24px;color:#FF6B00;line-height:1;">${String(numero).padStart(2, '0')}</div><div style="${A}font-size:15px;color:#fff;letter-spacing:1px;text-transform:uppercase;">${clausula.titulo}</div></div>${corpo}</div>`;
      }

      const blocosHtml = clausulasConteudo.map((cls, i) => buildClausulaHtml(cls, i + 1));

      // Medição real (não corte por altura de canvas) — evita cortar cláusula no meio
      const medidor = document.createElement('div');
      medidor.style.cssText = `position:fixed;left:-9999px;top:0;width:${CONTENT_W}px;font-family:'Poppins',Arial,sans-serif;`;
      document.body.appendChild(medidor);
      await document.fonts.ready;
      const alturas = blocosHtml.map(html => {
        const wrap = document.createElement('div');
        wrap.innerHTML = html;
        medidor.appendChild(wrap);
        const h = wrap.getBoundingClientRect().height;
        medidor.removeChild(wrap);
        return h;
      });
      document.body.removeChild(medidor);

      const paginas: string[][] = [];
      let paginaAtual: string[] = [];
      let acumulado = 0;
      blocosHtml.forEach((html, i) => {
        const h = alturas[i] + 18; // gap entre blocos
        if (paginaAtual.length > 0 && acumulado + h > USABLE_H) {
          paginas.push(paginaAtual);
          paginaAtual = [];
          acumulado = 0;
        }
        paginaAtual.push(html);
        acumulado += h;
      });
      if (paginaAtual.length > 0) paginas.push(paginaAtual);

      // ── Capa ───────────────────────────────────────────────────────────────
      await addPage(`
        <div style="${P}width:${PX_W}px;height:${PX_H}px;background:#080808;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px;box-sizing:border-box;">
          <div style="${BAR}"></div><div style="${BBAR}"></div>
          <div style="margin-bottom:36px;">${logoLg}</div>
          <div style="color:#FF6B00;font-size:11px;letter-spacing:6px;text-transform:uppercase;margin-bottom:20px;font-weight:600;${P}">CONTRATO DE PRESTAÇÃO DE SERVIÇOS DIGITAIS</div>
          <div style="${A}font-size:38px;color:#fff;letter-spacing:1px;line-height:1.1;text-align:center;margin-bottom:14px;text-transform:uppercase;">ORIUM <span style="color:#FF6B00;">×</span> ${(c.empresa.trim() || '[CLIENTE]').toUpperCase()}</div>
          <div style="color:#555;font-size:12px;letter-spacing:5px;margin-bottom:44px;${P}">ESTRUTURA · PERCEPÇÃO · RESULTADOS</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;width:100%;max-width:560px;margin-bottom:40px;">
            <div style="background:#0d0d0d;border:1px solid #FF6B00;border-radius:12px;padding:20px;">
              <div style="color:#FF6B00;font-size:10px;letter-spacing:3px;font-weight:700;margin-bottom:10px;${P}">CONTRATADA</div>
              <div style="color:#fff;font-size:14px;font-weight:700;margin-bottom:6px;${P}">${p.nome.trim()}</div>
              <div style="color:#888;font-size:11.5px;line-height:1.8;${P}">${p.responsavel.trim()}<br/>${p.email.trim()}<br/>${p.whatsapp.trim()}</div>
            </div>
            <div style="background:#0d0d0d;border:1px solid #1e1e1e;border-radius:12px;padding:20px;">
              <div style="color:#888;font-size:10px;letter-spacing:3px;font-weight:700;margin-bottom:10px;${P}">CONTRATANTE</div>
              <div style="color:#fff;font-size:14px;font-weight:700;margin-bottom:6px;${P}">${c.empresa.trim() || '[Nome do cliente]'}</div>
              <div style="color:#888;font-size:11.5px;line-height:1.8;${P}">${c.responsavel.trim()}<br/>${c.email.trim()}<br/>${c.whatsapp.trim()}</div>
            </div>
          </div>
          <div style="color:#2a2a2a;font-size:11px;letter-spacing:2px;${P}">${dataAssinatura}</div>
        </div>
      `);

      // ── Páginas de conteúdo (dinâmicas, paginadas por medição real) ─────────
      for (let i = 0; i < paginas.length; i++) {
        await addPage(`
          <div style="${P}width:${PX_W}px;height:${PX_H}px;background:#080808;box-sizing:border-box;position:relative;display:flex;flex-direction:column;">
            <div style="${BAR}"></div>
            <div style="padding:28px 70px 18px 70px;border-bottom:1px solid #161616;display:flex;justify-content:space-between;align-items:center;">${logoXs}<div style="color:#2a2a2a;font-size:11px;letter-spacing:3px;text-transform:uppercase;${P}">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</div></div>
            <div style="padding:24px 70px;flex:1;display:flex;flex-direction:column;gap:18px;overflow:hidden;">
              ${paginas[i].join('')}
            </div>
            <div style="margin-top:auto;border-top:1px solid #1a1a1a;padding:12px 70px 20px;display:flex;justify-content:space-between;align-items:center;">
              <div style="color:#2a2a2a;font-size:10px;letter-spacing:1px;${P}">Estruturamos o que gera percepção, presença e resultado.</div>
              <div style="color:#2a2a2a;font-size:10px;letter-spacing:1px;${P}">Página ${i + 1} de ${paginas.length}</div>
            </div>
          </div>
        `);
      }

      // ── Página de assinatura (sempre isolada, sempre a última) ─────────────
      await addPage(`
        <div style="${P}width:${PX_W}px;height:${PX_H}px;background:#080808;position:relative;display:flex;flex-direction:column;padding:70px 70px 60px;box-sizing:border-box;">
          <div style="${BAR}"></div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:40px;">${logoXs}<div style="color:#2a2a2a;font-size:11px;letter-spacing:3px;text-transform:uppercase;${P}">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</div></div>
          <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
            <div style="${A}font-size:30px;color:#fff;margin-bottom:14px;">DA ASSINATURA</div>
            <div style="color:#999;font-size:13px;line-height:1.8;max-width:560px;margin-bottom:8px;${P}">E por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor.</div>
            <div style="color:#555;font-size:12.5px;margin-bottom:48px;${P}">Belo Horizonte, ${dataAssinatura}.</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;">
              <div style="border-top:1px solid #FF6B00;padding-top:14px;min-height:48px;">
                <div style="color:#fff;font-size:12px;font-weight:700;margin-bottom:4px;${P}">CONTRATADA</div>
                <div style="color:#888;font-size:12px;${P}">${p.nome.trim()}</div>
                <div style="color:#666;font-size:11.5px;${P}">${p.responsavel.trim()}</div>
              </div>
              <div style="border-top:1px solid #1e1e1e;padding-top:14px;min-height:48px;">
                <div style="color:#fff;font-size:12px;font-weight:700;margin-bottom:4px;${P}">CONTRATANTE</div>
                <div style="color:#888;font-size:12px;${P}">${c.empresa.trim() || '[Nome do cliente]'}</div>
                ${c.responsavel.trim() ? `<div style="color:#666;font-size:11.5px;${P}">${c.responsavel.trim()}</div>` : ''}
              </div>
            </div>
          </div>
        </div>
      `);

      const pdfBlob = doc.output('blob');

      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url; a.download = arquivo;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);

      setSaveStatus('saving');
      savePdfToCloud(pdfBlob, clientName, 'Contrato', arquivo)
        .then(result => { setSaveStatus(result.success ? 'success' : 'error'); setTimeout(() => setSaveStatus('idle'), 4000); })
        .catch(() => { setSaveStatus('error'); setTimeout(() => setSaveStatus('idle'), 4000); });
      concluir();

    } catch (err) {
      console.error('Erro ao gerar PDF do contrato:', err);
      alert('Erro ao gerar o PDF. Tente novamente.');
    } finally {
      setGerando(false);
    }
  }

  const restante = calcRestante(form.valorTotal, form.entrada);
  const parcela = calcParcela(restante, form.numeroParcelas);
  const progress = ((etapa + 1) / ETAPAS.length) * 100;

  // ── Layout principal ─────────────────────────────────────────────────────────
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#080808', fontFamily: FP, display: 'flex' }}>
      <ToolBackground position="absolute" gradient="radial" />

      {/* Sidebar */}
      <div style={{ position: 'relative', width: sidebarCollapsed ? '60px' : '260px', flexShrink: 0, height: '100%', zIndex: 10, transition: 'width 0.3s ease' }}>

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
              <p style={{ color: '#444444', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: FP, marginTop: '0.5rem', marginBottom: 0 }}>GERADOR DE CONTRATOS</p>
            </div>
          ) : (
            <div style={{ flexShrink: 0, height: '60px', borderBottom: '1px solid #0f0f0f' }} />
          )}

          {/* ZONA 2 — Etapas */}
          <div style={{ flex: 1, overflowY: 'hidden' }}>
            {!sidebarCollapsed && (
              <p style={{ color: '#444444', fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', padding: '1.25rem 1.75rem 0.75rem', margin: 0 }}>ETAPAS</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {ETAPAS.map((nome, i) => (
                <button
                  key={i}
                  onClick={() => { setEtapa(i); setErros([]); }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: '0.75rem', padding: sidebarCollapsed ? '0.875rem 0' : '0.7rem 1.75rem', background: i === etapa ? 'rgba(255,107,0,0.15)' : 'transparent', borderTop: 'none', borderRight: 'none', borderBottom: 'none', borderLeft: sidebarCollapsed ? 'none' : `2px solid ${i === etapa ? '#FF6B00' : 'transparent'}`, outline: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.2s', boxSizing: 'border-box' as const }}
                  onMouseEnter={e => { if (i !== etapa) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={e => { if (i !== etapa) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  <span style={{ fontFamily: FA, fontSize: '0.65rem', letterSpacing: '0.05em', minWidth: '20px', flexShrink: 0, color: i === etapa ? '#FF6B00' : '#555555', transition: 'color 0.2s' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {!sidebarCollapsed && (
                    <span style={{ fontSize: '0.78rem', color: i === etapa ? '#fff' : '#888888', fontFamily: FP, fontWeight: i === etapa ? 600 : 400, lineHeight: 1.3, transition: 'color 0.2s' }}>
                      {nome}
                    </span>
                  )}
                </button>
              ))}
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

          {/* ZONA 4 — Hub */}
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
            {!sidebarCollapsed && (
              <a href="/meus-documentos" style={{ color: '#777', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s', fontFamily: FP }}
                onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#777'; }}>
                DOCUMENTOS
              </a>
            )}
            {!sidebarCollapsed && (
              <a href="/biblioteca" style={{ color: '#777', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s', fontFamily: FP }}
                onMouseEnter={e => { e.currentTarget.style.color = '#FF6B00'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#777'; }}>
                BIBLIOTECA
              </a>
            )}
          </div>

        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', zIndex: 1, minWidth: 0 }}>

        {/* Header */}
        <div style={{ padding: '2.5rem 4rem 2rem', borderBottom: '1px solid #141414', flexShrink: 0 }}>
          <p style={{ color: '#FF6B00', fontSize: '0.68rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.625rem' }}>
            Etapa {etapa + 1} de {ETAPAS.length}
          </p>
          <h2 style={{ fontFamily: FA, fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', color: '#fff', letterSpacing: '0.04em', lineHeight: 1, marginBottom: '0.5rem' }}>
            {ETAPAS[etapa].toUpperCase()}
          </h2>
          <p style={{ color: '#555', fontSize: '0.9rem', margin: 0 }}>{SUBTITULOS[etapa]}</p>
        </div>

        {/* Form scrollável */}
        <div ref={contentRef} style={{ flex: 1, overflowY: 'auto', padding: '2.5rem 4rem' }}>
          <div style={{ maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

            {/* ── Etapa 0: Dados das Partes ──────────────────────────────── */}
            {etapa === 0 && (<>
              <SecLabel>Prestador (ORIUM)</SecLabel>
              <Grid2>
                <Field label="Nome do Prestador"><input maxLength={60} value={form.prestador.nome} onChange={e => setPrestador('nome', e.target.value)} onFocus={onF} onBlur={onB} style={BI} /><CharCounter value={form.prestador.nome} max={60} /></Field>
                <Field label="Responsável"><input maxLength={60} value={form.prestador.responsavel} onChange={e => setPrestador('responsavel', e.target.value)} onFocus={onF} onBlur={onB} style={BI} /><CharCounter value={form.prestador.responsavel} max={60} /></Field>
                <Field label="E-mail"><input type="email" maxLength={80} value={form.prestador.email} onChange={e => setPrestador('email', e.target.value)} onFocus={onF} onBlur={onB} style={BI} /><CharCounter value={form.prestador.email} max={80} /></Field>
                <Field label="WhatsApp"><input maxLength={20} value={form.prestador.whatsapp} onChange={e => setPrestador('whatsapp', e.target.value)} onFocus={onF} onBlur={onB} style={BI} /><CharCounter value={form.prestador.whatsapp} max={20} /></Field>
                <Field label="Cidade"><input maxLength={40} value={form.prestador.cidade} onChange={e => setPrestador('cidade', e.target.value)} onFocus={onF} onBlur={onB} style={BI} /><CharCounter value={form.prestador.cidade} max={40} /></Field>
                <Field label="UF"><input maxLength={5} value={form.prestador.uf} onChange={e => setPrestador('uf', e.target.value)} onFocus={onF} onBlur={onB} style={BI} /><CharCounter value={form.prestador.uf} max={5} /></Field>
                <Field label="CPF/CNPJ (opcional)"><input maxLength={20} value={form.prestador.cpfCnpj} onChange={e => setPrestador('cpfCnpj', e.target.value)} onFocus={onF} onBlur={onB} style={BI} /><CharCounter value={form.prestador.cpfCnpj} max={20} /></Field>
                <Field label="Endereço (opcional)"><input maxLength={80} value={form.prestador.endereco} onChange={e => setPrestador('endereco', e.target.value)} onFocus={onF} onBlur={onB} style={BI} /><CharCounter value={form.prestador.endereco} max={80} /></Field>
              </Grid2>
              <Sep />
              <SecLabel>Cliente</SecLabel>
              <Grid2>
                <Field label="Nome da empresa / cliente *">
                  <ClienteSelector value={form.cliente.empresa} onChange={nome => setCliente('empresa', nome)} placeholder="Empresa ou nome" />
                  {erros.includes('empresa') && <ErrMsg>Campo obrigatório</ErrMsg>}
                </Field>
                <Field label="Responsável pelo cliente *">
                  <input maxLength={60} value={form.cliente.responsavel} onChange={e => setCliente('responsavel', e.target.value)} onFocus={onF} onBlur={onB} placeholder="Nome completo" style={{ ...BI, borderColor: erros.includes('resp') ? '#ef4444' : '#1e1e1e' }} />
                  <CharCounter value={form.cliente.responsavel} max={60} />
                  {erros.includes('resp') && <ErrMsg>Campo obrigatório</ErrMsg>}
                </Field>
                <Field label="CPF/CNPJ *">
                  <input maxLength={20} value={form.cliente.cpfCnpj} onChange={e => setCliente('cpfCnpj', e.target.value)} onFocus={onF} onBlur={onB} placeholder="000.000.000-00" style={{ ...BI, borderColor: erros.includes('cpf') ? '#ef4444' : '#1e1e1e' }} />
                  <CharCounter value={form.cliente.cpfCnpj} max={20} />
                  {erros.includes('cpf') && <ErrMsg>Campo obrigatório</ErrMsg>}
                </Field>
                <Field label="E-mail"><input type="email" maxLength={80} value={form.cliente.email} onChange={e => setCliente('email', e.target.value)} onFocus={onF} onBlur={onB} style={BI} /><CharCounter value={form.cliente.email} max={80} /></Field>
                <Field label="WhatsApp"><input maxLength={20} value={form.cliente.whatsapp} onChange={e => setCliente('whatsapp', e.target.value)} onFocus={onF} onBlur={onB} placeholder="(00) 00000-0000" style={BI} /><CharCounter value={form.cliente.whatsapp} max={20} /></Field>
                <Field label="Segmento"><input value={form.cliente.segmento} onChange={e => setCliente('segmento', e.target.value)} onFocus={onF} onBlur={onB} placeholder="Ex: restaurante, clínica..." style={BI} /></Field>
                <Field label="Endereço"><input maxLength={80} value={form.cliente.endereco} onChange={e => setCliente('endereco', e.target.value)} onFocus={onF} onBlur={onB} style={BI} /><CharCounter value={form.cliente.endereco} max={80} /></Field>
                <Field label="Cidade"><input maxLength={40} value={form.cliente.cidade} onChange={e => setCliente('cidade', e.target.value)} onFocus={onF} onBlur={onB} style={BI} /><CharCounter value={form.cliente.cidade} max={40} /></Field>
                <Field label="UF"><input maxLength={5} value={form.cliente.uf} onChange={e => setCliente('uf', e.target.value)} onFocus={onF} onBlur={onB} style={BI} /><CharCounter value={form.cliente.uf} max={5} /></Field>
                <Field label="Instagram (opcional)"><input value={form.cliente.instagram} onChange={e => setCliente('instagram', e.target.value)} onFocus={onF} onBlur={onB} placeholder="@perfil" style={BI} /></Field>
                <Field label="Site (opcional)"><input value={form.cliente.site} onChange={e => setCliente('site', e.target.value)} onFocus={onF} onBlur={onB} placeholder="www.exemplo.com.br" style={BI} /></Field>
              </Grid2>
              <Field label="Observações internas (não aparece no contrato)">
                <textarea value={form.cliente.obs} onChange={e => setCliente('obs', e.target.value)} onFocus={onF} onBlur={onB} rows={2} placeholder="Notas internas sobre o cliente..." style={{ ...BI, resize: 'vertical' }} />
              </Field>
            </>)}

            {/* ── Etapa 1: Tipo de Contrato ──────────────────────────────── */}
            {etapa === 1 && (<>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                {TIPOS_CONTRATO.map(t => <RadioPill key={t} label={t} selected={form.tipoContrato === t} onClick={() => setF('tipoContrato', t)} />)}
              </div>
              {erros.includes('tipo') && <ErrMsg>Selecione o tipo de contrato</ErrMsg>}
            </>)}

            {/* ── Etapa 2: Serviços ──────────────────────────────────────── */}
            {etapa === 2 && (<>
              <p style={{ color: '#3a3a3a', fontSize: '0.82rem', marginTop: '-0.5rem' }}>Ao marcar um serviço, um campo de descrição será exibido.</p>
              {GRUPOS_SERVICOS.map(grupo => (
                <Colapsavel key={grupo.nome} nome={grupo.nome} aberto={!!gruposAbertos[grupo.nome]} toggle={() => setGruposAbertos(p => ({ ...p, [grupo.nome]: !p[grupo.nome] }))}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {grupo.servicos.map(s => {
                      const sel = form.servicosSelecionados.includes(s.id);
                      return (
                        <div key={s.id}>
                          <CheckPill label={s.nome} checked={sel} onClick={() => toggleServico(s.id)} />
                          {sel && (
                            <div style={{ marginTop: '0.625rem', marginLeft: '0.5rem' }}>
                              <textarea
                                maxLength={120}
                                value={form.servicosDescricoes[s.id] || ''}
                                onChange={e => setForm(p => ({ ...p, servicosDescricoes: { ...p.servicosDescricoes, [s.id]: e.target.value } }))}
                                placeholder="Descreva o escopo deste serviço..."
                                rows={2}
                                onFocus={onF} onBlur={onB}
                                style={{ ...BI, resize: 'vertical' }}
                              />
                              <CharCounter value={form.servicosDescricoes[s.id] || ''} max={120} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Colapsavel>
              ))}
              {form.servicosSelecionados.length > 0 && (
                <p style={{ color: 'rgba(255,107,0,0.6)', fontSize: '0.78rem' }}>
                  {form.servicosSelecionados.length} serviço{form.servicosSelecionados.length > 1 ? 's' : ''} selecionado{form.servicosSelecionados.length > 1 ? 's' : ''}
                </p>
              )}
            </>)}

            {/* ── Etapa 3: Escopo e Entregáveis ─────────────────────────── */}
            {etapa === 3 && (<>
              <Field label="Descrição geral do projeto">
                <textarea maxLength={400} value={form.descricaoGeral} onChange={e => setF('descricaoGeral', e.target.value)} onFocus={onF} onBlur={onB} rows={3} style={{ ...BI, resize: 'vertical' }} />
                <CharCounter value={form.descricaoGeral} max={400} />
              </Field>
              <Field label="Objetivo do projeto">
                <textarea maxLength={200} value={form.objetivo} onChange={e => setF('objetivo', e.target.value)} onFocus={onF} onBlur={onB} rows={2} style={{ ...BI, resize: 'vertical' }} />
                <CharCounter value={form.objetivo} max={200} />
              </Field>
              <Field label="Entregáveis principais">
                <textarea maxLength={400} value={form.entregaveis} onChange={e => setF('entregaveis', e.target.value)} onFocus={onF} onBlur={onB} rows={3} style={{ ...BI, resize: 'vertical' }} />
                <CharCounter value={form.entregaveis} max={400} />
              </Field>
              <Grid3>
                <Field label="Qtd. de peças/designs"><input maxLength={10} value={form.qtdPecas} onChange={e => setF('qtdPecas', e.target.value)} onFocus={onF} onBlur={onB} placeholder="Ex: 10" style={BI} /><CharCounter value={form.qtdPecas} max={10} /></Field>
                <Field label="Qtd. de reuniões"><input maxLength={10} value={form.qtdReunioes} onChange={e => setF('qtdReunioes', e.target.value)} onFocus={onF} onBlur={onB} placeholder="Ex: 2" style={BI} /><CharCounter value={form.qtdReunioes} max={10} /></Field>
                <Field label="Qtd. de revisões"><input maxLength={10} value={form.qtdRevisoes} onChange={e => setF('qtdRevisoes', e.target.value)} onFocus={onF} onBlur={onB} placeholder="Ex: 3" style={BI} /><CharCounter value={form.qtdRevisoes} max={10} /></Field>
              </Grid3>
              <Field label="Plataformas envolvidas"><input maxLength={80} value={form.plataformas} onChange={e => setF('plataformas', e.target.value)} onFocus={onF} onBlur={onB} placeholder="Ex: Instagram, WhatsApp, Google" style={BI} /><CharCounter value={form.plataformas} max={80} /></Field>
              <Field label="Canais envolvidos"><input maxLength={80} value={form.canais} onChange={e => setF('canais', e.target.value)} onFocus={onF} onBlur={onB} style={BI} /><CharCounter value={form.canais} max={80} /></Field>
              <Field label="O que NÃO está incluso">
                <textarea maxLength={200} value={form.naoIncluso} onChange={e => setF('naoIncluso', e.target.value)} onFocus={onF} onBlur={onB} rows={2} style={{ ...BI, resize: 'vertical' }} />
                <CharCounter value={form.naoIncluso} max={200} />
              </Field>
              <Field label="Materiais que o cliente precisa enviar">
                <textarea maxLength={200} value={form.materiaisCliente} onChange={e => setF('materiaisCliente', e.target.value)} onFocus={onF} onBlur={onB} rows={2} style={{ ...BI, resize: 'vertical' }} />
                <CharCounter value={form.materiaisCliente} max={200} />
              </Field>
            </>)}

            {/* ── Etapa 4: Prazos ───────────────────────────────────────── */}
            {etapa === 4 && (<>
              <Grid2>
                <Field label="Data de início"><input type="date" value={form.dataInicio} onChange={e => setF('dataInicio', e.target.value)} onFocus={onF} onBlur={onB} style={BI} /></Field>
                <Field label="Data prevista de entrega"><input type="date" value={form.dataEntrega} onChange={e => setF('dataEntrega', e.target.value)} onFocus={onF} onBlur={onB} style={BI} /></Field>
              </Grid2>
              <Grid3>
                <Field label="Duração estimada"><input maxLength={30} value={form.duracaoEstimada} onChange={e => setF('duracaoEstimada', e.target.value)} onFocus={onF} onBlur={onB} placeholder="Ex: 30 dias" style={BI} /><CharCounter value={form.duracaoEstimada} max={30} /></Field>
                <Field label="Prazo para materiais"><input maxLength={50} value={form.prazoMateriais} onChange={e => setF('prazoMateriais', e.target.value)} onFocus={onF} onBlur={onB} style={BI} /><CharCounter value={form.prazoMateriais} max={50} /></Field>
                <Field label="Prazo para aprovação"><input maxLength={50} value={form.prazoAprovacao} onChange={e => setF('prazoAprovacao', e.target.value)} onFocus={onF} onBlur={onB} style={BI} /><CharCounter value={form.prazoAprovacao} max={50} /></Field>
              </Grid3>
              <Field label="Tipo de contratação">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', marginTop: '0.25rem' }}>
                  {TIPOS_CONTRATACAO.map(t => <RadioPill key={t} label={t} selected={form.tipoContratacao === t} onClick={() => setF('tipoContratacao', t)} />)}
                </div>
              </Field>
              {form.tipoContratacao === 'Serviço mensal recorrente' && (
                <Grid3>
                  <Field label="Dia de vencimento mensal"><input maxLength={5} value={form.diaVencimentoMensal} onChange={e => setF('diaVencimentoMensal', e.target.value)} onFocus={onF} onBlur={onB} placeholder="Ex: 5" style={BI} /><CharCounter value={form.diaVencimentoMensal} max={5} /></Field>
                  <Field label="Período mínimo"><input maxLength={30} value={form.periodoMinimo} onChange={e => setF('periodoMinimo', e.target.value)} onFocus={onF} onBlur={onB} placeholder="Ex: 3 meses" style={BI} /><CharCounter value={form.periodoMinimo} max={30} /></Field>
                  <Field label="Aviso prévio"><input maxLength={30} value={form.avisoPrevio} onChange={e => setF('avisoPrevio', e.target.value)} onFocus={onF} onBlur={onB} placeholder="Ex: 30 dias" style={BI} /><CharCounter value={form.avisoPrevio} max={30} /></Field>
                </Grid3>
              )}
            </>)}

            {/* ── Etapa 5: Valores e Pagamento ──────────────────────────── */}
            {etapa === 5 && (<>
              <Grid3>
                <Field label="Valor total"><MoedaInput value={form.valorTotal} onChange={v => setF('valorTotal', v)} /></Field>
                <Field label="Entrada"><MoedaInput value={form.entrada} onChange={v => setF('entrada', v)} /></Field>
                <Field label="Valor restante (calculado)">
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#333', fontSize: '0.88rem', pointerEvents: 'none' }}>R$</span>
                    <input readOnly value={restante} style={{ ...BI, paddingLeft: '3rem', color: '#555', cursor: 'default' }} />
                  </div>
                </Field>
              </Grid3>
              <Grid3>
                <Field label="Número de parcelas"><input maxLength={3} value={form.numeroParcelas} onChange={e => setF('numeroParcelas', e.target.value)} onFocus={onF} onBlur={onB} placeholder="Ex: 3" style={BI} /><CharCounter value={form.numeroParcelas} max={3} /></Field>
                <Field label="Valor por parcela (calculado)">
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#333', fontSize: '0.88rem', pointerEvents: 'none' }}>R$</span>
                    <input readOnly value={parcela} style={{ ...BI, paddingLeft: '3rem', color: '#555', cursor: 'default' }} />
                  </div>
                </Field>
                <Field label="Dia de vencimento"><input maxLength={5} value={form.diaVencimentoParcelas} onChange={e => setF('diaVencimentoParcelas', e.target.value)} onFocus={onF} onBlur={onB} placeholder="Ex: 10" style={BI} /><CharCounter value={form.diaVencimentoParcelas} max={5} /></Field>
              </Grid3>
              <Field label="Condição de pagamento">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', marginTop: '0.25rem' }}>
                  {CONDICOES_PAGAMENTO.map(c => <RadioPill key={c} label={c} selected={form.condicaoPagamento === c} onClick={() => setF('condicaoPagamento', c)} />)}
                </div>
              </Field>
              <Field label="Formas de pagamento aceitas">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', marginTop: '0.25rem' }}>
                  {FORMAS_PAGAMENTO.map(f => <CheckPill key={f} label={f} checked={form.formasPagamento.includes(f)} onClick={() => toggleForma(f)} />)}
                </div>
              </Field>
            </>)}

            {/* ── Etapa 6: Revisões e Condições ─────────────────────────── */}
            {etapa === 6 && (<>
              <Grid2>
                <Field label="Número de revisões incluídas"><input maxLength={5} value={form.numRevisoes} onChange={e => setF('numRevisoes', e.target.value)} onFocus={onF} onBlur={onB} placeholder="Ex: 2" style={BI} /><CharCounter value={form.numRevisoes} max={5} /></Field>
                <Field label="Prazo para solicitar revisão"><input maxLength={50} value={form.prazoRevisao} onChange={e => setF('prazoRevisao', e.target.value)} onFocus={onF} onBlur={onB} style={BI} /><CharCounter value={form.prazoRevisao} max={50} /></Field>
              </Grid2>
              <Field label="O que conta como revisão">
                <textarea maxLength={200} value={form.oQueContaRevisao} onChange={e => setF('oQueContaRevisao', e.target.value)} onFocus={onF} onBlur={onB} rows={2} style={{ ...BI, resize: 'vertical' }} />
                <CharCounter value={form.oQueContaRevisao} max={200} />
              </Field>
              <Field label="Valor por revisão extra">
                <MoedaInput value={form.valorRevisaoExtra} onChange={v => setF('valorRevisaoExtra', v)} placeholder="0,00" />
              </Field>
            </>)}

            {/* ── Etapa 7: Cláusulas Opcionais ──────────────────────────── */}
            {etapa === 7 && (
              [
                { titulo: 'CONFIDENCIALIDADE E USO', itens: [
                  { k: 'confidencialidade' as const, label: 'Incluir cláusula de confidencialidade' },
                  { k: 'portfolioPermitido' as const, label: 'Permitir uso do projeto no portfólio da ORIUM' },
                  { k: 'portfolioNaoPermitido' as const, label: 'Não permitir uso público do projeto' },
                  { k: 'portfolioAposLancamento' as const, label: 'Permitir uso apenas após lançamento' },
                ]},
                { titulo: 'PUBLICAÇÃO E GESTÃO', itens: [
                  { k: 'publicacaoCliente' as const, label: 'Cliente será responsável pela publicação' },
                  { k: 'publicacaoOrium' as const, label: 'ORIUM será responsável pela publicação' },
                  { k: 'gestaoAnuncios' as const, label: 'ORIUM fará gestão de anúncios' },
                  { k: 'midiaSeparada' as const, label: 'Investimento em mídia pago separadamente pelo cliente' },
                ]},
                { titulo: 'ARQUIVOS E ENTREGA', itens: [
                  { k: 'arquivosEditaveis' as const, label: 'Entrega de arquivos editáveis incluída' },
                  { k: 'semArquivosEditaveis' as const, label: 'Arquivos editáveis NÃO serão entregues' },
                ]},
                { titulo: 'CANCELAMENTO E PAGAMENTO', itens: [
                  { k: 'cancelamento30' as const, label: 'Cancelamento com aviso prévio de 30 dias' },
                  { k: 'entradaNaoReembolsavel' as const, label: 'Entrada não reembolsável após início do projeto' },
                ]},
              ].map(grupo => (
                <div key={grupo.titulo}>
                  <p style={{ color: '#2a2a2a', fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase' as const, marginBottom: '0.875rem' }}>{grupo.titulo}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                    {grupo.itens.map(item => (
                      <CheckPill key={item.k} label={item.label} checked={form.clausulas[item.k]} onClick={() => setCl(item.k, !form.clausulas[item.k])} />
                    ))}
                  </div>
                </div>
              ))
            )}

            {/* ── Etapa 8: Preview ──────────────────────────────────────── */}
            {etapa === 8 && (<>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '-0.5rem' }}>
                <button
                  onClick={copiar}
                  style={{ padding: '0.75rem 1.75rem', background: '#FF6B00', border: 'none', borderRadius: '8px', color: '#fff', fontFamily: FA, fontSize: '0.88rem', letterSpacing: '0.12em', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(255,107,0,0.2)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#e55f00'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#FF6B00'; }}
                >
                  {copiado ? '✓ COPIADO!' : 'COPIAR CONTRATO'}
                </button>
                <button
                  onClick={gerarContratoPDF}
                  disabled={gerando}
                  style={{ padding: '0.75rem 1.75rem', background: 'transparent', border: '1px solid #1e1e1e', borderRadius: '8px', color: gerando ? '#555' : '#888', fontFamily: FP, fontSize: '0.88rem', cursor: gerando ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: gerando ? 0.7 : 1 }}
                  onMouseEnter={e => { if (!gerando) { e.currentTarget.style.borderColor = '#FF6B00'; e.currentTarget.style.color = '#FF6B00'; } }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = gerando ? '#555' : '#888'; }}
                >
                  {gerando ? 'GERANDO PDF...' : 'GERAR PDF'}
                </button>
                <button
                  onClick={limpar}
                  style={{ padding: '0.75rem 1.75rem', background: 'transparent', border: '1px solid #1e1e1e', borderRadius: '8px', color: '#444', fontFamily: FP, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#888'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#444'; }}
                >
                  Limpar formulário
                </button>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '2rem 2.5rem' }}>
                <pre style={{ color: 'rgba(255,255,255,0.75)', fontFamily: FP, fontWeight: 300, fontSize: '0.85rem', lineHeight: 1.8, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                  {gerarContrato(form)}
                </pre>
              </div>
            </>)}

          </div>
        </div>

        {/* Rodapé de navegação */}
        <WizardFooter
          containerStyle={{ padding: '1.5rem 4rem' }}
          onBack={etapa > 0 ? voltar : undefined}
          onNext={etapa < ETAPAS.length - 1 ? avancar : copiar}
          nextLabel={etapa < ETAPAS.length - 1 ? 'CONTINUAR →' : copiado ? '✓ COPIADO!' : 'COPIAR CONTRATO'}
        />

      </div>
      {savedMsg && (
        <div style={{ position: 'fixed', bottom: '5rem', right: '2rem', zIndex: 100, background: 'rgba(8,8,8,0.95)', border: '1px solid #FF6B00', borderRadius: '8px', padding: '0.75rem 1.25rem', color: '#FF6B00', fontSize: '0.8rem', fontFamily: FP, backdropFilter: 'blur(8px)' }}>
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
      <AuthGate title="CONTRATO" subtitle="Gerador de contratos de prestação de serviços.">
        <ContratoPage />
      </AuthGate>
    </Suspense>
  );
}
