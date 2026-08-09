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
    <div className="relative">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface">
        <ProductImage
          src={selectedImage}
          alt={productName}
          sizes="(min-width: 768px) 50vw, 100vw"
          priority
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-3 -top-3 z-10 h-20 w-20 overflow-hidden rounded-full shadow-md sm:-left-4 sm:-top-4 sm:h-24 sm:w-24 md:-left-5 md:-top-5 md:h-28 md:w-28"
      >
        <Image
          src="/decante-badge.png"
          alt=""
          fill
          sizes="112px"
          className="object-cover"
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
                  ? "border-link"
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
