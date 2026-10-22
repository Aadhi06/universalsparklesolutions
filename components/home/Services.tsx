import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/lib/site";

export function Services() {
  const featured = services.filter((service) => service.featured);
  const extra = services.filter((service) => !service.featured);

  return (
    <section id="services" className="scroll-mt-24 bg-white py-12 sm:py-16 lg:py-20">
      <Container>
        <SectionHeading
          title="Cleaning for Workplaces, Homes & Specialist Work"
          intro="Choose the service that matches the premises. Each visit is quoted for the rooms, access and timing you need."
        />

        <div className="mt-8 grid gap-6 sm:mt-10 md:grid-cols-2 md:gap-8">
          {featured.map((service) => (
            <article key={service.slug} className="group">
              <Link href={service.href} className="block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-surface">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 580px"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-[1.15rem] font-semibold text-navy sm:text-[1.25rem]">
                    {service.title}
                  </h3>
                  <p className="mt-1 text-[0.98rem] text-body">{service.homeLine}</p>
                  <span className="mt-2.5 inline-flex min-h-11 items-center gap-1.5 text-[0.95rem] font-semibold text-blue">
                    View service
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 sm:mt-16">
          <h3 className="font-display text-[1.35rem] font-semibold text-navy sm:text-[1.5rem]">
            Homes & specialist cleaning
          </h3>
          <p className="mt-1 text-body">
            House, end of lease, carpet, furniture, glass, ceilings, childcare and
            last-minute visits.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {extra.map((service) => (
              <Link
                key={service.slug}
                href={service.href}
                className="group overflow-hidden rounded-[6px] border border-line bg-white transition-shadow duration-200 hover:shadow-soft"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 280px"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <p className="font-display text-[0.95rem] font-semibold text-navy sm:text-[1.05rem]">
                    {service.shortTitle}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[0.85rem] text-body sm:text-[0.92rem]">
                    {service.homeLine}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/services"
            className="mt-6 inline-flex min-h-11 items-center gap-1.5 font-semibold text-blue"
          >
            View all services
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
