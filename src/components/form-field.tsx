type FormFieldProps = {
  label: string;
  className?: string;
  children: React.ReactNode;
};

// Par label + campo usado em todos os formulários do site — evita repetir a
// mesma estrutura de <label> em cada input.
export function FormField({ label, className, children }: FormFieldProps) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${className ?? ""}`}>
      <span className="font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}
