import { NextResponse } from 'next/server'
import { notionGetPage, notionPatch } from '@/lib/notion'
import { isClienteSlug } from '@/lib/clientes-calendario'

type NotionPageWithCliente = {
  properties?: {
    Cliente?: {
      select?: { name?: string } | null
    }
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params

  if (!isClienteSlug(slug)) {
    return NextResponse.json({ error: 'Cliente nao encontrado' }, { status: 404 })
  }

  try {
    const page = (await notionGetPage(id)) as NotionPageWithCliente

    if (page.properties?.Cliente?.select?.name !== slug) {
      return NextResponse.json({ error: 'Campanha nao encontrada' }, { status: 404 })
    }

    const { titulo, tipo, dataInicio, dataFim, objetivo, orcamento, plataformas, status, observacoes } = await request.json()

    const properties: Record<string, unknown> = {}
    if (titulo !== undefined) properties.Título = { title: [{ text: { content: String(titulo) } }] }
    if (tipo !== undefined) properties.Tipo = { select: { name: String(tipo) } }
    if (dataInicio !== undefined) properties['Data Início'] = { date: { start: String(dataInicio) } }
    if (dataFim !== undefined) properties['Data Fim'] = { date: { start: String(dataFim) } }
    if (objetivo !== undefined) properties.Objetivo = { rich_text: [{ text: { content: String(objetivo) } }] }
    if (orcamento !== undefined) properties.Orçamento = { rich_text: [{ text: { content: String(orcamento) } }] }
    if (plataformas !== undefined) properties.Plataformas = { multi_select: (Array.isArray(plataformas) ? plataformas : []).map((p: string) => ({ name: p })) }
    if (status !== undefined) properties.Status = { select: { name: String(status) } }
    if (observacoes !== undefined) properties.Observações = { rich_text: [{ text: { content: String(observacoes) } }] }

    await notionPatch(id, { properties })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PATCH /api/clientes/[slug]/campanhas/[id]:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params

  if (!isClienteSlug(slug)) {
    return NextResponse.json({ error: 'Cliente nao encontrado' }, { status: 404 })
  }

  try {
    const page = (await notionGetPage(id)) as NotionPageWithCliente

    if (page.properties?.Cliente?.select?.name !== slug) {
      return NextResponse.json({ error: 'Campanha nao encontrada' }, { status: 404 })
    }

    await notionPatch(id, { archived: true })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/clientes/[slug]/campanhas/[id]:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
