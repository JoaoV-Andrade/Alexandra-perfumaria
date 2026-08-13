"use server";

import { revalidatePath } from "next/cache";

import { parseProductFormData } from "@/lib/products/parse-product-form";
import { deleteProductImages, uploadProductImages } from "@/lib/products/upload-product-images";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type UpdateProductState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function updateProduct(
  productId: string,
  _prevState: UpdateProductState,
  formData: FormData,
): Promise<UpdateProductState> {
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

  const adminClient = createAdminClient();

  const { data: current } = await adminClient
    .from("products")
    .select("images")
    .eq("id", productId)
    .maybeSingle<{ images: string[] }>();

  const removeUrls = formData.getAll("remove_images").map((value) => value.toString());
  const remainingImages = (current?.images ?? []).filter((url) => !removeUrls.includes(url));

  const newFiles = formData
    .getAll("images")
    .filter((file): file is File => file instanceof File && file.size > 0);

  const upload = await uploadProductImages(adminClient, newFiles);
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

  const { error: updateError } = await adminClient
    .from("products")
    .update({
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
      images: [...remainingImages, ...upload.urls],
    })
    .eq("id", productId);

  if (updateError) {
    return { status: "error", message: `Falha ao salvar: ${updateError.message}` };
  }

  if (removeUrls.length > 0) {
    await deleteProductImages(adminClient, removeUrls);
  }

  revalidatePath("/");
  revalidatePath("/admin/produtos");
  revalidatePath(`/produto/${productId}`);

  return { status: "success", message: `Produto "${name}" atualizado com sucesso.` };
}
