"use client";

import { useEffect, useState } from "react";
import { AdminHeading, Card, Pill } from "@/components/admin/ui";
import { formatRand } from "@/lib/money";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/admin";
import { STORES } from "@/lib/data";
import { useAdminData, type AdminOrderRow } from "@/components/admin/admin-data";

const tone: Record<OrderStatus, "grey" | "amber" | "blue" | "green" | "red"> = {
  New: "red", Preparing: "amber", Ready: "blue", "Out for delivery": "blue", Completed: "green",
};

export default function AdminOrders() {
  const { orders, setOrderStatus, refundOrder, routeOrder } = useAdminData();
  const [printOrder, setPrintOrder] = useState<AdminOrderRow | null>(null);

  useEffect(() => {
    if (printOrder) {
      window.print();
      setPrintOrder(null);
    }
  }, [printOrder]);

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
                  {o.refunded && <Pill tone="grey">Refunded</Pill>}
                </div>
                <p className="text-sm text-muted">{o.customer} · {o.fulfilment} · {o.date}</p>
                <ul className="mt-2 text-sm text-ink">
                  {o.items.map((it, i) => (
                    <li key={i}>{it.qty}× {it.name} <span className="text-muted">— {formatRand(it.priceCents * it.qty)}</span></li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button onClick={() => setPrintOrder(o)} className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink hover:bg-canvas">Print pick slip</button>
                  {!o.refunded && o.status !== "New" && (
                    <button onClick={() => { if (window.confirm(`Refund ${o.ref}?`)) refundOrder(o.ref); }} className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink hover:bg-canvas">Refund</button>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-ink">{formatRand(o.totalCents)}</p>
                <label className="mt-2 block text-xs text-muted">Fulfilling store
                  <select value={o.store} onChange={(e) => routeOrder(o.ref, e.target.value)} className="mt-1 block rounded-lg border border-line bg-surface px-2 py-1.5 text-sm text-ink">
                    {STORES.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </label>
                <label className="mt-2 block text-xs text-muted">Update status
                  <select value={o.status} onChange={(e) => setOrderStatus(o.ref, e.target.value as OrderStatus)} className="mt-1 block rounded-lg border border-line bg-surface px-2 py-1.5 text-sm text-ink">
                    {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </label>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Printable pick slip */}
      <div id="pickslip" className="hidden p-8 text-sm text-ink print:block">
        {printOrder && (
          <>
            <h1 className="text-xl font-black">Build It — Pick Slip</h1>
            <p className="mt-1">{printOrder.store}</p>
            <hr className="my-3" />
            <p><strong>Order:</strong> {printOrder.ref}</p>
            <p><strong>Customer:</strong> {printOrder.customer}</p>
            <p><strong>Fulfilment:</strong> {printOrder.fulfilment} · {printOrder.date}</p>
            <table className="mt-4 w-full">
              <thead><tr className="text-left"><th className="border-b py-1">Qty</th><th className="border-b py-1">Item</th><th className="border-b py-1 text-right">Line</th></tr></thead>
              <tbody>
                {printOrder.items.map((it, i) => (
                  <tr key={i}><td className="py-1">{it.qty}</td><td className="py-1">{it.name}</td><td className="py-1 text-right">{formatRand(it.priceCents * it.qty)}</td></tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-right text-base font-bold">Total: {formatRand(printOrder.totalCents)}</p>
            <p className="mt-6 text-xs">Picked by: ____________________   Checked by: ____________________</p>
          </>
        )}
      </div>
    </>
  );
}
