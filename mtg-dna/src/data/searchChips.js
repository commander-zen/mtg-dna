// otag values below are verified against the live Scryfall Tagger — never guess/add without manual verification.
export const SEARCH_CHIPS = [
  {
    id: "tokens",
    label: "Tokens",
    query: "(otag:repeatable-creature-tokens or otag:synergy-token or otag:repeatable-token-generator)",
  },
  {
    id: "plus1_counters",
    label: "+1/+1 Counters",
    query: "(otag:repeatable-pp-counters or otag:gives-pp-counters)",
  },
  {
    id: "artifacts",
    label: "Artifacts",
    query: "(otag:sacrifice-outlet-artifact or otag:synergy-artifact or otag:karnstructs or otag:repeatable-artifact-tokens or otag:synergy-artifact-creature)",
  },
  {
    id: "lifegain",
    label: "Lifegain",
    query: "(otag:lifegain-to-damage or otag:lifegain-matters or otag:lifegain or otag:repeatable-lifegain)",
  },
  {
    id: "aggro",
    label: "Aggro",
    query: "(otag:attack-trigger or otag:attacking-matters-self or otag:attacking-matters)",
  },
];
