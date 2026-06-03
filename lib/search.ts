import { PRODUCTS } from "./data";
import type { Product } from "./types";

// Hardware shoppers search by exact name, brand or code — and by everyday words
// that differ from the catalogue term. A small synonym map bridges that gap.
const SYNONYMS: Record<string, string[]> = {
  geyser: ["water heater", "kwikot"],
  "water heater": ["geyser"],
  grinder: ["angle grinder"],
  braai: ["bbq", "weber", "kettle"],
  heater: ["radiant", "quartz"],
  tap: ["mixer", "cobra"],
  cement: ["ppc", "surebuild"],
  drill: ["impact"],
};

function expand(query: string): string[] {
  const q = query.toLowerCase().trim();
  const terms = new Set<string>([q]);
  for (const [key, alts] of Object.entries(SYNONYMS)) {
    if (q.includes(key)) alts.forEach((a) => terms.add(a));
  }
  // Also add individual words so multi-word queries still match.
  q.split(/\s+/).filter(Boolean).forEach((w) => terms.add(w));
  return [...terms];
}

function haystack(p: Product): string {
  return [
    p.name,
    p.brand,
    p.summary,
    p.categorySlug,
    ...p.variants.map((v) => v.sku),
  ]
    .join(" ")
    .toLowerCase();
}

/** Rank products by how well they match the query. */
export function searchProducts(query: string): Product[] {
  if (!query.trim()) return [];
  const terms = expand(query);
  const scored = PRODUCTS.map((p) => {
    const hay = haystack(p);
    let score = 0;
    for (const t of terms) {
      if (!t) continue;
      if (hay.includes(t)) score += 2;
      if (p.name.toLowerCase().includes(t)) score += 3; // name matches weigh more
    }
    return { p, score };
  }).filter((x) => x.score > 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.map((x) => x.p);
}
