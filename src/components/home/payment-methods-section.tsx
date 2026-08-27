import Image from "next/image";

type CardBrand = {
  name: string;
  src: string;
};

const CARD_BRANDS: CardBrand[] = [
  { name: "Visa", src: "/pagamento-visa.svg" },
  { name: "Mastercard", src: "/pagamento-mastercard.svg" },
  { name: "Elo", src: "/pagamento-elo.svg" },
  { name: "American Express", src: "/pagamento-amex.png" },
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
          Pague com Pix ou cartão de crédito, com a segurança do Asaas.
        </p>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {CARD_BRANDS.map(({ name, src }) => (
            <li key={name} title={name} className="relative h-10 w-16 shrink-0">
              <Image
                src={src}
                alt={name}
                fill
                sizes="64px"
                className="rounded-lg object-contain shadow-sm"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
