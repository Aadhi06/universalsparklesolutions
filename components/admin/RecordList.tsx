"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { telHref } from "@/lib/admin/format";

export type AdminRecord = {
  id: string;
  href: string;
  title: string;
  phone: string;
  detail: string;
  when: string;
  status: string;
};

export function RecordList({
  items,
  statuses,
  returnTo,
  noun,
  action,
}: {
  items: AdminRecord[];
  statuses: readonly string[];
  returnTo: string;
  noun: string;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const allRef = useRef<HTMLInputElement>(null);
  const selectedItems = items.filter((item) => selected.includes(item.id));

  useEffect(() => {
    if (!allRef.current) return;
    allRef.current.indeterminate =
      selectedItems.length > 0 && selectedItems.length < items.length;
  }, [items.length, selectedItems.length]);

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function toggleAll() {
    setSelected(selectedItems.length === items.length ? [] : items.map((item) => item.id));
  }

  return (
    <div>
      <label className="mt-6 flex min-h-12 items-center gap-3 text-sm font-semibold text-navy">
        <input
          ref={allRef}
          type="checkbox"
          checked={items.length > 0 && selectedItems.length === items.length}
          onChange={toggleAll}
          className="size-5 accent-blue"
          aria-label={`Select all ${noun}`}
        />
        Select all
      </label>

      <ul className="mt-3 space-y-3 md:hidden">
        {items.map((item, index) => {
          const call = telHref(item.phone);
          return (
            <li key={item.id} className="rounded-[6px] border border-line bg-white p-4">
              <div className="flex items-start gap-3">
                <span className="w-6 shrink-0 pt-1 font-semibold text-navy tabular-nums">{index + 1}</span>
                <label className="pt-0.5">
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onChange={() => toggle(item.id)}
                    className="size-5 accent-blue"
                    aria-label={`Select ${item.title}`}
                  />
                </label>
                <div className="min-w-0 flex-1">
                  <Link href={item.href} className="font-semibold text-navy">
                    {item.title}
                  </Link>
                  <p className="mt-1 text-sm text-muted">{item.detail}</p>
                  {call ? (
                    <a href={call} className="mt-1 block font-semibold text-blue tabular-nums">
                      {item.phone}
                    </a>
                  ) : null}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <StatusBadge status={item.status} />
                    {item.when ? <span className="text-sm text-muted">{item.when}</span> : null}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 hidden overflow-x-auto rounded-[6px] border border-line bg-white md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line bg-surface text-xs font-semibold tracking-[0.08em] text-muted uppercase">
            <tr>
                <th className="w-12 px-3 py-3">#</th>
              <th className="w-12 px-2 py-3">
                <span className="sr-only">Select</span>
              </th>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Phone</th>
              <th className="px-3 py-3">Details</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">When</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const call = telHref(item.phone);
              return (
                <tr key={item.id} className="border-b border-line last:border-b-0">
                  <td className="px-3 py-3 font-semibold text-navy tabular-nums">
                    {index + 1}
                  </td>
                  <td className="px-2 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(item.id)}
                      onChange={() => toggle(item.id)}
                      className="size-5 accent-blue"
                      aria-label={`Select ${item.title}`}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <Link href={item.href} className="font-semibold text-navy">
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-3 py-3 font-semibold text-blue tabular-nums">
                    {call ? <a href={call}>{item.phone}</a> : item.phone}
                  </td>
                  <td className="px-3 py-3 text-muted">{item.detail}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-muted">{item.when}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedItems.length > 0 ? (
        <form
          action={action}
          className="fixed inset-x-3 z-30 flex flex-col gap-3 rounded-[6px] border border-line bg-white p-3 shadow-soft bottom-[calc(4.75rem+env(safe-area-inset-bottom))] lg:left-72 lg:right-6 lg:bottom-4 lg:flex-row lg:items-center"
        >
          <input type="hidden" name="returnTo" value={returnTo} />
          {selectedItems.map((item) => (
            <input key={item.id} type="hidden" name="ids" value={item.id} />
          ))}
          <p className="text-sm font-semibold text-navy">
            {selectedItems.length} selected
          </p>
          <label className="sr-only" htmlFor="bulk-status">
            Status for selected {noun}
          </label>
          <select
            id="bulk-status"
            name="status"
            defaultValue={statuses[0]}
            className="min-h-12 rounded-[6px] border border-line bg-white px-3 text-base text-navy"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button
            type="submit"
            name="intent"
            value="status"
            className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-[6px] bg-blue px-5 text-[0.95rem] font-semibold text-white"
          >
            Update status
          </button>
          <button
            type="submit"
            name="intent"
            value="delete"
            className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-[6px] border border-navy/15 bg-white px-5 text-[0.95rem] font-semibold text-navy"
            onClick={(event) => {
              if (
                !window.confirm(
                  `Delete ${selectedItems.length} ${noun}? This cannot be undone.`,
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            Delete
          </button>
        </form>
      ) : null}
    </div>
  );
}
