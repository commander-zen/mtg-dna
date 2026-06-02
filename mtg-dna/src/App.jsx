import { useState } from "react";
import EDHStackMap from "./EDHStackMap.jsx";

// ─── Color tokens (Crystal/Suicune palette) ───────────────────────────────────
const C = {
  base:    "#06040f",
  surface: "#0d0a1a",
  border:  "#1a1530",
  blue:    "#5b8fff",
  purple:  "#a78bfa",
  cyan:    "#00c9ff",
  text:    "#e0f2ff",
  muted:   "#6b7fa8",
  dim:     "#2a2545",
};

// ─── Nav config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "home",     label: "Home",       icon: "home",           iconFilled: "home"           },
  { id: "collection", label: "Collection", icon: "style",        iconFilled: "style"          },
  { id: "brew",     label: "Brew",        icon: "science",       iconFilled: "science"        },
  { id: "play",     label: "Play",        icon: "person",        iconFilled: "person"         },
  { id: "analyze",  label: "Analyze",     icon: "bar_chart",     iconFilled: "bar_chart"      },
];

// ─── Placeholder screen component ─────────────────────────────────────────────
function PlaceholderScreen({ tab }) {
  const icons = {
    home:       { glyph: "home",    color: C.cyan,   desc: "Your Commander hub. Recent decks, pod history, and what's next." },
    collection: { glyph: "style",   color: C.purple, desc: "Every card you own. Scan, track, and deploy from your vault." },
    brew:       { glyph: "science", color: "#4ade80", desc: "Deck Stack lives here. Swipe, build, tune. Powered by Scryfall." },
    play:       { glyph: "person",  color: "#f87171", desc: "Pod Check and Life Track. Everything at the table." },
  };
  const info = icons[tab.id];

  return (
    <div style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "20px",
      padding: "40px 32px",
      fontFamily: "'Noto Sans', sans-serif",
      color: C.text,
      background: C.base,
    }}>
      {/* Big icon */}
      <div style={{
        width: 88,
        height: 88,
        borderRadius: 24,
        background: `${info.color}18`,
        border: `1px solid ${info.color}44`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 0 40px ${info.color}22`,
      }}>
        <span className="material-symbols-rounded" style={{
          fontSize: 40,
          fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 48",
          color: info.color,
        }}>{info.glyph}</span>
      </div>

      {/* Label */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: C.text,
          marginBottom: 8,
        }}>
          {tab.label}
        </div>
        <div style={{
          fontSize: 14,
          color: C.muted,
          lineHeight: 1.6,
          maxWidth: 280,
        }}>
          {info.desc}
        </div>
      </div>

      {/* Coming soon pill */}
      <div style={{
        padding: "6px 16px",
        borderRadius: 100,
        background: `${info.color}14`,
        border: `1px solid ${info.color}33`,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: info.color,
      }}>
        Coming soon
      </div>
    </div>
  );
}

// ─── Glass Nav Bar ─────────────────────────────────────────────────────────────
function GlassNav({ active, onSelect }) {
  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 200,
      display: "flex",
      justifyContent: "center",
      paddingBottom: "env(safe-area-inset-bottom, 12px)",
      paddingTop: 8,
      // The blur backdrop behind the whole bar region
      background: "linear-gradient(to top, rgba(6,4,15,0.92) 60%, rgba(6,4,15,0))",
    }}>
      {/* The pill */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        background: "rgba(18, 14, 36, 0.72)",
        backdropFilter: "blur(24px) saturate(1.6)",
        WebkitBackdropFilter: "blur(24px) saturate(1.6)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 32,
        padding: "6px 8px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
        minWidth: 300,
        maxWidth: 420,
        width: "calc(100% - 40px)",
      }}>
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          // Pick accent color per tab
          const accent = {
            home:       C.cyan,
            collection: C.purple,
            brew:       "#4ade80",
            play:       "#f87171",
            analyze:    C.blue,
          }[tab.id];

          return (
            <button
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                padding: "8px 4px 6px",
                borderRadius: 24,
                border: "none",
                cursor: "pointer",
                background: isActive ? `${accent}22` : "transparent",
                transition: "background 0.2s, transform 0.15s",
                transform: isActive ? "scale(1.05)" : "scale(1)",
                outline: "none",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {/* Icon */}
              <span
                className="material-symbols-rounded"
                style={{
                  fontSize: 24,
                  fontVariationSettings: isActive
                    ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                    : "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
                  color: isActive ? accent : C.muted,
                  transition: "color 0.2s, font-variation-settings 0.2s",
                }}
              >
                {tab.icon}
              </span>
              {/* Label */}
              <span style={{
                fontSize: 10,
                fontFamily: "'Noto Sans', sans-serif",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? accent : C.muted,
                letterSpacing: "0.02em",
                lineHeight: 1,
                transition: "color 0.2s",
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("analyze");

  const navHeight = 90; // rough height to reserve at bottom

  const renderScreen = () => {
    const tab = TABS.find(t => t.id === activeTab);
    if (activeTab === "analyze") {
      return (
        <div style={{ height: "100%", overflow: "hidden" }}>
          <EDHStackMap />
        </div>
      );
    }
    return <PlaceholderScreen tab={tab} />;
  };

  return (
    <div style={{
      height: "100dvh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      background: C.base,
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Screen content — padded above the nav */}
      <div style={{
        flex: 1,
        overflow: "hidden",
        paddingBottom: navHeight,
      }}>
        {renderScreen()}
      </div>

      {/* Glass nav */}
      <GlassNav active={activeTab} onSelect={setActiveTab} />
    </div>
  );
}
