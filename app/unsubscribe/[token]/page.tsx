import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { unsubscribeCustomer } from "@/lib/store/customers";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const customer = await unsubscribeCustomer(token);

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-6 py-16">
      <p className="text-xs font-semibold tracking-[0.14em] text-blue uppercase">{site.shortName}</p>
      <h1 className="font-display mt-3 text-3xl font-semibold text-navy">
        {customer ? "You are unsubscribed" : "This link is not valid"}
      </h1>
      <p className="mt-3 text-body">
        {customer
          ? `${customer.fullName}, you will not receive further offers by email. You can still contact us about a clean.`
          : "Open the unsubscribe link from the latest email, or call us."}
      </p>
      <Link href="/contact" className="mt-6 inline-flex min-h-12 items-center font-semibold text-blue">
        Contact us
      </Link>
    </main>
  );
}
