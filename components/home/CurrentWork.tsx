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

        <div className="mt-8 divide-y divide-line border-y border-line sm:mt-12">
          {visible.map((project, index) => (
            <article
              key={project.id}
              className="grid gap-3 py-6 sm:py-8 md:grid-cols-[88px_minmax(0,280px)_1fr] md:gap-10"
            >
              <p className="font-display text-2xl font-semibold text-gold">
                {String(index + 1).padStart(2, "0")}
              </p>
              <div>
                <p className="text-[0.75rem] font-semibold tracking-[0.14em] text-blue uppercase">
                  {project.category}
                </p>
                <h3 className="font-display mt-2 text-[1.25rem] font-semibold text-navy">
                  {project.title}
                </h3>
              </div>
              <p className="leading-relaxed text-body">{project.summary}</p>
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
