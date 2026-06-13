export type OrdenarPor = 'nome' | 'dataInicio' | 'proximoDeliverable' | 'valorMensal'

export type Cliente = {
  id: string
  nome: string
  status: 'Ativo' | 'Inativo' | 'Proposta' | string
  faseAtual: 'Diagnóstico' | 'Estruturação Inicial' | 'Conteúdo e Comunicação' | 'Expansão Digital' | 'Pausado' | 'Finalizado' | string
  instagram: string
  email: string
  contato: string
  dataInicio: string
  dataTermino: string
  ultimaInteracao: string
  proximoDeliverable: string
  precisaRelatorio: boolean
  notas: string
  valorMensal: number | null
}

export type Atividade = {
  id: string
  clienteId: string
  clienteNome: string
  tipo: string
  descricao: string
  data: string
}

export type ProgressoData = {
  etapas: Array<{ nome: string; concluida: boolean; linkDrive: string | null }>
  total: number
  concluidas: number
  percentual: number
}

export type HealthScore = {
  cor: 'verde' | 'amarelo' | 'vermelho'
  motivos: string[]
}

export type Lead = {
  id: string
  nome: string
  segmento: string
  segmentoCor: string
  instagram: string
  email: string
  necessidade: string
  status: string
  data: string
}

export type CalendarioItem = {
  id: string
  titulo: string
  cliente: string
  tipo: string
  status: string
  data: string
  descricao: string
  legenda: string
  participantes: string
  pauta: string
  linkReuniao: string
  duracaoReuniao: string
  tipoGravacao: string
  roteiroGravacao: string
  localGravacao: string
  equipamentoGravacao: string
}
