"use client";

import { useActionState, useEffect, useRef } from "react";

import { createProduct, type CreateProductState } from "./actions";

const initialState: CreateProductState = { status: "idle" };

const fieldClass =
  "min-h-11 rounded-lg border border-muted-foreground/30 bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

export function NewProductForm() {
  const [state, formAction, isPending] = useActionState(
    createProduct,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5">
      {state.status !== "idle" && (
        <p
          className={`border-l-4 bg-surface px-4 py-3 text-sm text-foreground ${
            state.status === "success" ? "border-accent" : "border-foreground"
          }`}
        >
          {state.message}
        </p>
      )}

      <Field label="Nome do produto">
        <input name="name" type="text" required className={fieldClass} />
      </Field>

      <Field label="Marca">
        <input name="brand" type="text" required className={fieldClass} />
      </Field>

      <Field label="Descrição">
        <textarea name="description" rows={3} className={fieldClass} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Volume (ml)">
          <input
            name="volume_ml"
            type="number"
            min="1"
            required
            className={fieldClass}
          />
        </Field>
        <Field label="Peso (g)">
          <input
            name="weight_g"
            type="number"
            min="1"
            required
            className={fieldClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Preço (R$)">
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="189.90"
            required
            className={fieldClass}
          />
        </Field>
        <Field label="Estoque">
          <input
            name="stock"
            type="number"
            min="0"
            required
            className={fieldClass}
          />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          name="active"
          type="checkbox"
          defaultChecked
          className="h-4 w-4 rounded border-muted-foreground/40 accent-accent"
        />
        Produto ativo (visível na loja)
      </label>

      <Field label="Fotos">
        <input
          name="images"
          type="file"
          accept="image/*"
          multiple
          className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent-foreground hover:file:bg-accent/90"
        />
      </Field>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Salvando..." : "Cadastrar produto"}
      </button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}
