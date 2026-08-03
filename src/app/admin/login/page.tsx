import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-8">
      <h1 className="text-center text-2xl font-semibold text-foreground">
        Entrar
      </h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        Painel administrativo — Alexandra Perfumaria
      </p>

      <div className="mt-8">
        <LoginForm />
      </div>
    </main>
  );
}
