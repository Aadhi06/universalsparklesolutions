import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pricingPackages } from "@/lib/site";

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 bg-surface py-12 sm:py-16 lg:py-20">
      <Container>
        <SectionHeading
          title="Transparent starting prices"
          intro="Indicative residential guides to help you plan. The confirmed quote follows property size, condition, access and inclusions — always before booking."
        />

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {pricingPackages.map((item) => (
            <article
              key={item.id}
              className="flex flex-col overflow-hidden rounded-[6px] border border-line bg-white"
            >
              <div className="relative aspect-[16/10] bg-surface">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="font-display text-[1.08rem] font-semibold text-navy sm:text-[1.15rem]">
                  {item.title}
                </h3>
                <p className="mt-4 font-display text-[1.85rem] font-semibold tracking-[-0.03em] text-blue">
                  {item.fromPrice}
                </p>
                <p className="mt-1 text-[0.88rem] text-muted">{item.priceNote}</p>
                <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-body">
                  {item.summary}
                </p>
                <Link
                  href={`/services/${item.serviceSlug}`}
                  className="mt-5 inline-flex min-h-11 items-center gap-1.5 text-[0.95rem] font-semibold text-blue"
                >
                  View service
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
          <ButtonLink href="/contact#quote" className="w-full sm:w-auto">
            Request a Free Quote
          </ButtonLink>
          <ButtonLink
            href="/pricing"
            variant="secondary"
            className="w-full sm:w-auto"
          >
            Full pricing guide
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
