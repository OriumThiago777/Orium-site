import { NextResponse } from 'next/server'
import { verificarToken, respostaNaoAutorizada } from '@/lib/api-auth'
import { notionQuery, notionCreate } from '@/lib/notion'

const DB_ATIVIDADES = process.env.NOTION_DB_ATIVIDADES

type Atividade = {
  id: string
  clienteId: string
  clienteNome: string
  tipo: 'fase_alterada' | 'proposta_gerada' | 'relatorio_gerado' |
        'checklist_gerado' | 'raio_x_gerado' | 'nota_adicionada' |
        'cliente_criado' | 'contrato_gerado'
  descricao: string
  data: string
}

type NotionAtividadePage = {
  id: string
  properties: Record<string, {
    title?: Array<{ plain_text: string }>
    rich_text?: Array<{ plain_text: string }>
    select?: { name: string } | null
    date?: { start: string } | null
  }>
}

export async function GET(request: Request) {
  if (!verificarToken(request)) return respostaNaoAutorizada()
  try {
    const { searchParams } = new URL(request.url)
    const clienteId = searchParams.get('clienteId')

    if (!DB_ATIVIDADES) return NextResponse.json({ atividades: [] })

    const body: Record<string, unknown> = {
      sorts: [{ property: 'Data', direction: 'descending' }],
    }
    if (clienteId) {
      body.filter = { property: 'Cliente ID', rich_text: { equals: clienteId } }
    }

    const data = await notionQuery(DB_ATIVIDADES, body)
    const atividades: Atividade[] = (data.results ?? []).map((page: NotionAtividadePage) => ({
      id: page.id,
      clienteId: page.properties['Cliente ID']?.rich_text?.[0]?.plain_text || '',
      clienteNome: page.properties['Cliente Nome']?.title?.[0]?.plain_text || '',
      tipo: (page.properties['Tipo']?.select?.name || '') as Atividade['tipo'],
      descricao: page.properties['Descrição']?.rich_text?.[0]?.plain_text || '',
      data: page.properties['Data']?.date?.start || '',
    }))

    return NextResponse.json({ atividades })
  } catch (err) {
    console.error('GET /api/atividades:', err)
    return NextResponse.json({ atividades: [] })
  }
}

export async function POST(request: Request) {
  if (!verificarToken(request)) return respostaNaoAutorizada()
  try {
    const body = await request.json()
    const { clienteId, clienteNome, tipo, descricao } = body

    if (!DB_ATIVIDADES) return NextResponse.json({ success: true })

    const data = new Date().toISOString()

    try {
      await notionCreate({
        parent: { database_id: DB_ATIVIDADES },
        properties: {
          'Cliente Nome': { title: [{ text: { content: String(clienteNome || '') } }] },
          'Cliente ID': { rich_text: [{ text: { content: String(clienteId || '') } }] },
          'Tipo': { select: { name: tipo } },
          'Descrição': { rich_text: [{ text: { content: String(descricao || '') } }] },
          'Data': { date: { start: data } },
        },
      })
    } catch (err) {
      console.error('Notion POST atividade error:', err)
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('POST /api/atividades:', err)
    return NextResponse.json({ success: true })
  }
}
