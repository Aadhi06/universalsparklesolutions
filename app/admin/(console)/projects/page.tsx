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

      <div className="mt-8 overflow-x-auto rounded-[6px] border border-line bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line bg-surface text-xs font-semibold tracking-[0.08em] text-muted uppercase">
            <tr>
              <th className="w-12 px-3 py-3">#</th>
              <th className="px-3 py-3">Project</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">Website</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr key={project.id} className="border-b border-line last:border-b-0">
                <td className="px-3 py-3 font-semibold text-navy tabular-nums">{index + 1}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-[6px] bg-surface">
                      <Image
                        src={project.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-navy">{project.title}</p>
                      <p className="text-muted">{project.homeLine}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-muted">{project.category}</td>
                <td className="px-3 py-3 text-navy">
                  {project.published ? "Published" : "Hidden"}
                  {project.isNamedClient ? " · Named client" : ""}
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-2">
                    <ButtonLink href={`/admin/projects/${project.id}`} variant="secondary">
                      Edit
                    </ButtonLink>
                    <form action={toggleProjectPublishedAction}>
                      <input type="hidden" name="id" value={project.id} />
                      <Button type="submit" variant="ghost">
                        {project.published ? "Hide" : "Publish"}
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
