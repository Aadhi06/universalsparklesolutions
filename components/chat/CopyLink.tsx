"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyLink({
  url,
  compact = false,
}: {
  url: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-[6px] border border-line bg-white px-3 py-2">
        <div className="min-w-0 flex-1">
          <p className="text-[0.68rem] font-semibold tracking-[0.12em] text-muted uppercase">
            Chat link
          </p>
          <p className="truncate text-sm text-navy">{url}</p>
        </div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-[6px] px-2 font-semibold text-blue"
          aria-label={copied ? "Copied" : "Copy chat link"}
        >
          {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[6px] border border-line bg-white p-3">
      <p className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">
        Customer chat link
      </p>
      <p className="mt-1 break-all text-sm text-navy">{url}</p>
      <button
        type="button"
        className="mt-2 inline-flex min-h-11 cursor-pointer items-center font-semibold text-blue"
        onClick={copy}
      >
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
