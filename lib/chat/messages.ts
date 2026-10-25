import { notifyStaff } from "@/lib/admin/notify";
import { sendEnquiryReplyEmail } from "@/lib/email/sendEnquiryReply";
import {
  appendEnquiryMessage,
  getEnquiry,
  getEnquiryByReplyToken,
  setEnquiryMessageEmailStatus,
  type EnquiryMessage,
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

export function publicMessage(message: EnquiryMessage) {
  return {
    id: message.id,
    at: message.at,
    from: message.from,
    text: message.text,
    emailStatus: message.emailStatus,
  };
}

export async function addStaffMessage(id: string, text: string) {
  const enquiry = await getEnquiry(id);
  if (!enquiry?.replyToken) return null;
  const emailStatus = await sendEnquiryReplyEmail(enquiry, text);
  const saved = await appendEnquiryMessage(id, {
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    from: "staff",
    text,
    emailStatus,
  });
  const message = saved?.messages?.at(-1);
  return message ? publicMessage(message) : null;
}

export async function resendStaffMessage(id: string, messageId: string) {
  const enquiry = await getEnquiry(id);
  const message = enquiry?.messages?.find((item) => item.id === messageId);
  if (!enquiry?.replyToken || !message || message.from !== "staff") return null;
  const emailStatus = await sendEnquiryReplyEmail(enquiry, message.text);
  await setEnquiryMessageEmailStatus(id, messageId, emailStatus);
  return { ...publicMessage(message), emailStatus };
}

export async function addCustomerMessage(token: string, text: string) {
  const enquiry = await getEnquiryByReplyToken(token);
  if (!enquiry) return null;
  const saved = await appendEnquiryMessage(enquiry.id, {
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    from: "customer",
    text,
  });
  if (!saved) return null;
  await notifyStaff({
    topic: "enquiries",
    title: `Reply from ${enquiry.fullName}`,
    body: `${enquiry.phone} · ${text.slice(0, 140)}`,
    url: `/admin/enquiries/${enquiry.id}/chat`,
  });
  const message = saved.messages?.at(-1);
  return {
    enquiryId: enquiry.id,
    message: message ? publicMessage(message) : null,
  };
}
