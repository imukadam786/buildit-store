import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategory, productsInCategory } from "@/lib/data";
import { CategoryIcon } from "@/components/icons";
import { CategoryBrowser } from "@/components/category-browser";

type Params = { slug: string };

// Pre-render the known category routes.
export function generateStaticParams(): Params[] {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

// Next 16: params is async and must be awaited.
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Category not found" };
  return { title: category.name, description: category.blurb };
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const products = productsInCategory(slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2" aria-hidden>/</span>
        <span className="text-ink">{category.name}</span>
      </nav>

      {/* Banner */}
      <header className="mb-6 flex items-center gap-4 rounded-2xl bg-charcoal p-6 text-white">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
          <CategoryIcon name={category.icon} className="h-8 w-8" />
        </span>
        <div>
          <h1 className="text-2xl font-bold">{category.name}</h1>
          <p className="text-sm text-white/70">{category.blurb}</p>
        </div>
      </header>

      {products.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-surface p-10 text-center text-muted">
          No products in this category yet.
        </p>
      ) : (
        <CategoryBrowser products={products} />
      )}
    </div>
  );
}
