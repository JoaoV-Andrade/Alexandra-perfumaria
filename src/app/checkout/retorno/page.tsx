import Link from "next/link";

import { SiteHeader } from "@/components/site-header";

type CheckoutRetornoPageProps = {
  searchParams: Promise<{ status?: string }>;
};

const MESSAGES: Record<string, { title: string; description: string }> = {
  sucesso: {
    title: "Pagamento aprovado!",
    description: "Recebemos seu pedido e já vamos começar a preparar tudo.",
  },
  pendente: {
    title: "Pagamento em análise",
    description:
      "Assim que o Mercado Pago confirmar o pagamento, seu pedido será processado.",
  },
  erro: {
    title: "Não foi possível concluir o pagamento",
    description: "Você pode voltar ao carrinho e tentar novamente.",
  },
};

export default async function CheckoutRetornoPage({
  searchParams,
}: CheckoutRetornoPageProps) {
  const { status } = await searchParams;
  const message = MESSAGES[status ?? ""] ?? MESSAGES.erro;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          {message.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {message.description}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Voltar para a loja
        </Link>
      </main>
    </>
  );
}
