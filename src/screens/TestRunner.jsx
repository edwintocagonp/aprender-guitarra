// Test runner — supports 3 modes per level:
//   Modo 1 — Mixto: 4 options, mix of diagram/name questions
//   Modo 2 — Detalle: 6 nearly-identical diagrams, pick the correct shape
//   Modo 3 — Cifrado: text-only, symbol↔name both directions, 4 options

import { useState as _us3, useMemo as _um3, useEffect as _ue3 } from "react";
import * as _GD3 from "../data/chords.js";
import { ChordDiagram as _CD3 } from "../components/ChordDiagram.jsx";
import { Icon as _Icon3, TopBar as _TopBar3 } from "../common.jsx";

function pickPool(level) {
  if (level === 'basic') return _GD3.BASIC_CHORDS;
  if (level === 'medium') return [..._GD3.BASIC_CHORDS, ..._GD3.COMPLEX_CHORDS.filter(c => c.difficulty <= 3)];
  return _GD3.ALL_CHORDS;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let _uid = 0;
const uid = () => '_o' + (++_uid);

// ─────────────────────────────────────────────────────────────
// Build a quiz of 6 questions.
// Each question shape:
//   {
//     kind: 'pick-name' | 'pick-diagram' | 'pick-symbol' | 'pick-name-from-symbol',
//     prompt: { type: 'diagram'|'name'|'symbol', value },
//     options: [{ key, kind: 'name'|'symbol'|'diagram', value, correct }, ...],
//     gridCols: 1 | 2,        // option layout
//     correct: <chord>,       // for audio
//   }
// ─────────────────────────────────────────────────────────────
function buildQuiz(level, mode) {
  const pool = pickPool(level);
  const picks = shuffle(pool).slice(0, 6);
  return picks.map(correct => makeQuestion(correct, pool, mode));
}

function makeQuestion(correct, pool, mode) {
  if (mode === 'mode2') return makeQuestionMode2(correct, pool);
  if (mode === 'mode3') return makeQuestionMode3(correct, pool);
  return makeQuestionMode1(correct, pool);
}

// Modo 1 — original behavior: half the time show a diagram and ask for the
// name; the other half show the name and ask for the diagram. 4 options.
function makeQuestionMode1(correct, pool) {
  const distractors = shuffle(pool.filter(c => c.id !== correct.id)).slice(0, 3);
  if (Math.random() < 0.55) {
    // Show diagram, pick name
    const options = shuffle([correct, ...distractors]).map(c => ({
      key: uid(), kind: 'name', value: c, correct: c.id === correct.id,
    }));
    return {
      kind: 'mode1-name',
      prompt: { type: 'diagram', value: correct },
      options, gridCols: 1, correct,
    };
  } else {
    // Show name, pick diagram (2-column grid)
    const options = shuffle([correct, ...distractors]).map(c => ({
      key: uid(), kind: 'diagram', value: c, correct: c.id === correct.id,
    }));
    return {
      kind: 'mode1-diagram',
      prompt: { type: 'symbol-name', value: correct },
      options, gridCols: 2, correct,
    };
  }
}

// Modo 2 — Show name. 6 diagram options: 1 is the real chord, 5 are
// near-mutations of the same shape (one finger moved a fret, or to an
// adjacent string, etc.). Distractors look almost identical at a glance.
function makeQuestionMode2(correct, pool) {
  const variants = [];
  let tries = 0;
  while (variants.length < 5 && tries < 60) {
    tries++;
    const v = _GD3.mutateChord(correct);
    if (!v) continue;
    if (fretsEqual(v.frets, correct.frets)) continue;
    if (variants.some(x => fretsEqual(x.frets, v.frets))) continue;
    variants.push(v);
  }
  // Fill remaining slots with mutations of other pool chords (still close to
  // the correct shape) if our mutator got stuck.
  while (variants.length < 5) {
    const other = pool[Math.floor(Math.random() * pool.length)];
    const v = _GD3.mutateChord(other);
    if (v && !fretsEqual(v.frets, correct.frets)
         && !variants.some(x => fretsEqual(x.frets, v.frets))) {
      variants.push(v);
    } else if (variants.length < 5) {
      // last-resort: use the other chord shape itself
      variants.push({ frets: other.frets, fingers: other.fingers, barre: other.barre || null });
    }
  }

  const options = shuffle([
    { key: uid(), kind: 'diagram', value: correct, correct: true },
    ...variants.map(v => ({
      key: uid(),
      kind: 'diagram',
      value: { id: '__variant', symbol: '', name: '', frets: v.frets, fingers: v.fingers, barre: v.barre },
      correct: false,
    })),
  ]);

  return {
    kind: 'mode2',
    prompt: { type: 'symbol-name', value: correct },
    options, gridCols: 2, correct,
  };
}

function fretsEqual(a, b) {
  if (!a || !b) return false;
  for (let i = 0; i < 6; i++) if (a[i] !== b[i]) return false;
  return true;
}

// Modo 3 — Text only. Two directions:
//   3a: show symbol "Gm", pick the name from 4 names
//   3b: show name "Sol menor", pick the symbol from 4 symbols
function makeQuestionMode3(correct, pool) {
  const distractors = shuffle(pool.filter(c => c.id !== correct.id)).slice(0, 3);
  if (Math.random() < 0.5) {
    const options = shuffle([correct, ...distractors]).map(c => ({
      key: uid(), kind: 'name-text', value: c, correct: c.id === correct.id,
    }));
    return {
      kind: 'mode3-name',
      prompt: { type: 'symbol-only', value: correct },
      options, gridCols: 1, correct,
    };
  } else {
    const options = shuffle([correct, ...distractors]).map(c => ({
      key: uid(), kind: 'symbol-text', value: c, correct: c.id === correct.id,
    }));
    return {
      kind: 'mode3-symbol',
      prompt: { type: 'name-only', value: correct },
      options, gridCols: 2, correct,
    };
  }
}

// ─────────────────────────────────────────────────────────────
// TEST RUN SCREEN
// ─────────────────────────────────────────────────────────────
function TestRunScreen({ theme, level, mode, onExit, onFinish }) {
  const quiz = _um3(() => buildQuiz(level, mode), [level, mode]);
  const [idx, setIdx] = _us3(0);
  const [picked, setPicked] = _us3(null);
  const [score, setScore] = _us3(0);

  const q = quiz[idx];
  const isCorrect = picked && picked.correct;
  const showFeedback = picked !== null;

  const next = () => {
    if (idx < quiz.length - 1) {
      setIdx(idx + 1);
      setPicked(null);
    } else {
      onFinish(score + (isCorrect ? 1 : 0), quiz.length);
    }
  };

  const pick = (opt) => {
    if (picked) return;
    setPicked(opt);
    if (opt.correct) {
      setScore(s => s + 1);
      _GD3.playChord(q.correct);
    }
  };

  const levelLabel = { basic: 'Básico', medium: 'Intermedio', advanced: 'Avanzado' }[level];
  const modeLabel = { mode1: 'Mixto', mode2: 'Detalle', mode3: 'Cifrado' }[mode];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <_TopBar3 title={`${levelLabel} · ${modeLabel}`} onBack={onExit} theme={theme} />

      {/* Progress */}
      <div style={{ padding: '0 22px 10px' }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {quiz.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 999,
              background: i < idx ? theme.accent
                : i === idx ? theme.ink
                : theme.hairline,
              opacity: i < idx ? 1 : (i === idx ? 0.4 : 1),
            }} />
          ))}
        </div>
        <div style={{
          marginTop: 8, fontFamily: 'Manrope', fontSize: 12,
          color: theme.muted, display: 'flex', justifyContent: 'space-between',
        }}>
          <span>Pregunta {idx + 1} de {quiz.length}</span>
          <span>Aciertos: {score}</span>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '6px 22px 22px' }}>
        <Prompt q={q} theme={theme} />
        <OptionsArea q={q} theme={theme} picked={picked} onPick={pick} />
      </div>

      {showFeedback && <Feedback theme={theme} isCorrect={isCorrect} q={q}
        isLast={idx === quiz.length - 1} onNext={next} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Prompt — shows the question stem
// ─────────────────────────────────────────────────────────────
function Prompt({ q, theme }) {
  const p = q.prompt;
  if (p.type === 'diagram') {
    return (
      <div>
        <div style={{
          textAlign: 'center', fontFamily: 'Manrope',
          color: theme.inkSoft, fontSize: 13, marginBottom: 12,
        }}>
          ¿Qué acorde es este?
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{
            width: 180, height: 220, padding: 14,
            background: theme.card, borderRadius: 20,
            border: `1px solid ${theme.hairline}`,
          }}>
            <_CD3 chord={p.value} size="md" theme={theme} />
          </div>
        </div>
      </div>
    );
  }
  if (p.type === 'symbol-name') {
    return (
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{
          fontFamily: 'Manrope', fontSize: 13,
          color: theme.inkSoft, marginBottom: 6,
        }}>¿Cuál es el acorde</div>
        <div style={{
          fontFamily: '"Instrument Serif", serif',
          fontSize: 44, color: theme.ink, lineHeight: 1,
        }}>{p.value.symbol}</div>
        <div style={{
          fontFamily: 'Manrope', fontSize: 12, color: theme.muted,
          marginTop: 4, letterSpacing: 0.4,
        }}>{p.value.name.toUpperCase()}?</div>
      </div>
    );
  }
  if (p.type === 'symbol-only') {
    // Modo 3a — only the symbol, no name
    return (
      <div style={{ textAlign: 'center', marginBottom: 22, marginTop: 6 }}>
        <div style={{
          fontFamily: 'Manrope', fontSize: 13,
          color: theme.inkSoft, marginBottom: 10,
        }}>¿Cómo se lee este símbolo?</div>
        <div style={{
          display: 'inline-block',
          padding: '24px 36px',
          background: theme.card, borderRadius: 20,
          border: `1px solid ${theme.hairline}`,
          fontFamily: '"Instrument Serif", serif',
          fontSize: 64, color: theme.ink, lineHeight: 1,
          minWidth: 110,
        }}>{p.value.symbol}</div>
      </div>
    );
  }
  if (p.type === 'name-only') {
    // Modo 3b — only the name, no symbol
    return (
      <div style={{ textAlign: 'center', marginBottom: 22, marginTop: 6 }}>
        <div style={{
          fontFamily: 'Manrope', fontSize: 13,
          color: theme.inkSoft, marginBottom: 10,
        }}>¿Cuál es el símbolo de este acorde?</div>
        <div style={{
          display: 'inline-block',
          padding: '22px 28px',
          background: theme.card, borderRadius: 20,
          border: `1px solid ${theme.hairline}`,
          fontFamily: '"Instrument Serif", serif',
          fontSize: 32, color: theme.ink, lineHeight: 1.1,
          fontStyle: 'italic',
        }}>{p.value.name}</div>
      </div>
    );
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// Options grid — adapts to the option kind
// ─────────────────────────────────────────────────────────────
function OptionsArea({ q, theme, picked, onPick }) {
  if (q.gridCols === 2) {
    return (
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10,
      }}>
        {q.options.map(opt => (
          <OptionTile key={opt.key} opt={opt} q={q} theme={theme}
            picked={picked} onPick={onPick} />
        ))}
      </div>
    );
  }
  // 1-column list
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {q.options.map(opt => (
        <OptionTile key={opt.key} opt={opt} q={q} theme={theme}
          picked={picked} onPick={onPick} />
      ))}
    </div>
  );
}

function OptionTile({ opt, q, theme, picked, onPick }) {
  const state = !picked ? 'idle'
    : opt.correct ? 'correct'
    : (picked.key === opt.key ? 'wrong' : 'idle');
  const border = state === 'correct' ? theme.success
    : state === 'wrong' ? theme.error
    : theme.hairline;
  const bg = state === 'correct' ? 'color-mix(in oklch, ' + theme.success + ' 12%, transparent)'
    : state === 'wrong' ? 'color-mix(in oklch, ' + theme.error + ' 12%, transparent)'
    : theme.card;

  // Body — varies by option kind
  let body;
  if (opt.kind === 'diagram') {
    body = (
      <div style={{ height: 130 }}>
        <_CD3 chord={opt.value} size="sm" theme={theme} />
      </div>
    );
  } else if (opt.kind === 'name') {
    body = (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          fontFamily: '"Instrument Serif", serif', fontSize: 22,
          color: theme.ink, width: 36,
        }}>{opt.value.symbol}</div>
        <div style={{ color: theme.inkSoft, fontSize: 14 }}>{opt.value.name}</div>
      </div>
    );
  } else if (opt.kind === 'name-text') {
    body = (
      <div style={{
        color: theme.ink, fontSize: 16, fontWeight: 500,
        fontFamily: 'Manrope',
        textAlign: 'center', padding: '4px 0',
      }}>{opt.value.name}</div>
    );
  } else if (opt.kind === 'symbol-text') {
    body = (
      <div style={{
        textAlign: 'center', padding: '12px 0',
        fontFamily: '"Instrument Serif", serif', fontSize: 30,
        color: theme.ink, lineHeight: 1,
      }}>{opt.value.symbol}</div>
    );
  }

  const compact = opt.kind === 'diagram' || opt.kind === 'symbol-text';
  return (
    <button onClick={() => onPick(opt)} style={{
      background: bg, border: `1.5px solid ${border}`,
      borderRadius: compact ? 16 : 14,
      padding: compact ? 10 : 14,
      cursor: state === 'idle' ? 'pointer' : 'default',
      textAlign: 'left', fontFamily: 'Manrope',
      transition: 'border-color 0.15s, background 0.15s',
    }}>{body}</button>
  );
}

// ─────────────────────────────────────────────────────────────
// Feedback bar at bottom
// ─────────────────────────────────────────────────────────────
function Feedback({ theme, isCorrect, q, isLast, onNext }) {
  return (
    <div style={{
      padding: '14px 22px max(22px, env(safe-area-inset-bottom, 0px) + 14px)',
      background: isCorrect ? 'color-mix(in oklch, ' + theme.success + ' 14%, transparent)'
        : 'color-mix(in oklch, ' + theme.error + ' 14%, transparent)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10,
        fontFamily: 'Manrope', color: theme.ink,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 999, flexShrink: 0,
          background: isCorrect ? theme.success : theme.error,
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <_Icon3 name={isCorrect ? 'check' : 'x'} size={16} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>
            {isCorrect ? '¡Correcto!' : 'Incorrecto'}
          </div>
          <div style={{ fontSize: 12, color: theme.inkSoft, marginTop: 1 }}>
            La respuesta era <strong style={{ color: theme.ink }}>{q.correct.symbol} · {q.correct.name}</strong>.
          </div>
        </div>
      </div>
      <button onClick={onNext} style={{
        width: '100%', padding: '13px', background: theme.ink,
        color: theme.paper, border: 'none', borderRadius: 999,
        cursor: 'pointer', fontFamily: 'Manrope', fontWeight: 600, fontSize: 15,
      }}>
        {isLast ? 'Ver resultados' : 'Siguiente pregunta'}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TEST RESULTS
// ─────────────────────────────────────────────────────────────
function TestResultsScreen({ theme, score, total, level, mode, onRetry, onHome }) {
  const pct = score / total;
  const verdict = pct === 1 ? '¡Perfecto!'
    : pct >= 0.8 ? '¡Excelente!'
    : pct >= 0.5 ? '¡Bien hecho!'
    : 'Sigue practicando';
  const message = pct === 1 ? 'Dominas todos los acordes de este modo.'
    : pct >= 0.5 ? 'Buen trabajo. Repasa los que fallaste y vuelve a intentarlo.'
    : 'Echa un vistazo a la biblioteca y prueba de nuevo cuando estés listo.';

  const levelLabel = { basic: 'BÁSICO', medium: 'INTERMEDIO', advanced: 'AVANZADO' }[level];
  const modeLabel = { mode1: 'MIXTO', mode2: 'DETALLE', mode3: 'CIFRADO' }[mode];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <_TopBar3 title="" onBack={onHome} theme={theme} />
      <div style={{
        flex: 1, padding: '10px 26px max(24px, env(safe-area-inset-bottom, 0px) + 14px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center',
      }}>
        <div style={{
          width: 88, height: 88, borderRadius: 999,
          background: theme.accentSoft, color: theme.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
        }}>
          <_Icon3 name="trophy" size={42} color={theme.accent} />
        </div>
        <h2 style={{
          fontFamily: '"Instrument Serif", serif', fontSize: 36,
          color: theme.ink, margin: 0, lineHeight: 1.05,
        }}>{verdict}</h2>
        <div style={{
          fontFamily: '"Instrument Serif", serif',
          fontSize: 80, color: theme.accent, lineHeight: 1,
          marginTop: 18, fontStyle: 'italic',
        }}>
          {score}<span style={{ color: theme.muted, fontStyle: 'normal' }}>/{total}</span>
        </div>
        <div style={{
          fontFamily: 'Manrope', fontSize: 12, color: theme.muted,
          marginTop: 6, letterSpacing: 1.5,
        }}>
          {levelLabel} · {modeLabel}
        </div>
        <p style={{
          fontFamily: 'Manrope', fontSize: 14, color: theme.inkSoft,
          margin: '22px 12px 0', lineHeight: 1.5,
        }}>{message}</p>

        <div style={{ flex: 1 }} />

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={onRetry} style={{
            padding: '14px', background: theme.ink, color: theme.paper,
            border: 'none', borderRadius: 999, cursor: 'pointer',
            fontFamily: 'Manrope', fontWeight: 600, fontSize: 15,
          }}>
            Intentar de nuevo
          </button>
          <button onClick={onHome} style={{
            padding: '14px', background: 'transparent', color: theme.ink,
            border: `1px solid ${theme.hairline}`, borderRadius: 999, cursor: 'pointer',
            fontFamily: 'Manrope', fontWeight: 600, fontSize: 15,
          }}>
            Volver al menú
          </button>
        </div>
      </div>
    </div>
  );
}

export { TestRunScreen, TestResultsScreen };
