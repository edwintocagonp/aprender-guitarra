// Chord database for "Aprende Guitarra Acústica"
// frets: array of 6 entries, from low E (6th string) to high E (1st string)
//   - number = fret pressed (1+)
//   - 0 = open string
//   - 'x' = muted / not played
// fingers: same shape — finger number (1-4) on each pressed string
// open: list of open string indices (display)
// barre (optional): { fret, from, to } — barre across strings (1-based, low-E side)

const BASIC_CHORDS = [
  {
    id: 'C', name: 'Do mayor', symbol: 'C', category: 'basic', difficulty: 1,
    frets: ['x', 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0],
    notes: 'C E G',
    tip: 'Apoya los dedos en la punta para no apagar las cuerdas abiertas.',
  },
  {
    id: 'Cm', name: 'Do menor', symbol: 'Cm', category: 'basic', difficulty: 4,
    frets: ['x', 3, 5, 5, 4, 3], fingers: [0, 1, 3, 4, 2, 1],
    notes: 'C G C Eb G',
    tip: 'Cejilla en el traste 3 con el índice. Es la versión menor del Do.',
    barre: { fret: 3, from: 1, to: 5 },
  },
  {
    id: 'D', name: 'Re mayor', symbol: 'D', category: 'basic', difficulty: 1,
    frets: ['x', 'x', 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2],
    notes: 'D A D F#',
    tip: 'Mantén los tres dedos curvados para formar el triángulo.',
  },
  {
    id: 'Dm', name: 'Re menor', symbol: 'Dm', category: 'basic', difficulty: 2,
    frets: ['x', 'x', 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1],
    notes: 'D A D F',
    tip: 'Tiene un sonido melancólico — clásico en boleros y baladas.',
  },
  {
    id: 'E', name: 'Mi mayor', symbol: 'E', category: 'basic', difficulty: 1,
    frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0],
    notes: 'E B E G# B E',
    tip: 'El acorde más resonante: deja sonar las tres cuerdas al aire.',
  },
  {
    id: 'Em', name: 'Mi menor', symbol: 'Em', category: 'basic', difficulty: 1,
    frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0],
    notes: 'E B E G B E',
    tip: 'El primer acorde de casi todo guitarrista: solo dos dedos.',
  },
  {
    id: 'F', name: 'Fa mayor', symbol: 'F', category: 'basic', difficulty: 4,
    frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1],
    notes: 'F C F A C F',
    tip: 'Cejilla en el traste 1 con el índice — la prueba de fuego.',
    barre: { fret: 1, from: 1, to: 6 },
  },
  {
    id: 'Fm', name: 'Fa menor', symbol: 'Fm', category: 'basic', difficulty: 4,
    frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1],
    notes: 'F C F Ab C F',
    tip: 'Igual que Fa mayor pero quitas el dedo del traste 2 — todo cejilla.',
    barre: { fret: 1, from: 1, to: 6 },
  },
  {
    id: 'G', name: 'Sol mayor', symbol: 'G', category: 'basic', difficulty: 2,
    frets: [3, 2, 0, 0, 0, 3], fingers: [3, 2, 0, 0, 0, 4],
    notes: 'G B D G B G',
    tip: 'Usa los dedos 2-3-4 para liberar el índice y cambiar más rápido.',
  },
  {
    id: 'Gm', name: 'Sol menor', symbol: 'Gm', category: 'basic', difficulty: 4,
    frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1],
    notes: 'G D G Bb D G',
    tip: 'Cejilla en el traste 3 — el dedo índice cruza las 6 cuerdas.',
    barre: { fret: 3, from: 1, to: 6 },
  },
  {
    id: 'A', name: 'La mayor', symbol: 'A', category: 'basic', difficulty: 1,
    frets: ['x', 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0],
    notes: 'A E A C# E',
    tip: 'Los tres dedos van en el traste 2 — apílalos verticalmente.',
  },
  {
    id: 'Am', name: 'La menor', symbol: 'Am', category: 'basic', difficulty: 1,
    frets: ['x', 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0],
    notes: 'A E A C E',
    tip: 'Igual que Mi mayor pero desplazado una cuerda.',
  },
  {
    id: 'B', name: 'Si mayor', symbol: 'B', category: 'basic', difficulty: 4,
    frets: ['x', 2, 4, 4, 4, 2], fingers: [0, 1, 2, 3, 4, 1],
    notes: 'B F# B D# F#',
    tip: 'Cejilla en el traste 2; tres dedos apilados en el traste 4.',
    barre: { fret: 2, from: 1, to: 5 },
  },
  {
    id: 'Bm', name: 'Si menor', symbol: 'Bm', category: 'basic', difficulty: 4,
    frets: ['x', 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1],
    notes: 'B F# B D F#',
    tip: 'Cejilla en el traste 2 con el índice; pulgar bien atrás del mástil.',
    barre: { fret: 2, from: 1, to: 5 },
  },
];

const COMPLEX_CHORDS = [
  {
    id: 'G7', name: 'Sol séptima', symbol: 'G7', category: 'complex', difficulty: 2,
    frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1],
    notes: 'G B D G B F',
    tip: 'Pide resolver al acorde de Do — úsalo como transición.',
  },
  {
    id: 'C7', name: 'Do séptima', symbol: 'C7', category: 'complex', difficulty: 2,
    frets: ['x', 3, 2, 3, 1, 0], fingers: [0, 3, 2, 4, 1, 0],
    notes: 'C E Bb C E',
    tip: 'Añade un Bb al Do — el sonido típico del blues.',
  },
  {
    id: 'D7', name: 'Re séptima', symbol: 'D7', category: 'complex', difficulty: 2,
    frets: ['x', 'x', 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3],
    notes: 'D A C F#',
    tip: 'Forma de triángulo invertido respecto a Re mayor.',
  },
  {
    id: 'E7', name: 'Mi séptima', symbol: 'E7', category: 'complex', difficulty: 1,
    frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0],
    notes: 'E B D G# B E',
    tip: 'Más fácil que Mi mayor — solo dos dedos.',
  },
  {
    id: 'A7', name: 'La séptima', symbol: 'A7', category: 'complex', difficulty: 1,
    frets: ['x', 0, 2, 0, 2, 0], fingers: [0, 0, 1, 0, 2, 0],
    notes: 'A E G C# E',
    tip: 'Levanta el dedo central del La mayor para revelar el Sol al aire.',
  },
  {
    id: 'B7', name: 'Si séptima', symbol: 'B7', category: 'complex', difficulty: 3,
    frets: ['x', 2, 1, 2, 0, 2], fingers: [0, 2, 1, 3, 0, 4],
    notes: 'B D# A B F#',
    tip: 'Cuatro dedos en cuatro cuerdas distintas — practica lentamente.',
  },
  {
    id: 'Fsharpm', name: 'Fa sostenido menor', symbol: 'F#m', category: 'complex', difficulty: 5,
    frets: [2, 4, 4, 2, 2, 2], fingers: [1, 3, 4, 1, 1, 1],
    notes: 'F# C# F# A C# F#',
    tip: 'Cejilla completa en el traste 2 — fuerza desde el codo, no la muñeca.',
    barre: { fret: 2, from: 1, to: 6 },
  },
  {
    id: 'Csharpm', name: 'Do sostenido menor', symbol: 'C#m', category: 'complex', difficulty: 4,
    frets: ['x', 4, 6, 6, 5, 4], fingers: [0, 1, 3, 4, 2, 1],
    notes: 'C# G# C# E G#',
    tip: 'Cejilla en el traste 4 — la misma forma que Si menor desplazada.',
    barre: { fret: 4, from: 1, to: 5 },
  },
  {
    id: 'Bb', name: 'Si bemol', symbol: 'Bb', category: 'complex', difficulty: 4,
    frets: ['x', 1, 3, 3, 3, 1], fingers: [0, 1, 2, 3, 4, 1],
    notes: 'Bb F Bb D F',
    tip: 'Cejilla parcial en el traste 1 — desliza el Do una posición abajo.',
    barre: { fret: 1, from: 1, to: 5 },
  },
  {
    id: 'Eb', name: 'Mi bemol', symbol: 'Eb', category: 'complex', difficulty: 4,
    frets: ['x', 6, 5, 3, 4, 3], fingers: [0, 4, 3, 1, 2, 1],
    notes: 'Eb Bb Eb G Bb',
    tip: 'Cejilla parcial en el traste 3 con el índice.',
  },
  {
    id: 'Cdim', name: 'Do disminuido', symbol: 'C°', category: 'complex', difficulty: 3,
    frets: ['x', 3, 4, 5, 4, 'x'], fingers: [0, 1, 2, 4, 3, 0],
    notes: 'C Eb Gb',
    tip: 'Tenso e inestable — úsalo como puente entre dos acordes mayores.',
  },
  {
    id: 'Adim', name: 'La disminuido', symbol: 'A°', category: 'complex', difficulty: 3,
    frets: ['x', 0, 1, 2, 1, 'x'], fingers: [0, 0, 1, 3, 2, 0],
    notes: 'A Eb Gb',
    tip: 'Sonido inquieto, muy usado en jazz como acorde de paso.',
  },
  {
    id: 'Caug', name: 'Do aumentado', symbol: 'C+', category: 'complex', difficulty: 3,
    frets: ['x', 3, 2, 1, 1, 0], fingers: [0, 4, 3, 1, 2, 0],
    notes: 'C E G#',
    tip: 'Sonido misterioso, casi cinematográfico.',
  },
  {
    id: 'Eaug', name: 'Mi aumentado', symbol: 'E+', category: 'complex', difficulty: 3,
    frets: [0, 3, 2, 1, 1, 0], fingers: [0, 4, 3, 1, 2, 0],
    notes: 'E C E G# C E',
    tip: 'Variación tensa del Mi mayor — sube la quinta medio tono.',
  },
];

const ALL_CHORDS = [...BASIC_CHORDS, ...COMPLEX_CHORDS];

// Frequency for each note in Hz — used by the audio synth.
const NOTE_FREQ = {
  'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83,
  'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81,
  'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65,
  'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63,
  'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30,
  'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25,
};

// Open-string notes per string (index 0 = low E / 6th, index 5 = high E / 1st)
const OPEN_STRINGS = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];
const NOTE_ORDER = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function noteFromFret(stringIdx, fret) {
  const openNote = OPEN_STRINGS[stringIdx];
  const letter = openNote.replace(/\d/g, '');
  const octave = parseInt(openNote.match(/\d/)[0], 10);
  let idx = NOTE_ORDER.indexOf(letter);
  let totalSemis = idx + fret;
  let newOctave = octave + Math.floor(totalSemis / 12);
  let newLetter = NOTE_ORDER[totalSemis % 12];
  return newLetter + newOctave;
}

// Generates a list of frequencies (in Hz) for the strings that are not muted.
function chordFrequencies(chord) {
  const out = [];
  chord.frets.forEach((f, i) => {
    if (f === 'x') return;
    const note = noteFromFret(i, f);
    if (NOTE_FREQ[note]) out.push({ freq: NOTE_FREQ[note], stringIdx: i });
  });
  return out;
}

let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    _audioCtx = new Ctx();
  }
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

// Plays a chord using a plucked-string-ish synth (Karplus-Strong–lite via
// filtered noise + decaying triangle). Strings are strummed across ~250ms.
function playChord(chord) {
  const ctx = getAudioCtx();
  const freqs = chordFrequencies(chord);
  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.value = 0.18;
  master.connect(ctx.destination);

  freqs.forEach((entry, i) => {
    const t = now + i * 0.045;
    // oscillator 1 — fundamental triangle
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = entry.freq;
    // oscillator 2 — slight detuned saw for body
    const osc2 = ctx.createOscillator();
    osc2.type = 'sawtooth';
    osc2.frequency.value = entry.freq * 1.005;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.6, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 2.4);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3500, t);
    filter.frequency.exponentialRampToValueAtTime(800, t + 2.0);
    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(filter);
    filter.connect(master);
    osc.start(t);
    osc2.start(t);
    osc.stop(t + 2.5);
    osc2.stop(t + 2.5);
  });
}

function playSingleNote(freq, duration = 0.6) {
  const ctx = getAudioCtx();
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = freq;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.15, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duration + 0.1);
}

export { BASIC_CHORDS, COMPLEX_CHORDS, ALL_CHORDS, playChord, playSingleNote, mutateChord };

// ─────────────────────────────────────────────────────────────
// Chord-shape mutation — used by Modo 2 (visual look-alikes).
// Takes a chord and returns a near-duplicate variant: one finger
// moved a fret, or to an adjacent string, or removed/added.
// The barre (if any) is preserved so the variant still LOOKS like
// the same family of chord.
// ─────────────────────────────────────────────────────────────
function isOnBarre(chord, stringIdx) {
  if (!chord.barre) return false;
  const lowSide = 6 - chord.barre.to;   // chord.barre.from = 1=low E
  const highSide = 6 - chord.barre.from;
  if (stringIdx < lowSide || stringIdx > highSide) return false;
  return chord.frets[stringIdx] === chord.barre.fret;
}

function mutateChord(chord) {
  const frets = chord.frets.slice();
  const fingers = chord.fingers ? chord.fingers.slice() : new Array(6).fill(0);

  // Pick a fretted string that isn't part of the barre
  const candidates = [];
  for (let i = 0; i < 6; i++) {
    const f = frets[i];
    if (typeof f === 'number' && f > 0 && !isOnBarre(chord, i)) {
      candidates.push(i);
    }
  }
  if (!candidates.length) {
    // Chord is pure-barre; mutate an open string instead (toggle to fretted)
    for (let i = 0; i < 6; i++) {
      if (frets[i] === 0 || frets[i] === 'x') candidates.push(i);
    }
  }
  if (!candidates.length) return null;

  const stringIdx = candidates[Math.floor(Math.random() * candidates.length)];
  const op = Math.random();

  if (op < 0.55) {
    // Shift finger up or down by 1 fret
    const current = typeof frets[stringIdx] === 'number' ? frets[stringIdx] : 1;
    const delta = Math.random() < 0.5 ? 1 : -1;
    const nf = current + delta;
    if (nf < 1 || nf > 7) return null;
    frets[stringIdx] = nf;
    if (!fingers[stringIdx]) fingers[stringIdx] = 1;
  } else if (op < 0.8) {
    // Toggle: a fretted note becomes open OR muted
    if (typeof frets[stringIdx] === 'number' && frets[stringIdx] > 0) {
      frets[stringIdx] = Math.random() < 0.5 ? 0 : 'x';
      fingers[stringIdx] = 0;
    } else {
      // open/muted → add a fret 2 finger
      frets[stringIdx] = 2; fingers[stringIdx] = 1;
    }
  } else {
    // Hop the finger to an adjacent string at the same fret
    const current = typeof frets[stringIdx] === 'number' ? frets[stringIdx] : 0;
    if (current === 0) return null;
    const delta = Math.random() < 0.5 ? 1 : -1;
    const ns = stringIdx + delta;
    if (ns < 0 || ns > 5) return null;
    if (frets[ns] === current) return null;
    frets[stringIdx] = chord.frets[stringIdx] === 0 ? 0 : 'x';
    fingers[stringIdx] = 0;
    frets[ns] = current;
    fingers[ns] = fingers[stringIdx] || 1;
  }
  return { frets, fingers, barre: chord.barre || null };
}
