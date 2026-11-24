"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, Send, X } from "lucide-react";
import { ChatTranscript } from "@/components/chat/ChatTranscript";
import {
  CHAT_IMAGE_MAX_BYTES,
  CHAT_IMAGE_MAX_COUNT,
  chatImageContentType,
  mediaBaseFromPollUrl,
  validateChatImageFiles,
} from "@/lib/chat/imageLimits";
import type { PublicEnquiryMessage } from "@/lib/chat/messages";
import { cn } from "@/lib/cn";

type PendingImage = {
  id: string;
  file: File;
  previewUrl: string;
};

export function LiveChat({
  viewer,
  peerName,
  opening,
  initialMessages,
  pollUrl,
  postUrl,
  fill = false,
}: {
  viewer: "staff" | "customer";
  peerName: string;
  opening: { label: string; text: string; at: string };
  initialMessages: PublicEnquiryMessage[];
  pollUrl: string;
  postUrl: string;
  fill?: boolean;
}) {
  const [messages, setMessages] = useState(() =>
    withMediaUrls(initialMessages, mediaBaseFromPollUrl(pollUrl)),
  );
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState<PendingImage[]>([]);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingSent = useRef(0);
  const attachId = useId();

  useEffect(() => {
    return () => {
      pending.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
    // Only revoke leftover previews on unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (fill) {
      endRef.current?.scrollIntoView({ block: "end" });
      return;
    }
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length, typing, fill, pending.length]);

  useEffect(() => {
    let stopped = false;
    let timer = 0;
    const mediaBase = mediaBaseFromPollUrl(pollUrl);

    async function poll() {
      if (document.visibilityState === "visible") {
        try {
          const response = await fetch(pollUrl, { cache: "no-store" });
          if (response.ok) {
            const data = (await response.json()) as {
              messages: PublicEnquiryMessage[];
              typing: boolean;
            };
            if (!stopped) {
              setMessages((current) =>
                mergeMessages(current, withMediaUrls(data.messages, mediaBase)),
              );
              setTyping(data.typing);
            }
          }
        } catch {
          // The next poll will try again.
        }
      }
      if (!stopped) timer = window.setTimeout(poll, 2000);
    }

    timer = window.setTimeout(poll, 2000);
    return () => {
      stopped = true;
      window.clearTimeout(timer);
    };
  }, [pollUrl]);

  async function pingTyping(value: string) {
    if (!value.trim()) return;
    const now = Date.now();
    if (now - typingSent.current < 2000) return;
    typingSent.current = now;
    await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ typing: true }),
    }).catch(() => undefined);
  }

  function onPickFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    const incoming = Array.from(fileList);
    const combined = [...pending.map((item) => item.file), ...incoming];
    const validation = validateChatImageFiles(combined);
    if (validation) {
      setError(validation);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    for (const file of incoming) {
      if (!chatImageContentType(file) || file.size > CHAT_IMAGE_MAX_BYTES) {
        setError("Photos must be JPEG, PNG, WebP, GIF or HEIC and 6 MB or smaller.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }
    setError("");
    setPending((current) => [
      ...current,
      ...incoming.map((file) => ({
        id: `pending-${crypto.randomUUID()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removePending(id: string) {
    setPending((current) => {
      const target = current.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return current.filter((item) => item.id !== id);
    });
  }

  async function send(event?: React.FormEvent) {
    event?.preventDefault();
    const text = draft.trim();
    const files = pending.map((item) => item.file);
    if ((!text && files.length === 0) || sending) return;
    setSending(true);
    setError("");
    setDraft("");
    const selected = pending;
    setPending([]);
    const localId = `local-${Date.now()}`;
    const optimistic: PublicEnquiryMessage = {
      id: localId,
      at: new Date().toISOString(),
      from: viewer,
      text,
      images: selected.map((item) => ({
        id: item.id,
        contentType: item.file.type || "image/jpeg",
        size: item.file.size,
        name: item.file.name,
        url: item.previewUrl,
      })),
    };
    setMessages((current) => [...current, optimistic]);

    try {
      let response: Response;
      if (files.length > 0) {
        const body = new FormData();
        body.set("text", text);
        for (const file of files) body.append("images", file, file.name);
        response = await fetch(postUrl, { method: "POST", body });
      } else {
        response = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
      }
      const data = (await response.json().catch(() => ({}))) as {
        message?: PublicEnquiryMessage | string;
      };
      const saved =
        data.message && typeof data.message === "object" ? data.message : undefined;
      if (!response.ok || !saved) {
        throw new Error(
          typeof data.message === "string"
            ? data.message
            : "The message was not sent. Please try again.",
        );
      }
      selected.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      setMessages((current) =>
        current.map((item) =>
          item.id === localId
            ? withMediaUrls([saved], mediaBaseFromPollUrl(pollUrl))[0]
            : item,
        ),
      );
    } catch (sendError) {
      setMessages((current) => current.filter((item) => item.id !== localId));
      setDraft(text);
      setPending(selected);
      setError(sendError instanceof Error ? sendError.message : "The message was not sent.");
    } finally {
      setSending(false);
    }
  }

  async function resend(messageId: string) {
    const response = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId }),
    });
    const data = (await response.json().catch(() => ({}))) as {
      message?: PublicEnquiryMessage;
    };
    if (response.ok && data.message) {
      setMessages((current) =>
        current.map((item) =>
          item.id === messageId
            ? {
                ...item,
                ...withMediaUrls([data.message!], mediaBaseFromPollUrl(pollUrl))[0],
              }
            : item,
        ),
      );
    }
  }

  const mailWarnings =
    viewer === "staff"
      ? messages.filter(
          (message) =>
            message.from === "staff" && message.emailStatus && message.emailStatus !== "sent",
        )
      : [];
  const canSend = Boolean(draft.trim() || pending.length) && !sending;

  return (
    <div className={cn(fill && "flex min-h-0 flex-1 flex-col")}>
      <div
        ref={scrollerRef}
        className={cn(
          fill
            ? "min-h-0 flex-1 overflow-y-auto rounded-[6px] border border-line bg-[#eef5fb] px-3 py-4"
            : undefined,
        )}
        aria-live="polite"
      >
        <ChatTranscript viewer={viewer} opening={opening} messages={messages} />
        {typing ? (
          <p className="mt-3 text-sm font-medium text-muted">{peerName} is typing…</p>
        ) : null}
        {mailWarnings.map((message) => (
          <p key={`${message.id}-mail`} className="mt-3 text-sm text-navy">
            {message.emailStatus === "failed"
              ? "This message was not emailed."
              : "This message is saved. Email is not set up yet."}{" "}
            <button
              type="button"
              className="min-h-11 cursor-pointer font-semibold text-blue"
              onClick={() => resend(message.id)}
            >
              Send email again
            </button>
          </p>
        ))}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={send}
        className={cn(
          fill
            ? "mt-3 shrink-0 rounded-[6px] border border-line bg-white p-2"
            : viewer === "staff"
              ? "sticky bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-20 mt-4 rounded-[6px] border border-line bg-white p-3 lg:bottom-0"
              : "sticky bottom-0 border-t border-line bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        )}
      >
        {pending.length > 0 ? (
          <ul
            className={cn(
              "mb-2 flex gap-2 overflow-x-auto pb-1",
              viewer === "customer" && !fill && "mx-auto w-full max-w-3xl",
            )}
          >
            {pending.map((item) => (
              <li key={item.id} className="relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.previewUrl}
                  alt={item.file.name || "Selected photo"}
                  className="size-16 rounded-[4px] object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePending(item.id)}
                  className="absolute -right-1.5 -top-1.5 inline-flex size-6 cursor-pointer items-center justify-center rounded-full bg-navy text-white"
                  aria-label={`Remove ${item.file.name || "photo"}`}
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <div
          className={cn(
            "flex items-end gap-2",
            viewer === "customer" && !fill && "mx-auto w-full max-w-3xl",
          )}
        >
          <input
            ref={fileInputRef}
            id={attachId}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            disabled={sending}
            onChange={(event) => onPickFiles(event.target.files)}
          />
          <label
            htmlFor={attachId}
            className={cn(
              "inline-flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-navy",
              sending && "pointer-events-none opacity-60",
            )}
            aria-label={`Attach photos, up to ${CHAT_IMAGE_MAX_COUNT}`}
            title={`Attach photos (up to ${CHAT_IMAGE_MAX_COUNT})`}
          >
            <ImagePlus className="size-5" aria-hidden />
          </label>
          <label htmlFor="chat-text" className="sr-only">
            Message
          </label>
          <textarea
            id="chat-text"
            value={draft}
            rows={fill ? 1 : 3}
            maxLength={2000}
            placeholder={sending ? "Uploading…" : "Write a reply"}
            disabled={sending}
            onChange={(event) => {
              setDraft(event.target.value);
              void pingTyping(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void send();
              }
            }}
            className={cn(
              "min-h-12 w-full resize-none rounded-[6px] border border-line px-3 py-3 text-base text-navy outline-none focus:border-blue disabled:opacity-70",
              fill && "max-h-32",
            )}
          />
          <button
            type="submit"
            disabled={!canSend}
            className="inline-flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-blue text-white disabled:opacity-60"
            aria-label={sending ? "Uploading" : "Send"}
          >
            <Send className="size-5" aria-hidden />
          </button>
        </div>
        {error ? <p className="mt-2 px-1 text-sm text-navy">{error}</p> : null}
        {sending ? (
          <p className="mt-2 px-1 text-sm text-muted" aria-live="polite">
            Uploading…
          </p>
        ) : null}
      </form>
    </div>
  );
}

function withMediaUrls(
  messages: PublicEnquiryMessage[],
  mediaBase: string,
): PublicEnquiryMessage[] {
  return messages.map((message) => ({
    ...message,
    images: message.images?.map((image) => ({
      ...image,
      url:
        image.url ||
        `${mediaBase.replace(/\/$/, "")}/${message.id}/${image.id}`,
    })),
  }));
}

function mergeMessages(
  current: PublicEnquiryMessage[],
  incoming: PublicEnquiryMessage[],
) {
  const pending = current.filter(
    (item) =>
      item.id.startsWith("local-") &&
      !incoming.some(
        (saved) =>
          saved.from === item.from &&
          saved.text === item.text &&
          (saved.images?.length ?? 0) === (item.images?.length ?? 0),
      ),
  );
  return [...incoming, ...pending];
}
