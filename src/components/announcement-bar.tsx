"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Decantes 5ml de perfumes 100% originais",
  "Enviamos para todo o Brasil com rastreio",
];

const ROTATE_INTERVAL_MS = 4000;

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % MESSAGES.length);
    }, ROTATE_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="bg-[image:var(--gold-gradient)] px-4 py-1.5 text-center text-accent-foreground">
      <p key={index} aria-live="polite" className="animate-fade-in text-xs font-medium">
        {MESSAGES[index]}
      </p>
    </div>
  );
}
