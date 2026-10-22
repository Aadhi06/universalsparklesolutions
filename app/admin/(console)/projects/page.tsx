import Image from "next/image";
import Link from "next/link";
import { toggleProjectPublishedAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/Button";
import { listProjects } from "@/lib/store/projects";

export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[1.7rem] font-semibold text-navy sm:text-[2rem]">
            Projects
          </h1>
          <p className="mt-2 max-w-2xl text-body">
            Published items appear on the homepage. Named-client work can stay
            hidden until approval is confirmed.
          </p>
        </div>
        <ButtonLink href="/admin/projects/new" className="w-full sm:w-auto">
          Add project
        </ButtonLink>
      </div>

      <ul className="mt-8 grid gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <li key={project.id} className="overflow-hidden rounded-[6px] border border-line bg-white">
            <div className="relative aspect-[16/10] bg-surface">
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 480px"
              />
            </div>
            <div className="p-5">
              <p className="text-[0.72rem] font-semibold tracking-[0.14em] text-blue uppercase">
                {project.category}
              </p>
              <h2 className="font-display mt-1 text-xl font-semibold text-navy">
                {project.title}
              </h2>
              <p className="mt-2 text-body">{project.homeLine}</p>
              <p className="mt-3 text-sm font-medium text-navy">
                {project.published ? "Published on the website" : "Hidden from the website"}
                {project.isNamedClient ? " · Named client" : ""}
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <ButtonLink
                  href={`/admin/projects/${project.id}`}
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  Edit
                </ButtonLink>
                <form action={toggleProjectPublishedAction}>
                  <input type="hidden" name="id" value={project.id} />
                  <Button type="submit" variant="ghost" className="w-full sm:w-auto">
                    {project.published ? "Hide" : "Publish"}
                  </Button>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
