import { BottleIcon } from "@/components/bottle-icon";

// Placeholder para imagens de banner/seção (hero, "o que são decantes",
// CTA do frasco completo) que ainda não têm foto real cadastrada.
export function BannerPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-surface to-surface-alt ${className ?? ""}`}
      aria-hidden="true"
    >
      <BottleIcon className="h-12 w-12 text-muted-foreground/40" />
    </div>
  );
}
