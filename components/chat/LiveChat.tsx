"use client";

import { useEffect, useRef, useState } from "react";
import { ChatTranscript } from "@/components/chat/ChatTranscript";
import type { EnquiryMessage } from "@/lib/store/enquiries";

export function LiveChat({
  viewer,
  peerName,
  opening,
  initialMessages,
  pollUrl,
  postUrl,
}: {
  viewer: "staff" | "customer";
  peerName: string;
  opening: { label: string; text: string; at: string };
  initialMessages: EnquiryMessage[];
  pollUrl: string;
  postUrl: string;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const typingSent = useRef(0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length, typing]);

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

  async function send(event: React.FormEvent) {
    event.preventDefault();
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
        messageText?: string;
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

  return (
    <div>
      <div aria-live="polite">
        <ChatTranscript viewer={viewer} opening={opening} messages={messages} />
        {typing ? (
          <p className="mt-3 text-sm font-medium text-muted">{peerName} is typing…</p>
        ) : null}
        <div ref={endRef} />
      </div>

      {viewer === "staff"
        ? messages
            .filter((message) => message.from === "staff" && message.emailStatus && message.emailStatus !== "sent")
            .map((message) => (
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
            ))
        : null}

      <form
        onSubmit={send}
        className={
          viewer === "staff"
            ? "sticky bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-20 mt-4 rounded-[6px] border border-line bg-white p-3 lg:bottom-0"
            : "sticky bottom-0 border-t border-line bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        }
      >
        <div className={viewer === "customer" ? "mx-auto flex w-full max-w-3xl flex-col gap-3" : ""}>
          <label htmlFor="chat-text" className="sr-only">
            Message
          </label>
          <textarea
            id="chat-text"
            value={draft}
            rows={3}
            maxLength={2000}
            placeholder="Write a reply"
            onChange={(event) => {
              setDraft(event.target.value);
              void pingTyping(event.target.value);
            }}
            className="w-full rounded-[6px] border border-line px-3 py-3 text-base text-navy outline-none focus:border-blue"
          />
          {error ? <p className="mt-2 text-sm text-navy">{error}</p> : null}
          <button
            type="submit"
            disabled={sending}
            className="mt-3 inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-[6px] bg-blue px-5 font-semibold text-white disabled:opacity-60 sm:w-auto"
          >
            {sending ? "Sending…" : "Send"}
          </button>
        </div>
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
