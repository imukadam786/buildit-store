import type { Metadata } from "next";
import { STOREFRONT_STORE_ID, getStore } from "@/lib/data";
import { WhatsAppIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Our store", description: "Find our Build It store, hours and contact details." };

export default function StoresPage() {
  const stores = [getStore(STOREFRONT_STORE_ID)];
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-black text-ink">Our store</h1>
      <p className="mt-2 text-muted">Visit us, collect your online order, or chat to us on WhatsApp.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {stores.map((s) => (
          <div key={s.id} className="overflow-hidden rounded-2xl border border-line bg-surface">
            {/* Map placeholder */}
            <div className="flex h-32 items-center justify-center bg-canvas text-sm text-muted" role="img" aria-label={`Map of ${s.name}`}>
              Map — {s.area}
            </div>
            <div className="p-5">
              <h2 className="text-lg font-bold text-ink">{s.name}</h2>
              <p className="text-sm text-muted">{s.area}</p>
              <dl className="mt-3 space-y-1 text-sm">
                <div className="flex gap-2"><dt className="w-16 text-muted">Hours</dt><dd className="text-ink">{s.hours}</dd></div>
                <div className="flex gap-2"><dt className="w-16 text-muted">Phone</dt><dd className="text-ink">{s.phone}</dd></div>
              </dl>
              <a
                href={`https://wa.me/${s.whatsapp}`}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp this store
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
