import { formatPriceInCents } from "@/lib/format";
import type { OrderItemSnapshot } from "@/types/order";

type OrderForEmail = {
  id: string;
  customer_name: string;
  customer_phone: string;
  items: OrderItemSnapshot[];
  subtotal: number;
  shipping_cost: number;
  total: number;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Avisa a administradora por e-mail quando um pedido é confirmado como pago.
// Nunca lança erro: uma falha no envio do aviso não pode derrubar o webhook
// que já confirmou o pagamento.
export async function sendNewOrderEmail(order: OrderForEmail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;

  if (!apiKey || !notifyEmail) {
    console.error(
      "Aviso de pedido: RESEND_API_KEY ou NOTIFY_EMAIL não configurados.",
    );
    return;
  }

  const itemsHtml = order.items
    .map((item) => {
      const itemTotal = formatPriceInCents(item.price * item.quantity);
      return `<li>${item.quantity}x ${escapeHtml(item.name)} (${escapeHtml(item.brand)}, ${item.volume_ml}ml) — ${itemTotal}</li>`;
    })
    .join("");

  const html = `
    <h2>Novo pedido pago!</h2>
    <p><strong>Cliente:</strong> ${escapeHtml(order.customer_name)}</p>
    <p><strong>WhatsApp:</strong> ${escapeHtml(order.customer_phone)}</p>
    <ul>${itemsHtml}</ul>
    <p><strong>Subtotal:</strong> ${formatPriceInCents(order.subtotal)}</p>
    <p><strong>Frete:</strong> ${formatPriceInCents(order.shipping_cost)}</p>
    <p><strong>Total:</strong> ${formatPriceInCents(order.total)}</p>
    <p>Pedido #${order.id}</p>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Alexandra Perfumaria <onboarding@resend.dev>",
        to: notifyEmail,
        subject: `Novo pedido pago — ${order.customer_name}`,
        html,
      }),
    });

    if (!response.ok) {
      console.error(
        "Aviso de pedido: falha ao enviar e-mail",
        await response.text(),
      );
    }
  } catch (error) {
    console.error("Aviso de pedido: erro ao enviar e-mail", error);
  }
}
