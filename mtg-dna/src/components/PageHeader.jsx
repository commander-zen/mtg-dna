import { useTheme } from "../theme/ThemeContext";

export default function PageHeader({ issue, title, subtitle }) {
  const { theme, mode } = useTheme();

  const borderColor = mode === "light" ? theme.ink    : theme.amber;
  const titleColor  = mode === "light" ? theme.ink    : theme.white;
  const mutedColor  = mode === "light" ? `${theme.ink}80` : `${theme.white}66`;

  return (
    <div style={{
      width: "100%",
      borderBottom: `2px solid ${borderColor}`,
      marginBottom: 28,
      paddingBottom: 12,
    }}>
      {issue && (
        <div style={{
          fontFamily: "'Noto Sans Mono', monospace",
          fontSize: 10,
          fontWeight: 400,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: mutedColor,
          marginBottom: 4,
        }}>
          {issue}
        </div>
      )}
      <div style={{
        fontFamily: "'Zilla Slab', serif",
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: "-0.01em",
        lineHeight: 1.1,
        color: titleColor,
      }}>
        {title}
      </div>
      {subtitle && (
        <div style={{
          fontFamily: "'Noto Sans', sans-serif",
          fontSize: 12,
          color: mutedColor,
          marginTop: 4,
        }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}
