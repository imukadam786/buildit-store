"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { averageRating, STOREFRONT_STORE_ID } from "@/lib/data";
import { Price, ProductThumb, StarRating } from "./ui";
import { useCatalogue } from "./catalogue";

export function ProductCard({ product }: { product: Product }) {
  const { minPriceOf, inStockAt, imageOf } = useCatalogue();

  const from = minPriceOf(product.slug);
  const available = inStockAt(product.slug, STOREFRONT_STORE_ID);
  const multiVariant = product.variants.length > 1;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition hover:border-brand/40 hover:shadow-md"
    >
      <div className="relative">
        <ProductThumb swatch={product.swatch} src={imageOf(product.slug)} label={product.name} className="aspect-square w-full" />
        {!available && (
          <span className="absolute left-2 top-2 rounded bg-charcoal/80 px-2 py-0.5 text-xs font-semibold text-white">
            Out of stock
          </span>
        )}
        {product.bulk && (
          <span className="absolute right-2 top-2 rounded bg-accent px-2 py-0.5 text-xs font-semibold text-charcoal">
            Bulk · quote
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">{product.brand}</span>
        <h3 className="line-clamp-2 text-sm font-semibold text-ink group-hover:text-brand">{product.name}</h3>
        <div className="mt-auto pt-1">
          <StarRating value={averageRating(product)} count={product.reviews.length || undefined} />
          <div className="mt-1">
            {multiVariant && <span className="mr-1 text-xs text-muted">from</span>}
            <Price cents={from.priceCents} wasCents={from.wasCents} size="sm" />
          </div>
        </div>
      </div>
    </Link>
  );
}
