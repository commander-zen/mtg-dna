import { useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { SEARCH_CHIPS } from "../data/searchChips";

// Render-only guided-search chip layer — toggles local selected state, does
// not call any search/query handler. Wiring into the search bar is a
// separate, later concern.
export default function SearchChips() {
  const { theme, mode } = useTheme();
  const [selected, setSelected] = useState(new Set());

  const dimColor     = mode === "light" ? theme.muted : theme.dim;
  const accentColor  = mode === "light" ? theme.gold  : theme.amber;
  const borderColor  = mode === "light" ? theme.border : theme.muted;

  function toggleChip(id) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {SEARCH_CHIPS.map(chip => {
        const active = selected.has(chip.id);
        return (
          <button
            key={chip.id}
            onClick={() => toggleChip(chip.id)}
            aria-pressed={active}
            style={{
              minHeight: 44,
              padding: "0 14px",
              display: "flex",
              alignItems: "center",
              border: `1px solid ${active ? accentColor : borderColor}`,
              background: active ? accentColor : "transparent",
              color: active ? theme.base : dimColor,
              fontFamily: "'Noto Sans', sans-serif",
              fontSize: 13,
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
