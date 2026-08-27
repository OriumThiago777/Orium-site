import { NextResponse } from 'next/server';
import { notionUpdatePageCheckbox } from '@/lib/notion';

export async function POST(request: Request) {
  const { pageId, fotografado } = await request.json();

  if (!pageId || typeof fotografado !== 'boolean') {
    return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
  }

  try {
    await notionUpdatePageCheckbox(pageId, 'Fotografado', fotografado);
  } catch (error) {
    console.error('Notion error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar no Notion' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
