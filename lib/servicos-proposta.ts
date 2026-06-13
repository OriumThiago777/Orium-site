// Catálogo de serviços oferecidos nas fases de uma proposta — usado pelo
// wizard de criação (/proposta) e pela página pública de visualização (/proposta/[id]).

export interface Servico {
  id: string;
  nome: string;
  descricao: string;
}

export const SERVICOS_POR_CATEGORIA: Array<{ nome: string; servicos: Servico[] }> = [
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

export const TODOS_SERVICOS = SERVICOS_POR_CATEGORIA.flatMap(c => c.servicos);
