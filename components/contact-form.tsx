"use client";

import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const field = "w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand";

  if (sent) {
    return (
      <div className="rounded-xl border border-line bg-surface p-6 text-center">
        <p className="font-semibold text-ink">Thanks — your message is on its way.</p>
        <p className="mt-1 text-sm text-muted">We&apos;ll reply by email, usually within one working day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-3 rounded-xl border border-line bg-surface p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <input required placeholder="Your name" className={field} aria-label="Your name" />
        <input type="email" required placeholder="Email" className={field} aria-label="Email" />
      </div>
      <textarea required placeholder="How can we help?" rows={4} className={field} aria-label="Message" />
      <button type="submit" className="rounded-lg bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark">Send message</button>
    </form>
  );
}
