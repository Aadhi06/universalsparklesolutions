import Link from "next/link";
import { notFound } from "next/navigation";
import { CollapsibleEnquiryDetails } from "@/components/admin/CollapsibleEnquiryDetails";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { CopyLink } from "@/components/chat/CopyLink";
import { LiveChat } from "@/components/chat/LiveChat";
import { appOrigin } from "@/lib/admin/origin";
import { formatDateTime, telHref } from "@/lib/admin/format";
import { mailConfigured } from "@/lib/email/sendEnquiryReply";
import { ensureReplyToken } from "@/lib/store/enquiries";

export default async function EnquiryChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const enquiry = await ensureReplyToken(id);
  if (!enquiry?.replyToken) notFound();

  const chatUrl = `${await appOrigin()}/chat/${enquiry.replyToken}`;
  const call = telHref(enquiry.phone);

  return (
    <div className="mx-auto flex h-[calc(100dvh-8.5rem)] max-w-3xl flex-col lg:h-[calc(100dvh-4rem)]">
      <div className="shrink-0">
        <Link
          href="/admin/chats"
          className="inline-flex min-h-11 items-center font-semibold text-blue"
        >
          Chats
        </Link>
        <div className="mt-1 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate font-display text-[1.45rem] font-semibold text-navy">
              {enquiry.fullName}
            </h1>
            <p className="mt-0.5 truncate text-sm text-muted">
              {enquiry.service} · {enquiry.location}
            </p>
          </div>
          <StatusBadge status={enquiry.status} />
        </div>

        <div className="mt-3">
          <CollapsibleEnquiryDetails
            editHref={`/admin/enquiries/${enquiry.id}`}
            footnote={`Replies are emailed to ${enquiry.email}. Their answer appears here straight away.`}
            fields={[
              { label: "Name", value: enquiry.fullName },
              { label: "Company", value: enquiry.company || "Not given" },
              { label: "Email", value: enquiry.email, href: `mailto:${enquiry.email}` },
              { label: "Phone", value: enquiry.phone, href: call || undefined },
              { label: "Service", value: enquiry.service },
              { label: "Suburb", value: enquiry.location },
              { label: "Frequency", value: enquiry.frequency || "Not set" },
              { label: "Received", value: formatDateTime(enquiry.receivedAt) },
            ]}
          />
        </div>

        {!mailConfigured() ? (
          <p className="mt-3 rounded-[6px] border border-line bg-white px-3 py-3 text-sm text-navy">
            Email is not set up on this server yet. The chat still works, and you can send the email
            again later.
          </p>
        ) : null}

        <div className="mt-3">
          <CopyLink url={chatUrl} compact />
        </div>
      </div>

      <div className="mt-3 flex min-h-0 flex-1 flex-col">
        <LiveChat
          fill
          viewer="staff"
          peerName={enquiry.fullName}
          opening={{
            label: enquiry.fullName,
            text: enquiry.message,
            at: enquiry.receivedAt,
          }}
          initialMessages={enquiry.messages ?? []}
          pollUrl={`/api/admin/enquiries/${enquiry.id}/chat`}
          postUrl={`/api/admin/enquiries/${enquiry.id}/chat`}
        />
      </div>
    </div>
  );
}
