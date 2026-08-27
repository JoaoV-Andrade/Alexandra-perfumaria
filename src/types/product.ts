export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number; // centavos
  price_original: number | null; // centavos; preço "de", só quando em promoção real
  images: string[];
  stock: number;
  volume_ml: number; // decante: geralmente 5ml, às vezes 10ml (ou o volume do frasco, se is_bottle_only)
  is_bottle_only: boolean; // só existe no frasco completo, sem decante — não entra no carrinho
  is_kit: boolean; // kit: conjunto de decantes vendido como produto próprio
};

export type ProductDetail = Product & {
  description: string | null;
  notes: string | null; // notas olfativas, opcional
};

export type ProductAdmin = ProductDetail & {
  active: boolean;
  is_bestseller: boolean;
  is_masculine: boolean; // perfume masculino, entra na seção "Masculinos"
  is_feminine: boolean; // perfume feminino, entra na seção "Femininos"
  weight_g: number;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  created_at: string;
};
