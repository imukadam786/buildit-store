"use client";

import { useState } from "react";
import { AdminHeading, Card, Pill } from "@/components/admin/ui";
import { formatRand } from "@/lib/money";
import { ADMIN_ORDERS, ORDER_STATUSES, type OrderStatus } from "@/lib/admin";

const tone: Record<OrderStatus, "grey" | "amber" | "blue" | "green" | "red"> = {
  New: "red", Preparing: "amber", Ready: "blue", "Out for delivery": "blue", Completed: "green",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState(ADMIN_ORDERS);

  function setStatus(ref: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.ref === ref ? { ...o, status } : o)));
  }

  return (
    <>
      <AdminHeading title="Orders" subtitle="Work each order from new through to collected or delivered." />
      <div className="space-y-3">
        {orders.map((o) => (
          <Card key={o.ref}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-ink">{o.ref}</span>
                  <Pill tone={tone[o.status]}>{o.status}</Pill>
                </div>
                <p className="text-sm text-muted">{o.customer} · {o.store.replace("Build It ", "")} · {o.fulfilment} · {o.date}</p>
                <ul className="mt-2 text-sm text-ink">
                  {o.items.map((it, i) => (
                    <li key={i}>{it.qty}× {it.name} <span className="text-muted">— {formatRand(it.priceCents * it.qty)}</span></li>
                  ))}
                </ul>
              </div>
              <div className="text-right">
                <p className="font-bold text-ink">{formatRand(o.totalCents)}</p>
                <label className="mt-2 block text-xs text-muted">Update status
                  <select value={o.status} onChange={(e) => setStatus(o.ref, e.target.value as OrderStatus)} className="mt-1 block rounded-lg border border-line bg-surface px-2 py-1.5 text-sm text-ink">
                    {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </label>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
