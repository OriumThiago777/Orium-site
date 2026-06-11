import { NextResponse } from 'next/server'
import { verificarToken, respostaNaoAutorizada } from '@/lib/api-auth'
import { notionQuery } from '@/lib/notion'

const DB_CALENDARIO = process.env.NOTION_DB_CALENDARIO
const DB_LEADS = process.env.NOTION_DB_LEADS
const DB_CLIENTES = process.env.NOTION_DB_CLIENTES
const DB_DOCUMENTOS = process.env.NOTION_DB_DOCUMENTOS

type NotionPage = {
  id: string
  created_time: string
  last_edited_time: string
  properties: Record<string, {
    title?: Array<{ plain_text: string }>
    rich_text?: Array<{ plain_text: string }>
    select?: { name: string } | null
    date?: { start: string } | null
  }>
}

async function queryDb(dbId: string | undefined, body: Record<string, unknown>): Promise<NotionPage[]> {
  if (!dbId) return []
  try {
    const data = await notionQuery(dbId, body)
    return data.results ?? []
  } catch (err) {
    console.error('Notion query error em hub-status:', err)
    return []
  }
}

function isoLocal(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dia}`
}

async function proximasEntregas() {
  const hoje = new Date()
  const fim = new Date(hoje)
  fim.setDate(fim.getDate() + 7)
  const pages = await queryDb(DB_CALENDARIO, {
    filter: {
      and: [
        { property: 'Data', date: { on_or_after: isoLocal(hoje) } },
        { property: 'Data', date: { on_or_before: isoLocal(fim) } },
        { property: 'Status', select: { does_not_equal: 'Publicado' } },
      ],
    },
    sorts: [{ property: 'Data', direction: 'ascending' }],
    page_size: 5,
  })
  return pages.map(p => ({
    titulo: p.properties['Título']?.title?.[0]?.plain_text || '',
    cliente: p.properties['Cliente']?.select?.name || '',
    data: p.properties['Data']?.date?.start || '',
    status: p.properties['Status']?.select?.name || '',
  }))
}

async function leadsNovos() {
  const pages = await queryDb(DB_LEADS, {
    filter: { property: 'Status', select: { equals: 'Novo' } },
    sorts: [{ timestamp: 'created_time', direction: 'ascending' }],
  })
  return pages.map(p => ({
    nome: p.properties['Nome']?.title?.[0]?.plain_text || '',
    segmento: p.properties['Segmento']?.select?.name || '',
    createdTime: p.created_time,
  }))
}

async function clientesParados() {
  const pages = await queryDb(DB_CLIENTES, {
    filter: { property: 'Status', select: { equals: 'Ativo' } },
    page_size: 100,
  })
  const agora = Date.now()
  return pages
    .map(p => {
      const ultima = p.properties['Última Interação']?.date?.start || p.last_edited_time
      const dias = Math.floor((agora - new Date(ultima).getTime()) / 86400000)
      return { nome: p.properties['Nome']?.title?.[0]?.plain_text || '', diasSemContato: dias }
    })
    .filter(c => c.diasSemContato > 7)
    .sort((a, b) => b.diasSemContato - a.diasSemContato)
}

async function geradoEstaSemana() {
  const hoje = new Date()
  const segunda = new Date(hoje)
  segunda.setDate(hoje.getDate() - ((hoje.getDay() + 6) % 7))
  const pages = await queryDb(DB_DOCUMENTOS, {
    filter: { property: 'Data de Geração', date: { on_or_after: isoLocal(segunda) } },
    page_size: 100,
  })
  const porTipo: Record<string, number> = {}
  for (const p of pages) {
    const tipo = p.properties['Tipo']?.select?.name || 'Outro'
    porTipo[tipo] = (porTipo[tipo] || 0) + 1
  }
  return { total: pages.length, porTipo }
}

export async function GET(request: Request) {
  if (!verificarToken(request)) return respostaNaoAutorizada()
  try {
    const [entregas, leads, clientesSemContato, documentos] = await Promise.all([
      proximasEntregas().catch(() => []),
      leadsNovos().catch(() => []),
      clientesParados().catch(() => []),
      geradoEstaSemana().catch(() => ({ total: 0, porTipo: {} })),
    ])
    return NextResponse.json({ entregas, leads, clientesSemContato, documentos })
  } catch (err) {
    console.error('GET /api/hub-status:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
