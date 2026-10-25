import Link from "next/link";
import { EnquiryForm } from "@/components/admin/EnquiryForm";
import { getCustomer } from "@/lib/store/customers";

export default async function NewEnquiryPage({
  searchParams,
}: {
  searchParams: Promise<{ customer?: string }>;
}) {
  const { customer: customerId } = await searchParams;
  const customer = customerId ? await getCustomer(customerId) : null;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/enquiries" className="inline-flex min-h-11 items-center font-semibold text-blue">
        Back to enquiries
      </Link>
      <h1 className="font-display mt-4 text-[1.7rem] font-semibold text-navy sm:text-[2rem]">
        New enquiry
      </h1>
      <p className="mt-2 text-body">
        {customer
          ? `Details are filled from ${customer.fullName}. Change anything that is different for this job.`
          : "Use this when a customer calls or messages instead of using the website form."}
      </p>
      <div className="mt-6">
        <EnquiryForm
          defaults={
            customer
              ? {
                  fullName: customer.fullName,
                  company: customer.company,
                  email: customer.email,
                  phone: customer.phone,
                  service: customer.services[0] ?? "",
                  location: customer.locations[0] ?? "",
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
