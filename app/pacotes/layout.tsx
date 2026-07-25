import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pacotes de Serviço',
  robots: { index: false, follow: false },
};

export default function PacotesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
