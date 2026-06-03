"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./providers";
import { formatRand } from "@/lib/money";
import {
  SAMPLE_ADDRESSES, SAMPLE_LISTS, SAMPLE_ORDERS, SAMPLE_PROFILE, SAMPLE_QUOTES,
  type AccountOrder,
} from "@/lib/account";

type Section = "orders" | "lists" | "quotes" | "addresses" | "trade";

const NAV: { key: Section; label: string }[] = [
  { key: "orders", label: "Orders" },
  { key: "lists", label: "Project lists" },
  { key: "quotes", label: "My quotes" },
  { key: "addresses", label: "Addresses" },
  { key: "trade", label: "Trade account" },
];

const statusTone: Record<string, string> = {
  Delivered: "bg-success/10 text-success",
  "Ready to collect": "bg-warning/10 text-warning",
  Processing: "bg-canvas text-muted",
  Quoted: "bg-success/10 text-success",
  "Awaiting reply": "bg-warning/10 text-warning",
  Accepted: "bg-brand-tint text-brand-dark",
};

function OrderCard({ order }: { order: AccountOrder }) {
  const { add } = useCart();
  const [reordered, setReordered] = useState(false);
  function reorder() {
    order.items.forEach((it) =>
      add({ productSlug: it.productSlug, variantId: it.variantId, name: it.name, variantLabel: it.variantLabel, priceCents: it.priceCents, swatch: it.swatch }, it.qty),
    );
    setReordered(true);
    setTimeout(() => setReordered(false), 2500);
  }
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-sm font-bold text-ink">{order.ref}</span>
          <span className="ml-2 text-xs text-muted">{order.date} · {order.fulfilment}</span>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusTone[order.status]}`}>{order.status}</span>
      </div>
      <ul className="mt-3 space-y-1 text-sm text-ink">
        {order.items.map((it) => (
          <li key={it.variantId} className="flex justify-between gap-2">
            <Link href={`/product/${it.productSlug}`} className="hover:text-brand">{it.qty}× {it.name}</Link>
            <span className="shrink-0 text-muted">{formatRand(it.priceCents * it.qty)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
        <span className="text-sm font-bold text-ink">Total {formatRand(order.totalCents)}</span>
        <button onClick={reorder} className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark">
          {reordered ? "Added to cart ✓" : "Reorder"}
        </button>
      </div>
    </div>
  );
}

export function AccountView() {
  const [section, setSection] = useState<Section>("orders");

  return (
    <div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-8">
      {/* Side nav */}
      <aside className="mb-6 lg:mb-0">
        <div className="mb-4 rounded-xl bg-charcoal p-4 text-white">
          <p className="text-sm text-white/70">Signed in as</p>
          <p className="font-semibold">{SAMPLE_PROFILE.name}</p>
          <p className="text-xs text-white/60">{SAMPLE_PROFILE.email}</p>
        </div>
        <nav className="flex gap-2 overflow-x-auto lg:flex-col">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setSection(n.key)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium ${section === n.key ? "bg-brand-tint text-brand-dark" : "text-ink hover:bg-canvas"}`}
            >
              {n.label}
            </button>
          ))}
        </nav>
      </aside>

      <div>
        {section === "orders" && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-ink">Recent orders</h2>
            {SAMPLE_ORDERS.map((o) => <OrderCard key={o.ref} order={o} />)}
          </section>
        )}

        {section === "lists" && (
          <section>
            <h2 className="mb-4 text-lg font-bold text-ink">Project lists</h2>
            <ul className="space-y-3">
              {SAMPLE_LISTS.map((l) => (
                <li key={l.name} className="flex items-center justify-between rounded-xl border border-line bg-surface p-4">
                  <div>
                    <p className="font-semibold text-ink">{l.name}</p>
                    <p className="text-xs text-muted">{l.items} items</p>
                  </div>
                  <button className="text-sm font-semibold text-brand hover:text-brand-dark">View list</button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {section === "quotes" && (
          <section>
            <h2 className="mb-4 text-lg font-bold text-ink">My quotes</h2>
            <ul className="space-y-3">
              {SAMPLE_QUOTES.map((q) => (
                <li key={q.ref} className="rounded-xl border border-line bg-surface p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-ink">{q.ref}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusTone[q.status]}`}>{q.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink">{q.summary}</p>
                  <p className="text-xs text-muted">{q.date}</p>
                </li>
              ))}
            </ul>
            <Link href="/quote" className="mt-4 inline-block rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-canvas">Request a new quote</Link>
          </section>
        )}

        {section === "addresses" && (
          <section>
            <h2 className="mb-4 text-lg font-bold text-ink">Saved addresses</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {SAMPLE_ADDRESSES.map((a) => (
                <li key={a.label} className="rounded-xl border border-line bg-surface p-4">
                  <p className="font-semibold text-ink">{a.label}</p>
                  <p className="text-sm text-muted">{a.lines}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {section === "trade" && (
          <section>
            <h2 className="mb-4 text-lg font-bold text-ink">Trade account</h2>
            <div className="rounded-xl border-2 border-brand bg-brand-tint p-5">
              <p className="text-sm text-ink">You don&apos;t have a trade account yet.</p>
              <p className="mt-1 text-sm text-ink/80">Open one for bulk pricing, buying on account and faster quotes.</p>
              <Link href="/trade" className="mt-3 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">Apply for a trade account</Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
