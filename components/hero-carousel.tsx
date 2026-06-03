"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCatalogue } from "./catalogue";

const IMG = "https://images.unsplash.com/photo-";
const Q = "?auto=format&fit=crop&w=1600&q=70";

type Slide = {
  image: string;
  eyebrow: string;
  title?: string;
  subtitle?: string;
  useHero?: boolean; // pull live headline from the admin-editable hero
  cta: { label: string; href: string };
};

const SLIDES: Slide[] = [
  { image: `${IMG}1426927308491-6380b6a9936f${Q}`, eyebrow: "Build It Strand & Stellenbosch", useHero: true, cta: { label: "Shop power tools", href: "/category/power-tools" } },
  { image: `${IMG}1543393470-b2c833b98dce${Q}`, eyebrow: "Winter specials", title: "Beat the cold for less", subtitle: "Heaters, geysers and warm-home essentials on special now.", cta: { label: "Shop specials", href: "/category/garden" } },
  { image: `${IMG}1606676539940-12768ce0e762${Q}`, eyebrow: "Power tools", title: "Gear up for the job", subtitle: "Drills, grinders and saws from the brands the trade trusts.", cta: { label: "Shop power tools", href: "/category/power-tools" } },
  { image: `${IMG}1525909002-1b05e0c869d8${Q}`, eyebrow: "Paint & décor", title: "Freshen up every room", subtitle: "Interior and exterior paint, brushes and rollers.", cta: { label: "Shop paint", href: "/category/paint" } },
  { image: `${IMG}1587582423116-ec07293f0395${Q}`, eyebrow: "Trade accounts", title: "Building for a living?", subtitle: "Bulk pricing, fast quotes and buying on account.", cta: { label: "Open a trade account", href: "/trade" } },
];

export function HeroCarousel() {
  const { hero } = useCatalogue();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = SLIDES.length;

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % n), 5000);
    return () => clearTimeout(t);
  }, [active, paused, n]);

  const go = (i: number) => setActive((i + n) % n);

  return (
    <section
      className="relative overflow-hidden bg-charcoal"
      aria-label="Featured promotions"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[420px] sm:h-[460px]">
        {SLIDES.map((s, i) => {
          const title = s.useHero ? hero.title : s.title;
          const subtitle = s.useHero ? hero.subtitle : s.subtitle;
          return (
            <div
              key={i}
              aria-hidden={i !== active}
              className={`absolute inset-0 transition-opacity duration-700 ${i === active ? "opacity-100" : "pointer-events-none opacity-0"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />
              <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-4 text-white">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/85">{s.eyebrow}</p>
                <h1 className="max-w-xl text-3xl font-black leading-tight sm:text-5xl">{title}</h1>
                {subtitle && <p className="mt-3 max-w-md text-white/90">{subtitle}</p>}
                <div className="mt-6">
                  <Link href={s.cta.href} className="inline-block rounded-lg bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark">
                    {s.cta.label}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Arrows */}
        <button onClick={() => go(active - 1)} aria-label="Previous slide" className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/60">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button onClick={() => go(active + 1)} aria-label="Next slide" className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/60">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === active}
              className={`h-2 rounded-full transition-all ${i === active ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
