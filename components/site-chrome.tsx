"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";
import { PopiaBanner } from "./popia-banner";

// Storefront chrome (header/footer/cookie banner) wraps everything EXCEPT the
// admin, which supplies its own shell.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return <>{children}</>;
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <PopiaBanner />
    </>
  );
}
