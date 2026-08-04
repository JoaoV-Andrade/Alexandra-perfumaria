import Link from "next/link";

export function HeroSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl md:text-4xl">
            Perfumes importados originais, em decantes de 5ml
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Experimente as fragrâncias dos seus sonhos por uma fração do
            preço.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Link
              href="/mais-vendidos"
              className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Ver Mais Vendidos
            </Link>
            <a
              href="#o-que-sao-decantes"
              className="inline-flex h-11 items-center justify-center rounded-full border border-muted-foreground/30 px-6 text-sm font-semibold text-foreground transition-colors hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              O que são decantes?
            </a>
          </div>
        </div>

        {/* Espaço reservado para a imagem/foto de destaque (placeholder por enquanto) */}
        <div
          className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-surface to-surface-alt sm:aspect-video md:aspect-square"
          aria-hidden="true"
        >
          <PerfumeBottleIcon className="h-16 w-16 text-muted-foreground/40" />
        </div>
      </div>
    </section>
  );
}

function PerfumeBottleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 2h4M11 2v3.2c0 .4-.15.78-.42 1.08L8.9 8.1A2 2 0 0 0 8 9.68V11" />
      <path d="M13 2v3.2c0 .4.15.78.42 1.08l1.68 1.82A2 2 0 0 1 16 9.68V11" />
      <path d="M7 11h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z" />
      <path d="M10 14.5h4" />
    </svg>
  );
}
