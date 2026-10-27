"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { ChatTranscript } from "@/components/chat/ChatTranscript";
import type { EnquiryMessage } from "@/lib/store/enquiries";
import { cn } from "@/lib/cn";

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
  initialMessages: EnquiryMessage[];
  pollUrl: string;
  postUrl: string;
  fill?: boolean;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const typingSent = useRef(0);

  useEffect(() => {
    if (fill) {
      endRef.current?.scrollIntoView({ block: "end" });
      return;
    }
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length, typing, fill]);

  useEffect(() => {
    let stopped = false;
    let timer = 0;

    async function poll() {
      if (document.visibilityState === "visible") {
        try {
          const response = await fetch(pollUrl, { cache: "no-store" });
          if (response.ok) {
            const data = (await response.json()) as {
              messages: EnquiryMessage[];
              typing: boolean;
            };
            if (!stopped) {
              setMessages((current) => mergeMessages(current, data.messages));
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

  async function send(event?: React.FormEvent) {
    event?.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    setError("");
    setDraft("");
    const localId = `local-${Date.now()}`;
    const optimistic: EnquiryMessage = {
      id: localId,
      at: new Date().toISOString(),
      from: viewer,
      text,
    };
    setMessages((current) => [...current, optimistic]);

    try {
      const response = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        message?: EnquiryMessage;
      };
      if (!response.ok || !data.message) {
        throw new Error("The message was not sent. Please try again.");
      }
      setMessages((current) =>
        current.map((item) => (item.id === localId ? data.message! : item)),
      );
    } catch (sendError) {
      setMessages((current) => current.filter((item) => item.id !== localId));
      setDraft(text);
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
    const data = (await response.json().catch(() => ({}))) as { message?: EnquiryMessage };
    if (response.ok && data.message) {
      setMessages((current) =>
        current.map((item) => (item.id === messageId ? { ...item, ...data.message } : item)),
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
        <div
          className={cn(
            "flex items-end gap-2",
            viewer === "customer" && !fill && "mx-auto w-full max-w-3xl",
          )}
        >
          <label htmlFor="chat-text" className="sr-only">
            Message
          </label>
          <textarea
            id="chat-text"
            value={draft}
            rows={fill ? 1 : 3}
            maxLength={2000}
            placeholder="Write a reply"
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
              "min-h-12 w-full resize-none rounded-[6px] border border-line px-3 py-3 text-base text-navy outline-none focus:border-blue",
              fill && "max-h-32",
            )}
          />
          <button
            type="submit"
            disabled={sending || !draft.trim()}
            className="inline-flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-blue text-white disabled:opacity-60"
            aria-label={sending ? "Sending" : "Send"}
          >
            <Send className="size-5" aria-hidden />
          </button>
        </div>
        {error ? <p className="mt-2 px-1 text-sm text-navy">{error}</p> : null}
      </form>
    </div>
  );
}

function mergeMessages(current: EnquiryMessage[], incoming: EnquiryMessage[]) {
  const pending = current.filter(
    (item) =>
      item.id.startsWith("local-") &&
      !incoming.some((saved) => saved.from === item.from && saved.text === item.text),
  );
  return [...incoming, ...pending];
}
