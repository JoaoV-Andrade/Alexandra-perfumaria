import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-surface-alt py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Alexandra Perfumaria. Todos os direitos reservados.</p>
        <Link
          href="/politica-de-privacidade"
          className="underline decoration-muted-foreground/40 underline-offset-2 transition-colors hover:text-foreground"
        >
          Política de Privacidade
        </Link>
      </div>
    </footer>
  );
}
