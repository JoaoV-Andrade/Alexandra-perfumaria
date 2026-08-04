import { ProductCard } from "@/components/product-card";
import type { Product } from "@/types/product";

// Fileira horizontal deslizável (scroll nativo, sem biblioteca de carrossel).
export function ProductRow({ products }: { products: Product[] }) {
  return (
    <div className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
      {products.map((product) => (
        <div key={product.id} className="w-40 shrink-0 snap-start sm:w-52">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
