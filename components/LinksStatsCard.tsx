import type { TipoLink } from '@/lib/links-data';

interface LinksStatsCardProps {
  totalLinks: number;
  totalGrupos: number;
  porTipo: Record<TipoLink, number>;
  grupoComMaisLinks: { titulo: string; quantidade: number } | null;
}

const labelStyle: React.CSSProperties = {
  color: '#555',
  fontSize: '0.68rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  margin: '0 0 0.4rem',
};

const dividerStyle: React.CSSProperties = {
  width: '1px',
  alignSelf: 'stretch',
  background: '#1e1e1e',
};

export default function LinksStatsCard({ totalLinks, totalGrupos, porTipo, grupoComMaisLinks }: LinksStatsCardProps) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid #1e1e1e',
        borderRadius: '12px',
        padding: '1.5rem 1.75rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1.75rem',
        alignItems: 'center',
        marginBottom: '2.5rem',
      }}
    >
      <div>
        <p style={labelStyle}>Total de links</p>
        <p style={{ color: '#FF6B00', fontFamily: 'Anton, sans-serif', fontSize: '2.25rem', margin: 0, lineHeight: 1 }}>
          {totalLinks}
        </p>
      </div>

      <div style={dividerStyle} />

      <div>
        <p style={labelStyle}>Grupos</p>
        <p style={{ color: '#fff', fontFamily: 'Anton, sans-serif', fontSize: '1.5rem', margin: 0, lineHeight: 1 }}>
          {totalGrupos}
        </p>
      </div>

      <div style={dividerStyle} />

      <div>
        <p style={labelStyle}>Por tipo</p>
        <p style={{ color: '#ccc', fontSize: '0.85rem', margin: 0 }}>
          {porTipo.interno} interno · {porTipo.cliente} cliente · {porTipo.externo} externo
        </p>
      </div>

      {grupoComMaisLinks && (
        <>
          <div style={dividerStyle} />
          <div>
            <p style={labelStyle}>Maior grupo</p>
            <p style={{ color: '#ccc', fontSize: '0.85rem', margin: 0 }}>
              {grupoComMaisLinks.titulo} ({grupoComMaisLinks.quantidade})
            </p>
          </div>
        </>
      )}
    </div>
  );
}
