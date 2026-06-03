import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { CatalogueProvider } from "@/components/catalogue";
import { SiteChrome } from "@/components/site-chrome";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Build It — Building, Hardware & Home Improvement", template: "%s · Build It" },
  description:
    "Shop building materials, power tools, paint, plumbing and more. Collect in-store or get it delivered to site. Prices include VAT.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a href="#main" className="skip-link">Skip to content</a>
        <Providers>
          <CatalogueProvider>
            <SiteChrome>{children}</SiteChrome>
          </CatalogueProvider>
        </Providers>
      </body>
    </html>
  );
}
