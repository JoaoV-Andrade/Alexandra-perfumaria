import { EmptyState } from "@/components/empty-state";
import { ProductGrid } from "@/components/product-grid";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/product";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, brand, price, price_original, images, stock, volume_ml")
    .eq("active", true)
    .order("created_at", { ascending: false });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
            Decants de perfumes importados 100% originais
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Frações de 5ml a 10ml, retiradas de frascos originais, para você
            conhecer sua próxima fragrância favorita sem comprometimento.
            Não vendemos o frasco completo pelo site — quem tiver interesse
            no frasco inteiro pode falar com a gente pelo WhatsApp em cada
            produto.
          </p>
        </div>

        <div className="mt-8">
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
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
