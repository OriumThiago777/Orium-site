import { NextResponse } from 'next/server'

const NOTION_TOKEN = process.env.NOTION_TOKEN
const NOTION_DB_PESSOA = process.env.NOTION_DB_PESSOA
const NOTION_DB_EMPRESA = process.env.NOTION_DB_EMPRESA

export async function POST(request: Request) {
  const body = await request.json()
  const { tipo, ...campos } = body

  const databaseId = tipo === 'pessoa' ? NOTION_DB_PESSOA : NOTION_DB_EMPRESA

  const properties: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(campos)) {
    if (!value) continue
    if (key === 'Nome completo' || key === 'Nome da empresa') {
      properties[key] = { title: [{ text: { content: value } }] }
    } else if (key === 'Email') {
      properties[key] = { email: value }
    } else if (key === 'Contato' || key === 'Contato responsável') {
      properties[key] = { phone_number: value }
    } else if (key === 'Status') {
      properties[key] = { select: { name: value } }
    } else if (key === 'Data de entrada') {
      properties[key] = { date: { start: value } }
    } else {
      properties[key] = { rich_text: [{ text: { content: String(value) } }] }
    }
  }

  properties['Status'] = { select: { name: 'Novo' } }
  properties['Data de entrada'] = {
    date: { start: new Date().toISOString().split('T')[0] }
  }

  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('Notion error:', error)
    return NextResponse.json({ error: 'Erro ao salvar no Notion' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}