import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export function ServiceArea() {
  return (
    <section className="bg-white py-12 sm:py-20 lg:py-24">
      <Container className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="font-display text-[1.65rem] leading-[1.2] font-semibold text-pretty text-navy sm:text-[2.35rem]">
            Across Melbourne and Regional Victoria
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-body">
            We provide cleaning services throughout Melbourne Metropolitan
            Area and Regional Victoria. Contact our team to discuss your
            location and requirements.
          </p>
          <p className="mt-4 max-w-xl text-[0.95rem] text-muted">
            The photograph shows Melbourne&apos;s city skyline from Princes
            Bridge. We do not claim offices in individual suburbs unless they
            have been confirmed.
          </p>
          <ButtonLink href="/contact#quote" className="mt-8 w-full sm:w-auto">
            Discuss your location
          </ButtonLink>
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
