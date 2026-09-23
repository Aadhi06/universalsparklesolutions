import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/layout/PageIntro";
import { aboutPoints, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn how ${site.shortName} provides commercial cleaning and facility support across ${site.serviceArea}.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="About Us"
        title="A professional cleaning team for commercial and facility environments"
        intro="Universal Sparkle Solution Pty Ltd provides commercial cleaning and facility support using experienced staff, modern equipment, environmentally responsible products and quality assurance processes."
      />
      <section className="bg-white py-12 lg:py-20">
        <Container className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[6px]">
            <Image
              src="/images/office-lounge.jpg"
              alt="A bright, clean commercial lounge and reception area with contemporary furniture."
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 600px"
              priority
            />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-navy">
              How we work
            </h2>
            <p className="mt-4 leading-relaxed text-body">
              The company focuses on consistent, high-quality cleaning across
              different industries. We agree a cleaning plan for each
              premises, then deliver that plan with inspections and reporting
              where the work requires it.
            </p>
            <p className="mt-4 leading-relaxed text-body">
              Our primary work is commercial and facility cleaning. Residential
              cleaning, including routine work in NDIS homes, is available as a
              secondary service.
            </p>
            <ul className="mt-8 space-y-3">
              {aboutPoints.map((point) => (
                <li key={point} className="flex gap-3 font-medium text-navy">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                  {point}
                </li>
              ))}
            </ul>
            <ButtonLink href="/contact#quote" className="mt-8 w-full sm:w-auto">
              Request a Free Quote
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
