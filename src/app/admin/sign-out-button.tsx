import { signOut } from "./actions";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-sm font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
      >
        Sair
      </button>
    </form>
  );
}
