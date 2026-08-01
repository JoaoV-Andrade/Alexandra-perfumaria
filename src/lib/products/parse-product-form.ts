export type ParsedProductFields = {
  name: string;
  brand: string;
  description: string | null;
  volumeMl: number;
  priceCents: number;
  stock: number;
  weightG: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  active: boolean;
};

export type ParseProductFormResult =
  | { ok: true; data: ParsedProductFields }
  | { ok: false; message: string };

// Validação dos campos do produto, usada tanto no cadastro quanto na edição.
export function parseProductFormData(formData: FormData): ParseProductFormResult {
  const name = formData.get("name")?.toString().trim();
  const brand = formData.get("brand")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const volumeMl = Number(formData.get("volume_ml"));
  const priceReais = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const weightG = Number(formData.get("weight_g"));
  const lengthCm = Number(formData.get("length_cm"));
  const widthCm = Number(formData.get("width_cm"));
  const heightCm = Number(formData.get("height_cm"));
  const active = formData.get("active") === "on";

  if (!name || !brand) {
    return { ok: false, message: "Preencha nome e marca." };
  }
  if (!Number.isFinite(volumeMl) || volumeMl <= 0) {
    return { ok: false, message: "Volume (ml) inválido." };
  }
  if (!Number.isFinite(priceReais) || priceReais < 0) {
    return { ok: false, message: "Preço inválido." };
  }
  if (!Number.isFinite(stock) || stock < 0) {
    return { ok: false, message: "Estoque inválido." };
  }
  if (!Number.isFinite(weightG) || weightG <= 0) {
    return { ok: false, message: "Peso (g) inválido." };
  }
  if (!Number.isFinite(lengthCm) || lengthCm <= 0) {
    return { ok: false, message: "Comprimento (cm) inválido." };
  }
  if (!Number.isFinite(widthCm) || widthCm <= 0) {
    return { ok: false, message: "Largura (cm) inválida." };
  }
  if (!Number.isFinite(heightCm) || heightCm <= 0) {
    return { ok: false, message: "Altura (cm) inválida." };
  }

  return {
    ok: true,
    data: {
      name,
      brand,
      description,
      volumeMl,
      priceCents: Math.round(priceReais * 100),
      stock,
      weightG,
      lengthCm,
      widthCm,
      heightCm,
      active,
    },
  };
}
