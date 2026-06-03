import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS, averageRating, getCategory, getProduct, productsInCategory } from "@/lib/data";
import { BuyBox } from "@/components/buy-box";
import { ProductCard } from "@/components/product-card";
import { ProductThumb, StarRating } from "@/components/ui";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.summary };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.categorySlug);
  const related = productsInCategory(product.categorySlug).filter((p) => p.slug !== product.slug).slice(0, 4);
  const rating = averageRating(product);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2" aria-hidden>/</span>
        {category && (
          <>
            <Link href={`/category/${category.slug}`} className="hover:text-brand">{category.name}</Link>
            <span className="mx-2" aria-hidden>/</span>
          </>
        )}
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Gallery + details */}
        <div>
          <ProductThumb swatch={product.swatch} label={product.name} className="aspect-square w-full rounded-2xl border border-line" />

          <div className="mt-8">
            <h2 className="text-lg font-bold text-ink">Description</h2>
            {product.description.map((para, i) => (
              <p key={i} className="mt-2 text-sm leading-relaxed text-ink/80">{para}</p>
            ))}
          </div>

          {/* Specs */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-ink">Specifications</h2>
            <table className="mt-2 w-full text-sm">
              <tbody>
                {product.specs.map((s) => (
                  <tr key={s.label} className="border-b border-line">
                    <th scope="row" className="py-2 pr-4 text-left font-medium text-muted">{s.label}</th>
                    <td className="py-2 text-ink">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Documents */}
          {product.documents.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-ink">Downloads</h2>
              <ul className="mt-2 space-y-2">
                {product.documents.map((d) => (
                  <li key={d.label}>
                    <a href={d.href} className="text-sm font-medium text-brand hover:text-brand-dark">↓ {d.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reviews */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-ink">Reviews</h2>
            <div className="mt-2">
              <StarRating value={rating} count={product.reviews.length || undefined} />
            </div>
            {product.reviews.length === 0 ? (
              <p className="mt-2 text-sm text-muted">No reviews yet — be the first to review this product.</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {product.reviews.map((r, i) => (
                  <li key={i} className="rounded-lg border border-line bg-surface p-4">
                    <div className="flex items-center justify-between">
                      <StarRating value={r.rating} />
                      <span className="text-xs text-muted">{r.author}</span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-ink">{r.title}</p>
                    <p className="text-sm text-ink/80">{r.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Sticky buy box */}
        <div className="lg:sticky lg:top-40 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">{product.brand}</p>
          <h1 className="mt-1 text-2xl font-bold text-ink">{product.name}</h1>
          <p className="mt-1 text-sm text-muted">{product.summary}</p>
          <div className="mt-2">
            <StarRating value={rating} count={product.reviews.length || undefined} />
          </div>
          <div className="mt-4">
            <BuyBox product={product} />
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-ink">You might also need</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
