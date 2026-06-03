"use client";

import { ProductThumb } from "./ui";
import { useCatalogue } from "./catalogue";

// Reads the live image from the catalogue so admin edits show on the storefront.
export function ProductGallery({ slug, swatch, label }: { slug: string; swatch: string; label: string }) {
  const { imageOf } = useCatalogue();
  return (
    <ProductThumb swatch={swatch} src={imageOf(slug)} label={label} className="aspect-square w-full rounded-2xl border border-line" />
  );
}
