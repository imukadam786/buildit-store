"use client";

// Shared, browser-persisted catalogue. It is the single source of truth for the
// admin (full product CRUD, per-store stock, special scheduling) AND the live
// data the storefront reads (prices, stock, homepage headline). Seeded from the
// static sample data; "Reset demo data" clears it. Nothing is saved server-side.

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PRODUCTS, STORES } from "@/lib/data";

export type LiveVariant = {
  id: string;
  label: string;
  sku: string;
  priceCents: number;
  wasCents: number | null;
  stockByStore: Record<string, number>;
};

export type Special = { start: string; end: string }; // "" = open-ended

export type LiveProduct = {
  slug: string;
  name: string;
  brand: string;
  categorySlug: string;
  summary: string;
  description: string[];
  variantLabel: string;
  variants: LiveVariant[];
  specs: { label: string; value: string }[];
  documents: { label: string; href: string }[];
  bulk: boolean;
  swatch: string;
  special: Special | null;
};

type Hero = { title: string; subtitle: string };

const KEY = "bi.catalogue.v2";
const DEFAULT_HERO: Hero = {
  title: "Everything to build, fix and improve.",
  subtitle: "Shop tools, building materials, paint and plumbing. Collect at your store or have it delivered to site.",
};

function seedProducts(): LiveProduct[] {
  return PRODUCTS.map((p) => ({
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    categorySlug: p.categorySlug,
    summary: p.summary,
    description: p.description,
    variantLabel: p.variantLabel,
    specs: p.specs,
    documents: p.documents,
    bulk: p.bulk,
    swatch: p.swatch,
    special: null,
    variants: p.variants.map((v) => ({
      id: v.id,
      label: v.label,
      sku: v.sku,
      priceCents: v.priceCents,
      wasCents: v.wasCents,
      stockByStore: { strand: v.stock, stellenbosch: Math.floor(v.stock / 2) },
    })),
  }));
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}
function specialActive(s: Special | null): boolean {
  if (!s || (!s.start && !s.end)) return true;
  const t = today();
  if (s.start && t < s.start) return false;
  if (s.end && t > s.end) return false;
  return true;
}

type CatalogueCtx = {
  products: LiveProduct[];
  // storefront reads
  priceOf: (slug: string, vid: string) => { priceCents: number; wasCents: number | null };
  stockOf: (slug: string, vid: string, storeId: string) => number;
  minPriceOf: (slug: string) => { priceCents: number; wasCents: number | null };
  inStockAt: (slug: string, storeId: string) => boolean;
  // admin writes
  setPrice: (slug: string, vid: string, priceCents: number, wasCents: number | null) => void;
  setStock: (slug: string, vid: string, storeId: string, n: number) => void;
  setSchedule: (slug: string, special: Special | null) => void;
  addProduct: (p: Partial<LiveProduct>) => void;
  updateProduct: (slug: string, patch: Partial<LiveProduct>) => void;
  deleteProduct: (slug: string) => void;
  addVariant: (slug: string) => void;
  removeVariant: (slug: string, vid: string) => void;
  importProducts: (rows: LiveProduct[]) => number;
  hero: Hero;
  setHero: (h: Hero) => void;
  reset: () => void;
};

const Ctx = createContext<CatalogueCtx | null>(null);
const SEED_BY_SLUG = new Map(PRODUCTS.map((p) => [p.slug, p]));

export function CatalogueProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<LiveProduct[]>(seedProducts);
  const [hero, setHeroState] = useState<Hero>(DEFAULT_HERO);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.products) setProducts(parsed.products);
        if (parsed.hero) setHeroState(parsed.hero);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify({ products, hero }));
  }, [products, hero, hydrated]);

  const value = useMemo<CatalogueCtx>(() => {
    const find = (slug: string) => products.find((p) => p.slug === slug);
    const findVar = (slug: string, vid: string) => find(slug)?.variants.find((v) => v.id === vid);

    const priceOf = (slug: string, vid: string) => {
      const p = find(slug);
      const v = findVar(slug, vid);
      if (!v) {
        const sv = SEED_BY_SLUG.get(slug)?.variants.find((x) => x.id === vid);
        return { priceCents: sv?.priceCents ?? 0, wasCents: sv?.wasCents ?? null };
      }
      return { priceCents: v.priceCents, wasCents: specialActive(p?.special ?? null) ? v.wasCents : null };
    };
    const stockOf = (slug: string, vid: string, storeId: string) => {
      const v = findVar(slug, vid);
      if (!v) {
        const sv = SEED_BY_SLUG.get(slug)?.variants.find((x) => x.id === vid);
        return storeId === "stellenbosch" ? Math.floor((sv?.stock ?? 0) / 2) : sv?.stock ?? 0;
      }
      return v.stockByStore[storeId] ?? 0;
    };
    const minPriceOf = (slug: string) => {
      const p = find(slug);
      if (!p || p.variants.length === 0) return priceOf(slug, "");
      let best = priceOf(slug, p.variants[0].id);
      for (const v of p.variants) {
        const cur = priceOf(slug, v.id);
        if (cur.priceCents < best.priceCents) best = cur;
      }
      return best;
    };
    const inStockAt = (slug: string, storeId: string) => {
      const p = find(slug);
      return !!p && p.variants.some((v) => (v.stockByStore[storeId] ?? 0) > 0);
    };

    const mut = (slug: string, fn: (p: LiveProduct) => LiveProduct) =>
      setProducts((prev) => prev.map((p) => (p.slug === slug ? fn(p) : p)));

    const setPrice = (slug: string, vid: string, priceCents: number, wasCents: number | null) =>
      mut(slug, (p) => ({ ...p, variants: p.variants.map((v) => (v.id === vid ? { ...v, priceCents, wasCents } : v)) }));
    const setStock = (slug: string, vid: string, storeId: string, n: number) =>
      mut(slug, (p) => ({ ...p, variants: p.variants.map((v) => (v.id === vid ? { ...v, stockByStore: { ...v.stockByStore, [storeId]: Math.max(0, n) } } : v)) }));
    const setSchedule = (slug: string, special: Special | null) => mut(slug, (p) => ({ ...p, special }));
    const updateProduct = (slug: string, patch: Partial<LiveProduct>) => mut(slug, (p) => ({ ...p, ...patch }));
    const deleteProduct = (slug: string) => setProducts((prev) => prev.filter((p) => p.slug !== slug));
    const addVariant = (slug: string) =>
      mut(slug, (p) => ({
        ...p,
        variants: [...p.variants, { id: `v${p.variants.length + 1}-${Date.now().toString(36)}`, label: "New option", sku: "NEW-SKU", priceCents: 0, wasCents: null, stockByStore: Object.fromEntries(STORES.map((s) => [s.id, 0])) }],
      }));
    const removeVariant = (slug: string, vid: string) =>
      mut(slug, (p) => ({ ...p, variants: p.variants.filter((v) => v.id !== vid) }));

    const addProduct = (p: Partial<LiveProduct>) => {
      const slug = (p.slug || p.name || "new-product").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36).slice(-4);
      const np: LiveProduct = {
        slug,
        name: p.name || "New product",
        brand: p.brand || "—",
        categorySlug: p.categorySlug || "power-tools",
        summary: p.summary || "",
        description: p.description || [],
        variantLabel: p.variantLabel || "Option",
        specs: p.specs || [],
        documents: p.documents || [],
        bulk: p.bulk ?? false,
        swatch: p.swatch || "#e2231a",
        special: null,
        variants: p.variants || [{ id: "std", label: "Standard", sku: "NEW-SKU", priceCents: 0, wasCents: null, stockByStore: Object.fromEntries(STORES.map((s) => [s.id, 0])) }],
      };
      setProducts((prev) => [np, ...prev]);
    };
    const importProducts = (rows: LiveProduct[]) => {
      setProducts((prev) => [...rows, ...prev]);
      return rows.length;
    };

    const setHero = (h: Hero) => setHeroState(h);
    const reset = () => { setProducts(seedProducts()); setHeroState(DEFAULT_HERO); };

    return { products, priceOf, stockOf, minPriceOf, inStockAt, setPrice, setStock, setSchedule, addProduct, updateProduct, deleteProduct, addVariant, removeVariant, importProducts, hero, setHero, reset };
  }, [products, hero]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCatalogue(): CatalogueCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCatalogue must be used within CatalogueProvider");
  return c;
}

export { specialActive };
