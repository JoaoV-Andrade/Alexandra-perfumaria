import { FormField } from "@/components/form-field";
import { FIELD_CLASS } from "@/lib/ui";

export type CustomerInfo = {
  name: string;
  phone: string;
  email: string;
  cpf: string;
};

type CheckoutCustomerFieldsProps = {
  value: CustomerInfo;
  onChange: (field: keyof CustomerInfo, value: string) => void;
};

export function CheckoutCustomerFields({
  value,
  onChange,
}: CheckoutCustomerFieldsProps) {
  return (
    <div className="flex flex-col gap-4 border-t border-surface-alt pt-6">
      <p className="text-sm font-medium text-foreground">Seus dados</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Nome completo">
          <input
            type="text"
            value={value.name}
            onChange={(event) => onChange("name", event.target.value)}
            required
            className={FIELD_CLASS}
          />
        </FormField>

        <FormField label="WhatsApp">
          <input
            type="tel"
            value={value.phone}
            onChange={(event) => onChange("phone", event.target.value)}
            placeholder="(61) 99999-9999"
            required
            className={FIELD_CLASS}
          />
        </FormField>

        <FormField label="E-mail">
          <input
            type="email"
            value={value.email}
            onChange={(event) => onChange("email", event.target.value)}
            required
            className={FIELD_CLASS}
          />
        </FormField>

        <FormField label="CPF">
          <input
            type="text"
            inputMode="numeric"
            value={value.cpf}
            onChange={(event) => onChange("cpf", event.target.value)}
            placeholder="000.000.000-00"
            required
            className={FIELD_CLASS}
          />
        </FormField>
      </div>
    </div>
  );
}
