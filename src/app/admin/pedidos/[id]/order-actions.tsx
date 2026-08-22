"use client";

import { useActionState, useState } from "react";

import { FormMessage } from "@/components/form-message";
import { FIELD_CLASS } from "@/lib/ui";
import { ORDER_STATUSES, type OrderStatus } from "@/types/order";

import { ORDER_STATUS_LABELS } from "../order-status-badge";
import {
  cancelOrder,
  confirmWhatsappOrder,
  deleteOrder,
  markAsShipped,
  updateOrderStatusManually,
  type OrderActionState,
} from "./actions";

const initialState: OrderActionState = { status: "idle" };

function ShipForm({ orderId }: { orderId: string }) {
  const [state, formAction, isPending] = useActionState(
    markAsShipped.bind(null, orderId),
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <p className="text-sm font-medium text-foreground">Marcar como enviado</p>
      <FormMessage message={state.message} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          name="tracking_code"
          type="text"
          placeholder="Código de rastreio"
          required
          className={`${FIELD_CLASS} flex-1`}
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
        if (
          !window.confirm(
            "Cancelar este pedido? Essa ação não pode ser desfeita.",
          )
        ) {
          event.preventDefault();
        }
      }}
      className="flex flex-col gap-2"
    >
      <FormMessage message={state.message} />
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
      <FormMessage message={state.message} />
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
  const [showAdvanced, setShowAdvanced] = useState(false);

  const canCancel =
    status === "aguardando_whatsapp" || status === "pago" || status === "pendente";

  return (
    <div className="flex flex-col gap-4 border-t border-surface-alt pt-6">
      {status === "aguardando_whatsapp" && (
        <ConfirmWhatsappForm orderId={orderId} />
      )}
      {status === "pago" && <ShipForm orderId={orderId} />}
      {canCancel && (
        <CancelToggle
          show={showCancel}
          onToggle={setShowCancel}
          orderId={orderId}
        />
      )}

      <AdvancedActionsToggle
        show={showAdvanced}
        onToggle={setShowAdvanced}
        orderId={orderId}
        status={status}
      />
    </div>
  );
}

// Ações avançadas (trocar status na mão, excluir) ficam escondidas atrás de
// um link discreto pra não competir com as ações do dia a dia acima.
function AdvancedActionsToggle({
  show,
  onToggle,
  orderId,
  status,
}: {
  show: boolean;
  onToggle: (value: boolean) => void;
  orderId: string;
  status: OrderStatus;
}) {
  if (!show) {
    return (
      <button
        type="button"
        onClick={() => onToggle(true)}
        className="text-left text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
      >
        Ações avançadas
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-surface p-4">
      <ManualStatusForm orderId={orderId} currentStatus={status} />
      <DeleteForm orderId={orderId} />
    </div>
  );
}

function ManualStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [state, formAction, isPending] = useActionState(
    updateOrderStatusManually.bind(null, orderId),
    initialState,
  );

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (
          !window.confirm(
            "Alterar o status manualmente? Isso só muda o status — não dá baixa em estoque nem faz nenhuma outra ação automática.",
          )
        ) {
          event.preventDefault();
        }
      }}
      className="flex flex-col gap-3"
    >
      <p className="text-sm font-medium text-foreground">
        Alterar status manualmente
      </p>
      <FormMessage message={state.message} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <select
          name="status"
          defaultValue={currentStatus}
          className={`${FIELD_CLASS} flex-1`}
        >
          {ORDER_STATUSES.map((option) => (
            <option key={option} value={option}>
              {ORDER_STATUS_LABELS[option]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Salvando..." : "Salvar status"}
        </button>
      </div>
    </form>
  );
}

function DeleteForm({ orderId }: { orderId: string }) {
  const [state, formAction, isPending] = useActionState(
    deleteOrder.bind(null, orderId),
    initialState,
  );

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (
          !window.confirm(
            "Excluir este pedido definitivamente? O pedido é apagado do banco de dados e essa ação não pode ser desfeita.",
          )
        ) {
          event.preventDefault();
        }
      }}
      className="flex flex-col gap-2"
    >
      <FormMessage message={state.message} />
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 items-center justify-center rounded-full border border-status-danger bg-status-danger px-6 text-sm font-semibold text-status-danger-foreground transition-colors hover:bg-status-danger/70 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Excluindo..." : "Excluir pedido definitivamente"}
      </button>
    </form>
  );
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
