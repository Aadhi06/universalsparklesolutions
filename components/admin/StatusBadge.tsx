import { cn } from "@/lib/cn";

const styles: Record<string, string> = {
  New: "bg-blue/10 text-blue",
  Contacted: "bg-navy/10 text-navy",
  Quoted: "bg-gold/20 text-navy",
  Closed: "bg-surface text-muted",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center rounded-full px-3 text-[0.8rem] font-semibold",
        styles[status] ?? "bg-surface text-muted",
      )}
    >
      {status}
    </span>
  );
}
