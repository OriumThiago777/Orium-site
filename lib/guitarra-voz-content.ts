import type { ChordDiagramProps } from '@/components/guitarra-voz/ChordDiagram';
import acordesRaw from '@/content/guitarra-voz/acordes.json';
import modulosRaw from '@/content/guitarra-voz/modulos.json';

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
