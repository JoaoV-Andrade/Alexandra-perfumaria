import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductGallery } from "@/components/product-gallery";
import { SiteHeader } from "@/components/site-header";
import { formatPriceInCents } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { ProductDetail } from "@/types/product";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("id, name, brand, description, volume_ml, price, images, stock")
    .eq("id", id)
    .maybeSingle<ProductDetail>();

  if (!product) {
    notFound();
  }

  const isOutOfStock = product.stock === 0;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <ProductGallery images={product.images} productName={product.name} />

          <div className="flex flex-col">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {product.brand}
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-foreground">
              {product.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {product.volume_ml}ml
            </p>

            {isOutOfStock && (
              <span className="mt-3 inline-flex w-fit items-center rounded-full bg-foreground px-2.5 py-1 text-xs font-medium text-background">
                Esgotado
              </span>
            )}

            <p className="mt-4 text-3xl font-semibold text-foreground">
              {formatPriceInCents(product.price)}
            </p>

            {product.description && (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AddToCartButton product={product} />

              <button
                type="button"
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-muted-foreground/30 px-6 text-sm font-semibold text-foreground transition-colors hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Comprar pelo WhatsApp
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
