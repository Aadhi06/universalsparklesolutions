import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { typicalScope } from "@/lib/site";

export function TypicalScope() {
  return (
    <section className="bg-surface py-12 sm:py-20 lg:py-24">
      <Container className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            title="What a Cleaning Visit Can Cover"
            intro="The exact scope is agreed for each premises. A typical commercial visit can include the areas below."
          />
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {typicalScope.map((item) => (
              <li key={item.title}>
                <h3 className="font-display text-[1.05rem] font-semibold text-navy">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[0.98rem] leading-relaxed text-body">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[6px]">
          <Image
            src="/images/env-cleaning.jpg"
            alt="A cleaner wearing gloves and a mask wiping a window, representing detailed finishing work."
            fill
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
