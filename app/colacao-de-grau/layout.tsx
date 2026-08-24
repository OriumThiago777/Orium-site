import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Formulário — Colação de Grau' },
  robots: { index: false, follow: false },
};

export default function ColacaoDeGrauLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
