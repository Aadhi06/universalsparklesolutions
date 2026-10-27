import Link from "next/link";
import { notFound } from "next/navigation";
import { updateEnquiryAction } from "@/app/admin/actions";
import { EnquiryForm } from "@/components/admin/EnquiryForm";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { formatDateTime, formatFileSize, telHref } from "@/lib/admin/format";
import { getEnquiry } from "@/lib/store/enquiries";

export default async function EnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const enquiry = await getEnquiry(id);
  if (!enquiry) notFound();

  const call = telHref(enquiry.phone);

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/enquiries" className="inline-flex min-h-11 items-center font-semibold text-blue">
        Back to enquiries
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-[1.7rem] font-semibold text-navy sm:text-[2rem]">
              {enquiry.fullName}
            </h1>
            <StatusBadge status={enquiry.status} />
          </div>
          <p className="mt-2 text-muted">
            {enquiry.service} · {enquiry.location}
          </p>
          <p className="mt-1 text-sm text-muted">Received {formatDateTime(enquiry.receivedAt)}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <ButtonLink href={`/admin/enquiries/${enquiry.id}/chat`} className="w-full sm:w-auto">
            Chat
          </ButtonLink>
          <ButtonLink
            href={`/admin/appointments/new?enquiry=${enquiry.id}`}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            Book appointment
          </ButtonLink>
        </div>
      </div>

      <section className="mt-6 rounded-[6px] border border-line bg-white p-5 sm:p-6">
        <h2 className="font-display text-xl font-semibold text-navy">Enquiry details</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <Detail label="Name" value={enquiry.fullName} />
          <Detail label="Company" value={enquiry.company || "Not given"} />
          <Detail label="Email" value={enquiry.email} href={`mailto:${enquiry.email}`} />
          <Detail label="Phone" value={enquiry.phone} href={call || undefined} />
          <Detail label="Service" value={enquiry.service} />
          <Detail label="Suburb" value={enquiry.location} />
          <Detail label="Frequency" value={enquiry.frequency || "Not set"} />
          <Detail label="Status" value={enquiry.status} />
          <Detail label="Received" value={formatDateTime(enquiry.receivedAt)} />
        </dl>

        <div className="mt-5 border-t border-line pt-5">
          <h3 className="text-sm font-semibold tracking-[0.12em] text-muted uppercase">
            Message
          </h3>
          <p className="mt-2 whitespace-pre-wrap text-navy">{enquiry.message}</p>
        </div>

        {enquiry.attachments.length > 0 ? (
          <div className="mt-5 border-t border-line pt-5">
            <h3 className="text-sm font-semibold tracking-[0.12em] text-muted uppercase">
              Photos
            </h3>
            <p className="mt-2 text-sm text-body">
              {enquiry.attachments
                .map((file) => `${file.name} (${formatFileSize(file.size)})`)
                .join(", ")}
            </p>
          </div>
        ) : null}

        <div className="mt-5 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row">
          <ButtonLink href={`/admin/enquiries/${enquiry.id}/chat`} className="w-full sm:w-auto">
            Open chat
          </ButtonLink>
          {call ? (
            <a
              href={call}
              className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-[6px] border border-navy/15 bg-white px-5 text-[0.95rem] font-semibold text-navy sm:w-auto"
            >
              Call {enquiry.phone}
            </a>
          ) : null}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold text-navy">Edit enquiry</h2>
        <p className="mt-2 text-sm text-body">Update contact details, status or delete this record.</p>
        <div className="mt-4">
          <EnquiryForm enquiry={enquiry} />
        </div>
      </section>

      <form
        action={updateEnquiryAction}
        className="mt-6 rounded-[6px] border border-line bg-white p-5 sm:p-6"
      >
        <input type="hidden" name="id" value={enquiry.id} />
        <input type="hidden" name="status" value={enquiry.status} />
        <label htmlFor="note" className="mb-1.5 block text-sm font-medium text-navy">
          Add a note
        </label>
        <textarea
          id="note"
          name="note"
          rows={4}
          className="w-full rounded-[6px] border border-line px-3 py-3 text-base text-navy outline-none focus:border-blue"
        />
        <Button type="submit" className="mt-4 w-full sm:w-auto">
          Save note
        </Button>
      </form>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold text-navy">Notes</h2>
        {(enquiry.notes ?? []).length === 0 ? (
          <p className="mt-3 text-body">No staff notes yet.</p>
        ) : (
          <ol className="mt-4 space-y-4">
            {(enquiry.notes ?? []).map((note) => (
              <li key={note.id} className="rounded-[6px] border border-line bg-white p-4">
                <p className="text-sm text-muted">{formatDateTime(note.at)}</p>
                <p className="mt-2 whitespace-pre-wrap text-navy">{note.text}</p>
              </li>
            ))}
          </ol>
        )}
      </section>
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
      <dt className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">{label}</dt>
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
