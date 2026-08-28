import { NextResponse } from "next/server";

import { BRAZILIAN_STATES } from "@/lib/brazilian-states";
import { formatVolumeLabel } from "@/lib/format";
import {
  createCheckoutPreference,
  type PreferenceItem,
} from "@/lib/mercado-pago";
import { quoteShipping } from "@/lib/shipping/melhor-envio";
import { createAdminClient } from "@/lib/supabase/admin";
import type { OrderAddress } from "@/types/order";

type RequestItem = {
  productId: string;
  quantity: number;
};

type RequestBody = {
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  address?: Partial<OrderAddress>;
  items?: RequestItem[];
  shipping_option_id?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as RequestBody | null;

  const customerName = body?.customer_name?.toString().trim();
  const customerPhone = (body?.customer_phone ?? "")
    .toString()
    .replace(/\D/g, "");
  const customerEmail = body?.customer_email?.toString().trim();

  if (!customerName) {
    return NextResponse.json({ error: "Preencha seu nome." }, { status: 400 });
  }
  if (customerPhone.length < 10) {
    return NextResponse.json(
      { error: "Digite um WhatsApp válido, com DDD." },
      { status: 400 },
    );
  }
  if (!customerEmail || !EMAIL_REGEX.test(customerEmail)) {
    return NextResponse.json(
      { error: "Digite um e-mail válido." },
      { status: 400 },
    );
  }

  const address: OrderAddress = {
    postal_code: (body?.address?.postal_code ?? "").replace(/\D/g, ""),
    street: body?.address?.street?.toString().trim() ?? "",
    number: body?.address?.number?.toString().trim() ?? "",
    complement: body?.address?.complement?.toString().trim() ?? "",
    neighborhood: body?.address?.neighborhood?.toString().trim() ?? "",
    city: body?.address?.city?.toString().trim() ?? "",
    state: (body?.address?.state ?? "").toString().trim().toUpperCase(),
  };

  if (
    address.postal_code.length !== 8 ||
    !address.street ||
    !address.number ||
    !address.neighborhood ||
    !address.city ||
    !BRAZILIAN_STATES.includes(
      address.state as (typeof BRAZILIAN_STATES)[number],
    )
  ) {
    return NextResponse.json(
      { error: "Preencha o endereço completo corretamente." },
      { status: 400 },
    );
  }

  const shippingOptionId = body?.shipping_option_id?.toString();
  if (!shippingOptionId) {
    return NextResponse.json(
      { error: "Escolha uma forma de envio." },
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

  // Preço, estoque e frete são sempre recalculados no servidor a partir do
  // banco e da API do Melhor Envio; o navegador só envia ids e quantidades.
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, brand, price, stock, volume_ml, is_kit")
    .in(
      "id",
      validItems.map((item) => item.productId),
    )
    .eq("active", true)
    .eq("is_bottle_only", false);

  if (productsError) {
    return NextResponse.json(
      { error: "Não foi possível verificar os produtos." },
      { status: 500 },
    );
  }

  const missingStock: string[] = [];
  const orderItems = validItems
    .map((requested) => {
      const product = products?.find((p) => p.id === requested.productId);
      if (!product) return null;

      if (product.stock < requested.quantity) {
        missingStock.push(product.name);
        return null;
      }

      return {
        product_id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        volume_ml: product.volume_ml,
        is_kit: product.is_kit,
        quantity: requested.quantity,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (missingStock.length > 0) {
    return NextResponse.json(
      { error: `Sem estoque suficiente: ${missingStock.join(", ")}.` },
      { status: 400 },
    );
  }

  if (orderItems.length === 0) {
    return NextResponse.json(
      { error: "Os produtos do carrinho não estão mais disponíveis." },
      { status: 400 },
    );
  }

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const shippingResult = await quoteShipping(supabase, {
    postalCode: address.postal_code,
    items: validItems,
  });

  if (!shippingResult.ok) {
    return NextResponse.json(
      { error: shippingResult.error },
      { status: shippingResult.status },
    );
  }

  const shippingOption = shippingResult.options.find(
    (option) => option.id === shippingOptionId,
  );

  if (!shippingOption) {
    return NextResponse.json(
      {
        error:
          "A forma de envio escolhida não está mais disponível. Calcule o frete novamente.",
      },
      { status: 400 },
    );
  }

  const shippingCost = shippingOption.price;
  const shippingService = `Correios - ${shippingOption.name}`;
  const total = subtotal + shippingCost;

  const { data: order, error: insertError } = await supabase
    .from("orders")
    .insert({
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      address,
      items: orderItems,
      subtotal,
      shipping_cost: shippingCost,
      shipping_service: shippingService,
      total,
      status: "pendente",
    })
    .select("id")
    .single();

  if (insertError || !order) {
    return NextResponse.json(
      { error: "Não foi possível salvar o pedido." },
      { status: 500 },
    );
  }

  const preferenceItems: PreferenceItem[] = orderItems.map((item) => ({
    id: item.product_id,
    title: `${item.name} - ${formatVolumeLabel(item.volume_ml, item.is_kit)} (${item.brand})`,
    quantity: item.quantity,
    unitPrice: item.price,
  }));

  const preference = await createCheckoutPreference({
    orderId: order.id,
    items: preferenceItems,
    payerName: customerName,
    payerEmail: customerEmail,
    payerPhone: customerPhone,
    shippingCost,
  });

  if (!preference.ok) {
    return NextResponse.json({ error: preference.error }, { status: 502 });
  }

  await supabase
    .from("orders")
    .update({ mp_preference_id: preference.preferenceId })
    .eq("id", order.id);

  return NextResponse.json({ initPoint: preference.initPoint });
}
