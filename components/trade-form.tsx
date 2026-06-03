"use client";

import { useState } from "react";
import Link from "next/link";

export function TradeForm() {
  const [submitted, setSubmitted] = useState(false);
  const field = "w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand";

  if (submitted) {
    return (
      <div className="rounded-xl border border-line bg-surface p-8 text-center">
        <h2 className="text-xl font-bold text-ink">Application received</h2>
        <p className="mt-2 text-muted">Thanks — our team will review your details and be in touch within 2 working days to set up your account.</p>
        <Link href="/" className="mt-6 inline-block rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark">Back to shopping</Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
      className="space-y-4 rounded-xl border border-line bg-surface p-5"
    >
      <h2 className="text-lg font-bold text-ink">Apply for a trade account</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <input required placeholder="Business / trading name" className={`${field} sm:col-span-2`} aria-label="Business name" />
        <input required placeholder="Contact person" className={field} aria-label="Contact person" />
        <input placeholder="VAT number (optional)" className={field} aria-label="VAT number" />
        <input type="email" required placeholder="Email" className={field} aria-label="Email" />
        <input type="tel" required placeholder="Mobile number" className={field} aria-label="Mobile number" />
        <select required defaultValue="" className={`${field} sm:col-span-2`} aria-label="Trade type">
          <option value="" disabled>Type of trade</option>
          <option>Builder / contractor</option>
          <option>Plumber</option>
          <option>Electrician</option>
          <option>Painter</option>
          <option>Other</option>
        </select>
        <textarea placeholder="Roughly how much do you spend per month?" rows={2} className={`${field} sm:col-span-2`} aria-label="Monthly spend" />
      </div>
      <button type="submit" className="w-full rounded-lg bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand-dark">Submit application</button>
      <p className="text-center text-xs text-muted">Subject to approval. Credit terms where applicable.</p>
    </form>
  );
}
