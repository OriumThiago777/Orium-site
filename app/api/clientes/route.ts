import { NextResponse } from 'next/server';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DB_CLIENTES;

const NH = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Content-Type': 'application/json',
  'Notion-Version': '2022-06-28',
};

type NotionPage = {
  id: string;
  properties: Record<string, {
    title?: Array<{ plain_text: string }>;
    select?: { name: string } | null;
    rich_text?: Array<{ plain_text: string }>;
    email?: string | null;
    phone_number?: string | null;
    date?: { start: string } | null;
    checkbox?: boolean;
    number?: number | null;
  }>;
};

function extractCliente(page: NotionPage) {
  const p = page.properties;
  return {
    id: page.id,
    nome: p['Nome']?.title?.[0]?.plain_text ?? '',
    status: p['Status']?.select?.name ?? '',
    faseAtual: p['Fase Atual']?.select?.name ?? '',
    instagram: p['Instagram']?.rich_text?.[0]?.plain_text ?? '',
    email: p['E-mail']?.email ?? '',
    contato: p['Contato']?.phone_number ?? '',
    dataInicio: p['Data de Início']?.date?.start ?? '',
    ultimaInteracao: p['Última Interação']?.date?.start ?? '',
    proximoDeliverable: p['Próximo Deliverable']?.date?.start ?? '',
    precisaRelatorio: p['Precisa Relatório']?.checkbox ?? false,
    notas: p['Notas']?.rich_text?.[0]?.plain_text ?? '',
    valorMensal: p['Valor Mensal']?.number ?? null,
  };
}

function buildProperties(body: Record<string, unknown>) {
  const props: Record<string, unknown> = {};

  if (body.nome !== undefined)
    props['Nome'] = { title: [{ text: { content: String(body.nome).slice(0, 2000) } }] };
  if (body.status !== undefined)
    props['Status'] = { select: { name: String(body.status) } };
  if (body.faseAtual !== undefined)
    props['Fase Atual'] = { select: { name: String(body.faseAtual) } };
  if (body.instagram !== undefined)
    props['Instagram'] = { rich_text: [{ text: { content: String(body.instagram).slice(0, 2000) } }] };
  if (body.email !== undefined)
    props['E-mail'] = { email: body.email || null };
  if (body.contato !== undefined)
    props['Contato'] = { phone_number: body.contato || null };
  if (body.notas !== undefined)
    props['Notas'] = { rich_text: [{ text: { content: String(body.notas).slice(0, 2000) } }] };
  if (body.dataInicio !== undefined)
    props['Data de Início'] = { date: body.dataInicio ? { start: String(body.dataInicio) } : null };
  if (body.ultimaInteracao !== undefined)
    props['Última Interação'] = { date: body.ultimaInteracao ? { start: String(body.ultimaInteracao) } : null };
  if (body.proximoDeliverable !== undefined)
    props['Próximo Deliverable'] = { date: body.proximoDeliverable ? { start: String(body.proximoDeliverable) } : null };
  if (body.precisaRelatorio !== undefined)
    props['Precisa Relatório'] = { checkbox: Boolean(body.precisaRelatorio) };
  if (body.valorMensal !== undefined)
    props['Valor Mensal'] = { number: body.valorMensal !== null && body.valorMensal !== '' ? Number(body.valorMensal) : null };

  return props;
}

export async function GET() {
  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: NH,
      body: JSON.stringify({
        sorts: [{ property: 'Data de Início', direction: 'descending' }],
        page_size: 100,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      console.error('Notion GET clientes error:', err);
      return NextResponse.json({ error: 'Erro ao listar clientes' }, { status: 500 });
    }
    const data = await res.json();
    const clientes = (data.results ?? []).map((page: NotionPage) => extractCliente(page));
    return NextResponse.json({ clientes });
  } catch (err) {
    console.error('GET /api/clientes:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const props = buildProperties(body);

    const res = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: NH,
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties: props,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      console.error('Notion POST clientes error:', err);
      return NextResponse.json({ error: 'Erro ao criar cliente' }, { status: 500 });
    }
    const page = await res.json() as NotionPage;
    return NextResponse.json(extractCliente(page));
  } catch (err) {
    console.error('POST /api/clientes:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

    const body = await request.json();
    const props = buildProperties(body);

    const res = await fetch(`https://api.notion.com/v1/pages/${id}`, {
      method: 'PATCH',
      headers: NH,
      body: JSON.stringify({ properties: props }),
    });
    if (!res.ok) {
      const err = await res.json();
      console.error('Notion PATCH clientes error:', err);
      return NextResponse.json({ error: 'Erro ao atualizar cliente' }, { status: 500 });
    }
    const page = await res.json() as NotionPage;
    return NextResponse.json(extractCliente(page));
  } catch (err) {
    console.error('PATCH /api/clientes:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

    const res = await fetch(`https://api.notion.com/v1/pages/${id}`, {
      method: 'PATCH',
      headers: NH,
      body: JSON.stringify({ archived: true }),
    });
    if (!res.ok) {
      const err = await res.json();
      console.error('Notion DELETE clientes error:', err);
      return NextResponse.json({ error: 'Erro ao arquivar cliente' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/clientes:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
