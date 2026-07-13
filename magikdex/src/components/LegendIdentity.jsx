import { useEffect, useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { supabase } from "../lib/supabase.js";
import { getCardData, getCardImage, formatManaCost } from "../lib/scryfall.js";
import { deckTotal, resolveLegendDeck } from "../lib/legendDeck.js";
import { fetchDeckCardsWithTags } from "../lib/deckTags.js";
import WrecBand, { WREC_CHIPS } from "./WrecBand.jsx";

const DECK_GATE = 100;

// The detail pane of the storage-box Home: the selected commander as a
// device readout. LEFT = the actual card image ("sprite"); RIGHT = stacked
// label/value fields; footer = the deck row, the one door into the deck
// list (brew lives on the deck list's bottom nav now, not here). Fills its
// pane height with no internal scroll.
export default function LegendIdentity({ legend }) {
  const { theme, mode } = useTheme();
  const [oracleCard, setOracleCard] = useState(null);
  const [decks, setDecks] = useState(legend.decks ?? []);
  // WREC composition of the selected deck (Change 12) — the footer readout is
  // now the deck's role coverage, not a redundant name/count line. Fetched per
  // selected deck; untagged/empty decks honestly read zeros.
  const [tagRows, setTagRows] = useState([]);

  const dimColor    = mode === "light" ? theme.muted : theme.dim;
  const textColor   = mode === "light" ? theme.ink   : theme.white;
  const ruleColor   = mode === "light" ? theme.gold  : theme.amber;
  const borderColor = mode === "light" ? theme.border : theme.muted;
  const plateBg     = mode === "light" ? theme.paper : theme.surface;

  // Cache-first (memoized) lookup — this used to hit live api.scryfall.com on
  // every legend select, which made the detail pane's sprite the slowest thing
  // on the Home surface. getCardData reads the local cards cache and only
  // falls to the live API on a true miss.
  useEffect(() => {
    let cancelled = false;
    // Clear the stale card immediately so the pane never shows the prior legend.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOracleCard(null);
    getCardData(legend.name)
      .then(card => { if (!cancelled && card) setOracleCard(card); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [legend.name]);

  // Re-fetch this legend's decks so counts reflect the latest save —
  // the `legend` prop carries the snapshot from when the slot was tapped.
  useEffect(() => {
    let cancelled = false;
    supabase
      .from("legends")
      .select("decks(id, status, build_name, deck_cards(quantity))")
      .eq("id", legend.id)
      .single()
      .then(({ data, error }) => {
        if (!cancelled && !error && data) setDecks(data.decks ?? []);
      });
    return () => { cancelled = true; };
  }, [legend.id]);

  // Load the resolved deck's WREC tags whenever the deck changes (select/reload).
  useEffect(() => {
    const d = resolveLegendDeck(decks);
    // Reset when the selected legend has no deck — a plain sync clear, not a
    // cascade (matches the codebase's other guarded reset effects).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!d?.id) { setTagRows([]); return; }
    let cancelled = false;
    fetchDeckCardsWithTags(d.id)
      .then(rows => { if (!cancelled) setTagRows(rows ?? []); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [decks]);

  const cardImage = oracleCard ? (getCardImage(oracleCard, "normal") ?? getCardImage(oracleCard, "large")) : null;
  const typeLine = oracleCard?.type_line ?? legend.type_line ?? "";
  // Every legal commander is a legendary creature, so "Legendary Creature — "
  // is dead weight eating horizontal space. Display-only: show the subtypes
  // after the em dash; fall back to the full type if it's not a creature
  // (e.g. a planeswalker/Background commander) so nothing reads blank.
  const displayType = (/creature/i.test(typeLine) && typeLine.includes("—"))
    ? (typeLine.split("—")[1]?.trim() || typeLine)
    : typeLine;
  const manaCost = formatManaCost(oracleCard?.mana_cost ?? oracleCard?.card_faces?.[0]?.mana_cost ?? legend.mana_cost);

  // ONE definition of "this legend's deck" — the readout fields and the deck
  // row below both use this same resolved deck, so they can never point at
  // different rows. See lib/legendDeck.js for the resolution rule.
  const deck = resolveLegendDeck(decks);
  // Count by card quantity, same as ReviewScreen's band (multi-tag can sum past
  // the deck size — it's a composition readout, not a partition).
  const wrecCounts = WREC_CHIPS.map(({ tag, label }) => {
    let n = 0;
    for (const r of tagRows) if (r.tags?.includes(tag)) n += (r.quantity ?? 1);
    return { tag, label, n };
  });
  // No deck row yet still counts 1: the commander is part of the 100 but is
  // never written to deck_cards (deckTotal's own rule) — without this, the
  // readout flips 0/100 → 1/100 the moment the deck list is first opened.
  const total = deck ? deckTotal(deck) : 1;
  const complete = total >= DECK_GATE;

  const field = (label, value, valueColor) => (
    <div style={{ minWidth: 0 }}>
      <div style={{
        fontFamily: "'Noto Sans Mono', monospace",
        fontSize: 9,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: dimColor,
        marginBottom: 1,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "'Zilla Slab', serif",
        fontSize: 15,
        lineHeight: 1.15,
        color: valueColor ?? textColor,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}>
        {value || "—"}
      </div>
    </div>
  );

  return (
    <div style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      padding: "8px 16px 4px",
      overflow: "hidden",
    }}>
      {/* Sprite + readout */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", gap: 14 }}>
        {/* Card image — a FIXED box every legend fills identically: the box
            height is the pane height and the width follows the MTG card ratio
            (63:88). The img is absolutely positioned so the source image's
            intrinsic size can never drive the box (otherwise an oversized- or
            old-frame art would render taller than a normal card). object-fit
            cover fills without distortion; corner mask unchanged. */}
        <div style={{
          position: "relative",
          height: "100%",
          aspectRatio: "63 / 88",
          flexShrink: 0,
          borderRadius: "4.8% / 3.4%",
          overflow: "hidden",
          background: plateBg,
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
        }}>
          {cardImage && (
            <img
              src={cardImage}
              alt={legend.name}
              draggable={false}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover", display: "block",
              }}
            />
          )}
        </div>

        {/* Readout — label/value fields, vertically centered */}
        <div style={{
          flex: 1, minWidth: 0,
          display: "flex", flexDirection: "column", justifyContent: "center",
          gap: 9,
        }}>
          {field("name", legend.name)}
          {field("type", displayType.toLowerCase())}
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: "'Noto Sans Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: dimColor,
              marginBottom: 1,
            }}>
              mana
            </div>
            <div style={{
              fontFamily: "'Noto Sans Mono', monospace",
              fontSize: 14,
              color: textColor,
            }}>
              {manaCost || "—"}
            </div>
          </div>
          {field("deck", `${total}/${DECK_GATE}`, complete ? ruleColor : textColor)}
        </div>
      </div>

      {/* Footer — WREC composition readout (Change 12), replacing the old
          name·count row (which just repeated the sprite + readout above). The
          deck-row door is gone: loading is now "tap the already-selected
          legend" (Change 13, handled in Home). Read-only band — no filtering
          here; zeros are honest for untagged/empty decks. Constant footprint. */}
      <div style={{ flexShrink: 0, paddingTop: 8, borderTop: `1px solid ${borderColor}` }}>
        <WrecBand
          counts={wrecCounts}
          accent={ruleColor}
          muted={dimColor}
          text={textColor}
        />
      </div>
    </div>
  );
}
