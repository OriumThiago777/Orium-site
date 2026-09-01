import type { ChordDiagramProps } from '@/components/guitarra-voz/ChordDiagram';
import acordesRaw from '@/content/guitarra-voz/acordes.json';
import escalasRaw from '@/content/guitarra-voz/escalas-modos.json';
import modulosRaw from '@/content/guitarra-voz/modulos.json';
import musicasRaw from '@/content/guitarra-voz/musicas.json';

export type CategoriaAcorde = 'maior' | 'menor' | 'setima' | 'suspenso';

export const CATEGORIA_ORDEM: CategoriaAcorde[] = ['maior', 'menor', 'setima', 'suspenso'];

export interface Acorde {
  slug: string;
  name: string;
  frets: number[];
  fingers: number[];
  barre?: NonNullable<ChordDiagramProps['barre']>;
  startFret?: number;
  categoria: CategoriaAcorde;
}

// JSON values are widened to string by resolveJsonModule, breaking satisfies on CategoriaAcorde literal union; cast is necessary.
const acordes: Acorde[] = acordesRaw as Acorde[];

export function getAcordes(): Acorde[] {
  return acordes;
}

export function getAcordeBySlug(slug: string): Acorde | undefined {
  return acordes.find((a) => a.slug === slug);
}

export interface Modulo {
  numero: number;
  slug: string;
  titulo: string;
  topicos: string[];
  acordesIntroduzidos: string[];
  conquistaFinal: string;
  preRequisito: number | null;
}

const modulos: Modulo[] = modulosRaw satisfies Modulo[];

export function getModulos(): Modulo[] {
  return [...modulos].sort((a, b) => a.numero - b.numero);
}

export function getModuloByNumero(numero: number): Modulo | undefined {
  return modulos.find((m) => m.numero === numero);
}

export type Dificuldade = 'muito-facil' | 'facil' | 'intermediaria' | 'desafio';

export const DIFICULDADE_LABEL: Record<Dificuldade, string> = {
  'muito-facil': 'Muito fácil',
  facil: 'Fácil',
  intermediaria: 'Intermediária',
  desafio: 'Desafio',
};

export const DIFICULDADE_ORDEM: Dificuldade[] = ['muito-facil', 'facil', 'intermediaria', 'desafio'];

export interface Musica {
  slug: string;
  titulo: string;
  artista: string;
  dificuldade: Dificuldade;
  bpm: number;
  acordes: string[];
  estrategiaEstudo: string;
  linkCifraClub: string;
}

// JSON values are widened to string by resolveJsonModule, breaking satisfies on Dificuldade literal union; cast is necessary.
const musicas: Musica[] = musicasRaw as Musica[];

export function getMusicas(): Musica[] {
  return musicas;
}

export function getMusicaBySlug(slug: string): Musica | undefined {
  return musicas.find((m) => m.slug === slug);
}

export type CategoriaEscala = 'diatonica' | 'pentatonica' | 'blues' | 'simetrica' | 'modo-grego';

export interface Escala {
  slug: string;
  nome: string;
  categoria: CategoriaEscala;
  intervalos: string[];
  descricao: string;
}

// JSON values are widened to string by resolveJsonModule, breaking satisfies on CategoriaEscala literal union; cast is necessary.
const escalas: Escala[] = escalasRaw as Escala[];

export function getEscalas(): Escala[] {
  return escalas;
}

function validateContent(): void {
  const acordeSlugs = new Set<string>();
  for (const acorde of acordes) {
    if (!CATEGORIA_ORDEM.includes(acorde.categoria)) {
      throw new Error(
        `content/guitarra-voz/acordes.json: categoria inválida "${acorde.categoria}" no acorde "${acorde.slug}"`,
      );
    }
    if (acordeSlugs.has(acorde.slug)) {
      throw new Error(`content/guitarra-voz/acordes.json: slug duplicado "${acorde.slug}"`);
    }
    acordeSlugs.add(acorde.slug);
  }

  const moduloNumeros = new Set<number>();
  for (const modulo of modulos) {
    if (moduloNumeros.has(modulo.numero)) {
      throw new Error(`content/guitarra-voz/modulos.json: numero duplicado ${modulo.numero}`);
    }
    moduloNumeros.add(modulo.numero);
  }

  const musicaSlugs = new Set<string>();
  for (const musica of musicas) {
    if (!DIFICULDADE_ORDEM.includes(musica.dificuldade)) {
      throw new Error(
        `content/guitarra-voz/musicas.json: dificuldade inválida "${musica.dificuldade}" na música "${musica.slug}"`,
      );
    }
    if (musicaSlugs.has(musica.slug)) {
      throw new Error(`content/guitarra-voz/musicas.json: slug duplicado "${musica.slug}"`);
    }
    musicaSlugs.add(musica.slug);
  }

  const categoriasEscalaValidas: CategoriaEscala[] = ['diatonica', 'pentatonica', 'blues', 'simetrica', 'modo-grego'];
  const escalaSlugs = new Set<string>();
  for (const escala of escalas) {
    if (!categoriasEscalaValidas.includes(escala.categoria)) {
      throw new Error(
        `content/guitarra-voz/escalas-modos.json: categoria inválida "${escala.categoria}" na escala "${escala.slug}"`,
      );
    }
    if (escalaSlugs.has(escala.slug)) {
      throw new Error(`content/guitarra-voz/escalas-modos.json: slug duplicado "${escala.slug}"`);
    }
    escalaSlugs.add(escala.slug);
  }
}

validateContent();
