// Valida CPF (dígitos verificadores), exigido pelo Asaas para criar cobranças.
export function isValidCpf(digits: string): boolean {
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;

  const numbers = digits.split("").map(Number);

  function checkDigit(length: number): number {
    const sum = numbers
      .slice(0, length)
      .reduce((acc, digit, index) => acc + digit * (length + 1 - index), 0);
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  }

  return (
    checkDigit(9) === numbers[9] && checkDigit(10) === numbers[10]
  );
}
