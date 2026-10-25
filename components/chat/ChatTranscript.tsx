import { formatDateTime } from "@/lib/admin/format";
import type { EnquiryMessage } from "@/lib/store/enquiries";
import { cn } from "@/lib/cn";

export function ChatTranscript({
  opening,
  messages,
  viewer,
}: {
  opening: { label: string; text: string; at: string };
  messages: EnquiryMessage[];
  viewer: "staff" | "customer";
}) {
  const items = [
    {
      id: "opening",
      from: "customer" as const,
      label: opening.label,
      text: opening.text,
      at: opening.at,
      emailStatus: undefined,
    },
    ...messages.map((message) => ({
      ...message,
      label: message.from === "customer" ? opening.label : "Universal Sparkle Solution",
    })),
  ];

  return (
    <ol className="space-y-3">
      {items.map((message) => {
        const mine = message.from === viewer;
        return (
          <li key={message.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-[6px] px-3 py-2",
                mine ? "bg-blue text-white" : "border border-line bg-white text-navy",
              )}
            >
              <p className={cn("text-xs font-semibold", mine ? "text-white/80" : "text-muted")}>
                {mine ? "You" : message.label}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-base leading-6">{message.text}</p>
              <p className={cn("mt-1 text-xs", mine ? "text-white/75" : "text-muted")}>
                {formatDateTime(message.at)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
