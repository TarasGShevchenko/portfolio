import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { env, isProduction } from "@/lib/env";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz", "wdth"],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: "starg.shop — coming soon",
  description: "Landing pages built for companies, and the portfolio behind them.",
  // Only production may be indexed; local and staging stay out of search results.
  robots: isProduction ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#1c2c8f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bricolage.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
