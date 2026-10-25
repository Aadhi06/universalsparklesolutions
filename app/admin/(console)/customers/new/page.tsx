import Link from "next/link";
import { CustomerForm } from "@/components/admin/CustomerForm";

export default function NewCustomerPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/customers" className="inline-flex min-h-11 items-center font-semibold text-blue">
        Back to customers
      </Link>
      <h1 className="font-display mt-4 text-[1.7rem] font-semibold text-navy">Add customer</h1>
      <p className="mt-2 text-body">
        Save someone who called or visited. You can create an enquiry for them afterwards.
      </p>
      <div className="mt-6">
        <CustomerForm />
      </div>
    </div>
  );
}
