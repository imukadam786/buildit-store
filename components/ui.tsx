import { discountPct, formatRand } from "@/lib/money";
import { StarIcon } from "./icons";

/** VAT-inclusive price, with optional strikethrough was-price and a saving badge. */
export function Price({
  cents,
  wasCents = null,
  size = "md",
}: {
  cents: number;
  wasCents?: number | null;
  size?: "sm" | "md" | "lg";
}) {
  const pct = discountPct(cents, wasCents);
  const main = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  return (
    <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className={`font-bold text-brand ${main}`}>{formatRand(cents)}</span>
      {wasCents && wasCents > cents && (
        <span className="text-sm text-muted line-through">{formatRand(wasCents)}</span>
      )}
      {pct && (
        <span className="rounded bg-brand-tint px-1.5 py-0.5 text-xs font-semibold text-brand-dark">
          Save {pct}%
        </span>
      )}
    </span>
  );
}

export function StarRating({ value, count }: { value: number | null; count?: number }) {
  if (value === null) return <span className="text-xs text-muted">No reviews yet</span>;
  const rounded = Math.round(value);
  return (
    <span className="flex items-center gap-1" aria-label={`${value.toFixed(1)} out of 5`}>
      <span className="flex text-accent">
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon key={i} className="h-4 w-4" filled={i <= rounded} />
        ))}
      </span>
      {count !== undefined && <span className="text-xs text-muted">({count})</span>}
    </span>
  );
}

export function StockBadge({ stock, storeName }: { stock: number; storeName?: string }) {
  if (stock <= 0) {
    return <span className="text-sm font-medium text-muted">Out of stock</span>;
  }
  const low = stock <= 5;
  return (
    <span className={`text-sm font-medium ${low ? "text-warning" : "text-success"}`}>
      {low ? `Only ${stock} left` : "In stock"}
      {storeName ? ` at ${storeName}` : ""}
    </span>
  );
}

/**
 * Placeholder product image. Real imagery gets wired via the admin later; for
 * now we render a clean branded tile from the product's swatch colour so the
 * layout is honest about what's a placeholder.
 */
export function ProductThumb({
  swatch,
  label,
  src,
  className = "",
}: {
  swatch: string;
  label: string;
  src?: string;
  className?: string;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={label}
        loading="lazy"
        className={`bg-canvas object-cover ${className}`}
      />
    );
  }
  const initials = label
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div
      className={`flex items-center justify-center bg-canvas ${className}`}
      role="img"
      aria-label={label}
    >
      <div
        className="flex h-2/3 w-2/3 items-center justify-center rounded-lg text-2xl font-bold text-white/90 shadow-inner"
        style={{ backgroundColor: swatch }}
      >
        {initials}
      </div>
    </div>
  );
}
