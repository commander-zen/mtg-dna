# SESSION_STATE — MTG DNA

## Cold Start Prompt
Priority: Visual iteration pass on the Brew tab — the ported SearchScreen renders inside Brew but layout/branding are still Deck Stack's (100dvh sizing inside the padded page, "DECK STACK" title text, swipe-hint copy, deck-stack bug-report links). Mock up in a Claude artifact before burning Vercel deploys. After that: wire `onSearch` → SwipeScreen/PileScreen pile flow (currently a console.log stub in `src/pages/Brew.jsx`).

## Done
- ✅ 2026-06-10 — Brew port, prompts 1–8:
  - ✅ P1–4: `scryfall.js`, `wrec.js` → `src/lib/`; `useDoubleTap.js`, `useGameChangers.js` → `src/hooks/`; `brewPrompt.js`, `validateBrewQuery.js` → `src/services/` (byte-exact copies)
  - ✅ P5: 9 components → `src/brew-components/`, 3 screens → `src/brew-components/screens/` (byte-exact copies)
  - ✅ P6: font swaps (Space Grotesk/DM Sans → Noto Sans, IBM Plex Mono → Noto Sans Mono), import-path fixes for the screens subfolder, `NAV_HEIGHT` inlined (60), Deck Stack CSS vars bridged to MTG DNA theme tokens via `brewThemeVars()` in `src/pages/Brew.jsx`
  - ✅ P7: Brew tab renders SearchScreen below PageHeader; ToolChips removed from Brew (still used by Notebook/Table/Vault); supabase client passed as prop
  - ✅ P8: localStorage keys renamed (`ds_search_history`→`helixbrew_search_history`, `ds_swipe_hint_shown`→`helixbrew_swipe_hint_shown`, `cardstock_settings`→`helixbrew_settings`); zero deck-stack auth/db/supabase imports; `vite build` passes; all 12 brew files parse clean

## Known Issues
- **Source snapshot**: deck-stack HEAD deleted SwipeScreen/SearchScreen/PileScreen in commit `33f167f` ("demolish old swipe/pile/search architecture", 2026-05-20). All files were copied from `33f167f^`, the last commit where screens and components coexisted. This predates deck-stack's May 21–23 redesign commits (Noto Sans migration, Y2K-strip) — fonts were handled in P6 anyway, but the copies are NOT deck-stack HEAD.
- **P6 deviation**: the prompt's find-and-replace spec (Bebas Neue/DM Sans literals, `--bg`/`--panel` var set, auth/db import strips) didn't match the snapshot — files had no auth/db imports, fonts were mostly `var(--font-system)`, and styling uses deck-stack's Win98 token system (`--color-*`, `--bevel-*`, `--space-*`) in module-level style objects that can't call useTheme(). Instead of ~300 inline rewrites, all deck-stack CSS vars are defined from MTG DNA theme tokens in `brewThemeVars()` (Brew.jsx). Components keep `var(--x)` references and re-theme automatically, including light/dark.
- **P7 deviation**: SearchScreen's props are `{ onSearch, loading, error, commanderCard, onCommanderCardChange }` — it doesn't accept a Supabase client. The client is passed as a `supabase` prop anyway (ignored for now). `onSearch` is a console.log stub; the search→pile flow isn't wired.
- **Extra deps copied** (not in the prompt list, required by imports): `src/lib/settings.js`, `src/constants/wrec.js`. `NAV_HEIGHT` (60) inlined where BottomNav was imported — verify against MTG DNA's actual NavBar height in the visual pass.
- SearchScreen still shows "DECK STACK" branding, deck-stack's Bluesky/GitHub footer links, and `error` prop is never rendered in its JSX.
- `services/brewPrompt.js` + `validateBrewQuery.js` and most brew components (SwipeScreen, PileScreen, sheets, modals) are copied but not yet reachable from the app — Vite tree-shakes them until wired.
