"use client";

import { useMemo, useState } from "react";

import { ProductGrid } from "@/components/product-grid";
import type { Product } from "@/types/product";

type SortOrder = "recentes" | "menor-preco" | "maior-preco";

export function SortableProductGrid({ products }: { products: Product[] }) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("recentes");

  const sortedProducts = useMemo(() => {
    if (sortOrder === "recentes") return products;

    const sorted = [...products];
    sorted.sort((a, b) =>
      sortOrder === "menor-preco" ? a.price - b.price : b.price - a.price,
    );
    return sorted;
  }, [products, sortOrder]);

  return (
    <div>
      <div className="flex justify-end">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <span className="hidden sm:inline">Ordenar por</span>
          <span className="relative">
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value as SortOrder)}
              className="min-h-11 appearance-none rounded-full border border-link/40 bg-background py-2.5 pl-4 pr-9 text-sm font-medium text-foreground transition-colors hover:border-link focus:border-link focus:outline-none focus:ring-2 focus:ring-accent-gold-2/60"
            >
              <option value="recentes">Mais recentes</option>
              <option value="menor-preco">Menor preço</option>
              <option value="maior-preco">Maior preço</option>
            </select>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-link"
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </label>
      </div>

      <div className="mt-4">
        <ProductGrid products={sortedProducts} />
      </div>
    </div>
  );
}
