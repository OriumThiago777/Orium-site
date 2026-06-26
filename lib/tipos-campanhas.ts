export type TipoCampanha =
  | 'Tráfego Pago'
  | 'Feriado'
  | 'Lançamento'
  | 'Promoção'
  | 'Data Comemorativa'
  | 'Outro'

export type StatusCampanha = 'Planejada' | 'Em andamento' | 'Encerrada' | 'Cancelada'

export type PlataformaCampanha = 'Instagram' | 'Facebook' | 'Google' | 'WhatsApp' | 'YouTube'

export interface Campanha {
  id: string
  titulo: string
  tipo: TipoCampanha
  dataInicio: string
  dataFim: string
  objetivo: string
  orcamento: string
  plataformas: PlataformaCampanha[]
  status: StatusCampanha
  observacoes: string
}

export const COR_TIPO_CAMPANHA: Record<TipoCampanha, string> = {
  'Tráfego Pago': '#FF6B00',
  'Feriado': '#3B82F6',
  'Lançamento': '#8B5CF6',
  'Promoção': '#10B981',
  'Data Comemorativa': '#F59E0B',
  'Outro': '#6B7280',
}

export const SIGLA_TIPO_CAMPANHA: Record<TipoCampanha, string> = {
  'Tráfego Pago': 'TP',
  'Feriado': 'FE',
  'Lançamento': 'LA',
  'Promoção': 'PR',
  'Data Comemorativa': 'DC',
  'Outro': 'OU',
}
