import { useState } from "react";

const TIERS = {
  S: { label: "S", color: "#f0c040", glow: "rgba(240,192,64,0.5)" },
  A: { label: "A", color: "#7ee8a2", glow: "rgba(126,232,162,0.4)" },
  B: { label: "B", color: "#60a5fa", glow: "rgba(96,165,250,0.35)" },
  C: { label: "C", color: "#c084fc", glow: "rgba(192,132,252,0.3)" },
  D: { label: "D", color: "#94a3b8", glow: "rgba(148,163,184,0.2)" },
};

const ZONES = {
  brewhouse: { label: "THE BREWHOUSE", sublabel: "Build & Tune", color: "#1a2a1a", border: "#2d5a2d", accent: "#4ade80" },
  vault:     { label: "THE VAULT",     sublabel: "Own & Collect", color: "#1a1a2a", border: "#2d2d5a", accent: "#818cf8" },
  table:     { label: "THE TABLE",     sublabel: "Play & Track",  color: "#2a1a1a", border: "#5a2d2d", accent: "#f87171" },
  ledger:    { label: "THE LEDGER",    sublabel: "History & Stats", color: "#1a1f2a", border: "#2d3d5a", accent: "#38bdf8" },
};

const TOOLS = [
  // S tier
  { id: "moxfield",    name: "Moxfield",      tier: "S", zone: "brewhouse", x: 22, y: 22, desc: "Deck storage, sharing, community. The de facto standard. Apple-polished." },
  { id: "archidekt",  name: "Archidekt",     tier: "S", zone: "brewhouse", x: 38, y: 22, desc: "Flexible, customizable deck manager. More control, more complexity." },
  { id: "scryfall",   name: "Scryfall",      tier: "S", zone: "brewhouse", x: 30, y: 38, desc: "Universal card database and search. Referenced constantly, by everyone." },
  { id: "edhrec",     name: "EDHREC",        tier: "S", zone: "brewhouse", x: 16, y: 38, desc: "Commander card recommendation engine. The gravity well of EDH deckbuilding." },
  // A tier
  { id: "scrycheck",  name: "ScryCheck",     tier: "A", zone: "brewhouse", x: 46, y: 38, desc: "Rule-based power level analysis. 5 vectors, fully traceable, 40K+ decks. Best-in-class." },
  { id: "manabox",    name: "ManaBox",       tier: "A", zone: "vault",     x: 68, y: 22, desc: "Mobile collection tracker + scanner. 1M+ downloads. EDHREC integration." },
  { id: "lotus",      name: "Lotus",         tier: "A", zone: "table",     x: 22, y: 72, desc: "Cleanest life counter. No ads, no friction. Handles everything at the table." },
  { id: "playgroup",  name: "Playgroup.gg",  tier: "A", zone: "ledger",    x: 68, y: 72, desc: "ELO pod tracking, Playscore, online play. 4.9★. Requires full pod buy-in." },
  // B tier
  { id: "cmdtemplate",name: "Cmdr Template", tier: "B", zone: "brewhouse", x: 30, y: 54, desc: "13K users, math-based recs, variant-aware collection, foil shimmer UI, community hub." },
  { id: "playnice",   name: "Play Nice",     tier: "B", zone: "ledger",    x: 80, y: 62, desc: "Deep game logging, cEDH-credible, MVP cards, FreedomWaffle/TopDeck import." },
  { id: "grimdeck",   name: "GrimDeck",      tier: "B", zone: "vault",     x: 80, y: 22, desc: "Collection + deck builder integrated from scratch. Free tier to 10K cards. Early." },
  // C tier
  { id: "edhpwrlvl",  name: "EDH Power Lvl", tier: "C", zone: "brewhouse", x: 46, y: 54, desc: "Most features of any analyzer. Pod Balance. Cluttered UX, unusable on mobile." },
  { id: "mtgmaster",  name: "MTG Master",    tier: "C", zone: "brewhouse", x: 16, y: 54, desc: "Shareable bracket reports. Very new. Spanish SEO pivot is a tell." },
  { id: "manatap",    name: "ManaTap AI",    tier: "C", zone: "brewhouse", x: 38, y: 54, desc: "Feature-rich AI companion. GPT-based, stale data (Oct 2025), early revenue stage." },
  { id: "nexus",      name: "Nexus",         tier: "C", zone: "ledger",    x: 68, y: 62, desc: "Web-first pod sync, no download needed. Private, ad-free. Thin product." },
  // D tier
  { id: "decklens",   name: "DeckLens",      tier: "D", zone: "brewhouse", x: 22, y: 62, desc: "20 features, no UX coherence. Dev toy. Runs in browser, no account needed." },
  { id: "podstats",   name: "MTG Pod Stats", tier: "D", zone: "ledger",    x: 80, y: 78, desc: "Lightweight pod logger. AI matchup insights. Donation model. Early stage." },
  { id: "deckstir",   name: "DeckStir",      tier: "D", zone: "brewhouse", x: 46, y: 62, desc: "Pivoted away from deck analyzer. Now a TCG commerce portal. Not a real option." },
];

const JOURNEY_STEPS = [
  {
    id: "idea",
    label: "1. The Idea",
    description: "You want to build a deck around a new commander.",
    tools: ["edhrec", "scryfall"],
    note: "EDHREC for card discovery. Scryfall for filtering and deep dives.",
  },
  {
    id: "build",
    label: "2. The Build",
    description: "You assemble the list and refine it.",
    tools: ["moxfield", "archidekt"],
    note: "Moxfield or Archidekt for list management. Most players pick one and stay.",
  },
  {
    id: "check",
    label: "3. The Check",
    description: "You want to know what power level this actually is before sitting down.",
    tools: ["scrycheck"],
    note: "ScryCheck. Import URL directly from Moxfield or Archidekt. Every point traceable.",
  },
  {
    id: "collect",
    label: "4. The Collection",
    description: "You need to check what you own and what you need to buy.",
    tools: ["manabox", "grimdeck"],
    note: "ManaBox for scanning physical cards. GrimDeck if you want collection + deck builder integrated.",
  },
  {
    id: "play",
    label: "5. The Game",
    description: "You're at the table. Someone needs to track life.",
    tools: ["lotus"],
    note: "Lotus. One person opens it. No setup, no ads, handles everything.",
  },
  {
    id: "log",
    label: "6. The Log",
    description: "Game ends. You want to record what happened.",
    tools: ["playgroup", "playnice"],
    note: "Playgroup.gg if your whole pod commits. Play Nice if you're the only one tracking (cEDH-adjacent). Both require intentional effort.",
  },
  {
    id: "gap",
    label: "7. The Gap",
    description: "You want to know why your win rate doesn't match your power level score.",
    tools: [],
    note: "Nothing connects ScryCheck's analysis to Playgroup.gg's results. This feedback loop — deck construction ↔ table performance — is unbuilt.",
    isGap: true,
  },
];

export default function EDHStackMap() {
  const [activeJourney, setActiveJourney] = useState(null);
  const [hoveredTool, setHoveredTool] = useState(null);
  const [mode, setMode] = useState("map"); // "map" | "journey"

  const highlightedTools = activeJourney
    ? JOURNEY_STEPS.find((s) => s.id === activeJourney)?.tools || []
    : [];

  const isHighlighted = (toolId) =>
    mode === "map" || highlightedTools.length === 0 || highlightedTools.includes(toolId);

  const isGapStep = activeJourney
    ? JOURNEY_STEPS.find((s) => s.id === activeJourney)?.isGap
    : false;

  const activeStep = JOURNEY_STEPS.find((s) => s.id === activeJourney);

  return (
    <div style={{
      fontFamily: "'DM Mono', 'Courier New', monospace",
      background: "#0a0c0f",
      minHeight: "100vh",
      color: "#e2e8f0",
      padding: "0",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 28px 16px",
        borderBottom: "1px solid #1e293b",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(10,12,15,0.95)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#475569", marginBottom: "3px", textTransform: "uppercase" }}>
            EDH Tech Stack
          </div>
          <div style={{ fontSize: "20px", fontWeight: "700", color: "#f1f5f9", letterSpacing: "-0.02em" }}>
            Current State Map
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["map", "journey"].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setActiveJourney(null); }}
              style={{
                padding: "7px 16px",
                borderRadius: "6px",
                border: mode === m ? "1px solid #334155" : "1px solid #1e293b",
                background: mode === m ? "#1e293b" : "transparent",
                color: mode === m ? "#f1f5f9" : "#64748b",
                fontSize: "11px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {m === "map" ? "Node Map" : "User Journey"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 65px)" }}>

        {/* Left sidebar — tier legend or journey steps */}
        <div style={{
          width: "220px",
          flexShrink: 0,
          borderRight: "1px solid #1e293b",
          padding: "20px 16px",
          overflowY: "auto",
          background: "#0a0c0f",
        }}>
          {mode === "map" ? (
            <>
              <div style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#475569", marginBottom: "14px", textTransform: "uppercase" }}>Tier Key</div>
              {Object.entries(TIERS).map(([k, v]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <div style={{
                    width: "24px", height: "24px", borderRadius: "5px",
                    background: v.color + "22",
                    border: `1px solid ${v.color}66`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: "700", color: v.color,
                  }}>{k}</div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                    {k === "S" ? "Universal baseline" :
                     k === "A" ? "Best-in-class" :
                     k === "B" ? "Real product, real users" :
                     k === "C" ? "Functional but flawed" :
                     "Not worth your time"}
                  </div>
                </div>
              ))}
              <div style={{ marginTop: "24px", fontSize: "10px", letterSpacing: "0.18em", color: "#475569", marginBottom: "14px", textTransform: "uppercase" }}>Zones</div>
              {Object.entries(ZONES).map(([k, v]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: v.accent + "88", border: `1px solid ${v.accent}` }} />
                  <div>
                    <div style={{ fontSize: "11px", color: "#e2e8f0" }}>{v.label}</div>
                    <div style={{ fontSize: "10px", color: "#475569" }}>{v.sublabel}</div>
                  </div>
                </div>
              ))}

              {hoveredTool && (
                <div style={{
                  marginTop: "24px",
                  padding: "12px",
                  background: "#111827",
                  border: `1px solid ${TIERS[hoveredTool.tier].color}44`,
                  borderRadius: "8px",
                }}>
                  <div style={{ fontSize: "12px", fontWeight: "700", color: TIERS[hoveredTool.tier].color, marginBottom: "6px" }}>
                    {hoveredTool.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", lineHeight: "1.6" }}>
                    {hoveredTool.desc}
                  </div>
                  <div style={{ marginTop: "8px", fontSize: "10px", color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Zone: {ZONES[hoveredTool.zone]?.label}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#475569", marginBottom: "14px", textTransform: "uppercase" }}>Player Journey</div>
              {JOURNEY_STEPS.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveJourney(activeJourney === step.id ? null : step.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 12px",
                    marginBottom: "6px",
                    borderRadius: "7px",
                    border: activeJourney === step.id
                      ? step.isGap ? "1px solid #ef444466" : "1px solid #3b82f666"
                      : "1px solid #1e293b",
                    background: activeJourney === step.id
                      ? step.isGap ? "#1c0a0a" : "#0f1c2e"
                      : "transparent",
                    color: activeJourney === step.id ? "#f1f5f9" : "#64748b",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: "11px", fontWeight: "700", marginBottom: "2px", color: step.isGap ? "#ef4444" : activeJourney === step.id ? "#60a5fa" : "#64748b" }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: "10px", lineHeight: "1.5", color: "#475569" }}>
                    {step.description}
                  </div>
                </button>
              ))}
            </>
          )}
        </div>

        {/* Main map area */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"
            style={{ position: "absolute", top: 0, left: 0 }}>
            <defs>
              <filter id="glow-s">
                <feGaussianBlur stdDeviation="1.2" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="glow-a">
                <feGaussianBlur stdDeviation="0.8" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse">
                <path d="M 4 0 L 0 0 0 4" fill="none" stroke="#1e293b" strokeWidth="0.15"/>
              </pattern>
            </defs>

            {/* Background grid */}
            <rect width="100" height="100" fill="url(#grid)" opacity="0.5" />

            {/* Zone backgrounds */}
            {/* Brewhouse — top left */}
            <rect x="8" y="8" width="46" height="56" rx="2"
              fill={ZONES.brewhouse.color} stroke={ZONES.brewhouse.border} strokeWidth="0.3" opacity="0.7" />
            <text x="10" y="12.5" fill={ZONES.brewhouse.accent} fontSize="2.2" fontWeight="700" letterSpacing="0.15" opacity="0.8">THE BREWHOUSE</text>
            <text x="10" y="15" fill={ZONES.brewhouse.accent} fontSize="1.6" opacity="0.5">Build &amp; Tune</text>

            {/* Vault — top right */}
            <rect x="58" y="8" width="34" height="36" rx="2"
              fill={ZONES.vault.color} stroke={ZONES.vault.border} strokeWidth="0.3" opacity="0.7" />
            <text x="60" y="12.5" fill={ZONES.vault.accent} fontSize="2.2" fontWeight="700" letterSpacing="0.15" opacity="0.8">THE VAULT</text>
            <text x="60" y="15" fill={ZONES.vault.accent} fontSize="1.6" opacity="0.5">Own &amp; Collect</text>

            {/* Table — bottom left */}
            <rect x="8" y="66" width="36" height="26" rx="2"
              fill={ZONES.table.color} stroke={ZONES.table.border} strokeWidth="0.3" opacity="0.7" />
            <text x="10" y="70.5" fill={ZONES.table.accent} fontSize="2.2" fontWeight="700" letterSpacing="0.15" opacity="0.8">THE TABLE</text>
            <text x="10" y="73" fill={ZONES.table.accent} fontSize="1.6" opacity="0.5">Play &amp; Track</text>

            {/* Ledger — bottom right */}
            <rect x="58" y="48" width="34" height="44" rx="2"
              fill={ZONES.ledger.color} stroke={ZONES.ledger.border} strokeWidth="0.3" opacity="0.7" />
            <text x="60" y="52.5" fill={ZONES.ledger.accent} fontSize="2.2" fontWeight="700" letterSpacing="0.15" opacity="0.8">THE LEDGER</text>
            <text x="60" y="55" fill={ZONES.ledger.accent} fontSize="1.6" opacity="0.5">History &amp; Stats</text>

            {/* Gap indicator in center */}
            <line x1="46" y1="50" x2="58" y2="50" stroke="#ef4444" strokeWidth="0.25" strokeDasharray="1,0.8" opacity="0.4"/>
            <line x1="46" y1="66" x2="58" y2="66" stroke="#ef4444" strokeWidth="0.25" strokeDasharray="1,0.8" opacity="0.4"/>
            <rect x="46" y="50" width="12" height="16" rx="1.5"
              fill="#1c0808" stroke="#ef444444" strokeWidth="0.3" />
            <text x="52" y="56.5" textAnchor="middle" fill="#ef4444" fontSize="1.8" fontWeight="700" opacity="0.9">THE</text>
            <text x="52" y="59" textAnchor="middle" fill="#ef4444" fontSize="1.8" fontWeight="700" opacity="0.9">GAP</text>
            <text x="52" y="62" textAnchor="middle" fill="#ef444488" fontSize="1.3">No feedback</text>
            <text x="52" y="63.8" textAnchor="middle" fill="#ef444488" fontSize="1.3">loop exists</text>

            {/* Journey connector arrows when journey mode active */}
            {mode === "journey" && activeJourney && !isGapStep && highlightedTools.length > 1 && (() => {
              const pts = highlightedTools.map(id => TOOLS.find(t => t.id === id)).filter(Boolean);
              if (pts.length < 2) return null;
              return pts.slice(0, -1).map((t, i) => {
                const next = pts[i + 1];
                return (
                  <line key={i}
                    x1={t.x} y1={t.y} x2={next.x} y2={next.y}
                    stroke="#60a5fa" strokeWidth="0.4" strokeDasharray="1,0.6" opacity="0.6"
                  />
                );
              });
            })()}

            {/* Gap journey pulse */}
            {mode === "journey" && isGapStep && (
              <rect x="44" y="48" width="16" height="20" rx="2"
                fill="none" stroke="#ef4444" strokeWidth="0.5" opacity="0.6"
                style={{ animation: "none" }}
              />
            )}

            {/* Tool nodes */}
            {TOOLS.map((tool) => {
              const tier = TIERS[tool.tier];
              const lit = isHighlighted(tool.id);
              const isHov = hoveredTool?.id === tool.id;
              const isActive = highlightedTools.includes(tool.id);
              const size = tool.tier === "S" ? 4.2 : tool.tier === "A" ? 3.6 : tool.tier === "B" ? 3.2 : tool.tier === "C" ? 2.8 : 2.4;
              const opacity = lit ? 1 : 0.18;

              return (
                <g key={tool.id}
                  style={{ cursor: "pointer" }}
                  opacity={opacity}
                  onMouseEnter={() => setHoveredTool(tool)}
                  onMouseLeave={() => setHoveredTool(null)}
                >
                  {/* Outer glow ring for active/S/A */}
                  {(isHov || isActive || tool.tier === "S") && (
                    <circle cx={tool.x} cy={tool.y} r={size * 0.85}
                      fill="none" stroke={tier.color} strokeWidth="0.4" opacity="0.35" />
                  )}
                  {/* Node body */}
                  <circle cx={tool.x} cy={tool.y} r={size * 0.58}
                    fill={tier.color + (tool.tier === "S" ? "33" : "1a")}
                    stroke={tier.color}
                    strokeWidth={isHov || isActive ? "0.5" : "0.3"}
                    filter={tool.tier === "S" || tool.tier === "A" ? "url(#glow-a)" : "none"}
                  />
                  {/* Tier badge */}
                  <text x={tool.x} y={tool.y + 0.5} textAnchor="middle" dominantBaseline="middle"
                    fill={tier.color} fontSize={size * 0.45} fontWeight="800">
                    {tool.tier}
                  </text>
                  {/* Tool name */}
                  <text x={tool.x} y={tool.y + size * 0.72} textAnchor="middle"
                    fill={isHov || isActive ? "#f1f5f9" : "#94a3b8"}
                    fontSize="1.35" fontWeight={tool.tier === "S" || tool.tier === "A" ? "600" : "400"}>
                    {tool.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Journey step detail overlay */}
          {mode === "journey" && activeStep && (
            <div style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "min(500px, 90%)",
              background: activeStep.isGap ? "#1c0a0a" : "#0f1a2e",
              border: `1px solid ${activeStep.isGap ? "#ef444466" : "#3b82f666"}`,
              borderRadius: "10px",
              padding: "16px 20px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <span style={{
                  fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em",
                  color: activeStep.isGap ? "#ef4444" : "#60a5fa",
                  background: activeStep.isGap ? "#ef444422" : "#3b82f622",
                  padding: "3px 9px", borderRadius: "4px",
                }}>
                  {activeStep.label}
                </span>
                <span style={{ fontSize: "13px", color: "#e2e8f0" }}>{activeStep.description}</span>
              </div>
              <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.7", borderTop: "1px solid #1e293b", paddingTop: "10px" }}>
                {activeStep.note}
              </div>
              {activeStep.tools.length > 0 && (
                <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
                  {activeStep.tools.map(id => {
                    const t = TOOLS.find(x => x.id === id);
                    if (!t) return null;
                    const tier = TIERS[t.tier];
                    return (
                      <span key={id} style={{
                        fontSize: "11px", padding: "3px 10px", borderRadius: "5px",
                        background: tier.color + "22", border: `1px solid ${tier.color}55`,
                        color: tier.color, fontWeight: "600",
                      }}>
                        {t.name}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
