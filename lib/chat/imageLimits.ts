export const CHAT_IMAGE_MAX_COUNT = 8;
export const CHAT_IMAGE_MAX_BYTES = 6 * 1024 * 1024;
export const CHAT_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
] as const;

const TYPE_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".heic": "image/heic",
  ".heif": "image/heif",
};

export function mediaBaseFromPollUrl(pollUrl: string) {
  return `${pollUrl.replace(/\/$/, "")}/media`;
}

export function chatImageContentType(file: { type?: string; name?: string }) {
  const typed = (file.type || "").toLowerCase().trim();
  if (CHAT_IMAGE_TYPES.includes(typed as (typeof CHAT_IMAGE_TYPES)[number])) return typed;
  const name = file.name || "";
  const dot = name.lastIndexOf(".");
  const ext = dot >= 0 ? name.slice(dot).toLowerCase() : "";
  return TYPE_BY_EXT[ext] || "";
}

export function validateChatImageFiles(files: Array<{ type?: string; name?: string; size: number }>) {
  if (files.length > CHAT_IMAGE_MAX_COUNT) {
    return `You can attach up to ${CHAT_IMAGE_MAX_COUNT} photos.`;
  }
  for (const file of files) {
    const type = chatImageContentType(file);
    if (!type) {
      return "Photos must be JPEG, PNG, WebP, GIF or HEIC.";
    }
    if (file.size > CHAT_IMAGE_MAX_BYTES) {
      return "Each photo must be 6 MB or smaller.";
    }
  }
  return null;
}
