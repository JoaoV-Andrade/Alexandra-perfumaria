import { CheckoutForm } from "@/components/checkout-form";
import { SiteHeader } from "@/components/site-header";

export default function CheckoutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-semibold text-foreground">
          Finalizar compra
        </h1>
        <div className="mt-6">
          <CheckoutForm />
        </div>
      </main>
    </>
  );
}
