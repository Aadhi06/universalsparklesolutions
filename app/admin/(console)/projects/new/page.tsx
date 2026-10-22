import Link from "next/link";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/projects" className="inline-flex min-h-11 items-center font-semibold text-blue">
        Back to projects
      </Link>
      <h1 className="font-display mt-4 text-[1.7rem] font-semibold text-navy sm:text-[2rem]">
        Add project
      </h1>
      <p className="mt-2 text-body">
        New work stays hidden until you publish it.
      </p>
      <div className="mt-6">
        <ProjectForm />
      </div>
    </div>
  );
}
