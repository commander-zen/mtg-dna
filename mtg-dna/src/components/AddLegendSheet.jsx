import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../theme/ThemeContext";
import { searchCommanders } from "../lib/scryfall.js";

export default function AddLegendSheet({ open, onClose, onSelect }) {
  const { theme, mode } = useTheme();
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState([]);
  const abortRef = useRef(null);
  const inputRef = useRef(null);

  const textColor   = mode === "light" ? theme.ink   : theme.white;
  const dimColor    = mode === "light" ? theme.muted : theme.dim;
  const borderColor = mode === "light" ? theme.border : theme.muted;

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      abortRef.current?.abort();
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const data = await searchCommanders(query, { signal: ctrl.signal });
        if (!ctrl.signal.aborted) setResults(data);
      } catch { /* aborted or network error */ }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  function handleSelect(card) {
    abortRef.current?.abort();
    onSelect(card);
  }

  return createPortal(
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 220,
          background: "rgba(0,0,0,0.6)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.28s",
        }}
      />
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 221,
        display: "flex", justifyContent: "center",
        transform: open ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)",
        pointerEvents: open ? "auto" : "none",
      }}>
        <div style={{
          width: "100%", maxWidth: 600,
          maxHeight: "70dvh",
          background: theme.base,
          borderTop: `1px solid ${borderColor}`,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          <div style={{ padding: "16px 20px 8px" }}>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="search for a legend…"
              autoCorrect="off"
              autoCapitalize="off"
              autoComplete="off"
              spellCheck={false}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "transparent",
                color: textColor,
                fontFamily: "'Noto Sans', sans-serif",
                fontSize: 16,
                fontWeight: 300,
                border: "none",
                borderBottom: `1px solid ${borderColor}`,
                borderRadius: 0,
                padding: "8px 0",
                outline: "none",
              }}
            />
          </div>

          <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", padding: "0 20px 20px" }}>
            {results.map(card => (
              <button
                key={card.id}
                onClick={() => handleSelect(card)}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  background: "transparent", border: "none", borderRadius: 0,
                  padding: "12px 0",
                  borderBottom: `1px solid ${borderColor}`,
                  cursor: "pointer",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <div style={{
                  fontFamily: "'Zilla Slab', serif",
                  fontSize: 15,
                  color: textColor,
                }}>
                  {card.name}
                </div>
                {card.type_line && (
                  <div style={{
                    fontFamily: "'Noto Sans Mono', monospace",
                    fontSize: 11,
                    color: dimColor,
                    marginTop: 2,
                  }}>
                    {card.type_line.toLowerCase()}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
