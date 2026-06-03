"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./providers";
import { STOREFRONT_STORE_ID, getStore } from "@/lib/data";

const AREAS = ["Local (within 30km)", "Regional (30–100km)", "Further than 100km", "Not sure yet"];

type QuoteItem = { name: string; qty: string };

export function QuoteForm({
  fromCart,
  seedProduct,
}: {
  fromCart: boolean;
  seedProduct: { slug: string; name: string } | null;
}) {
  const store = getStore(STOREFRONT_STORE_ID);
  const { lines } = useCart();

  // Build the initial item list from the seed product, the cart, or one blank row.
  const initial: QuoteItem[] = fromCart && lines.length
    ? lines.map((l) => ({ name: `${l.name}${l.variantLabel ? ` (${l.variantLabel})` : ""}`, qty: String(l.qty) }))
    : seedProduct
    ? [{ name: seedProduct.name, qty: "" }]
    : [{ name: "", qty: "" }];

  const [items, setItems] = useState<QuoteItem[]>(initial);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  function updateItem(i: number, key: keyof QuoteItem, value: string) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, [key]: value } : it)));
  }
  function addRow() {
    setItems((prev) => [...prev, { name: "", qty: "" }]);
  }
  function removeRow(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-line bg-surface p-8 text-center">
        <h2 className="text-xl font-bold text-ink">Quote request sent</h2>
        <p className="mt-2 text-muted">Your reference is <strong className="text-ink">{submitted}</strong>.</p>
        <p className="mt-2 text-sm text-muted">
          {store.name} will review your request and reply to <strong>{email || "your email"}</strong>, usually within one working day.
        </p>
        <Link href="/" className="mt-6 inline-block rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark">Back to shopping</Link>
      </div>
    );
  }

  const field = "w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(`Q-${Date.now().toString(36).toUpperCase().slice(-6)}`);
      }}
      className="space-y-6 rounded-xl border border-line bg-surface p-5"
    >
      {/* Items */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-ink">What do you need?</h2>
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="flex gap-2">
              <input value={it.name} onChange={(e) => updateItem(i, "name", e.target.value)} placeholder="Product or material" className={`${field} flex-1`} aria-label={`Item ${i + 1} name`} required />
              <input value={it.qty} onChange={(e) => updateItem(i, "qty", e.target.value)} placeholder="Qty" className={`${field} w-24`} aria-label={`Item ${i + 1} quantity`} />
              {items.length > 1 && (
                <button type="button" onClick={() => removeRow(i)} className="rounded-lg border border-line px-3 text-muted hover:text-brand" aria-label="Remove item">×</button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addRow} className="mt-2 text-sm font-medium text-brand hover:text-brand-dark">+ Add another item</button>
      </section>

      {/* Contact + delivery */}
      <section className="grid gap-3 sm:grid-cols-2">
        <input required placeholder="Your name" className={field} aria-label="Your name" />
        <input type="tel" required placeholder="Mobile number" className={field} aria-label="Mobile number" />
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={field} aria-label="Email" />
        <select required defaultValue="" className={field} aria-label="Delivery area">
          <option value="" disabled>Delivery area</option>
          {AREAS.map((a) => <option key={a}>{a}</option>)}
        </select>
        <textarea placeholder="Anything else we should know? (site access, deadlines, etc.)" rows={3} className={`${field} sm:col-span-2`} aria-label="Notes" />
      </section>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">Quoting from <strong>{store.name}</strong></p>
        <button type="submit" className="rounded-lg bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark">Send quote request</button>
      </div>
    </form>
  );
}
