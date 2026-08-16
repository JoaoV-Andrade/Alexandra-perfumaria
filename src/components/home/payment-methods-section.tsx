import Image from "next/image";

type CardBrand = {
  name: string;
  src: string | null;
};

const CARD_BRANDS: CardBrand[] = [
  { name: "Visa", src: "/pagamento-visa.svg" },
  { name: "Mastercard", src: "/pagamento-mastercard.svg" },
  { name: "Elo", src: "/pagamento-elo.svg" },
  { name: "American Express", src: null },
  { name: "Hipercard", src: "/pagamento-hipercard.svg" },
];

export function PaymentMethodsSection() {
  return (
    <section className="bg-bg-alt">
      <div className="mx-auto w-full max-w-page px-4 py-12 text-center">
        <h2 className="bg-[image:var(--title-gradient)] bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
          Formas de pagamento
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Pague com cartão de crédito, com a segurança do Mercado Pago.
        </p>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {CARD_BRANDS.map(({ name, src }) => (
            <li key={name} title={name} className="relative h-10 w-16 shrink-0">
              {src ? (
                <Image
                  src={src}
                  alt={name}
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              ) : (
                <AmexIcon />
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// Placeholder até termos o ícone oficial do American Express — mesma
// linguagem visual dos demais (cartão colorido, cor oficial da bandeira).
function AmexIcon() {
  return (
    <svg
      viewBox="0 0 48 30"
      className="h-10 w-16 rounded-lg shadow-sm"
      role="img"
      aria-label="American Express"
    >
      <rect width="48" height="30" rx="5" fill="#1f72cd" />
      <text
        x="24"
        y="19"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="9"
        fill="#ffffff"
      >
        AMEX
      </text>
    </svg>
  );
}
