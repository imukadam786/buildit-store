"use client";

import { AdminHeading, Card } from "@/components/admin/ui";
import { formatRand } from "@/lib/money";
import { ADMIN_QUOTES, CAMPAIGNS } from "@/lib/admin";
import { STORES } from "@/lib/data";
import { useAdminData } from "@/components/admin/admin-data";
import { useCatalogue } from "@/components/catalogue";

export default function AdminReports() {
  const { orders } = useAdminData();
  const { products } = useCatalogue();

  // Sales by store
  const salesByStore = STORES.map((s) => ({
    name: s.name.replace("Build It ", ""),
    cents: orders.filter((o) => o.store === s.name && !o.refunded).reduce((a, o) => a + o.totalCents, 0),
  }));
  const maxStore = Math.max(1, ...salesByStore.map((s) => s.cents));

  // Best sellers (by line revenue)
  const agg = new Map<string, { qty: number; cents: number }>();
  orders.forEach((o) => o.items.forEach((it) => {
    const cur = agg.get(it.name) ?? { qty: 0, cents: 0 };
    agg.set(it.name, { qty: cur.qty + it.qty, cents: cur.cents + it.priceCents * it.qty });
  }));
  const bestSellers = [...agg.entries()].map(([name, v]) => ({ name, ...v })).sort((a, b) => b.cents - a.cents).slice(0, 5);

  // Slow movers (brand not seen in any order)
  const soldText = orders.flatMap((o) => o.items.map((i) => i.name.toLowerCase())).join(" ");
  const slowMovers = products.filter((p) => !soldText.includes(p.brand.toLowerCase())).slice(0, 6);

  // Quote conversion
  const totalQuotes = ADMIN_QUOTES.length;
  const accepted = ADMIN_QUOTES.filter((q) => q.status === "Accepted").length;
  const conversion = totalQuotes ? Math.round((accepted / totalQuotes) * 100) : 0;

  const sentCampaigns = CAMPAIGNS.filter((c) => c.status === "Sent");

  function exportCsv() {
    const rows = [["Report", "Metric", "Value"]];
    salesByStore.forEach((s) => rows.push(["Sales by store", s.name, String(s.cents / 100)]));
    bestSellers.forEach((b) => rows.push(["Best sellers", b.name, String(b.cents / 100)]));
    rows.push(["Quotes", "Conversion %", String(conversion)]);
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = "buildit-report.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <AdminHeading title="Reports" subtitle="Sales, sellers and quote performance." />
        <button onClick={exportCsv} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-canvas">Export CSV</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales by store */}
        <Card>
          <h2 className="mb-3 font-bold text-ink">Sales by store</h2>
          <div className="space-y-3">
            {salesByStore.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between text-sm"><span className="text-ink">{s.name}</span><span className="font-semibold text-ink">{formatRand(s.cents)}</span></div>
                <div className="mt-1 h-2 w-full rounded-full bg-canvas"><div className="h-full rounded-full bg-brand" style={{ width: `${(s.cents / maxStore) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quote conversion */}
        <Card>
          <h2 className="mb-3 font-bold text-ink">Quote conversion</h2>
          <p className="text-4xl font-black text-brand">{conversion}%</p>
          <p className="text-sm text-muted">{accepted} of {totalQuotes} quotes accepted</p>
          <h3 className="mb-2 mt-4 text-sm font-semibold text-ink">Email campaigns</h3>
          <ul className="space-y-1 text-sm">
            {sentCampaigns.map((c) => (
              <li key={c.name} className="flex justify-between"><span className="text-ink">{c.name}</span><span className="text-muted">{c.opens}% open · {c.clicks}% click</span></li>
            ))}
          </ul>
        </Card>

        {/* Best sellers */}
        <Card>
          <h2 className="mb-3 font-bold text-ink">Best sellers</h2>
          {bestSellers.length === 0 ? <p className="text-sm text-muted">No sales yet.</p> : (
            <ol className="space-y-2 text-sm">
              {bestSellers.map((b, i) => (
                <li key={b.name} className="flex justify-between"><span className="text-ink">{i + 1}. {b.name} <span className="text-muted">×{b.qty}</span></span><span className="font-semibold text-ink">{formatRand(b.cents)}</span></li>
              ))}
            </ol>
          )}
        </Card>

        {/* Slow movers */}
        <Card>
          <h2 className="mb-3 font-bold text-ink">Slow movers</h2>
          <p className="mb-2 text-xs text-muted">No recorded sales this period — consider a promo.</p>
          <ul className="space-y-1 text-sm">
            {slowMovers.map((p) => <li key={p.slug} className="text-ink">{p.name} <span className="text-muted">· {p.brand}</span></li>)}
          </ul>
        </Card>
      </div>
    </>
  );
}
