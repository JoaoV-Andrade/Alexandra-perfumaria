"use client";

import { useActionState, useEffect, useRef } from "react";

import { FormField } from "@/components/form-field";
import { FormMessage } from "@/components/form-message";
import { FIELD_CLASS } from "@/lib/ui";

import { DimensionsFields } from "./dimensions-fields";
import { ExistingImagesField } from "./existing-images-field";

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
  price_original: number | null; // centavos; preço "de", só quando em promoção real
  stock: number;
  weight_g: number;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  active: boolean;
  is_bestseller: boolean;
  is_feminine: boolean;
  is_kit: boolean;
  is_masculine: boolean;
  is_bottle_only: boolean;
  notes: string | null;
};

type ProductFormProps = {
  action: (
    state: ProductFormState,
    formData: FormData,
  ) => Promise<ProductFormState>;
  submitLabel: string;
  pendingLabel: string;
  defaultValues?: ProductFormDefaults;
  existingImages?: string[];
  resetOnSuccess?: boolean;
};

const initialState: ProductFormState = { status: "idle" };

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
      <FormMessage
        message={state.message}
        variant={state.status === "success" ? "success" : "error"}
      />

      <FormField label="Nome do produto">
        <input
          name="name"
          type="text"
          defaultValue={defaultValues?.name}
          required
          className={FIELD_CLASS}
        />
      </FormField>

      <FormField label="Marca">
        <input
          name="brand"
          type="text"
          defaultValue={defaultValues?.brand}
          required
          className={FIELD_CLASS}
        />
      </FormField>

      <FormField label="Descrição">
        <textarea
          name="description"
          rows={3}
          defaultValue={defaultValues?.description ?? undefined}
          className={FIELD_CLASS}
        />
      </FormField>

      <FormField label="Notas olfativas (opcional)">
        <textarea
          name="notes"
          rows={2}
          placeholder="Ex.: Baunilha, âmbar, madeira"
          defaultValue={defaultValues?.notes ?? undefined}
          className={FIELD_CLASS}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label={
            'Volume do decante (ml) — ou do frasco, se marcar "Só frasco completo" abaixo'
          }
        >
          <input
            name="volume_ml"
            type="number"
            min="1"
            defaultValue={defaultValues?.volume_ml}
            required
            className={FIELD_CLASS}
          />
        </FormField>
        <FormField label="Peso (g)">
          <input
            name="weight_g"
            type="number"
            min="1"
            defaultValue={defaultValues?.weight_g}
            required
            className={FIELD_CLASS}
          />
        </FormField>
      </div>

      <DimensionsFields defaultValues={defaultValues} />

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Preço (R$)">
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
            className={FIELD_CLASS}
          />
        </FormField>
        <FormField label="Estoque">
          <input
            name="stock"
            type="number"
            min="0"
            defaultValue={defaultValues?.stock}
            required
            className={FIELD_CLASS}
          />
        </FormField>
      </div>

      <FormField label="Preço original (R$) — só se estiver em promoção real">
        <input
          name="price_original"
          type="number"
          min="0"
          step="0.01"
          placeholder="Deixe em branco se não houver promoção"
          defaultValue={
            defaultValues?.price_original
              ? (defaultValues.price_original / 100).toFixed(2)
              : undefined
          }
          className={FIELD_CLASS}
        />
      </FormField>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            name="active"
            type="checkbox"
            defaultChecked={defaultValues?.active ?? true}
            className="h-4 w-4 rounded border-muted-foreground/40 accent-accent"
          />
          Produto ativo (visível na loja)
        </label>

        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            name="is_bestseller"
            type="checkbox"
            defaultChecked={defaultValues?.is_bestseller ?? false}
            className="h-4 w-4 rounded border-muted-foreground/40 accent-accent"
          />
          Mais vendido
        </label>

        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            name="is_feminine"
            type="checkbox"
            defaultChecked={defaultValues?.is_feminine ?? false}
            className="h-4 w-4 rounded border-muted-foreground/40 accent-accent"
          />
          Feminino
        </label>

        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            name="is_kit"
            type="checkbox"
            defaultChecked={defaultValues?.is_kit ?? false}
            className="h-4 w-4 rounded border-muted-foreground/40 accent-accent"
          />
          Kit (conjunto de decantes)
        </label>

        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            name="is_masculine"
            type="checkbox"
            defaultChecked={defaultValues?.is_masculine ?? false}
            className="h-4 w-4 rounded border-muted-foreground/40 accent-accent"
          />
          Masculino
        </label>

        <label className="flex items-start gap-2 text-sm text-foreground">
          <input
            name="is_bottle_only"
            type="checkbox"
            defaultChecked={defaultValues?.is_bottle_only ?? false}
            className="mt-0.5 h-4 w-4 rounded border-muted-foreground/40 accent-accent"
          />
          <span>
            Só frasco completo (sem decante disponível)
            <span className="block text-xs font-normal text-muted-foreground">
              O preço acima vira o preço do frasco. A página não deixa adicionar
              ao carrinho — mostra só o preço e direciona pro WhatsApp.
            </span>
          </span>
        </label>
      </div>

      {existingImages && <ExistingImagesField images={existingImages} />}

      <FormField label={existingImages ? "Adicionar fotos" : "Fotos"}>
        <input
          name="images"
          type="file"
          accept="image/*"
          multiple
          className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent-foreground hover:file:bg-accent/90"
        />
      </FormField>

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
