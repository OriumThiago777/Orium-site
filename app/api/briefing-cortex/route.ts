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
    const dbId = process.env.NOTION_DB_CORTEX;

    if (!dbId) {
      return NextResponse.json({ success: false, error: 'Variáveis de ambiente não configuradas.' }, { status: 500 });
    }

    const properties: Record<string, unknown> = {
      'Nome': {
        title: [{ type: 'text', text: { content: 'Briefing Córtex Hub — ' + new Date().toLocaleDateString('pt-BR') } }]
      },
      'Data de envio': { date: { start: new Date().toISOString() } },
    };

    const fields: Record<string, string> = {
      'Frase da marca': body.frase_marca,
      'História de origem': body.historia_origem,
      'Adjetivos da personalidade': body.adjetivos,
      'O que a Córtex defende': body.o_que_defende,
      'Frase de propósito': body.frase_proposito,
      'Concorrentes diretos': body.concorrentes,
      'Transformação do aluno': body.transformacao_aluno,
      'Posição desejada em 2 anos': body.posicao_2anos,
      'Bordão ou conceito natural': body.bordao,
      'O que jamais faria': body.jamais_faria,
      'Tom indesejado': Array.isArray(body.tom_indesejado) ? body.tom_indesejado.join(' | ') : body.tom_indesejado,
      'Comentário tom indesejado': body.tom_indesejado_comentario,
      'Referências de comunicação': body.referencias_comunicacao,
      'Momento de origem da Córtex': body.momento_origem,
      'Experiência SAMU': body.experiencia_samu,
      'Crença central de ensino': body.crenca_ensino,
      'Conhecimento único': body.conhecimento_unico,
      'Conforto com câmera': body.conforto_camera,
      'Comentário câmera': body.conforto_camera_comentario,
      'Assunto que fala por horas': body.assunto_horas,
      'Pergunta mais recebida': body.pergunta_recebida,
      'Erro que treinamento resolveria': body.erro_treinamento,
      'Outros professores': body.outros_professores,
      'Autoridade outros professores': body.autoridade_professores,
      'Aluno típico': body.aluno_tipico,
      'Dor humana real': body.dor_humana,
      'O que quer sentir depois': body.sentir_depois,
      'Principal objeção': Array.isArray(body.objecao) ? body.objecao.join(' | ') : body.objecao,
      'Objeção outro': body.objecao_outro,
      'Consumo de conteúdo Instagram': body.consumo_instagram,
      'Quem decide contratação corporativa': body.decide_corporativo,
      'Como chega à Córtex corporativo': body.chega_corporativo,
      'Motivação corporativa': Array.isArray(body.motivacao_corporativo) ? body.motivacao_corporativo.join(' | ') : body.motivacao_corporativo,
      'Motivação corporativa outro': body.motivacao_corporativo_outro,
      'Maior medo contratante': body.medo_contratante,
      'Case corporativo': body.case_corporativo,
      'Público geral — quem é': body.publico_geral_quem,
      'Público geral — motivação': body.publico_geral_motivacao,
      'Público geral — demanda': body.publico_geral_demanda,
      'Portfólio de cursos': truncate(JSON.stringify(body.cursos ?? {}), 1900),
      'Cursos com maior potencial': body.cursos_potencial,
      'Curso com vaga sobrando': body.curso_vaga,
      'Curso mais pedido inexistente': body.curso_pedido,
      'Lançamento previsto': body.lancamento_previsto,
      'O que torna a prática diferente': body.pratica_diferente,
      'Parte mais comentada positivamente': body.parte_comentada,
      'Maior gerador de confiança': body.gerador_confianca,
      'Frequência de postagem': body.frequencia_postagem,
      'Quem cria conteúdo': body.quem_cria,
      'Tipos de post feitos': Array.isArray(body.tipos_post) ? body.tipos_post.join(' | ') : body.tipos_post,
      'O que funcionou': body.o_que_funcionou,
      'O que não funcionou': body.o_que_nao_funcionou,
      'Banco de fotos e vídeos': body.banco_midia,
      'Depoimentos disponíveis': body.depoimentos,
      'Fotos do espaço físico': body.fotos_espaco,
      'Fotos do Prof. Marcelo': body.fotos_marcelo,
      'Site atual': body.site_atual,
      'WhatsApp Business': body.whatsapp_business,
      'Lista de transmissão': body.lista_transmissao,
      'Tráfego pago': body.trafego_pago,
      'Resultado tráfego pago': body.trafego_pago_resultado,
      'Total de alunos': body.total_alunos,
      'Números de prova': body.numeros_prova,
      'Aluno em emergência real': body.aluno_emergencia,
      'Parcerias institucionais': body.parcerias,
      'Publicações e eventos Marcelo': body.publicacoes_marcelo,
      'Google Meu Negócio': body.google_negocio,
      'Principal objetivo 6 meses': Array.isArray(body.objetivo_6meses) ? body.objetivo_6meses.join(' | ') : body.objetivo_6meses,
      'Objetivo outro': body.objetivo_outro,
      'Métrica de sucesso': body.metrica_sucesso,
      'Evento nos próximos 60 dias': body.evento_60dias,
      '3 palavras na comunicação': body.palavras_sim,
      '3 palavras jamais': body.palavras_nao,
      'Sensação ao ver post': body.sensacao_post,
      'Referência visual': body.referencia_visual,
      'Posts por semana': body.posts_semana,
      'Frequência vídeos Marcelo': body.frequencia_videos,
      'Equipe para produção': body.equipe_producao,
      'Datas fixas de turmas': body.datas_turmas,
      'O que querem que digam': body.o_que_digam,
      'Frustração com comunicação': body.frustracao,
      'Mudança de percepção desejada': body.mudanca_percepcao,
      'Informação adicional': body.info_adicional,
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
