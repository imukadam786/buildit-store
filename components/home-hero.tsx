"use client";

import { useCatalogue } from "./catalogue";

export function HomeHeroText() {
  const { hero } = useCatalogue();
  return (
    <>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/80">Winter specials now on</p>
      <h1 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">{hero.title}</h1>
      <p className="mt-3 max-w-md text-white/90">{hero.subtitle}</p>
    </>
  );
}
