"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/providers";
import { formatRand, vatPortion } from "@/lib/money";
import { STOREFRONT_STORE_ID, getStore } from "@/lib/data";

const PROVINCES = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo",
  "Mpumalanga", "Northern Cape", "North West", "Western Cape",
];

const FREE_DELIVERY_CENTS = 200000;
const LOCAL_DELIVERY_CENTS = 15000; // R150

type Fulfilment = "collect" | "deliver";
type Payment = "card" | "eft" | "snapscan";

type PlacedOrder = {
  ref: string;
  fulfilment: Fulfilment;
  totalCents: number;
  storeName: string;
  email: string;
};

export default function CheckoutPage() {
  const store = getStore(STOREFRONT_STORE_ID);
  const { lines, subtotalCents, discountCents, coupon, clear } = useCart();

  const [fulfilment, setFulfilment] = useState<Fulfilment>("collect");
  const [payment, setPayment] = useState<Payment>("card");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<PlacedOrder | null>(null);

  const payableGoods = subtotalCents - discountCents;
  const deliveryCents = fulfilment === "collect" ? 0 : payableGoods >= FREE_DELIVERY_CENTS ? 0 : LOCAL_DELIVERY_CENTS;
  const totalCents = payableGoods + deliveryCents;

  // --- Confirmation view ---------------------------------------------------
  if (order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
          <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 13 4 4 10-10" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h1 className="mt-4 text-2xl font-black text-ink">Order placed</h1>
        <p className="mt-2 text-muted">Thanks! Your order reference is <strong className="text-ink">{order.ref}</strong>.</p>
        <div className="mx-auto mt-6 max-w-sm rounded-xl border border-line bg-surface p-5 text-left text-sm">
          <div className="flex justify-between"><span className="text-muted">Total paid</span><span className="font-bold text-ink">{formatRand(order.totalCents)}</span></div>
          <div className="mt-2 flex justify-between"><span className="text-muted">{order.fulfilment === "collect" ? "Collect from" : "Delivery to"}</span><span className="text-ink">{order.fulfilment === "collect" ? order.storeName : "your address"}</span></div>
          <p className="mt-3 text-muted">
            {order.fulfilment === "collect"
              ? `We'll send a collection-ready notice to ${order.email}. Bring your reference to ${order.storeName}.`
              : `We'll email ${order.email} with delivery updates. Heavy items may be scheduled separately.`}
          </p>
        </div>
        <Link href="/" className="mt-6 inline-block rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark">Continue shopping</Link>
      </div>
    );
  }

  // --- Empty guard ---------------------------------------------------------
  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-black text-ink">Nothing to check out</h1>
        <p className="mt-2 text-muted">Your cart is empty.</p>
        <Link href="/" className="mt-6 inline-block rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark">Start shopping</Link>
      </div>
    );
  }

  function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    const ref = `BI-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    setOrder({ ref, fulfilment, totalCents, storeName: store.name, email });
    clear();
  }

  const field = "w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand";

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-black text-ink">Checkout</h1>

      <form onSubmit={placeOrder} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {/* Contact */}
          <section>
            <h2 className="mb-3 text-lg font-bold text-ink">Contact</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={field} aria-label="Email" />
              <input type="tel" required placeholder="Mobile number" className={field} aria-label="Mobile number" />
            </div>
            <p className="mt-2 text-xs text-muted">Checking out as a guest — no account needed.</p>
          </section>

          {/* Fulfilment */}
          <section>
            <h2 className="mb-3 text-lg font-bold text-ink">How would you like it?</h2>
            <div className="grid grid-cols-2 gap-3">
              {(["collect", "deliver"] as Fulfilment[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFulfilment(f)}
                  aria-pressed={fulfilment === f}
                  className={`rounded-lg border px-4 py-3 text-sm font-semibold ${fulfilment === f ? "border-brand bg-brand-tint text-brand-dark" : "border-line text-ink"}`}
                >
                  {f === "collect" ? "Collect in-store" : "Deliver to me"}
                </button>
              ))}
            </div>

            {fulfilment === "collect" ? (
              <div className="mt-3 rounded-lg border border-line bg-surface p-4 text-sm">
                <p className="font-semibold text-ink">{store.name}</p>
                <p className="text-muted">{store.area} · {store.hours}</p>
                <p className="mt-1 text-success">Usually ready to collect the same day.</p>
              </div>
            ) : (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input required placeholder="First name" className={field} aria-label="First name" />
                <input required placeholder="Last name" className={field} aria-label="Last name" />
                <input required placeholder="Street address" className={`${field} sm:col-span-2`} aria-label="Street address" />
                <input placeholder="Suburb" className={field} aria-label="Suburb" />
                <input required placeholder="City / town" className={field} aria-label="City or town" />
                <select required defaultValue="" className={field} aria-label="Province">
                  <option value="" disabled>Province</option>
                  {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                </select>
                <input required placeholder="Postal code" className={field} aria-label="Postal code" inputMode="numeric" />
                <p className="text-xs text-muted sm:col-span-2">Delivery is estimated for your area. Heavy or bulk items may be quoted and scheduled separately by your store.</p>
              </div>
            )}
          </section>

          {/* Payment */}
          <section>
            <h2 className="mb-3 text-lg font-bold text-ink">Payment</h2>
            <p className="mb-3 text-xs text-muted">All transactions are secure and encrypted.</p>
            <div className="space-y-2">
              {([
                { id: "card", label: "Card (Visa / Mastercard)" },
                { id: "eft", label: "Instant EFT (Ozow)" },
                { id: "snapscan", label: "SnapScan" },
              ] as { id: Payment; label: string }[]).map((opt) => (
                <label key={opt.id} className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${payment === opt.id ? "border-brand bg-brand-tint" : "border-line"}`}>
                  <input type="radio" name="payment" checked={payment === opt.id} onChange={() => setPayment(opt.id)} className="accent-brand" />
                  <span className="font-medium text-ink">{opt.label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-40 lg:self-start">
          <div className="rounded-xl border border-line bg-surface p-5">
            <h2 className="text-lg font-bold text-ink">Summary</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {lines.map((l) => (
                <li key={`${l.productSlug}-${l.variantId}`} className="flex justify-between gap-2">
                  <span className="text-ink">{l.qty}× {l.name}<span className="block text-xs text-muted">{l.variantLabel}</span></span>
                  <span className="shrink-0 text-ink">{formatRand(l.priceCents * l.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-line pt-3 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatRand(subtotalCents)}</dd></div>
              {discountCents > 0 && <div className="flex justify-between text-success"><dt>Discount ({coupon})</dt><dd>−{formatRand(discountCents)}</dd></div>}
              <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{fulfilment === "collect" ? "Free (collect)" : deliveryCents === 0 ? "Free" : formatRand(deliveryCents)}</dd></div>
              <div className="flex justify-between border-t border-line pt-2 text-base font-bold"><dt>Total</dt><dd className="text-brand">{formatRand(totalCents)}</dd></div>
              <p className="text-xs text-muted">Includes VAT of {formatRand(vatPortion(totalCents))}</p>
            </dl>
            <button type="submit" className="mt-4 w-full rounded-lg bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand-dark">
              Pay {formatRand(totalCents)}
            </button>
            <Link href="/cart" className="mt-2 block text-center text-xs font-medium text-muted hover:text-brand">← Back to cart</Link>
          </div>
        </aside>
      </form>
    </div>
  );
}
