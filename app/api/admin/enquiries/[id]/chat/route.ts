import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/admin/guard";
import {
  collectImageFiles,
  validateChatImageFiles,
} from "@/lib/chat/images";
import {
  addStaffMessage,
  cleanChatText,
  publicMessage,
  resendStaffMessage,
} from "@/lib/chat/messages";
import { markTyping, readTyping } from "@/lib/chat/typing";
import { getEnquiry } from "@/lib/store/enquiries";

async function denied() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }
  return null;
}

function mediaBase(id: string) {
  return `/api/admin/enquiries/${id}/chat/media`;
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
    messages: (enquiry.messages ?? []).map((message) =>
      publicMessage(message, mediaBase(id)),
    ),
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
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ message: "Invalid upload." }, { status: 400 });
    }

    const text = cleanChatText(formData.get("text"));
    const files = collectImageFiles(formData);
    const imageError = validateChatImageFiles(files);
    if (imageError) {
      return NextResponse.json({ message: imageError }, { status: 400 });
    }
    if ((!text && files.length === 0) || text.length > 2000) {
      return NextResponse.json(
        { message: "Write a message or attach photos (2,000 characters or less)." },
        { status: 400 },
      );
    }

    try {
      const message = await addStaffMessage(id, text, files);
      if (!message) return NextResponse.json({ message: "Not found." }, { status: 404 });
      revalidatePath("/admin/chats");
      revalidatePath(`/admin/enquiries/${id}/chat`);
      return NextResponse.json({ message });
    } catch (error) {
      console.error("staff-chat-upload-failed", id, error);
      return NextResponse.json(
        { message: "We could not upload those photos. Please try again." },
        { status: 500 },
      );
    }
  }

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
