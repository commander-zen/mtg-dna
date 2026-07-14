import { createContext, useContext, useEffect } from "react";
import { tokens } from "./tokens";

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@400;700&family=Noto+Sans:wght@400;500&family=Noto+Sans+Mono:wght@400&display=swap";

const ThemeContext = createContext(null);

// Dark-only (UAT batch 2, item 2): the light palette and the toggle were
// removed. The provider now just injects the fonts and hands down the one
// palette — `mode` and `toggleTheme` are gone.
export function ThemeProvider({ children }) {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONTS_HREF}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONTS_HREF;
    document.head.appendChild(link);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: tokens }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Co-located with the provider for ergonomics; the fast-refresh rule wants
// hooks in a separate module, but splitting this one isn't worth the churn.
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext);
}
