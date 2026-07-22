import { NextResponse } from 'next/server';
import { notionCreate, NotionError } from '@/lib/notion';

function truncate(text: string, max = 1900): string {
  if (!text) return '';
  return text.length > max ? text.slice(0, max) + '...' : text;
}

function richText(value: string) {
  return [{ type: 'text', text: { content: truncate(String(value ?? '')) } }];
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dbId = process.env.NOTION_DB_AG_PROFESSORES;

    if (!dbId) {
      return NextResponse.json({ success: false, error: 'Variáveis de ambiente não configuradas.' }, { status: 500 });
    }

    if (!body.autoriza_uso) {
      return NextResponse.json({ success: false, error: 'É necessário responder se autoriza o uso de imagem e depoimento.' }, { status: 400 });
    }

    const properties: Record<string, unknown> = {
      'Nome completo': {
        title: [{ type: 'text', text: { content: truncate(String(body.nome_completo ?? '')) } }]
      },
      'Data de envio': { date: { start: new Date().toISOString() } },
      'Status do conteúdo': { select: { name: 'Recebido' } },
      'Autoriza uso de imagem e depoimento': { select: { name: body.autoriza_uso } },
    };

    const textFields: Record<string, string> = {
      'Nome de exibição': body.nome_exibicao,
      'Matéria ou área que leciona': body.materia_area,
      'Tempo de experiência': body.tempo_experiencia,
      'Formação acadêmica': body.formacao_academica,
      'Como começou a lecionar': body.como_comecou,
      'Momento decisivo na trajetória': body.momento_decisivo,
      'O que mais gosta em ensinar': body.o_que_mais_gosta,
      'Método de ensino': body.metodo_ensino,
      'Diferencial em relação a outros professores': body.diferencial,
      'Frase que resume a filosofia de ensino': body.frase_filosofia,
      'Situação real de resultado de aluno': body.situacao_resultado,
      'Certificações, prêmios ou reconhecimentos': body.certificacoes,
      'Depoimento de aluno': body.depoimento_aluno,
    };

    for (const [key, value] of Object.entries(textFields)) {
      if (value !== undefined && value !== null && value !== '') {
        properties[key] = { rich_text: richText(value) };
      }
    }

    const urlFields: Record<string, string> = {
      'Foto de perfil atual': body.foto_perfil_atual,
      'Instagram pessoal': body.instagram_pessoal,
    };

    for (const [key, value] of Object.entries(urlFields)) {
      if (value !== undefined && value !== null && value !== '') {
        properties[key] = { url: value };
      }
    }

    if (body.whatsapp) {
      properties['WhatsApp'] = { phone_number: body.whatsapp };
    }

    await notionCreate({ parent: { database_id: dbId }, properties });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof NotionError ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
