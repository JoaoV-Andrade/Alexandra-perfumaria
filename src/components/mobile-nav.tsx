"use client";

import Link from "next/link";
import { useEffect } from "react";

import { FULL_BOTTLE_WHATSAPP_URL, NAV_ITEMS } from "@/lib/nav-items";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  pathname: string;
};

export function MobileNav({ open, onClose, pathname }: MobileNavProps) {
  // Trava a rolagem da página por trás enquanto o painel está aberto.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Fecha com a tecla Esc.
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 xl:hidden ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-foreground/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-background p-6 shadow-lg transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-foreground">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-alt"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex h-12 items-center rounded-lg px-3 text-base font-medium transition-colors ${
                  isActive
                    ? "bg-surface text-link"
                    : "text-foreground hover:bg-surface-alt"
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
            onClick={onClose}
            className="mt-3 flex h-12 items-center justify-center rounded-full bg-[image:var(--gold-gradient)] px-4 text-center text-sm font-semibold text-accent-foreground transition-colors hover:opacity-90"
          >
            Frasco Completo? Chame no WhatsApp
          </a>
        </nav>
      </div>
    </div>
  );
}

function CloseIcon({ className }: { className?: string }) {
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
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
