import { useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import SectionHeader from "../components/SectionHeader";
import TeaserCard from "../components/TeaserCard";
import PageHeader from "../components/PageHeader";
import { BREW_TOOLS } from "../data/tools";

const S_TIER = [
  { name: "Moxfield",  url: "https://moxfield.com"  },
  { name: "Archidekt", url: "https://archidekt.com" },
];

const OTHER_TIER = BREW_TOOLS.filter(t => t.tier !== "S");

function favicon(url, sz) {
  return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=${sz}`;
}

export default function Brew() {
  const { theme, mode } = useTheme();
  const [openIndex, setOpenIndex] = useState(null);

  const chipBg      = mode === "light" ? theme.paper   : theme.surface;
  const chipBorder  = mode === "light" ? theme.border  : theme.muted;
  const nameColor   = mode === "light" ? theme.ink     : theme.white;
  const rowBorder   = mode === "light" ? theme.border  : theme.muted;
  const visitBorder = mode === "light" ? theme.ink     : theme.amber;
  const visitColor  = mode === "light" ? theme.ink     : theme.amber;
  const mutedColor  = mode === "light" ? `${theme.ink}99` : `${theme.white}66`;

  const handleToggle = (i) => setOpenIndex(prev => (prev === i ? null : i));

  return (
    <div style={{
      height: "100%",
      overflowY: "auto",
      overflowX: "hidden",
      background: theme.base,
      WebkitOverflowScrolling: "touch",
    }}>
      <div style={{ padding: "28px 20px 40px" }}>

        {/* Section A — Deck Stack teaser */}
        <div style={{ marginBottom: 36 }}>
          <PageHeader title="DECK STACK" />
          <TeaserCard
            accent="#4ade80"
            name="Deck Stack"
            desc="Tinder-style card swiping for Commander brewing. Search, swipe, build. Scryfall made fun."
          />
        </div>

        {/* Section B — S Tier large chips */}
        <div style={{ marginBottom: 36 }}>
          <SectionHeader label="S Tier" />
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}>
            {S_TIER.map(({ name, url }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  background: chipBg,
                  border: `1px solid ${chipBorder}`,
                  textDecoration: "none",
                }}
              >
                <img
                  src={favicon(url, 64)}
                  width={40}
                  height={40}
                  alt={name}
                  style={{ display: "block" }}
                />
                <span style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: nameColor,
                  textAlign: "center",
                }}>
                  {name}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Section C — A/B tier accordion */}
        <div>
          <SectionHeader label="More Tools" />
          {OTHER_TIER.map((tool, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={tool.name}>
                <button
                  onClick={() => handleToggle(i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 0",
                    borderBottom: `1px solid ${rowBorder}`,
                    background: "none",
                    border: "none",
                    borderBottom: `1px solid ${rowBorder}`,
                    cursor: "pointer",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <img
                    src={favicon(tool.url, 32)}
                    width={20}
                    height={20}
                    alt={tool.name}
                    style={{ display: "block", flexShrink: 0 }}
                  />
                  <span style={{
                    flex: 1,
                    fontFamily: "'Noto Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    color: nameColor,
                    textAlign: "left",
                  }}>
                    {tool.name}
                  </span>
                  <span
                    className="material-symbols-rounded"
                    style={{
                      fontSize: 20,
                      color: mutedColor,
                      fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
                      flexShrink: 0,
                    }}
                  >
                    {isOpen ? "expand_more" : "chevron_right"}
                  </span>
                </button>

                {isOpen && (
                  <div style={{
                    padding: "12px 0 16px",
                    borderBottom: `1px solid ${rowBorder}`,
                  }}>
                    <p style={{
                      fontFamily: "'Noto Sans', sans-serif",
                      fontSize: 13,
                      color: mutedColor,
                      lineHeight: 1.6,
                      margin: "0 0 12px",
                    }}>
                      {tool.desc}
                    </p>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        padding: "4px 12px",
                        border: `1px solid ${visitBorder}`,
                        fontFamily: "'Noto Sans', sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: visitColor,
                        textDecoration: "none",
                      }}
                    >
                      Visit {tool.name}
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
