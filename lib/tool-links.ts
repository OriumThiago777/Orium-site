// URL da ferramenta de geração para cada tipo de documento (etapas do progresso).
// Usado pelo CRM para abrir a ferramenta certa já preenchida via query param.

const ROTAS: Record<string, string> = {
  'Raio-X': '/raio-x',
  'Proposta': '/proposta',
  'Contrato': '/contrato',
  'Calendário': '/calendario',
  'Relatório': '/relatorio',
  'Checklist': '/checklist',
}

export function getToolUrl(tipo: string, cliente: string): string {
  if (tipo === 'Briefing') return '/briefing' // fluxo próprio, sem pré-preenchimento
  const rota = ROTAS[tipo]
  if (!rota) return '/hub'
  return cliente ? `${rota}?cliente=${encodeURIComponent(cliente)}` : rota
}
