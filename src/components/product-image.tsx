"use client";

import Image from "next/image";
import { useState } from "react";

import { BottleIcon } from "@/components/bottle-icon";

type ProductImageProps = {
  src: string | null | undefined;
  alt: string;
  sizes: string;
  priority?: boolean;
  imageClassName?: string;
  // Miniaturas pequenas (carrinho, admin): só o ícone, sem o nome do produto.
  compact?: boolean;
};

// Usado em todo lugar que mostra a foto de um produto (card, galeria,
// carrinho, painel admin). Sem foto cadastrada, ou se a foto falhar ao
// carregar, mostra sempre este placeholder — nunca um ícone de imagem
// quebrada do navegador.
export function ProductImage({
  src,
  alt,
  sizes,
  priority,
  imageClassName = "object-cover",
  compact = false,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-surface-alt px-2 text-center">
        <BottleIcon
          className={
            compact
              ? "h-4 w-4 text-muted-foreground/50"
              : "h-8 w-8 text-muted-foreground/50"
          }
        />
        {!compact && (
          <p className="line-clamp-2 text-[11px] leading-tight text-muted-foreground">
            {alt}
          </p>
        )}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={imageClassName}
      onError={() => setFailed(true)}
    />
  );
}
