import Image from "next/image";

const CHECKS = [
  "Custo mais acessível",
  "Praticidade no dia a dia",
  "Ideal para experimentar novidades",
];

export function AboutDecantsSection() {
  return (
    <section id="o-que-sao-decantes" className="scroll-mt-24 bg-bg-alt">
      <div className="mx-auto w-full max-w-3xl px-4 py-12 text-center">
      <Image
        src="/decante.png"
        alt="Um decante de perfume de 5ml"
        width={400}
        height={400}
        className="mx-auto h-40 w-40 sm:h-48 sm:w-48"
      />

      <h2 className="mt-8 bg-[image:var(--title-gradient)] bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
        O que são decantes?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
        São amostras de 5ml retiradas diretamente de perfumes originais,
        permitindo experimentar fragrâncias importadas antes de investir no
        frasco completo.
      </p>

      <ul className="mt-6 flex flex-col gap-3 text-left sm:mx-auto sm:w-fit">
        {CHECKS.map((check) => (
          <li
            key={check}
            className="flex items-center gap-2 text-sm text-foreground"
          >
            <CheckIcon className="h-5 w-5 shrink-0 text-link" />
            {check}
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-2xl border border-link/30 bg-link/10 px-4 py-4 text-left">
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

      <p className="mt-4 border-l-4 border-link bg-surface px-4 py-3 text-left text-sm font-medium text-foreground">
        Vendemos frascos fracionados. Não vendemos o frasco completo pelo
        site.
      </p>
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
