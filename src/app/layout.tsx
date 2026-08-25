import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { CartProvider } from "@/lib/cart/cart-context";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Alexandra Perfumaria",
    template: "%s | Alexandra Perfumaria",
  },
  description:
    "Decants de perfumes importados 100% originais, a partir de 5ml. Praticidade e economia para conhecer sua próxima fragrância favorita, com entrega para todo o Brasil.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Alexandra Perfumaria",
    title: "Alexandra Perfumaria",
    description:
      "Decants de perfumes importados 100% originais, a partir de 5ml, com entrega para todo o Brasil.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-background text-foreground">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
