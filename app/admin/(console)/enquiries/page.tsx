import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDateTime } from "@/lib/admin/format";
import { enquiryStatuses, listEnquiries } from "@/lib/store/enquiries";
import { cn } from "@/lib/cn";

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const enquiries = await listEnquiries();
  const filtered = status
    ? enquiries.filter((item) => item.status === status)
    : enquiries;

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-[1.7rem] font-semibold text-navy sm:text-[2rem]">
        Enquiries
      </h1>
      <p className="mt-2 text-body">
        Quote requests from the website. Open a record to update its status or
        add a note.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterLink href="/admin/enquiries" active={!status} label="All" count={enquiries.length} />
        {enquiryStatuses.map((item) => (
          <FilterLink
            key={item}
            href={`/admin/enquiries?status=${item}`}
            active={status === item}
            label={item}
            count={enquiries.filter((enquiry) => enquiry.status === item).length}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-[6px] border border-line bg-white px-5 py-10 text-body">
          No enquiries in this view.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-line overflow-hidden rounded-[6px] border border-line bg-white">
          {filtered.map((enquiry) => (
            <li key={enquiry.id}>
              <Link
                href={`/admin/enquiries/${enquiry.id}`}
                className="grid gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] sm:items-center"
              >
                <div>
                  <p className="font-semibold text-navy">{enquiry.fullName}</p>
                  <p className="text-sm text-muted">
                    {enquiry.email} · {enquiry.phone}
                  </p>
                </div>
                <div>
                  <p className="text-navy">{enquiry.service}</p>
                  <p className="text-sm text-muted">{enquiry.location}</p>
                </div>
                <div className="flex items-center gap-3 sm:justify-end">
                  <StatusBadge status={enquiry.status} />
                  <span className="text-sm text-muted">
                    {formatDateTime(enquiry.receivedAt)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterLink({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold",
        active ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-line hover:ring-blue",
      )}
    >
      {label} ({count})
    </Link>
  );
}
