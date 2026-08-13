import type { Metadata } from "next";

import { ProductCatalog } from "@/components/product-catalog";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Perfumes Femininos",
  description:
    "Decants de perfumes femininos importados 100% originais na Alexandra Perfumaria.",
};

export default function FemininosPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-bg-alt">
        <div className="mx-auto w-full max-w-page px-4 py-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="bg-[image:var(--title-gradient)] bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
              Perfumes Femininos
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Decants de fragrâncias femininas importadas, em 5ml e 10ml.
            </p>
          </div>

          <div className="mt-8">
            <ProductCatalog
              filterColumn="is_feminine"
              emptyDescription="Novos perfumes femininos estão a caminho."
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
