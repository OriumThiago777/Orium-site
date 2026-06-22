import { NextResponse } from 'next/server'
import { notionCreate, notionQuery } from '@/lib/notion'
import {
  CLIENTES_PORTAL,
  isClienteSlug,
  ultimoDiaDoMes,
  type CalendarioClienteItem,
} from '@/lib/clientes-calendario'

const DB_CALENDARIO = process.env.NOTION_DB_CALENDARIO

type NotionCalendarioPage = {
  id: string
  properties: Record<string, {
    title?: Array<{ plain_text: string }>
    rich_text?: Array<{ plain_text: string }>
    select?: { name: string } | null
    date?: { start: string } | null
  }>
}

export const revalidate = 60

const CACHE_HEADERS = { 'Cache-Control': 'private, max-age=60, stale-while-revalidate=120' }

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  if (!isClienteSlug(slug)) {
    return NextResponse.json({ error: 'Cliente nao encontrado', configured: false, items: [] }, { status: 404 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const mes = searchParams.get('mes')

    if (!DB_CALENDARIO) {
      return NextResponse.json({ items: [], configured: false })
    }

    const filtroCliente = { property: 'Cliente', select: { equals: CLIENTES_PORTAL[slug] } }
    const body: Record<string, unknown> = {
      sorts: [{ property: 'Data', direction: 'ascending' }],
      filter: mes
        ? {
            and: [
              filtroCliente,
              { property: 'Data', date: { on_or_after: `${mes}-01` } },
              { property: 'Data', date: { on_or_before: ultimoDiaDoMes(mes) } },
            ],
          }
        : filtroCliente,
    }

    const data = await notionQuery(DB_CALENDARIO, body)
    const items: CalendarioClienteItem[] = ((data.results ?? []) as NotionCalendarioPage[]).map(page => ({
      id: page.id,
      titulo: page.properties['Título']?.title?.[0]?.plain_text || '',
      cliente: slug,
      data: page.properties.Data?.date?.start || '',
      formato: page.properties.Formato?.select?.name || '',
      quemGrava: page.properties['Quem Grava']?.select?.name || '',
      sobre: page.properties.Sobre?.rich_text?.[0]?.plain_text || '',
      criadoPor: page.properties['Criado Por']?.select?.name || '',
      status: page.properties.Status?.select?.name || '',
      observacoes: page.properties['Observações']?.rich_text?.[0]?.plain_text || '',
    }))

    return NextResponse.json({ items, configured: true }, { headers: CACHE_HEADERS })
  } catch (err) {
    console.error('GET /api/clientes/[slug]/calendario:', err)
    return NextResponse.json({ items: [], configured: false })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  if (!isClienteSlug(slug)) {
    return NextResponse.json({ error: 'Cliente nao encontrado' }, { status: 404 })
  }

  try {
    const { titulo, data, formato, quemGrava, sobre, criadoPor, status, observacoes } = await request.json()

    if (!DB_CALENDARIO) {
      return NextResponse.json({ success: false, error: 'Calendario nao configurado' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ success: false, error: 'Data obrigatoria' }, { status: 400 })
    }

    const created = await notionCreate({
      parent: { database_id: DB_CALENDARIO },
      properties: {
        Título: { title: [{ text: { content: String(titulo || 'Sem título') } }] },
        Cliente: { select: { name: CLIENTES_PORTAL[slug] } },
        Data: { date: { start: String(data) } },
        Formato: { select: { name: String(formato || 'Reels') } },
        'Quem Grava': { select: { name: String(quemGrava || 'Equipe') } },
        Sobre: { rich_text: [{ text: { content: String(sobre || '') } }] },
        'Criado Por': { select: { name: String(criadoPor || 'Cliente') } },
        Status: { select: { name: String(status || 'Planejado') } },
        Observações: { rich_text: [{ text: { content: String(observacoes || '') } }] },
      },
    })

    return NextResponse.json({ success: true, id: created.id })
  } catch (err) {
    console.error('POST /api/clientes/[slug]/calendario:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
