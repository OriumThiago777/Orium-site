import { NextResponse } from 'next/server';
import { notionQuery } from '@/lib/notion';

const DB_ID = process.env.NOTION_DB_DOCUMENTOS;

function fromChunks(richText: Array<{ plain_text?: string; text?: { content: string } }>): string {
  return richText.map(rt => rt.plain_text ?? rt.text?.content ?? '').join('');
}

export const revalidate = 60;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const data = await notionQuery(DB_ID!, {
      filter: { property: 'ID Documento', rich_text: { equals: id } },
      page_size: 1,
    });

    if (!data.results?.length) {
      return NextResponse.json({ error: 'Proposta não encontrada' }, { status: 404 });
    }

    const p = data.results[0].properties;
    const jsonStr = fromChunks(p['Dados JSON']?.rich_text ?? []);

    if (!jsonStr) {
      return NextResponse.json({ error: 'Proposta não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ dados: JSON.parse(jsonStr) });
  } catch (err) {
    console.error('GET /api/proposta/[id]:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
