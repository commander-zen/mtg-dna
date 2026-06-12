import { useEffect, useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { supabase } from "../lib/supabase";
import { fetchCardByName, getCardImage } from "../lib/scryfall.js";
import AddLegendSheet from "./AddLegendSheet";

const DECK_GATE = 100;

// A deck's total = sum of deck_cards quantities + 1 for the commander
// (the commander itself is never written to deck_cards).
function deckTotal(deck) {
  const cardSum = (deck.deck_cards ?? []).reduce((sum, dc) => sum + (dc.quantity ?? 0), 0);
  return cardSum + 1;
}

export default function LegendBox({ onSelectLegend }) {
  const { theme, mode } = useTheme();
  const [legends, setLegends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [artByName, setArtByName] = useState({});
  const [addOpen, setAddOpen] = useState(false);

  const dimColor   = mode === "light" ? theme.muted : theme.dim;
  const textColor  = mode === "light" ? theme.ink   : theme.white;

  async function loadLegends() {
    const { data, error } = await supabase
      .from("legends")
      .select("id, name, scryfall_id, image_uri, decks(id, status, deck_cards(quantity))")
      .order("name");
    if (!error) setLegends(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadLegends();
  }, []);

  // Selecting a card in AddLegendSheet upserts it (no deck) and refreshes the grid.
  async function handleAddLegend(card) {
    await supabase
      .from("legends")
      .upsert({ name: card.name }, { onConflict: "name" });
    setAddOpen(false);
    setLoading(true);
    await loadLegends();
  }

  // Fetch art_crop for any legend missing a stored image_uri.
  useEffect(() => {
    const missing = legends.filter(l => !l.image_uri && !artByName[l.name]);
    if (missing.length === 0) return;
    let cancelled = false;
    (async () => {
      for (const legend of missing) {
        try {
          const card = await fetchCardByName(legend.name);
          const art = getCardImage(card, "art_crop");
          if (!cancelled && art) {
            setArtByName(prev => ({ ...prev, [legend.name]: art }));
          }
        } catch { /* skip on lookup failure */ }
      }
    })();
    return () => { cancelled = true; };
  }, [legends, artByName]);

  if (loading) return null;

  return (
    <>
      {legends.length === 0 && (
        <div style={{
          fontFamily: "'Noto Sans Mono', monospace",
          fontSize: 12,
          color: dimColor,
          opacity: 0.6,
          marginBottom: 8,
        }}>
          no legends yet
        </div>
      )}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 8,
      }}>
      {legends.map(legend => {
        const highest = (legend.decks ?? []).reduce(
          (max, d) => Math.max(max, deckTotal(d)), 0
        );
        const gated = highest < DECK_GATE;
        const art = legend.image_uri || artByName[legend.name];

        return (
          <button
            key={legend.id}
            onClick={() => onSelectLegend(legend)}
            style={{
              position: "relative",
              display: "block",
              width: "100%",
              aspectRatio: "5 / 4",
              padding: 0,
              border: "none",
              borderRadius: 0,
              background: theme.paper ?? theme.surface ?? "transparent",
              cursor: "pointer",
              overflow: "hidden",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {art ? (
              <img
                src={art}
                alt={legend.name}
                draggable={false}
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  objectFit: "cover",
                  filter: gated ? "grayscale(1)" : "none",
                }}
              />
            ) : (
              <div style={{ position: "absolute", inset: 0, background: theme.border }} />
            )}

            {gated && (
              <div style={{
                position: "absolute",
                top: 4, right: 6,
                fontFamily: "'Noto Sans Mono', monospace",
                fontSize: 10,
                color: "rgba(255,255,255,0.7)",
                textShadow: "0 1px 2px rgba(0,0,0,0.8)",
              }}>
                {highest}/{DECK_GATE}
              </div>
            )}

            <div style={{
              position: "absolute",
              left: 0, right: 0, bottom: 0,
              padding: "4px 6px",
              background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)",
              fontFamily: "'Zilla Slab', serif",
              fontSize: 12,
              color: "#ffffff",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textAlign: "left",
            }}>
              {legend.name}
            </div>
          </button>
        );
      })}

      <button
        onClick={() => setAddOpen(true)}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          width: "100%",
          aspectRatio: "5 / 4",
          padding: 0,
          border: `1px dashed ${dimColor}`,
          borderRadius: 0,
          background: "transparent",
          cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <span
          className="material-symbols-rounded"
          style={{ fontSize: 22, color: dimColor }}
        >
          add
        </span>
        <span style={{
          fontFamily: "'Noto Sans Mono', monospace",
          fontSize: 10,
          color: dimColor,
        }}>
          add legend
        </span>
      </button>
      </div>

      <AddLegendSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSelect={handleAddLegend}
      />
    </>
  );
}
