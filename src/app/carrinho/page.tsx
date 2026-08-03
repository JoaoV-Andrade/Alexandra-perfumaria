import type { Metadata } from "next";

import { CartSummary } from "@/components/cart-summary";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Carrinho",
  description: "Revise os itens do seu carrinho antes de finalizar a compra.",
};

export default function CartPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-semibold text-foreground">Carrinho</h1>
        <div className="mt-6">
          <CartSummary />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
