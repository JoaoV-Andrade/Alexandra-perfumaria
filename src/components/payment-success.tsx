import Link from "next/link";

import { OrderSummaryList } from "@/components/order-summary-list";
import type { OrderItemSnapshot } from "@/types/order";

type PaymentSuccessProps = {
  items: OrderItemSnapshot[] | null;
  total: number | null;
};

export function PaymentSuccess({ items, total }: PaymentSuccessProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0f172a"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8"
          aria-hidden="true"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-2xl font-semibold text-foreground">
        Pagamento aprovado!
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Recebemos seu pedido e já vamos começar a preparar tudo. Você recebe
        novidades sobre o envio pelo WhatsApp.
      </p>

      {items && total !== null && <OrderSummaryList items={items} total={total} />}

      <Link
        href="/"
        className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Ver mais produtos
      </Link>
    </div>
  );
}
