import { NextResponse } from 'next/server'
import { verificarToken, respostaNaoAutorizada } from '@/lib/api-auth'
import { notionQuery } from '@/lib/notion'

const DB_DOCUMENTOS = process.env.NOTION_DB_DOCUMENTOS
const DB_ATIVIDADES = process.env.NOTION_DB_ATIVIDADES
const DB_CALENDARIO = process.env.NOTION_DB_CALENDARIO

type NotionPage = {
  properties: Record<string, {
    title?: Array<{ plain_text: string }>
    rich_text?: Array<{ plain_text: string }>
    select?: { name: string } | null
    date?: { start: string } | null
    url?: string | null
  }>
}

function ultimoDiaDoMes(mes: string): string {
  const [ano, m] = mes.split('-').map(Number)
  const ultimoDia = new Date(ano, m, 0).getDate()
  return `${mes}-${String(ultimoDia).padStart(2, '0')}`
}

export async function GET(request: Request) {
  if (!verificarToken(request)) return respostaNaoAutorizada()
  try {
    const { searchParams } = new URL(request.url)
    const cliente = searchParams.get('cliente')
    const mes = searchParams.get('mes')

    if (!cliente || !mes) {
      return NextResponse.json({ error: 'Parâmetros cliente e mes são obrigatórios' }, { status: 400 })
    }

    const inicio = `${mes}-01`
    const fim = ultimoDiaDoMes(mes)

    const [documentosResult, atividadesResult, calendarioResult] = await Promise.allSettled([
      DB_DOCUMENTOS
        ? notionQuery(DB_DOCUMENTOS, {
            filter: {
              and: [
                { property: 'Cliente', rich_text: { equals: cliente } },
                { property: 'Data de Geração', date: { on_or_after: inicio } },
                { property: 'Data de Geração', date: { on_or_before: fim } },
              ],
            },
          })
        : Promise.resolve({ results: [] }),
      DB_ATIVIDADES
        ? notionQuery(DB_ATIVIDADES, {
            filter: {
              and: [
                { property: 'Cliente Nome', title: { equals: cliente } },
                { property: 'Data', date: { on_or_after: inicio } },
                { property: 'Data', date: { on_or_before: fim } },
              ],
            },
          })
        : Promise.resolve({ results: [] }),
      DB_CALENDARIO
        ? notionQuery(DB_CALENDARIO, {
            filter: {
              and: [
                { property: 'Cliente', select: { equals: cliente } },
                { property: 'Data', date: { on_or_after: inicio } },
                { property: 'Data', date: { on_or_before: fim } },
                { property: 'Status', select: { equals: 'Publicado' } },
              ],
            },
          })
        : Promise.resolve({ results: [] }),
    ])

    const documentos = documentosResult.status === 'fulfilled'
      ? (documentosResult.value.results ?? []).map((page: NotionPage) => ({
          tipo: page.properties['Tipo']?.select?.name || '',
          nome: page.properties['Nome']?.title?.[0]?.plain_text || '',
          data: page.properties['Data de Geração']?.date?.start || '',
          linkDrive: page.properties['Link Drive']?.url || '',
        }))
      : []

    const atividades = atividadesResult.status === 'fulfilled'
      ? (atividadesResult.value.results ?? []).map((page: NotionPage) => ({
          descricao: page.properties['Descrição']?.rich_text?.[0]?.plain_text || '',
          data: page.properties['Data']?.date?.start || '',
          tipo: page.properties['Tipo']?.select?.name || '',
        }))
      : []

    const calendario = calendarioResult.status === 'fulfilled'
      ? (calendarioResult.value.results ?? []).map((page: NotionPage) => ({
          titulo: page.properties['Título']?.title?.[0]?.plain_text || '',
          data: page.properties['Data']?.date?.start || '',
          tipo: page.properties['Tipo']?.select?.name || '',
        }))
      : []

    if (documentosResult.status === 'rejected') console.error('GET /api/relatorio/dados — documentos:', documentosResult.reason)
    if (atividadesResult.status === 'rejected') console.error('GET /api/relatorio/dados — atividades:', atividadesResult.reason)
    if (calendarioResult.status === 'rejected') console.error('GET /api/relatorio/dados — calendario:', calendarioResult.reason)

    return NextResponse.json({ documentos, atividades, calendario })
  } catch (err) {
    console.error('GET /api/relatorio/dados:', err)
    return NextResponse.json({ documentos: [], atividades: [], calendario: [] }, { status: 500 })
  }
}
