"use client";

import { useState } from "react";
import { AdminHeading, Card, Pill } from "@/components/admin/ui";
import { formatRand } from "@/lib/money";
import { type ApplicationStatus } from "@/lib/admin";
import { useAdminData, type AdminCustomer, type Terms } from "@/components/admin/admin-data";

const appTone: Record<ApplicationStatus, "amber" | "green" | "grey"> = { Pending: "amber", Approved: "green", Declined: "grey" };
const DEFAULT_TERMS: Terms = { creditLimitCents: 5000000, discountPct: 10, buyers: [] };

function CustomerRow({ c }: { c: AdminCustomer }) {
  const { orders, updateTerms } = useAdminData();
  const [open, setOpen] = useState(false);
  const [buyer, setBuyer] = useState("");
  const history = orders.filter((o) => o.customer === c.name);
  const terms = c.terms;

  function patchTerms(patch: Partial<Terms>) {
    updateTerms(c.email, { ...(terms ?? DEFAULT_TERMS), ...patch });
  }

  return (
    <div className="border-b border-line last:border-0">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-canvas">
        <span><span className="font-medium text-ink">{c.name}</span><span className="block text-xs text-muted">{c.email}</span></span>
        <span className="flex items-center gap-3 text-sm">
          <Pill tone={c.type === "Trade" ? "blue" : "grey"}>{c.type}</Pill>
          <span className="text-ink">{c.orders} orders</span>
          <span className="hidden text-ink sm:inline">{formatRand(c.spentCents)}</span>
          <span aria-hidden>{open ? "▴" : "▾"}</span>
        </span>
      </button>

      {open && (
        <div className="grid gap-4 px-4 pb-4 lg:grid-cols-2">
          {/* History */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-ink">Recent orders</h4>
            {history.length === 0 ? <p className="text-sm text-muted">No orders on record in the demo data.</p> : (
              <ul className="space-y-1 text-sm">
                {history.map((o) => <li key={o.ref} className="flex justify-between"><span className="text-ink">{o.ref} <span className="text-muted">· {o.date}</span></span><span className="text-ink">{formatRand(o.totalCents)}</span></li>)}
              </ul>
            )}
          </div>

          {/* Trade terms */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-ink">Trade terms</h4>
            {c.type !== "Trade" && !terms ? (
              <button onClick={() => updateTerms(c.email, DEFAULT_TERMS)} className="rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-dark">Make trade account</button>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm"><span className="mb-1 block text-xs font-medium text-muted">Credit limit (R)</span>
                  <input type="number" value={((terms ?? DEFAULT_TERMS).creditLimitCents / 100).toString()} onChange={(e) => patchTerms({ creditLimitCents: Math.round((parseFloat(e.target.value) || 0) * 100) })} className="w-40 rounded-md border border-line px-2 py-1.5 text-sm" /></label>
                <label className="block text-sm"><span className="mb-1 block text-xs font-medium text-muted">Trade discount (%)</span>
                  <input type="number" value={(terms ?? DEFAULT_TERMS).discountPct.toString()} onChange={(e) => patchTerms({ discountPct: parseInt(e.target.value) || 0 })} className="w-24 rounded-md border border-line px-2 py-1.5 text-sm" /></label>
                <div className="text-sm">
                  <span className="mb-1 block text-xs font-medium text-muted">Authorised buyers</span>
                  <ul className="mb-1 flex flex-wrap gap-1">
                    {(terms ?? DEFAULT_TERMS).buyers.map((b) => (
                      <li key={b}><span className="inline-flex items-center gap-1 rounded-full bg-canvas px-2 py-0.5 text-xs">{b}<button onClick={() => patchTerms({ buyers: (terms ?? DEFAULT_TERMS).buyers.filter((x) => x !== b) })} className="text-muted hover:text-brand">×</button></span></li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <input value={buyer} onChange={(e) => setBuyer(e.target.value)} placeholder="Add a buyer" className="w-40 rounded-md border border-line px-2 py-1.5 text-sm" />
                    <button onClick={() => { if (buyer.trim()) { patchTerms({ buyers: [...(terms ?? DEFAULT_TERMS).buyers, buyer.trim()] }); setBuyer(""); } }} className="rounded-md border border-line px-3 text-sm hover:bg-canvas">Add</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminTrade() {
  const { apps, decideApp, customers } = useAdminData();

  return (
    <>
      <AdminHeading title="Trade & customers" subtitle="Approve trade applications, then set each account's terms." />

      <h2 className="mb-3 text-lg font-bold text-ink">Trade applications</h2>
      <div className="space-y-3">
        {apps.map((a) => (
          <Card key={a.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2"><span className="font-bold text-ink">{a.business}</span><Pill tone={appTone[a.status]}>{a.status}</Pill></div>
                <p className="text-sm text-muted">{a.contact} · {a.type} · {a.monthlySpend}/mo · {a.date}</p>
              </div>
              {a.status === "Pending" ? (
                <div className="flex gap-2">
                  <button onClick={() => decideApp(a.id, "Approved")} className="rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-dark">Approve</button>
                  <button onClick={() => decideApp(a.id, "Declined")} className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink hover:bg-canvas">Decline</button>
                </div>
              ) : (
                <p className="text-sm text-muted">{a.status === "Approved" ? "Account active ✓ — set terms below" : "Declined"}</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-lg font-bold text-ink">Customers</h2>
      <Card className="p-0">
        {customers.map((c) => <CustomerRow key={c.email} c={c} />)}
      </Card>
    </>
  );
}
