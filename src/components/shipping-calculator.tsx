"use client";

import { useState, type KeyboardEvent } from "react";

import { FormMessage } from "@/components/form-message";
import { useCart } from "@/lib/cart/cart-context";
import { formatPriceInCents } from "@/lib/format";

export type ShippingOption = {
  id: string;
  name: string;
  price: number; // centavos
  deliveryDays: number | null;
};

type ShippingCalculatorProps = {
  selectedOption: ShippingOption | null;
  onSelect: (option: ShippingOption | null) => void;
  onPostalCodeCalculated?: (postalCode: string) => void;
};

export function ShippingCalculator({
  selectedOption,
  onSelect,
  onPostalCodeCalculated,
}: ShippingCalculatorProps) {
  const { items } = useCart();
  const [postalCode, setPostalCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [options, setOptions] = useState<ShippingOption[]>([]);

  async function handleCalculate() {
    onSelect(null);
    setOptions([]);

    const sanitized = postalCode.replace(/\D/g, "");
    if (sanitized.length !== 8) {
      setStatus("error");
      setErrorMessage("Digite um CEP válido, com 8 números.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/frete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postal_code: sanitized,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "Não foi possível calcular o frete.");
        return;
      }

      if (!data.options || data.options.length === 0) {
        setStatus("error");
        setErrorMessage("Nenhuma opção de frete disponível para esse CEP.");
        return;
      }

      setOptions(data.options as ShippingOption[]);
      setStatus("idle");
      onPostalCodeCalculated?.(sanitized);
    } catch {
      setStatus("error");
      setErrorMessage(
        "Não foi possível calcular o frete agora. Tente novamente.",
      );
    }
  }

  return (
    <div className="flex flex-col gap-4 border-t border-surface-alt pt-6">
      <p className="text-sm font-medium text-foreground">Calcular frete</p>

      {/* Não é um <form>: este componente pode ser usado dentro do formulário
          de checkout, e HTML não permite <form> dentro de <form>. */}
      <div className="flex gap-3">
        <input
          type="text"
          inputMode="numeric"
          value={postalCode}
          onChange={(event) => setPostalCode(event.target.value)}
          onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleCalculate();
            }
          }}
          placeholder="00000-000"
          maxLength={9}
          className="min-h-11 flex-1 rounded-lg border border-muted-foreground/30 bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="button"
          onClick={handleCalculate}
          disabled={status === "loading"}
          className="inline-flex h-11 items-center justify-center rounded-full border border-muted-foreground/30 px-5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Calculando..." : "Calcular"}
        </button>
      </div>

      {status === "error" && <FormMessage message={errorMessage} />}

      {options.length > 0 && (
        <div className="flex flex-col gap-2">
          {options.map((option) => (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 text-sm transition-colors ${
                selectedOption?.id === option.id
                  ? "border-link bg-surface"
                  : "border-muted-foreground/30 hover:bg-surface-alt"
              }`}
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shipping-option"
                  checked={selectedOption?.id === option.id}
                  onChange={() => onSelect(option)}
                  className="h-4 w-4 accent-accent"
                />
                <span className="flex flex-col">
                  <span className="font-medium text-foreground">
                    Correios · {option.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {option.deliveryDays
                      ? `Chega em até ${option.deliveryDays} dia${option.deliveryDays > 1 ? "s" : ""} útil(eis)`
                      : "Prazo não informado"}
                  </span>
                </span>
              </span>
              <span className="whitespace-nowrap font-semibold text-foreground">
                {formatPriceInCents(option.price)}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
