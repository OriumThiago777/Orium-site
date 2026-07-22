import type { Metadata } from 'next';

const title = 'Briefing Estratégico — AG Ensino Personalizado';
const description =
  'Formulário de briefing estratégico da AG com a ORIUM. Leva cerca de 20 minutos e é a base do posicionamento, conteúdo e estratégia digital do projeto.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/briefing-ag',
  },
  openGraph: {
    title,
    description,
    url: 'https://oriumagencia.com.br/briefing-ag',
    siteName: 'ORIUM',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ORIUM - Estrutura digital para negócios locais',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og-image.jpg'],
  },
};

export default function BriefingAGLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
