import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy policy (POPIA)" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-black text-ink">Privacy policy</h1>
      <p className="mt-1 text-sm text-muted">In line with the Protection of Personal Information Act (POPIA).</p>

      <h2 className="mt-6 text-lg font-bold text-ink">What we collect</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/80">
        We collect the details you give us to process orders, quotes and deliveries — your name, contact details and delivery address — and basic information about how you use the site to help us improve it.
      </p>

      <h2 className="mt-6 text-lg font-bold text-ink">How we use it</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/80">
        To fulfil your orders and quotes, keep you updated, and (only if you opt in) send you specials. We don&apos;t sell your information.
      </p>

      <h2 className="mt-6 text-lg font-bold text-ink">Cookies</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/80">
        We use essential cookies to run the store (like your cart and selected store) and, with your consent, analytics cookies to understand usage. You can accept or decline non-essential cookies in the banner.
      </p>

      <h2 className="mt-6 text-lg font-bold text-ink">Your rights</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/80">
        You may ask to see, correct or delete the personal information we hold about you. Contact us and we&apos;ll help.
      </p>

      <p className="mt-6 text-xs text-muted">This is placeholder copy for the build and not legal advice — final wording should be reviewed before launch.</p>
    </div>
  );
}
