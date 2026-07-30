import { EmptyState } from "@/components/empty-state";
import { ProductGrid } from "@/components/product-grid";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/product";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, brand, price, images, stock")
    .eq("active", true)
    .order("created_at", { ascending: false });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {error ? (
          <EmptyState
            title="Não foi possível carregar os produtos"
            description="Algo deu errado ao buscar o catálogo. Tente novamente em instantes."
          />
        ) : data.length === 0 ? (
          <EmptyState
            title="Nenhum produto disponível"
            description="Estamos preparando o catálogo. Volte em breve!"
          />
        ) : (
          <ProductGrid products={data as Product[]} />
        )}
      </main>
    </>
  );
}
