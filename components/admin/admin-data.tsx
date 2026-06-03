"use client";

// Persisted operational data for the admin (orders, trade applications,
// customers + trade terms). Seeded from the sample data so edits stick across
// navigation and refresh during the demo. Cleared by "Reset demo data".

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  ADMIN_ORDERS, CUSTOMERS, TRADE_APPLICATIONS,
  type AdminOrder, type ApplicationStatus, type Customer, type OrderStatus, type TradeApplication,
} from "@/lib/admin";

export type Terms = { creditLimitCents: number; discountPct: number; buyers: string[] };
export type AdminCustomer = Customer & { terms?: Terms };
export type AdminOrderRow = AdminOrder & { refunded?: boolean };

type Ctx = {
  orders: AdminOrderRow[];
  setOrderStatus: (ref: string, status: OrderStatus) => void;
  refundOrder: (ref: string) => void;
  routeOrder: (ref: string, store: string) => void;
  apps: TradeApplication[];
  decideApp: (id: string, status: ApplicationStatus) => void;
  customers: AdminCustomer[];
  updateTerms: (email: string, terms: Terms) => void;
  reset: () => void;
};

const AdminDataContext = createContext<Ctx | null>(null);
const KEY = "bi.admin.data";

const DEFAULT_TERMS: Terms = { creditLimitCents: 5000000, discountPct: 10, buyers: [] };

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<AdminOrderRow[]>(ADMIN_ORDERS);
  const [apps, setApps] = useState<TradeApplication[]>(TRADE_APPLICATIONS);
  const [customers, setCustomers] = useState<AdminCustomer[]>(CUSTOMERS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (p.orders) setOrders(p.orders);
        if (p.apps) setApps(p.apps);
        if (p.customers) setCustomers(p.customers);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify({ orders, apps, customers }));
  }, [orders, apps, customers, hydrated]);

  const value = useMemo<Ctx>(() => {
    const setOrderStatus = (ref: string, status: OrderStatus) =>
      setOrders((prev) => prev.map((o) => (o.ref === ref ? { ...o, status } : o)));
    const refundOrder = (ref: string) =>
      setOrders((prev) => prev.map((o) => (o.ref === ref ? { ...o, refunded: true, status: "Completed" } : o)));
    const routeOrder = (ref: string, store: string) =>
      setOrders((prev) => prev.map((o) => (o.ref === ref ? { ...o, store } : o)));

    const decideApp = (id: string, status: ApplicationStatus) => {
      setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      if (status === "Approved") {
        const app = apps.find((a) => a.id === id);
        if (app) {
          setCustomers((prev) => {
            const existing = prev.find((c) => c.name === app.business);
            if (existing) return prev.map((c) => (c.name === app.business ? { ...c, type: "Trade", terms: c.terms ?? { ...DEFAULT_TERMS, buyers: [app.contact] } } : c));
            return [{ name: app.business, email: `${app.business.toLowerCase().replace(/[^a-z0-9]+/g, "")}@trade.co.za`, type: "Trade", orders: 0, spentCents: 0, terms: { ...DEFAULT_TERMS, buyers: [app.contact] } }, ...prev];
          });
        }
      }
    };
    const updateTerms = (email: string, terms: Terms) =>
      setCustomers((prev) => prev.map((c) => (c.email === email ? { ...c, type: "Trade", terms } : c)));

    const reset = () => { setOrders(ADMIN_ORDERS); setApps(TRADE_APPLICATIONS); setCustomers(CUSTOMERS); };

    return { orders, setOrderStatus, refundOrder, routeOrder, apps, decideApp, customers, updateTerms, reset };
  }, [orders, apps, customers]);

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData(): Ctx {
  const c = useContext(AdminDataContext);
  if (!c) throw new Error("useAdminData must be used within AdminDataProvider");
  return c;
}
