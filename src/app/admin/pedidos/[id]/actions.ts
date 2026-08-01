"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type OrderActionState = {
  status: "idle" | "error";
  message?: string;
};

const initialErrorState: OrderActionState = {
  status: "error",
  message: "Sessão expirada. Faça login novamente.",
};

export async function markAsShipped(
  orderId: string,
  _prevState: OrderActionState,
  formData: FormData,
): Promise<OrderActionState> {
  const trackingCode = formData.get("tracking_code")?.toString().trim();
  if (!trackingCode) {
    return { status: "error", message: "Informe o código de rastreio." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return initialErrorState;

  // Só sai de "pago" pra "enviado" — evita marcar como enviado um pedido
  // que ainda não foi confirmado como pago.
  const { data, error } = await supabase
    .from("orders")
    .update({ status: "enviado", tracking_code: trackingCode })
    .eq("id", orderId)
    .eq("status", "pago")
    .select("id");

  if (error) {
    return { status: "error", message: "Não foi possível marcar como enviado." };
  }
  if (!data || data.length === 0) {
    return {
      status: "error",
      message: "Esse pedido não está mais como \"pago\" — atualize a página.",
    };
  }

  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath("/admin/pedidos");
  return { status: "idle" };
}

export async function cancelOrder(
  orderId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- assinatura exigida pelo useActionState
  _prevState: OrderActionState,
): Promise<OrderActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return initialErrorState;

  const { data, error } = await supabase
    .from("orders")
    .update({ status: "cancelado" })
    .eq("id", orderId)
    .in("status", ["aguardando_whatsapp", "pendente", "pago"])
    .select("id");

  if (error) {
    return { status: "error", message: "Não foi possível cancelar o pedido." };
  }
  if (!data || data.length === 0) {
    return {
      status: "error",
      message: "Esse pedido não pode mais ser cancelado — atualize a página.",
    };
  }

  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath("/admin/pedidos");
  return { status: "idle" };
}

export async function confirmWhatsappOrder(
  orderId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- assinatura exigida pelo useActionState
  _prevState: OrderActionState,
): Promise<OrderActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return initialErrorState;

  // Confere de novo o status direto no banco antes de baixar estoque — não
  // confia só no que a tela mostrava quando o botão foi clicado.
  const { data: order } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .maybeSingle();

  if (order?.status !== "aguardando_whatsapp") {
    return {
      status: "error",
      message: "Esse pedido não está mais aguardando confirmação do WhatsApp.",
    };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.rpc("mark_order_paid", {
    p_order_id: orderId,
    p_payment_id: null,
  });

  if (error) {
    return {
      status: "error",
      message: `Não foi possível confirmar o pedido: ${error.message}`,
    };
  }

  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath("/admin/pedidos");
  return { status: "idle" };
}
