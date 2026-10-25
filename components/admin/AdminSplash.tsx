"use client";

import { useEffect, useState } from "react";

export function AdminSplash() {
  const [phase, setPhase] = useState<"show" | "hide" | "gone">("show");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = window.setTimeout(() => setPhase("hide"), reduce ? 200 : 1200);
    const done = window.setTimeout(() => setPhase("gone"), reduce ? 220 : 1600);
    return () => {
      window.clearTimeout(hold);
      window.clearTimeout(done);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className={`fixed inset-0 z-[80] flex flex-col bg-navy text-white transition-opacity duration-300 ${
        phase === "hide" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
      aria-label="USS Admin is opening"
    >
      <div className="flex flex-1 flex-col items-center justify-center px-8">
        <div className="w-[min(78vw,22rem)] rounded-[6px] bg-white px-5 py-6">
          <img
            src="/brand/logo-mark.png"
            alt=""
            className="mx-auto h-auto w-full"
          />
        </div>
        <p className="font-display mt-6 text-2xl font-semibold tracking-[-0.02em]">USS Admin</p>
      </div>
      <p className="pb-[max(1.75rem,env(safe-area-inset-bottom))] text-center text-sm font-semibold tracking-[0.08em] text-gold">
        Developed by Avenque Ltd
      </p>
    </div>
  );
}
