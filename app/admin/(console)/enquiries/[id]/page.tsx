import Link from "next/link";
import { notFound } from "next/navigation";
import { updateEnquiryAction } from "@/app/admin/actions";
import { EnquiryForm } from "@/components/admin/EnquiryForm";
import { Button, ButtonLink } from "@/components/ui/Button";
import { formatDateTime, formatFileSize } from "@/lib/admin/format";
import { getEnquiry } from "@/lib/store/enquiries";

export default async function EnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const enquiry = await getEnquiry(id);
  if (!enquiry) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/enquiries" className="inline-flex min-h-11 items-center font-semibold text-blue">
        Back to enquiries
      </Link>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[1.7rem] font-semibold text-navy sm:text-[2rem]">
            {enquiry.fullName}
          </h1>
          <p className="mt-2 text-muted">Received {formatDateTime(enquiry.receivedAt)}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <ButtonLink href={`/admin/enquiries/${enquiry.id}/chat`} className="w-full sm:w-auto">
            Message
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

      {enquiry.attachments.length > 0 ? (
        <p className="mt-4 text-sm text-body">
          Photos named on the form:{" "}
          {enquiry.attachments
            .map((file) => `${file.name} (${formatFileSize(file.size)})`)
            .join(", ")}
        </p>
      ) : null}

      <div className="mt-6">
        <EnquiryForm enquiry={enquiry} />
      </div>

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
