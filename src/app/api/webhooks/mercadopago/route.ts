import crypto from "node:crypto";

import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

// Status do Mercado Pago que rebaixamos direto no pedido (sem baixa de
// estoque). "approved" tem tratamento à parte, via mark_order_paid.
const REJECTED_STATUS_MAP: Record<string, "recusado" | "cancelado"> = {
  rejected: "recusado",
  cancelled: "cancelado",
};

// Confere se a notificação realmente veio do Mercado Pago. Ver
// https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/notifications/webhooks#editor_5
function isValidSignature({
  xSignature,
  xRequestId,
  dataId,
  secret,
}: {
  xSignature: string;
  xRequestId: string;
  dataId: string;
  secret: string;
}): boolean {
  const parts = new Map(
    xSignature.split(",").map((part) => {
      const [key, value] = part.split("=");
      return [key?.trim(), value?.trim()];
    }),
  );

  const ts = parts.get("ts");
  const receivedHash = parts.get("v1");
  if (!ts || !receivedHash) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${xRequestId};ts:${ts};`;
  const computedHash = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  // DEBUG temporario — remover depois de descobrir o problema de assinatura.
  console.error("Webhook MP: debug assinatura", {
    manifest,
    computedHash,
    receivedHash,
    match: computedHash === receivedHash,
    rawXSignature: xSignature,
    secretPreview: secret.slice(0, 6) + "..." + secret.slice(-6),
  });

  const computedBuffer = Buffer.from(computedHash, "hex");
  const receivedBuffer = Buffer.from(receivedHash, "hex");
  if (computedBuffer.length !== receivedBuffer.length) return false;

  return crypto.timingSafeEqual(computedBuffer, receivedBuffer);
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const dataId = url.searchParams.get("data.id");

  // Só nos interessa notificação de pagamento; outros tipos (ex.:
  // merchant_order) são apenas confirmados com 200 para o MP parar de reenviar.
  if (type !== "payment" || !dataId) {
    return NextResponse.json({ received: true });
  }

  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");

  if (
    !secret ||
    !xSignature ||
    !xRequestId ||
    !isValidSignature({ xSignature, xRequestId, dataId, secret })
  ) {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
  }

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json(
      { error: "Pagamento não está configurado." },
      { status: 500 },
    );
  }

  // Nunca confia no corpo da notificação: busca o pagamento de verdade na
  // API do Mercado Pago usando o id recebido.
  const paymentResponse = await fetch(
    `https://api.mercadopago.com/v1/payments/${dataId}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  if (!paymentResponse.ok) {
    return NextResponse.json({ error: "Pagamento não encontrado." }, { status: 404 });
  }

  const payment = (await paymentResponse.json()) as {
    id: number;
    status: string;
    external_reference?: string;
  };

  const orderId = payment.external_reference;
  if (!orderId) {
    return NextResponse.json({ received: true });
  }

  const supabase = createAdminClient();

  if (payment.status === "approved") {
    const { error } = await supabase.rpc("mark_order_paid", {
      p_order_id: orderId,
      p_payment_id: String(payment.id),
    });

    if (error) {
      console.error("Webhook Mercado Pago: falha ao confirmar pagamento", error);
      return NextResponse.json(
        { error: "Falha ao confirmar pagamento." },
        { status: 500 },
      );
    }
  } else {
    const mappedStatus = REJECTED_STATUS_MAP[payment.status];
    if (mappedStatus) {
      // Só regride pedidos ainda "pendente": evita que uma notificação
      // atrasada derrube um pedido que já foi confirmado como pago.
      await supabase
        .from("orders")
        .update({ status: mappedStatus, mp_payment_id: String(payment.id) })
        .eq("id", orderId)
        .eq("status", "pendente");
    }
  }

  return NextResponse.json({ received: true });
}
