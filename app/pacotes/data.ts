export interface PlanoMensal {
  id: string;
  nome: string;
  preco: number;
  descricao: string;
  recomendado?: boolean;
  incluso: string[];
  naoIncluso: string[];
}

export interface ItemUnico {
  id: string;
  nome: string;
  preco: number;
  descricao?: string;
  incluso: string[];
}

export interface AddOn {
  id: string;
  nome: string;
  preco: number;
  descricao: string;
  monthly?: boolean;
  icon: string;
}

export const PLANOS_MENSAIS: PlanoMensal[] = [
  {
    id: 'presenca',
    nome: 'Presença™',
    preco: 1600,
    descricao: 'Marca ativa e consistente no dia a dia.',
    incluso: [
      '8 posts/mês (2 por semana)',
      'Calendário editorial mensal',
      'Roteiro semanal de stories',
      '1 peça institucional/folder',
      'Relatório mensal simplificado',
    ],
    naoIncluso: [
      'Gestão de tráfego pago',
      'Campanha de lançamento',
      'Reunião mensal de resultados',
    ],
  },
  {
    id: 'autoridade',
    nome: 'Autoridade™',
    preco: 2400,
    descricao: 'Referência no mercado com presença e tráfego pago.',
    recomendado: true,
    incluso: [
      '12 posts/mês (3 por semana)',
      'Calendário editorial mensal',
      'Roteiro semanal e diário em campanha',
      '2 peças institucionais/folders',
      'Gestão de tráfego pago (1 campanha)',
      '1 campanha de lançamento a cada 2 meses',
      'Relatório mensal completo',
    ],
    naoIncluso: [
      'Reunião mensal de resultados',
    ],
  },
  {
    id: 'crescimento',
    nome: 'Crescimento™',
    preco: 3400,
    descricao: 'Escala com campanhas constantes e gestão completa.',
    incluso: [
      '16 posts/mês (4 por semana)',
      'Calendário editorial mensal',
      'Roteiro diário de stories',
      '4 peças institucionais/folders',
      'Gestão completa de tráfego pago',
      'Campanha de lançamento mensal',
      'Relatório mensal completo',
      'Reunião mensal de resultados',
    ],
    naoIncluso: [],
  },
];

export const NOTA_PLANOS =
  'Gestão estratégica da campanha inclusa. Verba de mídia é custo separado, pago diretamente à plataforma (Meta/Google).';

export const ESTRUTURACAO_INICIAL: ItemUnico = {
  id: 'estruturacao',
  nome: 'Estruturação Inicial',
  preco: 1199,
  incluso: [
    'Briefing Estratégico™',
    'Direção de Percepção™',
    'Presença Base™',
    'Vitrine Estratégica™',
    'Estruturação do Instagram™',
  ],
};

export const SITE_INSTITUCIONAL: ItemUnico = {
  id: 'site',
  nome: 'Site Institucional',
  preco: 1300,
  descricao:
    'Apresentação profissional da marca na web, identidade visual própria e seções estratégicas.',
  incluso: [],
};

export const ADDONS: AddOn[] = [
  {
    id: 'paginas-produto',
    nome: 'Páginas individuais por produto ou serviço',
    preco: 900,
    descricao:
      'Sistema dinâmico via CMS, cada item ganha sua própria página sem reprogramar.',
    icon: 'conteudo',
  },
  {
    id: 'pagamento-site',
    nome: 'Pagamento direto no site',
    preco: 1700,
    descricao:
      'Checkout integrado com confirmação automática, sem intervenção manual. Aceita PIX e débito/crédito.',
    icon: 'automacao',
  },
  {
    id: 'crm-email',
    nome: 'CRM com disparo de e-mail',
    preco: 1500,
    descricao:
      'Captação de leads, organização e disparo automatizado de e-mails de relacionamento.',
    icon: 'comunicacao',
  },
  {
    id: 'manutencao',
    nome: 'Manutenção e evolução do site',
    preco: 250,
    monthly: true,
    descricao: 'Hospedagem ativa, monitoramento e até 2 ajustes de conteúdo por mês.',
    icon: 'crescimento',
  },
];
