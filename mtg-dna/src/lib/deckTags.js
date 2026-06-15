import { supabase } from "./supabase.js";

// The fixed five-value WREC tag set (mirrors the wrec_tag enum in
// migration 006). A card in a deck can carry zero or more of these.
export const WREC_TAGS = [
  "ramp",
  "card-advantage",
  "disruption",
  "mass-disruption",
  "plan",
];

// A tag is a write — flick-is-a-write extends to tagging, no save step.
// Idempotent via the (deck_card_id, tag) unique constraint.
export async function tagCard(deckCardId, tag) {
  const { error } = await supabase
    .from("deck_card_tags")
    .upsert({ deck_card_id: deckCardId, tag }, { onConflict: "deck_card_id,tag" });
  if (error) throw error;
}

export async function untagCard(deckCardId, tag) {
  const { error } = await supabase
    .from("deck_card_tags")
    .delete()
    .eq("deck_card_id", deckCardId)
    .eq("tag", tag);
  if (error) throw error;
}

// A deck's cards WITH their tag arrays: each row is a deck_cards row plus
// `tags: string[]` (WREC tags, possibly empty). The nested select rides the
// deck_card_tags → deck_cards foreign key.
export async function fetchDeckCardsWithTags(deckId) {
  const { data, error } = await supabase
    .from("deck_cards")
    .select("id, card_name, quantity, section, deck_card_tags(tag)")
    .eq("deck_id", deckId);
  if (error) throw error;
  return (data ?? []).map(row => ({
    id: row.id,
    card_name: row.card_name,
    quantity: row.quantity,
    section: row.section,
    tags: (row.deck_card_tags ?? []).map(t => t.tag),
  }));
}
