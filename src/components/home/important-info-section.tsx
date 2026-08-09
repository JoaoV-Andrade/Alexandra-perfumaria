const BOTTLE_INFO = [
  "Frascos fracionados de 5ml",
  "Não vendemos o frasco completo pelo site",
  "Perfumes 100% originais importados",
  "Quantidade limitada por fragrância",
  "Pronta entrega após confirmação do pagamento",
];

const SHIPPING_INFO = [
  "Postagem em 2 a 5 dias úteis após a confirmação do pagamento",
  "O prazo de entrega conta a partir da postagem e varia por região e modalidade de frete",
  "Entregas para todo o Brasil, com rastreamento",
];

export function ImportantInfoSection() {
  return (
    <section className="bg-bg-primary">
      <div className="mx-auto grid w-full max-w-page gap-6 px-4 py-12 sm:grid-cols-2">
        <InfoCard title="Sobre os frascos" items={BOTTLE_INFO} />
        <InfoCard title="Prazo de entrega" items={SHIPPING_INFO} />
      </div>
    </section>
  );
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl bg-surface p-6">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2 text-sm text-muted-foreground"
          >
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
