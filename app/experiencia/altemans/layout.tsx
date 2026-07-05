import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Avaliação da experiência — Alteman's Barbearia",
};

export default function ExperienciaAltemansLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
