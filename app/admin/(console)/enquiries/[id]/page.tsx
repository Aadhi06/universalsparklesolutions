import Link from "next/link";
import { notFound } from "next/navigation";
import { updateEnquiryAction } from "@/app/admin/actions";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/Button";
import { formatDateTime, formatFileSize } from "@/lib/admin/format";
import { enquiryStatuses, getEnquiry } from "@/lib/store/enquiries";

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
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-[1.7rem] font-semibold text-navy sm:text-[2rem]">
            {enquiry.fullName}
          </h1>
          <p className="mt-2 text-muted">{formatDateTime(enquiry.receivedAt)}</p>
        </div>
        <StatusBadge status={enquiry.status} />
      </div>

      <dl className="mt-8 grid gap-5 rounded-[6px] border border-line bg-white p-5 sm:grid-cols-2 sm:p-6">
        <Item label="Email">
          <a className="text-blue" href={`mailto:${enquiry.email}`}>
            {enquiry.email}
          </a>
        </Item>
        <Item label="Phone">
          <a className="text-blue" href={`tel:${enquiry.phone.replace(/\s+/g, "")}`}>
            {enquiry.phone}
          </a>
        </Item>
        <Item label="Company">{enquiry.company || "—"}</Item>
        <Item label="Service">{enquiry.service}</Item>
        <Item label="Suburb or postcode">{enquiry.location}</Item>
        <Item label="Frequency">{enquiry.frequency || "—"}</Item>
        <div className="sm:col-span-2">
          <dt className="text-sm font-medium text-muted">Message</dt>
          <dd className="mt-1 whitespace-pre-wrap text-navy">{enquiry.message}</dd>
        </div>
        {enquiry.attachments.length > 0 ? (
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-muted">Photos mentioned</dt>
            <dd className="mt-1 text-navy">
              {enquiry.attachments
                .map((file) => `${file.name} (${formatFileSize(file.size)})`)
                .join(", ")}
            </dd>
          </div>
        ) : null}
      </dl>

      <form
        action={updateEnquiryAction}
        className="mt-6 rounded-[6px] border border-line bg-white p-5 sm:p-6"
      >
        <input type="hidden" name="id" value={enquiry.id} />
        <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-navy">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={enquiry.status}
          className="min-h-12 w-full rounded-[6px] border border-line bg-white px-3 text-base text-navy outline-none focus:border-blue"
        >
          {enquiryStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <label htmlFor="note" className="mt-5 mb-1.5 block text-sm font-medium text-navy">
          Add a note <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="note"
          name="note"
          rows={4}
          className="w-full rounded-[6px] border border-line px-3 py-3 text-base text-navy outline-none focus:border-blue"
        />
        <Button type="submit" className="mt-5">
          Save enquiry
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

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-sm font-medium text-muted">{label}</dt>
      <dd className="mt-1 text-navy">{children}</dd>
    </div>
  );
}
