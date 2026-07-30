import { NewProductForm } from "./new-product-form";

export default function NewProductPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <h1 className="text-2xl font-semibold text-foreground">
        Cadastrar produto
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Preencha os dados e envie as fotos. Depois de salvar, o formulário limpa
        para você cadastrar o próximo produto.
      </p>

      <div className="mt-6">
        <NewProductForm />
      </div>
    </main>
  );
}
