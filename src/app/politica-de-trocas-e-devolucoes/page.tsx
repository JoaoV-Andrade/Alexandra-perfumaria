import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Política de Trocas e Devoluções",
  robots: { index: false, follow: false },
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export default function PoliticaDeTrocasEDevolucoesPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <h1 className="mt-6 bg-[image:var(--title-gradient)] bg-clip-text text-2xl font-semibold text-transparent">
          Política de Trocas e Devoluções
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Queremos que você compre com confiança. Veja abaixo como funcionam as
          trocas e devoluções na Alexandra Perfumaria.
        </p>

        <Section title="Prazo para solicitar troca ou devolução">
          <p>
            Você pode solicitar a troca ou devolução em até 7 dias corridos após
            o recebimento do produto, conforme o direito de arrependimento
            previsto no Código de Defesa do Consumidor para compras feitas fora
            de estabelecimento físico.
          </p>
        </Section>

        <Section title="Condições para aceitar a troca ou devolução">
          <p>
            Por se tratar de decantes (frações de perfume), a devolução só é
            aceita em caso de defeito, erro no envio ou avaria no transporte.
            Por questões de higiene, não aceitamos devolução por simples
            arrependimento quando o lacre do decante já foi rompido.
          </p>
        </Section>

        <Section title="Como solicitar">
          <p>
            Entre em contato pelo WhatsApp da loja informando o número do
            pedido, o motivo da solicitação e, se possível, uma foto do
            problema. Respondemos em até 2 dias úteis com o próximo passo.
          </p>
          <p>
            O produto deve ser enviado de volta pelo cliente; o valor do frete
            de devolução é reembolsado junto com o produto quando a troca ou
            devolução for aprovada.
          </p>
        </Section>

        <Section title="Reembolso">
          <p>
            Após a análise e aprovação da troca ou devolução, o reembolso é
            feito em até 10 dias úteis, pelo mesmo meio de pagamento usado na
            compra.
          </p>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
