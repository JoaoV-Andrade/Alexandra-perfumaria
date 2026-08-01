"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type InlineActionResult = { ok: true } | { ok: false; message: string };

async function getAuthedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? supabase : null;
}

function revalidateProductPaths(productId: string) {
  revalidatePath("/admin/produtos");
  revalidatePath("/");
  revalidatePath(`/produto/${productId}`);
}

export async function updateProductPrice(
  productId: string,
  priceReais: number,
): Promise<InlineActionResult> {
  if (!Number.isFinite(priceReais) || priceReais < 0) {
    return { ok: false, message: "Preço inválido." };
  }

  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, message: "Sessão expirada. Faça login novamente." };

  const { error } = await supabase
    .from("products")
    .update({ price: Math.round(priceReais * 100) })
    .eq("id", productId);

  if (error) return { ok: false, message: "Não foi possível salvar o preço." };

  revalidateProductPaths(productId);
  return { ok: true };
}

export async function updateProductStock(
  productId: string,
  stock: number,
): Promise<InlineActionResult> {
  if (!Number.isInteger(stock) || stock < 0) {
    return { ok: false, message: "Estoque inválido." };
  }

  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, message: "Sessão expirada. Faça login novamente." };

  const { error } = await supabase.from("products").update({ stock }).eq("id", productId);

  if (error) return { ok: false, message: "Não foi possível salvar o estoque." };

  revalidateProductPaths(productId);
  return { ok: true };
}

export async function toggleProductActive(
  productId: string,
  active: boolean,
): Promise<InlineActionResult> {
  const supabase = await getAuthedClient();
  if (!supabase) return { ok: false, message: "Sessão expirada. Faça login novamente." };

  const { error } = await supabase.from("products").update({ active }).eq("id", productId);

  if (error) return { ok: false, message: "Não foi possível atualizar." };

  revalidateProductPaths(productId);
  return { ok: true };
}
