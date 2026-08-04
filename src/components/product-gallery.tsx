"use client";

import Image from "next/image";
import { useState } from "react";

import { ProductImage } from "@/components/product-image";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface">
        <ProductImage
          src={selectedImage}
          alt={productName}
          sizes="(min-width: 768px) 50vw, 100vw"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Ver foto ${index + 1} de ${productName}`}
              aria-pressed={index === selectedIndex}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border transition-colors ${
                index === selectedIndex
                  ? "border-accent"
                  : "border-surface-alt hover:border-muted-foreground"
              }`}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
