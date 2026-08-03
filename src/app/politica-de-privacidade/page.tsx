import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Saiba quais dados a Alexandra Perfumaria coleta, como são usados e com quem são compartilhados.",
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

export default function PoliticaDePrivacidadePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <h1 className="text-2xl font-semibold text-foreground">
          Política de Privacidade
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Última atualização: 3 de agosto de 2026
        </p>

        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Esta página explica quais dados a Alexandra Perfumaria coleta de
          quem visita ou compra na loja, para que servem e com quem são
          compartilhados, em conformidade com a Lei Geral de Proteção de
          Dados (LGPD).
        </p>

        <Section title="Quais dados coletamos">
          <p>
            Ao finalizar uma compra (pelo site ou pelo WhatsApp), coletamos
            nome, telefone (WhatsApp), e-mail e endereço de entrega. Não é
            necessário criar conta nem senha para comprar.
          </p>
          <p>
            O carrinho de compras fica salvo apenas no seu próprio
            navegador (armazenamento local), e não é enviado aos nossos
            servidores até a finalização do pedido.
          </p>
        </Section>

        <Section title="Para que usamos seus dados">
          <p>
            Usamos os dados exclusivamente para processar o pedido: calcular
            o frete, gerar a cobrança, entregar o produto no endereço
            informado e entrar em contato sobre o andamento da compra.
          </p>
          <p>Não usamos seus dados para envio de propaganda ou marketing.</p>
        </Section>

        <Section title="Com quem compartilhamos">
          <p>
            Para viabilizar a compra, compartilhamos os dados necessários
            com: Mercado Pago (processamento do pagamento), Melhor Envio e a
            transportadora escolhida (cálculo e entrega do frete), e
            WhatsApp (quando você opta por finalizar o pedido por lá).
          </p>
          <p>
            Não vendemos nem compartilhamos seus dados com terceiros para
            fins diferentes da sua própria compra.
          </p>
        </Section>

        <Section title="Como seus dados são armazenados">
          <p>
            Os dados dos pedidos ficam armazenados de forma segura no
            Supabase, com acesso restrito à administradora da loja. Nenhuma
            informação de pagamento (como número de cartão) é armazenada
            pela Alexandra Perfumaria — isso é feito diretamente pelo
            Mercado Pago.
          </p>
        </Section>

        <Section title="Seus direitos">
          <p>
            Você pode solicitar a qualquer momento a confirmação, correção
            ou exclusão dos seus dados, entrando em contato pelo WhatsApp da
            loja.
          </p>
        </Section>

        <Section title="Contato">
          <p>
            Dúvidas sobre esta política podem ser enviadas pelo WhatsApp da
            Alexandra Perfumaria, disponível nas páginas de produto e no
            carrinho.
          </p>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
