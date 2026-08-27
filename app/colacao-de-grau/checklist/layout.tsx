import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Checklist — Colação de Grau' },
  robots: { index: false, follow: false },
};

export default function ChecklistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
