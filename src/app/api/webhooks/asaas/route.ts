import crypto from "node:crypto";

import { NextResponse } from "next/server";

import { getPaymentsByCheckoutId } from "@/lib/asaas";
import { sendNewOrderEmail } from "@/lib/notify-order-email";
import { createAdminClient } from "@/lib/supabase/admin";
import type { OrderAddress, OrderItemSnapshot } from "@/types/order";

// Cancela/rejeita o pedido sem baixar estoque quando o checkout não foi pago.
const CLOSED_STATUS_MAP: Record<string, "cancelado"> = {
  CHECKOUT_CANCELED: "cancelado",
  CHECKOUT_EXPIRED: "cancelado",
};

// Confere se o token recebido bate com o configurado no cadastro do webhook
// (painel/API do Asaas). Comparação em tempo constante pra evitar timing attack.
function isValidToken(received: string, expected: string): boolean {
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);
  if (receivedBuffer.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
}

export async function POST(request: Request) {
  const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN;
  const receivedToken = request.headers.get("asaas-access-token");

  if (!expectedToken || !receivedToken || !isValidToken(receivedToken, expectedToken)) {
    return NextResponse.json({ error: "Token inválido." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    event?: string;
    checkout?: { id?: string };
  } | null;

  const eventType = body?.event;
  const checkoutId = body?.checkout?.id;

  if (!eventType || !checkoutId) {
    return NextResponse.json({ received: true });
  }

  const supabase = createAdminClient();

  // Status que contam como "pago" de verdade na Asaas (RECEIVED = Pix/dinheiro
  // confirmado na hora, CONFIRMED = cartão aprovado, RECEIVED_IN_CASH =
  // baixa manual). Qualquer outro status não confirma o pedido.
  const PAID_STATUSES = new Set(["RECEIVED", "CONFIRMED", "RECEIVED_IN_CASH"]);

  if (eventType === "CHECKOUT_PAID") {
    // Nunca confia no corpo da notificação: a Asaas não tem um GET de
    // checkout por id, então a confirmação de verdade é consultar o(s)
    // pagamento(s) real(is) gerado(s) a partir desse checkout. No cartão
    // parcelado vem uma linha por parcela, cada uma só com o valor daquela
    // parcela — todas confirmam juntas na hora da compra (o cartão aprova a
    // compra inteira de uma vez, só o repasse do dinheiro que é escalonado).
    const payments = await getPaymentsByCheckoutId(checkoutId);
    if (payments.length === 0) {
      return NextResponse.json(
        { error: "Pagamento não encontrado para esse checkout." },
        { status: 404 },
      );
    }

    const allPaid = payments.every((p) => PAID_STATUSES.has(p.status));
    if (!allPaid) {
      return NextResponse.json({ received: true });
    }

    // A Asaas não propaga o externalReference do checkout pro pagamento
    // gerado a partir dele (testado direto na API: vem sempre null) — por
    // isso a ligação com o pedido é feita pelo checkout_id, que a gente
    // mesmo salva no pedido no momento em que cria o checkout.
    const { data: order } = await supabase
      .from("orders")
      .select(
        "id, customer_name, customer_phone, address, items, subtotal, shipping_cost, total",
      )
      .eq("checkout_id", checkoutId)
      .maybeSingle<{
        id: string;
        customer_name: string;
        customer_phone: string;
        address: OrderAddress | null;
        items: OrderItemSnapshot[];
        subtotal: number;
        shipping_cost: number;
        total: number;
      }>();

    if (!order) {
      console.error(`Webhook Asaas: nenhum pedido com checkout_id ${checkoutId}`);
      return NextResponse.json({ received: true });
    }

    const orderId = order.id;

    // Confere o valor recebido de verdade contra o total salvo antes de
    // confirmar. Nunca aprova um pedido cujo valor não bate — só loga para
    // investigação manual (mesmo princípio de segurança que tínhamos com o
    // Mercado Pago).
    const receivedAmountCents = Math.round(
      payments.reduce((sum, p) => sum + p.value, 0) * 100,
    );
    if (receivedAmountCents !== order.total) {
      console.error(
        `Webhook Asaas: valor do pagamento (${receivedAmountCents}) difere do total do pedido ${orderId} (${order.total}). Pagamento não confirmado automaticamente.`,
      );
      return NextResponse.json({ received: true });
    }

    const { error } = await supabase.rpc("mark_order_paid", {
      p_order_id: orderId,
      p_payment_id: payments[0].id,
    });

    if (error) {
      console.error("Webhook Asaas: falha ao confirmar pagamento", error);
      return NextResponse.json(
        { error: "Falha ao confirmar pagamento." },
        { status: 500 },
      );
    }

    await sendNewOrderEmail(order);
  } else {
    const mappedStatus = CLOSED_STATUS_MAP[eventType];

    if (mappedStatus) {
      // Só regride pedidos ainda "pendente": evita que uma notificação
      // atrasada derrube um pedido que já foi confirmado como pago.
      await supabase
        .from("orders")
        .update({ status: mappedStatus })
        .eq("checkout_id", checkoutId)
        .eq("status", "pendente");
    }
  }

  return NextResponse.json({ received: true });
}
