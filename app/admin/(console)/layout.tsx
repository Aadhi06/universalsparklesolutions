import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/guard";

export default async function AdminConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return <AdminShell username={session.sub}>{children}</AdminShell>;
}
