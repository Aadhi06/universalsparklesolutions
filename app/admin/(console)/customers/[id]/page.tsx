import Link from "next/link";
import { notFound } from "next/navigation";
import { CustomerForm } from "@/components/admin/CustomerForm";
import { ButtonLink } from "@/components/ui/Button";
import { getCustomer } from "@/lib/store/customers";

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomer(id);
  if (!customer) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/customers" className="inline-flex min-h-11 items-center font-semibold text-blue">
        Back to customers
      </Link>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[1.7rem] font-semibold text-navy">{customer.fullName}</h1>
          <p className="mt-2 text-body">
            {customer.enquiryCount} {customer.enquiryCount === 1 ? "enquiry" : "enquiries"} on file.
          </p>
        </div>
        <ButtonLink href={`/admin/enquiries/new?customer=${customer.id}`} className="w-full sm:w-auto">
          Create enquiry
        </ButtonLink>
      </div>
      {customer.latestEnquiryId ? (
        <p className="mt-3 text-sm">
          <Link href={`/admin/enquiries/${customer.latestEnquiryId}`} className="font-semibold text-blue">
            Open latest enquiry
          </Link>
        </p>
      ) : null}
      <div className="mt-6">
        <CustomerForm customer={customer} />
      </div>
    </div>
  );
}
