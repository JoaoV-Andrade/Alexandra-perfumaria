import crypto from "node:crypto";

import { NextResponse } from "next/server";

import { getPaymentByCheckoutId } from "@/lib/asaas";
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
    checkout?: { id?: string; externalReference?: string };
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
    // checkout por id, então a confirmação de verdade é consultar o
    // pagamento real gerado a partir desse checkout.
    const payment = await getPaymentByCheckoutId(checkoutId);
    if (!payment) {
      return NextResponse.json(
        { error: "Pagamento não encontrado para esse checkout." },
        { status: 404 },
      );
    }

    const orderId = payment.externalReference;
    if (!orderId || !PAID_STATUSES.has(payment.status)) {
      return NextResponse.json({ received: true });
    }

    const { data: order } = await supabase
      .from("orders")
      .select(
        "customer_name, customer_phone, address, items, subtotal, shipping_cost, total",
      )
      .eq("id", orderId)
      .maybeSingle<{
        customer_name: string;
        customer_phone: string;
        address: OrderAddress | null;
        items: OrderItemSnapshot[];
        subtotal: number;
        shipping_cost: number;
        total: number;
      }>();

    if (!order) {
      console.error(`Webhook Asaas: pedido ${orderId} não encontrado`);
      return NextResponse.json({ received: true });
    }

    // Confere o valor recebido de verdade contra o total salvo antes de
    // confirmar. Nunca aprova um pedido cujo valor não bate — só loga para
    // investigação manual (mesmo princípio de segurança que tínhamos com o
    // Mercado Pago).
    const receivedAmountCents = Math.round(payment.value * 100);
    if (receivedAmountCents !== order.total) {
      console.error(
        `Webhook Asaas: valor do pagamento (${receivedAmountCents}) difere do total do pedido ${orderId} (${order.total}). Pagamento não confirmado automaticamente.`,
      );
      return NextResponse.json({ received: true });
    }

    const { error } = await supabase.rpc("mark_order_paid", {
      p_order_id: orderId,
      p_payment_id: payment.id,
    });

    if (error) {
      console.error("Webhook Asaas: falha ao confirmar pagamento", error);
      return NextResponse.json(
        { error: "Falha ao confirmar pagamento." },
        { status: 500 },
      );
    }

    await sendNewOrderEmail({ id: orderId, ...order });
  } else {
    const mappedStatus = CLOSED_STATUS_MAP[eventType];
    // Cancelamento/expiração não move dinheiro nem baixa estoque — só fecha
    // um pedido que nunca chegou a ser pago, então aqui dá pra confiar no
    // externalReference que já vem no corpo da notificação.
    const orderId = body?.checkout?.externalReference;

    if (mappedStatus && orderId) {
      // Só regride pedidos ainda "pendente": evita que uma notificação
      // atrasada derrube um pedido que já foi confirmado como pago.
      await supabase
        .from("orders")
        .update({ status: mappedStatus, checkout_id: checkoutId })
        .eq("id", orderId)
        .eq("status", "pendente");
    }
  }

  return NextResponse.json({ received: true });
}
