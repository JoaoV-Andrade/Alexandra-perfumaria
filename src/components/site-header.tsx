"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { AnnouncementBar } from "@/components/announcement-bar";
import { CartLink } from "@/components/cart-link";
import { MobileNav } from "@/components/mobile-nav";
import { FULL_BOTTLE_WHATSAPP_URL, NAV_ITEMS } from "@/lib/nav-items";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <AnnouncementBar />

      <header className="sticky top-0 z-40 border-b border-surface-alt bg-background shadow-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link
            href="/"
            className="shrink-0 text-lg font-semibold tracking-tight text-foreground"
          >
            Alexandra Perfumaria
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-accent"
                      : "text-foreground hover:text-accent"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <a
              href={FULL_BOTTLE_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Frasco Completo? Chame no WhatsApp
            </a>
          </nav>

          <div className="flex items-center gap-1">
            <CartLink />

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
              className="flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-alt lg:hidden"
            >
              <HamburgerIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
      />
    </>
  );
}

function HamburgerIcon({ className }: { className?: string }) {
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
      <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" />
    </svg>
  );
}
