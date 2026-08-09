import type { Metadata } from "next";

import { ProductCatalog } from "@/components/product-catalog";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Kits de Decantes",
  description:
    "Conjuntos de decants de perfumes importados 100% originais, vendidos juntos.",
};

export default function KitsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-bg-alt">
        <div className="mx-auto w-full max-w-page px-4 py-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="bg-[image:var(--title-gradient)] bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
              Kits de Decantes
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Conjuntos de decantes para presentear ou variar a semana.
            </p>
          </div>

          <div className="mt-8">
            <ProductCatalog
              filterColumn="is_kit"
              emptyDescription="Novos kits estão a caminho."
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
