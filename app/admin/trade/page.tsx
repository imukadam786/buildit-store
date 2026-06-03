"use client";

import { useState } from "react";
import { AdminHeading, Card, Pill } from "@/components/admin/ui";
import { formatRand } from "@/lib/money";
import { CUSTOMERS, TRADE_APPLICATIONS, type ApplicationStatus } from "@/lib/admin";

const tone: Record<ApplicationStatus, "amber" | "green" | "grey"> = { Pending: "amber", Approved: "green", Declined: "grey" };

export default function AdminTrade() {
  const [apps, setApps] = useState(TRADE_APPLICATIONS);

  function decide(id: string, status: ApplicationStatus) {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  return (
    <>
      <AdminHeading title="Trade & customers" subtitle="Approve trade-account applications and view your customers." />

      <h2 className="mb-3 text-lg font-bold text-ink">Trade applications</h2>
      <div className="space-y-3">
        {apps.map((a) => (
          <Card key={a.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-ink">{a.business}</span>
                  <Pill tone={tone[a.status]}>{a.status}</Pill>
                </div>
                <p className="text-sm text-muted">{a.contact} · {a.type} · {a.monthlySpend}/mo · {a.date}</p>
              </div>
              {a.status === "Pending" ? (
                <div className="flex gap-2">
                  <button onClick={() => decide(a.id, "Approved")} className="rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-dark">Approve</button>
                  <button onClick={() => decide(a.id, "Declined")} className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink hover:bg-canvas">Decline</button>
                </div>
              ) : (
                <p className="text-sm text-muted">{a.status === "Approved" ? "Account active ✓" : "Declined"}</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-lg font-bold text-ink">Customers</h2>
      <Card className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-medium">Customer</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Orders</th><th className="px-4 py-3 font-medium">Spent</th>
          </tr></thead>
          <tbody>
            {CUSTOMERS.map((c) => (
              <tr key={c.email} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{c.name}<span className="block text-xs text-muted">{c.email}</span></td>
                <td className="px-4 py-3"><Pill tone={c.type === "Trade" ? "blue" : "grey"}>{c.type}</Pill></td>
                <td className="px-4 py-3 text-ink">{c.orders}</td>
                <td className="px-4 py-3 text-ink">{formatRand(c.spentCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
