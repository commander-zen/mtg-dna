import { useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import ToolChips from "../components/ToolChips";
import PageHeader from "../components/PageHeader";
import { BREW_TOOLS } from "../data/tools";
import SearchScreen from "../brew-components/screens/SearchScreen.jsx";

// The brew-components were ported from Deck Stack, whose styles reference
// CSS custom properties (--bg, --color-surface, --bevel-*, etc.) in
// module-level style objects that can't call useTheme(). This bridge maps
// every Deck Stack variable onto MTG DNA theme tokens at the takeover root,
// so the ported components re-theme (including light/dark) without per-file
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
  const [brewView, setBrewView] = useState("shell");

  const handleBack = () => setBrewView("shell");

  // tools.js is static data, so the Helix: Brew entry carries an action key
  // and the live handler is injected here.
  const tools = BREW_TOOLS.map(t =>
    t.action === "brew-search" ? { ...t, onClick: () => setBrewView("search") } : t
  );

  if (brewView === "search") {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: theme.base,
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        ...brewThemeVars(theme),
      }}>
        {/* SearchScreen has no back affordance of its own, and this takeover
            covers the nav bar — without this button there is no way out. */}
        <button
          onClick={handleBack}
          aria-label="Back to Brew tools"
          style={{
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 51,
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            padding: 0,
            color: theme.white || theme.ink,
            cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <span
            className="material-symbols-rounded"
            style={{
              fontSize: 22,
              fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
            }}
          >
            arrow_back
          </span>
        </button>

        <SearchScreen
          onBack={handleBack}
          onSearch={(query) => console.log("brew search:", query)}
          loading={false}
          error={null}
          commanderCard={null}
          onCommanderCardChange={() => {}}
        />
      </div>
    );
  }

  return (
    <div style={{
      height: "100%",
      overflowY: "auto",
      overflowX: "hidden",
      background: theme.base,
      WebkitOverflowScrolling: "touch",
    }}>
      <div style={{ padding: "28px 20px 40px" }}>
        <PageHeader eyebrow="Helix" title="brew" />
        <ToolChips tools={tools} />
      </div>
    </div>
  );
}
