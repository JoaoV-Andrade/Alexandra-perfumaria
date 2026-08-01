"use client";

import { useActionState, useState } from "react";

import type { OrderStatus } from "@/types/order";

import {
  cancelOrder,
  confirmWhatsappOrder,
  markAsShipped,
  type OrderActionState,
} from "./actions";

const initialState: OrderActionState = { status: "idle" };

const fieldClass =
  "min-h-11 flex-1 rounded-lg border border-muted-foreground/30 bg-background px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

function ActionError({ state }: { state: OrderActionState }) {
  if (state.status !== "error") return null;
  return (
    <p className="border-l-4 border-foreground bg-surface px-4 py-3 text-sm text-foreground">
      {state.message}
    </p>
  );
}

function ShipForm({ orderId }: { orderId: string }) {
  const [state, formAction, isPending] = useActionState(
    markAsShipped.bind(null, orderId),
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <p className="text-sm font-medium text-foreground">Marcar como enviado</p>
      <ActionError state={state} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          name="tracking_code"
          type="text"
          placeholder="Código de rastreio"
          required
          className={fieldClass}
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Salvando..." : "Marcar como enviado"}
        </button>
      </div>
    </form>
  );
}

function CancelForm({ orderId }: { orderId: string }) {
  const [state, formAction, isPending] = useActionState(
    cancelOrder.bind(null, orderId),
    initialState,
  );

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm("Cancelar este pedido? Essa ação não pode ser desfeita.")) {
          event.preventDefault();
        }
      }}
      className="flex flex-col gap-2"
    >
      <ActionError state={state} />
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 items-center justify-center rounded-full border border-muted-foreground/30 px-6 text-sm font-semibold text-foreground transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Cancelando..." : "Cancelar pedido"}
      </button>
    </form>
  );
}

function ConfirmWhatsappForm({ orderId }: { orderId: string }) {
  const [state, formAction, isPending] = useActionState(
    confirmWhatsappOrder.bind(null, orderId),
    initialState,
  );

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (
          !window.confirm(
            "Confirmar este pedido? Isso vai dar baixa no estoque dos itens.",
          )
        ) {
          event.preventDefault();
        }
      }}
      className="flex flex-col gap-2"
    >
      <ActionError state={state} />
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Confirmando..." : "Confirmar pedido do WhatsApp"}
      </button>
    </form>
  );
}

export function OrderActions({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [showCancel, setShowCancel] = useState(false);

  if (status === "aguardando_whatsapp") {
    return (
      <div className="flex flex-col gap-4 border-t border-surface-alt pt-6">
        <ConfirmWhatsappForm orderId={orderId} />
        <CancelToggle show={showCancel} onToggle={setShowCancel} orderId={orderId} />
      </div>
    );
  }

  if (status === "pago") {
    return (
      <div className="flex flex-col gap-4 border-t border-surface-alt pt-6">
        <ShipForm orderId={orderId} />
        <CancelToggle show={showCancel} onToggle={setShowCancel} orderId={orderId} />
      </div>
    );
  }

  if (status === "pendente") {
    return (
      <div className="flex flex-col gap-4 border-t border-surface-alt pt-6">
        <CancelToggle show={showCancel} onToggle={setShowCancel} orderId={orderId} />
      </div>
    );
  }

  return null;
}

// Some acoes (cancelar) ficam escondidas atras de um "Cancelar pedido"
// discreto pra nao competir visualmente com a acao principal da tela.
function CancelToggle({
  show,
  onToggle,
  orderId,
}: {
  show: boolean;
  onToggle: (value: boolean) => void;
  orderId: string;
}) {
  if (show) return <CancelForm orderId={orderId} />;

  return (
    <button
      type="button"
      onClick={() => onToggle(true)}
      className="text-left text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
    >
      Cancelar pedido
    </button>
  );
}
