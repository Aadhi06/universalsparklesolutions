"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type EnquiryDetailField = {
  label: string;
  value: string;
  href?: string;
};

export function CollapsibleEnquiryDetails({
  fields,
  footnote,
  editHref,
}: {
  fields: EnquiryDetailField[];
  footnote?: string;
  editHref: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-[6px] border border-line bg-white">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 px-4 text-left"
      >
        <span className="text-sm font-semibold tracking-[0.12em] text-muted uppercase">
          Enquiry details
        </span>
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-navy transition-transform",
            open ? "rotate-180" : "rotate-0",
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="border-t border-line px-4 pb-4">
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.label}>
                <dt className="text-xs font-semibold tracking-[0.08em] text-muted uppercase">
                  {field.label}
                </dt>
                <dd className="mt-1 text-navy">
                  {field.href ? (
                    <a href={field.href} className="font-semibold text-blue">
                      {field.value}
                    </a>
                  ) : (
                    field.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
          {footnote ? <p className="mt-4 text-sm text-body">{footnote}</p> : null}
          <div className="mt-3">
            <Link href={editHref} className="font-semibold text-blue">
              Edit enquiry
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}
