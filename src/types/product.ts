export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number; // centavos
  images: string[];
  stock: number;
};

export type ProductDetail = Product & {
  description: string | null;
  volume_ml: number;
};

export type ProductAdmin = ProductDetail & {
  active: boolean;
  weight_g: number;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  created_at: string;
};
