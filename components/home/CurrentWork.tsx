import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/lib/site";

export function CurrentWork() {
  const visible = projects.filter((project) => project.published);

  return (
    <section
      id="current-work"
      className="scroll-mt-24 bg-white py-12 sm:py-20 lg:py-24"
    >
      <Container>
        <SectionHeading
          title="Experience Across Different Environments"
          intro="A selection of current work. Named client references are shown only where publication has been approved."
        />

        <div className="mt-8 grid gap-8 sm:mt-12 md:grid-cols-2">
          {visible.map((project, index) => (
            <article key={project.id} className="border-b border-line pb-8">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-surface">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 580px"
                  className="object-cover"
                />
              </div>
              <p className="font-display mt-5 text-lg font-semibold text-gold">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-1 text-[0.75rem] font-semibold tracking-[0.14em] text-blue uppercase">
                {project.category}
              </p>
              <h3 className="font-display mt-2 text-[1.25rem] font-semibold text-navy">
                {project.title}
              </h3>
              <p className="mt-3 leading-relaxed text-body">{project.summary}</p>
            </article>
          ))}
        </div>

        <p className="mt-6 text-[0.9rem] text-muted">
          Photographs on this page are representative of the environments we
          clean. They are not images of these contracts.
        </p>
      </Container>
    </section>
  );
}
