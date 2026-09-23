import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { environments } from "@/lib/site";

export function Environments() {
  return (
    <section className="bg-white py-12 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          title="The Environments We Clean"
          intro="Offices, clinics, schools, warehouses and completed builds. Photographs are representative of these environments. They are not images of named contracts."
        />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-3">
          {environments.map((item) => (
            <figure key={item.title} className="group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-surface">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 400px"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </div>
              <figcaption className="mt-2.5 font-display text-[0.95rem] font-semibold text-navy sm:text-[1.05rem]">
                {item.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
