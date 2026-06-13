// Mensagem de WhatsApp por fase de destino do Kanban.
// [NOME] é substituído pelo nome real do cliente no componente MensagemFase.
// Fases com string vazia não exibem modal.
export const FASE_MENSAGENS: Record<string, string> = {
  // Fases ativas do Kanban (app/clientes/components/shared.tsx)
  'Prospecção': '',
  'Diagnóstico': 'Olá, [NOME]! Demos início ao diagnóstico da sua presença digital. Em breve você receberá o Raio-X ORIUM com uma análise completa da sua marca. Qualquer dúvida, estou à disposição.',
  'Estruturação Inicial': 'Olá, [NOME]! Iniciamos a estruturação da presença digital da sua marca. A partir de agora você vai começar a ver as primeiras entregas tomando forma.',
  'Conteúdo e Comunicação': 'Olá, [NOME]! Avançamos para a etapa de conteúdo e comunicação. Vamos dar voz à sua marca com publicações estratégicas e uma presença cada vez mais consistente.',
  'Expansão Digital': 'Olá, [NOME]! Sua presença digital está estruturada e agora entramos na fase de expansão. Vamos ampliar o alcance e fortalecer ainda mais a percepção da sua marca.',
  'Pausado': '',
  'Finalizado': 'Olá, [NOME]! Todas as entregas foram concluídas. Foi um prazer estruturar a presença digital da sua marca. Estou à disposição para os próximos passos.',

  // Fases adicionais (não existem no Kanban atual — mantidas para uso futuro)
  'Proposta': 'Olá, [NOME]! Com base no diagnóstico, preparei uma proposta personalizada para estruturar a presença digital da sua marca. Vou te enviar em breve para sua avaliação.',
  'Contrato': 'Olá, [NOME]! Fico feliz em confirmar que avançamos para a etapa de contrato. Vou te enviar o documento para revisão e assinatura.',
  'Execução': 'Olá, [NOME]! Iniciamos a execução do projeto. A partir de agora você vai começar a ver as primeiras entregas tomando forma.',
  'Revisão': 'Olá, [NOME]! Chegamos na etapa de revisão. Vou te enviar as entregas para você avaliar e me dar seu feedback.',
  'Entregue': 'Olá, [NOME]! Todas as entregas foram concluídas. Foi um prazer estruturar a presença digital da sua marca. Estou à disposição para os próximos passos.',
  'Recorrência': 'Olá, [NOME]! Vamos iniciar mais um ciclo de trabalho juntos. Já estou planejando o próximo mês para manter sua presença digital sempre forte.',
  'Inativo': '',
}
