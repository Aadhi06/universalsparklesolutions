import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/layout/PageIntro";
import { serviceGroups, servicesByGroup } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cleaning Services",
  description:
    "House, end of lease, carpet, steam furniture, child care, last minute, glass and ceiling cleaning, plus commercial, healthcare, education and builders cleaning across Melbourne and Regional Victoria.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Services"
        title="Cleaning for workplaces, homes and specialist interiors"
        intro="Choose the service that matches the premises. Each visit is quoted for the rooms, access and timing you need."
      />
      {serviceGroups.map((group, index) => {
        const items = servicesByGroup(group.id);
        return (
          <section
            key={group.id}
            id={group.id}
            className={`scroll-mt-24 py-12 sm:py-16 ${index % 2 === 0 ? "bg-white" : "bg-surface"}`}
          >
            <Container>
              <h2 className="font-display text-[1.65rem] font-semibold text-navy sm:text-[2rem]">
                {group.title}
              </h2>
              <p className="mt-2 max-w-2xl text-body">{group.intro}</p>
              <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((service) => (
                  <article key={service.slug}>
                    <Link href={service.href} className="group block">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-white">
                        <Image
                          src={service.image}
                          alt={service.imageAlt}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                          sizes="(max-width: 1024px) 100vw, 380px"
                        />
                      </div>
                      <h3 className="font-display mt-4 text-[1.2rem] font-semibold text-navy sm:text-[1.3rem]">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-[0.98rem] leading-relaxed text-body">
                        {service.homeLine}
                      </p>
                      <span className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-semibold text-blue">
                        View service <ArrowRight className="size-4" />
                      </span>
                    </Link>
                  </article>
                ))}
              </div>
            </Container>
          </section>
        );
      })}
    </>
  );
}
