type FormMessageProps = {
  message?: string;
  variant?: "error" | "success";
};

// Caixinha de aviso usada em todos os formulários do site pra mostrar erro
// ou confirmação, sempre com o mesmo visual.
export function FormMessage({ message, variant = "error" }: FormMessageProps) {
  if (!message) return null;

  return (
    <p
      className={`border-l-4 bg-surface px-4 py-3 text-sm text-foreground ${
        variant === "success" ? "border-accent" : "border-foreground"
      }`}
    >
      {message}
    </p>
  );
}
