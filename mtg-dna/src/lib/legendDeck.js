import { supabase } from "./supabase.js";

// A deck's total = sum of deck_cards quantities + 1 for the commander
// (the commander itself is never written to deck_cards).
export function deckTotal(deck) {
  const cardSum = (deck.deck_cards ?? []).reduce((sum, dc) => sum + (dc.quantity ?? 0), 0);
  return cardSum + 1;
}

// The ONE definition of "this legend's deck" — every surface (the deck row,
// the brew button, Brew.jsx's session-init) must call this instead of
// inventing its own pick. One-deck-per-legend is the intended invariant
// (enforced at the schema level separately); this only has a decision to
// make when that invariant is violated — pre-constraint data, or a future
// bug forking a legend again. In that defensive case, picks the fullest
// deck deterministically, so two surfaces reading the same legend can never
// disagree about which row is "the" deck.
export function resolveLegendDeck(decks) {
  return (decks ?? []).reduce(
    (best, d) => (best === null || deckTotal(d) > deckTotal(best) ? d : best),
    null
  );
}

// Live lookup behind the resolver — the one query every surface shares
// instead of each re-deriving "this legend's deck" from whatever data it
// happens to already have in hand (a stale prop, a handed-in deckId, etc).
export async function fetchLegendDeck(legendId) {
  const { data, error } = await supabase
    .from("legends")
    .select("decks(id, status, build_name, deck_cards(quantity))")
    .eq("id", legendId)
    .single();
  if (error) return null;
  return resolveLegendDeck(data?.decks ?? []);
}
