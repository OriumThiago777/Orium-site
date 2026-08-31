export interface ChordDiagramProps {
  name: string;
  frets: number[];
  fingers: number[];
  barre?: {
    fret: number;
    fromString: number;
    toString: number;
    finger: number;
  };
  startFret?: number;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP: Record<NonNullable<ChordDiagramProps['size']>, { width: number; height: number }> = {
  sm: { width: 80, height: 100 },
  md: { width: 120, height: 150 },
  lg: { width: 160, height: 200 },
};

const NUM_STRINGS = 6;
const NUM_FRETS = 5;
const GRID_LEFT = 15;
const GRID_RIGHT = 85;
const NUT_Y = 25;
const FRET_HEIGHT = 16;
const MARKER_Y = 15;
const DOT_RADIUS = 6.5;

function stringX(index: number): number {
  const spacing = (GRID_RIGHT - GRID_LEFT) / (NUM_STRINGS - 1);
  return GRID_LEFT + index * spacing;
}

function fretRowCenterY(rowIndex: number): number {
  return NUT_Y + rowIndex * FRET_HEIGHT + FRET_HEIGHT / 2;
}

export default function ChordDiagram({
  name,
  frets,
  fingers,
  barre,
  startFret = 1,
  size = 'md',
}: ChordDiagramProps) {
  const { width, height } = SIZE_MAP[size];
  const nutIsOpen = startFret === 1;

  return (
    <svg
      viewBox="0 0 100 130"
      width={width}
      height={height}
      role="img"
      aria-label={`Diagrama do acorde ${name}`}
      style={{ display: 'block' }}
    >
      <text x="50" y="8" textAnchor="middle" fontSize="9" fontWeight={700} fill="var(--gv-white, #F0EBE3)">
        {name}
      </text>

      {!nutIsOpen && (
        <text
          x={GRID_LEFT - 6}
          y={NUT_Y + FRET_HEIGHT / 2 + 3}
          textAnchor="end"
          fontSize="7"
          fill="var(--gv-muted, #676767)"
        >
          {startFret}fr
        </text>
      )}

      <rect
        x={GRID_LEFT}
        y={NUT_Y}
        width={GRID_RIGHT - GRID_LEFT}
        height={FRET_HEIGHT * NUM_FRETS}
        fill="none"
        stroke="var(--gv-muted, #676767)"
        strokeWidth={0.75}
      />

      {nutIsOpen && (
        <rect x={GRID_LEFT} y={NUT_Y - 1.5} width={GRID_RIGHT - GRID_LEFT} height={3} fill="var(--gv-white, #F0EBE3)" />
      )}

      {Array.from({ length: NUM_FRETS - 1 }, (_, i) => i + 1).map((row) => (
        <line
          key={`fretline-${row}`}
          x1={GRID_LEFT}
          x2={GRID_RIGHT}
          y1={NUT_Y + row * FRET_HEIGHT}
          y2={NUT_Y + row * FRET_HEIGHT}
          stroke="var(--gv-border, rgba(240,235,227,0.07))"
          strokeWidth={0.5}
        />
      ))}

      {Array.from({ length: NUM_STRINGS }, (_, i) => i).map((i) => (
        <line
          key={`string-${i}`}
          x1={stringX(i)}
          x2={stringX(i)}
          y1={NUT_Y}
          y2={NUT_Y + FRET_HEIGHT * NUM_FRETS}
          stroke="var(--gv-muted, #676767)"
          strokeWidth={0.5}
        />
      ))}

      {frets.map((fret, i) => {
        const x = stringX(i);
        if (fret === -1) {
          return (
            <g key={`mute-${i}`} stroke="var(--gv-red, #C41A1A)" strokeWidth={1.4} strokeLinecap="round">
              <line x1={x - 3} y1={MARKER_Y - 3} x2={x + 3} y2={MARKER_Y + 3} />
              <line x1={x - 3} y1={MARKER_Y + 3} x2={x + 3} y2={MARKER_Y - 3} />
            </g>
          );
        }
        if (fret === 0) {
          return (
            <circle
              key={`open-${i}`}
              cx={x}
              cy={MARKER_Y}
              r={3.5}
              fill="none"
              stroke="var(--gv-white, #F0EBE3)"
              strokeWidth={1.2}
            />
          );
        }
        return null;
      })}

      {barre && (
        <rect
          x={stringX(barre.fromString) - DOT_RADIUS}
          y={fretRowCenterY(barre.fret - startFret) - DOT_RADIUS}
          width={stringX(barre.toString) - stringX(barre.fromString) + DOT_RADIUS * 2}
          height={DOT_RADIUS * 2}
          rx={DOT_RADIUS}
          fill="var(--gv-amber, #CF6A0A)"
        />
      )}

      {frets.map((fret, i) => {
        if (fret <= 0) return null;
        const isBarreString = barre && fret === barre.fret && i >= barre.fromString && i <= barre.toString;
        if (isBarreString) return null;

        const x = stringX(i);
        const y = fretRowCenterY(fret - startFret);
        const finger = fingers[i];

        return (
          <g key={`dot-${i}`}>
            <circle cx={x} cy={y} r={DOT_RADIUS} fill="var(--gv-amber, #CF6A0A)" />
            {finger > 0 && (
              <text x={x} y={y + 3} textAnchor="middle" fontSize="7" fontWeight={700} fill="var(--gv-bg, #0A0A0A)">
                {finger}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
