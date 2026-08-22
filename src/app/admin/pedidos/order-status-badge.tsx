import type { OrderStatus } from "@/types/order";

// Rótulo em português de cada status — reaproveitado no filtro da listagem
// e no seletor de troca manual de status.
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  aguardando_whatsapp: "Aguardando WhatsApp",
  pendente: "Pendente",
  pago: "Pago",
  enviado: "Enviado",
  recusado: "Recusado",
  cancelado: "Cancelado",
};

const STATUS_CLASSNAME: Record<OrderStatus, string> = {
  aguardando_whatsapp: "bg-status-warning text-status-warning-foreground",
  pendente: "bg-status-warning text-status-warning-foreground",
  pago: "bg-status-success text-status-success-foreground",
  enviado: "bg-status-info text-status-info-foreground",
  recusado: "bg-status-danger text-status-danger-foreground",
  cancelado: "bg-surface-alt text-muted-foreground",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const label = ORDER_STATUS_LABELS[status];
  const className = STATUS_CLASSNAME[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
