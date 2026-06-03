import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminDataProvider } from "@/components/admin/admin-data";

export const metadata: Metadata = { title: "Store admin", robots: { index: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminDataProvider>
      <AdminShell>{children}</AdminShell>
    </AdminDataProvider>
  );
}
