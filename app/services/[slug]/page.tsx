import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/layout/PageIntro";
import { services } from "@/lib/site";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: service.href },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  return (
    <>
      <PageIntro
        eyebrow="Services"
        title={service.title}
        intro={service.summary}
      />
      <section className="bg-white py-12 sm:py-16">
        <Container className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-[16/11] overflow-hidden rounded-[6px]">
            <Image
              src={service.image}
              alt={service.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 600px"
              priority
            />
          </div>
          <div>
            <p className="leading-relaxed text-body">{service.description}</p>
            <h2 className="font-display mt-8 text-xl font-semibold text-navy">
              What this service can include
            </h2>
            <ul className="mt-4 space-y-2.5">
              {service.includes.map((item) => (
                <li key={item} className="flex gap-3 text-body">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 leading-relaxed text-body">
              Tell us about the premises, suburb or postcode, and the frequency
              you have in mind. We will contact you to discuss the scope. A
              quote request is not a confirmed booking.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact#quote" className="w-full sm:w-auto">
                Request a Free Quote
              </ButtonLink>
              <ButtonLink href="/services" variant="secondary" className="w-full sm:w-auto">
                View all services
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
      <section className="bg-surface py-12 sm:py-16">
        <Container className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-[16/11] overflow-hidden rounded-[6px]">
            <Image
              src={service.galleryImage}
              alt={service.galleryImageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 600px"
            />
          </div>
          <div>
            <h2 className="font-display text-[1.65rem] font-semibold text-navy">
              Talk through your site
            </h2>
            <p className="mt-4 leading-relaxed text-body">
              Every premises is different. Share the areas that matter, the
              hours the building is used, and any access or product
              requirements. We will reply to discuss the work.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
