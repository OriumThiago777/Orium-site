import { NextRequest, NextResponse } from 'next/server';
import { notionCreate, notionQuery, NotionError } from '@/lib/notion';

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

type NotionRespostaPage = {
  id: string;
  properties: Record<string, {
    title?: Array<{ plain_text: string }>;
    rich_text?: Array<{ plain_text: string }>;
    select?: { name: string } | null;
    date?: { start: string } | null;
    number?: number | null;
    multi_select?: Array<{ name: string }>;
    formula?: { type: string; number?: number | null; string?: string | null };
  }>;
};

export async function GET() {
  const databaseId = process.env.NOTION_DB_EXPERIENCIA_ALTEMANS;

  if (!databaseId) {
    console.error('NOTION_DB_EXPERIENCIA_ALTEMANS ausente no ambiente.');
    return NextResponse.json({ error: 'Configuração ausente no servidor.' }, { status: 500 });
  }

  let data: { results?: NotionRespostaPage[] };
  try {
    data = await notionQuery(databaseId, {
      sorts: [{ property: 'Data', direction: 'descending' }],
      page_size: 100,
    });
  } catch (err) {
    const message = err instanceof NotionError ? err.message : String(err);
    console.error('Erro ao consultar Notion:', message);
    return NextResponse.json({ error: 'Falha ao carregar respostas.' }, { status: 502 });
  }

  const respostas = (data.results ?? []).map((page) => {
    const props = page.properties;
    return {
      id: page.id,
      registro: props['Registro']?.title?.[0]?.plain_text || '',
      data: props['Data']?.date?.start || '',
      barbeiro: props['Barbeiro']?.select?.name || '',
      notaGeral: props['Nota geral']?.number ?? null,
      indice: props['Índice de Qualidade']?.formula?.number ?? null,
      faixa: props['Faixa']?.formula?.string ?? null,
      nps: props['NPS']?.number ?? null,
      destaques: (props['Destaques']?.multi_select || []).map((d) => d.name),
      mensagem: props['Mensagem']?.rich_text?.[0]?.plain_text || '',
      status: props['Status']?.select?.name || '',
    };
  });

  const indices = respostas.map((r) => r.indice).filter((n): n is number => typeof n === 'number');
  const npsList = respostas.map((r) => r.nps).filter((n): n is number => typeof n === 'number');

  const indiceMedio = indices.length ? Math.round(indices.reduce((a, b) => a + b, 0) / indices.length) : null;
  const npsMedio = npsList.length ? Math.round((npsList.reduce((a, b) => a + b, 0) / npsList.length) * 10) / 10 : null;

  const porFaixa: Record<string, number> = {};
  respostas.forEach((r) => {
    if (r.faixa) porFaixa[r.faixa] = (porFaixa[r.faixa] || 0) + 1;
  });

  return NextResponse.json({
    summary: { total: respostas.length, indiceMedio, npsMedio, porFaixa },
    respostas,
  });
}
