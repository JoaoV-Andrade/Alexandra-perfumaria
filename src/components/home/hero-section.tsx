import Link from "next/link";

import { BannerPlaceholder } from "@/components/banner-placeholder";

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

        {/* Espaço reservado para a foto de destaque (1:1 — ver lista de fotos necessárias) */}
        <BannerPlaceholder className="aspect-square w-full rounded-2xl" />
      </div>
    </section>
  );
}
