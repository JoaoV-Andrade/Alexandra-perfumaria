import Link from "next/link";

export function PaymentError() {
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
          <path d="M9 9l6 6M15 9l-6 6" />
        </svg>
      </div>

      <h1 className="text-2xl font-semibold text-foreground">
        Não foi possível concluir o pagamento
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Isso pode acontecer por vários motivos — cartão recusado, dados
        incorretos ou uma instabilidade momentânea. Você pode voltar ao
        carrinho e tentar de novo, com o mesmo cartão ou outra forma de
        pagamento.
      </p>

      <Link
        href="/checkout"
        className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-full bg-[image:var(--gold-gradient)] px-6 text-sm font-semibold text-accent-foreground transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
      >
        Tentar novamente
      </Link>
      <Link
        href="/"
        className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
      >
        Voltar para a loja
      </Link>
    </div>
  );
}
