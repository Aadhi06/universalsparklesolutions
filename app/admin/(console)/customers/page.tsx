import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { telHref } from "@/lib/admin/format";
import { listCustomers } from "@/lib/store/customers";

export default async function CustomersPage() {
  const customers = await listCustomers();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[1.7rem] font-semibold text-navy">Customers</h1>
          <p className="mt-2 text-body">
            Add a customer, open one to edit it, or start an enquiry from their details.
          </p>
        </div>
        <ButtonLink href="/admin/customers/new" className="w-full sm:w-auto">
          Add customer
        </ButtonLink>
      </div>

      {customers.length === 0 ? (
        <p className="mt-6 rounded-[6px] border border-line bg-white px-5 py-8 text-body">
          No customers yet. Add one, or save an enquiry and it will appear here.
        </p>
      ) : (
        <>
          <ol className="mt-6 space-y-3 md:hidden">
            {customers.map((customer, index) => (
              <li key={customer.id} className="rounded-[6px] border border-line bg-white p-4">
                <div className="flex items-start gap-3">
                  <span className="w-6 shrink-0 pt-0.5 font-semibold text-navy tabular-nums">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link href={`/admin/customers/${customer.id}`} className="font-semibold text-navy">
                      {customer.fullName}
                    </Link>
                    {customer.company ? <p className="text-sm text-muted">{customer.company}</p> : null}
                    {customer.phone ? (
                      <a href={telHref(customer.phone)} className="mt-1 block font-semibold text-blue tabular-nums">
                        {customer.phone}
                      </a>
                    ) : null}
                    {customer.email ? (
                      <a href={`mailto:${customer.email}`} className="block break-all text-sm text-blue">
                        {customer.email}
                      </a>
                    ) : null}
                    <p className="mt-1 text-sm text-muted">
                      {[customer.services.join(", "), customer.locations.join(", ")]
                        .filter(Boolean)
                        .join(" · ") || "No service yet"}
                      {" · "}
                      {customer.enquiryCount} {customer.enquiryCount === 1 ? "enquiry" : "enquiries"}
                    </p>
                    {!customer.marketing ? (
                      <p className="mt-1 text-xs font-semibold text-navy">Unsubscribed</p>
                    ) : null}
                    <div className="mt-3 flex flex-col gap-2">
                      <ButtonLink href={`/admin/customers/${customer.id}`} variant="secondary" className="w-full">
                        Edit
                      </ButtonLink>
                      <ButtonLink
                        href={`/admin/enquiries/new?customer=${customer.id}`}
                        className="w-full"
                      >
                        Create enquiry
                      </ButtonLink>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-6 hidden overflow-x-auto rounded-[6px] border border-line bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-surface text-xs font-semibold tracking-[0.08em] text-muted uppercase">
                <tr>
                  <th className="w-12 px-3 py-3">#</th>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Phone</th>
                  <th className="px-3 py-3">Email</th>
                  <th className="px-3 py-3">Service</th>
                  <th className="px-3 py-3">Suburb</th>
                  <th className="px-3 py-3">Enquiries</th>
                  <th className="px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr key={customer.id} className="border-b border-line last:border-b-0">
                    <td className="px-3 py-3 font-semibold text-navy tabular-nums">{index + 1}</td>
                    <td className="px-3 py-3">
                      <Link href={`/admin/customers/${customer.id}`} className="font-semibold text-navy">
                        {customer.fullName}
                      </Link>
                      {customer.company ? <p className="text-muted">{customer.company}</p> : null}
                      {!customer.marketing ? (
                        <p className="text-xs font-semibold text-navy">Unsubscribed</p>
                      ) : null}
                    </td>
                    <td className="px-3 py-3 font-semibold text-blue tabular-nums">
                      {customer.phone ? <a href={telHref(customer.phone)}>{customer.phone}</a> : "—"}
                    </td>
                    <td className="px-3 py-3 break-all text-blue">
                      {customer.email ? <a href={`mailto:${customer.email}`}>{customer.email}</a> : "—"}
                    </td>
                    <td className="px-3 py-3 text-muted">{customer.services.join(", ") || "—"}</td>
                    <td className="px-3 py-3 text-muted">{customer.locations.join(", ") || "—"}</td>
                    <td className="px-3 py-3 font-semibold text-navy tabular-nums">{customer.enquiryCount}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col gap-1">
                        <Link href={`/admin/customers/${customer.id}`} className="font-semibold text-blue">
                          Edit
                        </Link>
                        <Link
                          href={`/admin/enquiries/new?customer=${customer.id}`}
                          className="font-semibold text-navy"
                        >
                          Create enquiry
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
