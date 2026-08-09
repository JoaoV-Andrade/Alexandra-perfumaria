import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="bg-[image:var(--gold-gradient)] px-4 py-6 sm:py-8">
      <div className="mx-auto grid w-full max-w-page items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className="text-center md:text-left">
          <h1 className="bg-[image:var(--title-gradient)] bg-clip-text text-2xl font-semibold text-transparent sm:text-3xl md:text-4xl">
            Perfumes Importados Originais
            <br />
            Decantes de 5ML
          </h1>
          <p className="mt-3 text-sm text-foreground/80 sm:text-base">
            Experimente as fragrâncias dos seus sonhos por uma fração do
            preço.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Link
              href="/mais-vendidos"
              className="inline-flex h-11 items-center justify-center rounded-full bg-bg-primary px-6 text-sm font-semibold text-foreground transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
            >
              Ver Mais Vendidos
            </Link>
            <a
              href="#o-que-sao-decantes"
              className="inline-flex h-11 items-center justify-center rounded-full border border-foreground/40 px-6 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
            >
              O que são decantes?
            </a>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <Image
            src="/logo-com-nome.png"
            alt="Alexandra Perfumaria"
            width={94}
            height={105}
            priority
            className="h-48 w-auto sm:h-56 md:h-64"
          />
        </div>
      </div>
    </section>
  );
}
