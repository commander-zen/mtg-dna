# magıcdex UX Audit & Standing Constraints
### NN/g mobile principles as durable rules, not a one-time pass
*Source: Nielsen Norman Group Mobile UX guidelines. Re-checked each UX session.*

This file is read before any layout, navigation, or interaction work. It
is not a checklist to complete once. It is the set of mobile-UX constraints
every screen must hold, with the current audit status of each.

---

## Standing constraints (never violate)

**Touch targets ≥ 44px.** Every interactive element — buttons, chevrons,
glyphs, toggles, list rows, slot tiles — meets a ~44px (≈1cm) minimum hit
area. Visual size may be smaller if the tappable padding reaches 44px.

**No login wall, no forced onboarding.** The app opens straight into use.
Never gate the dex behind auth or a walkthrough. This is a competitive
advantage; protect it.

**Defer secondary content.** Show only what the moment needs. Detail and
options are reachable on request, not crowding the primary surface.

**Two-channel indicators.** Status flags use color AND a second signal
(icon or text), never color alone (e.g. Game Changer = amber glow + text
tag).

**Overlays have one obvious dismiss.** Every sheet/overlay closes via a
consistent, visible affordance (the back chevron). Backdrop-tap behavior
is predictable, never a trap.

**Input fields follow the mobile checklist.** Correct keyboard type, a
visible clear/cancel, no surprise auto-submit, label/placeholder present.

**Microsession-safe.** Work persists the instant it happens (flick-is-a-
write). Putting the phone down mid-task never loses state.

---

## Known risks under watch

**Swipe ambiguity (HIGH — core mechanic).** Horizontal carousel browse
competes with iOS Safari's edge-swipe back/forward. Risk: an edge-
originating horizontal swipe triggers Safari navigation instead of the
carousel. Mitigation: keep swipe-active zones inset from screen edges;
test on-device deliberately. Re-verify after any swipe change.

**Image-grid navigation (ACCEPTED EXCEPTION).** NN/g prefers text lists
at high IA levels; the Box is an image grid. Deliberate exception:
recognition-by-art is the Pokédex thesis, and every slot carries an
always-visible name label, making it a hybrid, not a pure image grid.
The name label is what keeps this compliant — never remove it.

---

## Audit status (update each UX session)

- Touch targets: SWEPT (2026-06-13) — padded to ≥44px: swipe bottom
  back/search/clear controls, box pager chevrons (was 36×28), settings
  gear (was 40×40), card flip button, swipe-strip UNDO + SORT toggle,
  sort-menu rows, settings segmented-sort buttons, add-legend input/close.
  Code-verified, not yet device-measured.
- Reachability: DONE (2026-06-13) — swipe back + search live in the
  bottom thumb-zone (lock-screen pattern: back-left, search-right,
  hint between); top header back chevron removed (legend anchor kept).
- Swipe ambiguity: UNVERIFIED — needs on-device test.
- Overlay dismissal: PASS (2026-06-13) — AddLegendSheet + SettingsSheet
  each have a visible close (×) plus predictable backdrop-tap close; the
  expanded swipe search cancels via its right control (returns the hint).
- Input fields: PASS (2026-06-13) — add-legend search and the expanded
  swipe search are type="search", autocapitalize/autocorrect off,
  submit on Enter (no surprise auto-submit), visible clear/cancel,
  placeholder present; swipe search pre-fills the active query.
- Login wall / onboarding: PASS.
- Microsession persistence: PASS.

---

*Hold the constraints. Watch the risks. Update the status. The audit is
never finished, only current.*
