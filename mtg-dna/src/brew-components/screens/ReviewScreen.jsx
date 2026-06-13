import { useState } from "react";

// Spine screens pad for the notch (top, clearing the back chevron) and the
// home indicator (bottom) now that no tab bar absorbs the bottom.
const SAFE_TOP    = "calc(env(safe-area-inset-top) + 56px)";
const SAFE_BOTTOM = "calc(env(safe-area-inset-bottom) + 24px)";

const DECK_GATE = 100;

// Review the accumulated swipe results before saving. Purely presentational —
// the Supabase writes live in the page that owns the brew state (Brew.jsx),
// keeping brew-components free of db imports.

// Stackables (basic lands etc.) can repeat — collapse to name + quantity.
function groupByName(cards) {
  const counts = new Map();
  for (const c of cards) {
    counts.set(c.name, (counts.get(c.name) ?? 0) + 1);
  }
  return [...counts.entries()].map(([name, quantity]) => ({ name, quantity }));
}

export default function ReviewScreen({
  decklist, maybeboard,
  onConfirm, saving, error,
  live, onRemove,
  commander,
}) {
  const [commanderName, setCommanderName] = useState("");
  const [buildName, setBuildName] = useState("");

  const groups = {
    decklist: groupByName(decklist),
    maybe: groupByName(maybeboard),
  };
  // Count toward the 100-card gate, matching deckTotal everywhere else: every
  // instance across the boards + the commander (never written to deck_cards).
  const deckCount = decklist.length + maybeboard.length + 1;
  const totalCards = decklist.length + maybeboard.length;
  const canSave = Boolean(commanderName.trim()) && totalCards > 0 && !saving;

  // A live session anchored to a legend shows the commander header; the
  // non-session save flow has no legend yet, so it keeps the text header.
  const showAnchor = live && commander;

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    background: "var(--color-bg)",
    color: "var(--color-text-primary)",
    fontFamily: "var(--font-system)",
    fontSize: 16,
    border: "1px solid var(--bevel-dark)",
    padding: "10px 12px",
    borderRadius: 0,
    outline: "none",
  };

  function renderSection(label, items, sectionKey) {
    return (
      <div key={sectionKey}>
        <div style={{
          fontSize: 11,
          letterSpacing: "0.14em",
          color: "var(--muted)",
          borderBottom: "1px solid var(--bevel-dark)",
          paddingBottom: 6,
          marginBottom: 6,
        }}>
          {label} · {items.reduce((n, c) => n + c.quantity, 0)}
        </div>
        {items.length === 0 ? (
          <div style={{ fontSize: 12, color: "var(--muted)", padding: "4px 0" }}>—</div>
        ) : (
          items.map(({ name, quantity }) => (
            <div key={name} style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              padding: "5px 0",
              fontSize: 13,
              color: "var(--text)",
            }}>
              <span style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>{name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                {quantity > 1 && (
                  <span style={{ color: "var(--muted)" }}>×{quantity}</span>
                )}
                {live && (
                  <button
                    onClick={() => onRemove(name, sectionKey)}
                    aria-label={`Remove ${name}`}
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      color: "var(--muted)",
                      fontFamily: "var(--font-system)",
                      fontSize: 14,
                      lineHeight: 1,
                      cursor: "pointer",
                    }}
                  >×</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100dvh",
      background: "var(--bg)",
      color: "var(--text)",
      fontFamily: "'Noto Sans', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      overflowY: "auto",
      paddingBottom: SAFE_BOTTOM,
    }}>

      {/* Commander anchor — sticky so the deck is always identifiable. Padded
          left of the brew back chevron so the two never overlap. */}
      {showAnchor && (
        <div style={{
          position: "sticky",
          top: 0,
          zIndex: 5,
          alignSelf: "stretch",
          background: "var(--bg)",
          borderBottom: "1px solid var(--bevel-dark)",
        }}>
          <div style={{
            maxWidth: 430,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
            paddingTop: "calc(env(safe-area-inset-top) + 10px)",
            paddingBottom: 12,
            paddingLeft: "calc(env(safe-area-inset-left) + 56px)",
            paddingRight: 20,
          }}>
            <div style={{
              width: 56, height: 56, flexShrink: 0,
              borderRadius: "5.5% / 4%",
              overflow: "hidden",
              background: "var(--color-surface)",
            }}>
              {commander.art && (
                <img
                  src={commander.art}
                  alt={commander.name}
                  draggable={false}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>
            <div style={{
              flex: 1, minWidth: 0,
              fontFamily: "'Zilla Slab', serif",
              fontSize: 18,
              letterSpacing: "0.02em",
              color: "var(--text)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {commander.name}
            </div>
            <div style={{
              fontFamily: "'Noto Sans Mono', monospace",
              fontSize: 13,
              color: deckCount >= DECK_GATE ? "var(--primary)" : "var(--muted)",
              flexShrink: 0,
            }}>
              {deckCount}/{DECK_GATE}
            </div>
          </div>
        </div>
      )}

      <div style={{
        width: "100%",
        maxWidth: 430,
        padding: showAnchor ? "20px 20px 40px" : `${SAFE_TOP} 20px 40px`,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}>

        {/* Text header only when there's no commander anchor (save flow). */}
        {!showAnchor && (
          <div style={{
            fontFamily: "var(--font-system)",
            fontSize: 20,
            letterSpacing: "0.08em",
            color: "var(--text)",
          }}>
            {live ? "DECK" : "REVIEW"} · {totalCards} CARD{totalCards !== 1 ? "S" : ""}
          </div>
        )}

        {/* DECKLIST always; MAYBEBOARD only when it holds cards. No pile. */}
        {renderSection("DECKLIST", groups.decklist, "decklist")}
        {maybeboard.length > 0 && renderSection("MAYBEBOARD", groups.maybe, "maybe")}

        {/* Name the brew — live sessions write on every flick, nothing to save */}
        {!live && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
            <input
              type="text"
              placeholder="Commander name"
              value={commanderName}
              onChange={e => setCommanderName(e.target.value)}
              autoComplete="off" autoCorrect="off" spellCheck={false}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Build name (optional)"
              value={buildName}
              onChange={e => setBuildName(e.target.value)}
              autoComplete="off" autoCorrect="off" spellCheck={false}
              style={inputStyle}
            />
            <button
              onClick={() => onConfirm(commanderName.trim(), buildName.trim())}
              disabled={!canSave}
              style={{
                width: "100%",
                background: "var(--color-titlebar)",
                color: "var(--color-titlebar-text)",
                fontFamily: "var(--font-system)",
                fontSize: "var(--font-size-xl)",
                letterSpacing: "0.12em",
                border: "none",
                padding: "16px 24px",
                borderRadius: 0,
                cursor: canSave ? "pointer" : "default",
                opacity: canSave ? 1 : 0.5,
              }}
            >
              {saving ? "SAVING…" : "SAVE BREW"}
            </button>
            {error && (
              <div style={{ fontSize: 12, color: "var(--danger)", lineHeight: 1.5 }}>
                {error}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
