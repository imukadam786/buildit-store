// Sample account data. This stands in for what the admin/backend will serve
// once accounts and order history are real. Order items reference real product
// slugs/variants so the "reorder" button can drop them straight into the cart.

export type AccountOrderItem = {
  productSlug: string;
  variantId: string;
  name: string;
  variantLabel: string;
  priceCents: number;
  swatch: string;
  qty: number;
};

export type AccountOrder = {
  ref: string;
  date: string;
  status: "Delivered" | "Ready to collect" | "Processing";
  fulfilment: "Collect" | "Delivery";
  items: AccountOrderItem[];
  totalCents: number;
};

export const SAMPLE_PROFILE = {
  name: "Thabo Nkosi",
  email: "thabo@example.co.za",
  phone: "082 123 4567",
};

export const SAMPLE_ORDERS: AccountOrder[] = [
  {
    ref: "BI-9F2K1A",
    date: "2026-05-21",
    status: "Delivered",
    fulfilment: "Delivery",
    totalCents: 184800,
    items: [
      { productSlug: "dulux-weatherguard-20l", variantId: "20l-white", name: "Dulux Weatherguard Exterior Paint", variantLabel: "20L · Brilliant White", priceCents: 169900, swatch: "#e5e7eb", qty: 1 },
      { productSlug: "radiant-bar-heater-1200w", variantId: "std", name: "Radiant 3 Bar Quartz Electric Heater 1200W", variantLabel: "1200W", priceCents: 34990, swatch: "#f97316", qty: 1 },
    ],
  },
  {
    ref: "BI-7C4M8D",
    date: "2026-04-09",
    status: "Ready to collect",
    fulfilment: "Collect",
    totalCents: 129900,
    items: [
      { productSlug: "ingco-impact-drill-20v", variantId: "single", name: "Ingco 20V Cordless Impact Drill Kit", variantLabel: "Single battery kit", priceCents: 129900, swatch: "#1f6feb", qty: 1 },
    ],
  },
];

export type ProjectList = { name: string; items: number };
export const SAMPLE_LISTS: ProjectList[] = [
  { name: "Bathroom reno", items: 6 },
  { name: "Garden wall", items: 3 },
];

export type AccountQuote = { ref: string; date: string; summary: string; status: "Awaiting reply" | "Quoted" | "Accepted" };
export const SAMPLE_QUOTES: AccountQuote[] = [
  { ref: "Q-3H9X2P", date: "2026-05-28", summary: "PPC Surebuild Cement ×40, Building Sand ×3 m³", status: "Quoted" },
  { ref: "Q-1B7T5K", date: "2026-05-30", summary: "Imperial Clay Stock Bricks ×3000", status: "Awaiting reply" },
];

export type SavedAddress = { label: string; lines: string };
export const SAMPLE_ADDRESSES: SavedAddress[] = [
  { label: "Home", lines: "12 Acacia Road, Hillcrest, 3610" },
  { label: "Site — Kloof", lines: "8 Ridge Drive, Kloof, 3640" },
];
