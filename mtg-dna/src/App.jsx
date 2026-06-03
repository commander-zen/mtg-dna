import { useEffect, useState } from "react";
import { useTheme } from "./theme/ThemeContext";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Vault from "./pages/Vault";
import Brew from "./pages/Brew";
import Table from "./pages/Table";
import Notebook from "./pages/Notebook";

const NAV_HEIGHT = 60;

export default function App() {
  const { theme } = useTheme();
  const [activePage, setActivePage] = useState("home");

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
        overflow: "hidden",
        paddingBottom: NAV_HEIGHT,
      }}>
        {activePage === "home"     && <Home />}
        {activePage === "vault"    && <Vault />}
        {activePage === "brew"     && <Brew />}
        {activePage === "table"    && <Table />}
        {activePage === "notebook" && <Notebook />}
      </div>

      <NavBar activePage={activePage} onNavigate={setActivePage} />
    </div>
  );
}
