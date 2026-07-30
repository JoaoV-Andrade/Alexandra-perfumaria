import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

type RequestItem = {
  productId: string;
  quantity: number;
};

type RequestBody = {
  customer_name?: string;
  customer_phone?: string;
  items?: RequestItem[];
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as RequestBody | null;

  const customerName = body?.customer_name?.toString().trim();
  const customerPhone = body?.customer_phone?.toString().trim();
  const requestedItems = Array.isArray(body?.items) ? body.items : [];

  if (!customerName || !customerPhone) {
    return NextResponse.json(
      { error: "Preencha nome e WhatsApp." },
      { status: 400 },
    );
  }

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

  // Preço e existência dos produtos vêm sempre do banco, nunca do navegador.
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, brand, price")
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

  const orderItems = validItems
    .map((requested) => {
      const product = products?.find((p) => p.id === requested.productId);
      if (!product) return null;

      return {
        product_id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        quantity: requested.quantity,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

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

  const { data: order, error: insertError } = await supabase
    .from("orders")
    .insert({
      customer_name: customerName,
      customer_phone: customerPhone,
      items: orderItems,
      subtotal,
      shipping_cost: 0,
      total: subtotal,
      status: "aguardando_whatsapp",
    })
    .select("id")
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: "Não foi possível salvar o pedido." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    orderId: order.id,
    items: orderItems,
    total: subtotal,
  });
}
