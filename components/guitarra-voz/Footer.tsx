import styles from '@/app/guitarra-voz/guitarra-voz.module.css';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--gv-border)', marginTop: '4rem' }}>
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '2.5rem 1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <p className={styles.gvSmall}>Guitarra e Voz — Do Primeiro Acorde à Primeira Apresentação</p>
        <p className={styles.gvSmall}>9 módulos · 24 semanas · repertório real</p>
      </div>
    </footer>
  );
}
