import { NextRequest, NextResponse } from 'next/server'
import { notionQuery, notionCreate, notionPatch, NotionError } from '@/lib/notion'

const NOTION_TOKEN = process.env.NOTION_TOKEN
const NOTION_DB = process.env.NOTION_DB_BIBLIOTECA

function extractText(prop: { rich_text?: { plain_text: string }[] } | undefined): string {
  return prop?.rich_text?.map(r => r.plain_text).join('') ?? ''
}

function extractTitle(prop: { title?: { plain_text: string }[] } | undefined): string {
  return prop?.title?.map(r => r.plain_text).join('') ?? ''
}

function extractSelect(prop: { select?: { name: string } | null } | undefined): string {
  return prop?.select?.name ?? ''
}

function extractMultiSelect(prop: { multi_select?: { name: string }[] } | undefined): string[] {
  return prop?.multi_select?.map(s => s.name) ?? []
}

function extractUrl(prop: { url?: string | null } | undefined): string {
  return prop?.url ?? ''
}

function extractDate(prop: { date?: { start: string } | null } | undefined): string {
  return prop?.date?.start ?? ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPage(page: any) {
  const p = page.properties
  return {
    id: page.id,
    nome: extractTitle(p['Nome']),
    segmento: extractSelect(p['Segmento']),
    tipo: extractSelect(p['Tipo']),
    fonte: extractSelect(p['Fonte']),
    link: extractUrl(p['Link']),
    thumbnail: extractUrl(p['Thumbnail']),
    cliente: extractText(p['Cliente']),
    tags: extractMultiSelect(p['Tags']),
    notas: extractText(p['Notas']),
    data: extractDate(p['Data']),
  }
}

export async function GET(req: NextRequest) {
  if (!NOTION_TOKEN || !NOTION_DB) {
    return NextResponse.json({ error: 'Credenciais não configuradas' }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const segmento = searchParams.get('segmento')
  const tipo = searchParams.get('tipo')

  const filter: { and: { property: string; select: { equals: string } }[] } = { and: [] }
  if (segmento) filter.and.push({ property: 'Segmento', select: { equals: segmento } })
  if (tipo) filter.and.push({ property: 'Tipo', select: { equals: tipo } })

  const body: Record<string, unknown> = {
    sorts: [{ property: 'Data', direction: 'descending' }],
    page_size: 100,
  }
  if (filter.and.length === 1) Object.assign(body, { filter: filter.and[0] })
  else if (filter.and.length > 1) Object.assign(body, { filter })

  try {
    const data = await notionQuery(NOTION_DB, body)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(data.results.map((p: any) => mapPage(p)))
  } catch (err) {
    if (err instanceof NotionError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error('Biblioteca GET error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!NOTION_TOKEN || !NOTION_DB) {
    return NextResponse.json({ error: 'Credenciais não configuradas' }, { status: 500 })
  }
  try {
    const { nome, segmento, tipo, fonte, link, thumbnail, cliente, tags, notas, data } = await req.json()

    const properties: Record<string, unknown> = {
      'Nome': { title: [{ text: { content: nome ?? '' } }] },
    }
    if (segmento) properties['Segmento'] = { select: { name: segmento } }
    if (tipo) properties['Tipo'] = { select: { name: tipo } }
    if (fonte) properties['Fonte'] = { select: { name: fonte } }
    if (link) properties['Link'] = { url: link }
    if (thumbnail) properties['Thumbnail'] = { url: thumbnail }
    if (cliente) properties['Cliente'] = { rich_text: [{ text: { content: cliente } }] }
    if (tags?.length) properties['Tags'] = { multi_select: tags.map((t: string) => ({ name: t })) }
    if (notas) properties['Notas'] = { rich_text: [{ text: { content: notas } }] }
    if (data) properties['Data'] = { date: { start: data } }

    const result = await notionCreate({ parent: { database_id: NOTION_DB }, properties })
    return NextResponse.json({ success: true, id: result.id })
  } catch (err) {
    if (err instanceof NotionError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error('Biblioteca POST error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!NOTION_TOKEN) {
    return NextResponse.json({ error: 'Credenciais não configuradas' }, { status: 500 })
  }
  try {
    const id = new URL(req.url).searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })

    await notionPatch(id, { archived: true })
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof NotionError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error('Biblioteca DELETE error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
