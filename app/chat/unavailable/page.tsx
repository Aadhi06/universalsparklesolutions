import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Chat unavailable",
  robots: { index: false, follow: false },
};

export default function ChatUnavailablePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-6 py-16">
      <p className="text-xs font-semibold tracking-[0.14em] text-blue uppercase">
        {site.shortName}
      </p>
      <h1 className="font-display mt-3 text-3xl font-semibold text-navy">
        This chat link is not valid
      </h1>
      <p className="mt-3 text-body">
        Open the latest message from us, or call {site.phones[0].label}.
      </p>
      <Link href="/contact" className="mt-6 inline-flex min-h-12 items-center font-semibold text-blue">
        Contact us
      </Link>
    </main>
  );
}
