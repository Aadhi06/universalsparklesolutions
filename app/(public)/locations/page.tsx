import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/layout/PageIntro";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { locations, westernMelbourneFocus } from "@/lib/locations";
import { formatSiteAddress, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Service areas | Western Melbourne cleaning",
  description: `Cleaning coverage across ${westernMelbourneFocus}, plus Melbourne Metropolitan Area and Regional Victoria. Based in Tarneit.`,
  alternates: { canonical: "/locations" },
};

export default function LocationsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Service areas"
        title="Cleaning across western Melbourne and Victoria"
        intro={`Universal Sparkle Solution is based at ${formatSiteAddress()}. We quote homes and workplaces across Melbourne Metropolitan Area and Regional Victoria, with a strong focus on western Melbourne suburbs.`}
      />
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <p className="max-w-3xl leading-relaxed text-body">
            Choose your suburb for local cleaning coverage, typical services and
            a quote link. Every page links to our{" "}
            <Link href="/services" className="font-medium text-blue hover:underline">
              services
            </Link>
            ,{" "}
            <Link href="/pricing" className="font-medium text-blue hover:underline">
              pricing guide
            </Link>{" "}
            and{" "}
            <Link href="/contact#quote" className="font-medium text-blue hover:underline">
              free quote form
            </Link>
            . A quote request is not a confirmed booking.
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((location) => (
              <li key={location.slug}>
                <Link
                  href={`/locations/${location.slug}`}
                  className="flex h-full flex-col rounded-[6px] border border-line bg-surface px-5 py-5 transition-colors hover:border-navy/25 hover:bg-white"
                >
                  <span className="text-[0.72rem] font-semibold tracking-[0.14em] text-blue uppercase">
                    {location.region}
                  </span>
                  <span className="font-display mt-2 text-xl font-semibold text-navy">
                    {location.name}
                  </span>
                  <span className="mt-2 text-[0.95rem] leading-relaxed text-body">
                    {location.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-12 max-w-3xl rounded-[6px] bg-navy px-6 py-8 text-white sm:px-8">
            <h2 className="font-display text-2xl font-semibold">
              Outside these suburbs?
            </h2>
            <p className="mt-3 leading-relaxed text-white/80">
              We still quote across {site.serviceArea}. Tell us your suburb or
              postcode and the premises type — house, office, clinic, school or
              completed build — and we will confirm whether we can attend.
            </p>
            <ButtonLink href="/contact#quote" variant="gold" className="mt-6">
              Request a free quote
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
