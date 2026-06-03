import type { Metadata } from "next";

export const metadata: Metadata = { title: "Delivery & collect", description: "How delivery and click & collect work at Build It." };

export default function DeliveryPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-black text-ink">Delivery &amp; collect</h1>

      <h2 className="mt-6 text-lg font-bold text-ink">Click &amp; collect</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/80">
        Order online and collect at your selected store — usually ready the same day. We&apos;ll let you know by email when your order is ready, and you just bring your order reference.
      </p>

      <h2 className="mt-6 text-lg font-bold text-ink">Local delivery</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/80">
        We deliver in the areas around each store. Delivery is free on qualifying orders over R2 000; otherwise a local delivery fee from R150 applies, shown to you at checkout before you pay.
      </p>

      <h2 className="mt-6 text-lg font-bold text-ink">Heavy &amp; bulk goods</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/80">
        Cement, bricks, sand and other bulk or heavy items are delivered to site by truck. Because cost depends on quantity and distance, these are priced per order — <strong>request a quote</strong> and your store will confirm the price and a delivery slot.
      </p>

      <h2 className="mt-6 text-lg font-bold text-ink">Tracking</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/80">
        You&apos;ll get email updates as your order moves from received to ready or out for delivery. Trade-account orders and quotes are tracked in your account.
      </p>
    </div>
  );
}
