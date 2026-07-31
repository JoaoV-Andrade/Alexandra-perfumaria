"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { EmptyState } from "@/components/empty-state";
import {
  ShippingCalculator,
  type ShippingOption,
} from "@/components/shipping-calculator";
import { BRAZILIAN_STATES } from "@/lib/brazilian-states";
import { useCart } from "@/lib/cart/cart-context";
import { formatPriceInCents } from "@/lib/format";

const inputClass =
  "min-h-11 rounded-lg border border-muted-foreground/30 bg-background px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:bg-surface disabled:text-muted-foreground";

export function CheckoutForm() {
  const { items, totalPrice } = useCart();

  const [shipping, setShipping] = useState<ShippingOption | null>(null);
  const [postalCode, setPostalCode] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const total = totalPrice + (shipping?.price ?? 0);
  const addressReady = postalCode.length === 8;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6">
        <EmptyState
          title="Seu carrinho está vazio"
          description="Adicione perfumes ao carrinho antes de continuar para o pagamento."
        />
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Ver produtos
        </Link>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!shipping) {
      setStatus("error");
      setErrorMessage("Calcule e escolha uma forma de envio antes de continuar.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail,
          address: {
            postal_code: postalCode,
            street,
            number,
            complement,
            neighborhood,
            city,
            state,
          },
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          shipping_option_id: shipping.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "Não foi possível continuar para o pagamento.");
        return;
      }

      // Redireciona para o Checkout Pro do Mercado Pago.
      window.location.href = data.initPoint;
    } catch {
      setStatus("error");
      setErrorMessage("Não foi possível continuar para o pagamento. Tente novamente.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <ul className="flex flex-col divide-y divide-surface-alt">
        {items.map((item) => (
          <li
            key={item.productId}
            className="flex items-center justify-between py-3 text-sm"
          >
            <span className="text-foreground">
              {item.quantity}x {item.name}
            </span>
            <span className="whitespace-nowrap font-medium text-foreground">
              {formatPriceInCents(item.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <ShippingCalculator
        selectedOption={shipping}
        onSelect={setShipping}
        onPostalCodeCalculated={setPostalCode}
      />

      <div className="flex flex-col gap-4 border-t border-surface-alt pt-6">
        <p className="text-sm font-medium text-foreground">Seus dados</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground">Nome completo</span>
            <input
              type="text"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              required
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground">WhatsApp</span>
            <input
              type="tel"
              value={customerPhone}
              onChange={(event) => setCustomerPhone(event.target.value)}
              placeholder="(61) 99999-9999"
              required
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
            <span className="font-medium text-foreground">E-mail</span>
            <input
              type="email"
              value={customerEmail}
              onChange={(event) => setCustomerEmail(event.target.value)}
              required
              className={inputClass}
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-surface-alt pt-6">
        <p className="text-sm font-medium text-foreground">
          Endereço de entrega
        </p>

        {!addressReady ? (
          <p className="text-sm text-muted-foreground">
            Calcule o frete acima para preencher o endereço de entrega.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">CEP</span>
              <input
                type="text"
                value={postalCode.replace(/(\d{5})(\d{3})/, "$1-$2")}
                disabled
                className={inputClass}
              />
            </label>

            <div />

            <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
              <span className="font-medium text-foreground">Rua</span>
              <input
                type="text"
                value={street}
                onChange={(event) => setStreet(event.target.value)}
                required
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">Número</span>
              <input
                type="text"
                value={number}
                onChange={(event) => setNumber(event.target.value)}
                required
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">
                Complemento (opcional)
              </span>
              <input
                type="text"
                value={complement}
                onChange={(event) => setComplement(event.target.value)}
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">Bairro</span>
              <input
                type="text"
                value={neighborhood}
                onChange={(event) => setNeighborhood(event.target.value)}
                required
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">Cidade</span>
              <input
                type="text"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                required
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">Estado</span>
              <select
                value={state}
                onChange={(event) => setState(event.target.value)}
                required
                className={inputClass}
              >
                <option value="" disabled>
                  Selecione
                </option>
                {BRAZILIAN_STATES.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>

      {status === "error" && (
        <p className="border-l-4 border-foreground bg-surface px-4 py-3 text-sm text-foreground">
          {errorMessage}
        </p>
      )}

      <div className="flex flex-col gap-2 border-t border-surface-alt pt-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatPriceInCents(totalPrice)}</span>
        </div>

        {shipping && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Frete ({shipping.company} · {shipping.name})
            </span>
            <span>{formatPriceInCents(shipping.price)}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-foreground">Total</span>
          <span className="text-xl font-semibold text-foreground">
            {formatPriceInCents(total)}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "loading" || !addressReady}
        className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Redirecionando..." : "Pagar com Mercado Pago"}
      </button>
    </form>
  );
}
