import Link from "next/link";

import { ORDER_STATUSES, type OrderStatus } from "@/types/order";

import { ORDER_STATUS_LABELS } from "./order-status-badge";

export function StatusFilter({ current }: { current: OrderStatus | null }) {
  const options: { value: OrderStatus | null; label: string }[] = [
    { value: null, label: "Todos" },
    ...ORDER_STATUSES.map((status) => ({
      value: status,
      label: ORDER_STATUS_LABELS[status],
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option.value === current;
        const href = option.value
          ? `/admin/pedidos?status=${option.value}`
          : "/admin/pedidos";

        return (
          <Link
            key={option.label}
            href={href}
            className={`inline-flex h-11 items-center justify-center rounded-full px-4 text-sm font-medium transition-colors ${
              isActive
                ? "bg-accent text-accent-foreground"
                : "bg-surface text-foreground hover:bg-surface-alt"
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
