import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { formatDateTime, formatPriceInCents } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import {
  ORDER_STATUSES,
  type OrderListItem,
  type OrderStatus,
} from "@/types/order";

import { OrderStatusBadge } from "./order-status-badge";
import { StatusFilter } from "./status-filter";

type AdminPedidosPageProps = {
  searchParams: Promise<{ status?: string }>;
};

function parseStatus(value: string | undefined): OrderStatus | null {
  return ORDER_STATUSES.includes(value as OrderStatus)
    ? (value as OrderStatus)
    : null;
}

export default async function AdminPedidosPage({
  searchParams,
}: AdminPedidosPageProps) {
  const { status: statusParam } = await searchParams;
  const status = parseStatus(statusParam);

  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select("id, customer_name, status, total, created_at")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data: orders } = await query.returns<OrderListItem[]>();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <h1 className="text-2xl font-semibold text-foreground">Pedidos</h1>

      <div className="mt-6">
        <StatusFilter current={status} />
      </div>

      <div className="mt-6">
        {!orders || orders.length === 0 ? (
          <EmptyState
            title="Nenhum pedido encontrado"
            description="Assim que chegar um pedido, ele aparece aqui."
          />
        ) : (
          <ul className="flex flex-col divide-y divide-surface-alt">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/pedidos/${order.id}`}
                  className="flex items-center justify-between gap-4 py-4 transition-colors hover:bg-surface-alt"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">
                      {order.customer_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(order.created_at)}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <OrderStatusBadge status={order.status} />
                    <span className="text-sm font-semibold text-foreground">
                      {formatPriceInCents(order.total)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
