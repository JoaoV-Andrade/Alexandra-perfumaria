import Link from "next/link";

export default function AdminHomePage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <h1 className="text-2xl font-semibold text-foreground">Painel</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Escolha o que você quer fazer.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <Link
          href="/admin/pedidos"
          className="rounded-2xl bg-surface px-5 py-4 text-sm font-medium text-foreground transition-colors hover:bg-surface-alt"
        >
          Ver pedidos
        </Link>
        <Link
          href="/admin/produtos"
          className="rounded-2xl bg-surface px-5 py-4 text-sm font-medium text-foreground transition-colors hover:bg-surface-alt"
        >
          Ver produtos
        </Link>
      </div>
    </main>
  );
}
