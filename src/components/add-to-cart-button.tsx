"use client";

import { useEffect, useState } from "react";

import { useCart } from "@/lib/cart/cart-context";
import type { ProductDetail } from "@/types/product";

type AddToCartButtonProps = {
  product: Pick<
    ProductDetail,
    "id" | "name" | "brand" | "price" | "images" | "stock" | "volume_ml"
  >;
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const isOutOfStock = product.stock === 0;

  useEffect(() => {
    if (!justAdded) return;
    const timeout = window.setTimeout(() => setJustAdded(false), 1500);
    return () => window.clearTimeout(timeout);
  }, [justAdded]);

  function handleClick() {
    addItem({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.images[0] ?? null,
      volumeMl: product.volume_ml,
    });
    setJustAdded(true);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isOutOfStock}
      className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:bg-surface-alt disabled:text-muted-foreground"
    >
      {isOutOfStock
        ? "Esgotado"
        : justAdded
          ? "Adicionado!"
          : "Adicionar ao carrinho"}
    </button>
  );
}
