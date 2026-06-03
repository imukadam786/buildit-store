"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AdminHeading, Card, Pill } from "@/components/admin/ui";
import { useCatalogue, type LiveProduct, type LiveVariant } from "@/components/catalogue";
import { useStoreSelection } from "@/components/providers";
import { CATEGORIES, STORES } from "@/lib/data";

function scheduleStatus(p: LiveProduct): { label: string; tone: "green" | "amber" | "grey" } {
  if (!p.special || (!p.special.start && !p.special.end)) return { label: "No schedule", tone: "grey" };
  const t = new Date().toISOString().slice(0, 10);
  if (p.special.start && t < p.special.start) return { label: "Scheduled", tone: "amber" };
  if (p.special.end && t > p.special.end) return { label: "Ended", tone: "grey" };
  return { label: "Active", tone: "green" };
}

export default function AdminCatalogue() {
  const cat = useCatalogue();
  const { products, stockOf, setPrice, setStock, setSchedule, addProduct, updateProduct, deleteProduct, addVariant, removeVariant, importProducts, hero, setHero } = cat;
  const { store } = useStoreSelection();
  const fileRef = useRef<HTMLInputElement>(null);

  const [heroDraft, setHeroDraft] = useState(hero);
  const [heroSaved, setHeroSaved] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: "", brand: "", category: "power-tools", price: "", stock: "" });

  const money = "w-24 rounded-md border border-line px-2 py-1.5 text-sm";
  const stockI = "w-20 rounded-md border border-line px-2 py-1.5 text-sm";
  const text = "w-full rounded-md border border-line px-2 py-1.5 text-sm";

  function variantPatch(p: LiveProduct, vid: string, patch: Partial<LiveVariant>) {
    updateProduct(p.slug, { variants: p.variants.map((v) => (v.id === vid ? { ...v, ...patch } : v)) });
  }

  function exportCsv() {
    const rows = [["slug", "name", "brand", "category", "variant", "sku", "price", "was", "stock_strand", "stock_stellenbosch"]];
    products.forEach((p) => p.variants.forEach((v) => rows.push([p.slug, p.name, p.brand, p.categorySlug, v.label, v.sku, String(v.priceCents / 100), v.wasCents ? String(v.wasCents / 100) : "", String(v.stockByStore.strand ?? 0), String(v.stockByStore.stellenbosch ?? 0)])));
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = "buildit-catalogue.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  function uploadImage(slug: string, file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const max = 700;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) { ctx.drawImage(img, 0, 0, w, h); updateProduct(slug, { image: canvas.toDataURL("image/jpeg", 0.82) }); }
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function importCsv(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const lines = String(reader.result).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      const rows: LiveProduct[] = [];
      for (const line of lines) {
        const [name, brand, category, price, stock] = line.split(",").map((s) => s.replace(/^"|"$/g, "").trim());
        if (!name || name.toLowerCase() === "name") continue;
        const priceCents = Math.round((parseFloat(price) || 0) * 100);
        const stk = parseInt(stock) || 0;
        rows.push({
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).slice(2, 6),
          name, brand: brand || "—", categorySlug: CATEGORIES.some((c) => c.slug === category) ? category : "power-tools",
          summary: "", description: [], variantLabel: "Option", specs: [], documents: [], bulk: false, image: "", swatch: "#e2231a", special: null,
          variants: [{ id: "std", label: "Standard", sku: "IMP-" + Math.random().toString(36).slice(2, 6).toUpperCase(), priceCents, wasCents: null, stockByStore: { strand: stk, stellenbosch: stk } }],
        });
      }
      const n = importProducts(rows);
      window.alert(`Imported ${n} product${n === 1 ? "" : "s"}.`);
    };
    reader.readAsText(file);
  }

  return (
    <>
      <AdminHeading title="Catalogue & stock" subtitle={`Editing stock for ${store.name}. Switch stores in the top bar.`} />

      <div className="mb-5 rounded-lg border border-brand/30 bg-brand-tint px-4 py-3 text-sm text-brand-dark">
        Edit a price, stock level or the homepage below, then <Link href="/" target="_blank" className="font-bold underline">open the storefront ↗</Link> — your changes show instantly.
      </div>

      {/* Homepage hero */}
      <Card className="mb-6">
        <h2 className="mb-3 font-bold text-ink">Homepage headline</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm"><span className="mb-1 block font-medium text-muted">Title</span>
            <input value={heroDraft.title} onChange={(e) => { setHeroDraft({ ...heroDraft, title: e.target.value }); setHeroSaved(false); }} className={text} /></label>
          <label className="block text-sm"><span className="mb-1 block font-medium text-muted">Subtitle</span>
            <input value={heroDraft.subtitle} onChange={(e) => { setHeroDraft({ ...heroDraft, subtitle: e.target.value }); setHeroSaved(false); }} className={text} /></label>
        </div>
        <button onClick={() => { setHero(heroDraft); setHeroSaved(true); }} className="mt-3 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">{heroSaved ? "Saved ✓ — see it on the homepage" : "Publish headline"}</button>
      </Card>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button onClick={() => setAdding((a) => !a)} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">+ Add product</button>
        <button onClick={exportCsv} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-canvas">Export CSV</button>
        <button onClick={() => fileRef.current?.click()} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-canvas">Import CSV</button>
        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) importCsv(f); e.target.value = ""; }} />
        <span className="text-xs text-muted">Import columns: name, brand, category, price, stock</span>
      </div>

      {/* Add product form */}
      {adding && (
        <Card className="mb-4">
          <h2 className="mb-3 font-bold text-ink">New product</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input placeholder="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={text} />
            <input placeholder="Brand" value={draft.brand} onChange={(e) => setDraft({ ...draft, brand: e.target.value })} className={text} />
            <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className={text}>{CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
            <input placeholder="Price (R)" type="number" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} className={text} />
            <input placeholder="Stock" type="number" value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: e.target.value })} className={text} />
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => {
                if (!draft.name) return;
                const priceCents = Math.round((parseFloat(draft.price) || 0) * 100);
                const stk = parseInt(draft.stock) || 0;
                addProduct({ name: draft.name, brand: draft.brand || "—", categorySlug: draft.category, variants: [{ id: "std", label: "Standard", sku: "NEW-" + Date.now().toString(36).slice(-4).toUpperCase(), priceCents, wasCents: null, stockByStore: { strand: stk, stellenbosch: stk } }] });
                setDraft({ name: "", brand: "", category: "power-tools", price: "", stock: "" });
                setAdding(false);
              }}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">Add product</button>
            <button onClick={() => setAdding(false)} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-canvas">Cancel</button>
          </div>
        </Card>
      )}

      {/* Products */}
      <div className="space-y-4">
        {products.map((p) => {
          const ss = scheduleStatus(p);
          return (
            <Card key={p.slug}>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-ink">{p.name}</h3>
                    {p.bulk && <Pill tone="amber">Bulk · quote</Pill>}
                  </div>
                  <span className="text-xs text-muted">{p.brand} · {p.categorySlug}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Link href={`/product/${p.slug}`} target="_blank" className="font-semibold text-brand">View ↗</Link>
                  <button onClick={() => setOpen((o) => ({ ...o, [p.slug]: !o[p.slug] }))} className="font-semibold text-ink hover:text-brand">{open[p.slug] ? "Close" : "Edit details"}</button>
                  <button onClick={() => { if (window.confirm(`Delete ${p.name}?`)) deleteProduct(p.slug); }} className="font-semibold text-muted hover:text-brand">Delete</button>
                </div>
              </div>

              {/* Variants */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead><tr className="text-left text-xs uppercase tracking-wide text-muted">
                    <th className="pb-2 font-medium">Variant</th><th className="pb-2 font-medium">SKU</th><th className="pb-2 font-medium">Price (R)</th><th className="pb-2 font-medium">Was (R)</th><th className="pb-2 font-medium">Stock @ {store.name.replace("Build It ", "")}</th><th></th>
                  </tr></thead>
                  <tbody>
                    {p.variants.map((v) => {
                      return (
                        <tr key={v.id} className="border-t border-line">
                          <td className="py-2 pr-3"><input value={v.label} onChange={(e) => variantPatch(p, v.id, { label: e.target.value })} className={`${text} w-36`} /></td>
                          <td className="py-2 pr-3"><input value={v.sku} onChange={(e) => variantPatch(p, v.id, { sku: e.target.value })} className={`${text} w-28`} /></td>
                          <td className="py-2 pr-3"><input type="number" step="0.01" min="0" value={(v.priceCents / 100).toString()} onChange={(e) => setPrice(p.slug, v.id, Math.round((parseFloat(e.target.value) || 0) * 100), v.wasCents)} className={money} /></td>
                          <td className="py-2 pr-3"><input type="number" step="0.01" min="0" placeholder="—" value={v.wasCents ? (v.wasCents / 100).toString() : ""} onChange={(e) => { const val = e.target.value.trim(); setPrice(p.slug, v.id, v.priceCents, val ? Math.round(parseFloat(val) * 100) : null); }} className={money} /></td>
                          <td className="py-2 pr-3"><input type="number" min="0" value={(stockOf(p.slug, v.id, store.id)).toString()} onChange={(e) => setStock(p.slug, v.id, store.id, parseInt(e.target.value) || 0)} className={stockI} /></td>
                          <td className="py-2 text-right">{p.variants.length > 1 && <button onClick={() => removeVariant(p.slug, v.id)} className="text-muted hover:text-brand" aria-label="Remove variant">×</button>}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <button onClick={() => addVariant(p.slug)} className="mt-2 text-sm font-medium text-brand hover:text-brand-dark">+ Add variant</button>

              {/* Special schedule */}
              <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-line pt-3">
                <div>
                  <span className="mb-1 block text-xs font-medium text-muted">Special starts</span>
                  <input type="date" value={p.special?.start ?? ""} onChange={(e) => setSchedule(p.slug, { start: e.target.value, end: p.special?.end ?? "" })} className={text} />
                </div>
                <div>
                  <span className="mb-1 block text-xs font-medium text-muted">Special ends</span>
                  <input type="date" value={p.special?.end ?? ""} onChange={(e) => setSchedule(p.slug, { start: p.special?.start ?? "", end: e.target.value })} className={text} />
                </div>
                <Pill tone={ss.tone}>{ss.label}</Pill>
                {p.special && <button onClick={() => setSchedule(p.slug, null)} className="text-xs font-medium text-muted hover:text-brand">Clear schedule</button>}
              </div>

              {/* Edit details */}
              {open[p.slug] && (
                <div className="mt-4 space-y-3 border-t border-line pt-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block text-sm"><span className="mb-1 block font-medium text-muted">Name</span><input value={p.name} onChange={(e) => updateProduct(p.slug, { name: e.target.value })} className={text} /></label>
                    <label className="block text-sm"><span className="mb-1 block font-medium text-muted">Brand</span><input value={p.brand} onChange={(e) => updateProduct(p.slug, { brand: e.target.value })} className={text} /></label>
                    <label className="block text-sm"><span className="mb-1 block font-medium text-muted">Category</span>
                      <select value={p.categorySlug} onChange={(e) => updateProduct(p.slug, { categorySlug: e.target.value })} className={text}>{CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label>
                    <label className="block text-sm"><span className="mb-1 block font-medium text-muted">Image URL</span>
                      <input value={p.image ?? ""} onChange={(e) => updateProduct(p.slug, { image: e.target.value })} placeholder="https://… or upload below" className={text} /></label>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {p.image && <img src={p.image} alt="" className="h-16 w-16 rounded-lg border border-line object-cover" />}
                    <label className="text-sm">
                      <span className="mb-1 block font-medium text-muted">Upload photo</span>
                      <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(p.slug, f); e.target.value = ""; }} className="text-xs" />
                    </label>
                    {p.image && <button onClick={() => updateProduct(p.slug, { image: "" })} className="text-xs font-medium text-muted hover:text-brand">Remove image</button>}
                    <label className="text-sm"><span className="mb-1 block font-medium text-muted">Fallback colour</span>
                      <input type="color" value={p.swatch} onChange={(e) => updateProduct(p.slug, { swatch: e.target.value })} className="h-9 w-16 rounded border border-line" /></label>
                  </div>
                  <label className="block text-sm"><span className="mb-1 block font-medium text-muted">Summary</span><input value={p.summary} onChange={(e) => updateProduct(p.slug, { summary: e.target.value })} className={text} /></label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={p.bulk} onChange={(e) => updateProduct(p.slug, { bulk: e.target.checked })} className="accent-brand" /> Bulk / quote-only item</label>
                  {/* Specs */}
                  <div>
                    <span className="mb-1 block text-sm font-medium text-muted">Specifications</span>
                    {p.specs.map((s, i) => (
                      <div key={i} className="mb-1 flex gap-2">
                        <input value={s.label} onChange={(e) => updateProduct(p.slug, { specs: p.specs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} placeholder="Label" className={`${text} w-1/3`} />
                        <input value={s.value} onChange={(e) => updateProduct(p.slug, { specs: p.specs.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) })} placeholder="Value" className={text} />
                        <button onClick={() => updateProduct(p.slug, { specs: p.specs.filter((_, j) => j !== i) })} className="px-2 text-muted hover:text-brand">×</button>
                      </div>
                    ))}
                    <button onClick={() => updateProduct(p.slug, { specs: [...p.specs, { label: "", value: "" }] })} className="text-sm font-medium text-brand hover:text-brand-dark">+ Add spec</button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}
