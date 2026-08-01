import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDateTime, formatPostalCode, formatPriceInCents } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/types/order";

import { OrderStatusBadge } from "../order-status-badge";
import { OrderActions } from "./order-actions";

type AdminPedidoDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminPedidoDetailPage({
  params,
}: AdminPedidoDetailPageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle<Order>();

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <Link
        href="/admin/pedidos"
        className="text-sm text-muted-foreground hover:text-foreground hover:underline"
      >
        ← Voltar para pedidos
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Pedido</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDateTime(order.created_at)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <section className="mt-6 flex flex-col gap-1 rounded-2xl bg-surface p-4">
        <p className="text-sm font-medium text-foreground">Cliente</p>
        <p className="text-sm text-foreground">{order.customer_name}</p>
        <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
        {order.customer_email && (
          <p className="text-sm text-muted-foreground">{order.customer_email}</p>
        )}
      </section>

      {order.address && (
        <section className="mt-4 flex flex-col gap-1 rounded-2xl bg-surface p-4">
          <p className="text-sm font-medium text-foreground">Endereço de entrega</p>
          <p className="text-sm text-muted-foreground">
            {order.address.street}, {order.address.number}
            {order.address.complement ? ` - ${order.address.complement}` : ""}
          </p>
          <p className="text-sm text-muted-foreground">
            {order.address.neighborhood} — {order.address.city}/{order.address.state}
          </p>
          <p className="text-sm text-muted-foreground">
            CEP {formatPostalCode(order.address.postal_code)}
          </p>
        </section>
      )}

      {order.tracking_code && (
        <section className="mt-4 rounded-2xl bg-surface p-4">
          <p className="text-sm font-medium text-foreground">Rastreio</p>
          <p className="text-sm text-muted-foreground">{order.tracking_code}</p>
        </section>
      )}

      <section className="mt-6">
        <p className="text-sm font-medium text-foreground">Itens</p>
        <ul className="mt-2 flex flex-col divide-y divide-surface-alt">
          {order.items.map((item) => (
            <li
              key={item.product_id}
              className="flex items-center justify-between gap-4 py-3 text-sm"
            >
              <span className="text-foreground">
                {item.quantity}x {item.name}{" "}
                <span className="text-muted-foreground">({item.brand})</span>
              </span>
              <span className="whitespace-nowrap font-medium text-foreground">
                {formatPriceInCents(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-2 flex flex-col gap-1 border-t border-surface-alt pt-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatPriceInCents(order.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Frete{order.shipping_service ? ` (${order.shipping_service})` : ""}
            </span>
            <span>{formatPriceInCents(order.shipping_cost)}</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-base font-medium text-foreground">Total</span>
            <span className="text-xl font-semibold text-foreground">
              {formatPriceInCents(order.total)}
            </span>
          </div>
        </div>
      </section>

      <div className="mt-6">
        <OrderActions orderId={order.id} status={order.status} />
      </div>
    </main>
  );
}
