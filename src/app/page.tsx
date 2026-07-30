export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-surface px-6 py-16 text-center">
      <span className="mb-4 inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
        Em breve
      </span>

      <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Alexandra Perfumaria
      </h1>

      <p className="mt-4 max-w-md text-base text-muted-foreground">
        Uma seleção especial de perfumes está a caminho. Volte em breve para
        conferir o catálogo.
      </p>

      <button
        type="button"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Avise-me quando abrir
      </button>
    </main>
  );
}
