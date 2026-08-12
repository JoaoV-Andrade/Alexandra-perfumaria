import type { Metadata } from "next";

import { ProductCatalog } from "@/components/product-catalog";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Promoções",
  description:
    "Decants de perfumes importados 100% originais com preço promocional na Alexandra Perfumaria.",
};

export default function PromocoesPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-bg-alt">
        <div className="mx-auto w-full max-w-page px-4 py-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="bg-[image:var(--title-gradient)] bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
              Promoções
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Decants com preço especial por tempo limitado.
            </p>
          </div>

          <div className="mt-8">
            <ProductCatalog
              onlyPromo
              emptyDescription="Nenhuma promoção ativa no momento."
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
