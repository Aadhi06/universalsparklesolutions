import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/admin/guard";
import { addStaffMessage, cleanChatText, publicMessage, resendStaffMessage } from "@/lib/chat/messages";
import { markTyping, readTyping } from "@/lib/chat/typing";
import { getEnquiry } from "@/lib/store/enquiries";

async function denied() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }
  return null;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const blocked = await denied();
  if (blocked) return blocked;
  const { id } = await context.params;
  const enquiry = await getEnquiry(id);
  if (!enquiry) return NextResponse.json({ message: "Not found." }, { status: 404 });
  const typing = await readTyping(id);
  return NextResponse.json({
    messages: (enquiry.messages ?? []).map(publicMessage),
    typing: typing.customer,
  });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const blocked = await denied();
  if (blocked) return blocked;
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as {
    text?: unknown;
    typing?: boolean;
    messageId?: string;
  };

  if (body.typing) {
    const enquiry = await getEnquiry(id);
    if (!enquiry) return NextResponse.json({ message: "Not found." }, { status: 404 });
    await markTyping(id, "staff");
    return NextResponse.json({ ok: true });
  }

  if (body.messageId) {
    const message = await resendStaffMessage(id, body.messageId);
    if (!message) return NextResponse.json({ message: "Message not found." }, { status: 404 });
    return NextResponse.json({ message });
  }

  const text = cleanChatText(body.text);
  if (!text || text.length > 2000) {
    return NextResponse.json({ message: "Write a message of 2,000 characters or less." }, { status: 400 });
  }

  const message = await addStaffMessage(id, text);
  if (!message) return NextResponse.json({ message: "Not found." }, { status: 404 });
  revalidatePath("/admin/chats");
  revalidatePath(`/admin/enquiries/${id}/chat`);
  return NextResponse.json({ message });
}
