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
    const dbId = process.env.NOTION_DB_AG;

    if (!dbId) {
      return NextResponse.json({ success: false, error: 'Variáveis de ambiente não configuradas.' }, { status: 500 });
    }

    const properties: Record<string, unknown> = {
      'Nome': {
        title: [{ type: 'text', text: { content: 'Briefing AG — ' + new Date().toLocaleDateString('pt-BR') } }]
      },
      'Data de envio': { date: { start: new Date().toISOString() } },
    };

    const fields: Record<string, string> = {
      'Frase-síntese da AG': body.o_que_e_ag,
      'O que sentiriam falta se a AG sumisse amanhã': body.falta_se_sumisse,
      'Diferencial frente a outras opções em BH': body.diferencial_principal,
      'Tagline ou frase-síntese já usada': body.tagline_atual,
      'O que mais pesa na escolha (preço, espaço, professores, conveniência, indicação, outro)': body.peso_escolha,
      'Trajetória de quem fundou/gerencia a AG': body.trajetoria_gestora,
      'Credencial ou experiência que sustenta autoridade': body.credencial_autoridade,
      'Motivação de origem — por que a AG começou': body.historia_origem,
      'Aluno típico — quem é': body.perfil_aluno,
      'Professor típico — quem é': body.perfil_professor,
      'Público prioridade de crescimento': body.publico_prioridade,
      'Objeção do aluno antes de fechar': body.objecao_aluno,
      'Objeção do professor antes de fechar': body.objecao_professor,
      'Depoimento real de aluno/professor satisfeito': body.depoimento_satisfeitos,
      'Serviços oferecidos hoje (aulas, co-working, mentorias, etc)': body.servicos_oferecidos,
      'Serviço com mais demanda hoje': body.servico_mais_demanda,
      'Serviço com potencial não explorado': body.servico_potencial,
      'Estado atual do Instagram @ag_ensino_personalizado': body.status_instagram,
      'O site anaglades.com.br reflete bem a AG hoje': body.site_reflete,
      'Como funciona o atendimento via WhatsApp': body.atendimento_whatsapp,
      'Fotos do espaço físico disponíveis para uso': body.fotos_espaco,
      'Depoimentos, números ou resultados como prova social': body.depoimentos_numeros,
      'Parcerias, certificações ou reconhecimentos': body.parcerias_certificacoes,
      'Mídia ou imprensa que já falou da AG': body.midia_imprensa,
      'Objetivo concreto nos próximos 3-6 meses': body.objetivo_3_6_meses,
      'Maior gargalo que impede crescer mais rápido': body.maior_gargalo,
      'Co-working é prioridade ou complemento': body.coworking_prioridade,
      'Referência visual que admiram': body.referencia_visual,
      'O que NÃO querem no conteúdo': body.o_que_nao_querem,
      'Tom de voz ideal': body.tom_voz,
      'Frequência de produção de conteúdo': body.frequencia_producao,
      'Quem aprova o conteúdo': body.quem_aprova,
      'Sazonalidade que influencia a demanda': body.sazonalidade,
      'Melhor canal e horário para aprovações': body.canal_horario_aprovacao,
    };

    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined && value !== null && value !== '') {
        properties[key] = { rich_text: richText(value) };
      }
    }

    await notionCreate({ parent: { database_id: dbId }, properties });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof NotionError ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
