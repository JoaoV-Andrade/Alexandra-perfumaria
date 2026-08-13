import Image from "next/image";

import { FULL_BOTTLE_WHATSAPP_URL } from "@/lib/nav-items";

export function FullBottleCtaSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <Image
        src="/fotos/frasco-completo.jpeg"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/55" />

      <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center px-4 text-center">
        <h2 className="text-lg font-semibold text-white sm:text-xl">
          Quer o frasco completo?{" "}
          <span className="whitespace-nowrap">Fale com a gente!</span>
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
