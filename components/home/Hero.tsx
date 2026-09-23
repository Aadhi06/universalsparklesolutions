import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section className="overflow-hidden border-b border-line bg-white">
      <Container className="grid items-stretch lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="flex flex-col justify-center py-10 sm:py-16 lg:py-24 lg:pr-14">
          <p className="text-[0.72rem] font-semibold tracking-[0.14em] text-blue uppercase sm:text-[0.78rem] sm:tracking-[0.2em]">
            Cleaning & Facility Support
          </p>
          <h1 className="font-display mt-3 text-[1.7rem] leading-[1.15] font-semibold text-pretty text-navy sm:mt-4 sm:text-[2.85rem] lg:text-[3.25rem]">
            Professional Cleaning.
            <span className="block">Consistent Standards.</span>
            <span className="block">Every Visit.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-body sm:mt-6 sm:text-[1.08rem]">
            Commercial, healthcare, education and builders cleaning across
            Melbourne Metropolitan Area and Regional Victoria.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <ButtonLink href="/contact#quote" className="w-full sm:w-auto">
              Request a Free Quote
            </ButtonLink>
            <ButtonLink href="#services" variant="secondary" className="w-full sm:w-auto">
              Explore Our Services
            </ButtonLink>
          </div>
        </div>

        <div className="relative -mx-5 aspect-[16/10] sm:-mx-6 sm:min-h-[360px] sm:aspect-auto lg:mx-0 lg:min-h-[620px]">
          <Image
            src="/images/hero-office.jpg"
            alt="A bright, modern commercial meeting room with a clean floor, timber table and full-height windows."
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
          <div className="absolute inset-y-0 left-0 hidden w-16 bg-linear-to-r from-white to-transparent lg:block" />
        </div>
      </Container>
    </section>
  );
}
