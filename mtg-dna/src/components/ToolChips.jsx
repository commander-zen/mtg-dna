import { useTheme } from "../theme/ThemeContext";

const TIERS = ["S", "A", "B"];

const TIER_COLORS = {
  light: {
    S: { badgeBg: "#c8960c", badgeText: "#faf7f2" },
    A: { badgeBg: "#1a1410", badgeText: "#faf7f2" },
    B: { badgeBg: "#c0392b", badgeText: "#faf7f2" },
  },
  dark: {
    S: { badgeBg: "#e8a020", badgeText: "#0a0e1a" },
    A: { badgeBg: "#7ab89a", badgeText: "#0a0e1a" },
    B: { badgeBg: "#3a4a5a", badgeText: "#e8f0ee" },
  },
};

export default function ToolChips({ tools }) {
  const { theme, mode } = useTheme();

  const cardBg     = mode === "light" ? theme.paper   : theme.surface;
  const cardBorder = mode === "light" ? theme.border   : theme.muted;
  const nameColor  = mode === "light" ? theme.ink      : theme.white;
  const descColor  = mode === "light" ? `${theme.ink}99` : `${theme.white}80`;
  const tierLabel  = mode === "light" ? `${theme.ink}99` : `${theme.white}80`;

  const tierColors = TIER_COLORS[mode];

  const grouped = TIERS.reduce((acc, t) => {
    acc[t] = tools.filter(tool => tool.tier === t);
    return acc;
  }, {});

  return (
    <>
      {TIERS.filter(t => grouped[t].length > 0).map(tier => {
        const tc = tierColors[tier];
        return (
          <div key={tier} style={{ marginBottom: 20 }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 20,
                height: 20,
                background: tc.badgeBg,
                color: tc.badgeText,
                fontSize: 11,
                fontWeight: 800,
                fontFamily: "'Noto Sans', sans-serif",
              }}>
                {tier}
              </span>
              <span style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: tierLabel,
              }}>
                Tier
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {grouped[tier].map(tool => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 16px",
                    background: cardBg,
                    border: `1px solid ${cardBorder}`,
                    borderRadius: 0,
                    textDecoration: "none",
                    cursor: "pointer",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <span style={{
                    flexShrink: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 28,
                    height: 28,
                    background: tc.badgeBg,
                    color: tc.badgeText,
                    fontSize: 12,
                    fontWeight: 800,
                    fontFamily: "'Noto Sans', sans-serif",
                  }}>
                    {tier}
                  </span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: "'Noto Sans', sans-serif",
                      fontSize: 14,
                      fontWeight: 500,
                      color: nameColor,
                      lineHeight: 1.2,
                      marginBottom: 3,
                    }}>
                      {tool.name}
                    </div>
                    <div style={{
                      fontFamily: "'Noto Sans', sans-serif",
                      fontSize: 12,
                      fontWeight: 400,
                      color: descColor,
                      lineHeight: 1.5,
                    }}>
                      {tool.desc}
                    </div>
                  </div>

                  <span
                    className="material-symbols-rounded"
                    style={{
                      flexShrink: 0,
                      fontSize: 18,
                      fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
                      color: descColor,
                    }}
                  >
                    open_in_new
                  </span>
                </a>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
