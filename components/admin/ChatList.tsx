"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatChatTime } from "@/lib/admin/format";

export type ChatListItem = {
  id: string;
  name: string;
  phone: string;
  preview: string;
  at: string;
  fromStaff: boolean;
  waiting: boolean;
};

export function ChatList({ items }: { items: ChatListItem[] }) {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) =>
      `${item.name} ${item.phone} ${item.preview}`.toLowerCase().includes(needle),
    );
  }, [items, query]);

  return (
    <div>
      <label className="sr-only" htmlFor="chat-search">
        Search chats
      </label>
      <input
        id="chat-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search name or number"
        className="min-h-12 w-full rounded-full border border-line bg-white px-4 text-base text-navy outline-none focus:border-blue"
      />
      {visible.length === 0 ? (
        <p className="mt-6 rounded-[6px] bg-white px-5 py-10 text-center text-body">
          {items.length === 0
            ? "No chats yet. A new enquiry will show up here."
            : "No chats match that search."}
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-[6px] border border-line bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line bg-surface text-xs font-semibold tracking-[0.08em] text-muted uppercase">
              <tr>
                <th className="w-12 px-3 py-3">#</th>
                <th className="px-3 py-3">Chat</th>
                <th className="px-3 py-3">Phone</th>
                <th className="px-3 py-3">When</th>
              </tr>
            </thead>
            <tbody>
          {visible.map((item, index) => (
            <tr key={item.id} className="border-b border-line last:border-b-0">
              <td className="px-3 py-3 font-semibold text-navy tabular-nums">
                {index + 1}
              </td>
              <td className="px-3 py-3">
              <Link
                href={`/admin/enquiries/${item.id}/chat`}
                className="flex min-h-12 items-center gap-3"
              >
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white"
                  aria-hidden
                >
                  {initials(item.name)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-navy ${item.waiting ? "font-semibold" : "font-medium"}`}>
                    {item.name}
                  </span>
                  <span className="mt-0.5 flex items-center gap-2">
                    <span className={`truncate text-sm ${item.waiting ? "font-medium text-navy" : "text-muted"}`}>
                      {item.fromStaff ? "You: " : ""}
                      {item.preview}
                    </span>
                    {item.waiting ? (
                      <span className="size-2.5 shrink-0 rounded-full bg-blue" aria-label="Waiting for a reply" />
                    ) : null}
                  </span>
                </span>
              </Link>
              </td>
              <td className="px-3 py-3 font-semibold text-blue tabular-nums">{item.phone}</td>
              <td className="px-3 py-3 whitespace-nowrap text-muted">{formatChatTime(item.at)}</td>
            </tr>
          ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function initials(name: string) {
  const letters = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return letters || "?";
}
