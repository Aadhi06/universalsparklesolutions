import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDirectory = process.env.VERCEL
  ? path.join("/tmp", "uss-data")
  : path.join(process.cwd(), ".data");

let writeQueue: Promise<void> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>) {
  const run = writeQueue.then(task, task);
  writeQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export function dataPath(filename: string) {
  return path.join(dataDirectory, filename);
}

export async function readJsonFile<T>(filename: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(dataPath(filename), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJsonFile(filename: string, value: unknown) {
  return enqueue(async () => {
    await mkdir(dataDirectory, { recursive: true });
    await writeFile(dataPath(filename), JSON.stringify(value, null, 2));
  });
}

export async function updateJsonFile<T>(
  filename: string,
  fallback: T,
  update: (current: T) => T | Promise<T>,
) {
  return enqueue(async () => {
    let current = fallback;
    try {
      current = JSON.parse(await readFile(dataPath(filename), "utf8")) as T;
    } catch {
      current = fallback;
    }
    const next = await update(current);
    await mkdir(dataDirectory, { recursive: true });
    await writeFile(dataPath(filename), JSON.stringify(next, null, 2));
    return next;
  });
}
