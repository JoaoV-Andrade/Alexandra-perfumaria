import type { Metadata } from "next";

import { CheckoutForm } from "@/components/checkout-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Finalizar compra",
  description: "Informe seus dados de entrega e pagamento para concluir o pedido.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <h1 className="bg-[image:var(--title-gradient)] bg-clip-text text-2xl font-semibold text-transparent">
          Finalizar compra
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Você está comprando decants (frações de perfumes importados 100%
          originais). Postamos em até 2 a 5 dias úteis após a confirmação do
          pagamento, com rastreio para todo o Brasil.
        </p>
        <div className="mt-6">
          <CheckoutForm />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
