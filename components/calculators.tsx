"use client";

import { useState } from "react";
import Link from "next/link";

type TabKey = "paint" | "tiles" | "bricks" | "concrete";

const TABS: { key: TabKey; label: string }[] = [
  { key: "paint", label: "Paint" },
  { key: "tiles", label: "Tiles" },
  { key: "bricks", label: "Bricks" },
  { key: "concrete", label: "Concrete" },
];

function num(v: string): number {
  const n = parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function Field({ label, value, onChange, unit }: { label: string; value: string; onChange: (v: string) => void; unit?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      <div className="flex items-center rounded-lg border border-line focus-within:border-brand">
        <input type="number" min="0" step="any" value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent px-3 py-2.5 text-sm outline-none" inputMode="decimal" />
        {unit && <span className="px-3 text-sm text-muted">{unit}</span>}
      </div>
    </label>
  );
}

function Result({ children, href, cta }: { children: React.ReactNode; href: string; cta: string }) {
  return (
    <div className="mt-5 rounded-xl bg-brand-tint p-4">
      <div className="text-sm text-ink">{children}</div>
      <Link href={href} className="mt-3 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">{cta}</Link>
      <p className="mt-2 text-xs text-muted">Estimates only — round up and allow for waste. Your store can confirm exact quantities.</p>
    </div>
  );
}

function PaintCalc() {
  const [area, setArea] = useState("");
  const [coats, setCoats] = useState("2");
  const a = num(area), c = num(coats) || 1;
  const litres = a > 0 ? (a * c) / 7 : 0; // ~7 m²/L per coat
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Total wall area" value={area} onChange={setArea} unit="m²" />
        <Field label="Number of coats" value={coats} onChange={setCoats} />
      </div>
      {litres > 0 && (
        <Result href="/category/paint" cta="Shop paint">
          You&apos;ll need about <strong>{litres.toFixed(1)} litres</strong> of paint ({c} coat{c === 1 ? "" : "s"} at ~7 m²/L). A 20L plus a 5L would cover it comfortably.
        </Result>
      )}
    </div>
  );
}

function TilesCalc() {
  const [area, setArea] = useState("");
  const [box, setBox] = useState("1.44");
  const a = num(area), b = num(box);
  const withWaste = a > 0 ? a * 1.1 : 0; // +10% waste
  const boxes = a > 0 && b > 0 ? Math.ceil(withWaste / b) : 0;
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Floor / wall area" value={area} onChange={setArea} unit="m²" />
        <Field label="Coverage per box" value={box} onChange={setBox} unit="m²" />
      </div>
      {boxes > 0 && (
        <Result href="/category/bathroom" cta="Shop tiles">
          Allowing 10% for cuts and breakages, you&apos;ll need <strong>{boxes} box{boxes === 1 ? "" : "es"}</strong> to cover {a} m².
        </Result>
      )}
    </div>
  );
}

function BricksCalc() {
  const [length, setLength] = useState("");
  const [height, setHeight] = useState("");
  const [skin, setSkin] = useState("1");
  const l = num(length), h = num(height), s = num(skin) || 1;
  const area = l * h;
  const bricks = area > 0 ? Math.ceil(area * 50 * s * 1.05) : 0; // ~50/m² single skin, +5%
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Wall length" value={length} onChange={setLength} unit="m" />
        <Field label="Wall height" value={height} onChange={setHeight} unit="m" />
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Wall type</span>
          <select value={skin} onChange={(e) => setSkin(e.target.value)} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm">
            <option value="1">Single skin</option>
            <option value="2">Double skin</option>
          </select>
        </label>
      </div>
      {bricks > 0 && (
        <Result href="/category/building-materials" cta="Shop building materials">
          For a {area.toFixed(1)} m² wall you&apos;ll need approximately <strong>{bricks.toLocaleString("en-ZA")} bricks</strong> (incl. 5% waste).
        </Result>
      )}
    </div>
  );
}

function ConcreteCalc() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [thickness, setThickness] = useState("100");
  const l = num(length), w = num(width), t = num(thickness);
  const volume = l > 0 && w > 0 && t > 0 ? l * w * (t / 1000) : 0;
  const bags = volume > 0 ? Math.ceil(volume * 7) : 0; // ~7 × 50kg bags / m³ for a typical mix
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Length" value={length} onChange={setLength} unit="m" />
        <Field label="Width" value={width} onChange={setWidth} unit="m" />
        <Field label="Thickness" value={thickness} onChange={setThickness} unit="mm" />
      </div>
      {volume > 0 && (
        <Result href="/product/ppc-cement-42-5n" cta="Shop cement">
          That&apos;s about <strong>{volume.toFixed(2)} m³</strong> of concrete — roughly <strong>{bags} × 50kg bags</strong> of cement, plus sand and stone. Request a quote for bulk delivery.
        </Result>
      )}
    </div>
  );
}

export function Calculators() {
  const [tab, setTab] = useState<TabKey>("paint");
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div role="tablist" className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === t.key ? "bg-brand text-white" : "border border-line text-ink hover:bg-canvas"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "paint" && <PaintCalc />}
      {tab === "tiles" && <TilesCalc />}
      {tab === "bricks" && <BricksCalc />}
      {tab === "concrete" && <ConcreteCalc />}
    </div>
  );
}
