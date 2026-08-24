import { NextResponse } from 'next/server'
import { notionCreate } from '@/lib/notion'

const NOTION_DB_COLACAO = process.env.NOTION_DB_COLACAO

export async function POST(request: Request) {
  const body = await request.json()
  const {
    nome_completo,
    apelido,
    whatsapp,
    instagram,
    horario_chegada,
    acompanhantes,
    foto_garantida,
    fotos_formandos,
    autorizacao,
    enviado_em,
  } = body

  if (!nome_completo || !apelido || !whatsapp || !horario_chegada || !autorizacao) {
    return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })
  }

  if (!NOTION_DB_COLACAO) {
    return NextResponse.json({ error: 'Configuração ausente no servidor' }, { status: 500 })
  }

  const properties: Record<string, unknown> = {
    'Nome completo': { title: [{ text: { content: nome_completo } }] },
    'Chamar de': { rich_text: [{ text: { content: apelido } }] },
    'WhatsApp': { rich_text: [{ text: { content: whatsapp } }] },
    'Horário de chegada': { rich_text: [{ text: { content: horario_chegada } }] },
    'Autorização': { select: { name: autorizacao } },
    'Enviado em': { date: { start: enviado_em || new Date().toISOString() } },
  }

  if (instagram) properties['Instagram'] = { rich_text: [{ text: { content: instagram } }] }
  if (acompanhantes) properties['Acompanhantes'] = { rich_text: [{ text: { content: acompanhantes } }] }
  if (foto_garantida) properties['Foto garantida'] = { rich_text: [{ text: { content: foto_garantida } }] }

  if (fotos_formandos) {
    const nomes = String(fotos_formandos)
      .split(',')
      .map((n: string) => n.trim())
      .filter(Boolean)
    if (nomes.length > 0) {
      properties['Fotos com formandos'] = { multi_select: nomes.map((name: string) => ({ name })) }
    }
  }

  try {
    await notionCreate({
      parent: { database_id: NOTION_DB_COLACAO },
      properties,
    })
  } catch (error) {
    console.error('Notion error:', error)
    return NextResponse.json({ error: 'Erro ao salvar no Notion' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
