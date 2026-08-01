"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef } from "react";

export type ProductFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export type ProductFormDefaults = {
  name: string;
  brand: string;
  description: string | null;
  volume_ml: number;
  price: number; // centavos
  stock: number;
  weight_g: number;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  active: boolean;
};

type ProductFormProps = {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  submitLabel: string;
  pendingLabel: string;
  defaultValues?: ProductFormDefaults;
  existingImages?: string[];
  resetOnSuccess?: boolean;
};

const initialState: ProductFormState = { status: "idle" };

const fieldClass =
  "min-h-11 rounded-lg border border-muted-foreground/30 bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

export function ProductForm({
  action,
  submitLabel,
  pendingLabel,
  defaultValues,
  existingImages,
  resetOnSuccess = false,
}: ProductFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success" && resetOnSuccess) {
      formRef.current?.reset();
    }
  }, [state, resetOnSuccess]);

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
        <input
          name="name"
          type="text"
          defaultValue={defaultValues?.name}
          required
          className={fieldClass}
        />
      </Field>

      <Field label="Marca">
        <input
          name="brand"
          type="text"
          defaultValue={defaultValues?.brand}
          required
          className={fieldClass}
        />
      </Field>

      <Field label="Descrição">
        <textarea
          name="description"
          rows={3}
          defaultValue={defaultValues?.description ?? undefined}
          className={fieldClass}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Volume (ml)">
          <input
            name="volume_ml"
            type="number"
            min="1"
            defaultValue={defaultValues?.volume_ml}
            required
            className={fieldClass}
          />
        </Field>
        <Field label="Peso (g)">
          <input
            name="weight_g"
            type="number"
            min="1"
            defaultValue={defaultValues?.weight_g}
            required
            className={fieldClass}
          />
        </Field>
      </div>

      <div>
        <span className="text-sm font-medium text-foreground">
          Dimensões da caixa (cm)
        </span>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Necessário para calcular o frete. Meça a caixinha/embalagem em que o
          produto é enviado.
        </p>
        <div className="mt-2 grid grid-cols-3 gap-4">
          <Field label="Comprimento">
            <input
              name="length_cm"
              type="number"
              min="1"
              defaultValue={defaultValues?.length_cm}
              required
              className={fieldClass}
            />
          </Field>
          <Field label="Largura">
            <input
              name="width_cm"
              type="number"
              min="1"
              defaultValue={defaultValues?.width_cm}
              required
              className={fieldClass}
            />
          </Field>
          <Field label="Altura">
            <input
              name="height_cm"
              type="number"
              min="1"
              defaultValue={defaultValues?.height_cm}
              required
              className={fieldClass}
            />
          </Field>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Preço (R$)">
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="189.90"
            defaultValue={
              defaultValues ? (defaultValues.price / 100).toFixed(2) : undefined
            }
            required
            className={fieldClass}
          />
        </Field>
        <Field label="Estoque">
          <input
            name="stock"
            type="number"
            min="0"
            defaultValue={defaultValues?.stock}
            required
            className={fieldClass}
          />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          name="active"
          type="checkbox"
          defaultChecked={defaultValues?.active ?? true}
          className="h-4 w-4 rounded border-muted-foreground/40 accent-accent"
        />
        Produto ativo (visível na loja)
      </label>

      {existingImages && existingImages.length > 0 && (
        <div>
          <span className="text-sm font-medium text-foreground">Fotos atuais</span>
          <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {existingImages.map((url) => (
              <label key={url} className="flex flex-col items-center gap-1.5 text-xs">
                <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-surface">
                  <Image src={url} alt="" fill sizes="80px" className="object-cover" />
                </div>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <input
                    name="remove_images"
                    type="checkbox"
                    value={url}
                    className="h-3.5 w-3.5 rounded border-muted-foreground/40 accent-accent"
                  />
                  Remover
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <Field label={existingImages ? "Adicionar fotos" : "Fotos"}>
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
        {isPending ? pendingLabel : submitLabel}
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
