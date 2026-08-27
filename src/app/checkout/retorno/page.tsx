import type { Metadata } from "next";

import { PaymentError } from "@/components/payment-error";
import { PaymentPending } from "@/components/payment-pending";
import { PaymentSuccess } from "@/components/payment-success";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createAdminClient } from "@/lib/supabase/admin";
import type { OrderItemSnapshot, OrderStatus } from "@/types/order";

export const metadata: Metadata = {
  title: "Status do pagamento",
  robots: { index: false, follow: false },
};

type CheckoutRetornoPageProps = {
  searchParams: Promise<{ status?: string; pedido?: string }>;
};

type Outcome = "sucesso" | "pendente" | "erro";

// O status do Asaas só é confirmado de verdade pelo webhook, que atualiza o
// pedido no banco; a tela de retorno nunca decide sozinha, só reflete o que
// já está salvo.
function resolveOutcome(
  orderStatus: OrderStatus | undefined,
  fallback: string | undefined,
): Outcome {
  if (orderStatus === "pago") return "sucesso";
  if (orderStatus === "pendente") return "pendente";
  if (orderStatus === "recusado" || orderStatus === "cancelado") return "erro";

  if (fallback === "sucesso" || fallback === "pendente") return fallback;
  return "erro";
}

async function fetchOrderSummary(orderId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("items, total, status")
    .eq("id", orderId)
    .maybeSingle<{
      items: OrderItemSnapshot[];
      total: number;
      status: OrderStatus;
    }>();
  return data;
}

export default async function CheckoutRetornoPage({
  searchParams,
}: CheckoutRetornoPageProps) {
  const params = await searchParams;
  const order = params.pedido ? await fetchOrderSummary(params.pedido) : null;

  const outcome = resolveOutcome(order?.status, params.status);
  const items = order?.items ?? null;
  const total = order?.total ?? null;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-4 py-8">
        {outcome === "sucesso" && (
          <PaymentSuccess items={items} total={total} />
        )}

        {outcome === "pendente" && (
          <PaymentPending items={items} total={total} />
        )}

        {outcome === "erro" && <PaymentError />}
      </main>
      <SiteFooter />
    </>
  );
}
