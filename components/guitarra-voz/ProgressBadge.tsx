export type ProgressState = 'nao-dominado' | 'em-desenvolvimento' | 'dominado';

const STATE_CONFIG: Record<ProgressState, { label: string; color: string; bg: string }> = {
  'nao-dominado': { label: 'Não dominado', color: 'var(--gv-muted, #676767)', bg: 'rgba(103,103,103,0.12)' },
  'em-desenvolvimento': { label: 'Em desenvolvimento', color: 'var(--gv-amber, #CF6A0A)', bg: 'rgba(207,106,10,0.12)' },
  dominado: { label: 'Dominado', color: '#4CAF6D', bg: 'rgba(76,175,109,0.12)' },
};

interface ProgressBadgeProps {
  state: ProgressState;
}

export default function ProgressBadge({ state }: ProgressBadgeProps) {
  const config = STATE_CONFIG[state];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.3rem 0.7rem',
        fontSize: '0.7rem',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: config.color,
        background: config.bg,
        border: `1px solid ${config.color}33`,
      }}
    >
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: config.color }} />
      {config.label}
    </span>
  );
}
