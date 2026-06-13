import { NextResponse } from 'next/server'
import { verificarToken, respostaNaoAutorizada } from '@/lib/api-auth'
import { notionQuery } from '@/lib/notion'

const DB_DOCUMENTOS = process.env.NOTION_DB_DOCUMENTOS
const DB_ATIVIDADES = process.env.NOTION_DB_ATIVIDADES
const DB_CALENDARIO = process.env.NOTION_DB_CALENDARIO

type NotionPage = {
  id: string
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
    console.error('Notion query error em pauta:', err)
    return []
  }
}

function isoLocal(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dia}`
}

function formatarData(dataIso: string): string {
  if (!dataIso) return ''
  const [y, m, d] = dataIso.slice(0, 10).split('-')
  if (!y || !m || !d) return ''
  return `${d}/${m}/${y}`
}

async function ultimosDocumentos(clienteNome: string) {
  const pages = await queryDb(DB_DOCUMENTOS, {
    filter: { property: 'Cliente', rich_text: { equals: clienteNome } },
    sorts: [{ property: 'Data de Geração', direction: 'descending' }],
    page_size: 3,
  })
  return pages.map(p => ({
    tipo: p.properties['Tipo']?.select?.name || '',
    nome: p.properties['Nome']?.title?.[0]?.plain_text || '',
    data: p.properties['Data de Geração']?.date?.start || '',
  }))
}

async function ultimasAtividades(clienteId: string) {
  const pages = await queryDb(DB_ATIVIDADES, {
    filter: { property: 'Cliente ID', rich_text: { equals: clienteId } },
    sorts: [{ property: 'Data', direction: 'descending' }],
    page_size: 5,
  })
  return pages.map(p => ({
    descricao: p.properties['Descrição']?.rich_text?.[0]?.plain_text || '',
    data: p.properties['Data']?.date?.start || '',
  }))
}

async function proximasEntregas(clienteNome: string) {
  const hoje = new Date()
  const pages = await queryDb(DB_CALENDARIO, {
    filter: {
      and: [
        { property: 'Cliente', select: { equals: clienteNome } },
        { property: 'Data', date: { on_or_after: isoLocal(hoje) } },
      ],
    },
    sorts: [{ property: 'Data', direction: 'ascending' }],
    page_size: 3,
  })
  return pages.map(p => ({
    titulo: p.properties['Título']?.title?.[0]?.plain_text || '',
    data: p.properties['Data']?.date?.start || '',
  }))
}

export async function GET(request: Request) {
  if (!verificarToken(request)) return respostaNaoAutorizada()
  try {
    const { searchParams } = new URL(request.url)
    const clienteId = searchParams.get('clienteId') || ''
    const clienteNome = searchParams.get('clienteNome') || ''

    const [documentos, atividades, entregas] = await Promise.all([
      ultimosDocumentos(clienteNome),
      ultimasAtividades(clienteId),
      proximasEntregas(clienteNome),
    ])

    const linhasAtividades = atividades.length
      ? atividades.map(a => `- ${a.descricao}${a.data ? ` (${formatarData(a.data)})` : ''}`).join('\n')
      : '- Nenhuma atividade registrada no período.'

    const linhasDocumentos = documentos.length
      ? documentos.map(d => `- ${d.tipo}${d.tipo ? ': ' : ''}${d.nome}${d.data ? ` (${formatarData(d.data)})` : ''}`).join('\n')
      : '- Nenhum documento gerado recentemente.'

    const linhasEntregas = entregas.length
      ? entregas.map(e => `- ${e.titulo}${e.data ? ` (${formatarData(e.data)})` : ''}`).join('\n')
      : '- Nenhuma entrega agendada.'

    const pauta = `PAUTA — REUNIÃO ${clienteNome.toUpperCase()}
Data: ${formatarData(isoLocal(new Date()))}

1. REVISÃO DO PERÍODO
${linhasAtividades}

2. DOCUMENTOS ENTREGUES
${linhasDocumentos}

3. PRÓXIMAS ENTREGAS
${linhasEntregas}

4. PONTOS DE ALINHAMENTO
- Satisfação com as entregas recentes
- Ajustes necessários
- Aprovações pendentes

5. PRÓXIMOS PASSOS
- [ ]
- [ ] `

    return NextResponse.json({ pauta })
  } catch (err) {
    console.error('GET /api/pauta:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
