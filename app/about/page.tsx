import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/layout/PageIntro";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { aboutPoints, environments, processSteps, site } from "@/lib/site";

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

      <section className="bg-surface py-12 lg:py-20">
        <Container className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] lg:order-2">
            <Image
              src="/images/about-working.jpg"
              alt="A cleaner using a pole tool on full-height windows in a bright, modern interior."
              fill
              className="object-cover object-[50%_20%]"
              sizes="(max-width: 1024px) 100vw, 600px"
            />
          </div>
          <div>
            <h2 className="font-display text-[1.65rem] font-semibold text-navy sm:text-2xl">
              People, equipment and products
            </h2>
            <p className="mt-4 leading-relaxed text-body">
              Each site is treated as its own environment. The team works with
              experienced staff, modern equipment and environmentally
              responsible products selected for the task.
            </p>
            <p className="mt-4 leading-relaxed text-body">
              Quality checks are part of the work, not an afterthought. Where
              a contract needs inspections or reporting, that is agreed before
              cleaning starts.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-white py-12 lg:py-20">
        <Container>
          <SectionHeading
            title="Premises we support"
            intro={`From offices and warehouses to clinics, schools and completed builds across ${site.serviceArea}.`}
          />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {environments.map((item) => (
              <figure key={item.title}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-surface">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 400px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-2.5 font-medium text-navy">
                  {item.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface py-12 lg:py-20">
        <Container>
          <SectionHeading title="From first enquiry to quality checks" />
          <ol className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
              <li key={step.number}>
                <p className="font-display text-[2rem] font-semibold text-gold">
                  {step.number}
                </p>
                <h3 className="font-display mt-3 text-[1.15rem] font-semibold text-navy">
                  {step.title}
                </h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-body">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}
