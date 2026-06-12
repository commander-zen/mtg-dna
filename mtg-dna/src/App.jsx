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
  const [selectedLegend, setSelectedLegend] = useState(null);
  const [brewSession, setBrewSession] = useState(null);
  const [brewResetSignal, setBrewResetSignal] = useState(0);

  // Tab icons always return their tab to its root view, even when already
  // on that tab — tapping Home from LegendIdentity goes back to the Box,
  // tapping Brew from inside a session goes back to the brew landing.
  function handleNavigate(id) {
    setActivePage(id);
    if (id === "home") setSelectedLegend(null);
    if (id === "brew") setBrewResetSignal(s => s + 1);
  }

  function handleLaunchBrew(legend, inProgressDeck) {
    setBrewSession({ legend, deckId: inProgressDeck?.id ?? null });
    setActivePage("brew");
  }

  function handleBrewSessionDone() {
    setBrewSession(null);
    setActivePage("home");
  }

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
        {activePage === "home"     && (
          <Home
            selectedLegend={selectedLegend}
            onSelectLegend={setSelectedLegend}
            onLaunchBrew={handleLaunchBrew}
          />
        )}
        {activePage === "vault"    && <Vault />}
        {activePage === "brew"     && (
          <Brew session={brewSession} onSessionDone={handleBrewSessionDone} resetSignal={brewResetSignal} />
        )}
        {activePage === "table"    && <Table />}
        {activePage === "notebook" && <Notebook />}
      </div>

      <NavBar activePage={activePage} onNavigate={handleNavigate} />
    </div>
  );
}
