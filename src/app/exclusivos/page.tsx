import type { Metadata } from "next";

import { ProductCatalog } from "@/components/product-catalog";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Exclusivos",
  description:
    "Decants exclusivos de perfumes importados 100% originais na Alexandra Perfumaria.",
};

export default function ExclusivosPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
            Exclusivos
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Fragrâncias raras e exclusivas, em decants de 5ml a 10ml.
          </p>
        </div>

        <div className="mt-8">
          <ProductCatalog
            filterColumn="is_exclusive"
            emptyDescription="Ainda não marcamos nenhum produto como exclusivo. Volte em breve!"
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
