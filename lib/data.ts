import type { Category, Product } from "./types";

// --- Stores -----------------------------------------------------------------
// The business runs more than one physical store; a customer shops against ONE
// at a time (selected and remembered). The backend will manage all stores later.
export type Store = {
  id: string;
  name: string;
  area: string;
  phone: string;
  whatsapp: string;
  hours: string;
};

export const STORES: Store[] = [
  {
    id: "strand",
    name: "Build It Strand",
    area: "Strand, Western Cape",
    phone: "021 853 1100",
    whatsapp: "27821234567",
    hours: "Mon–Fri 7:00–17:00 · Sat 7:00–14:00 · Sun 8:00–13:00",
  },
  {
    id: "stellenbosch",
    name: "Build It Stellenbosch",
    area: "Stellenbosch, Western Cape",
    phone: "021 886 4200",
    whatsapp: "27821234568",
    hours: "Mon–Fri 7:00–17:00 · Sat 7:00–14:00 · Sun closed",
  },
];

export const DEFAULT_STORE_ID = "strand";

// The customer storefront is a single store (one branch). It always shows this
// store's stock, prices and collection details. The admin manages BOTH stores.
export const STOREFRONT_STORE_ID = "strand";

// --- Categories -------------------------------------------------------------
export const CATEGORIES: Category[] = [
  { slug: "power-tools", name: "Power Tools", blurb: "Drills, grinders, saws & sanders", icon: "drill" },
  { slug: "building-materials", name: "Building Materials", blurb: "Cement, bricks, sand & aggregate", icon: "brick" },
  { slug: "paint", name: "Paint & Accessories", blurb: "Interior, exterior, rollers & brushes", icon: "paint" },
  { slug: "plumbing", name: "Plumbing", blurb: "Geysers, pipes, taps & fittings", icon: "pipe" },
  { slug: "bathroom", name: "Bathroom", blurb: "Basins, showers, toilets & mixers", icon: "shower" },
  { slug: "garden", name: "Garden & Outdoor", blurb: "Tools, irrigation & braais", icon: "leaf" },
];

// --- Products ---------------------------------------------------------------
// A spread across categories, including bulk/heavy goods (quote-first) and
// items with size/colour variants, specs and stock levels.
export const PRODUCTS: Product[] = [
  {
    slug: "ingco-impact-drill-20v",
    name: "Ingco 20V Cordless Impact Drill Kit",
    brand: "Ingco",
    categorySlug: "power-tools",
    summary: "165-piece kit with battery & charger — ready for the job.",
    description: [
      "A versatile 20V cordless impact drill for drilling and driving in wood, metal and masonry.",
      "Comes as a 165-piece kit in a carry case with a battery and fast charger included.",
    ],
    variantLabel: "Option",
    variants: [
      { id: "single", label: "Single battery kit", priceCents: 129900, wasCents: 169900, stock: 8, sku: "ING-20V-165-1B" },
      { id: "double", label: "Twin battery kit", priceCents: 159900, wasCents: 199900, stock: 3, sku: "ING-20V-165-2B" },
    ],
    specs: [
      { label: "Voltage", value: "20V" },
      { label: "Chuck size", value: "13mm keyless" },
      { label: "Max torque", value: "45 Nm" },
      { label: "Battery", value: "2.0Ah Li-ion" },
      { label: "Pieces", value: "165" },
    ],
    documents: [{ label: "User manual (PDF)", href: "#" }],
    bulk: false,
    reviews: [
      { author: "Sipho M.", rating: 5, title: "Great value kit", body: "Plenty of bits and the case keeps it all together.", date: "2026-04-12" },
      { author: "Dineo K.", rating: 4, title: "Solid for DIY", body: "Battery lasts well for home jobs.", date: "2026-03-02" },
    ],
    swatch: "#1f6feb",
  },
  {
    slug: "bosch-table-saw-gts-254",
    name: "Bosch GTS 254 Table Saw Professional",
    brand: "Bosch",
    categorySlug: "power-tools",
    summary: "Professional 254mm table saw for precise, repeatable cuts.",
    description: [
      "A professional table saw with a 254mm blade and a large cutting capacity.",
      "Built for tradespeople who need accurate rip and cross cuts on site.",
    ],
    variantLabel: "Option",
    variants: [{ id: "std", label: "Standard", priceCents: 579900, wasCents: 659900, stock: 2, sku: "BSH-GTS254" }],
    specs: [
      { label: "Blade diameter", value: "254mm" },
      { label: "Power", value: "1800W" },
      { label: "Max cut depth (90°)", value: "79mm" },
      { label: "No-load speed", value: "4300 rpm" },
    ],
    documents: [{ label: "Datasheet (PDF)", href: "#" }, { label: "User manual (PDF)", href: "#" }],
    bulk: false,
    reviews: [{ author: "Trade buyer", rating: 5, title: "Workhorse", body: "Accurate and stable. Worth it.", date: "2026-02-18" }],
    swatch: "#0a6b3b",
  },
  {
    slug: "ppc-cement-42-5n",
    name: "PPC Surebuild Cement 42,5N",
    brand: "PPC",
    categorySlug: "building-materials",
    summary: "General-purpose cement for foundations, plaster and mortar.",
    description: [
      "PPC Surebuild 42,5N is a strength-class general-purpose cement suitable for most building applications.",
      "Heavy/bulk item — delivered to site. Request a quote for pallet quantities and delivery to your address.",
    ],
    variantLabel: "Pack size",
    variants: [
      { id: "50kg", label: "50kg bag", priceCents: 11900, wasCents: null, stock: 240, sku: "PPC-SB-50" },
      { id: "pallet", label: "Pallet (40 bags)", priceCents: 449900, wasCents: 479900, stock: 12, sku: "PPC-SB-PAL" },
    ],
    specs: [
      { label: "Strength class", value: "42,5N" },
      { label: "Bag mass", value: "50kg" },
      { label: "Bags per pallet", value: "40" },
      { label: "Coverage", value: "~14 bags / m³ concrete" },
    ],
    documents: [{ label: "Safety data sheet (PDF)", href: "#" }],
    bulk: true,
    reviews: [],
    swatch: "#6b7280",
  },
  {
    slug: "clay-bricks-imperial",
    name: "Imperial Clay Stock Bricks",
    brand: "Corobrik",
    categorySlug: "building-materials",
    summary: "Standard clay stock bricks — priced per 1000, delivered to site.",
    description: [
      "Durable clay stock bricks for load-bearing and general walling.",
      "Sold per 1000 and delivered by the truckload. Request a quote for your quantity and delivery area.",
    ],
    variantLabel: "Quantity",
    variants: [{ id: "1000", label: "Per 1000 bricks", priceCents: 289900, wasCents: null, stock: 60, sku: "CRB-IMP-1000" }],
    specs: [
      { label: "Type", value: "Clay stock brick" },
      { label: "Nominal size", value: "222 × 106 × 73mm" },
      { label: "Sold per", value: "1000 units" },
      { label: "Bricks per m²", value: "~50 (single skin)" },
    ],
    documents: [],
    bulk: true,
    reviews: [],
    swatch: "#9a3412",
  },
  {
    slug: "dulux-weatherguard-20l",
    name: "Dulux Weatherguard Exterior Paint",
    brand: "Dulux",
    categorySlug: "paint",
    summary: "Long-life exterior wall paint with 12-year weather protection.",
    description: [
      "A premium exterior paint that protects walls against the elements with a smooth matt finish.",
      "Tintable to a wide range of colours — choose your size below.",
    ],
    variantLabel: "Size & colour",
    variants: [
      { id: "20l-white", label: "20L · Brilliant White", priceCents: 169900, wasCents: 189900, stock: 18, sku: "DLX-WG-20-WHT" },
      { id: "20l-grey", label: "20L · Stone Grey", priceCents: 179900, wasCents: null, stock: 6, sku: "DLX-WG-20-GRY" },
      { id: "5l-white", label: "5L · Brilliant White", priceCents: 54900, wasCents: null, stock: 30, sku: "DLX-WG-5-WHT" },
    ],
    specs: [
      { label: "Finish", value: "Matt" },
      { label: "Coverage", value: "~7 m²/L per coat" },
      { label: "Coats", value: "2 recommended" },
      { label: "Dry time", value: "2 hrs touch-dry" },
    ],
    documents: [{ label: "Technical data sheet (PDF)", href: "#" }],
    bulk: false,
    reviews: [{ author: "Hennie", rating: 5, title: "Covers well", body: "Two coats and the wall looks new.", date: "2026-01-22" }],
    swatch: "#e5e7eb",
  },
  {
    slug: "kwikot-geyser-150l",
    name: "Kwikot 150L Electric Geyser",
    brand: "Kwikot",
    categorySlug: "plumbing",
    summary: "150L vertical geyser with a 5-year cylinder guarantee.",
    description: [
      "A reliable 150L electric storage water heater for the average household.",
      "Professional installation recommended. Bulky item — delivery or collect at your store.",
    ],
    variantLabel: "Capacity",
    variants: [
      { id: "150l", label: "150L", priceCents: 379900, wasCents: 429900, stock: 5, sku: "KWK-GEY-150" },
      { id: "200l", label: "200L", priceCents: 459900, wasCents: null, stock: 0, sku: "KWK-GEY-200" },
    ],
    specs: [
      { label: "Capacity", value: "150L" },
      { label: "Element", value: "3kW" },
      { label: "Pressure", value: "400 kPa" },
      { label: "Guarantee", value: "5-year cylinder" },
    ],
    documents: [{ label: "Installation guide (PDF)", href: "#" }],
    bulk: false,
    reviews: [],
    swatch: "#2563eb",
  },
  {
    slug: "cobra-basin-mixer",
    name: "Cobra Amazon Basin Mixer — Matt Black",
    brand: "Cobra",
    categorySlug: "bathroom",
    summary: "Single-lever basin mixer with a modern matt black finish.",
    description: [
      "A stylish single-lever mixer for the bathroom basin, finished in on-trend matt black.",
      "SABS-approved and backed by a manufacturer guarantee.",
    ],
    variantLabel: "Finish",
    variants: [
      { id: "black", label: "Matt Black", priceCents: 89900, wasCents: 109900, stock: 14, sku: "CBR-AMZ-BLK" },
      { id: "chrome", label: "Chrome", priceCents: 79900, wasCents: null, stock: 22, sku: "CBR-AMZ-CHR" },
    ],
    specs: [
      { label: "Type", value: "Single-lever basin mixer" },
      { label: "Finish", value: "Matt black / chrome" },
      { label: "Approval", value: "SABS approved" },
      { label: "Guarantee", value: "5 years" },
    ],
    documents: [],
    bulk: false,
    reviews: [{ author: "Reno R.", rating: 4, title: "Looks great", body: "Smart finish, easy install.", date: "2026-03-30" }],
    swatch: "#111827",
  },
  {
    slug: "speedheat-shower-head",
    name: "Speedheat Instant Hot Water Showerhead",
    brand: "Speedheat",
    categorySlug: "bathroom",
    summary: "Heats water on demand — no geyser needed.",
    description: [
      "An instant electric showerhead that heats water as it flows, ideal for cottages and outbuildings.",
      "Easy to fit to an existing cold-water line.",
    ],
    variantLabel: "Model",
    variants: [
      { id: "3kw", label: "3.5kW", priceCents: 129900, wasCents: 159900, stock: 11, sku: "SPH-SHR-35" },
      { id: "5kw", label: "5kW", priceCents: 149900, wasCents: 179900, stock: 7, sku: "SPH-SHR-50" },
    ],
    specs: [
      { label: "Power", value: "3.5kW / 5kW" },
      { label: "Supply", value: "Cold water only" },
      { label: "Fitting", value: "Standard 15mm" },
    ],
    documents: [{ label: "Install sheet (PDF)", href: "#" }],
    bulk: false,
    reviews: [],
    swatch: "#0ea5e9",
  },
  {
    slug: "radiant-bar-heater-1200w",
    name: "Radiant 3 Bar Quartz Electric Heater 1200W",
    brand: "Radiant",
    categorySlug: "garden",
    summary: "Quick, focused warmth for patios and indoor spaces.",
    description: [
      "A 3-bar quartz heater delivering up to 1200W of instant radiant heat.",
      "Tip-over safety switch and a sturdy stand.",
    ],
    variantLabel: "Option",
    variants: [{ id: "std", label: "1200W", priceCents: 34990, wasCents: 42990, stock: 25, sku: "RAD-3BAR-1200" }],
    specs: [
      { label: "Output", value: "1200W (3 × 400W)" },
      { label: "Bars", value: "3 quartz elements" },
      { label: "Safety", value: "Tip-over cut-off" },
    ],
    documents: [],
    bulk: false,
    reviews: [{ author: "Thandi", rating: 5, title: "Warms fast", body: "Great for the patio in winter.", date: "2026-05-08" }],
    swatch: "#f97316",
  },
  {
    slug: "weber-braai-kettle-57",
    name: "Weber Master-Touch 57cm Charcoal Braai",
    brand: "Weber",
    categorySlug: "garden",
    summary: "Iconic 57cm kettle braai with a built-in thermometer.",
    description: [
      "The Weber Master-Touch 57cm charcoal kettle braai — built to last and a South African favourite.",
      "Includes hinged grate and a lid thermometer.",
    ],
    variantLabel: "Colour",
    variants: [
      { id: "black", label: "Black", priceCents: 599900, wasCents: 649900, stock: 4, sku: "WBR-MT57-BLK" },
      { id: "green", label: "Green", priceCents: 599900, wasCents: null, stock: 0, sku: "WBR-MT57-GRN" },
    ],
    specs: [
      { label: "Diameter", value: "57cm" },
      { label: "Material", value: "Porcelain-enamelled steel" },
      { label: "Features", value: "Hinged grate, thermometer" },
      { label: "Guarantee", value: "10 years" },
    ],
    documents: [{ label: "Owner's guide (PDF)", href: "#" }],
    bulk: false,
    reviews: [{ author: "Braai master", rating: 5, title: "The real deal", body: "Holds heat beautifully.", date: "2026-04-01" }],
    swatch: "#111827",
  },
  {
    slug: "builders-sand-cube",
    name: "Building Sand — Per m³",
    brand: "Local",
    categorySlug: "building-materials",
    summary: "Washed building sand, delivered by the cube.",
    description: [
      "Quality washed building sand suitable for plaster and mortar mixes.",
      "Sold per cubic metre and delivered by tipper truck. Request a quote for your area.",
    ],
    variantLabel: "Quantity",
    variants: [{ id: "1m3", label: "Per m³", priceCents: 49900, wasCents: null, stock: 100, sku: "SND-BLD-1M3" }],
    specs: [
      { label: "Type", value: "Washed building sand" },
      { label: "Sold per", value: "Cubic metre (m³)" },
      { label: "Delivery", value: "Tipper truck" },
    ],
    documents: [],
    bulk: true,
    reviews: [],
    swatch: "#ca8a04",
  },
  {
    slug: "dewalt-angle-grinder-115",
    name: "DeWalt 115mm Angle Grinder 750W",
    brand: "DeWalt",
    categorySlug: "power-tools",
    summary: "Compact 115mm grinder for cutting and grinding.",
    description: [
      "A compact and powerful 750W angle grinder with a 115mm disc.",
      "Slim body for comfortable, controlled handling.",
    ],
    variantLabel: "Option",
    variants: [{ id: "std", label: "750W", priceCents: 109900, wasCents: 129900, stock: 16, sku: "DWT-AG115-750" }],
    specs: [
      { label: "Disc size", value: "115mm" },
      { label: "Power", value: "750W" },
      { label: "No-load speed", value: "11000 rpm" },
      { label: "Spindle", value: "M14" },
    ],
    documents: [{ label: "User manual (PDF)", href: "#" }],
    bulk: false,
    reviews: [],
    swatch: "#eab308",
  },
];

// --- Lookups ----------------------------------------------------------------
export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function productsInCategory(slug: string): Product[] {
  return PRODUCTS.filter((p) => p.categorySlug === slug);
}

export function getStore(id: string): Store {
  return STORES.find((s) => s.id === id) ?? STORES[0];
}

/** Lowest current variant price for a product, used on cards. */
export function fromPriceCents(p: Product): number {
  return Math.min(...p.variants.map((v) => v.priceCents));
}

/** True if any variant is in stock. */
export function inStock(p: Product): boolean {
  return p.variants.some((v) => v.stock > 0);
}

export function averageRating(p: Product): number | null {
  if (p.reviews.length === 0) return null;
  return p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length;
}
