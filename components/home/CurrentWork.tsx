import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/lib/site";

export function CurrentWork() {
  const visible = projects.filter((project) => project.published);

  return (
    <section
      id="current-work"
      className="scroll-mt-24 bg-white py-12 sm:py-16 lg:py-20"
    >
      <Container>
        <SectionHeading title="Current Cleaning Work in Victoria" />

        <div className="mt-8 grid gap-6 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((project) => (
            <article key={project.id}>
              <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-surface">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 280px"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 text-[0.72rem] font-semibold tracking-[0.14em] text-blue uppercase">
                {project.category}
              </p>
              <h3 className="font-display mt-1 text-[1.1rem] font-semibold text-navy">
                {project.title}
              </h3>
              <p className="mt-1 text-[0.95rem] text-body">{project.homeLine}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
