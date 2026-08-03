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
    "Perfumes selecionados com curadoria própria. Compre online com entrega para todo o Brasil e finalize também pelo WhatsApp.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Alexandra Perfumaria",
    title: "Alexandra Perfumaria",
    description:
      "Perfumes selecionados com curadoria própria. Compre online com entrega para todo o Brasil.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
