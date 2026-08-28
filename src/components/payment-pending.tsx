import { CopyButton } from "@/components/copy-button";
import { OrderSummaryList } from "@/components/order-summary-list";
import type { OrderItemSnapshot } from "@/types/order";

type PaymentPendingProps = {
  items: OrderItemSnapshot[] | null;
  total: number | null;
  paymentTypeId: string | null;
  qrCode: string | null;
  qrCodeBase64: string | null;
  ticketUrl: string | null;
  expirationDate: string | null;
};

function formatExpiration(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function PaymentPending({
  items,
  total,
  paymentTypeId,
  qrCode,
  qrCodeBase64,
  ticketUrl,
  expirationDate,
}: PaymentPendingProps) {
  const isPix = paymentTypeId === "bank_transfer" && Boolean(qrCode);
  const isBoleto = paymentTypeId === "ticket" && Boolean(ticketUrl);
  const expiration = expirationDate ? formatExpiration(expirationDate) : null;

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 text-foreground"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      </div>

      <h1 className="text-2xl font-semibold text-foreground">
        Falta pouco para finalizar
      </h1>

      {isPix && (
        <>
          <p className="max-w-sm text-sm text-muted-foreground">
            Pague com Pix para confirmar seu pedido. A confirmação costuma ser
            automática, em poucos minutos.
          </p>

          {qrCodeBase64 && (
            <div className="rounded-2xl bg-surface p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:image/png;base64,${qrCodeBase64}`}
                alt="QR Code do Pix"
                width={220}
                height={220}
                className="h-[220px] w-[220px]"
              />
            </div>
          )}

          <div className="w-full rounded-xl border border-muted-foreground/30 bg-background p-3 text-left">
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              Pix Copia e Cola
            </p>
            <p className="break-all text-xs text-foreground">{qrCode}</p>
          </div>

          {qrCode && <CopyButton value={qrCode} label="Copiar código Pix" />}

          <p className="max-w-sm text-xs text-muted-foreground">
            Abra o app do seu banco, escolha pagar com Pix e escaneie o código
            acima, ou cole o código copiado na opção &quot;Pix Copia e
            Cola&quot;.
          </p>
        </>
      )}

      {isBoleto && (
        <>
          <p className="max-w-sm text-sm text-muted-foreground">
            Pague o boleto para confirmar seu pedido. Depois de pago, a
            confirmação pode levar até 3 dias úteis.
          </p>

          {expiration && (
            <p className="text-sm text-foreground">
              Vencimento: <span className="font-medium">{expiration}</span>
            </p>
          )}

          <a
            href={ticketUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[image:var(--gold-gradient)] px-6 text-sm font-semibold text-accent-foreground transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
          >
            Ver / baixar boleto
          </a>

          <p className="max-w-sm text-xs text-muted-foreground">
            Pague em qualquer banco, lotérica ou pelo aplicativo do seu banco
            até a data de vencimento.
          </p>
        </>
      )}

      {!isPix && !isBoleto && (
        <p className="max-w-sm text-sm text-muted-foreground">
          Estamos aguardando a confirmação do seu pagamento. Isso pode levar
          alguns minutos — você não precisa fazer nada agora.
        </p>
      )}

      {items && total !== null && (
        <OrderSummaryList items={items} total={total} />
      )}
    </div>
  );
}
