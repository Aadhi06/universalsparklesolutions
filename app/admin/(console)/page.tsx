import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDateTime } from "@/lib/admin/format";
import { listEnquiries } from "@/lib/store/enquiries";
import { getEventCounts } from "@/lib/store/events";
import { listProjects } from "@/lib/store/projects";

export default async function AdminDashboardPage() {
  const [enquiries, projects, events] = await Promise.all([
    listEnquiries(),
    listProjects(),
    getEventCounts(),
  ]);
  const newEnquiries = enquiries.filter((item) => item.status === "New");
  const published = projects.filter((item) => item.published);
  const recent = enquiries.slice(0, 5);

  const stats = [
    { label: "New enquiries", value: newEnquiries.length, href: "/admin/enquiries?status=New" },
    { label: "All enquiries", value: enquiries.length, href: "/admin/enquiries" },
    { label: "Published work", value: published.length, href: "/admin/projects" },
    { label: "Hidden work", value: projects.length - published.length, href: "/admin/projects" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-[1.7rem] font-semibold text-navy sm:text-[2rem]">
        Dashboard
      </h1>
      <p className="mt-2 max-w-2xl text-body">
        Quote requests, published work and website activity. Enquiries stay on
        this server until a Laravel database is connected.
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
          <ul className="mt-4 divide-y divide-line rounded-[6px] border border-line bg-white">
            {recent.map((enquiry) => (
              <li key={enquiry.id}>
                <Link
                  href={`/admin/enquiries/${enquiry.id}`}
                  className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-navy">{enquiry.fullName}</p>
                    <p className="text-sm text-muted">
                      {enquiry.service} · {enquiry.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
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
      </section>
    </div>
  );
}
