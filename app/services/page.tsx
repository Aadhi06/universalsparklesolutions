import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/layout/PageIntro";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Commercial, healthcare, education and builders cleaning, with residential cleaning available on request.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Services"
        title="Cleaning services for workplaces, facilities and completed builds"
        intro="Practical cleaning solutions tailored to your premises, operating hours and service requirements."
      />
      <section className="bg-white py-12 sm:py-16">
        <Container className="grid gap-10 md:grid-cols-2">
          {services.map((service) => (
            <article key={service.slug}>
              <Link href={service.href} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[6px]">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 560px"
                  />
                </div>
                <h2 className="font-display mt-4 text-[1.35rem] font-semibold text-navy sm:mt-5 sm:text-2xl">
                  {service.title}
                </h2>
                <p className="mt-2 leading-relaxed text-body">
                  {service.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 font-semibold text-blue">
                  Explore Service <ArrowRight className="size-4" />
                </span>
              </Link>
            </article>
          ))}
        </Container>
        <Container>
          <p className="mt-12 border-t border-line pt-8 text-body">
            Looking for routine home cleaning?{" "}
            <Link href="/contact#quote" className="font-semibold text-blue hover:underline">
              Speak to our team.
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}
