"use client";

import Image from "next/image";
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

      <header className="sticky top-0 z-40 bg-bg-primary shadow-sm">
        <div className="mx-auto flex h-20 w-full max-w-page items-center justify-between gap-4 px-4">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image
              src="/logo-frasco.png"
              alt="Alexandra Perfumaria"
              width={68}
              height={121}
              className="h-16 w-auto"
              priority
            />
            <span className="text-base font-semibold text-foreground xl:hidden">
              Alexandra Perfumaria
            </span>
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto scrollbar-hide xl:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium transition-colors ${
                    isActive ? "text-link" : "text-foreground hover:text-link"
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
              className="ml-2 inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[image:var(--gold-gradient)] px-3 text-sm font-semibold text-accent-foreground transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
            >
              Frasco Completo? Chame no WhatsApp
            </a>
          </nav>

          <div className="flex shrink-0 items-center gap-1">
            <CartLink />

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
              className="flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-alt xl:hidden"
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
