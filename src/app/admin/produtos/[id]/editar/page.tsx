import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { ProductAdmin } from "@/types/product";

import { ProductForm } from "../../product-form";
import { updateProduct } from "./actions";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select(
      "id, name, brand, description, volume_ml, price, price_original, stock, images, active, is_bestseller, is_feminine, is_kit, is_masculine, is_bottle_only, notes, weight_g, length_cm, width_cm, height_cm",
    )
    .eq("id", id)
    .maybeSingle<ProductAdmin>();

  if (!product) {
    notFound();
  }

  const boundUpdateProduct = updateProduct.bind(null, product.id);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <Link
        href="/admin/produtos"
        className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
      >
        ← Voltar para produtos
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-foreground">
        Editar produto
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{product.name}</p>

      <div className="mt-6">
        <ProductForm
          action={boundUpdateProduct}
          submitLabel="Salvar alterações"
          pendingLabel="Salvando..."
          defaultValues={{
            name: product.name,
            brand: product.brand,
            description: product.description,
            notes: product.notes,
            volume_ml: product.volume_ml,
            price: product.price,
            price_original: product.price_original,
            stock: product.stock,
            weight_g: product.weight_g,
            length_cm: product.length_cm,
            width_cm: product.width_cm,
            height_cm: product.height_cm,
            active: product.active,
            is_bestseller: product.is_bestseller,
            is_feminine: product.is_feminine,
            is_kit: product.is_kit,
            is_masculine: product.is_masculine,
            is_bottle_only: product.is_bottle_only,
          }}
          existingImages={product.images}
        />
      </div>
    </main>
  );
}
