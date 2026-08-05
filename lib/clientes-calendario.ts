export type ClienteSlug =
  | 'altemans'
  | 'marcelo'
  | 'marcelo-felix'
  | 'cortex'
  | 'ekipar'
  | 'ag'

export const CLIENTES_PORTAL: Record<ClienteSlug, string> = {
  altemans: 'Altemans Barbearia',
  marcelo: 'Prof. Marcelo Félix',
  'marcelo-felix': 'Prof. Marcelo Félix',
  cortex: 'Córtex Hub',
  ekipar: 'Ekipar Acessórios',
  ag: 'AG - Ensino Personalizado',
}

export function isClienteSlug(slug: string): slug is ClienteSlug {
  return slug in CLIENTES_PORTAL
}

export const FORMATO_OPTIONS = [
  'Reels',
  'Carrossel',
  'Story',
  'Post estático',
  'Vídeo curto',
  'Outro',
] as const

export const FORMATO_COLORS: Record<string, string> = {
  Reels: '#FF6B00',
  Carrossel: '#2563EB',
  'Post Estático': '#16A34A',
  'Post estático': '#16A34A',
  Story: '#9333EA',
  'Vídeo curto': '#CA8A04',
  BTS: '#CA8A04',
  'Ao Vivo': '#DC2626',
  Outro: '#6B7280',
}

export const QUEM_GRAVA_OPTIONS = ['ORIUM', 'Cliente', 'Dono', 'Equipe', 'A definir'] as const

export const CRIADO_POR_OPTIONS = ['ORIUM', 'Cliente'] as const

export const STATUS_OPTIONS = ['Ideia', 'Planejado', 'Em produção', 'Em revisão', 'Aprovado', 'Publicado'] as const

export const STATUS_ICON: Record<string, string> = {
  Ideia: '\u25cb',
  Planejado: '\u25cb',
  'Em produção': '\u25cf',
  'Em revisão': '\u25c9',
  Pronto: '\u25c9',
  Aprovado: '\u2713',
  Publicado: '\u2713',
}

export type CalendarioClienteItem = {
  id: string
  titulo: string
  cliente: string
  data: string
  formato: string
  quemGrava: string
  sobre: string
  criadoPor: string
  status: string
  observacoes: string
}

export const MESES_NOMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
  )
}

export function startOfWeek(d: Date): Date {
  const r = new Date(d)
  r.setDate(r.getDate() - r.getDay())
  r.setHours(0, 0, 0, 0)
  return r
}

export function gerarGradeMensal(currentDate: Date): Date[] {
  const inicio = startOfWeek(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(inicio)
    d.setDate(d.getDate() + i)
    return d
  })
}

export function ultimoDiaDoMes(mes: string): string {
  const [ano, m] = mes.split('-').map(Number)
  const ultimo = new Date(ano, m, 0).getDate()
  return `${mes}-${String(ultimo).padStart(2, '0')}`
}
