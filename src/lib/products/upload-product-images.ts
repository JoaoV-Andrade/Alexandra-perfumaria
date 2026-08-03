import type { SupabaseClient } from "@supabase/supabase-js";

export type UploadImagesResult =
  | { ok: true; urls: string[] }
  | { ok: false; message: string };

// Envia fotos novas pro Storage e devolve as URLs públicas, na ordem enviada.
export async function uploadProductImages(
  supabase: SupabaseClient,
  files: File[],
): Promise<UploadImagesResult> {
  const urls: string[] = [];

  for (const file of files) {
    const path = `${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { contentType: file.type });

    if (error) {
      return {
        ok: false,
        message: `Falha ao enviar a foto "${file.name}": ${error.message}`,
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(path);

    urls.push(publicUrl);
  }

  return { ok: true, urls };
}

// Extrai o caminho no bucket a partir da URL pública salva em products.images.
function pathFromPublicUrl(url: string): string | null {
  const marker = "/product-images/";
  const index = url.indexOf(marker);
  return index === -1 ? null : url.slice(index + marker.length);
}

// Remove fotos do Storage. Falha aqui não deve travar a edição do produto —
// só registra no log, já que o produto em si já foi salvo certinho.
export async function deleteProductImages(
  supabase: SupabaseClient,
  urls: string[],
): Promise<void> {
  const paths = urls.map(pathFromPublicUrl).filter((path): path is string => Boolean(path));
  if (paths.length === 0) return;

  const { error } = await supabase.storage.from("product-images").remove(paths);
  if (error) {
    console.error("Falha ao remover fotos do Storage:", error.message);
  }
}
