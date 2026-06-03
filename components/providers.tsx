"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_STORE_ID, STORES, getStore, type Store } from "@/lib/data";

// ---------------------------------------------------------------------------
// Store selection — the customer shops against ONE store at a time.
// ---------------------------------------------------------------------------
type StoreCtx = { store: Store; stores: Store[]; setStoreId: (id: string) => void };
const StoreContext = createContext<StoreCtx | null>(null);

// ---------------------------------------------------------------------------
// Cart — line items keyed by product+variant, persisted to localStorage.
// ---------------------------------------------------------------------------
export type CartLine = {
  productSlug: string;
  variantId: string;
  name: string;
  variantLabel: string;
  priceCents: number;
  swatch: string;
  qty: number;
};

type CartCtx = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "qty">, qty: number) => void;
  setQty: (productSlug: string, variantId: string, qty: number) => void;
  remove: (productSlug: string, variantId: string) => void;
  clear: () => void;
  count: number;
  subtotalCents: number;
  coupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  discountCents: number;
};
const CartContext = createContext<CartCtx | null>(null);

// Demo coupons — real ones come from the admin later.
const COUPONS: Record<string, number> = { BUILD10: 0.1, WINTER5: 0.05 };

const STORE_KEY = "bi.store";
const CART_KEY = "bi.cart";
const COUPON_KEY = "bi.coupon";

export function Providers({ children }: { children: React.ReactNode }) {
  const [storeId, setStoreId] = useState(DEFAULT_STORE_ID);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted state once on mount.
  useEffect(() => {
    try {
      const s = localStorage.getItem(STORE_KEY);
      if (s && STORES.some((x) => x.id === s)) setStoreId(s);
      const c = localStorage.getItem(CART_KEY);
      if (c) setLines(JSON.parse(c));
      const co = localStorage.getItem(COUPON_KEY);
      if (co && COUPONS[co]) setCoupon(co);
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORE_KEY, storeId);
  }, [storeId, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(COUPON_KEY, coupon ?? "");
  }, [coupon, hydrated]);

  const storeValue = useMemo<StoreCtx>(
    () => ({ store: getStore(storeId), stores: STORES, setStoreId }),
    [storeId],
  );

  const cartValue = useMemo<CartCtx>(() => {
    const add: CartCtx["add"] = (line, qty) =>
      setLines((prev) => {
        const i = prev.findIndex((l) => l.productSlug === line.productSlug && l.variantId === line.variantId);
        if (i === -1) return [...prev, { ...line, qty }];
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      });
    const setQty: CartCtx["setQty"] = (productSlug, variantId, qty) =>
      setLines((prev) =>
        prev
          .map((l) => (l.productSlug === productSlug && l.variantId === variantId ? { ...l, qty } : l))
          .filter((l) => l.qty > 0),
      );
    const remove: CartCtx["remove"] = (productSlug, variantId) =>
      setLines((prev) => prev.filter((l) => !(l.productSlug === productSlug && l.variantId === variantId)));
    const clear = () => {
      setLines([]);
      setCoupon(null);
    };
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotalCents = lines.reduce((s, l) => s + l.priceCents * l.qty, 0);
    const applyCoupon = (code: string) => {
      const key = code.trim().toUpperCase();
      if (COUPONS[key]) {
        setCoupon(key);
        return true;
      }
      return false;
    };
    const removeCoupon = () => setCoupon(null);
    const discountCents = coupon ? Math.round(subtotalCents * COUPONS[coupon]) : 0;
    return { lines, add, setQty, remove, clear, count, subtotalCents, coupon, applyCoupon, removeCoupon, discountCents };
  }, [lines, coupon]);

  return (
    <StoreContext.Provider value={storeValue}>
      <CartContext.Provider value={cartValue}>{children}</CartContext.Provider>
    </StoreContext.Provider>
  );
}

export function useStoreSelection(): StoreCtx {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStoreSelection must be used within Providers");
  return ctx;
}

export function useCart(): CartCtx {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within Providers");
  return ctx;
}
