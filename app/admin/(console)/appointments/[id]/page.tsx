import Link from "next/link";
import { notFound } from "next/navigation";
import { AppointmentForm } from "@/components/admin/AppointmentForm";
import { formatVisit } from "@/lib/admin/format";
import { getAppointment } from "@/lib/store/appointments";

export default async function AppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const appointment = await getAppointment(id);
  if (!appointment) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/appointments"
        className="inline-flex min-h-11 items-center font-semibold text-blue"
      >
        Back to appointments
      </Link>
      <h1 className="font-display mt-4 text-[1.7rem] font-semibold text-navy sm:text-[2rem]">
        {appointment.customerName}
      </h1>
      <p className="mt-2 text-body">{formatVisit(appointment.date, appointment.time)}</p>
      {appointment.enquiryId ? (
        <Link
          href={`/admin/enquiries/${appointment.enquiryId}`}
          className="mt-3 inline-flex min-h-11 items-center font-semibold text-blue"
        >
          Open linked enquiry
        </Link>
      ) : null}
      <div className="mt-6">
        <AppointmentForm appointment={appointment} />
      </div>
    </div>
  );
}
