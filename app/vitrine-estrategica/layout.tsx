import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vitrine Estratégica',
  robots: { index: false, follow: false },
};

export default function VitrineEstrategicaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
