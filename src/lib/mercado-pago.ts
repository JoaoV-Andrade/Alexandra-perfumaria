export type PreferenceItem = {
  id: string;
  title: string;
  quantity: number;
  unitPrice: number; // centavos
};

type CreatePreferenceParams = {
  orderId: string;
  items: PreferenceItem[];
  payerName: string;
  payerEmail: string;
  payerPhone: string; // só dígitos
};

export type CreatePreferenceResult =
  | { ok: true; preferenceId: string; initPoint: string }
  | { ok: false; error: string };

function splitName(fullName: string) {
  const trimmed = fullName.trim();
  const firstSpace = trimmed.indexOf(" ");
  if (firstSpace === -1) return { firstName: trimmed, lastName: "" };
  return {
    firstName: trimmed.slice(0, firstSpace),
    lastName: trimmed.slice(firstSpace + 1),
  };
}

function splitPhone(digits: string) {
  return { areaCode: digits.slice(0, 2), number: digits.slice(2) };
}

// Cria uma preference do Mercado Pago Checkout Pro (redirect). Ver
// https://www.mercadopago.com.br/developers/pt/reference/preferences/_checkout_preferences/post
export async function createCheckoutPreference({
  orderId,
  items,
  payerName,
  payerEmail,
  payerPhone,
}: CreatePreferenceParams): Promise<CreatePreferenceResult> {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!accessToken || !siteUrl) {
    return {
      ok: false,
      error:
        "Pagamento não está configurado. Defina MERCADO_PAGO_ACCESS_TOKEN e NEXT_PUBLIC_SITE_URL.",
    };
  }

  const { firstName, lastName } = splitName(payerName);
  const { areaCode, number } = splitPhone(payerPhone);

  const body = {
    items: items.map((item) => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      currency_id: "BRL",
      unit_price: item.unitPrice / 100,
    })),
    payer: {
      name: firstName,
      surname: lastName,
      email: payerEmail,
      phone: { area_code: areaCode, number },
    },
    external_reference: orderId,
    back_urls: {
      success: `${siteUrl}/checkout/retorno?pedido=${orderId}&status=sucesso`,
      pending: `${siteUrl}/checkout/retorno?pedido=${orderId}&status=pendente`,
      failure: `${siteUrl}/checkout/retorno?pedido=${orderId}&status=erro`,
    },
    // O Mercado Pago só aceita auto_return e notification_url com uma URL
    // pública (https); em desenvolvimento local (http://localhost) ele não
    // consegue alcançar nosso servidor, então omitimos os dois.
    ...(siteUrl.startsWith("https://")
      ? {
          auto_return: "approved",
          notification_url: `${siteUrl}/api/webhooks/mercadopago`,
        }
      : {}),
  };

  try {
    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error("Mercado Pago: falha ao criar preference", errorBody);
      return {
        ok: false,
        error: "Não foi possível iniciar o pagamento agora. Tente novamente.",
      };
    }

    const data = (await response.json().catch(() => null)) as {
      id?: string;
      init_point?: string;
      sandbox_init_point?: string;
    } | null;

    // O Mercado Pago sempre devolve as duas URLs; qual usar depende do
    // ambiente configurado (não dá pra saber pelo formato do token).
    const initPoint =
      process.env.MERCADO_PAGO_ENVIRONMENT === "production"
        ? data?.init_point
        : (data?.sandbox_init_point ?? data?.init_point);

    if (!data?.id || !initPoint) {
      return {
        ok: false,
        error: "Não foi possível iniciar o pagamento agora. Tente novamente.",
      };
    }

    return { ok: true, preferenceId: data.id, initPoint };
  } catch {
    return {
      ok: false,
      error: "Não foi possível iniciar o pagamento agora. Tente novamente.",
    };
  }
}
