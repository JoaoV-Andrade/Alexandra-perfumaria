export type CartItem = {
  productId: string;
  name: string;
  brand: string;
  price: number; // centavos, capturado no momento em que foi adicionado
  image: string | null;
  volumeMl: number; // decante: geralmente 5ml, às vezes 10ml
  isKit: boolean; // kit: conjunto de decantes vendido como produto próprio
  quantity: number;
};
