"use client";

import { useState } from "react";

export function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="rounded-[6px] border border-line bg-white p-3">
      <p className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">
        Customer chat link
      </p>
      <p className="mt-1 break-all text-sm text-navy">{url}</p>
      <button
        type="button"
        className="mt-2 inline-flex min-h-11 cursor-pointer items-center font-semibold text-blue"
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setCopied(true);
        }}
      >
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
