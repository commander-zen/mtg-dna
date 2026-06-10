import { useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import ToolChips from "../components/ToolChips";
import PageHeader from "../components/PageHeader";
import { BREW_TOOLS } from "../data/tools";
import SearchScreen from "../brew-components/screens/SearchScreen.jsx";
import SwipeScreen from "../brew-components/screens/SwipeScreen.jsx";
import ReviewScreen from "../brew-components/screens/ReviewScreen.jsx";
import { fetchFirstPageForSwipe } from "../lib/scryfall.js";
import { supabase } from "../lib/supabase.js";

// Brew sub-screens are always dark, regardless of the app theme mode —
// card art is designed against dark and the light tokens were leaking in.
const BREW = {
  base:    "#0a0e1a",
  surface: "#111820",
  text:    "#e8f0ee",
  dim:     "#4a6358",
  amber:   "#e8a020",
  green:   "#7ab89a",
  red:     "#a04040",
  border:  "#1a2520",
};

// The brew-components were ported from Deck Stack, whose styles reference
// CSS custom properties (--bg, --color-surface, --bevel-*, etc.) in
// module-level style objects that can't call useTheme(). This bridge maps
// every Deck Stack variable onto the fixed Brew dark palette at the
// takeover root, so the ported components stay dark without per-file edits.
const BREW_VARS = {
  "--bg": BREW.base,
  "--panel": BREW.surface,
  "--panel2": BREW.surface,
  "--text": BREW.text,
  "--text2": BREW.dim,
  "--muted": BREW.dim,
  "--primary": BREW.amber,
  "--secondary": BREW.green,
  "--success": BREW.green,
  "--danger": BREW.red,
  "--active": BREW.amber,
  "--color-bg": BREW.base,
  "--color-surface": BREW.surface,
  "--color-surface-raised": BREW.surface,
  "--color-chrome": BREW.surface,
  "--color-chrome-light": BREW.border,
  "--color-chrome-mid": BREW.dim,
  "--color-chrome-dark": BREW.border,
  "--color-titlebar": BREW.amber,
  "--color-titlebar-text": BREW.base,
  "--color-text-primary": BREW.text,
  "--color-text-secondary": BREW.dim,
  "--color-text-chrome": BREW.text,
  "--bevel-light": BREW.border,
  "--bevel-dark": BREW.border,
  "--bevel-inset-light": BREW.border,
  "--bevel-inset-dark": BREW.border,
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

const BREW_MODES = [
  { key: "legend",    name: "New Legend",     desc: "Start fresh around a commander" },
  { key: "import",    name: "Import Deck",    desc: "Bring in a Moxfield or Archidekt URL" },
  { key: "pile",      name: "Free Pile",      desc: "No commander, just building a stack" },
  { key: "discovery", name: "Card Discovery", desc: "Browse and swipe without a goal" },
];

// PageHeader pattern on the fixed dark palette. The shared component reads
// useTheme(), which would follow the app's light mode in here.
function BrewModeSelect({ onSelect }) {
  return (
    <div style={{ padding: "28px 20px 40px", maxWidth: 430, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontFamily: "'Noto Sans', sans-serif",
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: BREW.dim,
          marginBottom: 4,
        }}>
          Helix
        </div>
        <div style={{
          fontFamily: "'Noto Sans', sans-serif",
          fontSize: 28,
          fontWeight: 300,
          letterSpacing: "0.02em",
          color: BREW.text,
          lineHeight: 1.1,
        }}>
          brew
        </div>
        <div style={{ width: 32, height: 1, background: BREW.amber, marginTop: 10 }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {BREW_MODES.map((m, i) => (
          <div
            key={m.key}
            onClick={() => onSelect(m.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 0",
              borderBottom: i < BREW_MODES.length - 1 ? `1px solid ${BREW.border}` : "none",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontSize: 15,
                fontWeight: 400,
                color: BREW.text,
                lineHeight: 1.2,
                marginBottom: 3,
              }}>
                {m.name}
              </div>
              <div style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontSize: 12,
                fontWeight: 300,
                color: `${BREW.text}60`,
                lineHeight: 1.5,
              }}>
                {m.desc}
              </div>
            </div>
            <span
              className="material-symbols-rounded"
              style={{
                flexShrink: 0,
                fontSize: 16,
                fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
                color: BREW.dim,
              }}
            >
              arrow_forward
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Collapse instances to (card_name, section) rows with quantities for deck_cards.
function buildCardRows(deckId, boards) {
  const rows = [];
  for (const [section, cards] of boards) {
    const counts = new Map();
    for (const c of cards) counts.set(c.name, (counts.get(c.name) ?? 0) + 1);
    for (const [card_name, quantity] of counts) {
      rows.push({ deck_id: deckId, card_name, quantity, section });
    }
  }
  return rows;
}

export default function Brew() {
  const { theme } = useTheme();
  // shell | modes | search | swipe | review
  const [brewView, setBrewView] = useState("shell");
  const [brewMode, setBrewMode] = useState(null);

  const [query, setQuery]           = useState("");
  const [swipeCards, setSwipeCards] = useState([]);
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [swipeOrder, setSwipeOrder] = useState("name");
  const [swipeDir, setSwipeDir]     = useState("desc");
  const [pile, setPile]             = useState([]);
  const [decklist, setDecklist]     = useState([]);
  const [maybeboard, setMaybeboard] = useState([]);

  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState(null);

  function resetBrew() {
    setBrewMode(null);
    setQuery("");
    setSwipeCards([]);
    setSwipeIndex(0);
    setPile([]);
    setDecklist([]);
    setMaybeboard([]);
    setError(null);
    setSaveError(null);
  }

  async function runSearch(q, order = swipeOrder, dir = swipeDir) {
    setLoading(true);
    setError(null);
    try {
      const { cards } = await fetchFirstPageForSwipe(q, null, { order, dir });
      if (!cards.length) throw new Error("No cards found for that query.");
      setQuery(q);
      setSwipeCards(cards);
      setSwipeIndex(0);
      setBrewView("swipe");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSortChange(order, dir) {
    setSwipeOrder(order);
    setSwipeDir(dir);
    if (query) runSearch(query, order, dir);
  }

  // Upsert legend → create deck → bulk insert deck_cards (002 schema).
  async function handleConfirmSave(commanderName, buildName) {
    setSaving(true);
    setSaveError(null);
    try {
      const { data: legend, error: legendError } = await supabase
        .from("legends")
        .upsert({ name: commanderName }, { onConflict: "name" })
        .select()
        .single();
      if (legendError) throw legendError;

      const { data: deck, error: deckError } = await supabase
        .from("decks")
        .insert({
          legend: commanderName, // legacy text column, kept in sync
          legend_id: legend.id,
          build_name: buildName || null,
          status: "Active",
        })
        .select()
        .single();
      if (deckError) throw deckError;

      const rows = buildCardRows(deck.id, [
        ["pile", pile],
        ["decklist", decklist],
        ["maybe", maybeboard],
      ]);
      for (let i = 0; i < rows.length; i += 100) {
        const { error: cardError } = await supabase
          .from("deck_cards")
          .insert(rows.slice(i, i + 100));
        if (cardError) throw cardError;
      }

      resetBrew();
      setBrewView("shell");
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // tools.js is static data, so the Helix: Brew entry carries an action key
  // and the live handler is injected here.
  const tools = BREW_TOOLS.map(t =>
    t.action === "brew-search" ? { ...t, onClick: () => setBrewView("modes") } : t
  );

  if (brewView !== "shell") {
    const backTarget = brewView === "modes" ? "shell"
      : brewView === "search" ? "modes"
      : brewView === "swipe" ? "search"
      : "swipe";
    // Swipe view: the stack strip owns the top edge, so the exit moves bottom-left.
    const backPosition = brewView === "swipe"
      ? { bottom: 10, left: 10 }
      : { top: 10, left: 10 };

    return (
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: BREW.base,
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        ...BREW_VARS,
      }}>
        <button
          onClick={() => setBrewView(backTarget)}
          aria-label="Back"
          style={{
            position: "fixed",
            ...backPosition,
            zIndex: 51,
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            padding: 0,
            color: BREW.text,
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

        {brewView === "modes" && (
          <BrewModeSelect
            onSelect={(key) => {
              setBrewMode(key);
              setBrewView("search");
            }}
          />
        )}

        {brewView === "search" && (
          <SearchScreen
            onSearch={runSearch}
            loading={loading}
            error={error}
            commanderCard={null}
            onCommanderCardChange={() => {}}
          />
        )}

        {brewView === "swipe" && (
          <SwipeScreen
            cards={swipeCards}
            pile={pile}
            onPileChange={setPile}
            maybeboard={maybeboard}
            onMaybeboardChange={setMaybeboard}
            decklist={decklist}
            onDecklistChange={setDecklist}
            onGoToPile={() => setBrewView("review")}
            onGoToSearch={() => setBrewView("search")}
            onSearchMore={() => setBrewView("search")}
            commanderCard={null}
            onCommanderCardChange={() => {}}
            initialIndex={swipeIndex}
            onIndexChange={setSwipeIndex}
            swipeOrder={swipeOrder}
            swipeDir={swipeDir}
            onSortChange={handleSortChange}
            activeDeckId={null}
            onSavePile={() => {}}
          />
        )}

        {brewView === "review" && (
          <ReviewScreen
            pile={pile}
            decklist={decklist}
            maybeboard={maybeboard}
            onConfirm={handleConfirmSave}
            saving={saving}
            error={saveError}
          />
        )}
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
