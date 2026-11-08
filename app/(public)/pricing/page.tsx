import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FAQ } from "@/components/home/FAQ";
import { PageIntro } from "@/components/layout/PageIntro";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  buildersCleaningRates,
  commercialPricingNotes,
  endOfLeaseRates,
  houseCleaningRates,
  pricingAddOns,
  pricingDisclaimer,
  pricingPackages,
  site,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Cleaning Pricing",
  description: `Indicative starting prices for end of lease, house, deep and builders cleaning from ${site.shortName} across ${site.serviceArea}. Final quotes confirmed for your premises.`,
  alternates: { canonical: "/pricing" },
};

function RateList({
  rows,
}: {
  rows: readonly { label: string; price: string; note?: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-[6px] border border-line bg-white">
      <ul className="divide-y divide-line">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5"
          >
            <div>
              <p className="font-display font-semibold text-navy">{row.label}</p>
              {row.note ? (
                <p className="mt-0.5 text-[0.92rem] text-muted">{row.note}</p>
              ) : null}
            </div>
            <p className="shrink-0 font-display text-[1.15rem] font-semibold text-blue sm:text-right">
              {row.price}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PricingPage() {
  return (
    <>
      <PageIntro
        eyebrow="Pricing"
        title="Clear starting prices for homes and specialist cleans"
        intro="Use these indicative guides to plan your budget. Every job is confirmed with a quote based on the rooms, condition and inclusions — before any booking is made."
      />

      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading
            title="Core residential packages"
            intro="Adapted as starting points for Universal Sparkle Solution services across Melbourne and Regional Victoria."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {pricingPackages.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-[6px] border border-line bg-surface"
              >
                <div className="relative aspect-[16/9] bg-white">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 560px"
                    className="object-cover"
                  />
                </div>
                <div className="p-5 sm:p-7">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <h2 className="font-display text-[1.25rem] font-semibold text-navy sm:text-[1.4rem]">
                      {item.title}
                    </h2>
                    <div className="text-right">
                      <p className="font-display text-[1.75rem] font-semibold tracking-[-0.03em] text-blue">
                        {item.fromPrice}
                      </p>
                      <p className="text-[0.88rem] text-muted">{item.priceNote}</p>
                    </div>
                  </div>
                  <p className="mt-4 leading-relaxed text-body">{item.summary}</p>
                  <ul className="mt-5 space-y-2.5">
                    {item.highlights.map((point) => (
                      <li key={point} className="flex gap-3 text-body">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <ButtonLink
                      href="/contact#quote"
                      className="w-full sm:w-auto"
                    >
                      Request a Free Quote
                    </ButtonLink>
                    <Link
                      href={`/services/${item.serviceSlug}`}
                      className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-blue"
                    >
                      Service details
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-[0.95rem] leading-relaxed text-muted">
            {pricingDisclaimer}
          </p>
        </Container>
      </section>

      <section className="bg-surface py-12 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <SectionHeading
              title="End of lease by bedrooms"
              intro="Guide for standard unfurnished, single-storey properties. Extra bathrooms, furniture, stairs and carpets are quoted separately."
            />
            <div className="mt-6">
              <RateList rows={endOfLeaseRates} />
            </div>
            <p className="mt-4 text-[0.92rem] leading-relaxed text-muted">
              Cleaning prepares the property for inspection. It does not replace
              the inspection or grant a bond refund.
            </p>
          </div>
          <div>
            <SectionHeading
              title="House cleaning rates"
              intro="General cleans start lower; deep one-off visits usually need a longer minimum booking."
            />
            <div className="mt-6">
              <RateList rows={houseCleaningRates} />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <SectionHeading
              title="Builders & post-renovation"
              intro="Time-based for suitable smaller completed jobs. Larger new builds and commercial fit-outs are assessed first."
            />
            <div className="mt-6">
              <RateList rows={buildersCleaningRates} />
            </div>
            <p className="mt-4 text-[0.92rem] leading-relaxed text-muted">
              Cleaning supports handover presentation. It does not replace
              building certification or an occupancy permit.
            </p>
          </div>
          <div>
            <SectionHeading
              title="Common optional add-ons"
              intro="Useful extras often requested with end of lease or house cleans. Each is confirmed in your quote."
            />
            <div className="mt-6 overflow-hidden rounded-[6px] border border-line bg-surface">
              <ul className="divide-y divide-line">
                {pricingAddOns.map((item) => (
                  <li
                    key={item.label}
                    className="flex flex-col gap-1 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5"
                  >
                    <p className="text-[0.98rem] text-navy">{item.label}</p>
                    <p className="shrink-0 font-display font-semibold text-blue sm:text-right">
                      {item.price}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-surface py-12 sm:py-16">
        <Container>
          <SectionHeading
            title="Workplaces & specialist cleaning"
            intro="Commercial, medical, education and specialist interiors are priced for the premises. Share floor area, access hours and frequency for a practical quote."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {commercialPricingNotes.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-[6px] border border-line bg-white"
              >
                <div className="relative aspect-[16/10] bg-surface">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 360px"
                    className="object-cover"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="font-display text-[1.1rem] font-semibold text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[0.98rem] leading-relaxed text-body">
                    {item.text}
                  </p>
                  <Link
                    href={item.href}
                    className="mt-5 inline-flex min-h-11 items-center gap-1.5 font-semibold text-blue"
                  >
                    Learn more
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact#quote" className="w-full sm:w-auto">
              Request a Free Quote
            </ButtonLink>
            <ButtonLink
              href="/services"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Browse all services
            </ButtonLink>
          </div>
        </Container>
      </section>

      <FAQ />
    </>
  );
}
