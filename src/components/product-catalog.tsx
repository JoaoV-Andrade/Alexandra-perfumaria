import { EmptyState } from "@/components/empty-state";
import { ProductGrid } from "@/components/product-grid";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/product";

type ProductCatalogProps = {
  filterColumn?: "is_bestseller" | "is_exclusive" | "is_kit";
  emptyDescription: string;
};

export async function ProductCatalog({
  filterColumn,
  emptyDescription,
}: ProductCatalogProps) {
  const supabase = await createClient();
  const baseQuery = supabase
    .from("products")
    .select("id, name, brand, price, price_original, images, stock, volume_ml")
    .eq("active", true)
    .order("created_at", { ascending: false });

  const { data, error } = filterColumn
    ? await baseQuery.eq(filterColumn, true)
    : await baseQuery;

  if (error) {
    return (
      <EmptyState
        title="Não foi possível carregar os produtos"
        description="Algo deu errado ao buscar o catálogo. Tente novamente em instantes."
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState title="Nenhum produto disponível" description={emptyDescription} />
    );
  }

  return <ProductGrid products={data as Product[]} />;
}
