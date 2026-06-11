import { NextResponse } from 'next/server';
import { verificarToken, respostaNaoAutorizada } from '@/lib/api-auth';
import { notionQuery, NotionError } from '@/lib/notion';

const DATABASE_ID = process.env.NOTION_DB_CLIENTES;

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

function isoToBR(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function csvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(request: Request) {
  if (!verificarToken(request)) return respostaNaoAutorizada()
  try {
    let data;
    try {
      data = await notionQuery(DATABASE_ID!, {
        sorts: [{ property: 'Data de Início', direction: 'descending' }],
        page_size: 100,
      });
    } catch (err) {
      if (err instanceof NotionError) {
        console.error('Notion export error:', err.message);
        return NextResponse.json({ error: 'Erro ao buscar clientes' }, { status: 500 });
      }
      throw err;
    }
    const pages: NotionPage[] = data.results ?? [];

    const headers = [
      'Nome', 'Status', 'Fase Atual', 'Instagram', 'E-mail', 'Contato',
      'Data de Início', 'Última Interação', 'Próximo Deliverable',
      'Valor Mensal', 'Precisa Relatório', 'Notas',
    ];

    const rows = pages.map(page => {
      const p = page.properties;
      const notas = (p['Notas']?.rich_text?.[0]?.plain_text ?? '').replace(/\n/g, ' | ');
      const fields = [
        p['Nome']?.title?.[0]?.plain_text ?? '',
        p['Status']?.select?.name ?? '',
        p['Fase Atual']?.select?.name ?? '',
        p['Instagram']?.rich_text?.[0]?.plain_text ?? '',
        p['E-mail']?.email ?? '',
        p['Contato']?.phone_number ?? '',
        isoToBR(p['Data de Início']?.date?.start ?? ''),
        isoToBR(p['Última Interação']?.date?.start ?? ''),
        isoToBR(p['Próximo Deliverable']?.date?.start ?? ''),
        p['Valor Mensal']?.number !== null && p['Valor Mensal']?.number !== undefined
          ? String(p['Valor Mensal'].number)
          : '',
        p['Precisa Relatório']?.checkbox ? 'Sim' : 'Não',
        notas,
      ];
      return fields.map(csvField).join(',');
    });

    const today = new Date().toISOString().split('T')[0];
    // UTF-8 BOM so Excel opens accented characters correctly
    const bom = '﻿';
    const csv = bom + [headers.map(csvField).join(','), ...rows].join('\r\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="clientes-orium-${today}.csv"`,
      },
    });
  } catch (err) {
    console.error('GET /api/clientes/export:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
