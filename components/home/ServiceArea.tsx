import Link from "next/link";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { locations } from "@/lib/locations";
import { formatSiteAddress, site } from "@/lib/site";

export function ServiceArea() {
  return (
    <section className="bg-white py-12 sm:py-20 lg:py-24">
      <Container className="grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="font-display text-[1.65rem] leading-[1.2] font-semibold text-pretty text-navy sm:text-[2.35rem]">
            Western Melbourne and beyond
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-body">
            Based at {formatSiteAddress()}, we clean homes and workplaces across
            Melbourne Metropolitan Area and Regional Victoria. Western Melbourne
            suburbs are a core focus — including Point Cook, Williams Landing,
            Truganina, Werribee, Hoppers Crossing, Altona, Williamstown,
            Footscray and nearby areas.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
            {locations.map((location) => (
              <li key={location.slug}>
                <Link
                  href={`/locations/${location.slug}`}
                  className="inline-flex min-h-10 items-center text-[0.95rem] font-medium text-navy underline-offset-2 hover:text-blue hover:underline"
                >
                  {location.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/locations" className="w-full sm:w-auto">
              View service areas
            </ButtonLink>
            <ButtonLink
              href="/contact#quote"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Request a free quote
            </ButtonLink>
          </div>
        </div>
        <div className="relative aspect-[16/11] overflow-hidden rounded-[6px]">
          <Image
            src="/images/melbourne.jpg"
            alt={`Melbourne skyline and Princes Bridge, representing ${site.serviceArea}.`}
            fill
            sizes="(max-width: 1024px) 100vw, 600px"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
