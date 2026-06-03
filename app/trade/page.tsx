import type { Metadata } from "next";
import { TradeForm } from "@/components/trade-form";

export const metadata: Metadata = {
  title: "Trade accounts",
  description: "Open a Build It trade account for bulk pricing, buying on account and faster quotes.",
};

const BENEFITS = [
  { title: "Bulk & trade pricing", text: "Better prices on volume orders across building materials and tools." },
  { title: "Buy on account", text: "Approved 30-day terms so you can keep the job moving." },
  { title: "Fast quotes", text: "Priority quoting on bulk and heavy goods, delivered to site." },
  { title: "Multiple buyers", text: "Let your team order against one account with your approval." },
];

export default function TradePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <header className="rounded-2xl bg-charcoal p-8 text-white">
        <h1 className="text-3xl font-black">Build It Trade</h1>
        <p className="mt-2 max-w-xl text-white/80">
          Building for a living? A trade account gets you better pricing, account terms and quicker quotes — for DIY-sized jobs through to full sites.
        </p>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {BENEFITS.map((b) => (
          <div key={b.title} className="rounded-xl border border-line bg-surface p-5">
            <h2 className="font-bold text-brand-dark">{b.title}</h2>
            <p className="mt-1 text-sm text-ink/80">{b.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <TradeForm />
      </div>
    </div>
  );
}
