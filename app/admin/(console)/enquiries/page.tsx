import Link from "next/link";
import { bulkEnquiryAction } from "@/app/admin/actions";
import { PushOptions } from "@/components/admin/PushOptions";
import { RecordList } from "@/components/admin/RecordList";
import { ButtonLink } from "@/components/ui/Button";
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[1.7rem] font-semibold text-navy sm:text-[2rem]">
            Enquiries
          </h1>
          <p className="mt-2 text-body">
            Add a quote request, or open one to edit, note or delete it.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <ButtonLink href="/admin/customers" variant="secondary" className="w-full sm:w-auto">
            Customers
          </ButtonLink>
          <ButtonLink href="/admin/enquiries/new" className="w-full sm:w-auto">
            New enquiry
          </ButtonLink>
        </div>
      </div>

      <div className="mt-6">
        <PushOptions />
      </div>

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
        <RecordList
          items={filtered.map((enquiry) => ({
            id: enquiry.id,
            href: `/admin/enquiries/${enquiry.id}`,
            title: enquiry.fullName,
            phone: enquiry.phone,
            detail: `${enquiry.service} · ${enquiry.location}`,
            when: formatDateTime(enquiry.receivedAt),
            status: enquiry.status,
          }))}
          statuses={enquiryStatuses}
          returnTo={status ? `/admin/enquiries?status=${status}` : "/admin/enquiries"}
          noun="enquiries"
          action={bulkEnquiryAction}
        />
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
