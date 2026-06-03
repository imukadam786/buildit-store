"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminHeading, Card } from "@/components/admin/ui";
import { useCatalogue } from "@/components/catalogue";
import { useStoreSelection } from "@/components/providers";

export default function AdminCatalogue() {
  const { products, priceOf, stockOf, setPrice, setStock, hero, setHero } = useCatalogue();
  const { store } = useStoreSelection();

  const [heroDraft, setHeroDraft] = useState(hero);
  const [heroSaved, setHeroSaved] = useState(false);

  const moneyInput = "w-28 rounded-md border border-line px-2 py-1.5 text-sm";
  const stockInput = "w-20 rounded-md border border-line px-2 py-1.5 text-sm";

  return (
    <>
      <AdminHeading title="Catalogue & stock" subtitle={`Editing stock for ${store.name}. Switch stores in the top bar.`} />

      <div className="mb-5 rounded-lg border border-brand/30 bg-brand-tint px-4 py-3 text-sm text-brand-dark">
        Edit a price, stock level or the homepage below, then <Link href="/" target="_blank" className="font-bold underline">open the storefront ↗</Link> — your changes show instantly.
      </div>

      {/* Homepage hero editor */}
      <Card className="mb-6">
        <h2 className="mb-3 font-bold text-ink">Homepage headline</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-muted">Title</span>
            <input value={heroDraft.title} onChange={(e) => { setHeroDraft({ ...heroDraft, title: e.target.value }); setHeroSaved(false); }} className="w-full rounded-md border border-line px-3 py-2 text-sm" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-muted">Subtitle</span>
            <input value={heroDraft.subtitle} onChange={(e) => { setHeroDraft({ ...heroDraft, subtitle: e.target.value }); setHeroSaved(false); }} className="w-full rounded-md border border-line px-3 py-2 text-sm" />
          </label>
        </div>
        <button
          onClick={() => { setHero(heroDraft); setHeroSaved(true); }}
          className="mt-3 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          {heroSaved ? "Saved ✓ — see it on the homepage" : "Publish headline"}
        </button>
      </Card>

      {/* Products */}
      <div className="space-y-4">
        {products.map((p) => (
          <Card key={p.slug}>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-ink">{p.name}</h3>
                <span className="text-xs text-muted">{p.brand} · {p.categorySlug}</span>
              </div>
              <Link href={`/product/${p.slug}`} target="_blank" className="text-sm font-semibold text-brand">View ↗</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[460px] text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-muted">
                    <th className="pb-2 font-medium">Variant</th>
                    <th className="pb-2 font-medium">Price (R)</th>
                    <th className="pb-2 font-medium">Was (R)</th>
                    <th className="pb-2 font-medium">Stock @ {store.name.replace("Build It ", "")}</th>
                  </tr>
                </thead>
                <tbody>
                  {p.variants.map((v) => {
                    const price = priceOf(p.slug, v.id);
                    const stock = stockOf(p.slug, v.id, store.id);
                    return (
                      <tr key={v.id} className="border-t border-line">
                        <td className="py-2 pr-3 text-ink">{v.label}<span className="block text-xs text-muted">{v.sku}</span></td>
                        <td className="py-2 pr-3">
                          <input type="number" step="0.01" min="0" value={(price.priceCents / 100).toString()} onChange={(e) => setPrice(p.slug, v.id, Math.round((parseFloat(e.target.value) || 0) * 100), price.wasCents)} className={moneyInput} />
                        </td>
                        <td className="py-2 pr-3">
                          <input type="number" step="0.01" min="0" value={price.wasCents ? (price.wasCents / 100).toString() : ""} placeholder="—" onChange={(e) => { const val = e.target.value.trim(); setPrice(p.slug, v.id, price.priceCents, val ? Math.round(parseFloat(val) * 100) : null); }} className={moneyInput} />
                        </td>
                        <td className="py-2">
                          <input type="number" min="0" value={stock.toString()} onChange={(e) => setStock(p.slug, v.id, store.id, parseInt(e.target.value) || 0)} className={stockInput} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
