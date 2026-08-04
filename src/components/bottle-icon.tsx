// Ícone de frasco usado em todos os placeholders de imagem do site.
export function BottleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 2h4M11 2v3.2c0 .4-.15.78-.42 1.08L8.9 8.1A2 2 0 0 0 8 9.68V11" />
      <path d="M13 2v3.2c0 .4.15.78.42 1.08l1.68 1.82A2 2 0 0 1 16 9.68V11" />
      <path d="M7 11h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z" />
      <path d="M10 14.5h4" />
    </svg>
  );
}
