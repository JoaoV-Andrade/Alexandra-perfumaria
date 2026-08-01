import type { OrderStatus } from "@/types/order";

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  aguardando_whatsapp: {
    label: "Aguardando WhatsApp",
    className: "bg-amber-50 text-amber-700",
  },
  pendente: {
    label: "Pendente",
    className: "bg-amber-50 text-amber-700",
  },
  pago: {
    label: "Pago",
    className: "bg-emerald-50 text-emerald-700",
  },
  enviado: {
    label: "Enviado",
    className: "bg-sky-50 text-sky-700",
  },
  recusado: {
    label: "Recusado",
    className: "bg-red-50 text-red-700",
  },
  cancelado: {
    label: "Cancelado",
    className: "bg-surface-alt text-muted-foreground",
  },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
