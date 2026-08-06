"use client";

import { useState, type FormEvent } from "react";

import { FormMessage } from "@/components/form-message";
import type { ShippingOption } from "@/components/shipping-calculator";
import { useCart } from "@/lib/cart/cart-context";
import { formatPriceInCents } from "@/lib/format";
import { FIELD_CLASS } from "@/lib/ui";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

type OrderItem = {
  name: string;
  brand: string;
  price: number;
  volume_ml: number;
  quantity: number;
};

type WhatsAppCheckoutProps = {
  shipping: ShippingOption | null;
};

export function WhatsAppCheckout({ shipping }: WhatsAppCheckoutProps) {
  const { items, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          customer_phone: customerPhone,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          shipping_cost: shipping?.price ?? 0,
          shipping_service: shipping
            ? `${shipping.company} - ${shipping.name}`
            : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "Não foi possível finalizar o pedido.");
        return;
      }

      const message = buildWhatsAppMessage({
        customerName,
        items: data.items as OrderItem[],
        subtotal: data.subtotal as number,
        shippingCost: data.shippingCost as number,
        shippingService: data.shippingService as string | null,
        total: data.total as number,
      });

      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
        "_blank",
      );

      clearCart();
      setCustomerName("");
      setCustomerPhone("");
      setStatus("idle");
    } catch {
      setStatus("error");
      setErrorMessage("Não foi possível finalizar o pedido. Tente novamente.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 border-t border-surface-alt pt-6"
    >
      <p className="text-sm font-medium text-foreground">
        Finalizar pelo WhatsApp
      </p>

      {status === "error" && <FormMessage message={errorMessage} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Seu nome</span>
          <input
            type="text"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            required
            className={FIELD_CLASS}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Seu WhatsApp</span>
          <input
            type="tel"
            value={customerPhone}
            onChange={(event) => setCustomerPhone(event.target.value)}
            placeholder="(61) 99999-9999"
            required
            className={FIELD_CLASS}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex h-11 items-center justify-center rounded-full bg-[image:var(--gold-gradient)] px-6 text-sm font-semibold text-accent-foreground transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Enviando..." : "Compre pelo Whatsapp sem taxa"}
      </button>
    </form>
  );
}

function buildWhatsAppMessage({
  customerName,
  items,
  subtotal,
  shippingCost,
  shippingService,
  total,
}: {
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  shippingService: string | null;
  total: number;
}): string {
  const lines = items.map(
    (item) =>
      `${item.quantity}x ${item.name} - decante ${item.volume_ml}ml (${item.brand}) - ${formatPriceInCents(item.price * item.quantity)}`,
  );

  const totalsLines =
    shippingCost > 0
      ? [
          `Subtotal: ${formatPriceInCents(subtotal)}`,
          `Frete${shippingService ? ` (${shippingService})` : ""}: ${formatPriceInCents(shippingCost)}`,
          `Total: ${formatPriceInCents(total)}`,
        ]
      : [`Total: ${formatPriceInCents(total)}`];

  return [
    "Olá! Gostaria de fazer o seguinte pedido:",
    "",
    ...lines,
    "",
    ...totalsLines,
    "",
    `Nome: ${customerName}`,
  ].join("\n");
}
