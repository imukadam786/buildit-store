"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, STOREFRONT_STORE_ID, getStore } from "@/lib/data";
import { useCart } from "./providers";
import { CartIcon, SearchIcon, StoreIcon } from "./icons";

const STORE = getStore(STOREFRONT_STORE_ID);

export function Header() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-surface shadow-sm">
      {/* Top utility strip */}
      <div className="bg-charcoal text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5 text-xs">
          <span className="font-medium">Free delivery on qualifying orders · Collect in-store</span>
          <Link href="/stores" className="hidden items-center gap-1.5 hover:text-white/80 sm:flex">
            <StoreIcon className="h-4 w-4" />
            <span className="font-semibold">{STORE.name}</span>
            <span className="text-white/60">· {STORE.area}</span>
          </Link>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <button
          type="button"
          className="rounded-md p-2 text-ink lg:hidden"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="block h-0.5 w-5 bg-current" />
          <span className="mt-1 block h-0.5 w-5 bg-current" />
          <span className="mt-1 block h-0.5 w-5 bg-current" />
        </button>

        <Link href="/" className="flex items-center" aria-label="Build It home">
          <span className="select-none rounded bg-brand px-2 py-1 text-xl font-black italic tracking-tight text-white">
            Build it
          </span>
        </Link>

        {/* Search */}
        <form action="/search" className="ml-2 hidden flex-1 items-center sm:flex" role="search">
          <div className="flex w-full items-center rounded-lg border border-line bg-canvas focus-within:border-brand">
            <SearchIcon className="ml-3 h-5 w-5 text-muted" />
            <input
              type="search"
              name="q"
              placeholder="Search products, brands or codes…"
              className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
              aria-label="Search products"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1">
          <Link href="/account" className="hidden rounded-md px-3 py-2 text-sm font-medium text-ink hover:text-brand sm:block">
            Account
          </Link>
          <Link href="/cart" className="relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-ink hover:text-brand" aria-label={`Cart, ${count} items`}>
            <CartIcon className="h-6 w-6" />
            <span className="hidden md:inline">Cart</span>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile search */}
      <form action="/search" className="px-4 pb-3 sm:hidden" role="search">
        <div className="flex w-full items-center rounded-lg border border-line bg-canvas focus-within:border-brand">
          <SearchIcon className="ml-3 h-5 w-5 text-muted" />
          <input type="search" name="q" placeholder="Search products…" className="w-full bg-transparent px-3 py-2.5 text-sm outline-none" aria-label="Search products" />
        </div>
      </form>

      {/* Category nav — desktop */}
      <nav className="hidden border-t border-line bg-surface lg:block" aria-label="Product categories">
        <div className="mx-auto flex max-w-6xl items-center gap-1 px-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="border-b-2 border-transparent px-3 py-3 text-sm font-medium text-ink hover:border-brand hover:text-brand"
            >
              {c.name}
            </Link>
          ))}
          <Link href="/calculators" className="ml-auto px-3 py-3 text-sm font-semibold text-brand hover:text-brand-dark">
            Calculators
          </Link>
          <Link href="/trade" className="px-3 py-3 text-sm font-semibold text-brand hover:text-brand-dark">
            Trade accounts
          </Link>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <nav className="border-t border-line bg-surface lg:hidden" aria-label="Product categories">
          <div className="px-4 py-2">
            <Link href="/stores" onClick={() => setMenuOpen(false)} className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-ink">
              <StoreIcon className="h-4 w-4 text-brand" /> {STORE.name}
            </Link>
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} onClick={() => setMenuOpen(false)} className="block border-b border-line py-2.5 text-sm font-medium text-ink">
                {c.name}
              </Link>
            ))}
            <Link href="/calculators" onClick={() => setMenuOpen(false)} className="block py-2.5 text-sm font-semibold text-brand">Calculators</Link>
            <Link href="/trade" onClick={() => setMenuOpen(false)} className="block py-2.5 text-sm font-semibold text-brand">Trade accounts</Link>
            <Link href="/account" onClick={() => setMenuOpen(false)} className="block py-2.5 text-sm font-medium text-ink">Account</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
