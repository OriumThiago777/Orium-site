import { NextResponse } from 'next/server';
import { notionUpdatePageProperties } from '@/lib/notion';

export async function POST(request: Request) {
  const { pageId, checklist, completo } = await request.json();

  if (!pageId || typeof checklist !== 'object' || checklist === null || typeof completo !== 'boolean') {
    return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
  }

  try {
    await notionUpdatePageProperties(pageId, {
      'Checklist Fotos': { rich_text: [{ text: { content: JSON.stringify(checklist) } }] },
      'Fotografado': { checkbox: completo },
    });
  } catch (error) {
    console.error('Notion error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar no Notion' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
