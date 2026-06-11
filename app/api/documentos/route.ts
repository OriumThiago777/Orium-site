import { NextResponse } from 'next/server';
import { verificarToken, respostaNaoAutorizada } from '@/lib/api-auth';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DB_ID = process.env.NOTION_DB_DOCUMENTOS;

const NH = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Content-Type': 'application/json',
  'Notion-Version': '2022-06-28',
};

function toChunks(text: string) {
  const result = [];
  for (let i = 0; i < text.length; i += 2000) {
    result.push({ text: { content: text.slice(i, i + 2000) } });
  }
  return result.length ? result : [{ text: { content: '' } }];
}

function fromChunks(richText: Array<{ plain_text?: string; text?: { content: string } }>): string {
  return richText.map(rt => rt.plain_text ?? rt.text?.content ?? '').join('');
}

async function findPage(id: string): Promise<{ pageId: string } | null> {
  const res = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
    method: 'POST',
    headers: NH,
    body: JSON.stringify({
      filter: { property: 'ID Documento', rich_text: { equals: id } },
      page_size: 1,
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.results?.length) return null;
  return { pageId: data.results[0].id };
}

export async function GET(request: Request) {
  if (!verificarToken(request)) return respostaNaoAutorizada()
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const found = await findPage(id);
      if (!found) return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 });

      const res = await fetch(`https://api.notion.com/v1/pages/${found.pageId}`, { headers: NH });
      if (!res.ok) return NextResponse.json({ error: 'Erro ao buscar documento' }, { status: 500 });

      const page = await res.json();
      const p = page.properties;
      const jsonStr = fromChunks(p['Dados JSON']?.rich_text ?? []);

      return NextResponse.json({
        id,
        pageId: found.pageId,
        nome: p['Nome']?.title?.[0]?.plain_text ?? '',
        tipo: p['Tipo']?.select?.name ?? '',
        cliente: fromChunks(p['Cliente']?.rich_text ?? []),
        dataGeracao: p['Data de Geração']?.date?.start ?? '',
        dataEdicao: p['Data de Edição']?.date?.start ?? null,
        dados: jsonStr ? JSON.parse(jsonStr) : null,
      });
    }

    const res = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: 'POST',
      headers: NH,
      body: JSON.stringify({
        sorts: [{ property: 'Data de Geração', direction: 'descending' }],
        page_size: 100,
      }),
    });
    if (!res.ok) return NextResponse.json({ error: 'Erro ao listar documentos' }, { status: 500 });

    const data = await res.json();
    const docs = (data.results ?? []).map((page: { id: string; properties: Record<string, { title?: Array<{plain_text: string}>; select?: {name: string}; rich_text?: Array<{plain_text?: string; text?: {content: string}}>; date?: {start: string} }> }) => {
      const p = page.properties;
      return {
        id: fromChunks(p['ID Documento']?.rich_text ?? []),
        pageId: page.id,
        nome: p['Nome']?.title?.[0]?.plain_text ?? '',
        tipo: p['Tipo']?.select?.name ?? '',
        cliente: fromChunks(p['Cliente']?.rich_text ?? []),
        dataGeracao: p['Data de Geração']?.date?.start ?? '',
        dataEdicao: p['Data de Edição']?.date?.start ?? null,
      };
    });

    return NextResponse.json(docs);
  } catch (err) {
    console.error('GET /api/documentos:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!verificarToken(request)) return respostaNaoAutorizada()
  try {
    const { id, tipo, nome, cliente, dados } = await request.json();
    if (!id || !tipo || !dados) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const jsonStr = JSON.stringify(dados);
    const existing = await findPage(id);

    if (existing) {
      const res = await fetch(`https://api.notion.com/v1/pages/${existing.pageId}`, {
        method: 'PATCH',
        headers: NH,
        body: JSON.stringify({
          properties: {
            'Nome': { title: [{ text: { content: (nome || 'Documento sem nome').slice(0, 2000) } }] },
            'Cliente': { rich_text: [{ text: { content: (cliente || '').slice(0, 2000) } }] },
            'Data de Edição': { date: { start: now } },
            'Dados JSON': { rich_text: toChunks(jsonStr) },
          },
        }),
      });
      if (!res.ok) {
        console.error('Notion PATCH error:', await res.json());
        return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
      }
      return NextResponse.json({ success: true, id });
    }

    const res = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: NH,
      body: JSON.stringify({
        parent: { database_id: DB_ID },
        properties: {
          'Nome': { title: [{ text: { content: (nome || 'Documento sem nome').slice(0, 2000) } }] },
          'Tipo': { select: { name: tipo } },
          'Cliente': { rich_text: [{ text: { content: (cliente || '').slice(0, 2000) } }] },
          'Data de Geração': { date: { start: now } },
          'ID Documento': { rich_text: [{ text: { content: id } }] },
          'Dados JSON': { rich_text: toChunks(jsonStr) },
        },
      }),
    });
    if (!res.ok) {
      console.error('Notion POST error:', await res.json());
      return NextResponse.json({ error: 'Erro ao criar' }, { status: 500 });
    }
    if (cliente) {
      const tipoMap: Record<string, string> = {
        'Proposta': 'proposta_gerada',
        'Relatório': 'relatorio_gerado',
        'Checklist': 'checklist_gerado',
        'Raio-X': 'raio_x_gerado',
        'Contrato': 'contrato_gerado',
      }
      const tipoAtividade = tipoMap[tipo]
      if (tipoAtividade) {
        fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/atividades`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.RAIO_X_PASSWORD}`,
          },
          body: JSON.stringify({
            clienteId: '',
            clienteNome: cliente,
            tipo: tipoAtividade,
            descricao: `${tipo} gerado(a)`,
          }),
        }).catch(() => {})
      }
    }
    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error('POST /api/documentos:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!verificarToken(request)) return respostaNaoAutorizada()
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

    const found = await findPage(id);
    if (!found) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });

    const res = await fetch(`https://api.notion.com/v1/pages/${found.pageId}`, {
      method: 'PATCH',
      headers: NH,
      body: JSON.stringify({ archived: true }),
    });
    if (!res.ok) return NextResponse.json({ error: 'Erro ao arquivar' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/documentos:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
