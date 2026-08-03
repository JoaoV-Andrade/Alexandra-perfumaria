import { FormField } from "@/components/form-field";
import { BRAZILIAN_STATES } from "@/lib/brazilian-states";
import { formatPostalCode } from "@/lib/format";
import { FIELD_CLASS } from "@/lib/ui";

export type AddressFormValues = {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
};

type CheckoutAddressFieldsProps = {
  postalCode: string;
  addressReady: boolean;
  value: AddressFormValues;
  onChange: (field: keyof AddressFormValues, value: string) => void;
};

export function CheckoutAddressFields({
  postalCode,
  addressReady,
  value,
  onChange,
}: CheckoutAddressFieldsProps) {
  return (
    <div className="flex flex-col gap-4 border-t border-surface-alt pt-6">
      <p className="text-sm font-medium text-foreground">Endereço de entrega</p>

      {!addressReady ? (
        <p className="text-sm text-muted-foreground">
          Calcule o frete acima para preencher o endereço de entrega.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="CEP">
            <input
              type="text"
              value={formatPostalCode(postalCode)}
              disabled
              className={FIELD_CLASS}
            />
          </FormField>

          <div />

          <FormField label="Rua" className="sm:col-span-2">
            <input
              type="text"
              value={value.street}
              onChange={(event) => onChange("street", event.target.value)}
              required
              className={FIELD_CLASS}
            />
          </FormField>

          <FormField label="Número">
            <input
              type="text"
              value={value.number}
              onChange={(event) => onChange("number", event.target.value)}
              required
              className={FIELD_CLASS}
            />
          </FormField>

          <FormField label="Complemento (opcional)">
            <input
              type="text"
              value={value.complement}
              onChange={(event) => onChange("complement", event.target.value)}
              className={FIELD_CLASS}
            />
          </FormField>

          <FormField label="Bairro">
            <input
              type="text"
              value={value.neighborhood}
              onChange={(event) => onChange("neighborhood", event.target.value)}
              required
              className={FIELD_CLASS}
            />
          </FormField>

          <FormField label="Cidade">
            <input
              type="text"
              value={value.city}
              onChange={(event) => onChange("city", event.target.value)}
              required
              className={FIELD_CLASS}
            />
          </FormField>

          <FormField label="Estado">
            <select
              value={value.state}
              onChange={(event) => onChange("state", event.target.value)}
              required
              className={FIELD_CLASS}
            >
              <option value="" disabled>
                Selecione
              </option>
              {BRAZILIAN_STATES.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      )}
    </div>
  );
}
