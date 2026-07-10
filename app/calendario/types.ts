export type EventoCalendario = {
  id: string
  titulo: string
  cliente: string
  formato: string
  tipo: string
  status: string
  data: string
  legenda: string
}

export const CLIENTES_CALENDARIO = [
  'Altemans Barbearia',
  'Prof. Marcelo Félix',
  'Ekipar Acessórios',
  'ORIUM Interno',
  'Córtex Hub',
  'Outro',
]

export const FORMATO_COLORS: Record<string, string> = {
  'Reels': '#3B82F6',
  'Post Estático': '#8B5CF6',
  'Carrossel': '#10B981',
  'Story': '#EC4899',
  'BTS': '#14B8A6',
  'Ao Vivo': '#DC2626',
  'Vídeo curto': '#06B6D4',
  'Outro': '#9CA3AF',
}

export const FORMATO_FALLBACK_COLOR = '#6B7280'

export function corDoFormato(formato: string): string {
  if (!formato) return FORMATO_FALLBACK_COLOR
  return FORMATO_COLORS[formato] ?? FORMATO_FALLBACK_COLOR
}
