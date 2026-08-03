import { FormField } from "@/components/form-field";
import { FIELD_CLASS } from "@/lib/ui";

type DimensionsFieldsProps = {
  defaultValues?: { length_cm: number; width_cm: number; height_cm: number };
};

// Dimensões da caixa do produto, necessárias pro cálculo de frete.
export function DimensionsFields({ defaultValues }: DimensionsFieldsProps) {
  return (
    <div>
      <span className="text-sm font-medium text-foreground">
        Dimensões da caixa (cm)
      </span>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Necessário para calcular o frete. Meça a caixinha/embalagem em que o
        produto é enviado.
      </p>
      <div className="mt-2 grid grid-cols-3 gap-4">
        <FormField label="Comprimento">
          <input
            name="length_cm"
            type="number"
            min="1"
            defaultValue={defaultValues?.length_cm}
            required
            className={FIELD_CLASS}
          />
        </FormField>
        <FormField label="Largura">
          <input
            name="width_cm"
            type="number"
            min="1"
            defaultValue={defaultValues?.width_cm}
            required
            className={FIELD_CLASS}
          />
        </FormField>
        <FormField label="Altura">
          <input
            name="height_cm"
            type="number"
            min="1"
            defaultValue={defaultValues?.height_cm}
            required
            className={FIELD_CLASS}
          />
        </FormField>
      </div>
    </div>
  );
}
