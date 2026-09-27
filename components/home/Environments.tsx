import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { environments } from "@/lib/site";

export function Environments() {
  return (
    <section className="bg-surface py-12 sm:py-16 lg:py-20">
      <Container>
        <SectionHeading title="The Spaces We Clean Across Victoria" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-3">
          {environments.map((item) => (
            <figure key={item.title}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-white">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 400px"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-2.5 font-display text-[0.95rem] font-semibold text-navy sm:text-[1.05rem]">
                {item.title}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-[0.85rem] text-muted">
          Photographs are representative of these environments, not named contracts.
        </p>
      </Container>
    </section>
  );
}
