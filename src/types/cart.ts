export type CartItem = {
  productId: string;
  name: string;
  brand: string;
  price: number; // centavos, capturado no momento em que foi adicionado
  image: string | null;
  quantity: number;
};
