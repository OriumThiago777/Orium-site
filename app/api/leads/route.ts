import { NextResponse } from 'next/server'

const NOTION_TOKEN = process.env.NOTION_TOKEN
const DB_LEADS = process.env.NOTION_DB_LEADS

const NH = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Content-Type': 'application/json',
  'Notion-Version': '2022-06-28',
}

export async function POST(request: Request) {
  try {
    const { nome, segmento, instagram, email, necessidade } = await request.json()

    if (!DB_LEADS) return NextResponse.json({ success: true })

    const res = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: NH,
      body: JSON.stringify({
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
      }),
    })

    if (!res.ok) {
      console.error('Notion POST lead error:', await res.json())
      return NextResponse.json({ success: false }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('POST /api/leads:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
