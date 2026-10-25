import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDateTime, formatVisit } from "@/lib/admin/format";
import { listAppointments, melbourneToday } from "@/lib/store/appointments";
import { listEnquiries } from "@/lib/store/enquiries";
import { getEventCounts } from "@/lib/store/events";
import { listProjects } from "@/lib/store/projects";

export default async function AdminDashboardPage() {
  const [enquiries, projects, events, appointments] = await Promise.all([
    listEnquiries(),
    listProjects(),
    getEventCounts(),
    listAppointments(),
  ]);
  const today = melbourneToday();
  const newEnquiries = enquiries.filter((item) => item.status === "New");
  const upcoming = appointments.filter(
    (item) =>
      item.date >= today && item.status !== "Completed" && item.status !== "Cancelled",
  );
  const published = projects.filter((item) => item.published);
  const recent = enquiries.slice(0, 5);

  const stats = [
    { label: "New enquiries", value: newEnquiries.length, href: "/admin/enquiries?status=New" },
    { label: "Upcoming visits", value: upcoming.length, href: "/admin/appointments" },
    { label: "All enquiries", value: enquiries.length, href: "/admin/enquiries" },
    { label: "Published work", value: published.length, href: "/admin/projects" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-[1.7rem] font-semibold text-navy sm:text-[2rem]">
        Dashboard
      </h1>
      <p className="mt-2 max-w-2xl text-body">
        Enquiries, appointments and published work for the Universal Sparkle
        Solution team.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-[6px] border border-line bg-white p-5 shadow-soft transition-colors hover:border-blue"
          >
            <p className="text-sm font-medium text-muted">{stat.label}</p>
            <p className="font-display mt-2 text-3xl font-semibold text-navy">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[6px] border border-line bg-white p-5">
          <p className="text-sm font-medium text-muted">Quote submissions</p>
          <p className="font-display mt-2 text-2xl font-semibold text-navy">
            {events.quote_submitted}
          </p>
        </div>
        <div className="rounded-[6px] border border-line bg-white p-5">
          <p className="text-sm font-medium text-muted">Phone clicks</p>
          <p className="font-display mt-2 text-2xl font-semibold text-navy">
            {events.phone_click}
          </p>
        </div>
        <div className="rounded-[6px] border border-line bg-white p-5">
          <p className="text-sm font-medium text-muted">WhatsApp clicks</p>
          <p className="font-display mt-2 text-2xl font-semibold text-navy">
            {events.whatsapp_click}
          </p>
        </div>
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-semibold text-navy">
            Next appointments
          </h2>
          <Link href="/admin/appointments" className="min-h-11 font-semibold text-blue">
            View all
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="mt-4 rounded-[6px] border border-line bg-white px-5 py-8 text-body">
            No upcoming visits. Add one from Appointments.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-[6px] border border-line bg-white">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-line bg-surface text-xs font-semibold tracking-[0.08em] text-muted uppercase">
                <tr>
                  <th className="w-12 px-3 py-3">#</th>
                  <th className="px-3 py-3">Customer</th>
                  <th className="px-3 py-3">Visit</th>
                  <th className="px-3 py-3">Service</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.slice(0, 4).map((visit, index) => (
                  <tr key={visit.id} className="border-b border-line last:border-b-0">
                    <td className="px-3 py-3 font-semibold text-navy tabular-nums">{index + 1}</td>
                    <td className="px-3 py-3">
                      <Link href={`/admin/appointments/${visit.id}`} className="font-semibold text-navy">
                        {visit.customerName}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-muted">{formatVisit(visit.date, visit.time)}</td>
                    <td className="px-3 py-3 text-muted">{visit.service}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-semibold text-navy">
            Recent enquiries
          </h2>
          <Link href="/admin/enquiries" className="min-h-11 font-semibold text-blue">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="mt-4 rounded-[6px] border border-line bg-white px-5 py-8 text-body">
            No quote requests yet. New submissions from the website will appear
            here.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-[6px] border border-line bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-line bg-surface text-xs font-semibold tracking-[0.08em] text-muted uppercase">
                <tr>
                  <th className="w-12 px-3 py-3">#</th>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Details</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">When</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((enquiry, index) => (
                  <tr key={enquiry.id} className="border-b border-line last:border-b-0">
                    <td className="px-3 py-3 font-semibold text-navy tabular-nums">{index + 1}</td>
                    <td className="px-3 py-3">
                      <Link href={`/admin/enquiries/${enquiry.id}`} className="font-semibold text-navy">
                        {enquiry.fullName}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-muted">
                      {enquiry.service} · {enquiry.location}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={enquiry.status} />
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-muted">
                      {formatDateTime(enquiry.receivedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
