import Link from "next/link";

import { ProductRow } from "@/components/product-row";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/product";

type FeaturedProductsSectionProps = {
  title: string;
  viewAllHref: string;
  filterColumn: "is_bestseller" | "is_exclusive";
};

export async function FeaturedProductsSection({
  title,
  viewAllHref,
  filterColumn,
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

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          {title}
        </h2>
        <Link
          href={viewAllHref}
          className="text-sm font-medium text-accent transition-colors hover:text-foreground"
        >
          Ver todos
        </Link>
      </div>

      <div className="mt-6">
        <ProductRow products={products} />
      </div>
    </section>
  );
}
