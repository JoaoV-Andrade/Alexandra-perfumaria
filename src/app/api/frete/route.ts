import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { quoteShipping, type ShippingQuoteItem } from "@/lib/shipping/melhor-envio";

type RequestBody = {
  postal_code?: string;
  items?: ShippingQuoteItem[];
};

export async function POST(request: Request) {
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
  const result = await quoteShipping(supabase, {
    postalCode: destinationPostalCode,
    items: validItems,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ options: result.options });
}
