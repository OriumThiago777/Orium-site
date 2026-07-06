import { NextRequest, NextResponse } from 'next/server';
import { notionPatch, NotionError } from '@/lib/notion';

interface UpdateBody {
  pergunta?: string;
  rotulo?: string;
  dica?: string;
  opcoes?: string[];
  ordem?: number;
  ativo?: boolean;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let body: UpdateBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Corpo da requisição inválido.' }, { status: 400 });
  }

  const properties: Record<string, unknown> = {};
  if (typeof body.pergunta === 'string') {
    properties['Pergunta'] = { title: [{ text: { content: body.pergunta } }] };
  }
  if (typeof body.rotulo === 'string') {
    properties['Rótulo'] = { rich_text: [{ text: { content: body.rotulo } }] };
  }
  if (typeof body.dica === 'string') {
    properties['Dica'] = { rich_text: [{ text: { content: body.dica } }] };
  }
  if (Array.isArray(body.opcoes)) {
    properties['Opções'] = { rich_text: [{ text: { content: body.opcoes.join(';') } }] };
  }
  if (typeof body.ordem === 'number') {
    properties['Ordem'] = { number: body.ordem };
  }
  if (typeof body.ativo === 'boolean') {
    properties['Ativo'] = { checkbox: body.ativo };
  }

  try {
    await notionPatch(id, { properties });
  } catch (err) {
    const message = err instanceof NotionError ? err.message : String(err);
    console.error('Erro ao atualizar pergunta:', message);
    return NextResponse.json({ error: 'Falha ao salvar.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
