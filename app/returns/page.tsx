import type { Metadata } from "next";

export const metadata: Metadata = { title: "Returns & warranty", description: "Our returns policy and product warranties." };

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-black text-ink">Returns &amp; warranty</h1>

      <h2 className="mt-6 text-lg font-bold text-ink">Changed your mind?</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/80">
        Unused goods in their original packaging can be returned within 30 days with your proof of purchase for an exchange or refund. Some items — like cut-to-size goods, mixed paint and bulk materials — can&apos;t be returned for hygiene or safety reasons.
      </p>

      <h2 className="mt-6 text-lg font-bold text-ink">Faulty goods</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/80">
        Your rights under the Consumer Protection Act apply. If something is defective, bring it back with your proof of purchase and we&apos;ll repair, replace or refund it in line with the Act and the manufacturer&apos;s warranty.
      </p>

      <h2 className="mt-6 text-lg font-bold text-ink">Manufacturer warranties</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/80">
        Many products carry a manufacturer&apos;s guarantee (shown on the product page where applicable). Keep your invoice — you&apos;ll need it to claim.
      </p>

      <p className="mt-6 text-sm text-muted">Need a hand with a return? <a href="/contact" className="font-semibold text-brand">Contact your store</a>.</p>
    </div>
  );
}
