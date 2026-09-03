import { NextResponse } from 'next/server'
import { verificarToken, respostaNaoAutorizada } from '@/lib/api-auth'
import { notionPatch } from '@/lib/notion'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!verificarToken(request)) return respostaNaoAutorizada()
  try {
    const { id } = await params
    const { novaData } = await request.json()
    if (!novaData) return NextResponse.json({ success: false }, { status: 400 })

    await notionPatch(id, { properties: { 'Data': { date: { start: String(novaData) } } } })

    // Auditoria não bloqueia a resposta: se "Última Edição" ainda não existir
    // na database, essa chamada falha silenciosamente e a data já foi movida.
    const agora = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
    notionPatch(id, {
      properties: { 'Última Edição': { rich_text: [{ text: { content: `movido em ${agora}` } }] } },
    }).catch(err => console.error('Aviso: falha ao gravar Última Edição:', err))

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PATCH /api/calendario/eventos/[id]:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
