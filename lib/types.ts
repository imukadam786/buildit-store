// Domain types for the storefront. Kept deliberately simple — these mirror the
// shape the backend/admin will eventually serve, so pages can be wired to real
// data later with minimal change.

export type Category = {
  slug: string;
  name: string;
  /** Short blurb shown on the category landing tiles. */
  blurb: string;
  /** Lucide-style icon key we render in the UI (see CategoryIcon). */
  icon: string;
};

export type ProductVariant = {
  id: string;
  /** e.g. "20kg", "5L", "Red" — the choosable option label. */
  label: string;
  /** Variant-specific price in cents (VAT inclusive). */
  priceCents: number;
  /** Was-price in cents for showing a strikethrough; null when not on special. */
  wasCents: number | null;
  /** Units in stock at the customer's store. 0 = out of stock. */
  stock: number;
  sku: string;
};

export type Review = {
  author: string;
  rating: number; // 1..5
  title: string;
  body: string;
  date: string; // ISO
};

export type Product = {
  slug: string;
  name: string;
  brand: string;
  categorySlug: string;
  /** Short marketing line. */
  summary: string;
  /** Longer description, plain paragraphs. */
  description: string[];
  /** What the option picker is choosing, e.g. "Size" or "Colour". */
  variantLabel: string;
  variants: ProductVariant[];
  /** Key spec rows shown in the specifications table. */
  specs: { label: string; value: string }[];
  /** Downloadable docs (datasheets / manuals). href is a placeholder for now. */
  documents: { label: string; href: string }[];
  /** Bulk/heavy goods are quote-first rather than buy-now. */
  bulk: boolean;
  reviews: Review[];
  /** Placeholder swatch colour until real product imagery is wired. */
  swatch: string;
};
