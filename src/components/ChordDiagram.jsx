// ChordDiagram — clean SVG diagram of a chord shape.
// Props:
//   chord: chord object from chords-data
//   size: 'sm' | 'md' | 'lg' — output dimensions
//   theme: { ink, paper, accent, mute } — current palette
//   showFingers: bool — render finger numbers inside the dots

function ChordDiagram({ chord, size = 'md', theme, showFingers = true }) {
  const dims = {
    sm: { w: 88, h: 110, pad: 10, headerH: 14, dotR: 8, font: 10 },
    md: { w: 168, h: 210, pad: 16, headerH: 22, dotR: 13, font: 13 },
    lg: { w: 240, h: 300, pad: 22, headerH: 30, dotR: 18, font: 17 },
  }[size];

  const { w, h, pad, headerH, dotR, font } = dims;
  const ink = theme.ink;
  const paper = theme.paper;
  const accent = theme.accent;
  const muted = theme.muted;

  // Determine fret range. Default 1–4. If the lowest fretted note > 4, shift.
  const fretted = chord.frets.filter(f => typeof f === 'number' && f > 0);
  const minFret = fretted.length ? Math.min(...fretted) : 1;
  const maxFret = fretted.length ? Math.max(...fretted) : 1;
  const startFret = (minFret > 4) ? minFret : 1;
  const fretCount = Math.max(4, maxFret - startFret + 1);

  const gridX = pad;
  const gridY = pad + headerH;
  const gridW = w - pad * 2;
  const gridH = h - gridY - pad - 2;
  const stringGap = gridW / 5;
  const fretGap = gridH / fretCount;

  // Strings 0..5 — drawn left to right, low E (6) on left, high E (1) on right
  const stringX = i => gridX + stringGap * i;
  const fretY = i => gridY + fretGap * i;

  const stringLines = [];
  for (let i = 0; i < 6; i++) {
    stringLines.push(
      <line key={`s${i}`} x1={stringX(i)} y1={gridY} x2={stringX(i)} y2={gridY + gridH}
        stroke={ink} strokeWidth={i === 0 ? 1.4 : 1} strokeOpacity={0.85} />
    );
  }
  const fretLines = [];
  for (let i = 0; i <= fretCount; i++) {
    fretLines.push(
      <line key={`f${i}`} x1={gridX} y1={fretY(i)} x2={gridX + gridW} y2={fretY(i)}
        stroke={ink} strokeWidth={(i === 0 && startFret === 1) ? 3.5 : 1}
        strokeOpacity={i === 0 && startFret === 1 ? 1 : 0.65} />
    );
  }

  // header markers: O / X above each string
  const headers = chord.frets.map((f, i) => {
    const cx = stringX(i);
    const cy = gridY - headerH / 2 - 2;
    if (f === 'x') {
      const r = dotR * 0.55;
      return (
        <g key={`h${i}`}>
          <line x1={cx - r} y1={cy - r} x2={cx + r} y2={cy + r}
            stroke={muted} strokeWidth={1.6} strokeLinecap="round" />
          <line x1={cx - r} y1={cy + r} x2={cx + r} y2={cy - r}
            stroke={muted} strokeWidth={1.6} strokeLinecap="round" />
        </g>
      );
    }
    if (f === 0) {
      return (
        <circle key={`h${i}`} cx={cx} cy={cy} r={dotR * 0.55}
          fill="none" stroke={ink} strokeWidth={1.4} />
      );
    }
    return null;
  });

  // dots — pressed strings
  const dots = chord.frets.map((f, i) => {
    if (typeof f !== 'number' || f === 0) return null;
    const fretSlot = f - startFret + 1; // 1-indexed within the visible window
    const cx = stringX(i);
    const cy = fretY(fretSlot - 1) + fretGap / 2;
    const finger = chord.fingers && chord.fingers[i];
    return (
      <g key={`d${i}`}>
        <circle cx={cx} cy={cy} r={dotR} fill={accent} />
        {showFingers && finger ? (
          <text x={cx} y={cy + font * 0.35} fontSize={font}
            textAnchor="middle" fill={paper} fontWeight={600}
            fontFamily="Manrope, system-ui, sans-serif">
            {finger}
          </text>
        ) : null}
      </g>
    );
  });

  // barre arc (if any)
  let barre = null;
  if (chord.barre) {
    const fretSlot = chord.barre.fret - startFret + 1;
    const fromIdx = 6 - chord.barre.to;   // chord.barre uses 1=low E side
    const toIdx = 6 - chord.barre.from;
    const x1 = stringX(fromIdx);
    const x2 = stringX(toIdx);
    const cy = fretY(fretSlot - 1) + fretGap / 2;
    barre = (
      <rect x={x1 - dotR * 0.7} y={cy - dotR * 0.55}
        width={(x2 - x1) + dotR * 1.4} height={dotR * 1.1}
        rx={dotR * 0.55} fill={accent} opacity={0.85} />
    );
  }

  // start-fret label (shown to right of grid if > 1)
  const fretLabel = startFret > 1 ? (
    <text x={gridX + gridW + 6} y={fretY(0) + fretGap / 2 + font * 0.35}
      fontSize={font} fill={ink} fontFamily="Manrope, system-ui, sans-serif"
      fontWeight={500}>
      {startFret}fr
    </text>
  ) : null;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%"
      style={{ display: 'block' }}>
      <rect x="0" y="0" width={w} height={h} fill="transparent" />
      {headers}
      {fretLines}
      {stringLines}
      {barre}
      {dots}
      {fretLabel}
    </svg>
  );
}

export { ChordDiagram };
