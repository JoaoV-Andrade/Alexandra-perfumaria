import { SiteHeader } from "@/components/site-header";

export default function Loading() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-page flex-1 px-4 py-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse overflow-hidden rounded-2xl border border-surface-alt bg-background"
            >
              <div className="aspect-square w-full bg-surface-alt" />
              <div className="space-y-2 p-4">
                <div className="h-3 w-1/2 rounded bg-surface-alt" />
                <div className="h-4 w-3/4 rounded bg-surface-alt" />
                <div className="h-4 w-1/3 rounded bg-surface-alt" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
