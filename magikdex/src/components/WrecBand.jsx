// The WREC taxonomy constants are co-located with their renderer on purpose
// (one canonical home). That trips react-refresh's component-only rule, which
// only affects HMR granularity in dev — the same trade-off ThemeContext makes.
/* eslint-disable react-refresh/only-export-components */

// Shared WREC composition band — five EQUAL cells, a count over a micro label.
// Extracted from ReviewScreen (Change 12) so the deck view and the Box detail
// pane render the SAME readout, not two look-alikes.
//
// Palette is passed as PROPS, not read from CSS vars, because this renders in
// two different color contexts: the always-dark brew takeover (where the callers
// pass var(--primary)/var(--muted)/var(--text) from the BREW_VARS bridge) and
// the theme-aware Box (where LegendIdentity passes useTheme() values). Pass
// onTapTag to make the cells filter (deck view); omit it for a read-only
// readout (Box). A 0 renders dimmed — the dump-stat tell — and stays tappable.

// The current WREC tag set (values mirror the wrec_tag enum, migration 006),
// abbreviated to fit mobile. Canonical home for the taxonomy; ReviewScreen
// imports these rather than keeping its own copy.
export const WREC_CHIPS = [
  { tag: "ramp",            label: "RAMP" },
  { tag: "card-advantage",  label: "CARD-ADV" },
  { tag: "disruption",      label: "DISRUPTION" },
  { tag: "mass-disruption", label: "MASS-DIS" },
  { tag: "plan",            label: "PLAN" },
];
export const LABEL_BY_TAG = Object.fromEntries(WREC_CHIPS.map(c => [c.tag, c.label]));

export default function WrecBand({ counts, accent, muted, text, activeTag = null, onTapTag }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)" }}>
      {counts.map(({ tag, label, n }) => {
        const active = activeTag === tag;
        const dim = n === 0;
        return (
          <button
            key={tag}
            onClick={onTapTag ? () => onTapTag(tag) : undefined}
            style={{
              minHeight: 44,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 1,
              background: "transparent", border: "none", padding: 0,
              borderBottom: `2px solid ${active ? accent : "transparent"}`,
              cursor: onTapTag ? "pointer" : "default",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <span style={{
              fontFamily: "'Noto Sans Mono', monospace",
              fontSize: 13,
              color: dim ? muted : active ? accent : text,
            }}>
              {n}
            </span>
            <span style={{
              fontFamily: "'Noto Sans Mono', monospace",
              fontSize: 8,
              letterSpacing: "0.1em",
              color: muted,
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
