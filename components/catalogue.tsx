"use client";

// Shared, browser-persisted catalogue layer. The storefront reads live prices
// and per-store stock from here; the admin writes to it. Seeded from the static
// sample data, so the storefront still server-renders sensibly and the admin's
// edits show up live (the key demo moment). "Reset demo data" clears overrides.

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PRODUCTS } from "@/lib/data";
import type { Product } from "@/lib/types";

type PriceOverride = { priceCents: number; wasCents: number | null };
type Overrides = {
  price: Record<string, PriceOverride>; // key `${slug}:${vid}`
  stock: Record<string, number>; // key `${slug}:${vid}:${storeId}`
  hero: { title: string; subtitle: string } | null;
};

const EMPTY: Overrides = { price: {}, stock: {}, hero: null };
const KEY = "bi.catalogue";

const DEFAULT_HERO = {
  title: "Everything to build, fix and improve.",
  subtitle: "Shop tools, building materials, paint and plumbing. Collect at your store or have it delivered to site.",
};

// Out-of-the-box, the second store carries a bit less stock so per-store numbers
// differ in the demo without anyone editing them.
function seedStock(seed: number, storeId: string): number {
  return storeId === "kloof" ? Math.floor(seed / 2) : seed;
}

type CatalogueCtx = {
  products: Product[];
  priceOf: (slug: string, vid: string) => PriceOverride;
  stockOf: (slug: string, vid: string, storeId: string) => number;
  minPriceOf: (slug: string) => PriceOverride;
  inStockAt: (slug: string, storeId: string) => boolean;
  setPrice: (slug: string, vid: string, priceCents: number, wasCents: number | null) => void;
  setStock: (slug: string, vid: string, storeId: string, n: number) => void;
  hero: { title: string; subtitle: string };
  setHero: (h: { title: string; subtitle: string }) => void;
  reset: () => void;
};

const Ctx = createContext<CatalogueCtx | null>(null);

function variantSeed(slug: string, vid: string) {
  const p = PRODUCTS.find((x) => x.slug === slug);
  return p?.variants.find((v) => v.id === vid);
}

export function CatalogueProvider({ children }: { children: React.ReactNode }) {
  const [ov, setOv] = useState<Overrides>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setOv({ ...EMPTY, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(ov));
  }, [ov, hydrated]);

  const value = useMemo<CatalogueCtx>(() => {
    const priceOf = (slug: string, vid: string): PriceOverride => {
      const o = ov.price[`${slug}:${vid}`];
      if (o) return o;
      const s = variantSeed(slug, vid);
      return { priceCents: s?.priceCents ?? 0, wasCents: s?.wasCents ?? null };
    };
    const stockOf = (slug: string, vid: string, storeId: string): number => {
      const k = `${slug}:${vid}:${storeId}`;
      if (k in ov.stock) return ov.stock[k];
      return seedStock(variantSeed(slug, vid)?.stock ?? 0, storeId);
    };
    const minPriceOf = (slug: string): PriceOverride => {
      const p = PRODUCTS.find((x) => x.slug === slug);
      if (!p) return { priceCents: 0, wasCents: null };
      let best = priceOf(slug, p.variants[0].id);
      for (const v of p.variants) {
        const cur = priceOf(slug, v.id);
        if (cur.priceCents < best.priceCents) best = cur;
      }
      return best;
    };
    const inStockAt = (slug: string, storeId: string): boolean => {
      const p = PRODUCTS.find((x) => x.slug === slug);
      return !!p && p.variants.some((v) => stockOf(slug, v.id, storeId) > 0);
    };
    const setPrice = (slug: string, vid: string, priceCents: number, wasCents: number | null) =>
      setOv((prev) => ({ ...prev, price: { ...prev.price, [`${slug}:${vid}`]: { priceCents, wasCents } } }));
    const setStock = (slug: string, vid: string, storeId: string, n: number) =>
      setOv((prev) => ({ ...prev, stock: { ...prev.stock, [`${slug}:${vid}:${storeId}`]: Math.max(0, n) } }));
    const setHero = (h: { title: string; subtitle: string }) => setOv((prev) => ({ ...prev, hero: h }));
    const reset = () => setOv(EMPTY);

    return {
      products: PRODUCTS,
      priceOf, stockOf, minPriceOf, inStockAt,
      setPrice, setStock,
      hero: ov.hero ?? DEFAULT_HERO,
      setHero, reset,
    };
  }, [ov]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCatalogue(): CatalogueCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCatalogue must be used within CatalogueProvider");
  return c;
}
