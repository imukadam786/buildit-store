import Link from "next/link";
import { CATEGORIES } from "@/lib/data";

// Dark charcoal footer with white text — deliberately not red-on-red, to fix
// the contrast problem on the reference sites.
export function Footer() {
  return (
    <footer className="mt-auto bg-charcoal text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="inline-block rounded bg-brand px-2 py-1 text-lg font-black italic text-white">Build it</span>
          <p className="mt-3 text-sm text-white/70">
            Your local building, hardware and home-improvement store. Shop online, collect in-store or get it delivered to site.
          </p>
        </div>

        <nav aria-label="Shop">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/90">Shop</h2>
          <ul className="space-y-2 text-sm text-white/70">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:text-white">{c.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Help">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/90">Help</h2>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/stores" className="hover:text-white">Our stores</Link></li>
            <li><Link href="/delivery" className="hover:text-white">Delivery &amp; collect</Link></li>
            <li><Link href="/returns" className="hover:text-white">Returns &amp; warranty</Link></li>
            <li><Link href="/trade" className="hover:text-white">Trade accounts</Link></li>
            <li><Link href="/calculators" className="hover:text-white">Material calculators</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact us</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/90">Stay in the loop</h2>
          <p className="mb-3 text-sm text-white/70">Get our latest specials by email.</p>
          <form className="flex gap-2" aria-label="Newsletter sign-up">
            <input type="email" required placeholder="Your email" className="w-full rounded-md px-3 py-2 text-sm text-ink" aria-label="Email address" />
            <button type="submit" className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">Sign up</button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Build It franchise. Prices include VAT. E&amp;OE.</p>
          <nav aria-label="Legal" className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy (POPIA)</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/returns" className="hover:text-white">Refund policy</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
