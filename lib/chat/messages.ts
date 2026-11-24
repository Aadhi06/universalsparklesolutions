import { notifyStaff } from "@/lib/admin/notify";
import { sendEnquiryReplyEmail } from "@/lib/email/sendEnquiryReply";
import { storeChatImages } from "@/lib/chat/images";
import {
  appendEnquiryMessage,
  getEnquiry,
  getEnquiryByReplyToken,
  setEnquiryMessageEmailStatus,
  type Enquiry,
  type EnquiryMessage,
  type EnquiryMessageImage,
} from "@/lib/store/enquiries";

const hits = new Map<string, number[]>();

export function cleanChatText(value: unknown) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
}

export function customerReplyLimited(token: string) {
  const now = Date.now();
  const recent = (hits.get(token) ?? []).filter((time) => now - time < 10 * 60 * 1000);
  recent.push(now);
  hits.set(token, recent);
  return recent.length > 8;
}

export type PublicEnquiryMessage = {
  id: string;
  at: string;
  from: EnquiryMessage["from"];
  text: string;
  emailStatus?: EnquiryMessage["emailStatus"];
  images?: Array<{
    id: string;
    contentType: string;
    size: number;
    name?: string;
    url: string;
  }>;
};

export function publicMessage(
  message: EnquiryMessage,
  mediaBase?: string,
): PublicEnquiryMessage {
  return {
    id: message.id,
    at: message.at,
    from: message.from,
    text: message.text,
    emailStatus: message.emailStatus,
    images: message.images?.map((image) => ({
      id: image.id,
      contentType: image.contentType,
      size: image.size,
      name: image.name,
      url: mediaBase
        ? `${mediaBase.replace(/\/$/, "")}/${message.id}/${image.id}`
        : "",
    })),
  };
}

export async function addStaffMessage(
  id: string,
  text: string,
  files: File[] = [],
) {
  const enquiry = await getEnquiry(id);
  if (!enquiry?.replyToken) return null;

  const messageId = crypto.randomUUID();
  let images: EnquiryMessageImage[] = [];
  if (files.length > 0) {
    images = await storeChatImages(id, messageId, files);
  }

  const emailStatus = await sendEnquiryReplyEmail(enquiry, text, {
    imageCount: images.length,
  });
  const saved = await appendEnquiryMessage(id, {
    id: messageId,
    at: new Date().toISOString(),
    from: "staff",
    text,
    images: images.length ? images : undefined,
    emailStatus,
  });
  const message = saved?.messages?.at(-1);
  return message
    ? publicMessage(message, `/api/admin/enquiries/${id}/chat/media`)
    : null;
}

export async function resendStaffMessage(id: string, messageId: string) {
  const enquiry = await getEnquiry(id);
  const message = enquiry?.messages?.find((item) => item.id === messageId);
  if (!enquiry?.replyToken || !message || message.from !== "staff") return null;
  const emailStatus = await sendEnquiryReplyEmail(enquiry, message.text, {
    imageCount: message.images?.length ?? 0,
  });
  await setEnquiryMessageEmailStatus(id, messageId, emailStatus);
  return {
    ...publicMessage(message, `/api/admin/enquiries/${id}/chat/media`),
    emailStatus,
  };
}

export async function addCustomerMessage(
  token: string,
  text: string,
  files: File[] = [],
) {
  const enquiry = await getEnquiryByReplyToken(token);
  if (!enquiry) return null;

  const messageId = crypto.randomUUID();
  let images: EnquiryMessageImage[] = [];
  if (files.length > 0) {
    images = await storeChatImages(enquiry.id, messageId, files);
  }

  const saved = await appendEnquiryMessage(enquiry.id, {
    id: messageId,
    at: new Date().toISOString(),
    from: "customer",
    text,
    images: images.length ? images : undefined,
  });
  if (!saved) return null;
  await notifyCustomerReply(enquiry, text, images.length);
  const message = saved.messages?.at(-1);
  return {
    enquiryId: enquiry.id,
    message: message
      ? publicMessage(message, `/api/chat/${token}/media`)
      : null,
  };
}

function preview(text: string, max = 120) {
  const plain = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return plain.length > max ? `${plain.slice(0, max - 1).trimEnd()}…` : plain;
}

function photoNote(count: number) {
  return count === 1 ? "sent 1 photo" : `sent ${count} photos`;
}

/** Push + email the staff for every customer chat message; never throws. */
export async function notifyCustomerReply(
  enquiry: Enquiry,
  text: string,
  imageCount = 0,
) {
  const name = enquiry.fullName.trim() || "a customer";
  const context = [enquiry.service, enquiry.location].filter(Boolean).join(" · ");
  const detail = text.trim()
    ? imageCount > 0
      ? `${preview(text)}\n(${photoNote(imageCount)})`
      : preview(text)
    : photoNote(imageCount);
  try {
    await notifyStaff({
      topic: "enquiries",
      title: `New reply from ${name}`,
      body: context ? `${context}\n${detail}` : detail,
      url: `/admin/enquiries/${enquiry.id}/chat`,
    });
  } catch (error) {
    console.error("customer-reply-notify-failed", enquiry.id, error);
  }
}
