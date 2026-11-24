import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  collectImageFiles,
  validateChatImageFiles,
} from "@/lib/chat/images";
import {
  addCustomerMessage,
  cleanChatText,
  customerReplyLimited,
  publicMessage,
} from "@/lib/chat/messages";
import { markTyping, readTyping } from "@/lib/chat/typing";
import { getEnquiryByReplyToken } from "@/lib/store/enquiries";

function mediaBase(token: string) {
  return `/api/chat/${token}/media`;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  const enquiry = await getEnquiryByReplyToken(token);
  if (!enquiry) return NextResponse.json({ message: "Not found." }, { status: 404 });
  const typing = await readTyping(enquiry.id);
  return NextResponse.json({
    messages: (enquiry.messages ?? []).map((message) =>
      publicMessage(message, mediaBase(token)),
    ),
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
    if ((!text && files.length === 0) || text.length > 2000 || customerReplyLimited(token)) {
      return NextResponse.json(
        {
          message:
            "Write a shorter message, attach photos, or wait a few minutes before sending another reply.",
        },
        { status: 400 },
      );
    }

    try {
      const saved = await addCustomerMessage(token, text, files);
      if (!saved?.message) {
        return NextResponse.json({ message: "Not found." }, { status: 404 });
      }
      revalidatePath("/admin/chats");
      revalidatePath(`/admin/enquiries/${enquiry.id}/chat`);
      revalidatePath(`/chat/${token}`);
      return NextResponse.json({ message: saved.message });
    } catch (error) {
      console.error("customer-chat-upload-failed", enquiry.id, error);
      return NextResponse.json(
        { message: "We could not upload those photos. Please try again." },
        { status: 500 },
      );
    }
  }

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
