import { NextResponse } from 'next/server';
import { notionQuery, NotionError } from '@/lib/notion';

type NotionPerguntaPage = {
  id: string;
  properties: Record<string, {
    title?: Array<{ plain_text: string }>;
    rich_text?: Array<{ plain_text: string }>;
    select?: { name: string } | null;
    number?: number | null;
    checkbox?: boolean;
  }>;
};

export async function GET() {
  const databaseId = process.env.NOTION_DB_PERGUNTAS_ALTEMANS;

  if (!databaseId) {
    console.error('NOTION_DB_PERGUNTAS_ALTEMANS ausente no ambiente.');
    return NextResponse.json({ error: 'Configuração ausente no servidor.' }, { status: 500 });
  }

  let data: { results?: NotionPerguntaPage[] };
  try {
    data = await notionQuery(databaseId, {
      sorts: [{ property: 'Ordem', direction: 'ascending' }],
      page_size: 100,
    });
  } catch (err) {
    const message = err instanceof NotionError ? err.message : String(err);
    console.error('Erro ao consultar perguntas:', message);
    return NextResponse.json({ error: 'Falha ao carregar perguntas.' }, { status: 502 });
  }

  const perguntas = (data.results ?? []).map((page) => {
    const props = page.properties;
    const opcoesRaw = props['Opções']?.rich_text?.[0]?.plain_text || '';
    return {
      id: page.id,
      ordem: props['Ordem']?.number ?? 0,
      chave: props['Chave']?.rich_text?.[0]?.plain_text || '',
      tipo: props['Tipo']?.select?.name || '',
      rotulo: props['Rótulo']?.rich_text?.[0]?.plain_text || '',
      pergunta: props['Pergunta']?.title?.[0]?.plain_text || '',
      dica: props['Dica']?.rich_text?.[0]?.plain_text || '',
      opcoes: opcoesRaw ? opcoesRaw.split(';').map((s) => s.trim()).filter(Boolean) : [],
      ativo: props['Ativo']?.checkbox ?? false,
    };
  });

  return NextResponse.json({ perguntas });
}
