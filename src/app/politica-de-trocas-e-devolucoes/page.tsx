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
        <div className="rounded-2xl border-2 border-dashed border-muted-foreground/40 bg-surface px-4 py-3 text-center text-sm font-semibold text-foreground">
          RASCUNHO — revisar antes do lançamento
        </div>

        <h1 className="mt-6 text-2xl font-semibold text-foreground">
          Política de Trocas e Devoluções
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Este texto é um exemplo de ponto de partida e ainda não é a
          política oficial da loja. Os prazos e condições abaixo estão entre
          colchetes e precisam ser confirmados antes de publicar esta página.
        </p>

        <Section title="Prazo para solicitar troca ou devolução">
          <p>
            Você pode solicitar a troca ou devolução em até [X dias corridos]
            após o recebimento do produto, conforme o direito de
            arrependimento previsto no Código de Defesa do Consumidor para
            compras feitas fora de estabelecimento físico.
          </p>
        </Section>

        <Section title="Condições para aceitar a troca ou devolução">
          <p>
            Por se tratar de decantes (frações de perfume), a devolução só é
            aceita em caso de [defeito, erro no envio ou avaria no
            transporte]. Por questões de higiene, não aceitamos devolução por
            simples arrependimento quando o lacre do decante foi rompido —
            [confirmar esta regra antes de publicar].
          </p>
        </Section>

        <Section title="Como solicitar">
          <p>
            Entre em contato pelo WhatsApp da loja informando o número do
            pedido e o motivo da solicitação. [Definir prazo de resposta e
            quem paga o frete de devolução.]
          </p>
        </Section>

        <Section title="Reembolso">
          <p>
            Após a análise e aprovação da troca ou devolução, o reembolso é
            feito [em até X dias úteis, pelo mesmo meio de pagamento usado na
            compra — confirmar antes de publicar].
          </p>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
