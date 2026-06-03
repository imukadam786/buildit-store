"use client";

import { useState } from "react";
import { AdminHeading, Card, Pill } from "@/components/admin/ui";
import { AUDIENCES, CAMPAIGNS, COUPON_LIST } from "@/lib/admin";

export default function AdminMarketing() {
  const [campaigns, setCampaigns] = useState(CAMPAIGNS);
  const [name, setName] = useState("");
  const [audienceId, setAudienceId] = useState(AUDIENCES[0].id);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [preview, setPreview] = useState(false);
  const [sent, setSent] = useState<{ name: string; recipients: number } | null>(null);

  const audience = AUDIENCES.find((a) => a.id === audienceId)!;
  const ready = name && subject && body;

  function send() {
    setCampaigns((prev) => [{ name, audience: audience.label, recipients: audience.size, date: "Just now", opens: 0, clicks: 0, status: "Sent" }, ...prev]);
    setSent({ name, recipients: audience.size });
    setName(""); setSubject(""); setBody(""); setPreview(false);
  }

  return (
    <>
      <AdminHeading title="Marketing" subtitle="Send email campaigns to your customers, and manage discount codes." />

      {sent && (
        <div className="mb-5 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          ✓ &ldquo;{sent.name}&rdquo; sent to {sent.recipients.toLocaleString("en-ZA")} people. (Simulated — no real emails go out in the demo.)
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Builder */}
        <Card>
          <h2 className="mb-3 font-bold text-ink">New email campaign</h2>
          <div className="space-y-3">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-muted">Campaign name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. June Power Tool Specials" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-muted">Audience</span>
              <select value={audienceId} onChange={(e) => setAudienceId(e.target.value)} className="w-full rounded-lg border border-line px-3 py-2 text-sm">
                {AUDIENCES.map((a) => <option key={a.id} value={a.id}>{a.label} ({a.size.toLocaleString("en-ZA")})</option>)}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-muted">Subject line</span>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Save big on power tools this month" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-muted">Message</span>
              <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder="Write your specials message…" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={() => setPreview((p) => !p)} disabled={!ready} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-canvas disabled:opacity-50">{preview ? "Hide preview" : "Preview"}</button>
            <button onClick={send} disabled={!ready} className="rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark disabled:bg-muted">Send to {audience.size.toLocaleString("en-ZA")}</button>
          </div>
        </Card>

        {/* Preview */}
        <Card>
          <h2 className="mb-3 font-bold text-ink">Preview</h2>
          {preview && ready ? (
            <div className="overflow-hidden rounded-lg border border-line">
              <div className="bg-brand px-4 py-3"><span className="inline-block rounded bg-white px-2 py-0.5 text-sm font-black italic text-brand">Build it</span></div>
              <div className="p-4">
                <p className="text-xs text-muted">To: {audience.label}</p>
                <p className="mt-1 text-base font-bold text-ink">{subject}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-ink/80">{body}</p>
                <span className="mt-4 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Shop now</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted">Fill in the campaign and hit Preview to see the email your customers will get.</p>
          )}
        </Card>
      </div>

      {/* Past campaigns */}
      <h2 className="mb-3 mt-8 text-lg font-bold text-ink">Campaigns</h2>
      <Card className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-medium">Campaign</th><th className="px-4 py-3 font-medium">Audience</th><th className="px-4 py-3 font-medium">Sent to</th><th className="px-4 py-3 font-medium">Opens</th><th className="px-4 py-3 font-medium">Clicks</th><th className="px-4 py-3 font-medium">Status</th>
          </tr></thead>
          <tbody>
            {campaigns.map((c, i) => (
              <tr key={i} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                <td className="px-4 py-3 text-muted">{c.audience}</td>
                <td className="px-4 py-3 text-ink">{c.recipients ? c.recipients.toLocaleString("en-ZA") : "—"}</td>
                <td className="px-4 py-3 text-ink">{c.status === "Sent" ? `${c.opens}%` : "—"}</td>
                <td className="px-4 py-3 text-ink">{c.status === "Sent" ? `${c.clicks}%` : "—"}</td>
                <td className="px-4 py-3"><Pill tone={c.status === "Sent" ? "green" : "grey"}>{c.status}</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Coupons */}
      <h2 className="mb-3 mt-8 text-lg font-bold text-ink">Discount codes</h2>
      <Card className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-medium">Code</th><th className="px-4 py-3 font-medium">Description</th><th className="px-4 py-3 font-medium">Used</th><th className="px-4 py-3 font-medium">Status</th>
          </tr></thead>
          <tbody>
            {COUPON_LIST.map((c) => (
              <tr key={c.code} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-mono font-semibold text-ink">{c.code}</td>
                <td className="px-4 py-3 text-muted">{c.description}</td>
                <td className="px-4 py-3 text-ink">{c.used}</td>
                <td className="px-4 py-3"><Pill tone={c.status === "Active" ? "green" : c.status === "Scheduled" ? "amber" : "grey"}>{c.status}</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
