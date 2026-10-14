// Screens for "Aprende Guitarra Acústica"

import { useState as _us, useEffect as _ue, useMemo as _um, useRef as _ur } from "react";
import * as _GD from "../data/chords.js";
import { ChordDiagram as _CD } from "../components/ChordDiagram.jsx";
import { Icon as _Icon, TopBar as _TopBar, SearchBar as _SearchBar, useLayout as _useLayout } from "../common.jsx";

// ─────────────────────────────────────────────────────────────
// HOME — now hosts the hamburger entry to the side drawer. On a desktop the
// menu is a sidebar (no hamburger) and the hero splits into two columns: text
// and actions on the left, the chord card on the right.
// ─────────────────────────────────────────────────────────────
function HomeScreen({ theme, go, dark, onToggleDark, openMenu, streak, favsCount }) {
  const { phone, wide, desktop } = _useLayout();
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      padding: phone
        ? 'max(56px, env(safe-area-inset-top, 0px) + 18px) 22px max(24px, env(safe-area-inset-bottom, 0px) + 12px)'
        : desktop ? '32px 48px 40px' : '32px 32px 32px',
      background: `linear-gradient(180deg, ${theme.paper} 0%, ${theme.paperAlt} 100%)`,
      boxSizing: 'border-box',
    }}>
      {/* Top bar — hamburger + mode toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: openMenu ? 'space-between' : 'flex-end' }}>
        {openMenu && <button onClick={openMenu} aria-label="Abrir menú" style={{
          background: theme.card, border: `1px solid ${theme.hairline}`,
          borderRadius: 14, width: 44, height: 44, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: theme.ink,
        }}>
          <_Icon name="menu" size={22} />
        </button>}
        <button onClick={onToggleDark} aria-label="Cambiar tema" style={{
          background: theme.card, border: `1px solid ${theme.hairline}`,
          borderRadius: 999, width: 44, height: 44, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: theme.ink,
        }}>
          <_Icon name={dark ? 'sun' : 'moon'} size={18} />
        </button>
      </div>

      <div style={{
        flex: 1, display: 'grid', minHeight: 0,
        ...(wide ? {
          gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
          gridTemplateRows: '1fr auto auto auto 1fr',
          gridTemplateAreas: '"top art" "title art" "cta art" "chips art" "bottom art"',
          columnGap: desktop ? 48 : 32,
        } : {
          gridTemplateRows: 'auto minmax(200px, 1fr) auto auto',
          gridTemplateAreas: '"title" "art" "cta" "chips"',
        }),
      }}>
      {/* Title block */}
      <div style={{ gridArea: 'title', marginTop: wide ? 0 : 26, marginBottom: wide ? 28 : 0 }}>
        <div style={{
          fontFamily: 'Manrope', fontSize: 11, letterSpacing: 2.5,
          color: theme.accent, marginBottom: 8, fontWeight: 600,
        }}>
          MÉTODO VISUAL · OFFLINE
        </div>
        <h1 style={{
          margin: 0,
          fontFamily: '"Instrument Serif", serif',
          fontSize: wide ? 'clamp(52px, 5.4vw, 76px)' : 'clamp(38px, 11vw, 52px)',
          lineHeight: 1.02, color: theme.ink, letterSpacing: -0.5,
        }}>
          Aprende<br />
          <span style={{ fontStyle: 'italic', color: theme.accent }}>guitarra</span> acústica
        </h1>
      </div>

      {/* Decorative diagram */}
      <div style={{
        gridArea: 'art', display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '14px 0 10px', minHeight: 200,
      }}>
        <div style={{
          width: 220, height: 280, padding: 20,
          scale: desktop ? 1.35 : wide ? 1.15 : 1,
          background: theme.card, borderRadius: 24,
          boxShadow: theme.shadow,
          border: `1px solid ${theme.hairline}`,
          transform: 'rotate(-4deg)',
          position: 'relative',
        }}>
          <_CD chord={_GD.BASIC_CHORDS.find(c => c.id === 'G')} size="lg" theme={theme} />
          <div style={{
            position: 'absolute', top: 12, left: 20,
            fontFamily: '"Instrument Serif", serif', fontSize: 22,
            color: theme.ink,
          }}>G</div>
          <div style={{
            position: 'absolute', top: 16, right: 20,
            fontFamily: 'Manrope', fontSize: 10,
            color: theme.muted, letterSpacing: 1.2,
          }}>SOL MAYOR</div>
        </div>
      </div>

      {/* Daily exercise CTA */}
      <button onClick={() => go('daily')} style={{
        gridArea: 'cta',
        padding: 16,
        background: theme.accent, color: '#FFF7EB',
        border: 'none', borderRadius: 18, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
        fontFamily: 'Manrope', marginBottom: 10,
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 999,
          background: 'rgba(255,247,235,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <_Icon name="flame" size={22} color="#FFF7EB" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, letterSpacing: 1.5, opacity: 0.85, fontWeight: 600 }}>
            EJERCICIO DIARIO · DÍA {streak}
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>
            Cambio rápido: C → G → Am → F
          </div>
        </div>
        <_Icon name="chevron" size={18} color="#FFF7EB" />
      </button>

      {/* Quick-access strip */}
      <div style={{ gridArea: 'chips', display: 'flex', gap: 8 }}>
        <button onClick={() => go('all')} style={quickChipStyle(theme, true)}>
          <_Icon name="book" size={15} />
          Acordes
        </button>
        <button onClick={() => go('test-level')} style={quickChipStyle(theme)}>
          <_Icon name="trophy" size={15} />
          Test
        </button>
        <button onClick={() => go('favs')} style={quickChipStyle(theme)}>
          <_Icon name="heart" size={15} />
          {favsCount}
        </button>
      </div>
      </div>
    </div>
  );
}

function quickChipStyle(theme, primary) {
  return {
    flex: 1, padding: '14px 10px',
    background: primary ? theme.ink : theme.card,
    color: primary ? theme.paper : theme.ink,
    border: primary ? 'none' : `1px solid ${theme.hairline}`,
    borderRadius: 14, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: 'Manrope', fontSize: 14, fontWeight: 600,
  };
}

// ─────────────────────────────────────────────────────────────
// HAMBURGER DRAWER — slides from the left. With `docked` (desktop) the same
// menu is a sidebar that is always visible and marks the current section.
// ─────────────────────────────────────────────────────────────
function MenuDrawer({ theme, open, onClose, go, dark, onToggleDark, favsCount, streak, docked = false, active }) {
  const items = [
    { id: 'basic',   label: 'Acordes básicos',   sub: '14 acordes (Do a Si)',       icon: 'guitar'  },
    { id: 'complex', label: 'Acordes complejos', sub: 'Séptimas y cejillas',        icon: 'sparkle' },
    { id: 'all',     label: 'Todos los acordes', sub: 'Biblioteca con búsqueda',    icon: 'book'    },
    { id: 'test-level', label: 'Test',           sub: '3 niveles · gana puntos',    icon: 'trophy'  },
  ];
  const secondary = [
    { id: 'favs',  label: `Favoritos · ${favsCount}`, icon: 'heart' },
    { id: 'daily', label: `Ejercicio diario · día ${streak}`, icon: 'flame' },
    { id: 'howto', label: 'Cómo leer los diagramas', icon: 'book' },
  ];
  // the overlay closes first, then navigates once it has slid away
  const pick = (id) => {
    if (docked) {
      go(id);
    } else {
      onClose();
      setTimeout(() => go(id), 180);
    }
  };
  const activeStyle = (id) => (id === active ? { background: theme.accentSoft } : null);
  const Brand = docked ? 'button' : 'div';

  const content = (
    <>
        {/* Drawer header */}
        <div style={{
          padding: '4px 22px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* in the sidebar the title goes back to the home page */}
          <Brand {...(docked ? { onClick: () => go('home'), 'aria-label': 'Inicio' } : {})} style={{
            background: 'none', border: 'none', padding: 0, textAlign: 'left',
            cursor: docked ? 'pointer' : 'default',
          }}>
            <div style={{
              fontFamily: 'Manrope', fontSize: 10, letterSpacing: 2,
              color: theme.accent, fontWeight: 700,
            }}>MENÚ</div>
            <div style={{
              fontFamily: '"Instrument Serif", serif', fontSize: 26,
              color: theme.ink, lineHeight: 1.1, marginTop: 2,
            }}>
              Aprende <span style={{ fontStyle: 'italic', color: theme.accent }}>guitarra</span>
            </div>
          </Brand>
          {!docked && <button onClick={onClose} aria-label="Cerrar menú" style={{
            background: theme.card, border: `1px solid ${theme.hairline}`,
            borderRadius: 999, width: 36, height: 36, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: theme.ink,
          }}>
            <_Icon name="x" size={18} />
          </button>}
        </div>

        {/* Main entries */}
        <div style={{ padding: '0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {items.map(it => (
            <button key={it.id} onClick={() => pick(it.id)}
              aria-current={it.id === active ? 'page' : undefined}
              style={{ ...drawerRowStyle(theme), ...activeStyle(it.id) }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: theme.accentSoft, color: theme.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <_Icon name={it.icon} size={18} />
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: theme.ink }}>{it.label}</div>
                <div style={{ fontSize: 12, color: theme.inkSoft, marginTop: 1 }}>{it.sub}</div>
              </div>
              <_Icon name="chevron" size={16} color={theme.muted} />
            </button>
          ))}
        </div>

        <div style={{
          margin: '14px 22px 8px', height: 1, background: theme.hairline,
        }} />

        {/* Secondary entries */}
        <div style={{ padding: '0 14px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {secondary.map(it => (
            <button key={it.id} onClick={() => pick(it.id)}
              aria-current={it.id === active ? 'page' : undefined}
              style={{ ...drawerRowStyle(theme, true), ...activeStyle(it.id) }}>
              <_Icon name={it.icon} size={16} color={theme.accent} />
              <div style={{ flex: 1, textAlign: 'left', fontSize: 14, color: theme.ink }}>
                {it.label}
              </div>
              <_Icon name="chevron" size={14} color={theme.muted} />
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* Theme toggle pill */}
        <div style={{ padding: '14px 22px 0' }}>
          <button onClick={onToggleDark} style={{
            width: '100%', padding: '12px 14px',
            background: theme.card, border: `1px solid ${theme.hairline}`,
            borderRadius: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 10,
            fontFamily: 'Manrope', color: theme.ink, fontSize: 14, fontWeight: 500,
          }}>
            <_Icon name={dark ? 'sun' : 'moon'} size={16} color={theme.accent} />
            {dark ? 'Modo claro' : 'Modo oscuro'}
          </button>
        </div>
    </>
  );

  if (docked) {
    return (
      <nav aria-label="Menú" style={{
        width: 300, flexShrink: 0, height: '100%', boxSizing: 'border-box',
        background: theme.paperAlt, borderRight: `1px solid ${theme.hairline}`,
        display: 'flex', flexDirection: 'column',
        padding: '32px 0 24px', overflowY: 'auto',
      }}>
        {content}
      </nav>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.45)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 0.22s ease',
      }} />
      {/* Drawer */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, zIndex: 101,
        width: 'min(82%, 340px)',
        background: theme.paper,
        boxShadow: '8px 0 32px rgba(0,0,0,0.18)',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.26s cubic-bezier(.2,.7,.2,1)',
        display: 'flex', flexDirection: 'column',
        padding: 'max(40px, env(safe-area-inset-top, 0px) + 14px) 0 max(20px, env(safe-area-inset-bottom, 0px) + 10px)',
        overflowY: 'auto',
      }}>
        {content}
      </div>
    </>
  );
}

function drawerRowStyle(theme, compact) {
  return {
    background: 'transparent', border: 'none',
    borderRadius: 14, padding: compact ? '10px 12px' : '10px 10px',
    cursor: 'pointer', textAlign: 'left',
    display: 'flex', alignItems: 'center', gap: 12,
    fontFamily: 'Manrope', width: '100%',
  };
}

// ─────────────────────────────────────────────────────────────
// (Legacy) MenuScreen — kept exported but no longer used.
// ─────────────────────────────────────────────────────────────
function MenuScreen({ theme, go, dark, onToggleDark, favsCount, streak }) {
  const MENU = [
    { id: 'basic', label: 'Acordes básicos', sub: '14 acordes (Do a Si, mayor y menor)', icon: 'guitar' },
    { id: 'complex', label: 'Acordes complejos', sub: 'Séptimas, cejilla, alterados', icon: 'sparkle' },
    { id: 'all', label: 'Todas las notas y acordes', sub: 'Biblioteca completa con búsqueda', icon: 'book' },
    { id: 'test', label: 'Test de conocimiento', sub: '3 niveles · gana puntos', icon: 'trophy' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: 'max(54px, env(safe-area-inset-top, 0px) + 18px) 22px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'Manrope', fontSize: 11, letterSpacing: 2,
              color: theme.muted, fontWeight: 600,
            }}>HOLA, GUITARRISTA</div>
            <h1 style={{
              margin: '4px 0 0',
              fontFamily: '"Instrument Serif", serif',
              fontSize: 32, color: theme.ink, lineHeight: 1.05,
              letterSpacing: -0.3,
            }}>
              ¿Qué practicamos<br />
              <span style={{ fontStyle: 'italic', color: theme.accent }}>hoy</span>?
            </h1>
          </div>
          <button onClick={onToggleDark} style={{
            background: theme.card, border: `1px solid ${theme.hairline}`,
            borderRadius: 999, width: 38, height: 38, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: theme.ink, flexShrink: 0,
          }}>
            <_Icon name={dark ? 'sun' : 'moon'} size={18} />
          </button>
        </div>

        {/* Daily exercise + streak */}
        <button onClick={() => go('daily')} style={{
          width: '100%', marginTop: 18, padding: 16,
          background: theme.accent, color: '#FFF7EB',
          border: 'none', borderRadius: 18, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
          fontFamily: 'Manrope',
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 999,
            background: 'rgba(255,247,235,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <_Icon name="flame" size={22} color="#FFF7EB" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, letterSpacing: 1.5, opacity: 0.85, fontWeight: 600 }}>
              EJERCICIO DIARIO · DÍA {streak}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>
              Cambio rápido: C → G → Am → F
            </div>
          </div>
          <_Icon name="chevron" size={18} color="#FFF7EB" />
        </button>
      </div>

      {/* Menu list */}
      <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {MENU.map(item => (
          <button key={item.id} onClick={() => go(item.id)} style={{
            background: theme.card, border: `1px solid ${theme.hairline}`,
            borderRadius: 18, padding: '14px 16px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
            fontFamily: 'Manrope',
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: theme.accentSoft, color: theme.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <_Icon name={item.icon} size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: theme.ink }}>{item.label}</div>
              <div style={{ fontSize: 12, color: theme.inkSoft, marginTop: 2 }}>{item.sub}</div>
            </div>
            <_Icon name="chevron" size={18} color={theme.muted} />
          </button>
        ))}
      </div>

      {/* Footer chips */}
      <div style={{ padding: '18px 22px max(30px, env(safe-area-inset-bottom, 0px) + 18px)', display: 'flex', gap: 10 }}>
        <button onClick={() => go('favs')} style={{
          flex: 1, padding: '12px 14px', background: 'transparent',
          border: `1px dashed ${theme.hairline}`, borderRadius: 14, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Manrope',
          color: theme.ink, fontSize: 13, fontWeight: 500,
        }}>
          <_Icon name="heart" size={16} color={theme.accent} />
          Favoritos · {favsCount}
        </button>
        <button onClick={() => go('howto')} style={{
          flex: 1, padding: '12px 14px', background: 'transparent',
          border: `1px dashed ${theme.hairline}`, borderRadius: 14, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Manrope',
          color: theme.ink, fontSize: 13, fontWeight: 500,
        }}>
          <_Icon name="book" size={16} color={theme.accent} />
          Cómo leer
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CHORD LIST (basic / complex / all / favs)
// ─────────────────────────────────────────────────────────────
function ChordListScreen({ theme, title, chords, onBack, onSelect, favs, toggleFav, emptyMessage }) {
  const [q, setQ] = _us('');
  const filtered = _um(() => {
    if (!q.trim()) return chords;
    const term = q.toLowerCase();
    return chords.filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.symbol.toLowerCase().includes(term) ||
      c.id.toLowerCase().includes(term) ||
      c.notes.toLowerCase().includes(term)
    );
  }, [q, chords]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <_TopBar title={title} onBack={onBack} theme={theme} />
      <_SearchBar value={q} onChange={setQ} placeholder="Buscar acorde, nota..." theme={theme} />

      <div style={{ flex: 1, overflow: 'auto', padding: '0 18px 24px' }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '50px 20px',
            color: theme.muted, fontFamily: 'Manrope', fontSize: 14,
          }}>
            {emptyMessage || `Sin resultados para "${q}"`}
          </div>
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12,
          }}>
            {filtered.map(chord => (
              <ChordCard key={chord.id} chord={chord} theme={theme}
                onClick={() => onSelect(chord)}
                isFav={favs.includes(chord.id)}
                onFav={() => toggleFav(chord.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ChordCard({ chord, theme, onClick, isFav, onFav }) {
  return (
    <div onClick={onClick} style={{
      background: theme.card, borderRadius: 18,
      border: `1px solid ${theme.hairline}`, padding: 12,
      cursor: 'pointer', position: 'relative',
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <div>
          <div style={{
            fontFamily: '"Instrument Serif", serif', fontSize: 24,
            color: theme.ink, lineHeight: 1,
          }}>{chord.symbol}</div>
          <div style={{
            fontFamily: 'Manrope', fontSize: 11, color: theme.inkSoft, marginTop: 4,
          }}>{chord.name}</div>
        </div>
        <button onClick={e => { e.stopPropagation(); onFav(); }} style={{
          background: 'none', border: 'none', padding: 4, cursor: 'pointer',
          color: isFav ? theme.accent : theme.muted, marginRight: -4, marginTop: -4,
        }}>
          <_Icon name={isFav ? 'heart-fill' : 'heart'} size={16} />
        </button>
      </div>
      <div style={{ marginTop: 4, height: 110 }}>
        <_CD chord={chord} size="sm" theme={theme} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CHORD DETAIL
// ─────────────────────────────────────────────────────────────
function ChordDetailScreen({ theme, chord, onBack, isFav, onFav }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <_TopBar title={chord.symbol} onBack={onBack} theme={theme}
        right={
          <button onClick={onFav} style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            color: isFav ? theme.accent : theme.ink,
          }}>
            <_Icon name={isFav ? 'heart-fill' : 'heart'} size={22} />
          </button>
        } />

      <div style={{
        flex: 1, overflow: 'auto', padding: '4px 22px 26px',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        columnGap: 28, alignContent: 'start', alignItems: 'center',
      }}>
        <div>
        <div style={{ textAlign: 'center', marginBottom: 6 }}>
          <div style={{
            fontFamily: '"Instrument Serif", serif', fontSize: 56,
            color: theme.ink, lineHeight: 1,
          }}>{chord.symbol}</div>
          <div style={{
            fontFamily: 'Manrope', fontSize: 13, color: theme.inkSoft,
            marginTop: 4, letterSpacing: 0.4,
          }}>{chord.name}</div>
        </div>

        <div style={{
          background: theme.card, borderRadius: 24, padding: 22,
          margin: '18px 0', border: `1px solid ${theme.hairline}`,
          display: 'flex', justifyContent: 'center',
        }}>
          <div style={{ width: 230, height: 290 }}>
            <_CD chord={chord} size="lg" theme={theme} />
          </div>
        </div>
        </div>

        <div>
        <button onClick={() => _GD.playChord(chord)} style={{
          width: '100%', padding: '14px', background: theme.accent,
          border: 'none', borderRadius: 999, cursor: 'pointer',
          color: '#FFF7EB', fontSize: 15, fontWeight: 600, fontFamily: 'Manrope',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <_Icon name="play" size={16} color="#FFF7EB" />
          Escuchar acorde
        </button>

        <div style={{
          marginTop: 18, padding: '14px 16px',
          background: theme.accentSoft, borderRadius: 14,
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <div style={{ color: theme.accent, paddingTop: 1 }}>
            <_Icon name="sparkle" size={16} />
          </div>
          <div style={{
            flex: 1, fontFamily: 'Manrope', fontSize: 13,
            color: theme.ink, lineHeight: 1.5,
          }}>
            <div style={{ fontWeight: 600, marginBottom: 3 }}>Consejo</div>
            {chord.tip}
          </div>
        </div>

        <div style={{
          marginTop: 14, padding: '14px 16px',
          background: theme.card, borderRadius: 14,
          border: `1px solid ${theme.hairline}`,
          fontFamily: 'Manrope', fontSize: 13, color: theme.inkSoft,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginBottom: 8,
          }}>
            <span>Notas</span>
            <span style={{ color: theme.ink, fontWeight: 500 }}>{chord.notes}</span>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginBottom: 8,
          }}>
            <span>Dificultad</span>
            <span style={{ display: 'flex', gap: 3 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <_Icon key={i} name="star" size={12}
                  color={i <= chord.difficulty ? theme.accent : theme.hairline} />
              ))}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Categoría</span>
            <span style={{ color: theme.ink, fontWeight: 500 }}>
              {chord.category === 'basic' ? 'Básico' : 'Complejo'}
            </span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export { HomeScreen, MenuScreen, MenuDrawer, ChordListScreen, ChordDetailScreen, ChordCard, };
