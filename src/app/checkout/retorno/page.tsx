import type { Metadata } from "next";

import { PaymentError } from "@/components/payment-error";
import { PaymentPending } from "@/components/payment-pending";
import { PaymentSuccess } from "@/components/payment-success";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPayment } from "@/lib/mercado-pago";
import { createAdminClient } from "@/lib/supabase/admin";
import type { OrderItemSnapshot } from "@/types/order";

export const metadata: Metadata = {
  title: "Status do pagamento",
  robots: { index: false, follow: false },
};

type CheckoutRetornoPageProps = {
  searchParams: Promise<{
    status?: string;
    pedido?: string;
    payment_id?: string;
    collection_id?: string;
  }>;
};

type Outcome = "sucesso" | "pendente" | "erro";

// O status na URL é só uma dica de para onde o Mercado Pago quis nos mandar
// no momento do redirecionamento; a verdade é sempre a consulta ao pagamento.
function resolveOutcome(
  paymentStatus: string | undefined,
  fallback: string | undefined,
): Outcome {
  if (paymentStatus === "approved") return "sucesso";
  if (
    paymentStatus === "pending" ||
    paymentStatus === "in_process" ||
    paymentStatus === "authorized"
  ) {
    return "pendente";
  }
  if (paymentStatus) return "erro";

  if (fallback === "sucesso" || fallback === "pendente") return fallback;
  return "erro";
}

async function fetchOrderSummary(orderId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("items, total")
    .eq("id", orderId)
    .maybeSingle<{ items: OrderItemSnapshot[]; total: number }>();
  return data;
}

export default async function CheckoutRetornoPage({
  searchParams,
}: CheckoutRetornoPageProps) {
  const params = await searchParams;
  const paymentId = params.payment_id ?? params.collection_id;

  const [order, payment] = await Promise.all([
    params.pedido ? fetchOrderSummary(params.pedido) : Promise.resolve(null),
    paymentId ? getPayment(paymentId) : Promise.resolve(null),
  ]);

  const outcome = resolveOutcome(payment?.status, params.status);
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
          <PaymentPending
            items={items}
            total={total}
            paymentTypeId={payment?.payment_type_id ?? null}
            qrCode={
              payment?.point_of_interaction?.transaction_data?.qr_code ?? null
            }
            qrCodeBase64={
              payment?.point_of_interaction?.transaction_data?.qr_code_base64 ??
              null
            }
            ticketUrl={
              payment?.point_of_interaction?.transaction_data?.ticket_url ??
              payment?.transaction_details?.external_resource_url ??
              null
            }
            expirationDate={payment?.date_of_expiration ?? null}
          />
        )}

        {outcome === "erro" && <PaymentError />}
      </main>
      <SiteFooter />
    </>
  );
}
