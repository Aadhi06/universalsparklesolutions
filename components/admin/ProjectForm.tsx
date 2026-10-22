import { deleteProjectAction, saveProjectAction } from "@/app/admin/actions";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { Button } from "@/components/ui/Button";
import { projectImageOptions } from "@/lib/admin/images";
import type { Project } from "@/lib/site";

export function ProjectForm({ project }: { project?: Project }) {
  return (
    <form action={saveProjectAction} className="space-y-5 rounded-[6px] border border-line bg-white p-5 sm:p-6">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <Field label="Title" name="title" required defaultValue={project?.title} />
      <Field label="Category" name="category" required defaultValue={project?.category} />
      <Field
        label="Short homepage line"
        name="homeLine"
        required
        defaultValue={project?.homeLine}
      />
      <div>
        <label htmlFor="summary" className="mb-1.5 block text-sm font-medium text-navy">
          Summary <span className="text-blue">*</span>
        </label>
        <textarea
          id="summary"
          name="summary"
          required
          rows={5}
          defaultValue={project?.summary}
          className="w-full rounded-[6px] border border-line px-3 py-3 text-base text-navy outline-none focus:border-blue"
        />
      </div>
      <div>
        <label htmlFor="image" className="mb-1.5 block text-sm font-medium text-navy">
          Photograph <span className="text-blue">*</span>
        </label>
        <select
          id="image"
          name="image"
          required
          defaultValue={project?.image ?? projectImageOptions[0].src}
          className="min-h-12 w-full rounded-[6px] border border-line bg-white px-3 text-base text-navy outline-none focus:border-blue"
        >
          {projectImageOptions.map((image) => (
            <option key={image.src} value={image.src}>
              {image.label}
            </option>
          ))}
        </select>
      </div>
      <Field
        label="Image description"
        name="imageAlt"
        required
        defaultValue={project?.imageAlt}
      />
      <label className="flex min-h-11 items-center gap-3 text-navy">
        <input
          type="checkbox"
          name="published"
          defaultChecked={project?.published ?? false}
          className="size-4 accent-blue"
        />
        Publish on the homepage
      </label>
      <label className="flex min-h-11 items-center gap-3 text-navy">
        <input
          type="checkbox"
          name="isNamedClient"
          defaultChecked={project?.isNamedClient ?? false}
          className="size-4 accent-blue"
        />
        Named client (keep hidden until publication is approved)
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit">{project ? "Save project" : "Add project"}</Button>
        {project ? (
          <ConfirmSubmitButton
            formAction={deleteProjectAction}
            message="Delete this project? It will no longer appear in admin or on the website."
          >
            Delete project
          </ConfirmSubmitButton>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-navy">
        {label} {required ? <span className="text-blue">*</span> : null}
      </label>
      <input
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="min-h-12 w-full rounded-[6px] border border-line px-3 text-base text-navy outline-none focus:border-blue"
      />
    </div>
  );
}
