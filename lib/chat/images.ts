import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, get, put } from "@vercel/blob";
import {
  CHAT_IMAGE_TYPES,
  chatImageContentType,
} from "@/lib/chat/imageLimits";
import { blobEnabled, dataPath } from "@/lib/store/io";
import type { EnquiryMessageImage } from "@/lib/store/enquiries";

export {
  CHAT_IMAGE_MAX_BYTES,
  CHAT_IMAGE_MAX_COUNT,
  CHAT_IMAGE_TYPES,
  chatImageContentType,
  mediaBaseFromPollUrl,
  validateChatImageFiles,
} from "@/lib/chat/imageLimits";

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/heic": ".heic",
  "image/heif": ".heif",
};

const TYPE_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".heic": "image/heic",
  ".heif": "image/heif",
};

function extensionFor(contentType: string, name?: string) {
  if (EXT_BY_TYPE[contentType]) return EXT_BY_TYPE[contentType];
  const ext = path.extname(name || "").toLowerCase();
  if (ext && TYPE_BY_EXT[ext]) return ext;
  return ".bin";
}

function localRelativePath(pathname: string) {
  return pathname.startsWith("uss-data/") ? pathname.slice("uss-data/".length) : pathname;
}

export async function storeChatImages(
  enquiryId: string,
  messageId: string,
  files: File[],
): Promise<EnquiryMessageImage[]> {
  const stored: EnquiryMessageImage[] = [];
  try {
    for (const file of files) {
      const id = crypto.randomUUID();
      const contentType = chatImageContentType(file) || "application/octet-stream";
      const ext = extensionFor(contentType, file.name);
      const pathname = `uss-data/chat/${enquiryId}/${messageId}/${id}${ext}`;
      const bytes = Buffer.from(await file.arrayBuffer());

      if (blobEnabled()) {
        await put(pathname, bytes, {
          access: "private",
          contentType,
          addRandomSuffix: false,
          allowOverwrite: true,
          cacheControlMaxAge: 60 * 60 * 24 * 30,
        });
      } else {
        const fullPath = dataPath(localRelativePath(pathname));
        await mkdir(path.dirname(fullPath), { recursive: true });
        await writeFile(fullPath, bytes);
      }

      stored.push({
        id,
        pathname,
        contentType,
        size: file.size,
        name: file.name.slice(0, 180) || undefined,
      });
    }
    return stored;
  } catch (error) {
    await Promise.all(stored.map((image) => deleteChatImage(image.pathname).catch(() => undefined)));
    throw error;
  }
}

export async function deleteChatImage(pathname: string) {
  if (blobEnabled()) {
    await del(pathname);
    return;
  }
  const { unlink } = await import("node:fs/promises");
  await unlink(dataPath(localRelativePath(pathname))).catch(() => undefined);
}

export async function readChatImage(pathname: string) {
  if (blobEnabled()) {
    const result = await get(pathname, { access: "private", useCache: true });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    return {
      stream: result.stream,
      contentType: result.blob.contentType || "application/octet-stream",
      size: result.blob.size,
    };
  }

  try {
    const bytes = await readFile(dataPath(localRelativePath(pathname)));
    const ext = path.extname(pathname).toLowerCase();
    return {
      stream: new ReadableStream({
        start(controller) {
          controller.enqueue(bytes);
          controller.close();
        },
      }),
      contentType: TYPE_BY_EXT[ext] || "application/octet-stream",
      size: bytes.byteLength,
    };
  } catch {
    return null;
  }
}

export function collectImageFiles(formData: FormData) {
  return formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
}

export function isAcceptedChatImageType(type: string) {
  return CHAT_IMAGE_TYPES.includes(type as (typeof CHAT_IMAGE_TYPES)[number]);
}
