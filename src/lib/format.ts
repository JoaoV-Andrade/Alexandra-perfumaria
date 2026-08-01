const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatPriceInCents(priceInCents: number): string {
  return currencyFormatter.format(priceInCents / 100);
}

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso));
}

export function formatPostalCode(postalCode: string): string {
  return postalCode.replace(/(\d{5})(\d{3})/, "$1-$2");
}
