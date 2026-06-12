# GRAVEYARD

The record of consolidated prototype repos and retired surfaces. One section
per entry: what it was, what it taught, what was harvested.

## Product lineage — v1 → v2 → v3

**v1 — Card Stock.** Segmented prototypes, one repo per idea (deck-stack,
pod-check, life-track, gold-fish, after-school-special). Each proved or killed
a single mechanic in isolation. The swipe-to-brew gesture vocabulary survived;
most of the rest is sealed below.

**v2 — MTG DNA.** Unification: the segmented prototypes folded into one app
behind a five-tab shell (Home / Vault / Brew / Pod / Analysis), plus the
market-comparison framing (curated tool tier-lists per tab — ManaBox, EDHREC,
ScryCheck, Moxfield, …) that positioned each surface against the landscape.

**v3 — magicdex.** Pokédex-modeled, swipe-first. The tab shell is retired in
favor of a single root surface: the Box (the "dex") of legends, with the
last-active legend's identity block on top and the brew carousel as a takeover.
Navigation is a one-rung back-ladder rooted on the Box. The v2 market-comparison
tabs (Vault/Pod/Analysis) were either folded into the dex spine or deferred to
the roadmap — see below.

## v2 tab: Vault — STATUS: retired into roadmap

**What it was:** A curated tier-list of external collection/import tools
(ManaBox, GrimDeck, Commander Template, Archidekt) — market comparison, not a
working in-app importer. No deck-import path was ever wired (the brew "Import
Deck" mode stubs to search; `brew-components/ImportSheet.jsx` exists but was
never mounted).

**What it taught:** Collection tracking is a crowded, well-served space; the dex
spine doesn't need to re-implement it. The one place import belongs in v3 is the
add-legend flow.

**What was harvested:** Nothing wired. `ImportSheet.jsx` is left in the tree as
an orphaned, never-mounted donor for an eventual real import (Moxfield/Archidekt
URL) that would attach to the add-legend flow — flagged, not deleted, so a
working path is not silently lost.

## v2 tab: Pod — STATUS: deferred to roadmap

**What it was:** Placeholder for pod power-level balancing (the pod-check
prototype's ScryCheck-score-based balance read) plus a curated tier-list of pod
tools. Never built beyond the link list.

**What it taught:** Pod balance on mobile is still an unserved gap (see
`pod-check` below). It is a future dex feature, not a launch surface.

**What was harvested:** Nothing — the concept carries forward from `pod-check`.

## v2 tab: Analysis — STATUS: deferred to roadmap

**What it was:** Placeholder for deck analysis (power level, curve, synergy)
fronted by a curated tier-list (ScryCheck, EDHREC, Playgroup.gg, …). Link list
only.

**What it taught:** Analysis is a per-deck verb, not a top-level destination —
it belongs hung off a legend's deck in the dex, not on its own tab.

**What was harvested:** Nothing wired; folds into a future per-deck analysis
view in the dex spine.

## deck-stack — STATUS: donor, port in progress

**What it was:** Genesis of the swipe-to-brew concept.

**What it taught:** The carousel + flick-up-mainboard / flick-down-maybeboard
gesture vocabulary. Browsing is horizontal, deciding is vertical.

**What was harvested:** Components ported to `src/brew-components/` per the
Helix Brew integration sequence. Sealed after port verification.

## pod-check — STATUS: sealed

**What it was:** ScryCheck-score-based pod balancing to prevent pub stomps.

**What it taught:** Pod balance on mobile is an unserved gap (EDH Power Level
owns desktop, unusable on phone). This is the Pod tab's first feature: four
commanders in, balance read out, 30 seconds at the table.

Horizon note: nearby-player discovery (Waze/DS-link-in-the-schoolyard energy).
Playgroup.gg's Find a Game map validates demand.

**What was harvested:** Nothing yet — the concept carries forward as the Pod
tab's first feature.

## life-track — STATUS: sealed

**What it was:** Per-device life tracker with live lock-screen updates.

**What it taught:** Lotus/Nexus own this space. The lock-screen live update is
the one novel idea — preserved as a Pod tab horizon item.

**What was harvested:** Nothing — the lock-screen live update idea is the only
survivor, recorded as a Pod tab horizon item.

## gold-fish — STATUS: sealed

**What it was:** Mobile goldfishing/test hands.

**What it taught:** Every competitor treats playtesting as a desktop
afterthought. This is a Brew feature, not a product.

**What was harvested:** Nothing — the concept folds into Brew as a future
feature.

## after-school-special — STATUS: sealed

**What it was:** LGS website redesign for a friend who never got back to me.

**What it taught:** Pre-dates the design system. Closed.

**What was harvested:** Nothing.
