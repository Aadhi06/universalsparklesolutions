import { projects as seedProjects, type Project } from "@/lib/site";
import { readJsonFile, writeJsonFile } from "@/lib/store/io";

const FILE = "projects.json";

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || crypto.randomUUID();
}

export async function listProjects() {
  const stored = await readJsonFile<Project[] | null>(FILE, null);
  if (Array.isArray(stored)) return stored;
  return seedProjects.map((project) => ({ ...project }));
}

export async function getProject(id: string) {
  const items = await listProjects();
  return items.find((item) => item.id === id) ?? null;
}

export async function saveProjects(items: Project[]) {
  await writeJsonFile(FILE, items);
}

export async function upsertProject(input: Omit<Project, "id"> & { id?: string }) {
  const items = await listProjects();
  const id = input.id || slugify(input.title);
  const next: Project = { ...input, id };
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    items.unshift(next);
  } else {
    items[index] = next;
  }

  await saveProjects(items);
  return next;
}

export async function deleteProject(id: string) {
  const items = await listProjects();
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;
  await saveProjects(next);
  return true;
}
