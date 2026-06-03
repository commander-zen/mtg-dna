import { useTheme } from "../theme/ThemeContext";
import ToolChips from "../components/ToolChips";
import SectionHeader from "../components/SectionHeader";
import { ANALYZE_TOOLS } from "../data/tools";

const GAP_ACCENT = "#ef4444";

export default function Notebook() {
  const { theme, mode } = useTheme();

  const bodyColor = mode === "light" ? theme.ink : theme.white;

  return (
    <div style={{
      height: "100%",
      overflowY: "auto",
      overflowX: "hidden",
      background: theme.base,
      WebkitOverflowScrolling: "touch",
    }}>
      <div style={{ padding: "28px 20px 40px" }}>
        <div style={{ marginBottom: 28 }}>
          <SectionHeader label="Analysis Tools" />
          <ToolChips tools={ANALYZE_TOOLS} />
        </div>

        <div>
          <SectionHeader label="The Gap" />
          <div style={{
            padding: "20px",
            borderRadius: 0,
            background: "#ef444408",
            border: "1px solid #ef444440",
          }}>
            <div style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: GAP_ACCENT,
              opacity: 0.8,
              marginBottom: 10,
            }}>
              Coming to MTG DNA
            </div>
            <p style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontSize: 14,
              color: bodyColor,
              lineHeight: 1.7,
              margin: "0 0 16px",
            }}>
              ScryCheck tells you what your deck is. Playgroup.gg tells you how it performs. Nothing connects them. The feedback loop between construction and table results is unbuilt. That's what MTG DNA is building.
            </p>
            <div style={{
              display: "inline-flex",
              padding: "4px 12px",
              borderRadius: 0,
              background: "#ef444414",
              border: "1px solid #ef444440",
              fontFamily: "'Noto Sans', sans-serif",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: GAP_ACCENT,
            }}>
              Coming soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
