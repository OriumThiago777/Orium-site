import { NextResponse } from 'next/server'
import { verificarToken, respostaNaoAutorizada } from '@/lib/api-auth'

const NOTION_TOKEN = process.env.NOTION_TOKEN
const DB_PESSOA = process.env.NOTION_DB_PESSOA
const DB_EMPRESA = process.env.NOTION_DB_EMPRESA

const NH = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Content-Type': 'application/json',
  'Notion-Version': '2022-06-28',
}

type NotionPage = {
  id: string
  created_time: string
  properties: Record<string, {
    title?: Array<{ plain_text: string }>
    rich_text?: Array<{ plain_text: string }>
    select?: { name: string } | null
  }>
}

const rt = (p: NotionPage, prop: string) =>
  p.properties[prop]?.rich_text?.map(t => t.plain_text).join('') || ''

async function buscarMaisRecente(dbId: string | undefined, tituloProp: string, cliente: string): Promise<NotionPage | null> {
  if (!dbId) return null
  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST',
    headers: NH,
    body: JSON.stringify({
      filter: { property: tituloProp, title: { contains: cliente } },
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
      page_size: 1,
    }),
  })
  if (!res.ok) {
    console.error(`Notion briefing/buscar error (${res.status})`)
    return null
  }
  const data = await res.json()
  return data.results?.[0] ?? null
}

export async function GET(request: Request) {
  if (!verificarToken(request)) return respostaNaoAutorizada()
  try {
    const { searchParams } = new URL(request.url)
    const cliente = searchParams.get('cliente')?.trim()
    const tipo = searchParams.get('tipo')
    if (!cliente) return NextResponse.json({ error: 'Parâmetro cliente obrigatório' }, { status: 400 })

    const [pessoa, empresa] = await Promise.all([
      tipo === 'Empresa' ? null : buscarMaisRecente(DB_PESSOA, 'Nome completo', cliente),
      tipo === 'Pessoa' ? null : buscarMaisRecente(DB_EMPRESA, 'Nome da empresa', cliente),
    ])

    // Entre os dois DBs, fica com o briefing mais recente
    let page: NotionPage | null = null
    let tipoEncontrado: 'Pessoa' | 'Empresa' = 'Pessoa'
    if (pessoa && empresa) {
      const pessoaMaisRecente = pessoa.created_time >= empresa.created_time
      page = pessoaMaisRecente ? pessoa : empresa
      tipoEncontrado = pessoaMaisRecente ? 'Pessoa' : 'Empresa'
    } else if (pessoa) {
      page = pessoa
    } else if (empresa) {
      page = empresa
      tipoEncontrado = 'Empresa'
    }

    if (!page) {
      return NextResponse.json({ error: 'Nenhum briefing encontrado' }, { status: 404 })
    }

    const ehPessoa = tipoEncontrado === 'Pessoa'
    return NextResponse.json({
      nome: page.properties[ehPessoa ? 'Nome completo' : 'Nome da empresa']?.title?.[0]?.plain_text || '',
      segmento: rt(page, 'Segmento'),
      publicoAlvo: rt(page, ehPessoa ? 'Para quem atende' : 'O que faz e para quem'),
      dores: rt(page, 'Dor concreta'),
      objetivos: rt(page, 'Resultado esperado em 90 dias'),
      // Os briefings atuais não têm campos de Instagram nem cidade —
      // retornados vazios para manter o contrato da API
      instagram: '',
      cidade: '',
      tipo: tipoEncontrado,
    })
  } catch (err) {
    console.error('GET /api/briefing/buscar:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
