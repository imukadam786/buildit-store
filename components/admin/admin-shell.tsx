"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCatalogue } from "@/components/catalogue";
import { useStoreSelection } from "@/components/providers";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/catalogue", label: "Catalogue & stock" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/quotes", label: "Quotes" },
  { href: "/admin/marketing", label: "Marketing" },
  { href: "/admin/trade", label: "Trade & customers" },
];

const AUTH_KEY = "bi.admin.auth";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { reset } = useCatalogue();
  const { store, stores, setStoreId } = useStoreSelection();
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setAuthed(localStorage.getItem(AUTH_KEY) === "1");
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  function signIn() {
    try { localStorage.setItem(AUTH_KEY, "1"); } catch {}
    setAuthed(true);
  }
  function signOut() {
    try { localStorage.removeItem(AUTH_KEY); } catch {}
    setAuthed(false);
  }
  function resetDemo() {
    reset();
    if (typeof window !== "undefined") window.alert("Demo data reset. Storefront prices, stock and homepage are back to defaults.");
  }

  if (!ready) return null;

  // --- Fake login ----------------------------------------------------------
  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
        <form
          onSubmit={(e) => { e.preventDefault(); signIn(); }}
          className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-sm"
        >
          <span className="inline-block rounded bg-brand px-2 py-1 text-lg font-black italic text-white">Build it</span>
          <h1 className="mt-4 text-xl font-bold text-ink">Store admin</h1>
          <p className="mt-1 text-sm text-muted">Sign in to manage your stores.</p>
          <input type="email" required placeholder="Email" defaultValue="owner@buildit.co.za" className="mt-4 w-full rounded-lg border border-line px-3 py-2.5 text-sm" aria-label="Email" />
          <input type="password" required placeholder="Password" defaultValue="demo" className="mt-2 w-full rounded-lg border border-line px-3 py-2.5 text-sm" aria-label="Password" />
          <button type="submit" className="mt-4 w-full rounded-lg bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand-dark">Sign in</button>
          <p className="mt-3 rounded-lg bg-brand-tint px-3 py-2 text-center text-xs text-brand-dark">Demo — any details work.</p>
        </form>
      </div>
    );
  }

  // --- Shell ---------------------------------------------------------------
  return (
    <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-[230px_1fr]">
      {/* Sidebar */}
      <aside className="border-r border-line bg-charcoal text-white lg:min-h-screen">
        <div className="flex items-center justify-between px-4 py-4">
          <span className="inline-block rounded bg-brand px-2 py-1 text-base font-black italic text-white">Build it</span>
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">Admin</span>
        </div>
        <nav className="px-2 pb-4">
          {NAV.map((n) => {
            const active = n.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`mb-0.5 block rounded-lg px-3 py-2 text-sm font-medium ${active ? "bg-brand text-white" : "text-white/80 hover:bg-white/10"}`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-1 px-2 pb-4 text-sm">
          <Link href="/" target="_blank" className="block rounded-lg px-3 py-2 text-white/80 hover:bg-white/10">View storefront ↗</Link>
          <button onClick={resetDemo} className="block w-full rounded-lg px-3 py-2 text-left text-white/80 hover:bg-white/10">Reset demo data</button>
          <button onClick={signOut} className="block w-full rounded-lg px-3 py-2 text-left text-white/80 hover:bg-white/10">Sign out</button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3">
          <p className="text-sm text-muted">Managing: <strong className="text-ink">{store.name}</strong></p>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted">Store</span>
            <select value={store.id} onChange={(e) => setStoreId(e.target.value)} className="rounded-lg border border-line bg-surface px-2 py-1.5 text-sm">
              {stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
        </header>
        <div className="flex-1 p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
