import Image from "next/image";
import Link from "next/link";

import { formatPriceInCents } from "@/lib/format";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const isOutOfStock = product.stock === 0;
  const imageUrl = product.images[0];

  return (
    <Link
      href={`/produto/${product.id}`}
      className="group block overflow-hidden rounded-2xl border border-surface-alt bg-background transition-shadow hover:shadow-lg hover:shadow-accent/10"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-surface">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            Sem foto
          </div>
        )}

        {isOutOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-foreground px-2.5 py-1 text-xs font-medium text-background">
            Esgotado
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
        <p className="mt-2 text-base font-semibold text-foreground">
          {formatPriceInCents(product.price)}
        </p>
      </div>
    </Link>
  );
}
