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
          Na Alexandra Perfumaria, entregamos produtos de alta qualidade e um
          atendimento cuidadoso. Ainda assim, entendemos que às vezes é preciso
          trocar ou devolver um item — leia com atenção como funciona.
        </p>

        <Section title="Decantes (fracionados)">
          <p>
            Não aceitamos troca ou devolução de decantes, inclusive em caso de
            defeito ou falha no borrifador. Por se tratar de um produto
            fracionado e de uso pessoal, essa condição vale para toda venda de
            decante feita pela loja.
          </p>
        </Section>

        <Section title="Devolução por arrependimento — frasco completo">
          <p>
            Se você comprou um frasco completo (não decante) e se arrependeu da
            compra, o Código de Defesa do Consumidor garante o direito de
            devolução em até 7 dias corridos após o recebimento, desde que o
            produto esteja lacrado e fechado, nas mesmas condições em que foi
            entregue — conforme o artigo 49 do CDC.
          </p>
        </Section>

        <Section title="Trocas e devoluções por defeito — frasco completo">
          <p>
            Aceitamos troca ou devolução de frascos completos que apresentem
            defeito de fabricação ou falha no borrifador, dentro de 7 dias
            corridos após o recebimento. Você escolhe entre trocar o produto ou
            receber o reembolso.
          </p>
        </Section>

        <Section title="Itens não aceitos para troca ou devolução">
          <p>
            Produtos deslacrados e já utilizados não são elegíveis para troca ou
            devolução, em conformidade com a legislação vigente.
          </p>
        </Section>

        <Section title="Como solicitar">
          <p>
            Entre em contato pelo WhatsApp da loja informando o número do pedido
            e o motivo da solicitação. Respondemos em até 2 dias úteis com as
            próximas instruções.
          </p>
        </Section>

        <Section title="Reembolso">
          <p>
            Em caso de devolução por arrependimento, o estorno é feito assim que
            recebemos o produto de volta, desde que a embalagem não esteja
            violada e não haja indício de uso — basta informar o número do
            pedido, sem necessidade de nota fiscal.
          </p>
        </Section>

        <Section title="Custos de envio">
          <p>
            Nas devoluções por arrependimento dentro do prazo de 7 dias, sem
            confirmação de defeito, o custo do envio de volta é por conta do
            cliente.
          </p>
        </Section>

        <Section title="Avarias e danos no transporte">
          <p>
            Se o produto chegar avariado ou danificado pelo transporte, entre em
            contato com a gente imediatamente pelo WhatsApp e envie fotos do
            item e da embalagem, para abrirmos uma análise.
          </p>
        </Section>

        <Section title="Prazo de análise">
          <p>
            O prazo de análise e processamento de trocas e devoluções pode
            variar — vamos sempre agir da forma mais rápida possível. A
            Alexandra Perfumaria se reserva o direito de recusar trocas e
            devoluções que não atendam aos critérios desta política.
          </p>
        </Section>

        <Section title="Fixação da fragrância">
          <p>
            O agente fixador de um perfume age de forma diferente em cada pele,
            dependendo das condições de cada pessoa. Por isso, a fragrância
            durar menos tempo ou fixar com menos intensidade não é considerado
            um defeito do produto para fins de troca ou devolução.
          </p>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
