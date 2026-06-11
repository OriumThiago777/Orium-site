import { NextResponse } from 'next/server'
import { verificarToken, respostaNaoAutorizada } from '@/lib/api-auth'
import { notionQuery, notionCreate, notionPatch } from '@/lib/notion'

const DB_LEADS = process.env.NOTION_DB_LEADS

type Lead = {
  id: string
  nome: string
  segmento: string
  segmentoCor: string
  instagram: string
  email: string
  necessidade: string
  status: string
  data: string
}

type NotionLeadPage = {
  id: string
  created_time: string
  properties: Record<string, {
    title?: Array<{ plain_text: string }>
    rich_text?: Array<{ plain_text: string }>
    select?: { name: string; color: string } | null
    email?: string | null
  }>
}

export async function GET(request: Request) {
  if (!verificarToken(request)) return respostaNaoAutorizada()
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const segmento = searchParams.get('segmento')

    if (!DB_LEADS) return NextResponse.json({ leads: [] })

    const filters: Record<string, unknown>[] = []
    if (status) filters.push({ property: 'Status', select: { equals: status } })
    if (segmento) filters.push({ property: 'Segmento', select: { equals: segmento } })

    const body: Record<string, unknown> = {
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    }
    if (filters.length === 1) body.filter = filters[0]
    else if (filters.length > 1) body.filter = { and: filters }

    const data = await notionQuery(DB_LEADS, body)
    const leads: Lead[] = (data.results ?? []).map((page: NotionLeadPage) => ({
      id: page.id,
      nome: page.properties['Nome']?.title?.[0]?.plain_text || '',
      segmento: page.properties['Segmento']?.select?.name || '',
      segmentoCor: page.properties['Segmento']?.select?.color || 'default',
      instagram: page.properties['Instagram']?.rich_text?.[0]?.plain_text || '',
      email: page.properties['Email']?.email || '',
      necessidade: page.properties['Necessidade']?.rich_text?.[0]?.plain_text || '',
      status: page.properties['Status']?.select?.name || 'Novo',
      data: page.created_time,
    }))

    return NextResponse.json({ leads })
  } catch (err) {
    console.error('GET /api/leads:', err)
    return NextResponse.json({ leads: [] })
  }
}

export async function PATCH(request: Request) {
  if (!verificarToken(request)) return respostaNaoAutorizada()
  try {
    const { pageId, status } = await request.json()
    if (!pageId || !status) return NextResponse.json({ success: false }, { status: 400 })

    await notionPatch(pageId, {
      properties: {
        'Status': { select: { name: String(status) } },
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PATCH /api/leads:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { nome, segmento, instagram, email, necessidade } = await request.json()

    if (!DB_LEADS) return NextResponse.json({ success: true })

    await notionCreate({
      parent: { database_id: DB_LEADS },
      properties: {
        'Nome': { title: [{ text: { content: String(nome || 'Sem nome') } }] },
        'Segmento': { select: { name: String(segmento || 'Outro') } },
        'Instagram': { rich_text: [{ text: { content: String(instagram || '') } }] },
        'Email': { email: email || null },
        'Necessidade': { rich_text: [{ text: { content: String(necessidade || '') } }] },
        'Status': { select: { name: 'Novo' } },
        'Origem': { select: { name: 'Site' } },
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('POST /api/leads:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
