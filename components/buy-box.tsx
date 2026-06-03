"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { useCart, useStoreSelection } from "./providers";
import { useCatalogue } from "./catalogue";
import { Price, StockBadge } from "./ui";
import { StoreIcon, TruckIcon } from "./icons";

export function BuyBox({ product }: { product: Product }) {
  const { store } = useStoreSelection();
  const { add } = useCart();
  const { priceOf, stockOf } = useCatalogue();

  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [qty, setQty] = useState(1);
  const [fulfilment, setFulfilment] = useState<"collect" | "deliver">("collect");
  const [added, setAdded] = useState(false);

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const livePrice = priceOf(product.slug, variant.id);
  const liveStock = stockOf(product.slug, variant.id, store.id);
  const soldOut = liveStock <= 0;

  function handleAdd() {
    add(
      {
        productSlug: product.slug,
        variantId: variant.id,
        name: product.name,
        variantLabel: variant.label,
        priceCents: livePrice.priceCents,
        swatch: product.swatch,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <Price cents={livePrice.priceCents} wasCents={livePrice.wasCents} size="lg" />
      <p className="mt-1 text-xs text-muted">Price includes VAT</p>

      {/* Variant picker */}
      {product.variants.length > 1 && (
        <fieldset className="mt-4">
          <legend className="mb-2 text-sm font-semibold text-ink">{product.variantLabel}</legend>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => {
              const vOut = stockOf(product.slug, v.id, store.id) <= 0;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariantId(v.id)}
                  aria-pressed={v.id === variantId}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    v.id === variantId ? "border-brand bg-brand-tint text-brand-dark" : "border-line text-ink hover:border-brand/50"
                  } ${vOut ? "opacity-50" : ""}`}
                >
                  {v.label}
                  {vOut && <span className="ml-1 text-xs">(out)</span>}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="mt-4">
        <StockBadge stock={liveStock} storeName={store.name} />
        <p className="mt-0.5 text-xs text-muted">SKU {variant.sku}</p>
      </div>

      {/* Fulfilment */}
      <div className="mt-4 grid grid-cols-2 gap-2" role="group" aria-label="Get it by">
        <button
          type="button"
          onClick={() => setFulfilment("collect")}
          aria-pressed={fulfilment === "collect"}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium ${fulfilment === "collect" ? "border-brand bg-brand-tint text-brand-dark" : "border-line text-ink"}`}
        >
          <StoreIcon className="h-5 w-5" /> Collect
        </button>
        <button
          type="button"
          onClick={() => setFulfilment("deliver")}
          aria-pressed={fulfilment === "deliver"}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium ${fulfilment === "deliver" ? "border-brand bg-brand-tint text-brand-dark" : "border-line text-ink"}`}
        >
          <TruckIcon className="h-5 w-5" /> Deliver
        </button>
      </div>
      <p className="mt-2 text-xs text-muted">
        {fulfilment === "collect"
          ? `Collect at ${store.name} — usually ready same day.`
          : "Delivery cost is calculated at checkout by area and weight."}
      </p>

      {/* Quantity + action */}
      {product.bulk ? (
        <div className="mt-5">
          <Link href={`/quote?product=${product.slug}`} className="flex w-full items-center justify-center rounded-lg bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand-dark">
            Request a quote
          </Link>
          <p className="mt-2 text-center text-xs text-muted">Bulk/heavy item — we&apos;ll quote price &amp; delivery for your quantity.</p>
        </div>
      ) : (
        <div className="mt-5 flex gap-3">
          <div className="flex items-center rounded-lg border border-line">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2.5 text-lg leading-none text-ink" aria-label="Decrease quantity">−</button>
            <input value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} className="w-12 border-x border-line bg-transparent py-2.5 text-center text-sm" aria-label="Quantity" inputMode="numeric" />
            <button type="button" onClick={() => setQty((q) => q + 1)} className="px-3 py-2.5 text-lg leading-none text-ink" aria-label="Increase quantity">+</button>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={soldOut}
            className="flex flex-1 items-center justify-center rounded-lg bg-brand px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-muted"
          >
            {soldOut ? "Out of stock" : added ? "Added ✓" : "Add to cart"}
          </button>
        </div>
      )}

      {soldOut && !product.bulk && (
        <button type="button" className="mt-3 w-full rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-ink hover:bg-canvas">
          Notify me when back in stock
        </button>
      )}
    </div>
  );
}
