import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms & conditions" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-black text-ink">Terms &amp; conditions</h1>

      <h2 className="mt-6 text-lg font-bold text-ink">Pricing</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/80">
        All prices are in South African Rand and include VAT. We try to keep prices and stock accurate, but errors and omissions are excepted (E&amp;OE), and specials run while stocks last.
      </p>

      <h2 className="mt-6 text-lg font-bold text-ink">Orders &amp; payment</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/80">
        An order is confirmed once payment is received. We may cancel and refund an order if an item is unexpectedly out of stock or incorrectly priced, and we&apos;ll let you know if that happens.
      </p>

      <h2 className="mt-6 text-lg font-bold text-ink">Quotes</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/80">
        Quotes for bulk and heavy goods are valid for the period stated on the quote and are subject to stock and delivery confirmation.
      </p>

      <h2 className="mt-6 text-lg font-bold text-ink">Trade accounts</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/80">
        Trade accounts and any credit terms are subject to application and approval, and to the separate trade-account agreement.
      </p>

      <p className="mt-6 text-xs text-muted">Placeholder copy for the build — final terms should be reviewed before launch.</p>
    </div>
  );
}
