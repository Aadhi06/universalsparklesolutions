import Link from "next/link";
import { bulkAppointmentAction } from "@/app/admin/actions";
import { PushOptions } from "@/components/admin/PushOptions";
import { RecordList } from "@/components/admin/RecordList";
import { ButtonLink } from "@/components/ui/Button";
import { formatVisit } from "@/lib/admin/format";
import {
  appointmentStatuses,
  listAppointments,
  melbourneToday,
} from "@/lib/store/appointments";
import { cn } from "@/lib/cn";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const appointments = await listAppointments();
  const today = melbourneToday();
  const filtered = status
    ? appointments.filter((item) => item.status === status)
    : appointments.filter(
        (item) =>
          item.date >= today &&
          item.status !== "Completed" &&
          item.status !== "Cancelled",
      );

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[1.7rem] font-semibold text-navy sm:text-[2rem]">
            Appointments
          </h1>
          <p className="mt-2 text-body">
            Book, change or cancel a cleaning visit. Times are for Melbourne.
          </p>
        </div>
        <ButtonLink href="/admin/appointments/new" className="w-full sm:w-auto">
          New appointment
        </ButtonLink>
      </div>

      <div className="mt-6">
        <PushOptions />
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        <FilterLink
          href="/admin/appointments"
          active={!status}
          label="Upcoming"
          count={
            appointments.filter(
              (item) =>
                item.date >= today &&
                item.status !== "Completed" &&
                item.status !== "Cancelled",
            ).length
          }
        />
        {appointmentStatuses.map((item) => (
          <FilterLink
            key={item}
            href={`/admin/appointments?status=${item}`}
            active={status === item}
            label={item}
            count={appointments.filter((visit) => visit.status === item).length}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-[6px] border border-line bg-white px-5 py-10 text-body">
          No appointments in this view.
        </p>
      ) : (
        <RecordList
          items={filtered.map((visit) => ({
            id: visit.id,
            href: `/admin/appointments/${visit.id}`,
            title: visit.customerName,
            phone: visit.phone,
            detail: `${formatVisit(visit.date, visit.time)} · ${visit.service} · ${visit.location}`,
            when: "",
            status: visit.status,
          }))}
          statuses={appointmentStatuses}
          returnTo={status ? `/admin/appointments?status=${status}` : "/admin/appointments"}
          noun="appointments"
          action={bulkAppointmentAction}
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
        "inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm font-semibold",
        active ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-line",
      )}
    >
      {label} ({count})
    </Link>
  );
}
