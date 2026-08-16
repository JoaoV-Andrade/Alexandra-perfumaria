import Image from "next/image";

import { FULL_BOTTLE_WHATSAPP_URL } from "@/lib/nav-items";

const CHECKS = [
  "Custo mais acessível",
  "Praticidade no dia a dia",
  "Ideal para experimentar novidades",
];

export function AboutDecantsSection() {
  return (
    <section id="o-que-sao-decantes" className="scroll-mt-24 bg-bg-primary">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:gap-12">
        <Image
          src="/decantes-foto.png"
          alt="Decantes de perfume de 5ml com tampa dourada"
          width={600}
          height={600}
          className="mx-auto w-full max-w-sm rounded-2xl object-cover md:max-w-none"
        />

        <div>
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            O que são decantes?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            São amostras de 5ml retiradas diretamente de perfumes originais,
            permitindo experimentar fragrâncias importadas antes de investir no
            frasco completo.
          </p>

          <ul className="mt-6 flex flex-col gap-3">
            {CHECKS.map((check) => (
              <li
                key={check}
                className="flex items-center gap-2 text-sm text-foreground"
              >
                <CheckIcon className="h-5 w-5 shrink-0 text-foreground" />
                {check}
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl border border-link/30 bg-link/10 px-4 py-4">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 shrink-0 text-link" />
              <p className="text-base font-semibold text-foreground">
                Quanto tempo dura um decante?
              </p>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Em média, 80 borrifadas por decante de 5ml — validade de 5 meses
              após aberto.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-l-4 border-link bg-surface px-4 py-3">
            <p className="text-sm font-medium text-foreground">
              Venda dos Frascos Inteiros através do nosso WhatsApp Comercial!
            </p>
            <a
              href={FULL_BOTTLE_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-whatsapp px-5 text-sm font-semibold text-accent-foreground transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
            >
              Chamar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClockIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
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
