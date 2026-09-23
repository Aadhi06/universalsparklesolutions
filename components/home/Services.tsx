import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/lib/site";

export function Services() {
  return (
    <section id="services" className="scroll-mt-24 bg-white py-12 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          title="Cleaning Expertise for Every Environment"
          intro="Practical cleaning solutions tailored to your premises, operating hours and service requirements."
        />

        <div className="mt-8 grid gap-x-8 gap-y-10 sm:mt-12 md:grid-cols-2 md:gap-y-12">
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
                <div className="mt-5">
                  <h3 className="font-display text-[1.2rem] font-semibold text-navy sm:text-[1.35rem]">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-[0.98rem] leading-relaxed text-body">
                    {service.summary}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[0.95rem] font-semibold text-blue">
                    Explore Service
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <p className="mt-12 border-t border-line pt-8 text-[1rem] text-body">
          Looking for routine home cleaning?{" "}
          <Link href="/contact#quote" className="font-semibold text-blue hover:underline">
            Speak to our team.
          </Link>
        </p>
      </Container>
    </section>
  );
}
