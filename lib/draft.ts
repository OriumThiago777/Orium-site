import { useEffect, useRef, useState } from 'react'

const PREFIX = 'orium_draft_'
const DEBOUNCE_MS = 1000
const MAX_AGE_MS = 24 * 60 * 60 * 1000

const timers: Record<string, ReturnType<typeof setTimeout>> = {}

export function saveDraft(tool: string, data: object): void {
  if (timers[tool]) clearTimeout(timers[tool])
  timers[tool] = setTimeout(() => {
    delete timers[tool]
    try {
      localStorage.setItem(PREFIX + tool, JSON.stringify({ data, savedAt: Date.now() }))
    } catch { /* localStorage cheio ou indisponível — rascunho é best-effort */ }
  }, DEBOUNCE_MS)
}

export function loadDraft<T = object>(tool: string): { data: T; savedAt: number } | null {
  try {
    const raw = localStorage.getItem(PREFIX + tool)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.data || !parsed?.savedAt || Date.now() - parsed.savedAt > MAX_AGE_MS) {
      localStorage.removeItem(PREFIX + tool)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function clearDraft(tool: string): void {
  if (timers[tool]) {
    clearTimeout(timers[tool])
    delete timers[tool]
  }
  try {
    localStorage.removeItem(PREFIX + tool)
  } catch { /* ignora */ }
}

/**
 * Auto-save de rascunho para os wizards das ferramentas internas.
 *
 * - Só ativa quando `enabled` (ex.: após autenticação; desligado em edição via ?doc=)
 * - Não grava o estado pristino (comparado ao snapshot do primeiro render ativo)
 * - Não grava enquanto o banner de retomada está aberto (não sobrescreve o rascunho)
 * - `concluir()` deve ser chamado no submit final: limpa o rascunho e rebaseia o
 *   snapshot para o estado atual, para o auto-save não recriar o rascunho em seguida
 */
export function useDraft<T extends object>(
  tool: string,
  data: T,
  applyDraft: (data: T) => void,
  enabled: boolean,
) {
  const [draft, setDraft] = useState<{ data: T; savedAt: number } | null>(null)
  const checked = useRef(false)
  const baseline = useRef('')
  const lastSaved = useRef('')
  const dataRef = useRef(data)
  dataRef.current = data

  useEffect(() => {
    if (!enabled || checked.current) return
    checked.current = true
    baseline.current = JSON.stringify(dataRef.current)
    const existente = loadDraft<T>(tool)
    if (existente) setDraft(existente)
  }, [enabled, tool])

  useEffect(() => {
    if (!checked.current || draft) return
    const json = JSON.stringify(data)
    if (json === baseline.current || json === lastSaved.current) return
    lastSaved.current = json
    saveDraft(tool, data)
  })

  function retomar() {
    if (draft) {
      applyDraft(draft.data)
      lastSaved.current = JSON.stringify(draft.data)
    }
    setDraft(null)
  }

  function descartar() {
    clearDraft(tool)
    setDraft(null)
  }

  function concluir() {
    clearDraft(tool)
    baseline.current = JSON.stringify(dataRef.current)
    lastSaved.current = ''
    setDraft(null)
  }

  return { draft, retomar, descartar, concluir }
}
