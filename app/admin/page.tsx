"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminHeading, Card, Pill } from "@/components/admin/ui";
import { formatRand } from "@/lib/money";
import { ADMIN_QUOTES } from "@/lib/admin";
import { useAdminData } from "@/components/admin/admin-data";
import { useCatalogue } from "@/components/catalogue";

type Filter = "all" | "strand" | "stellenbosch";
const STORE_NAME: Record<Exclude<Filter, "all">, string> = { strand: "Build It Strand", stellenbosch: "Build It Stellenbosch" };

export default function AdminDashboard() {
  const { orders, apps } = useAdminData();
  const { products } = useCatalogue();
  const [filter, setFilter] = useState<Filter>("all");

  const storeIds = filter === "all" ? ["strand", "stellenbosch"] : [filter];
  const matchStore = (store: string) => filter === "all" || store === STORE_NAME[filter];

  const visibleOrders = orders.filter((o) => matchStore(o.store));
  const sales = visibleOrders.reduce((s, o) => s + (o.refunded ? 0 : o.totalCents), 0);
  const newOrders = visibleOrders.filter((o) => o.status === "New").length;
  const newQuotes = ADMIN_QUOTES.filter((q) => q.status === "New" && matchStore(q.store)).length;
  const pendingTrade = apps.filter((a) => a.status === "Pending").length;

  const lowStock = products.flatMap((p) =>
    p.variants
      .filter((v) => storeIds.some((sid) => (v.stockByStore[sid] ?? 0) > 0 && (v.stockByStore[sid] ?? 0) <= 5))
      .map((v) => ({ name: p.name, label: v.label, stock: Math.min(...storeIds.map((sid) => v.stockByStore[sid] ?? 0).filter((n) => n > 0)) })),
  );

  const stats = [
    { label: filter === "all" ? "Sales (all orders)" : "Sales", value: formatRand(sales) },
    { label: "Orders", value: String(visibleOrders.length) },
    { label: "To prepare", value: String(newOrders) },
    { label: "New quotes", value: String(newQuotes) },
  ];

  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "Both stores" },
    { id: "strand", label: "Strand" },
    { id: "stellenbosch", label: "Stellenbosch" },
  ];

  return (
    <>
      <AdminHeading title="Dashboard" subtitle="Switch between a combined view and each store." />

      {/* Store filter */}
      <div role="tablist" className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={filter === t.id} onClick={() => setFilter(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${filter === t.id ? "bg-brand text-white" : "border border-line text-ink hover:bg-canvas"}`}>{t.label}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}><p className="text-xs font-medium uppercase tracking-wide text-muted">{s.label}</p><p className="mt-1 text-2xl font-black text-ink">{s.value}</p></Card>
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-lg font-bold text-ink">Needs your attention</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <Link href="/admin/orders"><Card className="hover:border-brand/40"><p className="text-3xl font-black text-brand">{newOrders}</p><p className="text-sm font-medium text-ink">orders to prepare</p></Card></Link>
        <Link href="/admin/quotes"><Card className="hover:border-brand/40"><p className="text-3xl font-black text-brand">{newQuotes}</p><p className="text-sm font-medium text-ink">quote requests to price</p></Card></Link>
        <Link href="/admin/trade"><Card className="hover:border-brand/40"><p className="text-3xl font-black text-brand">{pendingTrade}</p><p className="text-sm font-medium text-ink">trade applications pending</p></Card></Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold text-ink">Recent orders</h2><Link href="/admin/orders" className="text-sm font-semibold text-brand">View all →</Link></div>
          <Card className="p-0">
            {visibleOrders.length === 0 ? (
              <p className="p-4 text-sm text-muted">No orders for this store.</p>
            ) : (
              <table className="w-full text-sm"><tbody>
                {visibleOrders.slice(0, 6).map((o) => (
                  <tr key={o.ref} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-medium text-ink">{o.ref}<span className="block text-xs text-muted">{o.customer}</span></td>
                    <td className="px-4 py-3 text-muted">{o.store.replace("Build It ", "")}</td>
                    <td className="px-4 py-3 text-right text-ink">{formatRand(o.totalCents)}</td>
                  </tr>
                ))}
              </tbody></table>
            )}
          </Card>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-bold text-ink">Low stock {filter !== "all" && `· ${STORE_NAME[filter].replace("Build It ", "")}`}</h2>
          <Card>
            {lowStock.length === 0 ? <p className="text-sm text-muted">Nothing running low.</p> : (
              <ul className="space-y-2 text-sm">
                {lowStock.map((l, i) => (
                  <li key={i} className="flex items-center justify-between"><span className="text-ink">{l.name} <span className="text-muted">· {l.label}</span></span><Pill tone="amber">{l.stock} left</Pill></li>
                ))}
              </ul>
            )}
            <Link href="/admin/catalogue" className="mt-3 inline-block text-sm font-semibold text-brand">Manage stock →</Link>
          </Card>
        </div>
      </div>
    </>
  );
}
