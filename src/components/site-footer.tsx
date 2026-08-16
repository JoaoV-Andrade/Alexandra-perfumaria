import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

import { CONTACT_WHATSAPP_URL, NAV_ITEMS } from "@/lib/nav-items";

export function SiteFooter() {
  return (
    <footer
      className="bg-[#1f2937]"
      style={
        {
          "--foreground": "#ffffff",
          "--muted-foreground": "#cbd5e1",
        } as CSSProperties
      }
    >
      <div className="mx-auto grid w-full max-w-page grid-cols-2 gap-x-6 gap-y-10 px-4 py-10 lg:grid-cols-4 lg:gap-8">
        <div className="col-span-2 lg:order-1 lg:col-span-1">
          <Image
            src="/logo-com-nome.png"
            alt="Alexandra Perfumaria"
            width={94}
            height={105}
            className="mx-auto block h-24 w-auto lg:mx-0"
          />
          <p className="mt-3 text-sm text-muted-foreground">
            Curadoria de perfumes importados, com carinho e originalidade.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Vendemos decantes (frações de 5ml) de perfumes originais. Não
            comercializamos frascos lacrados pelo site.
          </p>
        </div>

        <div className="lg:order-2">
          <p className="text-sm font-semibold text-foreground">Navegue</p>
          <ul className="mt-3 flex flex-col gap-3 sm:gap-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:order-4">
          <p className="text-sm font-semibold text-foreground">Institucional</p>
          <ul className="mt-3 flex flex-col gap-3 sm:gap-2">
            <li>
              <Link
                href="/politica-de-privacidade"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Política de Privacidade
              </Link>
            </li>
            <li>
              <Link
                href="/politica-de-trocas-e-devolucoes"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Política de Trocas e Devoluções
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-span-2 lg:order-3 lg:col-span-1">
          <p className="text-sm font-semibold text-foreground">Atendimento</p>
          <div className="mt-3 flex flex-col items-start gap-3">
            <a
              href={CONTACT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[image:var(--gold-gradient)] px-4 text-sm font-semibold text-accent-foreground transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
            >
              Falar no WhatsApp
            </a>
            <p className="text-sm text-muted-foreground">
              Respondemos pelo WhatsApp assim que possível.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-foreground/10 px-4 py-6 text-center text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Alexandra Perfumaria. Todos os direitos
          reservados. Pagamentos processados pelo Mercado Pago.
        </p>
        <p className="mt-1">CNPJ: 63.736.403/0001-13</p>
      </div>
    </footer>
  );
}
