import { NextResponse } from 'next/server'

const NOTION_TOKEN = process.env.NOTION_TOKEN
const DB_ID = process.env.NOTION_DB_DOCUMENTOS

const NH = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Content-Type': 'application/json',
  'Notion-Version': '2022-06-28',
}

const ETAPAS = [
  'Raio-X', 'Briefing', 'Proposta', 'Contrato',
  'Calendário', 'Relatório', 'Checklist',
] as const

type EtapaDoc = {
  properties: {
    Tipo?: { select?: { name: string } | null }
    'Link Drive'?: { url?: string | null }
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const nome = searchParams.get('nome')
    if (!nome) {
      return NextResponse.json({ error: 'Parâmetro nome obrigatório' }, { status: 400 })
    }

    const res = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: 'POST',
      headers: NH,
      body: JSON.stringify({
        filter: { property: 'Cliente', rich_text: { equals: nome } },
        sorts: [{ property: 'Data de Geração', direction: 'descending' }],
        page_size: 100,
      }),
    })

    if (!res.ok) {
      console.error('Notion progresso error:', await res.json())
      return NextResponse.json({ error: 'Erro ao buscar documentos' }, { status: 500 })
    }

    const data = await res.json()
    const docs = (data.results ?? []) as EtapaDoc[]

    const docMap = new Map<string, string | null>()
    for (const doc of docs) {
      const tipo = doc.properties.Tipo?.select?.name
      if (!tipo) continue
      const link = doc.properties['Link Drive']?.url ?? null
      if (!docMap.has(tipo) || (docMap.get(tipo) === null && link)) {
        docMap.set(tipo, link)
      }
    }

    const etapas = ETAPAS.map(etapaNome => ({
      nome: etapaNome,
      concluida: docMap.has(etapaNome),
      linkDrive: docMap.get(etapaNome) ?? null,
    }))

    const concluidas = etapas.filter(e => e.concluida).length

    return NextResponse.json({
      etapas,
      total: 7,
      concluidas,
      percentual: Math.round((concluidas / 7) * 100),
    })
  } catch (err) {
    console.error('GET /api/clientes/[id]/progresso:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
