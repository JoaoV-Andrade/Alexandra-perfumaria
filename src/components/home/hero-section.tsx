import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="bg-bg-primary px-4 py-10 sm:py-14">
      <div className="mx-auto grid w-full max-w-page items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center gap-2 md:justify-start">
            <Image
              src="/logo-marca.svg"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9"
            />
            <span className="text-base font-semibold tracking-tight text-foreground">
              Alexandra Perfumaria
            </span>
          </div>

          {/* Título sobre fundo turquesa: texto escuro sólido, não o
              gradiente dourado (o dourado claro não tem contraste
              suficiente sobre turquesa — ver CLAUDE.md). */}
          <h1 className="mt-4 text-2xl font-semibold text-foreground sm:text-3xl md:text-4xl">
            Perfumes importados originais, em decantes de 5ml
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Experimente as fragrâncias dos seus sonhos por uma fração do
            preço.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Link
              href="/mais-vendidos"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[image:var(--gold-gradient)] px-6 text-sm font-semibold text-accent-foreground transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
            >
              Ver Mais Vendidos
            </Link>
            <a
              href="#o-que-sao-decantes"
              className="inline-flex h-11 items-center justify-center rounded-full border border-foreground/30 px-6 text-sm font-semibold text-foreground transition-colors hover:bg-background/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
            >
              O que são decantes?
            </a>
          </div>
        </div>

        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface">
          <Image
            src="/fotos/hero.jpg"
            alt="Mulher segurando um perfume importado, representando o catálogo da Alexandra Perfumaria"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
            className="object-cover object-[50%_25%]"
          />
        </div>
      </div>
    </section>
  );
}
