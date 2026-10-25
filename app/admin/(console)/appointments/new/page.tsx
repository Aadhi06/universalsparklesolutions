import Link from "next/link";
import { AppointmentForm } from "@/components/admin/AppointmentForm";
import { getEnquiry } from "@/lib/store/enquiries";

export default async function NewAppointmentPage({
  searchParams,
}: {
  searchParams: Promise<{ enquiry?: string }>;
}) {
  const { enquiry } = await searchParams;
  const record = enquiry ? await getEnquiry(enquiry) : null;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={record ? `/admin/enquiries/${record.id}` : "/admin/appointments"}
        className="inline-flex min-h-11 items-center font-semibold text-blue"
      >
        {record ? "Back to enquiry" : "Back to appointments"}
      </Link>
      <h1 className="font-display mt-4 text-[1.7rem] font-semibold text-navy sm:text-[2rem]">
        New appointment
      </h1>
      <p className="mt-2 text-body">
        {record
          ? `Booking from the enquiry for ${record.fullName}.`
          : "Set the customer, service, date and time. This does not confirm the visit until you mark it confirmed."}
      </p>
      <div className="mt-6">
        <AppointmentForm
          defaults={
            record
              ? {
                  customerName: record.fullName,
                  phone: record.phone,
                  email: record.email,
                  service: record.service,
                  location: record.location,
                  enquiryId: record.id,
                  status: "Scheduled",
                  notes: "",
                  createdAt: "",
                  id: "",
                  date: "",
                  time: "",
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
