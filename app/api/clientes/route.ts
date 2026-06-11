import { NextResponse } from 'next/server';
import { verificarToken, respostaNaoAutorizada } from '@/lib/api-auth';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DB_CLIENTES;

const NH = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Content-Type': 'application/json',
  'Notion-Version': '2022-06-28',
};

const registrarAtividade = (body: object) => {
  fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/atividades`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RAIO_X_PASSWORD}`,
    },
    body: JSON.stringify(body),
  }).catch(() => {})
}

const STATUS_VALIDOS = new Set(['Ativo', 'Inativo', 'Proposta']);
const FASES_VALIDAS = new Set([
  'Diagnóstico',
  'Estruturação Inicial',
  'Conteúdo e Comunicação',
  'Expansão Digital',
  'Pausado',
  'Finalizado',
]);

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

function sanitizeErrorMessage(message: string) {
  return message
    .replace(/[0-9a-f]{32}/gi, '[id]')
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '[id]');
}

async function getNotionError(res: Response) {
  try {
    const err = await res.json();
    const message = typeof err?.message === 'string'
      ? sanitizeErrorMessage(err.message)
      : 'Erro retornado pelo Notion';
    return { status: res.status, code: err?.code, message };
  } catch {
    return { status: res.status, code: 'unknown_error', message: 'Erro retornado pelo Notion' };
  }
}

function validarClientePayload(body: Record<string, unknown>) {
  if (body.nome !== undefined && !String(body.nome).trim()) {
    return 'Nome do cliente é obrigatório';
  }

  if (body.status !== undefined && !STATUS_VALIDOS.has(String(body.status))) {
    return 'Status inválido para o banco Clientes ORIUM';
  }

  if (body.faseAtual !== undefined && !FASES_VALIDAS.has(String(body.faseAtual))) {
    return 'Fase Atual inválida para o banco Clientes ORIUM';
  }

  if (body.email !== undefined && body.email !== '' && body.email !== null) {
    const email = String(body.email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'E-mail inválido';
    }
  }

  return null;
}

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

export async function GET(request: Request) {
  if (!verificarToken(request)) return respostaNaoAutorizada()
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
      const err = await getNotionError(res);
      console.error('Notion GET clientes error:', err);
      return NextResponse.json({ error: 'Erro ao listar clientes', detail: err.message }, { status: 500 });
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
  if (!verificarToken(request)) return respostaNaoAutorizada()
  try {
    const body = await request.json() as Record<string, unknown>;
    const erroValidacao = validarClientePayload(body);
    if (erroValidacao) {
      return NextResponse.json({ error: erroValidacao }, { status: 400 });
    }

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
      const err = await getNotionError(res);
      console.error('Notion POST clientes error:', err);
      return NextResponse.json({ error: 'Erro ao criar cliente no Notion', detail: err.message }, { status: 500 });
    }
    const page = await res.json() as NotionPage;
    const clienteCriado = extractCliente(page);
    registrarAtividade({
      clienteId: clienteCriado.id,
      clienteNome: clienteCriado.nome,
      tipo: 'cliente_criado',
      descricao: 'Cliente cadastrado na ORIUM',
    });
    return NextResponse.json(clienteCriado);
  } catch (err) {
    console.error('POST /api/clientes:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!verificarToken(request)) return respostaNaoAutorizada()
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

    const body = await request.json() as Record<string, unknown>;
    const erroValidacao = validarClientePayload(body);
    if (erroValidacao) {
      return NextResponse.json({ error: erroValidacao }, { status: 400 });
    }

    const props = buildProperties(body);

    const res = await fetch(`https://api.notion.com/v1/pages/${id}`, {
      method: 'PATCH',
      headers: NH,
      body: JSON.stringify({ properties: props }),
    });
    if (!res.ok) {
      const err = await getNotionError(res);
      console.error('Notion PATCH clientes error:', err);
      return NextResponse.json({ error: 'Erro ao atualizar cliente no Notion', detail: err.message }, { status: 500 });
    }
    const page = await res.json() as NotionPage;
    if (body.faseAtual !== undefined) {
      registrarAtividade({
        clienteId: id,
        clienteNome: body.nome || body.clienteNome || '',
        tipo: 'fase_alterada',
        descricao: `Fase alterada para: ${body.faseAtual}`,
      });
    }
    return NextResponse.json(extractCliente(page));
  } catch (err) {
    console.error('PATCH /api/clientes:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!verificarToken(request)) return respostaNaoAutorizada()
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
      const err = await getNotionError(res);
      console.error('Notion DELETE clientes error:', err);
      return NextResponse.json({ error: 'Erro ao arquivar cliente no Notion', detail: err.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/clientes:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
