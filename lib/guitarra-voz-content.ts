import type { ChordDiagramProps } from '@/components/guitarra-voz/ChordDiagram';
import acordesRaw from '@/content/guitarra-voz/acordes.json';
import modulosRaw from '@/content/guitarra-voz/modulos.json';
import musicasRaw from '@/content/guitarra-voz/musicas.json';

export type CategoriaAcorde = 'maior' | 'menor' | 'setima' | 'suspenso';

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
