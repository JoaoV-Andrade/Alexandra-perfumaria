import { BannerPlaceholder } from "@/components/banner-placeholder";
import { FULL_BOTTLE_WHATSAPP_URL } from "@/lib/nav-items";

export function FullBottleCtaSection() {
  return (
    <section className="bg-bg-alt py-10">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 text-center">
        {/* Espaço reservado para a foto do banner (16:9 — ver lista de fotos necessárias) */}
        <BannerPlaceholder className="aspect-video w-full rounded-2xl" />

        <h2 className="mt-6 bg-[image:var(--title-gradient)] bg-clip-text text-lg font-semibold text-transparent sm:text-xl">
          Quer o frasco completo? Fale com a gente!
        </h2>
        <a
          href={FULL_BOTTLE_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[image:var(--gold-gradient)] px-6 text-sm font-semibold text-accent-foreground transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
        >
          Chamar no WhatsApp
        </a>
      </div>
    </section>
  );
}
