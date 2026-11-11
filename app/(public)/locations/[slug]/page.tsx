import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import {
  getLocation,
  getLocationServices,
  getNearbyLocations,
  locations,
} from "@/lib/locations";
import { formatSiteAddress, getSiteUrl, site } from "@/lib/site";

type LocationPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return locations.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({
  params,
}: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) return {};

  return {
    title: `Cleaning in ${location.name}`,
    description: location.summary,
    alternates: { canonical: `/locations/${location.slug}` },
  };
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) notFound();

  const locationServices = getLocationServices(location);
  const nearby = getNearbyLocations(location);
  const siteUrl = getSiteUrl();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.legalName,
    url: `${siteUrl}/locations/${location.slug}`,
    email: site.email,
    telephone: ["+61402603869", "+61433708709"],
    description: location.summary,
    areaServed: {
      "@type": "City",
      name: location.name,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Victoria, Australia",
      },
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.streetAddress,
      addressLocality: site.address.addressLocality,
      addressRegion: site.address.addressRegion,
      postalCode: site.address.postalCode,
      addressCountry: site.address.addressCountry,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PageIntro
        eyebrow={`${location.region} · Service area`}
        title={`Cleaning in ${location.name}`}
        intro={location.summary}
      />
      <section className="bg-white py-12 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.85fr)] lg:gap-14">
          <div>
            {location.intro.map((paragraph) => (
              <p key={paragraph} className="mt-4 first:mt-0 leading-relaxed text-body">
                {paragraph}
              </p>
            ))}

            <h2 className="font-display mt-10 text-xl font-semibold text-navy">
              What we clean in {location.name}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {location.coverage.map((item) => (
                <li key={item} className="flex gap-3 text-body">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="font-display mt-10 text-xl font-semibold text-navy">
              Popular services for {location.name}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {locationServices.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={service.href}
                    className="inline-flex min-h-11 items-center font-medium text-navy underline-offset-2 hover:text-blue hover:underline"
                  >
                    {service.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-8 leading-relaxed text-body">
              Indicative residential starting prices are on our{" "}
              <Link href="/pricing" className="font-medium text-blue hover:underline">
                pricing guide
              </Link>
              . Final quotes depend on property size, condition and inclusions.
              End of lease cleaning is a presentation clean before inspection —
              it does not guarantee a bond refund.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact#quote" className="w-full sm:w-auto">
                Request a free quote
              </ButtonLink>
              <ButtonLink
                href="/pricing"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                View pricing
              </ButtonLink>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[6px] border border-line bg-surface px-5 py-6">
              <h2 className="font-display text-lg font-semibold text-navy">
                How to enquire
              </h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-body">
                Mention {location.name}, the premises type and the service you
                need. We are based at {formatSiteAddress()}.
              </p>
              <ul className="mt-4 space-y-2 text-[0.95rem] font-medium text-navy">
                <li>Call {site.phones[0].label}</li>
                <li>WhatsApp {site.whatsapp.numberLabel}</li>
                <li className="break-all">{site.email}</li>
              </ul>
              <ButtonLink href="/contact#quote" className="mt-6 w-full">
                Go to quote form
              </ButtonLink>
            </div>

            {nearby.length > 0 ? (
              <div className="rounded-[6px] border border-line px-5 py-6">
                <h2 className="font-display text-lg font-semibold text-navy">
                  Nearby suburbs
                </h2>
                <ul className="mt-3 space-y-1">
                  {nearby.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/locations/${item.slug}`}
                        className="inline-flex min-h-10 items-center text-[0.95rem] text-body hover:text-blue"
                      >
                        Cleaning in {item.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/locations"
                      className="inline-flex min-h-10 items-center font-semibold text-blue hover:underline"
                    >
                      All service areas
                    </Link>
                  </li>
                </ul>
              </div>
            ) : null}
          </aside>
        </Container>
      </section>
    </>
  );
}
