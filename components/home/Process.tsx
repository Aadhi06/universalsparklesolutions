import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/lib/site";

export function Process() {
  return (
    <section className="bg-surface py-12 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading title="A Clear Process from Enquiry to Inspection" />
        <ol className="mt-8 grid gap-8 sm:mt-12 md:grid-cols-2 md:gap-10 lg:grid-cols-4 lg:gap-8">
          {processSteps.map((step) => (
            <li key={step.number}>
              <p className="font-display text-[2rem] font-semibold text-gold">
                {step.number}
              </p>
              <h3 className="font-display mt-3 text-[1.15rem] font-semibold text-navy">
                {step.title}
              </h3>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-body">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
