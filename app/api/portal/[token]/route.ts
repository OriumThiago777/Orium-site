import { NextResponse } from 'next/server'
import { notionQuery, NotionError } from '@/lib/notion'

const DB_CLIENTES = process.env.NOTION_DB_CLIENTES
const DB_DOCUMENTOS = process.env.NOTION_DB_DOCUMENTOS
const DB_CALENDARIO = process.env.NOTION_DB_CALENDARIO

const ETAPAS = [
  'Raio-X', 'Briefing', 'Proposta', 'Contrato',
  'Calendário', 'Relatório', 'Checklist',
] as const

type ClientePage = {
  properties: {
    Nome?: { title?: Array<{ plain_text: string }> }
    'Fase Atual'?: { select?: { name: string } | null }
  }
}

type DocumentoPage = {
  properties: {
    Tipo?: { select?: { name: string } | null }
    Nome?: { title?: Array<{ plain_text: string }> }
    'Data de Geração'?: { date?: { start: string } | null }
    'Link Drive'?: { url?: string | null }
  }
}

type CalendarioPage = {
  properties: {
    Título?: { title?: Array<{ plain_text: string }> }
    Data?: { date?: { start: string } | null }
    Status?: { select?: { name: string } | null }
    Tipo?: { select?: { name: string } | null }
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params
    if (!DB_CLIENTES) {
      return NextResponse.json({ error: 'Configuração incompleta' }, { status: 500 })
    }

    let clienteData
    try {
      clienteData = await notionQuery(DB_CLIENTES, {
        filter: { property: 'Token Portal', rich_text: { equals: token } },
      })
    } catch (err) {
      if (err instanceof NotionError) {
        console.error('GET /api/portal/[token] — cliente:', err.message)
        return NextResponse.json({ error: 'Erro ao buscar cliente' }, { status: 500 })
      }
      throw err
    }

    const clientePage = (clienteData.results ?? [])[0] as ClientePage | undefined
    if (!clientePage) {
      return NextResponse.json({ error: 'Portal não encontrado' }, { status: 404 })
    }

    const nome = clientePage.properties.Nome?.title?.[0]?.plain_text?.trim() || ''
    const faseAtual = clientePage.properties['Fase Atual']?.select?.name || ''
    const hoje = new Date().toISOString().slice(0, 10)

    const [documentosResult, calendarioResult] = await Promise.allSettled([
      DB_DOCUMENTOS
        ? notionQuery(DB_DOCUMENTOS, {
            filter: { property: 'Cliente', rich_text: { equals: nome } },
            sorts: [{ property: 'Data de Geração', direction: 'descending' }],
            page_size: 100,
          })
        : Promise.resolve({ results: [] }),
      DB_CALENDARIO
        ? notionQuery(DB_CALENDARIO, {
            filter: {
              and: [
                { property: 'Cliente', select: { equals: nome } },
                { property: 'Data', date: { on_or_after: hoje } },
                { property: 'Status', select: { does_not_equal: 'Publicado' } },
              ],
            },
            sorts: [{ property: 'Data', direction: 'ascending' }],
            page_size: 5,
          })
        : Promise.resolve({ results: [] }),
    ])

    const docs = documentosResult.status === 'fulfilled' ? (documentosResult.value.results ?? []) as DocumentoPage[] : []

    const docMap = new Map<string, string | null>()
    for (const doc of docs) {
      const tipo = doc.properties.Tipo?.select?.name
      if (!tipo) continue
      const link = doc.properties['Link Drive']?.url ?? null
      if (!docMap.has(tipo) || (docMap.get(tipo) === null && link)) {
        docMap.set(tipo, link)
      }
    }
    const etapas = ETAPAS.map(etapaNome => ({
      nome: etapaNome,
      concluida: docMap.has(etapaNome),
      linkDrive: docMap.get(etapaNome) ?? null,
    }))
    const concluidas = etapas.filter(e => e.concluida).length
    const progresso = { etapas, total: 7, concluidas, percentual: Math.round((concluidas / 7) * 100) }

    const documentos = docs.map(doc => ({
      tipo: doc.properties.Tipo?.select?.name || '',
      nome: doc.properties.Nome?.title?.[0]?.plain_text || '',
      data: doc.properties['Data de Geração']?.date?.start || '',
      linkDrive: doc.properties['Link Drive']?.url || '',
    }))

    const calendario = calendarioResult.status === 'fulfilled'
      ? (calendarioResult.value.results ?? []).map((page: CalendarioPage) => ({
          titulo: page.properties.Título?.title?.[0]?.plain_text || '',
          data: page.properties.Data?.date?.start || '',
          status: page.properties.Status?.select?.name || '',
          tipo: page.properties.Tipo?.select?.name || '',
        }))
      : []

    if (documentosResult.status === 'rejected') console.error('GET /api/portal/[token] — documentos:', documentosResult.reason)
    if (calendarioResult.status === 'rejected') console.error('GET /api/portal/[token] — calendario:', calendarioResult.reason)

    return NextResponse.json({
      cliente: { nome, faseAtual },
      progresso,
      documentos,
      proximasEntregas: calendario,
      atualizadoEm: new Date().toISOString(),
    })
  } catch (err) {
    console.error('GET /api/portal/[token]:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
