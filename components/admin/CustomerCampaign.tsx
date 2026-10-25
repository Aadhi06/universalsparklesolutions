"use client";

import { useMemo, useState } from "react";
import { sendCampaignAction } from "@/app/admin/campaign-actions";

export type CampaignCustomer = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  services: string[];
  locations: string[];
  enquiryCount: number;
  marketing: boolean;
};

export function CustomerCampaign({
  customers,
  services,
}: {
  customers: CampaignCustomer[];
  services: string[];
}) {
  const [service, setService] = useState("All");
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const visible = useMemo(
    () =>
      service === "All"
        ? customers
        : customers.filter((customer) => customer.services.includes(service)),
    [customers, service],
  );
  const selectable = visible.filter((customer) => customer.marketing && customer.email.includes("@"));
  const allSelected =
    selectable.length > 0 && selectable.every((customer) => selected.includes(customer.id));

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function toggleAll() {
    setSelected((current) => {
      const ids = selectable.map((customer) => customer.id);
      if (ids.every((id) => current.includes(id))) {
        return current.filter((id) => !ids.includes(id));
      }
      return [...new Set([...current, ...ids])];
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult("");
    setSending(true);
    const data = new FormData(event.currentTarget);
    selected.forEach((id) => data.append("ids", id));
    const response = await sendCampaignAction(data);
    setSending(false);
    if ("error" in response && response.error) {
      setError(response.error);
      return;
    }
    if ("sent" in response) {
      setResult(
        `Sent ${response.sent}. Failed ${response.failed}. Skipped ${response.skipped} who have unsubscribed or have no email.`,
      );
      setSelected([]);
    }
  }

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <FilterButton label="All" count={customers.length} active={service === "All"} onClick={() => setService("All")} />
        {services.map((item) => (
          <FilterButton
            key={item}
            label={item}
            count={customers.filter((customer) => customer.services.includes(item)).length}
            active={service === item}
            onClick={() => setService(item)}
          />
        ))}
      </div>

      <label className="mt-4 flex min-h-12 items-center gap-3 text-sm font-semibold text-navy">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={toggleAll}
          className="size-5 accent-blue"
          aria-label="Select all customers in this view"
        />
        Select all in this view ({selectable.length})
      </label>

      {visible.length === 0 ? (
        <p className="mt-3 rounded-[6px] border border-line bg-white px-5 py-8 text-body">
          No customers for this service yet. New enquiries are added here automatically.
        </p>
      ) : (
        <>
          <ul className="mt-3 space-y-3 md:hidden">
            {visible.map((customer, index) => (
              <li key={customer.id} className="rounded-[6px] border border-line bg-white p-4">
                <div className="flex items-start gap-3">
                  <span className="w-6 shrink-0 font-semibold text-navy tabular-nums">{index + 1}</span>
                  <input
                    type="checkbox"
                    checked={selected.includes(customer.id)}
                    disabled={!customer.marketing || !customer.email.includes("@")}
                    onChange={() => toggle(customer.id)}
                    className="mt-0.5 size-5 accent-blue"
                    aria-label={`Select ${customer.fullName}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-navy">{customer.fullName}</p>
                    <p className="font-semibold text-blue tabular-nums">{customer.phone}</p>
                    <p className="break-all text-sm text-blue">{customer.email}</p>
                    <p className="mt-1 text-sm text-muted">{customer.services.join(", ")}</p>
                    {!customer.marketing ? (
                      <p className="mt-1 text-xs font-semibold text-navy">Unsubscribed</p>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3 hidden overflow-x-auto rounded-[6px] border border-line bg-white md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-surface text-xs font-semibold tracking-[0.08em] text-muted uppercase">
              <tr>
                <th className="w-12 px-3 py-3">#</th>
                <th className="w-12 px-2 py-3">
                  <span className="sr-only">Select</span>
                </th>
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Phone</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Service</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((customer, index) => (
                <tr key={customer.id} className="border-b border-line last:border-b-0">
                  <td className="px-3 py-3 font-semibold text-navy tabular-nums">
                    {index + 1}
                  </td>
                  <td className="px-2 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(customer.id)}
                      disabled={!customer.marketing || !customer.email.includes("@")}
                      onChange={() => toggle(customer.id)}
                      className="size-5 accent-blue"
                      aria-label={`Select ${customer.fullName}`}
                    />
                  </td>
                  <td className="px-3 py-3 font-semibold text-navy">
                    {customer.fullName}
                    {!customer.marketing ? (
                      <span className="mt-1 block text-xs font-semibold">Unsubscribed</span>
                    ) : null}
                  </td>
                  <td className="px-3 py-3 font-semibold text-blue tabular-nums">{customer.phone}</td>
                  <td className="px-3 py-3 text-blue">{customer.email}</td>
                  <td className="px-3 py-3 text-muted">{customer.services.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-[6px] border border-line bg-white p-5">
        <h2 className="font-display text-xl font-semibold text-navy">Send an offer</h2>
        <p className="text-sm text-body">
          {selected.length} selected. Each email includes your phone number and an unsubscribe link.
        </p>
        <label className="block text-sm font-medium text-navy" htmlFor="subject">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          required
          defaultValue="A cleaning offer from Universal Sparkle Solution"
          className="min-h-12 w-full rounded-[6px] border border-line px-3 text-base text-navy outline-none focus:border-blue"
        />
        <label className="block text-sm font-medium text-navy" htmlFor="offer">
          Discount or offer
        </label>
        <input
          id="offer"
          name="offer"
          placeholder="10% off a first clean this month"
          className="min-h-12 w-full rounded-[6px] border border-line px-3 text-base text-navy outline-none focus:border-blue"
        />
        <label className="block text-sm font-medium text-navy" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell them what is included and how to book."
          className="w-full rounded-[6px] border border-line px-3 py-3 text-base text-navy outline-none focus:border-blue"
        />
        {error ? <p className="text-sm text-navy">{error}</p> : null}
        {result ? <p className="text-sm font-semibold text-navy">{result}</p> : null}
        <button
          type="submit"
          disabled={sending}
          className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-[6px] bg-blue px-5 font-semibold text-white disabled:opacity-60 sm:w-auto"
        >
          {sending ? "Sending…" : "Send offer"}
        </button>
      </form>
    </div>
  );
}

function FilterButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center rounded-full px-4 text-sm font-semibold ${
        active ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-line"
      }`}
    >
      {label} ({count})
    </button>
  );
}
