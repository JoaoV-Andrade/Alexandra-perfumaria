"use client";

import Link from "next/link";

import { useCart } from "@/lib/cart/cart-context";

export function CartLink() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/carrinho"
      aria-label="Carrinho"
      className="relative flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-alt hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <CartIcon className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="9" cy="20" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.25" fill="currentColor" stroke="none" />
      <path d="M2.5 3h2l2.4 12.2a1.5 1.5 0 0 0 1.5 1.3h9.4a1.5 1.5 0 0 0 1.5-1.2L21 8H6" />
    </svg>
  );
}
