import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { aboutPoints } from "@/lib/site";

export function About() {
  return (
    <section className="bg-surface py-12 sm:py-20 lg:py-24">
      <Container className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] sm:aspect-[5/4] lg:aspect-[4/5]">
          <Image
            src="/images/about-working.jpg"
            alt="A cleaner using a pole tool on full-height windows in a bright, modern interior."
            fill
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-cover object-[50%_20%]"
          />
        </div>
        <div>
          <p className="text-[0.72rem] font-semibold tracking-[0.14em] text-blue uppercase sm:text-[0.78rem] sm:tracking-[0.18em]">
            About the company
          </p>
          <h2 className="font-display mt-3 text-[1.65rem] leading-[1.2] font-semibold text-pretty text-navy sm:text-[2.35rem]">
            A Professional Team Behind Every Clean
          </h2>
          <p className="mt-5 leading-relaxed text-body">
            Universal Sparkle Solution provides commercial cleaning and
            facility support for workplaces that need a reliable standard,
            visit after visit. The team works with experienced staff, modern
            equipment, environmentally responsible products and quality
            assurance processes.
          </p>
          <p className="mt-4 leading-relaxed text-body">
            Each site is treated as its own environment. We agree what needs
            to be cleaned, how often, and how quality will be checked, then
            deliver that plan with clear communication.
          </p>
          <ul className="mt-8 space-y-3">
            {aboutPoints.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span
                  className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-gold"
                  aria-hidden
                />
                <span className="font-medium text-navy">{point}</span>
              </li>
            ))}
          </ul>
          <ButtonLink href="/about" className="mt-8 w-full sm:w-auto">
            About Universal Sparkle
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
