import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LiveChat } from "@/components/chat/LiveChat";
import { site } from "@/lib/site";
import { getEnquiryByReplyToken } from "@/lib/store/enquiries";

export const metadata: Metadata = {
  title: "Your enquiry chat",
  robots: { index: false, follow: false },
};

export default async function CustomerChatPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const enquiry = await getEnquiryByReplyToken(token);
  if (!enquiry?.replyToken) notFound();

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <header className="sticky top-0 z-10 border-b border-line bg-navy px-4 py-4 text-white">
        <p className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">
          {site.shortName}
        </p>
        <h1 className="font-display mt-1 text-2xl font-semibold">{enquiry.fullName}</h1>
        <p className="mt-1 text-sm text-white/80">
          {enquiry.service} · {enquiry.location}
        </p>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-4">
        <section className="mb-4 rounded-[6px] border border-line bg-white p-4">
          <h2 className="text-sm font-semibold tracking-[0.12em] text-muted uppercase">
            Your enquiry
          </h2>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            <Detail label="Service" value={enquiry.service} />
            <Detail label="Suburb" value={enquiry.location} />
            <Detail label="Frequency" value={enquiry.frequency || "Not set"} />
            <Detail label="Phone" value={enquiry.phone} />
            <Detail label="Email" value={enquiry.email} />
            {enquiry.company ? <Detail label="Company" value={enquiry.company} /> : null}
          </dl>
        </section>
        <LiveChat
          viewer="customer"
          peerName={site.shortName}
          opening={{
            label: enquiry.fullName,
            text: enquiry.message,
            at: enquiry.receivedAt,
          }}
          initialMessages={enquiry.messages ?? []}
          pollUrl={`/api/chat/${enquiry.replyToken}`}
          postUrl={`/api/chat/${enquiry.replyToken}`}
        />
      </main>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold tracking-[0.08em] text-muted uppercase">{label}</dt>
      <dd className="mt-1 text-navy">{value}</dd>
    </div>
  );
}
