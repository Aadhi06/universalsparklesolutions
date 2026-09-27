import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/lib/site";

export function Process() {
  return (
    <section className="bg-surface py-12 sm:py-16 lg:py-20">
      <Container>
        <SectionHeading title="How a Cleaning Quote Works" />
        <ol className="mt-8 grid gap-6 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {processSteps.map((step) => (
            <li key={step.number}>
              <p className="font-display text-[1.75rem] font-semibold text-gold">
                {step.number}
              </p>
              <h3 className="font-display mt-2 text-[1.1rem] font-semibold text-navy">
                {step.title}
              </h3>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
