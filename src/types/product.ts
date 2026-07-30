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
