import type { Metadata } from 'next';
import { Bebas_Neue, Inter } from 'next/font/google';
import styles from './guitarra-voz.module.css';
import Nav from '@/components/guitarra-voz/Nav';
import Footer from '@/components/guitarra-voz/Footer';

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--gv-font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--gv-font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { absolute: 'Guitarra e Voz — Do Primeiro Acorde à Primeira Apresentação' },
  description:
    'Plataforma de ensino de guitarra e canto: 9 módulos progressivos, repertório com cifras, diagramas de acordes e rotinas de prática.',
};

export default function GuitarraVozLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${bebasNeue.variable} ${inter.variable} ${styles.gvRoot}`}>
      <Nav />
      {children}
      <Footer />
    </div>
  );
}
