import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/guard";
import { enquiryNeedsReply, listEnquiries } from "@/lib/store/enquiries";

export default async function AdminConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  const enquiries = await listEnquiries();
  const waitingChats = enquiries.filter(enquiryNeedsReply).length;

  return (
    <AdminShell username={session.sub} waitingChats={waitingChats}>
      {children}
    </AdminShell>
  );
}
