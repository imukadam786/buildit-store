"use client";

import { useState } from "react";
import { AdminHeading, Card, Pill } from "@/components/admin/ui";
import { ADMIN_QUOTES, type QuoteStatus } from "@/lib/admin";

const tone: Record<QuoteStatus, "red" | "amber" | "green"> = { New: "red", Quoted: "amber", Accepted: "green" };

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState(ADMIN_QUOTES.map((q) => ({ ...q, price: "", converted: false })));

  function setPrice(ref: string, price: string) {
    setQuotes((prev) => prev.map((q) => (q.ref === ref ? { ...q, price } : q)));
  }
  function sendQuote(ref: string) {
    setQuotes((prev) => prev.map((q) => (q.ref === ref ? { ...q, status: "Quoted" } : q)));
  }
  function convert(ref: string) {
    setQuotes((prev) => prev.map((q) => (q.ref === ref ? { ...q, converted: true } : q)));
  }

  return (
    <>
      <AdminHeading title="Quotes" subtitle="Price bulk and heavy-goods requests, send them back, and convert accepted ones to orders." />
      <div className="space-y-3">
        {quotes.map((q) => (
          <Card key={q.ref}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-ink">{q.ref}</span>
                  <Pill tone={tone[q.status]}>{q.status}</Pill>
                  {q.converted && <Pill tone="blue">Converted to order</Pill>}
                </div>
                <p className="text-sm text-muted">{q.customer} · {q.store.replace("Build It ", "")} · {q.area} · {q.date}</p>
                <ul className="mt-2 text-sm text-ink">
                  {q.items.map((it, i) => <li key={i}>{it.qty} × {it.name}</li>)}
                </ul>
              </div>
              <div className="w-full max-w-xs">
                {q.status === "New" && (
                  <div className="flex items-end gap-2">
                    <label className="flex-1 text-xs text-muted">Quoted price (R)
                      <input value={q.price} onChange={(e) => setPrice(q.ref, e.target.value)} type="number" className="mt-1 w-full rounded-lg border border-line px-2 py-1.5 text-sm text-ink" />
                    </label>
                    <button onClick={() => sendQuote(q.ref)} disabled={!q.price} className="rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:bg-muted">Send quote</button>
                  </div>
                )}
                {q.status === "Quoted" && !q.converted && (
                  <p className="text-sm text-muted">Quote sent{q.price ? ` (R ${q.price})` : ""}. Waiting on the customer.</p>
                )}
                {(q.status === "Accepted" || q.status === "Quoted") && !q.converted && (
                  <button onClick={() => convert(q.ref)} className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink hover:bg-canvas">Convert to order</button>
                )}
                {q.converted && <p className="text-sm text-success">Order created from this quote ✓</p>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
