import Link from "next/link";
import { CATEGORIES } from "@/lib/data";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <p className="text-sm font-bold uppercase tracking-wide text-brand">Page not found</p>
      <h1 className="mt-2 text-3xl font-black text-ink">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-muted">
        It may have moved, or it&apos;s part of the store we&apos;re still building. Try one of these instead:
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href="/" className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">Home</Link>
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`} className="rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink hover:border-brand/50">
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
