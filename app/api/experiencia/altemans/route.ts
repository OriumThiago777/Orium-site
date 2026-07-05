import { NextRequest, NextResponse } from 'next/server';
import { notionCreate, NotionError } from '@/lib/notion';

interface Payload {
  geral?: number;
  barbeiro?: string;
  recepcao?: number;
  entendimento?: number;
  resultado?: number;
  tempo?: number;
  estrutura?: number;
  nps?: number;
  destaque?: string[];
  mensagem?: string;
}

function truncate(text: string, max = 1900) {
  return text.length > max ? text.slice(0, max) : text;
}

export async function POST(req: NextRequest) {
  const databaseId = process.env.NOTION_DB_EXPERIENCIA_ALTEMANS;

  if (!databaseId) {
    console.error('NOTION_DB_EXPERIENCIA_ALTEMANS ausente no ambiente.');
    return NextResponse.json({ error: 'Configuração ausente no servidor.' }, { status: 500 });
  }

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Corpo da requisição inválido.' }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const registro = `${body.barbeiro || 'Cliente'} — ${today}`;

  const properties: Record<string, unknown> = {
    Registro: { title: [{ text: { content: registro } }] },
    Data: { date: { start: today } },
    Status: { select: { name: 'Novo' } },
  };

  if (typeof body.geral === 'number') properties['Nota geral'] = { number: body.geral };
  if (body.barbeiro) properties['Barbeiro'] = { select: { name: body.barbeiro } };
  if (typeof body.recepcao === 'number') properties['Recepção'] = { number: body.recepcao };
  if (typeof body.entendimento === 'number') properties['Entendimento'] = { number: body.entendimento };
  if (typeof body.resultado === 'number') properties['Resultado'] = { number: body.resultado };
  if (typeof body.tempo === 'number') properties['Tempo'] = { number: body.tempo };
  if (typeof body.estrutura === 'number') properties['Estrutura'] = { number: body.estrutura };
  if (typeof body.nps === 'number') properties['NPS'] = { number: body.nps };
  if (body.destaque?.length) {
    properties['Destaques'] = { multi_select: body.destaque.map((name) => ({ name })) };
  }
  if (body.mensagem) {
    properties['Mensagem'] = { rich_text: [{ text: { content: truncate(body.mensagem) } }] };
  }

  try {
    await notionCreate({ parent: { database_id: databaseId }, properties });
  } catch (err) {
    const message = err instanceof NotionError ? err.message : String(err);
    console.error('Erro ao gravar no Notion:', message);
    return NextResponse.json({ error: 'Falha ao gravar a resposta.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
