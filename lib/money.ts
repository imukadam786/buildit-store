// Money helpers. We store prices in integer cents to avoid floating-point drift,
// and always display VAT-inclusive Rand (a South African legal requirement for
// consumer pricing).

export const VAT_RATE = 0.15;

/** Format integer cents as e.g. "R 1 349,90" (SA convention: space thousands, comma decimal). */
export function formatRand(cents: number): string {
  const rand = cents / 100;
  const formatted = new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(rand);
  // Intl gives "R 1 349,90" on most runtimes; normalise the symbol spacing.
  return formatted.replace(/^R\s?/, "R ");
}

/** The VAT portion contained within a VAT-inclusive cents amount. */
export function vatPortion(inclusiveCents: number): number {
  return Math.round(inclusiveCents - inclusiveCents / (1 + VAT_RATE));
}

/** Percentage saved when there is a was-price, else null. */
export function discountPct(priceCents: number, wasCents: number | null): number | null {
  if (!wasCents || wasCents <= priceCents) return null;
  return Math.round(((wasCents - priceCents) / wasCents) * 100);
}
