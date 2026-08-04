import type { Metadata } from "next";

import { ProductCatalog } from "@/components/product-catalog";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Mais Vendidos",
  description:
    "Os decants de perfumes importados 100% originais mais pedidos na Alexandra Perfumaria.",
};

export default function MaisVendidosPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-bg-alt">
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="bg-[image:var(--title-gradient)] bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
              Mais Vendidos
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Os decants preferidos de quem já comprou com a gente.
            </p>
          </div>

          <div className="mt-8">
            <ProductCatalog
              filterColumn="is_bestseller"
              emptyDescription="Estamos preparando a lista dos queridinhos."
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
