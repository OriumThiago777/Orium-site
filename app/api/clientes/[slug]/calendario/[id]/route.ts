import { NextResponse } from 'next/server'
import { notionGetPage, notionPatch } from '@/lib/notion'
import { CLIENTES_PORTAL, isClienteSlug } from '@/lib/clientes-calendario'

type NotionPageWithClient = {
  properties?: {
    Cliente?: {
      select?: {
        name?: string
      } | null
    }
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params

  if (!isClienteSlug(slug)) {
    return NextResponse.json({ error: 'Cliente nao encontrado' }, { status: 404 })
  }

  try {
    const page = (await notionGetPage(id)) as NotionPageWithClient

    if (page.properties?.Cliente?.select?.name !== CLIENTES_PORTAL[slug]) {
      return NextResponse.json({ error: 'Conteudo nao encontrado' }, { status: 404 })
    }

    const { titulo, data, formato, quemGrava, sobre, criadoPor, status, observacoes } = await request.json()

    const properties: Record<string, unknown> = {}
    if (titulo !== undefined) properties.Título = { title: [{ text: { content: String(titulo) } }] }
    if (data !== undefined) properties.Data = { date: { start: String(data) } }
    if (formato !== undefined) properties.Formato = { select: { name: String(formato) } }
    if (quemGrava !== undefined) properties['Quem Grava'] = { select: { name: String(quemGrava) } }
    if (sobre !== undefined) properties.Sobre = { rich_text: [{ text: { content: String(sobre) } }] }
    if (criadoPor !== undefined) properties['Criado Por'] = { select: { name: String(criadoPor) } }
    if (status !== undefined) properties.Status = { select: { name: String(status) } }
    if (observacoes !== undefined) properties.Observações = { rich_text: [{ text: { content: String(observacoes) } }] }

    await notionPatch(id, { properties })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PATCH /api/clientes/[slug]/calendario/[id]:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params

  if (!isClienteSlug(slug)) {
    return NextResponse.json({ error: 'Cliente nao encontrado' }, { status: 404 })
  }

  try {
    const page = (await notionGetPage(id)) as NotionPageWithClient

    if (page.properties?.Cliente?.select?.name !== CLIENTES_PORTAL[slug]) {
      return NextResponse.json({ error: 'Conteudo nao encontrado' }, { status: 404 })
    }

    await notionPatch(id, { archived: true })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/clientes/[slug]/calendario/[id]:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
