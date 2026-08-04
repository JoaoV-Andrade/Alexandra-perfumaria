import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductGallery } from "@/components/product-gallery";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatPriceInCents } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { ProductDetail } from "@/types/product";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

const fetchProduct = cache(async (id: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, name, brand, description, volume_ml, price, price_original, images, stock, notes, is_exclusive",
    )
    .eq("id", id)
    .maybeSingle<ProductDetail>();
  return data;
});

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    return { title: "Produto não encontrado" };
  }

  const title = `${product.name} — ${product.brand}`;
  const description =
    product.description?.slice(0, 160) ||
    `Decante de ${product.volume_ml}ml do perfume ${product.name}, da ${product.brand}, 100% original. Confira na Alexandra Perfumaria.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.images?.[0] ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    notFound();
  }

  const isOutOfStock = product.stock === 0;
  const isPromo = product.price_original != null;

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const fullBottleMessage = `Olá! Tenho interesse no frasco completo de ${product.name}.`;
  const fullBottleWhatsAppUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fullBottleMessage)}`;

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
              Decante de {product.volume_ml}ml · perfume 100% original
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {isOutOfStock && (
                <span className="inline-flex w-fit items-center rounded-full bg-foreground px-2.5 py-1 text-xs font-medium text-background">
                  Esgotado
                </span>
              )}
              {!isOutOfStock && isPromo && (
                <span className="inline-flex w-fit items-center rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                  Promoção
                </span>
              )}
            </div>

            {isPromo ? (
              <p className="mt-4 flex items-baseline gap-3">
                <span className="text-base text-muted-foreground line-through">
                  De {formatPriceInCents(product.price_original!)}
                </span>
                <span className="text-3xl font-semibold text-foreground">
                  por {formatPriceInCents(product.price)}
                </span>
              </p>
            ) : (
              <p className="mt-4 text-3xl font-semibold text-foreground">
                {formatPriceInCents(product.price)}
              </p>
            )}

            {product.description && (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}

            {product.notes && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">
                  Notas olfativas:
                </span>{" "}
                {product.notes}
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AddToCartButton product={product} />
            </div>

            <a
              href={fullBottleWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex h-11 items-center justify-center rounded-full border border-muted-foreground/30 px-6 text-center text-sm font-semibold text-foreground transition-colors hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Quero o frasco completo — falar no WhatsApp
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
