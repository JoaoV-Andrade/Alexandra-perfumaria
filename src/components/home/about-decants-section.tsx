import { BannerPlaceholder } from "@/components/banner-placeholder";

const CHECKS = [
  "Custo mais acessível",
  "Praticidade no dia a dia",
  "Ideal para experimentar novidades",
];

export function AboutDecantsSection() {
  return (
    <section
      id="o-que-sao-decantes"
      className="mx-auto w-full max-w-3xl scroll-mt-24 px-4 py-12 text-center"
    >
      {/* Espaço reservado para a foto da seção (16:9 — ver lista de fotos necessárias) */}
      <BannerPlaceholder className="aspect-video w-full rounded-2xl" />

      <h2 className="mt-8 text-xl font-semibold text-foreground sm:text-2xl">
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
            <CheckIcon className="h-5 w-5 shrink-0 text-accent" />
            {check}
          </li>
        ))}
      </ul>

      <p className="mt-8 border-l-4 border-accent bg-surface px-4 py-3 text-left text-sm font-medium text-foreground">
        Vendemos frascos fracionados. Não vendemos o frasco completo pelo
        site.
      </p>
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
