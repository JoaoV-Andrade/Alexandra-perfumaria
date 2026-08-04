import type { Metadata } from "next";

import { ProductCatalog } from "@/components/product-catalog";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Todos os Perfumes",
  description:
    "Catálogo completo de decants de perfumes importados 100% originais.",
};

export default function PerfumesPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
            Todos os Perfumes
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            O catálogo completo de decants da Alexandra Perfumaria.
          </p>
        </div>

        <div className="mt-8">
          <ProductCatalog emptyDescription="Estamos preparando o catálogo. Volte em breve!" />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
