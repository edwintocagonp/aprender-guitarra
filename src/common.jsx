// Main app for "Aprende Guitarra Acústica"
// All screens live here. Navigation is a simple history stack in state.

import { useState, useEffect, useMemo, useRef, useCallback, createContext, useContext } from "react";
import { BASIC_CHORDS, COMPLEX_CHORDS, ALL_CHORDS, playChord, playSingleNote } from "./data/chords.js";

// ─────────────────────────────────────────────────────────────
// Theme
// ─────────────────────────────────────────────────────────────
function makeTheme(dark, accent) {
  if (dark) {
    return {
      paper: '#161311',
      paperAlt: '#1F1B17',
      card: '#221D18',
      ink: '#F1E8D8',
      inkSoft: 'rgba(241,232,216,0.7)',
      muted: 'rgba(241,232,216,0.45)',
      hairline: 'rgba(241,232,216,0.12)',
      accent,
      accentSoft: 'color-mix(in oklch, ' + accent + ' 18%, transparent)',
      shadow: '0 8px 24px rgba(0,0,0,0.4)',
      success: '#7BC68A',
      error: '#E08C7F',
    };
  }
  return {
    paper: '#F4EEE3',
    paperAlt: '#EBE3D2',
    card: '#FBF6EA',
    ink: '#241B14',
    inkSoft: 'rgba(36,27,20,0.7)',
    muted: 'rgba(36,27,20,0.45)',
    hairline: 'rgba(36,27,20,0.1)',
    accent,
    accentSoft: 'color-mix(in oklch, ' + accent + ' 14%, transparent)',
    shadow: '0 8px 22px rgba(40,28,15,0.08)',
    success: '#3F8758',
    error: '#B0463A',
  };
}

// ─────────────────────────────────────────────────────────────
// Tiny icon set (drawn in line, not slop SVG)
// ─────────────────────────────────────────────────────────────
function Icon({ name, size = 20, color = 'currentColor', stroke = 1.7 }) {
  const c = color;
  const sw = stroke;
  const common = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: c, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (name) {
    case 'search':
      return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>;
    case 'back':
      return <svg {...common}><path d="M15 5l-7 7 7 7" /></svg>;
    case 'heart':
      return <svg {...common}><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z" /></svg>;
    case 'heart-fill':
      return <svg {...common} fill={c}><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z" /></svg>;
    case 'play':
      return <svg {...common} fill={c} stroke="none"><path d="M7 5l12 7-12 7V5z" /></svg>;
    case 'check':
      return <svg {...common}><path d="M5 12l5 5 9-11" /></svg>;
    case 'x':
      return <svg {...common}><path d="M6 6l12 12M18 6l-12 12" /></svg>;
    case 'sun':
      return <svg {...common}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>;
    case 'moon':
      return <svg {...common}><path d="M21 13a8 8 0 11-10-10 7 7 0 0010 10z" /></svg>;
    case 'book':
      return <svg {...common}><path d="M4 4h7a3 3 0 013 3v13a2 2 0 00-2-2H4V4zM20 4h-7a3 3 0 00-3 3v13a2 2 0 012-2h8V4z" /></svg>;
    case 'sparkle':
      return <svg {...common}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" /></svg>;
    case 'trophy':
      return <svg {...common}><path d="M8 4h8v5a4 4 0 01-8 0V4zM5 5h3v3a3 3 0 01-3-3zM16 5h3a3 3 0 01-3 3V5zM10 14h4v3h-4zM8 20h8" /></svg>;
    case 'chevron':
      return <svg {...common}><path d="M9 6l6 6-6 6" /></svg>;
    case 'guitar':
      return <svg {...common}><path d="M14 3l4 4M16 5l3.5 3.5M13 7l-7 7a3 3 0 104 4l7-7M9 13l-2 2" /></svg>;
    case 'flame':
      return <svg {...common}><path d="M12 3s4 4 4 8a4 4 0 11-8 0c0-2 1-3 2-4-1 5 3 5 3 1 0-2-1-3-1-5z" /></svg>;
    case 'star':
      return <svg {...common}><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8-4.3-4.1 5.9-.9L12 3z" /></svg>;
    case 'menu':
      return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
    default: return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Favorites (localStorage)
// ─────────────────────────────────────────────────────────────
function useFavorites() {
  const [favs, setFavs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('guitar.favs') || '[]'); }
    catch { return []; }
  });
  const toggle = useCallback((id) => {
    setFavs(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('guitar.favs', JSON.stringify(next));
      return next;
    });
  }, []);
  return [favs, toggle];
}

// ─────────────────────────────────────────────────────────────
// Layout — which screen size the app is on
//   phone:   < 640px, the app fills the screen as in a native app
//   wide:    ≥ 768px, room for two columns (home page)
//   desktop: ≥ 1024px, the menu becomes a sidebar that is always visible
// ─────────────────────────────────────────────────────────────
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const fn = (e) => setMatches(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, [query]);
  return matches;
}

function useLayoutSize() {
  const phone = useMediaQuery('(max-width: 639px)');
  const wide = useMediaQuery('(min-width: 768px)');
  const desktop = useMediaQuery('(min-width: 1024px)');
  return useMemo(() => ({ phone, wide, desktop }), [phone, wide, desktop]);
}

const LayoutContext = createContext({ phone: true, wide: false, desktop: false });
const useLayout = () => useContext(LayoutContext);

// ─────────────────────────────────────────────────────────────
// Reusable bits
// ─────────────────────────────────────────────────────────────
function TopBar({ title, onBack, onMenu, right, theme }) {
  const { phone } = useLayout();
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      // phones keep room for the status bar / notch
      padding: phone ? 'max(54px, env(safe-area-inset-top, 0px) + 18px) 18px 10px' : '28px 18px 10px',
      gap: 8,
    }}>
      <div style={{ width: 36, display: 'flex', alignItems: 'center' }}>
        {onBack ? (
          <button onClick={onBack} style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            color: theme.ink, display: 'flex', alignItems: 'center',
          }}>
            <Icon name="back" size={26} />
          </button>
        ) : onMenu ? (
          <button onClick={onMenu} style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            color: theme.ink, display: 'flex', alignItems: 'center',
          }}>
            <Icon name="menu" size={26} />
          </button>
        ) : null}
      </div>
      <div style={{
        flex: 1, textAlign: 'center', fontFamily: '"Instrument Serif", serif',
        fontSize: 22, color: theme.ink, letterSpacing: 0.2,
      }}>{title}</div>
      <div style={{ width: 36, display: 'flex', justifyContent: 'flex-end' }}>
        {right}
      </div>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder, theme }) {
  return (
    <div style={{
      margin: '6px 18px 14px',
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px',
      background: theme.card, borderRadius: 14,
      border: `1px solid ${theme.hairline}`,
    }}>
      <Icon name="search" size={18} color={theme.muted} />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          color: theme.ink, fontSize: 16, fontFamily: 'Manrope, system-ui, sans-serif',
          minWidth: 0,
        }}
      />
      {value && (
        <button onClick={() => onChange('')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: theme.muted, display: 'flex', padding: 0,
        }}>
          <Icon name="x" size={16} />
        </button>
      )}
    </div>
  );
}

export { makeTheme, Icon, useFavorites, TopBar, SearchBar, LayoutContext, useLayout, useLayoutSize };
