import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  addCustomerMessage,
  cleanChatText,
  customerReplyLimited,
  publicMessage,
} from "@/lib/chat/messages";
import { markTyping, readTyping } from "@/lib/chat/typing";
import { getEnquiryByReplyToken } from "@/lib/store/enquiries";

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  const enquiry = await getEnquiryByReplyToken(token);
  if (!enquiry) return NextResponse.json({ message: "Not found." }, { status: 404 });
  const typing = await readTyping(enquiry.id);
  return NextResponse.json({
    messages: (enquiry.messages ?? []).map(publicMessage),
    typing: typing.staff,
  });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  const enquiry = await getEnquiryByReplyToken(token);
  if (!enquiry) return NextResponse.json({ message: "Not found." }, { status: 404 });

  const body = (await request.json().catch(() => ({}))) as {
    text?: unknown;
    typing?: boolean;
  };

  if (body.typing) {
    await markTyping(enquiry.id, "customer");
    return NextResponse.json({ ok: true });
  }

  const text = cleanChatText(body.text);
  if (!text || text.length > 2000 || customerReplyLimited(token)) {
    return NextResponse.json(
      { message: "Write a shorter message, or wait a few minutes before sending another reply." },
      { status: 400 },
    );
  }

  const saved = await addCustomerMessage(token, text);
  if (!saved?.message) return NextResponse.json({ message: "Not found." }, { status: 404 });
  revalidatePath("/admin/chats");
  revalidatePath(`/admin/enquiries/${enquiry.id}/chat`);
  revalidatePath(`/chat/${token}`);
  return NextResponse.json({ message: saved.message });
}
