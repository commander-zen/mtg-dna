import { useTheme } from "../theme/ThemeContext";
import ToolChips from "../components/ToolChips";
import { TOOLS } from "../data/tools";

export default function Vault() {
  const { theme, mode } = useTheme();

  const subheadColor = mode === "light"
    ? `${theme.ink}99`
    : `${theme.white}80`;

  return (
    <div style={{
      height: "100%",
      overflowY: "auto",
      overflowX: "hidden",
      background: theme.base,
      WebkitOverflowScrolling: "touch",
    }}>
      <div style={{ padding: "28px 20px 40px" }}>
        <p style={{
          fontFamily: "'Noto Sans', sans-serif",
          fontSize: 13,
          fontWeight: 400,
          letterSpacing: "0.01em",
          lineHeight: 1.5,
          color: subheadColor,
          margin: "0 0 28px",
        }}>
          DNA doesn't store your cards. These do.
        </p>
        <ToolChips tools={TOOLS} />
      </div>
    </div>
  );
}
