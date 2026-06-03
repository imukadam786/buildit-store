"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { fromPriceCents, inStock } from "@/lib/data";
import { ProductCard } from "./product-card";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

export function CategoryBrowser({ products }: { products: Product[] }) {
  const allBrands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(),
    [products],
  );
  const maxPrice = useMemo(
    () => Math.max(...products.map((p) => fromPriceCents(p))),
    [products],
  );

  const [brands, setBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceCap, setPriceCap] = useState(maxPrice);
  const [sort, setSort] = useState<SortKey>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const visible = useMemo(() => {
    let list = products.filter((p) => {
      if (brands.length && !brands.includes(p.brand)) return false;
      if (inStockOnly && !inStock(p)) return false;
      if (fromPriceCents(p) > priceCap) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc": return fromPriceCents(a) - fromPriceCents(b);
        case "price-desc": return fromPriceCents(b) - fromPriceCents(a);
        case "name": return a.name.localeCompare(b.name);
        default: return 0;
      }
    });
    return list;
  }, [products, brands, inStockOnly, priceCap, sort]);

  function toggleBrand(b: string) {
    setBrands((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));
  }
  function reset() {
    setBrands([]);
    setInStockOnly(false);
    setPriceCap(maxPrice);
  }

  const filters = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">Brand</h3>
        <ul className="space-y-1.5">
          {allBrands.map((b) => (
            <li key={b}>
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={brands.includes(b)} onChange={() => toggleBrand(b)} className="accent-brand" />
                {b}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">Max price</h3>
        <input
          type="range"
          min={0}
          max={maxPrice}
          step={1000}
          value={priceCap}
          onChange={(e) => setPriceCap(Number(e.target.value))}
          className="w-full accent-brand"
          aria-label="Maximum price"
        />
        <p className="mt-1 text-sm text-muted">Up to R {Math.round(priceCap / 100).toLocaleString("en-ZA")}</p>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">Availability</h3>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="accent-brand" />
          In stock only
        </label>
      </div>

      <button onClick={reset} className="text-sm font-medium text-brand hover:text-brand-dark">Clear filters</button>
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-8">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">{filters}</aside>

      <div>
        {/* Toolbar */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <button onClick={() => setFiltersOpen((o) => !o)} className="rounded-md border border-line px-3 py-2 text-sm font-medium lg:hidden">
            Filters
          </button>
          <p className="text-sm text-muted">{visible.length} product{visible.length === 1 ? "" : "s"}</p>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="rounded-md border border-line bg-surface px-2 py-1.5 text-sm">
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
        </div>

        {/* Mobile filters */}
        {filtersOpen && (
          <div className="mb-4 rounded-lg border border-line bg-surface p-4 lg:hidden">{filters}</div>
        )}

        {visible.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center">
            <p className="text-lg font-semibold text-ink">Nothing matches those filters</p>
            <p className="mt-1 text-sm text-muted">Try widening your price range or clearing a filter.</p>
            <button onClick={reset} className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {visible.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
