import { NextResponse } from "next/server";
import { readChatImage } from "@/lib/chat/images";
import { getEnquiryByReplyToken } from "@/lib/store/enquiries";

export async function GET(
  _request: Request,
  context: {
    params: Promise<{ token: string; messageId: string; imageId: string }>;
  },
) {
  const { token, messageId, imageId } = await context.params;
  const enquiry = await getEnquiryByReplyToken(token);
  if (!enquiry) return NextResponse.json({ message: "Not found." }, { status: 404 });

  const message = enquiry.messages?.find((item) => item.id === messageId);
  const image = message?.images?.find((item) => item.id === imageId);
  if (!image) return NextResponse.json({ message: "Not found." }, { status: 404 });

  const file = await readChatImage(image.pathname);
  if (!file) return NextResponse.json({ message: "Not found." }, { status: 404 });

  return new NextResponse(file.stream, {
    headers: {
      "Content-Type": image.contentType || file.contentType,
      "Cache-Control": "private, max-age=3600",
      ...(file.size ? { "Content-Length": String(file.size) } : {}),
    },
  });
}
