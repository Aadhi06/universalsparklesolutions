import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyLink } from "@/components/chat/CopyLink";
import { LiveChat } from "@/components/chat/LiveChat";
import { StatusBadge } from "@/components/admin/StatusBadge";
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
    <div className="mx-auto flex max-w-3xl flex-col">
      <Link href="/admin/chats" className="inline-flex min-h-11 items-center font-semibold text-blue">
        Chats
      </Link>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-[1.7rem] font-semibold text-navy">{enquiry.fullName}</h1>
          <p className="mt-1 text-sm text-muted">
            {enquiry.service} · {enquiry.location}
          </p>
        </div>
        <StatusBadge status={enquiry.status} />
      </div>

      <section className="mt-4 rounded-[6px] border border-line bg-white p-4">
        <h2 className="text-sm font-semibold tracking-[0.12em] text-muted uppercase">
          Enquiry details
        </h2>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          <Detail label="Name" value={enquiry.fullName} />
          <Detail label="Company" value={enquiry.company || "Not given"} />
          <Detail label="Email" value={enquiry.email} href={`mailto:${enquiry.email}`} />
          <Detail label="Phone" value={enquiry.phone} href={call || undefined} />
          <Detail label="Service" value={enquiry.service} />
          <Detail label="Suburb" value={enquiry.location} />
          <Detail label="Frequency" value={enquiry.frequency || "Not set"} />
          <Detail label="Received" value={formatDateTime(enquiry.receivedAt)} />
        </dl>
        <p className="mt-4 text-sm text-body">
          Replies are emailed to {enquiry.email}. Their answer appears here straight away.
        </p>
        <div className="mt-3">
          <Link href={`/admin/enquiries/${enquiry.id}`} className="font-semibold text-blue">
            Edit enquiry
          </Link>
        </div>
      </section>

      {!mailConfigured() ? (
        <p className="mt-3 rounded-[6px] border border-line bg-white px-3 py-3 text-sm text-navy">
          Email is not set up on this server yet. The chat still works, and you can send the email again later.
        </p>
      ) : null}

      <div className="mt-4">
        <CopyLink url={chatUrl} />
      </div>

      <div className="mt-4">
        <LiveChat
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

function Detail({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold tracking-[0.08em] text-muted uppercase">{label}</dt>
      <dd className="mt-1 text-navy">
        {href ? (
          <a href={href} className="font-semibold text-blue">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
