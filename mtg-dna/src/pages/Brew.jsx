import { useTheme } from "../theme/ThemeContext";
import ToolChips from "../components/ToolChips";
import SectionHeader from "../components/SectionHeader";
import TeaserCard from "../components/TeaserCard";
import { BREW_TOOLS } from "../data/tools";

export default function Brew() {
  const { theme } = useTheme();

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
          <SectionHeader label="Deck Builders" />
          <ToolChips tools={BREW_TOOLS} />
        </div>

        <div>
          <SectionHeader label="Deck Stack" />
          <TeaserCard
            accent="#4ade80"
            name="Deck Stack"
            desc="Tinder-style card swiping for Commander brewing. Search, swipe, build. Scryfall made fun."
          />
        </div>
      </div>
    </div>
  );
}
