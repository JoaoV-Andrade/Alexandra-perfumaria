import { formatPriceInCents } from "@/lib/format";
import type { OrderItemSnapshot } from "@/types/order";

type OrderSummaryListProps = {
  items: OrderItemSnapshot[];
  total: number;
};

export function OrderSummaryList({ items, total }: OrderSummaryListProps) {
  return (
    <div className="w-full rounded-2xl bg-surface p-4 text-left">
      <ul className="flex flex-col divide-y divide-surface-alt">
        {items.map((item) => (
          <li
            key={item.product_id}
            className="flex items-center justify-between py-2 text-sm"
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
      <div className="mt-2 flex items-center justify-between border-t border-surface-alt pt-2">
        <span className="text-sm font-medium text-foreground">Total</span>
        <span className="text-base font-semibold text-foreground">
          {formatPriceInCents(total)}
        </span>
      </div>
    </div>
  );
}
