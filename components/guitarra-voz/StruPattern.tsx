export type Stroke = 'down' | 'up' | 'mute' | 'rest';

interface StruPatternProps {
  strokes: Stroke[];
  label?: string;
}

const STROKE_SYMBOL: Record<Stroke, string> = {
  down: '↓',
  up: '↑',
  mute: 'X',
  rest: '',
};

const BEAT_LABELS = ['1', '+', '2', '+', '3', '+', '4', '+'];

export default function StruPattern({ strokes, label }: StruPatternProps) {
  return (
    <div style={{ display: 'inline-block' }}>
      {label && (
        <p
          style={{
            fontSize: '0.72rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--gv-muted, #676767)',
            margin: '0 0 0.5rem',
          }}
        >
          {label}
        </p>
      )}
      <div style={{ display: 'flex', gap: '0.9rem' }}>
        {strokes.map((stroke, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '1.4rem' }}>
            <span
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                lineHeight: 1,
                color:
                  stroke === 'mute'
                    ? 'var(--gv-red, #C41A1A)'
                    : stroke === 'rest'
                      ? 'transparent'
                      : 'var(--gv-amber, #CF6A0A)',
              }}
            >
              {STROKE_SYMBOL[stroke] ?? '·'}
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--gv-muted, #676767)', marginTop: '0.35rem' }}>
              {BEAT_LABELS[i] ?? ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
