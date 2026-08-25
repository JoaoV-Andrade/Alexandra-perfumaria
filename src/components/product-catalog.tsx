import { EmptyState } from "@/components/empty-state";
import { SortableProductGrid } from "@/components/sortable-product-grid";
import { PROMO_OR_FILTER } from "@/lib/products/promo-filter";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/product";

type ProductCatalogProps = {
  filterColumn?: "is_bestseller" | "is_feminine" | "is_kit" | "is_masculine";
  // Promoção não é um selo booleano: um produto está em promoção quando tem
  // price_original preenchido (preço "de") ou quando é um kit — kits sempre
  // aparecem aqui também, mesmo sem desconto (ver PROMO_OR_FILTER).
  onlyPromo?: boolean;
  emptyDescription: string;
  showDecantBadge?: boolean;
};

export async function ProductCatalog({
  filterColumn,
  onlyPromo,
  emptyDescription,
  showDecantBadge,
}: ProductCatalogProps) {
  const supabase = await createClient();
  const baseQuery = supabase
    .from("products")
    .select(
      "id, name, brand, price, price_original, images, stock, volume_ml, is_bottle_only",
    )
    .eq("active", true)
    .order("created_at", { ascending: false });

  // Sem filtro específico (catálogo "Todos os Perfumes"), kits não entram
  // aqui — eles têm a própria página em /kits.
  const { data, error } = onlyPromo
    ? await baseQuery.or(PROMO_OR_FILTER)
    : filterColumn
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
    return filterColumn || onlyPromo ? (
      <EmptyState
        title="Em breve novidades aqui 💛"
        description={emptyDescription}
        action={{ label: "Ver todos os perfumes", href: "/perfumes" }}
      />
    ) : (
      <EmptyState
        title="Nenhum produto disponível"
        description={emptyDescription}
      />
    );
  }

  return (
    <SortableProductGrid
      products={data as Product[]}
      showDecantBadge={showDecantBadge}
    />
  );
}
