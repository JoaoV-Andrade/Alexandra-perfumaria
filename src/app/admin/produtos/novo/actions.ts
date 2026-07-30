"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";

export type CreateProductState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function createProduct(
  _prevState: CreateProductState,
  formData: FormData,
): Promise<CreateProductState> {
  const name = formData.get("name")?.toString().trim();
  const brand = formData.get("brand")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const volumeMl = Number(formData.get("volume_ml"));
  const priceReais = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const weightG = Number(formData.get("weight_g"));
  const active = formData.get("active") === "on";
  const images = formData
    .getAll("images")
    .filter((file): file is File => file instanceof File && file.size > 0);

  if (!name || !brand) {
    return { status: "error", message: "Preencha nome e marca." };
  }
  if (!Number.isFinite(volumeMl) || volumeMl <= 0) {
    return { status: "error", message: "Volume (ml) inválido." };
  }
  if (!Number.isFinite(priceReais) || priceReais < 0) {
    return { status: "error", message: "Preço inválido." };
  }
  if (!Number.isFinite(stock) || stock < 0) {
    return { status: "error", message: "Estoque inválido." };
  }
  if (!Number.isFinite(weightG) || weightG <= 0) {
    return { status: "error", message: "Peso (g) inválido." };
  }

  const supabase = createAdminClient();

  const imageUrls: string[] = [];
  for (const file of images) {
    const path = `${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, file, { contentType: file.type });

    if (uploadError) {
      return {
        status: "error",
        message: `Falha ao enviar a foto "${file.name}": ${uploadError.message}`,
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(path);

    imageUrls.push(publicUrl);
  }

  const { error: insertError } = await supabase.from("products").insert({
    name,
    brand,
    description,
    volume_ml: volumeMl,
    price: Math.round(priceReais * 100),
    stock,
    weight_g: weightG,
    active,
    images: imageUrls,
  });

  if (insertError) {
    return {
      status: "error",
      message: `Falha ao salvar o produto: ${insertError.message}`,
    };
  }

  revalidatePath("/");

  return {
    status: "success",
    message: `Produto "${name}" cadastrado com sucesso.`,
  };
}
