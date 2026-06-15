import { useState } from "react";

// Spine screens pad for the notch (top, clearing the back chevron) and the
// home indicator (bottom) now that no tab bar absorbs the bottom.
const SAFE_TOP    = "calc(env(safe-area-inset-top) + 56px)";
const SAFE_BOTTOM = "calc(env(safe-area-inset-bottom) + 24px)";

const DECK_GATE = 100;

// WREC tag chips, abbreviated to fit mobile. Values mirror the wrec_tag enum;
// the writes themselves live in Brew.jsx (this stays db-free).
const WREC_CHIPS = [
  { tag: "ramp",            label: "RAMP" },
  { tag: "card-advantage",  label: "CARD-ADV" },
  { tag: "disruption",      label: "DISRUPTION" },
  { tag: "mass-disruption", label: "MASS-DIS" },
  { tag: "plan",            label: "PLAN" },
];
const LABEL_BY_TAG = Object.fromEntries(WREC_CHIPS.map(c => [c.tag, c.label]));

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
  cardTags, onToggleTag,
}) {
  const [commanderName, setCommanderName] = useState("");
  const [buildName, setBuildName] = useState("");
  // Tap-to-expand: only one card's WREC chip selector open at a time. Chosen
  // over always-on chips so five 44px targets fit mobile width cleanly and
  // untagged cards stay chip-free (no "uncategorized" noise).
  const [expandedKey, setExpandedKey] = useState(null);

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

  // WREC composition counts (by card quantity). Multi-tag means these can sum
  // to more than the deck size — a composition view, not a partition. A zero
  // category is the dump-stat tell, so it renders dimmed.
  const wrecCounts = WREC_CHIPS.map(({ tag, label }) => {
    let n = 0;
    for (const k in (cardTags ?? {})) {
      const e = cardTags[k];
      if (e?.tags?.includes(tag)) n += (e.quantity ?? 1);
    }
    return { tag, label, n };
  });

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
          items.map(({ name, quantity }) => {
            const key = `${sectionKey}:${name}`;
            const tags = cardTags?.[key]?.tags ?? [];
            const expanded = expandedKey === key;
            return (
              <div key={name}>
                {/* Tapping the row (live) opens its WREC chip selector. */}
                <div
                  onClick={live ? () => setExpandedKey(k => (k === key ? null : key)) : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    minHeight: live ? 44 : undefined,
                    padding: "5px 0",
                    fontSize: 13,
                    color: "var(--text)",
                    cursor: live ? "pointer" : "default",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <span style={{
                    flex: 1, minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>{name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    {/* Active tags, compact, when collapsed — untagged shows nothing */}
                    {!expanded && tags.length > 0 && (
                      <span style={{
                        fontFamily: "'Noto Sans Mono', monospace",
                        fontSize: 9,
                        letterSpacing: "0.06em",
                        color: "var(--primary)",
                      }}>
                        {tags.map(t => LABEL_BY_TAG[t] ?? t).join(" · ")}
                      </span>
                    )}
                    {quantity > 1 && (
                      <span style={{ color: "var(--muted)" }}>×{quantity}</span>
                    )}
                    {live && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onRemove(name, sectionKey); }}
                        aria-label={`Remove ${name}`}
                        style={{
                          minHeight: 44, minWidth: 44,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: "transparent",
                          border: "none",
                          padding: 0,
                          color: "var(--muted)",
                          fontFamily: "var(--font-system)",
                          fontSize: 16,
                          lineHeight: 1,
                          cursor: "pointer",
                        }}
                      >×</button>
                    )}
                  </div>
                </div>

                {/* WREC chip selector — five 44px multi-select chips */}
                {live && expanded && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "4px 0 10px" }}>
                    {WREC_CHIPS.map(({ tag, label }) => {
                      const active = tags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={(e) => { e.stopPropagation(); onToggleTag?.(name, sectionKey, tag); }}
                          style={{
                            minHeight: 44,
                            padding: "0 12px",
                            display: "flex", alignItems: "center",
                            border: `1px solid ${active ? "var(--primary)" : "var(--muted)"}`,
                            background: active ? "var(--primary)" : "transparent",
                            color: active ? "var(--color-bg)" : "var(--muted)",
                            fontFamily: "'Noto Sans Mono', monospace",
                            fontSize: 10,
                            letterSpacing: "0.08em",
                            borderRadius: 0,
                            cursor: "pointer",
                            WebkitTapHighlightColor: "transparent",
                          }}
                        >{label}</button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
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

        {/* WREC composition band — counts per category (by quantity). Multi-tag
            so they can exceed deck size; a 0 reads dimmed as a structural gap. */}
        {live && (
          <div style={{
            display: "flex", flexWrap: "wrap", alignItems: "center",
            fontFamily: "'Noto Sans Mono', monospace",
            fontSize: 11,
            paddingBottom: 8,
            borderBottom: "1px solid var(--bevel-dark)",
          }}>
            {wrecCounts.map(({ tag, label, n }, i) => (
              <span key={tag} style={{ whiteSpace: "nowrap" }}>
                {i > 0 && <span style={{ color: "var(--muted)", margin: "0 6px" }}>·</span>}
                <span style={{ color: n === 0 ? "var(--muted)" : "var(--text)" }}>{label} {n}</span>
              </span>
            ))}
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
