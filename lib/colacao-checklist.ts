/* eslint-disable @typescript-eslint/no-explicit-any */

// Lógica compartilhada do checklist granular de /colacao-de-grau/checklist —
// usada tanto pelo GET (app/api/colacao/checklist/route.ts) quanto pelo toggle
// atômico (app/api/colacao/checklist/toggle/route.ts), para as duas rotas
// nunca divergirem sobre quais itens existem nem sobre o que conta como "completo".

export type Checklist = {
  individual: boolean;
  prioridade?: boolean;
  formandos: Record<string, boolean>;
  acompanhantes: Record<string, boolean>;
};

export function extrairTexto(richText: any[] | undefined): string {
  if (!richText) return '';
  return richText.map((t: any) => t.plain_text ?? '').join('');
}

export function parsearAcompanhantes(texto: string): string[] {
  const trimmed = texto.trim();
  if (!trimmed) return [];

  const comParenteses = trimmed.match(/[^,()]+\([^)]*\)/g);
  if (comParenteses && comParenteses.length > 0) {
    return comParenteses.map(item => item.trim()).filter(Boolean);
  }

  return trimmed.split(',').map(item => item.trim()).filter(Boolean);
}

/** Reconstrói o checklist completo de uma pessoa cruzando os dados reais da
 * resposta dela (quais itens SE aplicam) com o JSON já salvo em "Checklist
 * Fotos" (quais já estão marcados). Sempre retorna o conjunto de chaves
 * correto, mesmo que o JSON salvo esteja parcial, vazio ou corrompido. */
export function montarChecklist(
  checklistFotosRaw: string,
  acompanhantesTexto: string,
  fotoGarantida: string,
  fotosFormandos: string[],
): Checklist {
  let existente: any = {};
  if (checklistFotosRaw) {
    try {
      existente = JSON.parse(checklistFotosRaw);
    } catch {
      console.warn('Checklist Fotos com JSON inválido — reiniciando checklist para esta pessoa.');
      existente = {};
    }
  }

  const checklist: Checklist = {
    individual: Boolean(existente.individual),
    formandos: {},
    acompanhantes: {},
  };

  if (fotoGarantida) checklist.prioridade = Boolean(existente.prioridade);

  for (const nome of fotosFormandos) {
    checklist.formandos[nome] = Boolean(existente.formandos?.[nome]);
  }

  for (const nome of parsearAcompanhantes(acompanhantesTexto)) {
    checklist.acompanhantes[nome] = Boolean(existente.acompanhantes?.[nome]);
  }

  return checklist;
}

export function calcularCompleto(checklist: Checklist): boolean {
  if (!checklist.individual) return false;
  if (checklist.prioridade !== undefined && !checklist.prioridade) return false;
  if (!Object.values(checklist.formandos).every(Boolean)) return false;
  return Object.values(checklist.acompanhantes).every(Boolean);
}
