"use client";

import Link from "next/link";
import { useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { ProductImage } from "@/components/product-image";
import {
  ShippingCalculator,
  type ShippingOption,
} from "@/components/shipping-calculator";
import { WhatsAppCheckout } from "@/components/whatsapp-checkout";
import { useCart } from "@/lib/cart/cart-context";
import { formatPriceInCents } from "@/lib/format";

export function CartSummary() {
  const { items, totalPrice, removeItem, setQuantity } = useCart();
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null);
  const total = totalPrice + (selectedShipping?.price ?? 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6">
        <EmptyState
          title="Seu carrinho está vazio"
          description="Adicione perfumes ao carrinho para vê-los aqui."
        />
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-full bg-[image:var(--gold-gradient)] px-6 text-sm font-semibold text-accent-foreground transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
        >
          Ver produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col divide-y divide-surface-alt">
        {items.map((item) => (
          <li key={item.productId} className="flex gap-4 py-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface">
              <ProductImage
                src={item.image}
                alt={item.name}
                sizes="80px"
                compact
              />
            </div>

            <div className="flex flex-1 flex-col">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {item.brand}
              </p>
              <p className="text-sm font-medium text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                Decante {item.volumeMl}ml
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatPriceInCents(item.price)} / un.
              </p>

              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(item.productId, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    aria-label={`Diminuir quantidade de ${item.name}`}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-muted-foreground/30 text-foreground transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm text-foreground">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(item.productId, item.quantity + 1)
                    }
                    aria-label={`Aumentar quantidade de ${item.name}`}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-muted-foreground/30 text-foreground transition-colors hover:bg-surface-alt"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  Remover
                </button>
              </div>
            </div>

            <p className="whitespace-nowrap text-sm font-semibold text-foreground">
              {formatPriceInCents(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <ShippingCalculator
        selectedOption={selectedShipping}
        onSelect={setSelectedShipping}
      />

      <div className="flex flex-col gap-2 border-t border-surface-alt pt-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatPriceInCents(totalPrice)}</span>
        </div>

        {selectedShipping && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Frete (Correios · {selectedShipping.name})</span>
            <span>{formatPriceInCents(selectedShipping.price)}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-foreground">Total</span>
          <span className="text-xl font-semibold text-foreground">
            {formatPriceInCents(total)}
          </span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="inline-flex h-11 items-center justify-center rounded-full bg-[image:var(--gold-gradient)] px-6 text-sm font-semibold text-accent-foreground transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
      >
        Pagar com cartão
      </Link>

      <WhatsAppCheckout shipping={selectedShipping} />
    </div>
  );
}
