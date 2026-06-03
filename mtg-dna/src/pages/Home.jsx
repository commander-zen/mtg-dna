import { useTheme } from "../theme/ThemeContext";

const HOME_SECTIONS = [
  {
    label: "Zen.",
    body: "I'm a guy with a philosophy degree and the demeanor of Mister Rodgers raised on Run the Jewels. I love schleppin shit together and promise you this will always be free & available & the best I can make it.",
  },
  {
    label: "The problem.",
    body: "Dope EDH tools exist, but none of them \"talk\" to each other.",
  },
  {
    label: "What that means.",
    body: "You make the brutal decision to swap the hot new tech for a trusted card in your 99 and the result is... unsure. When you cut a card and your win rate moves, you need both events in sequence to learn anything.",
  },
  {
    label: "Mobile first.",
    body: "S tier tools for the EDH player were built with a monitor and keyboard in mind. MTG DNA is here for the late night gremlin scrolling cards in bed (before their phone inevitably falls on their face.)",
  },
  {
    label: "How this was built.",
    body: "I consider myself an illiterate technologist, in the sense that despite knowing almost every phase of the SDLC, my coding expertise is limited to a python \"Hello World\" statement or a rudimentary understanding of an elif statement. Claude Code has enabled me to realize projects that before were just concepts. I believe in ethical LLM usage, with a human in the loop always. If you wish to confirm or correct my understanding, please feel free to reach out. I always love a good yap!",
  },
];

export default function Home() {
  const { theme, mode, toggleTheme } = useTheme();
  const labelColor  = mode === "light" ? theme.ink        : theme.white;
  const mutedColor  = mode === "light" ? `${theme.ink}b3` : `${theme.white}99`;
  const borderColor = mode === "light" ? theme.border      : theme.muted;

  return (
    <div style={{
      height: "100%",
      overflowY: "auto",
      overflowX: "hidden",
      background: theme.base,
      WebkitOverflowScrolling: "touch",
    }}>
      <div style={{
        padding: "24px 28px 40px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}>
        {HOME_SECTIONS.map((section, i) => (
          <div key={i} style={{ marginBottom: i < HOME_SECTIONS.length - 1 ? 32 : 0 }}>
            <div style={{
              fontFamily: "'Zilla Slab', serif",
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              color: labelColor,
            }}>
              {section.label}
            </div>
            <div style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontSize: 14,
              fontWeight: 400,
              lineHeight: 1.7,
              marginTop: 6,
              color: mutedColor,
            }}>
              {section.body}
            </div>
          </div>
        ))}

        <div style={{
          marginTop: 40,
          paddingTop: 20,
          borderTop: `1px solid ${borderColor}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <a
            href="https://bsky.app/profile/commanderzen.bsky.social"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontSize: 13,
              color: mutedColor,
              textDecoration: "none",
              letterSpacing: "0.01em",
            }}
          >
            @commanderzen.bsky.social
          </a>
          <button
            onClick={toggleTheme}
            style={{
              background: "none",
              border: "none",
              borderRadius: 0,
              padding: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <span
              className="material-symbols-rounded"
              style={{
                fontSize: 18,
                color: mutedColor,
                fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
              }}
            >
              {mode === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
