type Benefit = {
  title: string;
  description: React.ReactNode;
  icon: (props: { className?: string }) => React.ReactElement;
};

const BENEFITS: Benefit[] = [
  {
    title: "Atendimento com carinho",
    description: "Atenção personalizada para encontrar sua fragrância ideal.",
    icon: HeartIcon,
  },
  {
    title: "Curadoria especial",
    description: (
      <>
        As melhores marcas importadas,{" "}
        <span className="whitespace-nowrap">100% originais.</span>
      </>
    ),
    icon: SparkleIcon,
  },
  {
    title: "Entrega para todo o Brasil e Exterior",
    description: "Postagem em 2 a 5 dias úteis, com rastreio.",
    icon: TruckIcon,
  },
];

export function BenefitsSection() {
  return (
    <section className="bg-bg-primary">
      <div className="mx-auto grid w-full max-w-page gap-6 px-4 py-8 sm:grid-cols-3">
        {BENEFITS.map((benefit) => (
          <div key={benefit.title} className="flex items-start gap-3">
            {/*
              Ícone escuro (não dourado): sobre o fundo turquesa da seção,
              o dourado não fecha o contraste mínimo — ver CLAUDE.md.
            */}
            <benefit.icon className="h-6 w-6 shrink-0 text-foreground" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {benefit.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 20.5s-7.5-4.6-9.5-9.1C1.2 8.3 3 5 6.2 5c2 0 3.4 1.1 5.8 3.4C14.4 6.1 15.8 5 17.8 5 21 5 22.8 8.3 21.5 11.4 19.5 15.9 12 20.5 12 20.5Z" />
    </svg>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.5 6.5h11v10h-11z" />
      <path d="M13.5 10.5h4l3 3v3h-7z" />
      <circle cx="6.5" cy="18" r="1.5" />
      <circle cx="17" cy="18" r="1.5" />
    </svg>
  );
}
