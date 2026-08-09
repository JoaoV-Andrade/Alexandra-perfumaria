import Image from "next/image";
import Link from "next/link";

const DELIVERY_HIGHLIGHTS = [
  "Entregas para todo o Brasil e exterior",
  "Entrega via Correios",
  "Rastreamento disponível em todo o processo",
];

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

          <ul className="mt-4 flex flex-col gap-2 sm:mx-auto sm:w-fit md:mx-0">
            {DELIVERY_HIGHLIGHTS.map((highlight) => (
              <li
                key={highlight}
                className="flex items-center gap-2 text-sm text-foreground"
              >
                <CheckIcon className="h-4 w-4 shrink-0" />
                {highlight}
              </li>
            ))}
          </ul>

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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}
