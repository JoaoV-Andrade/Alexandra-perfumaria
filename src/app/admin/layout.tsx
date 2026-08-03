import type { Metadata } from "next";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import { SignOutButton } from "./sign-out-button";

export const metadata: Metadata = {
  title: {
    default: "Painel administrativo",
    template: "%s | Painel · Alexandra Perfumaria",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-surface-alt bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link
            href="/admin"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            Painel · Alexandra Perfumaria
          </Link>
          {user && <SignOutButton />}
        </div>
      </header>

      {children}
    </div>
  );
}
