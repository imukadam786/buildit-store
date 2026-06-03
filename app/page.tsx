import Link from "next/link";
import { CATEGORIES, PRODUCTS } from "@/lib/data";
import { CategoryIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { TrustBar } from "@/components/trust-bar";
import { HomeHeroText } from "@/components/home-hero";

export default function HomePage() {
  const onSpecial = PRODUCTS.filter((p) => p.variants.some((v) => v.wasCents)).slice(0, 4);
  const featured = PRODUCTS.slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="bg-brand">
        <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 py-10 sm:py-14 lg:grid-cols-2">
          <div className="text-white">
            <HomeHeroText />
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/category/power-tools" className="rounded-lg bg-white px-5 py-3 text-sm font-bold text-brand hover:bg-white/90">
                Shop power tools
              </Link>
              <Link href="/calculators" className="rounded-lg border border-white/70 px-5 py-3 text-sm font-bold text-white hover:bg-white/10">
                Material calculators
              </Link>
            </div>
          </div>
          <div className="hidden justify-end lg:flex">
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.slice(0, 4).map((c) => (
                <Link key={c.slug} href={`/category/${c.slug}`} className="flex flex-col items-center gap-2 rounded-xl bg-white/10 p-5 text-white backdrop-blur transition hover:bg-white/20">
                  <CategoryIcon name={c.icon} className="h-9 w-9" />
                  <span className="text-sm font-semibold">{c.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-5 text-xl font-bold text-ink">Shop by category</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="group flex flex-col items-center gap-2 rounded-xl border border-line bg-surface p-4 text-center transition hover:border-brand/40 hover:shadow-md">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-tint text-brand transition group-hover:bg-brand group-hover:text-white">
                <CategoryIcon name={c.icon} className="h-7 w-7" />
              </span>
              <span className="text-sm font-semibold text-ink">{c.name}</span>
              <span className="text-xs text-muted">{c.blurb}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Specials */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-xl font-bold text-ink">This week&apos;s specials</h2>
            <Link href="/category/power-tools" className="text-sm font-semibold text-brand hover:text-brand-dark">View all →</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {onSpecial.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Calculators + Trade promos */}
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-10 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-2xl bg-charcoal p-6 text-white">
          <div>
            <h3 className="text-lg font-bold">Not sure how much you need?</h3>
            <p className="mt-2 text-sm text-white/80">Work out paint, tiles, bricks and concrete in seconds — then add the lot to your cart.</p>
          </div>
          <Link href="/calculators" className="mt-4 inline-block w-fit rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-charcoal hover:bg-white/90">Open calculators</Link>
        </div>
        <div className="flex flex-col justify-between rounded-2xl border-2 border-brand bg-brand-tint p-6">
          <div>
            <h3 className="text-lg font-bold text-brand-dark">Building for a living?</h3>
            <p className="mt-2 text-sm text-ink/80">Open a trade account for bulk pricing, quotes and buying on account.</p>
          </div>
          <Link href="/trade" className="mt-4 inline-block w-fit rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark">Apply for a trade account</Link>
        </div>
      </section>

      {/* Featured grid */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="mb-5 text-xl font-bold text-ink">Popular right now</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
