const PREFIX = 'orium_duplicar_'

const TOOL_ROUTES: Record<string, string> = {
  'Relatório': '/relatorio',
  'Calendário': '/calendario',
  'Checklist': '/checklist',
}

const TOOL_KEYS: Record<string, string> = {
  'Relatório': 'relatorio',
  'Calendário': 'calendario',
  'Checklist': 'checklist',
}

export function getToolUrl(tipo: string, cliente: string): string {
  const base = TOOL_ROUTES[tipo] ?? '/hub'
  return cliente ? `${base}?cliente=${encodeURIComponent(cliente)}` : base
}

export function getToolKey(tipo: string): string | null {
  return TOOL_KEYS[tipo] ?? null
}

export function duplicarDocumento(tipo: string, dados: unknown, cliente: string, router: { push: (url: string) => void }): void {
  const tool = getToolKey(tipo)
  if (tool) {
    try {
      localStorage.setItem(PREFIX + tool, JSON.stringify(dados))
    } catch { /* localStorage indisponível — segue sem pré-preenchimento */ }
  }
  router.push(getToolUrl(tipo, cliente))
}

export function loadDuplicado<T = unknown>(tool: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + tool)
    if (!raw) return null
    localStorage.removeItem(PREFIX + tool)
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}
