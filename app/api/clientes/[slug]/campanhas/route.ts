import { NextResponse } from 'next/server'
import { notionCreate, notionQuery } from '@/lib/notion'
import { isClienteSlug } from '@/lib/clientes-calendario'
import type { Campanha, PlataformaCampanha, StatusCampanha, TipoCampanha } from '@/lib/tipos-campanhas'

const DB_CAMPANHAS = process.env.NOTION_DB_CAMPANHAS

type NotionCampanhaPage = {
  id: string
  properties: Record<string, {
    title?: Array<{ plain_text: string }>
    rich_text?: Array<{ plain_text: string }>
    select?: { name: string } | null
    multi_select?: Array<{ name: string }>
    date?: { start: string } | null
  }>
}

function mapPageToCampanha(page: NotionCampanhaPage): Campanha {
  return {
    id: page.id,
    titulo: page.properties['Título']?.title?.[0]?.plain_text || '',
    tipo: (page.properties['Tipo']?.select?.name || 'Outro') as TipoCampanha,
    dataInicio: page.properties['Data Início']?.date?.start ?? '',
    dataFim: page.properties['Data Fim']?.date?.start ?? '',
    objetivo: page.properties['Objetivo']?.rich_text?.[0]?.plain_text || '',
    orcamento: page.properties['Orçamento']?.rich_text?.[0]?.plain_text || '',
    plataformas: (page.properties['Plataformas']?.multi_select ?? []).map(p => p.name as PlataformaCampanha),
    status: (page.properties['Status']?.select?.name || 'Planejada') as StatusCampanha,
    observacoes: page.properties['Observações']?.rich_text?.[0]?.plain_text || '',
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  if (!isClienteSlug(slug)) {
    return NextResponse.json({ error: 'Cliente nao encontrado' }, { status: 404 })
  }

  if (!DB_CAMPANHAS) {
    return NextResponse.json([], { status: 200 })
  }

  try {
    const body = {
      filter: { property: 'Cliente', select: { equals: slug } },
      sorts: [{ property: 'Data Início', direction: 'descending' as const }],
    }

    const data = await notionQuery(DB_CAMPANHAS, body)
    const campanhas: Campanha[] = ((data.results ?? []) as NotionCampanhaPage[]).map(mapPageToCampanha)

    return NextResponse.json(campanhas)
  } catch (err) {
    console.error('GET /api/clientes/[slug]/campanhas:', err)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  if (!isClienteSlug(slug)) {
    return NextResponse.json({ error: 'Cliente nao encontrado' }, { status: 404 })
  }

  if (!DB_CAMPANHAS) {
    return NextResponse.json({ success: false, error: 'Campanhas nao configurado' }, { status: 500 })
  }

  try {
    const { titulo, tipo, dataInicio, dataFim, objetivo, orcamento, plataformas, status, observacoes } = await request.json()

    if (!titulo || !tipo || !dataInicio || !dataFim) {
      return NextResponse.json({ success: false, error: 'Campos obrigatorios ausentes' }, { status: 400 })
    }

    const created = await notionCreate({
      parent: { database_id: DB_CAMPANHAS },
      properties: {
        Título: { title: [{ text: { content: String(titulo) } }] },
        Cliente: { select: { name: slug } },
        Tipo: { select: { name: String(tipo) } },
        'Data Início': { date: { start: String(dataInicio) } },
        'Data Fim': { date: { start: String(dataFim) } },
        Objetivo: { rich_text: [{ text: { content: String(objetivo || '') } }] },
        Orçamento: { rich_text: [{ text: { content: String(orcamento || '') } }] },
        Plataformas: { multi_select: (Array.isArray(plataformas) ? plataformas : []).map((p: string) => ({ name: p })) },
        Status: { select: { name: String(status || 'Planejada') } },
        Observações: { rich_text: [{ text: { content: String(observacoes || '') } }] },
      },
    })

    return NextResponse.json({ success: true, id: created.id })
  } catch (err) {
    console.error('POST /api/clientes/[slug]/campanhas:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
