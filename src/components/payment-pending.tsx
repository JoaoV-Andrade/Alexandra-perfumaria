import { OrderSummaryList } from "@/components/order-summary-list";
import type { OrderItemSnapshot } from "@/types/order";

type PaymentPendingProps = {
  items: OrderItemSnapshot[] | null;
  total: number | null;
};

export function PaymentPending({ items, total }: PaymentPendingProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 text-foreground"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      </div>

      <h1 className="text-2xl font-semibold text-foreground">
        Falta pouco para finalizar
      </h1>

      <p className="max-w-sm text-sm text-muted-foreground">
        Estamos aguardando a confirmação do seu pagamento. Isso pode levar
        alguns minutos — você não precisa fazer nada agora, avisamos pelo
        WhatsApp assim que confirmar.
      </p>

      {items && total !== null && (
        <OrderSummaryList items={items} total={total} />
      )}
    </div>
  );
}
