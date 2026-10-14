// Test / How-to / Daily screens

import { useState as _us2, useEffect as _ue2, useMemo as _um2 } from "react";
import * as _GD2 from "../data/chords.js";
import { ChordDiagram as _CD2 } from "../components/ChordDiagram.jsx";
import { Icon as _Icon2, TopBar as _TopBar2 } from "../common.jsx";

// ─────────────────────────────────────────────────────────────
// HOW TO READ DIAGRAMS
// ─────────────────────────────────────────────────────────────
function HowToScreen({ theme, onBack }) {
  const demo = _GD2.BASIC_CHORDS.find(c => c.id === 'C');

  const items = [
    { label: 'Cuerdas', text: 'Las líneas verticales son las 6 cuerdas. La más gruesa (Mi grave) está a la izquierda.' },
    { label: 'Trastes', text: 'Las líneas horizontales son los trastes. La línea superior gruesa representa la cejuela.' },
    { label: 'Puntos', text: 'Cada punto coloreado marca dónde poner un dedo. El número dentro es qué dedo usar (1=índice, 2=medio, 3=anular, 4=meñique).' },
    { label: 'Símbolos arriba', text: '○ significa cuerda al aire (suena sin pulsar). ✕ significa cuerda muda (no la toques).' },
    { label: 'Cejilla', text: 'Una barra que cruza varias cuerdas: el índice presiona toda una fila a la vez.' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <_TopBar2 title="Cómo leer los diagramas" onBack={onBack} theme={theme} />
      <div style={{ flex: 1, overflow: 'auto', padding: '0 22px 30px' }}>
        <div style={{
          background: theme.card, borderRadius: 22, padding: 18,
          border: `1px solid ${theme.hairline}`,
          display: 'flex', gap: 16, alignItems: 'center',
        }}>
          <div style={{ width: 120, height: 150, flexShrink: 0 }}>
            <_CD2 chord={demo} size="md" theme={theme} />
          </div>
          <div style={{ fontFamily: 'Manrope', fontSize: 13, color: theme.inkSoft, lineHeight: 1.5 }}>
            Este es el acorde de <strong style={{ color: theme.ink }}>Do mayor (C)</strong>. Vamos a desglosarlo.
          </div>
        </div>

        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((it, i) => (
            <div key={i} style={{
              display: 'flex', gap: 14, padding: '12px 14px',
              background: theme.card, borderRadius: 14,
              border: `1px solid ${theme.hairline}`,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 999, flexShrink: 0,
                background: theme.accentSoft, color: theme.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Manrope', fontWeight: 700, fontSize: 13,
              }}>{i + 1}</div>
              <div style={{ fontFamily: 'Manrope', flex: 1 }}>
                <div style={{ color: theme.ink, fontWeight: 600, fontSize: 14, marginBottom: 3 }}>
                  {it.label}
                </div>
                <div style={{ color: theme.inkSoft, fontSize: 13, lineHeight: 1.5 }}>
                  {it.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 18, padding: '14px 16px',
          background: theme.accentSoft, borderRadius: 14,
          fontFamily: 'Manrope', fontSize: 13,
          color: theme.ink, lineHeight: 1.5,
        }}>
          <strong>Tip:</strong> presiona con la punta del dedo, justo detrás del traste — no encima, no en el centro.
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DAILY EXERCISE
// ─────────────────────────────────────────────────────────────
function DailyExerciseScreen({ theme, onBack, streak, onComplete }) {
  const sequence = ['C', 'G', 'Am', 'F'];
  const chords = sequence.map(id => _GD2.ALL_CHORDS.find(c => c.id === id));
  const [idx, setIdx] = _us2(0);
  const [done, setDone] = _us2(false);

  const next = () => {
    if (idx < chords.length - 1) {
      _GD2.playChord(chords[idx + 1]);
      setIdx(idx + 1);
    } else {
      setDone(true);
      onComplete();
    }
  };

  if (done) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <_TopBar2 title="" onBack={onBack} theme={theme} />
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: '0 30px',
          textAlign: 'center',
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: 999,
            background: theme.accent, color: '#FFF7EB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 22,
          }}>
            <_Icon2 name="flame" size={42} color="#FFF7EB" />
          </div>
          <h2 style={{
            fontFamily: '"Instrument Serif", serif', fontSize: 32,
            color: theme.ink, margin: 0, lineHeight: 1.1,
          }}>
            ¡Racha de <span style={{ fontStyle: 'italic', color: theme.accent }}>{streak} días</span>!
          </h2>
          <p style={{
            fontFamily: 'Manrope', color: theme.inkSoft, fontSize: 14,
            margin: '14px 10px 0', lineHeight: 1.5,
          }}>
            Has completado el ejercicio de hoy. Mañana hay otro nuevo esperándote.
          </p>
          <button onClick={onBack} style={{
            marginTop: 28, padding: '14px 28px', background: theme.ink,
            color: theme.paper, border: 'none', borderRadius: 999,
            cursor: 'pointer', fontFamily: 'Manrope', fontWeight: 600, fontSize: 15,
          }}>
            Volver al menú
          </button>
        </div>
      </div>
    );
  }

  const current = chords[idx];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <_TopBar2 title="Ejercicio diario" onBack={onBack} theme={theme} />

      {/* Progress */}
      <div style={{ padding: '0 22px 12px' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {chords.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 999,
              background: i <= idx ? theme.accent : theme.hairline,
            }} />
          ))}
        </div>
        <div style={{
          marginTop: 10, fontFamily: 'Manrope', fontSize: 12,
          color: theme.muted, textAlign: 'center',
        }}>
          {idx + 1} de {chords.length} · cambia limpio entre acordes
        </div>
      </div>

      <div style={{ flex: 1, padding: '8px 22px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: '"Instrument Serif", serif', fontSize: 56,
            color: theme.ink, lineHeight: 1,
          }}>{current.symbol}</div>
          <div style={{ fontFamily: 'Manrope', fontSize: 12, color: theme.inkSoft, marginTop: 4 }}>
            {current.name}
          </div>
        </div>

        <div style={{
          flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',
          margin: '8px 0',
        }}>
          <div style={{
            width: 220, height: 280, padding: 14,
            background: theme.card, borderRadius: 22,
            border: `1px solid ${theme.hairline}`,
          }}>
            <_CD2 chord={current} size="lg" theme={theme} />
          </div>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 14,
        }}>
          {sequence.map((s, i) => (
            <div key={i} style={{
              padding: '6px 12px', borderRadius: 999,
              background: i === idx ? theme.accent : 'transparent',
              border: `1px solid ${i === idx ? theme.accent : theme.hairline}`,
              color: i === idx ? '#FFF7EB' : theme.inkSoft,
              fontFamily: 'Manrope', fontWeight: 600, fontSize: 13,
            }}>{s}</div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <button onClick={() => _GD2.playChord(current)} style={{
            flex: 1, padding: 14, background: 'transparent',
            border: `1px solid ${theme.hairline}`, borderRadius: 999,
            cursor: 'pointer', color: theme.ink, fontFamily: 'Manrope',
            fontWeight: 600, fontSize: 15,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <_Icon2 name="play" size={14} /> Escuchar
          </button>
          <button onClick={next} style={{
            flex: 1.6, padding: 14, background: theme.ink,
            color: theme.paper, border: 'none', borderRadius: 999,
            cursor: 'pointer', fontFamily: 'Manrope', fontWeight: 600, fontSize: 15,
          }}>
            {idx < chords.length - 1 ? 'Siguiente acorde' : 'Terminar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TEST — LEVEL SELECT
// ─────────────────────────────────────────────────────────────
function TestLevelScreen({ theme, onBack, onPick }) {
  const levels = [
    {
      id: 'basic',
      title: 'Básico',
      sub: 'Las 7 notas en mayor y menor',
      icon: 'guitar',
      tag: '14 acordes',
    },
    {
      id: 'medium',
      title: 'Intermedio',
      sub: 'Incluye séptimas y acordes alterados',
      icon: 'sparkle',
      tag: '~20 acordes',
    },
    {
      id: 'advanced',
      title: 'Avanzado',
      sub: 'Todo: cejillas, disminuidos y aumentados',
      icon: 'trophy',
      tag: 'Biblioteca completa',
    },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <_TopBar2 title="Test de conocimiento" onBack={onBack} theme={theme} />
      <div style={{ padding: '4px 22px 0' }}>
        <p style={{
          fontFamily: 'Manrope', fontSize: 14, color: theme.inkSoft,
          margin: '0 0 22px', lineHeight: 1.5,
        }}>
          Primero elige el nivel. Después podrás escoger el modo de juego.
        </p>
      </div>
      <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {levels.map(lv => (
          <button key={lv.id} onClick={() => onPick(lv.id)} style={{
            background: theme.card, border: `1px solid ${theme.hairline}`,
            borderRadius: 18, padding: 18, cursor: 'pointer',
            textAlign: 'left', fontFamily: 'Manrope',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: theme.accentSoft, color: theme.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <_Icon2 name={lv.icon} size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: theme.ink, fontWeight: 600, fontSize: 17 }}>{lv.title}</div>
              <div style={{ color: theme.inkSoft, fontSize: 12, marginTop: 2 }}>{lv.sub}</div>
              <div style={{ color: theme.muted, fontSize: 11, marginTop: 4, letterSpacing: 0.4 }}>
                {lv.tag.toUpperCase()}
              </div>
            </div>
            <_Icon2 name="chevron" size={18} color={theme.muted} />
          </button>
        ))}
      </div>
    </div>
  );
}

export { HowToScreen, DailyExerciseScreen, TestLevelScreen, TestModeScreen };

// ─────────────────────────────────────────────────────────────
// TEST — MODE SELECT (within a level)
// ─────────────────────────────────────────────────────────────
function TestModeScreen({ theme, level, onBack, onPick, lastScores }) {
  const levelLabel = { basic: 'Básico', medium: 'Intermedio', advanced: 'Avanzado' }[level];
  const modes = [
    {
      id: 'mode1',
      title: 'Modo 1 · Mixto',
      sub: 'Identifica el acorde por su diagrama o su nombre. 4 opciones.',
      icon: 'sparkle',
    },
    {
      id: 'mode2',
      title: 'Modo 2 · Detalle',
      sub: 'Te damos el nombre. Elige entre 6 diagramas casi iguales — uno solo es el correcto.',
      icon: 'search',
    },
    {
      id: 'mode3',
      title: 'Modo 3 · Cifrado',
      sub: 'Sin diagramas. Lee el símbolo (Gm) y elige el nombre, o al revés. Para dominar el cifrado.',
      icon: 'book',
    },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <_TopBar2 title={`Test · ${levelLabel}`} onBack={onBack} theme={theme} />
      <div style={{ padding: '4px 22px 0' }}>
        <p style={{
          fontFamily: 'Manrope', fontSize: 14, color: theme.inkSoft,
          margin: '0 0 22px', lineHeight: 1.5,
        }}>
          Elige el modo de juego. Cada test son 6 preguntas y se guarda tu mejor puntuación.
        </p>
      </div>
      <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {modes.map(md => {
          const key = level + '.' + md.id;
          const best = lastScores[key];
          return (
            <button key={md.id} onClick={() => onPick(md.id)} style={{
              background: theme.card, border: `1px solid ${theme.hairline}`,
              borderRadius: 18, padding: 16, cursor: 'pointer',
              textAlign: 'left', fontFamily: 'Manrope',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: theme.accentSoft, color: theme.accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <_Icon2 name={md.icon} size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: theme.ink, fontWeight: 600, fontSize: 16 }}>
                    {md.title}
                  </div>
                  <div style={{ color: theme.inkSoft, fontSize: 12, marginTop: 4, lineHeight: 1.4 }}>
                    {md.sub}
                  </div>
                </div>
                <_Icon2 name="chevron" size={18} color={theme.muted} />
              </div>
              {best != null && (
                <div style={{
                  paddingTop: 8, borderTop: `1px solid ${theme.hairline}`,
                  fontSize: 11, color: theme.accent, fontWeight: 600,
                  letterSpacing: 0.5,
                }}>
                  MEJOR: {best}/6
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
