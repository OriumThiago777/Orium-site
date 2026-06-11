import { NextResponse } from 'next/server'
import { verificarToken, respostaNaoAutorizada } from '@/lib/api-auth'

const NOTION_TOKEN = process.env.NOTION_TOKEN
const DB_CALENDARIO = process.env.NOTION_DB_CALENDARIO

const NH = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Content-Type': 'application/json',
  'Notion-Version': '2022-06-28',
}

type CalendarioItem = {
  id: string
  titulo: string
  cliente: string
  tipo: string
  status: string
  data: string
  descricao: string
  legenda: string
  participantes: string
  pauta: string
  linkReuniao: string
  duracaoReuniao: string
  tipoGravacao: string
  roteiroGravacao: string
  localGravacao: string
  equipamentoGravacao: string
}

type NotionCalendarioPage = {
  id: string
  properties: Record<string, {
    title?: Array<{ plain_text: string }>
    rich_text?: Array<{ plain_text: string }>
    select?: { name: string } | null
    date?: { start: string } | null
  }>
}

function ultimoDiaDoMes(mes: string): string {
  const [ano, m] = mes.split('-').map(Number)
  const ultimo = new Date(ano, m, 0).getDate()
  return `${mes}-${String(ultimo).padStart(2, '0')}`
}

export async function GET(request: Request) {
  if (!verificarToken(request)) return respostaNaoAutorizada()
  try {
    const { searchParams } = new URL(request.url)
    const mes = searchParams.get('mes')

    if (!DB_CALENDARIO) return NextResponse.json({ items: [] })

    const body: Record<string, unknown> = {
      sorts: [{ property: 'Data', direction: 'ascending' }],
    }
    if (mes) {
      body.filter = {
        and: [
          { property: 'Data', date: { on_or_after: `${mes}-01` } },
          { property: 'Data', date: { on_or_before: ultimoDiaDoMes(mes) } },
        ],
      }
    }

    const res = await fetch(`https://api.notion.com/v1/databases/${DB_CALENDARIO}/query`, {
      method: 'POST',
      headers: NH,
      body: JSON.stringify(body),
    })
    if (!res.ok) return NextResponse.json({ items: [] })

    const data = await res.json()
    const items: CalendarioItem[] = (data.results ?? []).map((page: NotionCalendarioPage) => ({
      id: page.id,
      titulo: page.properties['Título']?.title?.[0]?.plain_text || '',
      cliente: page.properties['Cliente']?.select?.name || '',
      tipo: page.properties['Tipo']?.select?.name || '',
      status: page.properties['Status']?.select?.name || '',
      data: page.properties['Data']?.date?.start || '',
      descricao: page.properties['Descrição']?.rich_text?.[0]?.plain_text || '',
      legenda: page.properties['Legenda']?.rich_text?.[0]?.plain_text || '',
      participantes: page.properties['Participantes']?.rich_text?.[0]?.plain_text || '',
      pauta: page.properties['Pauta']?.rich_text?.[0]?.plain_text || '',
      linkReuniao: page.properties['Link Reunião']?.rich_text?.[0]?.plain_text || '',
      duracaoReuniao: page.properties['Duração Reunião']?.rich_text?.[0]?.plain_text || '',
      tipoGravacao: page.properties['Tipo Gravação']?.rich_text?.[0]?.plain_text || '',
      roteiroGravacao: page.properties['Roteiro Gravação']?.rich_text?.[0]?.plain_text || '',
      localGravacao: page.properties['Local Gravação']?.rich_text?.[0]?.plain_text || '',
      equipamentoGravacao: page.properties['Equipamento Gravação']?.rich_text?.[0]?.plain_text || '',
    }))

    return NextResponse.json({ items })
  } catch (err) {
    console.error('GET /api/clientes/calendario:', err)
    return NextResponse.json({ items: [] })
  }
}

export async function POST(request: Request) {
  if (!verificarToken(request)) return respostaNaoAutorizada()
  try {
    const {
      titulo, cliente, tipo, status, data, descricao, legenda,
      participantes, pauta, linkReuniao, duracaoReuniao,
      tipoGravacao, roteiroGravacao, localGravacao, equipamentoGravacao,
    } = await request.json()

    if (!DB_CALENDARIO) return NextResponse.json({ success: true })

    const res = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: NH,
      body: JSON.stringify({
        parent: { database_id: DB_CALENDARIO },
        properties: {
          'Título': { title: [{ text: { content: String(titulo || 'Sem título') } }] },
          'Cliente': { select: { name: String(cliente || 'Outro') } },
          'Tipo': { select: { name: String(tipo || 'Post Feed') } },
          'Status': { select: { name: String(status || 'Planejado') } },
          'Data': { date: { start: String(data) } },
          'Descrição': { rich_text: [{ text: { content: String(descricao || '') } }] },
          'Legenda': { rich_text: [{ text: { content: String(legenda || '') } }] },
          'Participantes': { rich_text: [{ text: { content: String(participantes || '') } }] },
          'Pauta': { rich_text: [{ text: { content: String(pauta || '') } }] },
          'Link Reunião': { rich_text: [{ text: { content: String(linkReuniao || '') } }] },
          'Duração Reunião': { rich_text: [{ text: { content: String(duracaoReuniao || '') } }] },
          'Tipo Gravação': { rich_text: [{ text: { content: String(tipoGravacao || '') } }] },
          'Roteiro Gravação': { rich_text: [{ text: { content: String(roteiroGravacao || '') } }] },
          'Local Gravação': { rich_text: [{ text: { content: String(localGravacao || '') } }] },
          'Equipamento Gravação': { rich_text: [{ text: { content: String(equipamentoGravacao || '') } }] },
        },
      }),
    })

    if (!res.ok) {
      console.error('Notion POST calendario error:', await res.json())
      return NextResponse.json({ success: false }, { status: 500 })
    }

    const created = await res.json()
    return NextResponse.json({ success: true, id: created.id })
  } catch (err) {
    console.error('POST /api/clientes/calendario:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  if (!verificarToken(request)) return respostaNaoAutorizada()
  try {
    const {
      pageId, titulo, cliente, tipo, status, data, descricao, legenda,
      participantes, pauta, linkReuniao, duracaoReuniao,
      tipoGravacao, roteiroGravacao, localGravacao, equipamentoGravacao,
    } = await request.json()
    if (!pageId) return NextResponse.json({ success: false }, { status: 400 })

    const properties: Record<string, unknown> = {}
    if (titulo !== undefined) properties['Título'] = { title: [{ text: { content: String(titulo) } }] }
    if (cliente !== undefined) properties['Cliente'] = { select: { name: String(cliente) } }
    if (tipo !== undefined) properties['Tipo'] = { select: { name: String(tipo) } }
    if (status !== undefined) properties['Status'] = { select: { name: String(status) } }
    if (data !== undefined) properties['Data'] = { date: { start: String(data) } }
    if (descricao !== undefined) properties['Descrição'] = { rich_text: [{ text: { content: String(descricao) } }] }
    if (legenda !== undefined) properties['Legenda'] = { rich_text: [{ text: { content: String(legenda) } }] }
    if (participantes !== undefined) properties['Participantes'] = { rich_text: [{ text: { content: String(participantes) } }] }
    if (pauta !== undefined) properties['Pauta'] = { rich_text: [{ text: { content: String(pauta) } }] }
    if (linkReuniao !== undefined) properties['Link Reunião'] = { rich_text: [{ text: { content: String(linkReuniao) } }] }
    if (duracaoReuniao !== undefined) properties['Duração Reunião'] = { rich_text: [{ text: { content: String(duracaoReuniao) } }] }
    if (tipoGravacao !== undefined) properties['Tipo Gravação'] = { rich_text: [{ text: { content: String(tipoGravacao) } }] }
    if (roteiroGravacao !== undefined) properties['Roteiro Gravação'] = { rich_text: [{ text: { content: String(roteiroGravacao) } }] }
    if (localGravacao !== undefined) properties['Local Gravação'] = { rich_text: [{ text: { content: String(localGravacao) } }] }
    if (equipamentoGravacao !== undefined) properties['Equipamento Gravação'] = { rich_text: [{ text: { content: String(equipamentoGravacao) } }] }

    const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: 'PATCH',
      headers: NH,
      body: JSON.stringify({ properties }),
    })

    if (!res.ok) {
      console.error('Notion PATCH calendario error:', await res.json())
      return NextResponse.json({ success: false }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PATCH /api/clientes/calendario:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!verificarToken(request)) return respostaNaoAutorizada()
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ success: false }, { status: 400 })

    const res = await fetch(`https://api.notion.com/v1/pages/${id}`, {
      method: 'PATCH',
      headers: NH,
      body: JSON.stringify({ archived: true }),
    })

    if (!res.ok) {
      console.error('Notion DELETE (archive) calendario error:', await res.json())
      return NextResponse.json({ success: false }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/clientes/calendario:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
