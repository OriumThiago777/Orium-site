import type { ChordDiagramProps } from '@/components/guitarra-voz/ChordDiagram';
import acordesRaw from '@/content/guitarra-voz/acordes.json';

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

const acordes: Acorde[] = acordesRaw satisfies Acorde[];

export function getAcordes(): Acorde[] {
  return acordes;
}

export function getAcordeBySlug(slug: string): Acorde | undefined {
  return acordes.find((a) => a.slug === slug);
}
