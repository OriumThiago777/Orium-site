import { NextResponse } from 'next/server'
import { verificarToken, respostaNaoAutorizada } from '@/lib/api-auth'
import { notionCreate } from '@/lib/notion'

const DB_LEADS = process.env.NOTION_DB_LEADS

export async function POST(request: Request) {
  if (!verificarToken(request)) return respostaNaoAutorizada()
  try {
    const { nomeSegmento, dificuldade, comoConheceu } = await request.json()

    if (!DB_LEADS) return NextResponse.json({ success: true })

    await notionCreate({
      parent: { database_id: DB_LEADS },
      properties: {
        'Nome': { title: [{ text: { content: String(nomeSegmento || 'Sem nome') } }] },
        'Dificuldade': { rich_text: [{ text: { content: String(dificuldade || '') } }] },
        'Como conheceu': { rich_text: [{ text: { content: String(comoConheceu || '') } }] },
        'Status': { select: { name: 'Novo' } },
        'Origem': { select: { name: 'Briefing Rápido' } },
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('POST /api/prospecto:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
