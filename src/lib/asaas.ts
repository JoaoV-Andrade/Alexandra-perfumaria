import type { OrderAddress } from "@/types/order";

export type CheckoutItem = {
  id: string;
  title: string;
  quantity: number;
  unitPrice: number; // centavos
};

type CreateCheckoutParams = {
  orderId: string;
  items: CheckoutItem[];
  payerName: string;
  payerEmail: string;
  payerPhone: string; // só dígitos
  payerCpf: string; // só dígitos
  payerAddress: OrderAddress;
  shippingCost?: number; // centavos — vira uma linha própria ("Frete")
};

export type CreateCheckoutResult =
  | { ok: true; checkoutId: string; link: string }
  | { ok: false; error: string };

function apiBase() {
  return process.env.ASAAS_ENVIRONMENT === "production"
    ? "https://api.asaas.com/v3"
    : "https://api-sandbox.asaas.com/v3";
}

// Cria um Asaas Checkout (página de pagamento hospedada, com Pix e cartão).
// Ver https://docs.asaas.com/docs/checkout-asaas
export async function createCheckout({
  orderId,
  items,
  payerName,
  payerEmail,
  payerPhone,
  payerCpf,
  payerAddress,
  shippingCost,
}: CreateCheckoutParams): Promise<CreateCheckoutResult> {
  const apiKey = process.env.ASAAS_API_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!apiKey || !siteUrl) {
    return {
      ok: false,
      error: "Pagamento não está configurado. Defina ASAAS_API_KEY e NEXT_PUBLIC_SITE_URL.",
    };
  }

  const checkoutItems = items.map((item) => ({
    name: item.title.slice(0, 30),
    description: item.title.slice(0, 150),
    quantity: item.quantity,
    value: item.unitPrice / 100,
  }));

  if (shippingCost && shippingCost > 0) {
    checkoutItems.push({
      name: "Frete",
      description: "Frete",
      quantity: 1,
      value: shippingCost / 100,
    });
  }

  const body = {
    billingTypes: ["PIX", "CREDIT_CARD"],
    chargeTypes: ["DETACHED", "INSTALLMENT"],
    // Permite parcelar no cartão em até 6x (o cliente também pode optar por
    // pagar à vista, no Pix ou no cartão).
    installment: { maxInstallmentCount: 6 },
    minutesToExpire: 60,
    externalReference: orderId,
    items: checkoutItems,
    // A Asaas exige o endereço completo do pagador aqui (testado direto na
    // API: sem isso a criação do checkout falha com "campo X deve ser
    // informado"). O telefone tem que ir em "mobilePhone" — "phone" é só
    // pra telefone fixo e é rejeitado com um celular de 11 dígitos.
    customerData: {
      name: payerName,
      cpfCnpj: payerCpf,
      email: payerEmail,
      mobilePhone: payerPhone,
      address: payerAddress.street,
      addressNumber: payerAddress.number,
      complement: payerAddress.complement,
      province: payerAddress.neighborhood,
      postalCode: payerAddress.postal_code,
      city: payerAddress.city,
    },
    callback: {
      successUrl: `${siteUrl}/checkout/retorno?pedido=${orderId}&status=sucesso`,
      cancelUrl: `${siteUrl}/checkout/retorno?pedido=${orderId}&status=erro`,
      expiredUrl: `${siteUrl}/checkout/retorno?pedido=${orderId}&status=erro`,
    },
  };

  try {
    const response = await fetch(`${apiBase()}/checkouts`, {
      method: "POST",
      headers: {
        access_token: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error("Asaas: falha ao criar checkout", errorBody);
      return {
        ok: false,
        error: "Não foi possível iniciar o pagamento agora. Tente novamente.",
      };
    }

    const data = (await response.json().catch(() => null)) as {
      id?: string;
      link?: string;
    } | null;

    if (!data?.id || !data?.link) {
      return {
        ok: false,
        error: "Não foi possível iniciar o pagamento agora. Tente novamente.",
      };
    }

    return { ok: true, checkoutId: data.id, link: data.link };
  } catch {
    return {
      ok: false,
      error: "Não foi possível iniciar o pagamento agora. Tente novamente.",
    };
  }
}

export type AsaasPayment = {
  id: string;
  status: string; // "PENDING" | "RECEIVED" | "CONFIRMED" | "OVERDUE" | ...
  value: number;
};

// A Asaas não tem um GET /checkouts/{id} (testado direto na API: devolve
// 404). A forma documentada de confirmar o pagamento de um checkout é
// consultar o pagamento real gerado a partir dele, filtrando por
// checkoutSession — nunca confiar só no corpo da notificação do webhook
// (mesmo princípio de segurança que já usávamos com o Mercado Pago). O
// pagamento não carrega o externalReference do checkout (testado: vem
// sempre null), então a ligação com o pedido é feita à parte, pelo
// checkout_id salvo no próprio pedido.
// No cartão parcelado a Asaas cria um pagamento por parcela (cada um só com
// o valor daquela parcela, não o total) — por isso sempre devolve a lista
// inteira, nunca só o primeiro. Quem chama soma os valores pra conferir o
// total do pedido.
export async function getPaymentsByCheckoutId(
  checkoutId: string,
): Promise<AsaasPayment[]> {
  const apiKey = process.env.ASAAS_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch(
      `${apiBase()}/payments?checkoutSession=${checkoutId}`,
      { headers: { access_token: apiKey }, cache: "no-store" },
    );

    if (!response.ok) return [];

    const data = (await response.json()) as { data?: AsaasPayment[] } | null;
    return data?.data ?? [];
  } catch {
    return [];
  }
}
