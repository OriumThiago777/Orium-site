export type DadosCliente = {
  nome: string
  faseAtual: string
  diasSemContato: number
  etapasConcluidas: number
  totalEtapas: number
}

export type Sugestao = {
  acao: string
  urgencia: 'alta' | 'media' | 'baixa'
  motivo: string
}

// Mapeia a ação sugerida para o tipo de ferramenta consumido por getToolUrl()
// (lib/tool-links.ts). Ações sem ferramenta associada (ex.: check-in, contato
// direto) não aparecem aqui — o botão "EXECUTAR →" não é exibido nesses casos.
export const SUGESTAO_FERRAMENTA: Record<string, string> = {
  'Enviar proposta': 'Proposta',
  'Gerar Raio-X': 'Raio-X',
  'Gerar Proposta': 'Proposta',
  'Gerar Calendário': 'Calendário',
}

export function getSugestao(dados: DadosCliente): Sugestao | null {
  const { faseAtual, diasSemContato, etapasConcluidas } = dados

  if (diasSemContato > 14) {
    return { acao: 'Entrar em contato', urgencia: 'alta', motivo: `Sem contato há ${diasSemContato} dias` }
  }
  if (faseAtual === 'Prospecção' && diasSemContato > 2) {
    return { acao: 'Enviar proposta', urgencia: 'alta', motivo: `Prospect aguardando há ${diasSemContato} dias` }
  }
  if (faseAtual === 'Diagnóstico' && etapasConcluidas === 0) {
    return { acao: 'Gerar Raio-X', urgencia: 'alta', motivo: 'Diagnóstico não iniciado' }
  }
  if (faseAtual === 'Estruturação Inicial' && etapasConcluidas < 2) {
    return { acao: 'Gerar Proposta', urgencia: 'media', motivo: 'Proposta pendente' }
  }
  if (faseAtual === 'Conteúdo e Comunicação' && etapasConcluidas < 4) {
    return { acao: 'Gerar Calendário', urgencia: 'media', motivo: 'Calendário pendente' }
  }
  if (faseAtual === 'Expansão Digital') {
    return { acao: 'Agendar reunião de expansão', urgencia: 'media', motivo: 'Cliente pronto para expansão' }
  }
  if (faseAtual === 'Finalizado' && diasSemContato > 30) {
    return { acao: 'Oferecer renovação', urgencia: 'baixa', motivo: 'Cliente finalizado há mais de 30 dias' }
  }
  if (diasSemContato > 7) {
    return { acao: 'Fazer check-in', urgencia: 'media', motivo: `Sem contato há ${diasSemContato} dias` }
  }

  return null
}
