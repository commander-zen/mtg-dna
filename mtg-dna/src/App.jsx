import { useEffect, useState } from "react";
import { useTheme } from "./theme/ThemeContext";
import NavBar from "./components/NavBar";

const PAGES = ["home", "vault", "brew", "table", "notebook"];

const NAV_HEIGHT = 60;

export default function App() {
  const { theme, mode } = useTheme();
  const [activePage, setActivePage] = useState("home");

  const textColor = mode === "light" ? theme.ink : theme.white;

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.background = theme.base;
    document.body.style.fontFamily = "'Noto Sans', sans-serif";
  }, [theme.base]);

  return (
    <div style={{
      height: "100dvh",
      width: "100%",
      background: theme.base,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      <div style={{
        flex: 1,
        overflowY: "auto",
        paddingBottom: NAV_HEIGHT,
        WebkitOverflowScrolling: "touch",
      }}>
        {PAGES.map((page) => (
          <div
            key={page}
            style={{
              display: activePage === page ? "flex" : "none",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <span style={{
              fontFamily: "'Zilla Slab', serif",
              fontSize: 28,
              color: textColor,
              textTransform: "capitalize",
            }}>
              {page}
            </span>
          </div>
        ))}
      </div>

      <NavBar activePage={activePage} onNavigate={setActivePage} />
    </div>
  );
}
