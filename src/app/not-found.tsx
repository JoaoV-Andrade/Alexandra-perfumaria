import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-8">
        <EmptyState
          title="Página não encontrada"
          description="O que você procurava não existe ou foi removido."
        />
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Voltar para a loja
        </Link>
      </main>
    </>
  );
}
