import Link from "next/link";

import { ProductImage } from "@/components/product-image";
import { formatPriceInCents } from "@/lib/format";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const isOutOfStock = product.stock === 0;
  const imageUrl = product.images[0];
  const isPromo = product.price_original != null;
  const isLastUnits = !isOutOfStock && product.stock <= 3;
  const isFewUnits = !isOutOfStock && product.stock > 3 && product.stock <= 8;

  return (
    <Link
      href={`/produto/${product.id}`}
      className="group block overflow-hidden rounded-2xl border border-surface-alt bg-background transition-shadow hover:shadow-lg hover:shadow-accent/10"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface">
        <ProductImage
          src={imageUrl}
          alt={product.name}
          sizes="(min-width: 768px) 25vw, 50vw"
          imageClassName="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {isOutOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-foreground px-2.5 py-1 text-xs font-medium text-background">
            Esgotado
          </span>
        )}

        {!isOutOfStock && isPromo && (
          <span className="absolute left-3 top-3 rounded-full bg-[image:var(--gold-gradient)] px-2.5 py-1 text-xs font-semibold text-accent-foreground">
            Promoção
          </span>
        )}

        {product.is_exclusive && (
          <span className="absolute right-3 top-3 rounded-full border border-link/60 bg-background/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-link">
            Exclusivo
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {product.brand}
        </p>
        <h3 className="mt-1 text-sm font-medium text-foreground">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Decante {product.volume_ml}ml
        </p>
        {isPromo ? (
          <p className="mt-2 flex items-baseline gap-2">
            <span className="text-xs text-muted-foreground line-through">
              {formatPriceInCents(product.price_original!)}
            </span>
            <span className="text-base font-semibold text-foreground">
              {formatPriceInCents(product.price)}
            </span>
          </p>
        ) : (
          <p className="mt-2 text-base font-semibold text-foreground">
            {formatPriceInCents(product.price)}
          </p>
        )}

        {isLastUnits && (
          <p className="mt-1.5 inline-flex w-fit items-center rounded-full bg-link/15 px-2 py-0.5 text-[11px] font-semibold text-link">
            Últimas {product.stock} unidades
          </p>
        )}
        {isFewUnits && (
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            Poucas unidades disponíveis
          </p>
        )}
      </div>
    </Link>
  );
}
