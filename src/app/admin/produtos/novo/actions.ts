"use server";

import { revalidatePath } from "next/cache";

import { parseProductFormData } from "@/lib/products/parse-product-form";
import { uploadProductImages } from "@/lib/products/upload-product-images";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type CreateProductState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function createProduct(
  _prevState: CreateProductState,
  formData: FormData,
): Promise<CreateProductState> {
  // O proxy já bloqueia quem não está logada; esta checagem é só uma
  // segunda trava, direto na ação que grava no banco.
  const supabaseAuth = await createClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  if (!user) {
    return { status: "error", message: "Sessão expirada. Faça login novamente." };
  }

  const parsed = parseProductFormData(formData);
  if (!parsed.ok) {
    return { status: "error", message: parsed.message };
  }

  const images = formData
    .getAll("images")
    .filter((file): file is File => file instanceof File && file.size > 0);

  const adminClient = createAdminClient();

  const upload = await uploadProductImages(adminClient, images);
  if (!upload.ok) {
    return { status: "error", message: upload.message };
  }

  const {
    name,
    brand,
    description,
    notes,
    volumeMl,
    priceCents,
    priceOriginalCents,
    stock,
    weightG,
    lengthCm,
    widthCm,
    heightCm,
    active,
    isBestseller,
    isFeminine,
    isKit,
    isMasculine,
    isBottleOnly,
  } = parsed.data;

  const { error: insertError } = await adminClient.from("products").insert({
    name,
    brand,
    description,
    notes,
    volume_ml: volumeMl,
    price: priceCents,
    price_original: priceOriginalCents,
    stock,
    weight_g: weightG,
    length_cm: lengthCm,
    width_cm: widthCm,
    height_cm: heightCm,
    active,
    is_bestseller: isBestseller,
    is_feminine: isFeminine,
    is_kit: isKit,
    is_masculine: isMasculine,
    is_bottle_only: isBottleOnly,
    images: upload.urls,
  });

  if (insertError) {
    return {
      status: "error",
      message: `Falha ao salvar o produto: ${insertError.message}`,
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/produtos");

  return {
    status: "success",
    message: `Produto "${name}" cadastrado com sucesso.`,
  };
}
