import Link from "next/link";

import { ProductRow } from "@/components/product-row";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/product";

type FeaturedProductsSectionProps = {
  title: string;
  viewAllHref: string;
  filterColumn: "is_bestseller" | "is_exclusive";
  // Alternância de fundo das seções da home: "alt" = branco, "primary" =
  // turquesa. Sobre turquesa o título e o link ficam em texto escuro
  // sólido em vez de dourado, por contraste — ver CLAUDE.md.
  background?: "primary" | "alt";
};

export async function FeaturedProductsSection({
  title,
  viewAllHref,
  filterColumn,
  background = "alt",
}: FeaturedProductsSectionProps) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, name, brand, price, price_original, images, stock, volume_ml, is_exclusive",
    )
    .eq("active", true)
    .eq(filterColumn, true)
    .order("created_at", { ascending: false })
    .limit(12);

  const products = (data ?? []) as Product[];
  if (products.length === 0) return null;

  const isPrimary = background === "primary";

  return (
    <section className={isPrimary ? "bg-bg-primary" : "bg-bg-alt"}>
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between gap-4">
          <h2
            className={
              isPrimary
                ? "text-xl font-semibold text-foreground sm:text-2xl"
                : "bg-[image:var(--title-gradient)] bg-clip-text text-xl font-semibold text-transparent sm:text-2xl"
            }
          >
            {title}
          </h2>
          <Link
            href={viewAllHref}
            className={
              isPrimary
                ? "text-sm font-medium text-foreground underline-offset-2 transition-colors hover:underline"
                : "text-sm font-medium text-link transition-colors hover:text-link-hover"
            }
          >
            Ver todos
          </Link>
        </div>

        <div className="mt-6">
          <ProductRow products={products} />
        </div>
      </div>
    </section>
  );
}
