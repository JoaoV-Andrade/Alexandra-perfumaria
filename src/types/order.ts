export type OrderAddress = {
  postal_code: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
};

// Snapshot de um item salvo em orders.items — preço já é o do momento da compra.
export type OrderItemSnapshot = {
  product_id: string;
  name: string;
  brand: string;
  price: number; // centavos
  quantity: number;
};
