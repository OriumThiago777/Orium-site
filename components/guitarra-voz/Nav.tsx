'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/app/guitarra-voz/guitarra-voz.module.css';

const LINKS = [
  { href: '/guitarra-voz/modulos', label: 'Módulos' },
  { href: '/guitarra-voz/repertorio', label: 'Repertório' },
  { href: '/guitarra-voz/acordes', label: 'Acordes' },
  { href: '/guitarra-voz/pratica', label: 'Prática' },
  { href: '/guitarra-voz/diagnostico', label: 'Diagnóstico' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        borderBottom: '1px solid var(--gv-border)',
        background: 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '1.1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <Link
          href="/guitarra-voz"
          className={styles.gvHeading}
          style={{ fontSize: '1.35rem', color: 'var(--gv-white)' }}
        >
          GUITARRA<span style={{ color: 'var(--gv-red)' }}>&</span>VOZ
        </Link>
        <nav style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap' }}>
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={styles.gvLabel}
                style={{ color: active ? 'var(--gv-amber)' : 'var(--gv-muted)' }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
