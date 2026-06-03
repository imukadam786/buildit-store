import Link from "next/link";
import { AdminHeading, Card, Pill } from "@/components/admin/ui";
import { formatRand } from "@/lib/money";
import { ADMIN_ORDERS, ADMIN_QUOTES, DASHBOARD, TRADE_APPLICATIONS } from "@/lib/admin";
import { PRODUCTS } from "@/lib/data";

export default function AdminDashboard() {
  const newOrders = ADMIN_ORDERS.filter((o) => o.status === "New").length;
  const newQuotes = ADMIN_QUOTES.filter((q) => q.status === "New").length;
  const pendingTrade = TRADE_APPLICATIONS.filter((a) => a.status === "Pending").length;
  const lowStock = PRODUCTS.flatMap((p) => p.variants.filter((v) => v.stock > 0 && v.stock <= 5).map((v) => ({ name: p.name, label: v.label, stock: v.stock })));

  const stats = [
    { label: "Sales today", value: formatRand(DASHBOARD.salesTodayCents) },
    { label: "Sales this week", value: formatRand(DASHBOARD.salesWeekCents) },
    { label: "Orders today", value: String(DASHBOARD.ordersToday) },
    { label: "Conversion", value: `${DASHBOARD.conversionPct}%` },
  ];

  return (
    <>
      <AdminHeading title="Dashboard" subtitle="A snapshot across both stores." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">{s.label}</p>
            <p className="mt-1 text-2xl font-black text-ink">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Needs action */}
      <h2 className="mb-3 mt-8 text-lg font-bold text-ink">Needs your attention</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <Link href="/admin/orders"><Card className="hover:border-brand/40"><p className="text-3xl font-black text-brand">{newOrders}</p><p className="text-sm font-medium text-ink">new orders to prepare</p></Card></Link>
        <Link href="/admin/quotes"><Card className="hover:border-brand/40"><p className="text-3xl font-black text-brand">{newQuotes}</p><p className="text-sm font-medium text-ink">quote requests to price</p></Card></Link>
        <Link href="/admin/trade"><Card className="hover:border-brand/40"><p className="text-3xl font-black text-brand">{pendingTrade}</p><p className="text-sm font-medium text-ink">trade applications pending</p></Card></Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm font-semibold text-brand">View all →</Link>
          </div>
          <Card className="p-0">
            <table className="w-full text-sm">
              <tbody>
                {ADMIN_ORDERS.slice(0, 5).map((o) => (
                  <tr key={o.ref} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-medium text-ink">{o.ref}<span className="block text-xs text-muted">{o.customer}</span></td>
                    <td className="px-4 py-3 text-muted">{o.store.replace("Build It ", "")}</td>
                    <td className="px-4 py-3 text-right text-ink">{formatRand(o.totalCents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Low stock */}
        <div>
          <h2 className="mb-3 text-lg font-bold text-ink">Low stock</h2>
          <Card>
            {lowStock.length === 0 ? (
              <p className="text-sm text-muted">Nothing running low.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {lowStock.map((l, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span className="text-ink">{l.name} <span className="text-muted">· {l.label}</span></span>
                    <Pill tone="amber">{l.stock} left</Pill>
                  </li>
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
