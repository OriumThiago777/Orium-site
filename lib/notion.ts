/* eslint-disable @typescript-eslint/no-explicit-any */

// Boilerplate centralizado da API do Notion.
// Todas as rotas de API devem usar estas funções em vez de fetch direto.

export const NOTION_HEADERS = {
  'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
}

// Carrega status e código do Notion para as rotas que repassam o erro
// (ex.: biblioteca devolve o status original; clientes sanitiza a mensagem).
export class NotionError extends Error {
  status: number
  code?: string
  constructor(status: number, message: string, code?: string) {
    super(message)
    this.name = 'NotionError'
    this.status = status
    this.code = code
  }
}

async function notionFetch(path: string, init?: RequestInit): Promise<any> {
  const res = await fetch(`https://api.notion.com/v1/${path}`, {
    ...init,
    headers: NOTION_HEADERS,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new NotionError(
      res.status,
      typeof data?.message === 'string' ? data.message : `Notion API respondeu ${res.status} em ${path}`,
      typeof data?.code === 'string' ? data.code : undefined,
    )
  }
  return data
}

/** POST /v1/databases/{id}/query */
export async function notionQuery(databaseId: string, body: object): Promise<any> {
  return notionFetch(`databases/${databaseId}/query`, { method: 'POST', body: JSON.stringify(body) })
}

/** POST /v1/pages */
export async function notionCreate(body: object): Promise<any> {
  return notionFetch('pages', { method: 'POST', body: JSON.stringify(body) })
}

/** PATCH /v1/pages/{id} */
export async function notionPatch(pageId: string, body: object): Promise<any> {
  return notionFetch(`pages/${pageId}`, { method: 'PATCH', body: JSON.stringify(body) })
}

/** GET /v1/pages/{id} */
export async function notionGetPage(pageId: string): Promise<any> {
  return notionFetch(`pages/${pageId}`)
}

/** GET /v1/databases/{id} */
export async function notionGetDatabase(databaseId: string): Promise<any> {
  return notionFetch(`databases/${databaseId}`)
}

/** POST /v1/databases/{id}/query, paginando até esgotar has_more. Retorna todas as páginas. */
export async function notionQueryDatabase(databaseId: string, body: object = {}): Promise<any[]> {
  const results: any[] = []
  let cursor: string | undefined
  do {
    const data = await notionQuery(databaseId, cursor ? { ...body, start_cursor: cursor } : body)
    results.push(...(data.results ?? []))
    cursor = data.has_more ? data.next_cursor : undefined
  } while (cursor)
  return results
}

/** PATCH /v1/pages/{id} — atualiza uma única propriedade checkbox */
export async function notionUpdatePageCheckbox(pageId: string, propertyName: string, value: boolean): Promise<any> {
  return notionPatch(pageId, { properties: { [propertyName]: { checkbox: value } } })
}
