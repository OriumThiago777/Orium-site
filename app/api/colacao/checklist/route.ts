import { NextResponse } from 'next/server';
import { notionQueryDatabase } from '@/lib/notion';
import { type Checklist, extrairTexto, montarChecklist } from '@/lib/colacao-checklist';

const NOTION_DB_COLACAO = process.env.NOTION_DB_COLACAO;

const FORMANDOS = [
  'Amanda Carina dos Santos',
  'Ana Luiza Gouvêa',
  'Bruno Silva',
  'Daniel de Almeida',
  'Isabelle Moreira',
  'Kathleen Ohana',
  'Luis Souza',
  'Tarcisio Pieroni',
  'Thiago Pedro',
];

type ChecklistPessoa = {
  pageId: string | null;
  nomeCompleto: string;
  chamarDe: string;
  horarioChegada: string;
  fotoGarantida: string;
  autorizacao: 'Sim' | 'Não' | '';
  fotoUrl: string | null;
  fotografado: boolean;
  status: 'ok' | 'sem_resposta';
  checklist: Checklist | null;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function extrairFotoUrl(files: any[] | undefined): string | null {
  if (!files || files.length === 0) return null;
  const primeiro = files[0];
  if (primeiro.type === 'external') return primeiro.external?.url ?? null;
  return primeiro.file?.url ?? null;
}

function contarProgresso(items: ChecklistPessoa[]) {
  let itensTotal = 0;
  let itensMarcados = 0;
  let formandosConcluidos = 0;

  for (const pessoa of items) {
    if (pessoa.status === 'sem_resposta' || !pessoa.checklist) continue;

    itensTotal += 1;
    if (pessoa.checklist.individual) itensMarcados += 1;

    if (pessoa.checklist.prioridade !== undefined) {
      itensTotal += 1;
      if (pessoa.checklist.prioridade) itensMarcados += 1;
    }

    for (const marcado of Object.values(pessoa.checklist.formandos)) {
      itensTotal += 1;
      if (marcado) itensMarcados += 1;
    }

    for (const marcado of Object.values(pessoa.checklist.acompanhantes)) {
      itensTotal += 1;
      if (marcado) itensMarcados += 1;
    }

    if (pessoa.fotografado) formandosConcluidos += 1;
  }

  return { itensTotal, itensMarcados, formandosTotal: items.length, formandosConcluidos };
}

export async function GET() {
  if (!NOTION_DB_COLACAO) {
    return NextResponse.json({ error: 'Configuração ausente no servidor' }, { status: 500 });
  }

  let pages: any[];
  try {
    pages = await notionQueryDatabase(NOTION_DB_COLACAO);
  } catch (error) {
    console.error('Notion error:', error);
    return NextResponse.json({ error: 'Erro ao consultar o Notion' }, { status: 500 });
  }

  const maisRecentePorNome = new Map<string, { page: any; enviadoEm: string }>();

  for (const page of pages) {
    const props = page.properties ?? {};
    const nomeCompleto = extrairTexto(props['Nome completo']?.title);
    if (!nomeCompleto) continue;
    if (nomeCompleto === 'TESTE VERIFICACAO - APAGAR') continue;
    if (!FORMANDOS.includes(nomeCompleto)) continue;

    const enviadoEm = props['Enviado em']?.date?.start ?? '';
    const existente = maisRecentePorNome.get(nomeCompleto);
    if (existente && existente.enviadoEm >= enviadoEm) continue;
    maisRecentePorNome.set(nomeCompleto, { page, enviadoEm });
  }

  const items: ChecklistPessoa[] = FORMANDOS.map(nome => {
    const entrada = maisRecentePorNome.get(nome);
    if (!entrada) {
      return {
        pageId: null,
        nomeCompleto: nome,
        chamarDe: '',
        horarioChegada: '',
        fotoGarantida: '',
        autorizacao: '',
        fotoUrl: null,
        fotografado: false,
        status: 'sem_resposta',
        checklist: null,
      };
    }

    const props = entrada.page.properties ?? {};
    const acompanhantes = extrairTexto(props['Acompanhantes']?.rich_text);
    const fotoGarantida = extrairTexto(props['Foto garantida']?.rich_text);
    const fotosFormandos: string[] = (props['Fotos com formandos']?.multi_select ?? []).map((o: any) => o.name);
    const checklistFotosRaw = extrairTexto(props['Checklist Fotos']?.rich_text);

    return {
      pageId: entrada.page.id,
      nomeCompleto: nome,
      chamarDe: extrairTexto(props['Chamar de']?.rich_text),
      horarioChegada: extrairTexto(props['Horário de chegada']?.rich_text),
      fotoGarantida,
      autorizacao: (props['Autorização']?.select?.name ?? '') as 'Sim' | 'Não' | '',
      fotoUrl: extrairFotoUrl(props['Arquivos e mídia']?.files),
      fotografado: Boolean(props['Fotografado']?.checkbox),
      status: 'ok',
      checklist: montarChecklist(checklistFotosRaw, acompanhantes, fotoGarantida, fotosFormandos),
    };
  });

  items.sort((a, b) => {
    if (a.status === 'sem_resposta' && b.status !== 'sem_resposta') return 1;
    if (b.status === 'sem_resposta' && a.status !== 'sem_resposta') return -1;
    return a.horarioChegada.localeCompare(b.horarioChegada);
  });

  return NextResponse.json({ items, progress: contarProgresso(items) });
}
