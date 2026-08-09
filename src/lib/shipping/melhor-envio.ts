import type { SupabaseClient } from "@supabase/supabase-js";

export type ShippingQuoteItem = {
  productId: string;
  quantity: number;
};

export type ShippingQuoteOption = {
  id: string;
  name: string;
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
  custom_price?: string;
  error?: string;
  delivery_time?: number;
  custom_delivery_time?: number;
};

const MELHOR_ENVIO_BASE_URL = "https://melhorenvio.com.br/api/v2";
const REQUEST_TIMEOUT_MS = 10_000;
const CACHE_TTL_MS = 15 * 60 * 1000;

// A loja só posta pelos Correios (retirada manual na agência). Enviamos os
// serviços explicitamente (1 = PAC, 2 = SEDEX) para não depender de quais
// transportadoras estão contratadas na conta do Melhor Envio.
const CORREIOS_SERVICES = "1,2";

const FRIENDLY_UNAVAILABLE_MESSAGE =
  "Não foi possível calcular o frete agora. Tente novamente em instantes.";

// Cache simples em memória por (CEP + peso total), só para não estourar o
// limite de 250 requisições/minuto do Melhor Envio em picos de acesso. Como
// a Vercel reaproveita instâncias (Fluid Compute), esse cache normalmente
// sobrevive entre requisições próximas — mas não é garantido entre regiões
// ou instâncias novas, o que é aceitável aqui.
const quoteCache = new Map<
  string,
  { expiresAt: number; result: ShippingQuoteResult }
>();

function getCacheKey(postalCode: string, totalWeightG: number) {
  return `${postalCode}:${totalWeightG}`;
}

// Consulta o Melhor Envio para um CEP e itens. Usada tanto pela cotação
// exibida no carrinho quanto para revalidar o frete no fechamento do pedido.
export async function quoteShipping(
  supabase: SupabaseClient,
  { postalCode, items }: { postalCode: string; items: ShippingQuoteItem[] },
): Promise<ShippingQuoteResult> {
  const token = process.env.MELHORENVIO_TOKEN;
  const originPostalCode = process.env.CEP_ORIGEM;
  const contactEmail = process.env.MELHORENVIO_USER_AGENT_EMAIL;

  if (!token || !originPostalCode || !contactEmail) {
    return {
      ok: false,
      status: 500,
      error:
        "Cálculo de frete não está configurado. Defina MELHORENVIO_TOKEN, CEP_ORIGEM e MELHORENVIO_USER_AGENT_EMAIL.",
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

  const meItems = items
    .map((requested) => {
      const product = products?.find((p) => p.id === requested.productId);
      if (!product) return null;

      return {
        totalWeightG: product.weight_g * requested.quantity,
        meProduct: {
          id: product.id,
          width: product.width_cm,
          height: product.height_cm,
          length: product.length_cm,
          weight: product.weight_g / 1000,
          insurance_value: product.price / 100,
          quantity: requested.quantity,
        },
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (meItems.length === 0) {
    return {
      ok: false,
      status: 400,
      error: "Os produtos do carrinho não estão mais disponíveis.",
    };
  }

  const totalWeightG = meItems.reduce((sum, item) => sum + item.totalWeightG, 0);
  const cacheKey = getCacheKey(postalCode, totalWeightG);
  const cached = quoteCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.result;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const meResponse = await fetch(
      `${MELHOR_ENVIO_BASE_URL}/me/shipment/calculate`,
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": `Alexandra Perfumaria (${contactEmail})`,
        },
        body: JSON.stringify({
          from: { postal_code: originPostalCode },
          to: { postal_code: postalCode },
          products: meItems.map((item) => item.meProduct),
          services: CORREIOS_SERVICES,
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
      .filter((option) => !option.error)
      .map((option) => ({
        id: String(option.id),
        name: option.name,
        price: Math.round(
          parseFloat(option.custom_price ?? option.price ?? "0") * 100,
        ),
        deliveryDays:
          option.custom_delivery_time ?? option.delivery_time ?? null,
      }));

    const result: ShippingQuoteResult = { ok: true, options };
    quoteCache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, result });
    return result;
  } catch {
    // Cobre tanto falha de rede quanto o timeout do AbortController acima.
    return { ok: false, status: 502, error: FRIENDLY_UNAVAILABLE_MESSAGE };
  } finally {
    clearTimeout(timeoutId);
  }
}
