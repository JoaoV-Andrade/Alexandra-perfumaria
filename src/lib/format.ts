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

// Kit é vendido como um único produto, mas é sempre um conjunto de decantes
// de 5ml — mostrar "Decante 15ml" confundia o cliente, que pensava ser um
// frasco de 15ml em vez de 3 potinhos de 5ml. Devolve a frase pronta (não só
// o número), porque a redação muda no plural do kit.
export function formatVolumeLabel(volumeMl: number, isKit: boolean): string {
  if (isKit) {
    const decantCount = Math.round(volumeMl / 5);
    return `${decantCount} decantes de 5ml`;
  }
  return `Decante ${volumeMl}ml`;
}
