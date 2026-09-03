import { NextResponse } from 'next/server'
import { verificarToken, respostaNaoAutorizada } from '@/lib/api-auth'
import { notionQuery } from '@/lib/notion'
import type { EventoCalendario } from '@/app/calendario/types'

const DB_CALENDARIO = process.env.NOTION_DB_CALENDARIO

type NotionEventoPage = {
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
    const inicio = searchParams.get('inicio')
    const fim = searchParams.get('fim')
    const cliente = searchParams.get('cliente')

    if (!inicio || !fim) {
      return NextResponse.json({ error: 'Parâmetros "inicio" e "fim" são obrigatórios' }, { status: 400 })
    }
    if (!DB_CALENDARIO) return NextResponse.json({ eventos: [] })

    const filtros: unknown[] = [
      { property: 'Data', date: { on_or_after: inicio } },
      { property: 'Data', date: { on_or_before: fim } },
    ]
    if (cliente) filtros.push({ property: 'Cliente', select: { equals: cliente } })

    const data = await notionQuery(DB_CALENDARIO, {
      filter: { and: filtros },
      sorts: [
        { property: 'Data', direction: 'ascending' },
        { timestamp: 'created_time', direction: 'ascending' },
      ],
    })

    const eventos: EventoCalendario[] = (data.results ?? []).map((page: NotionEventoPage) => ({
      id: page.id,
      titulo: page.properties['Título']?.title?.[0]?.plain_text || '',
      cliente: page.properties['Cliente']?.select?.name || '',
      formato: page.properties['Formato']?.select?.name || '',
      tipo: page.properties['Tipo']?.select?.name || '',
      status: page.properties['Status']?.select?.name || '',
      data: page.properties['Data']?.date?.start || '',
      legenda: page.properties['Legenda']?.rich_text?.[0]?.plain_text || '',
    }))

    return NextResponse.json({ eventos })
  } catch (err) {
    console.error('GET /api/calendario/eventos:', err)
    return NextResponse.json({ eventos: [] }, { status: 500 })
  }
}
