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

export const ORDER_STATUSES = [
  "aguardando_whatsapp",
  "pendente",
  "pago",
  "recusado",
  "enviado",
  "cancelado",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  address: OrderAddress | null;
  items: OrderItemSnapshot[];
  subtotal: number;
  shipping_cost: number;
  shipping_service: string | null;
  total: number;
  status: OrderStatus;
  mp_payment_id: string | null;
  mp_preference_id: string | null;
  tracking_code: string | null;
  created_at: string;
};

export type OrderListItem = Pick<
  Order,
  "id" | "customer_name" | "status" | "total" | "created_at"
>;
