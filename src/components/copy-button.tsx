"use client";

import { useState } from "react";

type CopyButtonProps = {
  value: string;
  label?: string;
};

export function CopyButton({ value, label = "Copiar código" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard indisponível (ex.: navegador antigo); nada a fazer.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex h-11 items-center justify-center rounded-full bg-[image:var(--gold-gradient)] px-6 text-sm font-semibold text-accent-foreground transition-colors hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
    >
      {copied ? "Copiado!" : label}
    </button>
  );
}
