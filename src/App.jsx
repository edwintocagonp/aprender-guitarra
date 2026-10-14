// Main app — navigation + screen routing

import { useState as useStateApp, useEffect as useEffectApp, useMemo as useMemoApp } from "react";
import { makeTheme, useFavorites, LayoutContext, useLayoutSize } from "./common.jsx";
import { HomeScreen, MenuDrawer, ChordListScreen, ChordDetailScreen } from "./screens/Screens.jsx";
import { HowToScreen, DailyExerciseScreen, TestLevelScreen, TestModeScreen } from "./screens/Extra.jsx";
import { TestRunScreen, TestResultsScreen } from "./screens/TestRunner.jsx";
import * as G from "./data/chords.js";

// Appearance: light or dark (toggled from the app) and the accent colour
const PREFERENCE_DEFAULTS = {
  accent: 'oklch(0.62 0.13 40)', // terracotta
  darkMode: false,
};

function usePreferences(defaults) {
  const [values, setValues] = useStateApp(defaults);
  const set = (key, value) => setValues((prev) => ({ ...prev, [key]: value }));
  return [values, set];
}

// The section of the menu a screen belongs to (highlighted in the sidebar)
function menuSection(frame) {
  if (frame.screen === 'list') return frame.kind;
  if (frame.screen === 'howto' || frame.screen === 'daily') return frame.screen;
  if (frame.screen.startsWith('test')) return 'test-level';
  return null;
}

function App() {
  const [t, setTweak] = usePreferences(PREFERENCE_DEFAULTS);
  const layout = useLayoutSize();

  const [dark, setDark] = useStateApp(t.darkMode);
  useEffectApp(() => { setDark(t.darkMode); }, [t.darkMode]);

  const theme = useMemoApp(() => makeTheme(dark, t.accent), [dark, t.accent]);

  const [favs, toggleFav] = useFavorites();

  // history stack: each entry is { screen, ...payload }
  const [stack, setStack] = useStateApp([{ screen: 'home' }]);
  const current = stack[stack.length - 1];
  const push = (frame) => setStack(s => [...s, frame]);
  const pop = () => setStack(s => s.length > 1 ? s.slice(0, -1) : s);
  const reset = (frame) => setStack([frame]);

  // Hamburger drawer
  const [drawerOpen, setDrawerOpen] = useStateApp(false);
  // Auto-close drawer when route changes
  useEffectApp(() => { setDrawerOpen(false); }, [stack.length, current.screen]);

  // Central go() — used by home buttons AND drawer entries. The sidebar is
  // top-level navigation: its entries start over from home (so "back" returns
  // there) instead of piling up screens.
  const goSection = (id) => {
    reset({ screen: 'home' });
    go(id);
  };
  const go = (id) => {
    if (id === 'basic')        push({ screen: 'list', kind: 'basic' });
    else if (id === 'complex') push({ screen: 'list', kind: 'complex' });
    else if (id === 'all')     push({ screen: 'list', kind: 'all' });
    else if (id === 'favs')    push({ screen: 'list', kind: 'favs' });
    else if (id === 'howto')   push({ screen: 'howto' });
    else if (id === 'daily')   push({ screen: 'daily' });
    else if (id === 'test-level' || id === 'test') push({ screen: 'test-level' });
    else if (id === 'home')    reset({ screen: 'home' });
  };

  // streak — persists in localStorage
  const [streak, setStreak] = useStateApp(() =>
    parseInt(localStorage.getItem('guitar.streak') || '1', 10));
  const completeDaily = () => {
    const next = streak + 1;
    setStreak(next);
    localStorage.setItem('guitar.streak', String(next));
  };

  // test best-scores
  const [lastScores, setLastScores] = useStateApp(() => {
    try { return JSON.parse(localStorage.getItem('guitar.bestScores') || '{}'); }
    catch { return {}; }
  });
  const recordScore = (level, mode, score) => {
    const key = level + '.' + mode;
    setLastScores(prev => {
      const next = { ...prev, [key]: Math.max(prev[key] || 0, score) };
      localStorage.setItem('guitar.bestScores', JSON.stringify(next));
      return next;
    });
  };

  // The page behind the app has the paper colour of the theme
  useEffectApp(() => {
    document.body.style.background = theme.paper;
  }, [theme.paper]);

  // Render the current screen
  const screenEl = (() => {
    const s = current.screen;
    if (s === 'home' || s === 'menu') {
      return <HomeScreen theme={theme} dark={dark}
        onToggleDark={() => setTweak('darkMode', !dark)}
        openMenu={layout.desktop ? undefined : () => setDrawerOpen(true)}
        streak={streak}
        favsCount={favs.length}
        go={go} />;
    }
    if (s === 'list') {
      const map = {
        basic:   { chords: G.BASIC_CHORDS, title: 'Acordes básicos' },
        complex: { chords: G.COMPLEX_CHORDS, title: 'Acordes complejos' },
        all:     { chords: G.ALL_CHORDS, title: 'Todos los acordes' },
        favs:    {
          chords: G.ALL_CHORDS.filter(c => favs.includes(c.id)),
          title: 'Favoritos',
          empty: 'Aún no has guardado ningún acorde. Pulsa el corazón para añadir.',
        },
      };
      const cfg = map[current.kind];
      return <ChordListScreen theme={theme}
        title={cfg.title}
        chords={cfg.chords}
        emptyMessage={cfg.empty}
        favs={favs} toggleFav={toggleFav}
        onBack={pop}
        onSelect={(chord) => push({ screen: 'detail', chord })} />;
    }
    if (s === 'detail') {
      return <ChordDetailScreen theme={theme} chord={current.chord}
        isFav={favs.includes(current.chord.id)}
        onFav={() => toggleFav(current.chord.id)}
        onBack={pop} />;
    }
    if (s === 'howto') {
      return <HowToScreen theme={theme} onBack={pop} />;
    }
    if (s === 'daily') {
      return <DailyExerciseScreen theme={theme} onBack={pop}
        streak={streak} onComplete={completeDaily} />;
    }
    if (s === 'test-level') {
      return <TestLevelScreen theme={theme} onBack={pop}
        onPick={(level) => push({ screen: 'test-mode', level })} />;
    }
    if (s === 'test-mode') {
      return <TestModeScreen theme={theme} level={current.level} onBack={pop}
        lastScores={lastScores}
        onPick={(mode) => push({ screen: 'test-run', level: current.level, mode })} />;
    }
    if (s === 'test-run') {
      return <TestRunScreen theme={theme} level={current.level} mode={current.mode}
        onExit={() => reset({ screen: 'home' })}
        onFinish={(score, total) => {
          recordScore(current.level, current.mode, score);
          setStack(s2 => [...s2.slice(0, -1), {
            screen: 'test-results', level: current.level, mode: current.mode, score, total,
          }]);
        }} />;
    }
    if (s === 'test-results') {
      return <TestResultsScreen theme={theme}
        score={current.score} total={current.total}
        level={current.level} mode={current.mode}
        onRetry={() => setStack(s2 => [
          ...s2.slice(0, -1),
          { screen: 'test-run', level: current.level, mode: current.mode },
        ])}
        onHome={() => reset({ screen: 'home' })} />;
    }
    return null;
  })();

  // Phones and tablets: a drawer over the screen. Desktop: a sidebar.
  const menuProps = {
    theme, dark, onToggleDark: () => setTweak('darkMode', !dark),
    favsCount: favs.length, streak,
  };
  const drawerEl = !layout.desktop && (
    <MenuDrawer {...menuProps} open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      go={go} />
  );

  // The screens fill the window on a phone; on wider screens they sit in a
  // centred column (wider for the home page and the chord grids), next to the
  // sidebar on a desktop
  const columnWidth = layout.phone ? '100%'
    : current.screen === 'home' ? 1100
    : current.screen === 'list' ? 1040
    : 760;

  return (
    <LayoutContext.Provider value={layout}>
      <div style={{
        position: 'fixed', inset: 0, display: 'flex',
        background: theme.paper, color: theme.ink,
        overflow: 'hidden',
        fontFamily: 'Manrope, system-ui, sans-serif',
        WebkitFontSmoothing: 'antialiased',
      }}>
        {layout.desktop && (
          <MenuDrawer {...menuProps} docked active={menuSection(current)} go={goSection} />
        )}
        <main style={{ flex: 1, minWidth: 0, height: '100%', position: 'relative' }}>
          <div style={{
            height: '100%', maxWidth: columnWidth, margin: '0 auto', position: 'relative',
          }}>
            {screenEl}
          </div>
        </main>
        {drawerEl}
      </div>
    </LayoutContext.Provider>
  );
}

export default App;
