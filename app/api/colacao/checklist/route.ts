import { NextResponse } from 'next/server';
import { notionQueryDatabase } from '@/lib/notion';

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

type ChecklistItem = {
  pageId: string | null;
  nomeCompleto: string;
  chamarDe: string;
  whatsapp: string;
  instagram: string;
  horarioChegada: string;
  acompanhantes: string;
  fotoGarantida: string;
  fotosFormandos: string[];
  autorizacao: 'Sim' | 'Não' | '';
  fotoUrl: string | null;
  fotografado: boolean;
  status: 'ok' | 'sem_resposta';
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function extrairTexto(richText: any[] | undefined): string {
  if (!richText) return '';
  return richText.map((t: any) => t.plain_text ?? '').join('');
}

function extrairFotoUrl(files: any[] | undefined): string | null {
  if (!files || files.length === 0) return null;
  const primeiro = files[0];
  if (primeiro.type === 'external') return primeiro.external?.url ?? null;
  return primeiro.file?.url ?? null;
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

  const items: ChecklistItem[] = FORMANDOS.map(nome => {
    const entrada = maisRecentePorNome.get(nome);
    if (!entrada) {
      return {
        pageId: null,
        nomeCompleto: nome,
        chamarDe: '',
        whatsapp: '',
        instagram: '',
        horarioChegada: '',
        acompanhantes: '',
        fotoGarantida: '',
        fotosFormandos: [],
        autorizacao: '',
        fotoUrl: null,
        fotografado: false,
        status: 'sem_resposta',
      };
    }

    const props = entrada.page.properties ?? {};
    return {
      pageId: entrada.page.id,
      nomeCompleto: nome,
      chamarDe: extrairTexto(props['Chamar de']?.rich_text),
      whatsapp: extrairTexto(props['WhatsApp']?.rich_text),
      instagram: extrairTexto(props['Instagram']?.rich_text),
      horarioChegada: extrairTexto(props['Horário de chegada']?.rich_text),
      acompanhantes: extrairTexto(props['Acompanhantes']?.rich_text),
      fotoGarantida: extrairTexto(props['Foto garantida']?.rich_text),
      fotosFormandos: (props['Fotos com formandos']?.multi_select ?? []).map((o: any) => o.name),
      autorizacao: (props['Autorização']?.select?.name ?? '') as 'Sim' | 'Não' | '',
      fotoUrl: extrairFotoUrl(props['Arquivos e mídia']?.files),
      fotografado: Boolean(props['Fotografado']?.checkbox),
      status: 'ok',
    };
  });

  items.sort((a, b) => {
    if (a.status === 'sem_resposta' && b.status !== 'sem_resposta') return 1;
    if (b.status === 'sem_resposta' && a.status !== 'sem_resposta') return -1;
    return a.horarioChegada.localeCompare(b.horarioChegada);
  });

  return NextResponse.json({ items });
}
