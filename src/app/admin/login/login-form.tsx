"use client";

import { useActionState } from "react";

import { signIn, type LoginState } from "./actions";

const initialState: LoginState = { status: "idle" };

const fieldClass =
  "min-h-11 rounded-lg border border-muted-foreground/30 bg-background px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.status === "error" && (
        <p className="border-l-4 border-foreground bg-surface px-4 py-3 text-sm text-foreground">
          {state.message}
        </p>
      )}

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-foreground">E-mail</span>
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-foreground">Senha</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={fieldClass}
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
