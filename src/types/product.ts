export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number; // centavos
  images: string[];
  stock: number;
  volume_ml: number; // decante: geralmente 5ml, às vezes 10ml
};

export type ProductDetail = Product & {
  description: string | null;
};

export type ProductAdmin = ProductDetail & {
  active: boolean;
  weight_g: number;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  created_at: string;
};
