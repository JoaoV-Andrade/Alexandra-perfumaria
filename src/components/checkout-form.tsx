"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import {
  CheckoutAddressFields,
  type AddressFormValues,
} from "@/components/checkout-address-fields";
import {
  CheckoutCustomerFields,
  type CustomerInfo,
} from "@/components/checkout-customer-fields";
import { CheckoutTotals } from "@/components/checkout-totals";
import { EmptyState } from "@/components/empty-state";
import { FormMessage } from "@/components/form-message";
import {
  ShippingCalculator,
  type ShippingOption,
} from "@/components/shipping-calculator";
import { useCart } from "@/lib/cart/cart-context";
import { formatPriceInCents } from "@/lib/format";

const EMPTY_CUSTOMER: CustomerInfo = { name: "", phone: "", email: "" };
const EMPTY_ADDRESS: AddressFormValues = {
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
};

export function CheckoutForm() {
  const { items, totalPrice } = useCart();

  const [shipping, setShipping] = useState<ShippingOption | null>(null);
  const [postalCode, setPostalCode] = useState("");
  const [customer, setCustomer] = useState<CustomerInfo>(EMPTY_CUSTOMER);
  const [address, setAddress] = useState<AddressFormValues>(EMPTY_ADDRESS);

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
          className="inline-flex h-11 items-center justify-center rounded-full bg-[image:var(--gold-gradient)] px-6 text-sm font-semibold text-accent-foreground transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
        >
          Ver produtos
        </Link>
      </div>
    );
  }

  function updateCustomer(field: keyof CustomerInfo, value: string) {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  }

  function updateAddress(field: keyof AddressFormValues, value: string) {
    setAddress((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!shipping) {
      setStatus("error");
      setErrorMessage(
        "Calcule e escolha uma forma de envio antes de continuar.",
      );
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customer.name,
          customer_phone: customer.phone,
          customer_email: customer.email,
          address: {
            postal_code: postalCode,
            ...address,
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
        setErrorMessage(
          data.error ?? "Não foi possível continuar para o pagamento.",
        );
        return;
      }

      // Redireciona para o Checkout Pro do Mercado Pago.
      window.location.href = data.initPoint;
    } catch {
      setStatus("error");
      setErrorMessage(
        "Não foi possível continuar para o pagamento. Tente novamente.",
      );
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
              {item.quantity}x {item.name}{" "}
              <span className="text-muted-foreground">
                (decante {item.volumeMl}ml)
              </span>
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

      <CheckoutCustomerFields value={customer} onChange={updateCustomer} />

      <CheckoutAddressFields
        postalCode={postalCode}
        addressReady={addressReady}
        value={address}
        onChange={updateAddress}
      />

      {status === "error" && <FormMessage message={errorMessage} />}

      <CheckoutTotals subtotal={totalPrice} shipping={shipping} total={total} />

      <button
        type="submit"
        disabled={status === "loading" || !addressReady}
        className="inline-flex h-11 items-center justify-center rounded-full bg-[image:var(--gold-gradient)] px-6 text-sm font-semibold text-accent-foreground transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Redirecionando..." : "Pagar com Mercado Pago"}
      </button>
    </form>
  );
}
