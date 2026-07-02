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

// Move ALL copies of a card to the other board, preserving its WREC tags.
// Implemented as a section UPDATE on the existing deck_cards row — tags
// reference the row id, so they ride along. Never delete+reinsert, which
// would cascade the tags away (006's on-delete-cascade cuts both ways).
// If the target board already holds a row for the same name, merge instead:
// union the source row's tags onto the target, sum quantities, then drop
// the source row.
export async function moveDeckCard(deckId, cardName, from, to) {
  const { data: src, error: srcError } = await supabase
    .from("deck_cards")
    .select("id, quantity")
    .eq("deck_id", deckId).eq("card_name", cardName).eq("section", from)
    .maybeSingle();
  if (srcError) throw srcError;
  if (!src) return;

  const { data: tgt, error: tgtError } = await supabase
    .from("deck_cards")
    .select("id, quantity")
    .eq("deck_id", deckId).eq("card_name", cardName).eq("section", to)
    .maybeSingle();
  if (tgtError) throw tgtError;

  if (!tgt) {
    const { error } = await supabase
      .from("deck_cards")
      .update({ section: to })
      .eq("id", src.id);
    if (error) throw error;
    return;
  }

  const { data: srcTags, error: tagReadError } = await supabase
    .from("deck_card_tags")
    .select("tag")
    .eq("deck_card_id", src.id);
  if (tagReadError) throw tagReadError;
  if (srcTags?.length) {
    const rows = srcTags.map(t => ({ deck_card_id: tgt.id, tag: t.tag }));
    const { error } = await supabase
      .from("deck_card_tags")
      .upsert(rows, { onConflict: "deck_card_id,tag" });
    if (error) throw error;
  }

  const { error: updError } = await supabase
    .from("deck_cards")
    .update({ quantity: tgt.quantity + src.quantity })
    .eq("id", tgt.id);
  if (updError) throw updError;
  const { error: delError } = await supabase
    .from("deck_cards")
    .delete()
    .eq("id", src.id);
  if (delError) throw delError;
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
