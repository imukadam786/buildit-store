// Seed data for the admin prototype. Stands in for the backend. Numbers are
// realistic so the pitch demo feels live; nothing here is persisted server-side.

export const ORDER_STATUSES = ["New", "Preparing", "Ready", "Out for delivery", "Completed"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type AdminOrder = {
  ref: string;
  date: string;
  customer: string;
  store: string;
  fulfilment: "Collect" | "Delivery";
  status: OrderStatus;
  totalCents: number;
  items: { name: string; qty: number; priceCents: number }[];
};

export const ADMIN_ORDERS: AdminOrder[] = [
  { ref: "BI-9F2K1A", date: "2026-06-03", customer: "Thabo Nkosi", store: "Build It Hillcrest", fulfilment: "Delivery", status: "New", totalCents: 184800, items: [{ name: "Dulux Weatherguard 20L White", qty: 1, priceCents: 169900 }, { name: "Radiant 3 Bar Heater", qty: 1, priceCents: 34990 }] },
  { ref: "BI-7C4M8D", date: "2026-06-03", customer: "Lerato Dlamini", store: "Build It Hillcrest", fulfilment: "Collect", status: "Preparing", totalCents: 129900, items: [{ name: "Ingco 20V Impact Drill Kit", qty: 1, priceCents: 129900 }] },
  { ref: "BI-2P8Q5R", date: "2026-06-02", customer: "Pieter van Wyk", store: "Build It Kloof", fulfilment: "Collect", status: "Ready", totalCents: 89900, items: [{ name: "Cobra Basin Mixer — Black", qty: 1, priceCents: 89900 }] },
  { ref: "BI-5T1V9W", date: "2026-06-02", customer: "Naledi Khumalo", store: "Build It Hillcrest", fulfilment: "Delivery", status: "Out for delivery", totalCents: 599900, items: [{ name: "Weber Master-Touch 57cm", qty: 1, priceCents: 599900 }] },
  { ref: "BI-8X3Y2Z", date: "2026-05-30", customer: "Sipho Mthembu", store: "Build It Kloof", fulfilment: "Collect", status: "Completed", totalCents: 109900, items: [{ name: "DeWalt 115mm Angle Grinder", qty: 1, priceCents: 109900 }] },
];

export type QuoteStatus = "New" | "Quoted" | "Accepted";
export type AdminQuote = {
  ref: string;
  date: string;
  customer: string;
  store: string;
  area: string;
  status: QuoteStatus;
  items: { name: string; qty: string }[];
};

export const ADMIN_QUOTES: AdminQuote[] = [
  { ref: "Q-3H9X2P", date: "2026-06-03", customer: "BuildRight Construction", store: "Build It Hillcrest", area: "Local (within 30km)", status: "New", items: [{ name: "PPC Surebuild Cement 50kg", qty: "40" }, { name: "Building Sand", qty: "3 m³" }] },
  { ref: "Q-1B7T5K", date: "2026-06-02", customer: "M. Botha", store: "Build It Kloof", area: "Regional (30–100km)", status: "New", items: [{ name: "Imperial Clay Stock Bricks", qty: "3000" }] },
  { ref: "Q-6L4N8J", date: "2026-06-01", customer: "Coastal Plumbers", store: "Build It Hillcrest", area: "Local (within 30km)", status: "Quoted", items: [{ name: "Kwikot 150L Geyser", qty: "4" }] },
  { ref: "Q-9D2F7G", date: "2026-05-29", customer: "Ridgeview Homes", store: "Build It Kloof", area: "Local (within 30km)", status: "Accepted", items: [{ name: "PPC Surebuild Cement Pallet", qty: "2" }] },
];

export type ApplicationStatus = "Pending" | "Approved" | "Declined";
export type TradeApplication = {
  id: string;
  business: string;
  contact: string;
  type: string;
  monthlySpend: string;
  date: string;
  status: ApplicationStatus;
};

export const TRADE_APPLICATIONS: TradeApplication[] = [
  { id: "TA-1042", business: "BuildRight Construction", contact: "J. Naidoo", type: "Builder / contractor", monthlySpend: "R40 000–R80 000", date: "2026-06-03", status: "Pending" },
  { id: "TA-1041", business: "Coastal Plumbers", contact: "S. Adams", type: "Plumber", monthlySpend: "R15 000–R30 000", date: "2026-06-02", status: "Pending" },
  { id: "TA-1039", business: "Ridgeview Homes", contact: "M. Pillay", type: "Builder / contractor", monthlySpend: "R80 000+", date: "2026-05-28", status: "Approved" },
];

export type Customer = { name: string; email: string; type: "Retail" | "Trade"; orders: number; spentCents: number };
export const CUSTOMERS: Customer[] = [
  { name: "Ridgeview Homes", email: "accounts@ridgeview.co.za", type: "Trade", orders: 24, spentCents: 4820000 },
  { name: "Thabo Nkosi", email: "thabo@example.co.za", type: "Retail", orders: 7, spentCents: 312400 },
  { name: "Coastal Plumbers", email: "s.adams@coastal.co.za", type: "Trade", orders: 12, spentCents: 1890000 },
  { name: "Lerato Dlamini", email: "lerato@example.co.za", type: "Retail", orders: 3, spentCents: 158900 },
  { name: "Pieter van Wyk", email: "pieter@example.co.za", type: "Retail", orders: 5, spentCents: 243000 },
];

export type Campaign = { name: string; audience: string; recipients: number; date: string; opens: number; clicks: number; status: "Sent" | "Draft" };
export const CAMPAIGNS: Campaign[] = [
  { name: "Winter Heating Specials", audience: "All subscribers", recipients: 3120, date: "2026-05-26", opens: 41, clicks: 9, status: "Sent" },
  { name: "Trade — Bulk Cement Deal", audience: "Trade accounts", recipients: 184, date: "2026-05-19", opens: 58, clicks: 22, status: "Sent" },
  { name: "Power Tool Payday Promo", audience: "Lapsed buyers", recipients: 0, date: "—", opens: 0, clicks: 0, status: "Draft" },
];

export const AUDIENCES = [
  { id: "all", label: "All subscribers", size: 3120 },
  { id: "trade", label: "Trade accounts", size: 184 },
  { id: "diy", label: "DIY / retail buyers", size: 2740 },
  { id: "lapsed", label: "Lapsed (no order in 90 days)", size: 610 },
  { id: "hillcrest", label: "Hillcrest store customers", size: 1980 },
  { id: "kloof", label: "Kloof store customers", size: 1140 },
];

export type Coupon = { code: string; description: string; used: number; status: "Active" | "Scheduled" | "Expired" };
export const COUPON_LIST: Coupon[] = [
  { code: "BUILD10", description: "10% off — sitewide", used: 212, status: "Active" },
  { code: "WINTER5", description: "5% off — winter heating", used: 88, status: "Active" },
  { code: "TRADE15", description: "15% off first trade order", used: 14, status: "Scheduled" },
];

export const DASHBOARD = {
  salesTodayCents: 414700,
  salesWeekCents: 2860400,
  ordersToday: 5,
  conversionPct: 3.4,
};
