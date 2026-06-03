import type { Metadata } from "next";
import Link from "next/link";
import { searchProducts } from "@/lib/search";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES } from "@/lib/data";

export const metadata: Metadata = { title: "Search" };

type Search = { q?: string };

export default async function SearchPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const results = searchProducts(query);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-black text-ink">
        {query ? <>Results for &ldquo;{query}&rdquo;</> : "Search"}
      </h1>

      {/* No query yet */}
      {!query && (
        <div className="mt-6 rounded-xl border border-dashed border-line bg-surface p-10 text-center">
          <p className="text-muted">Search by product name, brand or product code. Or browse a category:</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium text-ink hover:border-brand/50">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {query && results.length === 0 && (
        <div className="mt-6 rounded-xl border border-dashed border-line bg-surface p-10 text-center">
          <p className="text-lg font-semibold text-ink">No matches for &ldquo;{query}&rdquo;</p>
          <p className="mt-1 text-sm text-muted">Check the spelling, try a brand name, or browse a category. You can also ask your store on WhatsApp.</p>
          <Link href="/" className="mt-4 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">Back to home</Link>
        </div>
      )}

      {/* Results */}
      {query && results.length > 0 && (
        <>
          <p className="mt-1 text-sm text-muted">{results.length} product{results.length === 1 ? "" : "s"} found</p>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {results.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
