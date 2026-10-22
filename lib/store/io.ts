import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDirectory = path.join(process.cwd(), ".data");

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
