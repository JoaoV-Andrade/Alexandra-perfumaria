import { ProductCard } from "@/components/product-card";
import type { Product } from "@/types/product";

export function ProductGrid({
  products,
  showDecantBadge,
}: {
  products: Product[];
  showDecantBadge?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showDecantBadge={showDecantBadge}
        />
      ))}
    </div>
  );
}
