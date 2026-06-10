import { useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import PageHeader from "../components/PageHeader";
import SearchScreen from "../brew-components/screens/SearchScreen.jsx";
import { supabase } from "../lib/supabase.js";

// The brew-components were ported from Deck Stack, whose styles reference
// CSS custom properties (--bg, --color-surface, --bevel-*, etc.) in
// module-level style objects that can't call useTheme(). This bridge maps
// every Deck Stack variable onto MTG DNA theme tokens at the Brew root, so
// the ported components re-theme (including light/dark) without per-file
// style rewrites. Theme keys differ by mode, hence the || fallbacks.
function brewThemeVars(theme) {
  const panel = theme.surface || theme.paper;
  const text = theme.white || theme.ink;
  const muted = theme.dim || theme.muted;
  const accent = theme.amber || theme.gold;
  const success = theme.green || theme.gold;
  const danger = theme.stamp || "#c0392b";
  return {
    "--bg": theme.base,
    "--panel": panel,
    "--panel2": panel,
    "--text": text,
    "--text2": muted,
    "--muted": muted,
    "--primary": accent,
    "--secondary": success,
    "--success": success,
    "--danger": danger,
    "--active": accent,
    "--color-bg": theme.base,
    "--color-surface": panel,
    "--color-surface-raised": panel,
    "--color-chrome": panel,
    "--color-chrome-light": theme.border,
    "--color-chrome-mid": muted,
    "--color-chrome-dark": theme.border,
    "--color-titlebar": accent,
    "--color-titlebar-text": theme.base,
    "--color-text-primary": text,
    "--color-text-secondary": muted,
    "--color-text-chrome": text,
    "--bevel-light": theme.border,
    "--bevel-dark": theme.border,
    "--bevel-inset-light": theme.border,
    "--bevel-inset-dark": theme.border,
    "--font-system": "'Noto Sans', sans-serif",
    "--font-size-base": "13px",
    "--font-size-sm": "11px",
    "--font-size-lg": "16px",
    "--font-size-xl": "20px",
    "--space-1": "4px",
    "--space-2": "8px",
    "--space-3": "12px",
    "--space-4": "16px",
    "--space-5": "24px",
    "--space-6": "32px",
  };
}

export default function Brew() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search → pile flow lands in the next pass; this confirms the wiring.
  function handleSearch(query) {
    console.log("brew search:", query);
  }

  return (
    <div style={{
      height: "100%",
      overflowY: "auto",
      overflowX: "hidden",
      background: theme.base,
      WebkitOverflowScrolling: "touch",
      ...brewThemeVars(theme),
    }}>
      <div style={{ padding: "28px 20px 40px" }}>
        <PageHeader eyebrow="Helix" title="brew" />
        <SearchScreen
          supabase={supabase}
          onSearch={handleSearch}
          loading={loading}
          error={error}
          commanderCard={null}
          onCommanderCardChange={() => {}}
        />
      </div>
    </div>
  );
}
