import { NextResponse } from 'next/server';
import { notionGetPage, notionUpdatePageProperties } from '@/lib/notion';
import { calcularCompleto, extrairTexto, montarChecklist } from '@/lib/colacao-checklist';

/* eslint-disable @typescript-eslint/no-explicit-any */

function aplicarItem(checklist: ReturnType<typeof montarChecklist>, itemKey: string, value: boolean) {
  if (itemKey === 'individual') {
    checklist.individual = value;
    return true;
  }
  if (itemKey === 'prioridade') {
    checklist.prioridade = value;
    return true;
  }
  if (itemKey.startsWith('formandos:')) {
    const nome = itemKey.slice('formandos:'.length);
    checklist.formandos[nome] = value;
    return true;
  }
  if (itemKey.startsWith('acompanhantes:')) {
    const nome = itemKey.slice('acompanhantes:'.length);
    checklist.acompanhantes[nome] = value;
    return true;
  }
  return false;
}

export async function POST(request: Request) {
  const { pageId, itemKey, value } = await request.json();

  if (!pageId || typeof itemKey !== 'string' || typeof value !== 'boolean') {
    return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
  }

  let page: any;
  try {
    page = await notionGetPage(pageId);
  } catch (error) {
    console.error('Notion error:', error);
    return NextResponse.json({ error: 'Erro ao consultar o Notion' }, { status: 500 });
  }

  const props = page.properties ?? {};
  const fotoGarantida = extrairTexto(props['Foto garantida']?.rich_text);
  const fotosFormandos: string[] = (props['Fotos com formandos']?.multi_select ?? []).map((o: any) => o.name);
  const acompanhantesTexto = extrairTexto(props['Acompanhantes']?.rich_text);
  const checklistFotosRaw = extrairTexto(props['Checklist Fotos']?.rich_text);

  const checklist = montarChecklist(checklistFotosRaw, acompanhantesTexto, fotoGarantida, fotosFormandos);

  if (!aplicarItem(checklist, itemKey, value)) {
    return NextResponse.json({ error: 'itemKey inválido' }, { status: 400 });
  }

  const completo = calcularCompleto(checklist);

  try {
    await notionUpdatePageProperties(pageId, {
      'Checklist Fotos': { rich_text: [{ text: { content: JSON.stringify(checklist) } }] },
      'Fotografado': { checkbox: completo },
    });
  } catch (error) {
    console.error('Notion error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar no Notion' }, { status: 500 });
  }

  return NextResponse.json({ success: true, checklist, fotografado: completo });
}
