import type { OrderStatus } from "@/types/order";

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> =
  {
    aguardando_whatsapp: {
      label: "Aguardando WhatsApp",
      className: "bg-status-warning text-status-warning-foreground",
    },
    pendente: {
      label: "Pendente",
      className: "bg-status-warning text-status-warning-foreground",
    },
    pago: {
      label: "Pago",
      className: "bg-status-success text-status-success-foreground",
    },
    enviado: {
      label: "Enviado",
      className: "bg-status-info text-status-info-foreground",
    },
    recusado: {
      label: "Recusado",
      className: "bg-status-danger text-status-danger-foreground",
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
