"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { ProductImage } from "@/components/product-image";
import type { ProductAdmin } from "@/types/product";

import { toggleProductActive, updateProductPrice, updateProductStock } from "./actions";

const LOW_STOCK_THRESHOLD = 3;

const cellInputClass =
  "w-full rounded-lg border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30";

export function ProductRow({ product }: { product: ProductAdmin }) {
  const [confirmedPrice, setConfirmedPrice] = useState(product.price); // centavos
  const [confirmedStock, setConfirmedStock] = useState(product.stock);
  const [active, setActive] = useState(product.active);

  const [priceInput, setPriceInput] = useState((product.price / 100).toFixed(2));
  const [stockInput, setStockInput] = useState(String(product.stock));
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const lowStock = confirmedStock <= LOW_STOCK_THRESHOLD;

  function handlePriceBlur() {
    const reais = Number(priceInput.replace(",", "."));
    if (!Number.isFinite(reais) || reais < 0) {
      setPriceInput((confirmedPrice / 100).toFixed(2));
      return;
    }

    const cents = Math.round(reais * 100);
    if (cents === confirmedPrice) return;

    startTransition(async () => {
      const result = await updateProductPrice(product.id, reais);
      if (result.ok) {
        setConfirmedPrice(cents);
        setMessage(null);
      } else {
        setPriceInput((confirmedPrice / 100).toFixed(2));
        setMessage(result.message);
      }
    });
  }

  function handleStockBlur() {
    const stock = Number(stockInput);
    if (!Number.isInteger(stock) || stock < 0) {
      setStockInput(String(confirmedStock));
      return;
    }
    if (stock === confirmedStock) return;

    startTransition(async () => {
      const result = await updateProductStock(product.id, stock);
      if (result.ok) {
        setConfirmedStock(stock);
        setMessage(null);
      } else {
        setStockInput(String(confirmedStock));
        setMessage(result.message);
      }
    });
  }

  function handleToggleActive() {
    const next = !active;
    setActive(next);
    startTransition(async () => {
      const result = await toggleProductActive(product.id, next);
      if (!result.ok) {
        setActive(!next);
        setMessage(result.message);
      } else {
        setMessage(null);
      }
    });
  }

  return (
    <tr className={lowStock ? "bg-status-warning" : undefined}>
      <td className="p-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface">
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            sizes="48px"
            compact
          />
        </div>
      </td>

      <td className="p-3">
        <Link
          href={`/admin/produtos/${product.id}/editar`}
          className="text-sm font-medium text-foreground hover:underline"
        >
          {product.name}
        </Link>
        <p className="text-xs text-muted-foreground">{product.brand}</p>
        {message && (
          <p className="mt-1 text-xs text-status-danger-foreground">{message}</p>
        )}
      </td>

      <td className="p-3">
        <input
          type="text"
          inputMode="decimal"
          value={priceInput}
          onChange={(event) => setPriceInput(event.target.value)}
          onBlur={handlePriceBlur}
          disabled={isPending}
          className={`${cellInputClass} border-muted-foreground/30 text-foreground focus:border-accent`}
        />
      </td>

      <td className="p-3">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            value={stockInput}
            onChange={(event) => setStockInput(event.target.value)}
            onBlur={handleStockBlur}
            disabled={isPending}
            className={`${cellInputClass} w-20 ${
              lowStock
                ? "border-status-danger-foreground/30 font-semibold text-status-danger-foreground"
                : "border-muted-foreground/30 text-foreground focus:border-accent"
            }`}
          />
          {lowStock && (
            <span className="whitespace-nowrap text-xs font-medium text-status-danger-foreground">
              estoque baixo
            </span>
          )}
        </div>
      </td>

      <td className="p-3">
        <button
          type="button"
          role="switch"
          aria-checked={active}
          aria-label={active ? "Desativar produto" : "Ativar produto"}
          onClick={handleToggleActive}
          disabled={isPending}
          className={`inline-flex h-11 w-16 items-center rounded-full transition-colors ${
            active ? "bg-accent" : "bg-surface-alt"
          }`}
        >
          <span
            className={`h-8 w-8 rounded-full bg-background shadow transition-transform ${
              active ? "translate-x-7" : "translate-x-1"
            }`}
          />
        </button>
      </td>

      <td className="p-3 text-right">
        <Link
          href={`/admin/produtos/${product.id}/editar`}
          className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
        >
          Editar
        </Link>
      </td>
    </tr>
  );
}
