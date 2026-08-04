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
    .select(
      "id, name, brand, price, price_original, images, stock, volume_ml, is_exclusive",
    )
    .eq("active", true)
    .order("created_at", { ascending: false });

  // Sem filtro específico (catálogo "Todos os Perfumes"), kits não entram
  // aqui — eles têm a própria página em /kits.
  const { data, error } = filterColumn
    ? await baseQuery.eq(filterColumn, true)
    : await baseQuery.eq("is_kit", false);

  if (error) {
    return (
      <EmptyState
        title="Não foi possível carregar os produtos"
        description="Algo deu errado ao buscar o catálogo. Tente novamente em instantes."
      />
    );
  }

  if (!data || data.length === 0) {
    return filterColumn ? (
      <EmptyState
        title="Em breve novidades aqui 💛"
        description={emptyDescription}
        action={{ label: "Ver todos os perfumes", href: "/perfumes" }}
      />
    ) : (
      <EmptyState title="Nenhum produto disponível" description={emptyDescription} />
    );
  }

  return <ProductGrid products={data as Product[]} />;
}
