import Link from "next/link";

import { CartLink } from "@/components/cart-link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-surface-alt bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Alexandra Perfumaria
        </Link>

        <CartLink />
      </div>
    </header>
  );
}
