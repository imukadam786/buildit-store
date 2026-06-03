"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/providers";
import { ProductThumb } from "@/components/ui";
import { formatRand, vatPortion } from "@/lib/money";

const FREE_DELIVERY_CENTS = 200000; // R2 000

export default function CartPage() {
  const { lines, setQty, remove, subtotalCents, coupon, applyCoupon, removeCoupon, discountCents } = useCart();
  const [code, setCode] = useState("");
  const [couponError, setCouponError] = useState(false);
  const [savedList, setSavedList] = useState(false);

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-black text-ink">Your cart is empty</h1>
        <p className="mt-2 text-muted">Browse a category and add what you need — collect in-store or have it delivered.</p>
        <Link href="/" className="mt-6 inline-block rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
          Start shopping
        </Link>
      </div>
    );
  }

  const payable = subtotalCents - discountCents;
  const remaining = Math.max(0, FREE_DELIVERY_CENTS - payable);
  const progress = Math.min(100, Math.round((payable / FREE_DELIVERY_CENTS) * 100));

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-black text-ink">Your cart</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Line items */}
        <div>
          {/* Free-delivery progress */}
          <div className="mb-4 rounded-lg border border-line bg-surface p-3 text-sm">
            {remaining > 0 ? (
              <p className="text-ink">Add <strong>{formatRand(remaining)}</strong> more to qualify for free local delivery.</p>
            ) : (
              <p className="font-medium text-success">You&apos;ve qualified for free local delivery 🎉</p>
            )}
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-canvas">
              <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
            {lines.map((l) => (
              <li key={`${l.productSlug}-${l.variantId}`} className="flex gap-4 p-4">
                <Link href={`/product/${l.productSlug}`} className="shrink-0">
                  <ProductThumb swatch={l.swatch} label={l.name} className="h-20 w-20 rounded-lg border border-line" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <Link href={`/product/${l.productSlug}`} className="text-sm font-semibold text-ink hover:text-brand">{l.name}</Link>
                  {l.variantLabel && <span className="text-xs text-muted">{l.variantLabel}</span>}
                  <div className="mt-auto flex items-center gap-3 pt-2">
                    <div className="flex items-center rounded-lg border border-line">
                      <button onClick={() => setQty(l.productSlug, l.variantId, l.qty - 1)} className="px-2.5 py-1.5 text-ink" aria-label="Decrease quantity">−</button>
                      <span className="w-8 text-center text-sm">{l.qty}</span>
                      <button onClick={() => setQty(l.productSlug, l.variantId, l.qty + 1)} className="px-2.5 py-1.5 text-ink" aria-label="Increase quantity">+</button>
                    </div>
                    <button onClick={() => remove(l.productSlug, l.variantId)} className="text-xs font-medium text-muted hover:text-brand">Remove</button>
                  </div>
                </div>
                <div className="text-right text-sm font-bold text-ink">{formatRand(l.priceCents * l.qty)}</div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap gap-4">
            <Link href="/" className="text-sm font-medium text-brand hover:text-brand-dark">← Continue shopping</Link>
            <button
              onClick={() => setSavedList(true)}
              className="text-sm font-medium text-brand hover:text-brand-dark"
            >
              {savedList ? "Saved to a project list ✓" : "Save as a project list"}
            </button>
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-40 lg:self-start">
          <div className="rounded-xl border border-line bg-surface p-5">
            <h2 className="text-lg font-bold text-ink">Order summary</h2>

            {/* Coupon */}
            <div className="mt-4">
              {coupon ? (
                <div className="flex items-center justify-between rounded-lg bg-brand-tint px-3 py-2 text-sm">
                  <span className="font-medium text-brand-dark">Coupon {coupon} applied</span>
                  <button onClick={removeCoupon} className="text-xs font-medium text-brand-dark underline">Remove</button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const ok = applyCoupon(code);
                    setCouponError(!ok);
                    if (ok) setCode("");
                  }}
                  className="flex gap-2"
                >
                  <input
                    value={code}
                    onChange={(e) => { setCode(e.target.value); setCouponError(false); }}
                    placeholder="Coupon code"
                    className="w-full rounded-lg border border-line px-3 py-2 text-sm"
                    aria-label="Coupon code"
                  />
                  <button type="submit" className="rounded-lg border border-line px-3 py-2 text-sm font-medium hover:bg-canvas">Apply</button>
                </form>
              )}
              {couponError && <p className="mt-1 text-xs text-brand">That code isn&apos;t valid. Try BUILD10.</p>}
            </div>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="text-ink">{formatRand(subtotalCents)}</dd></div>
              {discountCents > 0 && (
                <div className="flex justify-between"><dt className="text-success">Discount</dt><dd className="text-success">−{formatRand(discountCents)}</dd></div>
              )}
              <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd className="text-ink">Calculated at checkout</dd></div>
              <div className="flex justify-between border-t border-line pt-2 text-base font-bold"><dt>Total</dt><dd className="text-brand">{formatRand(payable)}</dd></div>
              <p className="text-xs text-muted">Includes VAT of {formatRand(vatPortion(payable))}</p>
            </dl>

            <Link href="/checkout" className="mt-4 flex w-full items-center justify-center rounded-lg bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand-dark">
              Proceed to checkout
            </Link>
            <Link href="/quote?from=cart" className="mt-2 flex w-full items-center justify-center rounded-lg border border-line px-4 py-3 text-sm font-semibold text-ink hover:bg-canvas">
              Turn this into a quote
            </Link>
            <p className="mt-3 text-center text-xs text-muted">Buying in bulk or for a site? A quote may suit you better.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
