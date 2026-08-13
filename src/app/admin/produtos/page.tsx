import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { createClient } from "@/lib/supabase/server";
import type { ProductAdmin } from "@/types/product";

import { ProductRow } from "./product-row";

export default async function AdminProdutosPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select(
      "id, name, brand, description, volume_ml, price, price_original, stock, images, active, is_bestseller, is_feminine, is_kit, is_masculine, is_bottle_only, notes, weight_g, length_cm, width_cm, height_cm, created_at",
    )
    .order("created_at", { ascending: false })
    .returns<ProductAdmin[]>();

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-foreground">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
        >
          + Novo produto
        </Link>
      </div>

      <div className="mt-6">
        {!products || products.length === 0 ? (
          <EmptyState
            title="Nenhum produto cadastrado"
            description="Cadastre o primeiro produto pra começar."
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-surface">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-surface-alt text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="p-3 font-medium">Foto</th>
                  <th className="p-3 font-medium">Produto</th>
                  <th className="p-3 font-medium">Preço (R$)</th>
                  <th className="p-3 font-medium">Estoque</th>
                  <th className="p-3 font-medium">Ativo</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-alt">
                {products.map((product) => (
                  <ProductRow key={product.id} product={product} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
