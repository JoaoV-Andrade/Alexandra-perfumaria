import type { SupabaseClient } from "@supabase/supabase-js";

export type ShippingQuoteItem = {
  productId: string;
  quantity: number;
};

export type ShippingQuoteOption = {
  id: string;
  name: string;
  company: string;
  price: number; // centavos
  deliveryDays: number | null;
};

export type ShippingQuoteResult =
  | { ok: true; options: ShippingQuoteOption[] }
  | { ok: false; status: number; error: string };

type MelhorEnvioOption = {
  id: number;
  name: string;
  price?: string;
  error?: string;
  delivery_time?: number;
  company?: { name?: string };
};

const FRIENDLY_UNAVAILABLE_MESSAGE =
  "Não foi possível calcular o frete agora. Tente novamente em instantes.";

function getMelhorEnvioBaseUrl() {
  return process.env.MELHOR_ENVIO_ENVIRONMENT === "production"
    ? "https://melhorenvio.com.br"
    : "https://sandbox.melhorenvio.com.br";
}

// Consulta o Melhor Envio para um CEP e itens. Usada tanto pela cotação
// exibida no carrinho quanto para revalidar o frete no fechamento do pedido.
export async function quoteShipping(
  supabase: SupabaseClient,
  { postalCode, items }: { postalCode: string; items: ShippingQuoteItem[] },
): Promise<ShippingQuoteResult> {
  const token = process.env.MELHOR_ENVIO_TOKEN;
  const originPostalCode = process.env.STORE_ORIGIN_POSTAL_CODE;

  if (!token || !originPostalCode) {
    return {
      ok: false,
      status: 500,
      error:
        "Cálculo de frete não está configurado. Defina MELHOR_ENVIO_TOKEN e STORE_ORIGIN_POSTAL_CODE.",
    };
  }

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, price, weight_g, length_cm, width_cm, height_cm")
    .in(
      "id",
      items.map((item) => item.productId),
    )
    .eq("active", true);

  if (productsError) {
    return {
      ok: false,
      status: 500,
      error: "Não foi possível verificar os produtos.",
    };
  }

  const meProducts = items
    .map((requested) => {
      const product = products?.find((p) => p.id === requested.productId);
      if (!product) return null;

      return {
        id: product.id,
        width: product.width_cm,
        height: product.height_cm,
        length: product.length_cm,
        weight: product.weight_g / 1000,
        insurance_value: product.price / 100,
        quantity: requested.quantity,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (meProducts.length === 0) {
    return {
      ok: false,
      status: 400,
      error: "Os produtos do carrinho não estão mais disponíveis.",
    };
  }

  try {
    const meResponse = await fetch(
      `${getMelhorEnvioBaseUrl()}/api/v2/me/shipment/calculate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "Alexandra Perfumaria (imobilmkt@gmail.com)",
        },
        body: JSON.stringify({
          from: { postal_code: originPostalCode },
          to: { postal_code: postalCode },
          products: meProducts,
        }),
      },
    );

    if (!meResponse.ok) {
      const errorBody = await meResponse.json().catch(() => null);
      const isInvalidPostalCode = Object.keys(errorBody?.errors ?? {}).some(
        (key) => key.includes("postal_code"),
      );

      return {
        ok: false,
        status: isInvalidPostalCode ? 400 : 502,
        error: isInvalidPostalCode
          ? "CEP inválido. Verifique e tente novamente."
          : FRIENDLY_UNAVAILABLE_MESSAGE,
      };
    }

    const data = (await meResponse.json().catch(() => null)) as
      MelhorEnvioOption[] | null;

    if (!Array.isArray(data)) {
      return { ok: false, status: 502, error: FRIENDLY_UNAVAILABLE_MESSAGE };
    }

    const options = data
      .filter((option) => !option.error && option.price)
      .map((option) => ({
        id: String(option.id),
        name: option.name,
        company: option.company?.name ?? "",
        price: Math.round(parseFloat(option.price!) * 100),
        deliveryDays: option.delivery_time ?? null,
      }));

    return { ok: true, options };
  } catch {
    return { ok: false, status: 502, error: FRIENDLY_UNAVAILABLE_MESSAGE };
  }
}
