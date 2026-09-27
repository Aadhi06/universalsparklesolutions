import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/lib/site";

export function Services() {
  return (
    <section id="services" className="scroll-mt-24 bg-white py-12 sm:py-16 lg:py-20">
      <Container>
        <SectionHeading
          title="Cleaning Services for Offices, Clinics, Schools & Builds"
          intro="Four core services across Melbourne Metropolitan Area and Regional Victoria."
        />

        <div className="mt-8 grid gap-6 sm:mt-10 md:grid-cols-2 md:gap-8">
          {services.map((service) => (
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
      </Container>
    </section>
  );
}
