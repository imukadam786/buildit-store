import type { Metadata } from "next";
import Link from "next/link";
import { STORES } from "@/lib/data";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = { title: "Contact us" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-black text-ink">Contact us</h1>
      <p className="mt-2 text-muted">Send us a message, or reach your nearest store directly.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {STORES.map((s) => (
          <div key={s.id} className="rounded-xl border border-line bg-surface p-4 text-sm">
            <p className="font-semibold text-ink">{s.name}</p>
            <p className="text-muted">{s.area}</p>
            <p className="mt-1 text-ink">{s.phone}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted">See full hours and maps on our <Link href="/stores" className="font-semibold text-brand">stores page</Link>.</p>

      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
