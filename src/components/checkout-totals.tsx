import type { ShippingOption } from "@/components/shipping-calculator";
import { formatPriceInCents } from "@/lib/format";

type CheckoutTotalsProps = {
  subtotal: number;
  shipping: ShippingOption | null;
  total: number;
};

export function CheckoutTotals({ subtotal, shipping, total }: CheckoutTotalsProps) {
  return (
    <div className="flex flex-col gap-2 border-t border-surface-alt pt-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Subtotal</span>
        <span>{formatPriceInCents(subtotal)}</span>
      </div>

      {shipping && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Frete (Correios · {shipping.name})
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
  );
}
