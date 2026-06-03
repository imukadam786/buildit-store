import type { Metadata } from "next";
import { getProduct } from "@/lib/data";
import { QuoteForm } from "@/components/quote-form";

export const metadata: Metadata = {
  title: "Request a quote",
  description: "Get a price and delivery quote for bulk and heavy building materials.",
};

type Search = { product?: string; from?: string };

export default async function QuotePage({ searchParams }: { searchParams: Promise<Search> }) {
  const { product, from } = await searchParams;
  const seed = product ? getProduct(product) : undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-black text-ink">Request a quote</h1>
      <p className="mt-2 text-muted">
        For bulk orders and heavy goods, tell us what you need and your delivery area — your store will come back with a price and delivery options.
      </p>
      <div className="mt-6">
        <QuoteForm
          fromCart={from === "cart"}
          seedProduct={seed ? { slug: seed.slug, name: seed.name } : null}
        />
      </div>
    </div>
  );
}
