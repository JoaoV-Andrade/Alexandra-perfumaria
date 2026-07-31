import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

type RequestItem = {
  productId: string;
  quantity: number;
};

type RequestBody = {
  postal_code?: string;
  items?: RequestItem[];
};

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

export async function POST(request: Request) {
  const token = process.env.MELHOR_ENVIO_TOKEN;
  const originPostalCode = process.env.STORE_ORIGIN_POSTAL_CODE;

  if (!token || !originPostalCode) {
    return NextResponse.json(
      {
        error:
          "Cálculo de frete não está configurado. Defina MELHOR_ENVIO_TOKEN e STORE_ORIGIN_POSTAL_CODE.",
      },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as RequestBody | null;

  const destinationPostalCode = (body?.postal_code ?? "").replace(/\D/g, "");
  if (destinationPostalCode.length !== 8) {
    return NextResponse.json(
      { error: "CEP inválido. Digite os 8 números do CEP." },
      { status: 400 },
    );
  }

  const requestedItems = Array.isArray(body?.items) ? body.items : [];
  const validItems = requestedItems.filter(
    (item) =>
      typeof item?.productId === "string" &&
      Number.isInteger(item?.quantity) &&
      item.quantity > 0,
  );

  if (validItems.length === 0) {
    return NextResponse.json(
      { error: "O carrinho está vazio." },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();

  // Peso, dimensões e preço (para o seguro) vêm sempre do banco.
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, price, weight_g, length_cm, width_cm, height_cm")
    .in(
      "id",
      validItems.map((item) => item.productId),
    )
    .eq("active", true);

  if (productsError) {
    return NextResponse.json(
      { error: "Não foi possível verificar os produtos." },
      { status: 500 },
    );
  }

  const meProducts = validItems
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
    return NextResponse.json(
      { error: "Os produtos do carrinho não estão mais disponíveis." },
      { status: 400 },
    );
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
          to: { postal_code: destinationPostalCode },
          products: meProducts,
        }),
      },
    );

    if (!meResponse.ok) {
      const errorBody = await meResponse.json().catch(() => null);
      const isInvalidPostalCode = Object.keys(errorBody?.errors ?? {}).some(
        (key) => key.includes("postal_code"),
      );

      return NextResponse.json(
        {
          error: isInvalidPostalCode
            ? "CEP inválido. Verifique e tente novamente."
            : FRIENDLY_UNAVAILABLE_MESSAGE,
        },
        { status: isInvalidPostalCode ? 400 : 502 },
      );
    }

    const data = (await meResponse.json().catch(() => null)) as
      MelhorEnvioOption[] | null;

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: FRIENDLY_UNAVAILABLE_MESSAGE },
        { status: 502 },
      );
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

    return NextResponse.json({ options });
  } catch {
    return NextResponse.json(
      { error: FRIENDLY_UNAVAILABLE_MESSAGE },
      { status: 502 },
    );
  }
}
