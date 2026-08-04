import { BannerPlaceholder } from "@/components/banner-placeholder";
import { FULL_BOTTLE_WHATSAPP_URL } from "@/lib/nav-items";

export function FullBottleCtaSection() {
  return (
    <section className="bg-foreground py-10 text-background">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 text-center">
        {/* Espaço reservado para a foto do banner (16:9 — ver lista de fotos necessárias) */}
        <BannerPlaceholder className="aspect-video w-full rounded-2xl" />

        <h2 className="mt-6 text-lg font-semibold sm:text-xl">
          Quer o frasco completo? Fale com a gente!
        </h2>
        <a
          href={FULL_BOTTLE_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Chamar no WhatsApp
        </a>
      </div>
    </section>
  );
}
