import { formatDateTime } from "@/lib/admin/format";
import type { PublicEnquiryMessage } from "@/lib/chat/messages";
import { cn } from "@/lib/cn";

type TranscriptMessage = PublicEnquiryMessage & {
  label?: string;
};

export function ChatTranscript({
  opening,
  messages,
  viewer,
}: {
  opening: { label: string; text: string; at: string };
  messages: PublicEnquiryMessage[];
  viewer: "staff" | "customer";
}) {
  const items: TranscriptMessage[] = [
    {
      id: "opening",
      from: "customer",
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
        const images = message.images?.filter((image) => image.url) ?? [];
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
              {images.length > 0 ? (
                <div
                  className={cn(
                    "mt-2 grid gap-1.5",
                    images.length === 1 ? "grid-cols-1" : "grid-cols-2",
                  )}
                >
                  {images.map((image, index) => (
                    <a
                      key={image.id}
                      href={image.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block overflow-hidden rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.url}
                        alt={image.name || `Photo ${index + 1}`}
                        className="max-h-56 w-full object-cover"
                        loading="lazy"
                      />
                    </a>
                  ))}
                </div>
              ) : null}
              {message.text ? (
                <p className="mt-1 whitespace-pre-wrap text-base leading-6">{message.text}</p>
              ) : null}
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
