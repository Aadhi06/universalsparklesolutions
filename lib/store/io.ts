import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { get, put } from "@vercel/blob";

const dataDirectory = path.join(process.cwd(), ".data");
const blobPrefix = "uss-data/";

let writeQueue: Promise<void> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>) {
  const run = writeQueue.then(task, task);
  writeQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

/** Durable Blob store on Vercel; local `.data` for development. */
export function blobEnabled() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
      (process.env.BLOB_STORE_ID?.trim() && process.env.VERCEL),
  );
}

function blobPath(filename: string) {
  return `${blobPrefix}${filename}`;
}

export function dataPath(filename: string) {
  return path.join(dataDirectory, filename);
}

async function readBlobJson<T>(filename: string, fallback: T): Promise<T> {
  const result = await get(blobPath(filename), {
    access: "private",
    useCache: false,
  });
  if (!result || result.statusCode !== 200 || !result.stream) return fallback;
  const raw = await new Response(result.stream).text();
  if (!raw.trim()) return fallback;
  return JSON.parse(raw) as T;
}

async function writeBlobJson(filename: string, value: unknown) {
  await put(blobPath(filename), JSON.stringify(value, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}

async function readLocalJson<T>(filename: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(dataPath(filename), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeLocalJson(filename: string, value: unknown) {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(dataPath(filename), JSON.stringify(value, null, 2));
}

export async function readJsonFile<T>(filename: string, fallback: T): Promise<T> {
  try {
    if (blobEnabled()) return await readBlobJson(filename, fallback);
    return await readLocalJson(filename, fallback);
  } catch (error) {
    console.error("store-read-failed", filename, error);
    return fallback;
  }
}

export async function writeJsonFile(filename: string, value: unknown) {
  return enqueue(async () => {
    if (blobEnabled()) {
      await writeBlobJson(filename, value);
      return;
    }
    await writeLocalJson(filename, value);
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
      current = blobEnabled()
        ? await readBlobJson(filename, fallback)
        : await readLocalJson(filename, fallback);
    } catch (error) {
      console.error("store-read-failed", filename, error);
      current = fallback;
    }
    const next = await update(current);
    if (blobEnabled()) await writeBlobJson(filename, next);
    else await writeLocalJson(filename, next);
    return next;
  });
}
