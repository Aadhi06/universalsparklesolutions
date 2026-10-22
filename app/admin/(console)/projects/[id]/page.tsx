import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { getProject } from "@/lib/store/projects";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/projects" className="inline-flex min-h-11 items-center font-semibold text-blue">
        Back to projects
      </Link>
      <h1 className="font-display mt-4 text-[1.7rem] font-semibold text-navy sm:text-[2rem]">
        Edit {project.title}
      </h1>
      <p className="mt-2 text-body">
        Changes to a published project appear on the homepage after you save.
      </p>
      <div className="mt-6">
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
